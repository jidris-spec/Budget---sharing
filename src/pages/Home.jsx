import { useState, useEffect } from "react";
import { calculateBalance } from "../utils/calculateBalance";
import { settleBalances } from "../utils/settleBalances";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseForm from "../components/ExpenseForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");

  const [group, setGroup] = useState(() => {
    try {
      const stored = localStorage.getItem("group");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const stored = localStorage.getItem("expenses");
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(group));
  }, [group]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ✅ Derived data
  const balances = group
    ? calculateBalance(group.members, expenses)
    : null;

  const settlements = balances ? settleBalances(balances) : [];

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const share = group ? total / group.members.length : 0;

  const biggestCreditor = balances
    ? Object.entries(balances).sort((a, b) => b[1] - a[1])[0]
    : null;

  const biggestDebtor = balances
    ? Object.entries(balances).sort((a, b) => a[1] - b[1])[0]
    : null;

  let summaryText = "";

  if (balances) {
    const totalOwed = Object.values(balances)
      .filter((b) => b < 0)
      .reduce((sum, b) => sum + Math.abs(b), 0);

    if (totalOwed === 0) {
      summaryText = "Everyone is settled";
    } else if (biggestDebtor && biggestCreditor) {
      summaryText = `${biggestDebtor[0]} owes the most (RON ${Math.abs(
        biggestDebtor[1]
      ).toFixed(2)})`;
    }
  }

  function handleCreateGroup() {
    const membersArray = members
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    const uniqueMembers = [...new Set(membersArray)];

    if (uniqueMembers.length !== membersArray.length) {
      alert("Duplicate member names are not allowed");
      return;
    }

    if (uniqueMembers.length < 2) {
      alert("At least 2 members required");
      return;
    }

    const newGroup = {
      name: groupName,
      members: uniqueMembers,
    };

    setGroup(newGroup);
    setGroupName("");
    setMembers("");
    setShowForm(false);
  }

  function handleExpenseSubmit(expense) {
    if (editIndex !== null) {
      const updated = expenses.map((e, i) =>
        i === editIndex ? expense : e
      );
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, expense]);
    }

    setShowForm(false);
  }

  function handleDelete(index) {
    setExpenses(expenses.filter((_, i) => i !== index));
  }

  // 🟡 Create Group Screen
  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Create Group</h1>

          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Members (comma separated)"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <button
            onClick={handleCreateGroup}
            className="w-full bg-black text-white py-2 rounded"
          >
            Create Group
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Main App
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Group Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400 uppercase">Group</p>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-gray-400">{group.members.join(", ")}</p>

          {/* ✅ NEW SUMMARY BLOCK */}
          <div className="bg-gray-50 p-3 rounded mt-3">
            <p className="font-semibold">
              Total: RON {Number(total).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Each person should pay: RON {Number(share).toFixed(2)}
            </p>
          </div>
        </div>

        {summaryText && (
          <div className="bg-black text-white p-3 rounded-xl text-sm">
            {summaryText}
          </div>
        )}

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditIndex(null);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>

        {showForm && (
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ExpenseForm
              key={editIndex ?? "new"}
              members={group.members}
              isEditing={editIndex !== null}
              editData={editIndex !== null ? expenses[editIndex] : null}
              onSubmit={handleExpenseSubmit}
            />
          </div>
        )}

        {balances && <BalanceSummary balances={balances} />}

        {/* Expenses */}
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p>No expenses yet</p>
          </div>
        ) : (
          expenses.map((exp, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white px-4 py-3 rounded-xl shadow-sm"
            >
              <div>
                <p className="font-medium">{exp.description}</p>
                <p className="text-xs text-gray-400">
                  Paid by {exp.paidBy}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span>RON {Number(exp.amount).toFixed(2)}</span>

                <button onClick={() => {
                  setEditIndex(i);
                  setShowForm(true);
                }}>
                  Edit
                </button>

                <button onClick={() => handleDelete(i)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Settlements */}
        {settlements.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">Settle Up</h3>
            {settlements.map((s, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{s.from} pays {s.to}</span>
                <span>RON {Number(s.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
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
  const [toast, setToast] = useState(null);

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

  const balances = group ? calculateBalance(group.members, expenses) : null;
  const settlements = balances ? settleBalances(balances) : [];

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
      summaryText = `${biggestDebtor[0]} owes the most ($${Math.abs(
        biggestDebtor[1]
      ).toFixed(2)})`;
    }
  }

  function handleCreateGroup() {
    const membersArray = members
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    if (!groupName.trim() || membersArray.length === 0) return;

    setGroup({ name: groupName.trim(), members: membersArray });
    setGroupName("");
    setMembers("");
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

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md animate-fade-in">
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
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 active:scale-95 transition"
          >
            Create Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
          <p className="text-xs text-gray-400 uppercase">Group</p>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-gray-400">{group.members.join(", ")}</p>
        </div>

        {summaryText && (
          <div className="bg-black text-white p-3 rounded-xl text-sm animate-fade-in">
            {summaryText}
          </div>
        )}

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditIndex(null);
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>

        {showForm && (
          <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
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

        {balances && expenses.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
            <h3 className="font-semibold mb-2">Quick Insights</h3>
            <p className="text-sm text-gray-600">
              {biggestDebtor?.[0]} owes the most, while {biggestCreditor?.[0]} paid the most.
            </p>
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-3xl mb-2">💸</div>
            <p>No expenses yet</p>
          </div>
        ) : (
          expenses.map((exp, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white px-4 py-3 rounded-xl shadow-sm mb-2 animate-fade-in hover:shadow-md transition"
            >
              <div>
                <p className="font-medium">{exp.description}</p>
                <p className="text-xs text-gray-400">
                  Paid by {exp.paidBy}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span>${Number(exp.amount).toFixed(2)}</span>

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

        {settlements.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in">
            <h3 className="font-semibold mb-3">Settle Up</h3>
            {settlements.map((s, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{s.from} → {s.to}</span>
                <span>${s.amount}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
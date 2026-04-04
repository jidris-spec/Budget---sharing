import { useState, useEffect } from "react";
import { calculateBalance } from "../utils/calculateBalance";
import { settleBalances } from "../utils/settleBalances";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseForm from "../components/ExpenseForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Group creation inputs
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

  const balances = group ? calculateBalance(group.members, expenses) : null;
  const settlements = balances ? settleBalances(balances) : [];
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const biggestCreditor = balances
    ? Object.entries(balances).sort((a, b) => b[1] - a[1])[0]
    : null;

  const biggestDebtor = balances
    ? Object.entries(balances).sort((a, b) => a[1] - b[1])[0]
    : null;

  function handleCreateGroup() {
    const membersArray = members
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    if (!groupName.trim() || membersArray.length === 0) {
      alert("Enter a group name and at least one member");
      return;
    }

    setGroup({ name: groupName.trim(), members: membersArray });
    setGroupName("");
    setMembers("");
  }

  function handleExpenseSubmit(expense) {
    if (editIndex !== null) {
      setExpenses(expenses.map((e, i) => (i === editIndex ? expense : e)));
      setEditIndex(null);
    } else {
      setExpenses([...expenses, expense]);
    }
    setShowForm(false);
  }

  function handleDelete(index) {
    setExpenses(expenses.filter((_, i) => i !== index));
  }

  // No group yet — show creation form
  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-bold">SplitFlow</h1>
            <p className="text-gray-500 text-sm mt-1">Create a group to get started</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Group name</label>
            <input
              type="text"
              placeholder="e.g. Beach Trip"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Members <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              placeholder="Alice, Bob, Carol"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <button
            onClick={handleCreateGroup}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition"
          >
            Create Group
          </button>
        </div>
      </div>
    );
  }

  // Group exists — show main app
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SplitFlow</h1>
          <p className="text-gray-500 text-sm">Track shared expenses and balances instantly</p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Delete this group and all expenses?")) {
              setGroup(null);
              setExpenses([]);
            }
          }}
          className="text-sm text-gray-400 hover:text-red-500 transition"
        >
          New group
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="space-y-6">

          {/* GROUP CARD */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{group.members.join(", ")}</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>
          </div>

          {/* QUICK INSIGHT */}
          {balances && expenses.length > 0 && (
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-3">Quick Insight</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">Top payer</p>
                  <p className="font-semibold">{biggestCreditor?.[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Owes most</p>
                  <p className="font-semibold">{biggestDebtor?.[0]}</p>
                </div>
              </div>
            </div>
          )}

          {/* BALANCES */}
          {balances && expenses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <BalanceSummary balances={balances} />
            </div>
          )}

          {/* SETTLEMENTS */}
          {settlements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Who pays who</h2>
              <ul className="space-y-2">
                {settlements.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl"
                  >
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">{s.from}</span> pays{" "}
                      <span className="font-semibold">{s.to}</span>
                    </span>
                    <span className="text-sm font-bold text-amber-700">
                      ${s.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ADD / CLOSE BUTTON */}
          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditIndex(null);
              } else {
                setShowForm(true);
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 active:scale-95 transition"
          >
            {showForm ? "Close" : "+ Add Expense"}
          </button>

          {/* EXPENSE FORM */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <ExpenseForm
                key={editIndex ?? "new"}
                members={group.members}
                isEditing={editIndex !== null}
                editData={editIndex !== null ? expenses[editIndex] : null}
                onSubmit={handleExpenseSubmit}
              />
            </div>
          )}
        </div>

        {/* RIGHT — EXPENSE HISTORY */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Expense History</h2>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-700">No expenses yet</p>
              <p className="text-sm text-gray-500">Add your first expense</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{exp.description}</p>
                    <p className="text-xs text-gray-500">{exp.paidBy}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">${Number(exp.amount).toFixed(2)}</p>
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setShowForm(true);
                      }}
                      className="text-sm text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-sm text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

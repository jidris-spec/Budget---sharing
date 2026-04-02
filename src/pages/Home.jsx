import { useState, useEffect } from "react";
import { calculateBalance } from "../utils/calculateBalance";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseForm from "../components/ExpenseForm";
import { settleBalances } from "../utils/settleBalances";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ Load from localStorage
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    const storedGroup = localStorage.getItem("group");

    if (storedExpenses) {
      try {
        const parsed = JSON.parse(storedExpenses);
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        }
      } catch {}
    }

    if (storedGroup && storedGroup !== "null") {
      try {
        const parsed = JSON.parse(storedGroup);
        if (parsed && Array.isArray(parsed.members)) {
          setGroup(parsed);
        }
      } catch {}
    }
  }, []);

  // ✅ Save expenses
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ✅ Save group
  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(group));
  }, [group]);

  const total = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const share =
    group && group.members.length > 0
      ? total / group.members.length
      : 0;

  function handleCreateGroup() {
    const membersArray = members
      .split(",")
      .map((name) => name.trim());

    const newGroup = {
      name: groupName,
      members: membersArray,
    };

    setGroup(newGroup);
    setGroupName("");
    setMembers("");
    setShowForm(false);
  }

  function handleDelete(indexToRemove) {
    const updated = expenses.filter(
      (_, index) => index !== indexToRemove
    );
    setExpenses(updated);
  }

  function handleEdit(index) {
    setEditIndex(index);
  }

  function handleAddOrEdit(expense) {
    const cleanExpense = {
      ...expense,
      amount: Number(expense.amount),
    };

    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = cleanExpense;

      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, cleanExpense]);
    }
  }

  // ✅ MUST come before transactions
  const balances = group
    ? calculateBalance(group.members, expenses)
    : null;

  const transactions = balances
    ? settleBalances(balances)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Budget Sharing App
      </h1>

      {!showForm && !group && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create Group
        </button>
      )}

      {showForm && (
        <div className="flex flex-col gap-4 bg-white p-6 rounded shadow w-80">
          <input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Members (A,B,C)"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={handleCreateGroup}
            className="bg-green-600 text-white py-2 rounded"
          >
            Create
          </button>
        </div>
      )}

      {group && (
        <div className="bg-white p-4 rounded shadow w-80">
          <h2 className="font-bold">{group.name}</h2>
          <ul>
            {group.members.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {group && expenses.length > 0 && (
        <div className="bg-white p-4 rounded shadow w-80">
          <h3 className="font-bold">Summary</h3>
          <div>Total: ${total}</div>
          <div>Each: ${share.toFixed(2)}</div>
        </div>
      )}

      {group && (
        <ExpenseForm
          members={group.members}
          onAddExpense={handleAddOrEdit}
          editIndex={editIndex}
          editData={
            editIndex !== null ? expenses[editIndex] : null
          }
        />
      )}

      {expenses.length > 0 && (
        <div className="bg-white p-4 rounded shadow w-80">
          <h3 className="font-bold">Expenses</h3>

          {expenses.map((exp, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              <span>
                {exp.title} - ${exp.amount} ({exp.paidBy})
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {balances && <BalanceSummary balances={balances} />}

      {/* ✅ Settlement UI */}
      {transactions.length > 0 && (
        <div className="bg-white p-4 rounded shadow w-80">
          <h3 className="font-bold mb-2">Settlement</h3>

          {transactions.map((t, index) => (
            <div key={index}>
              {t.from} pays {t.to} ${t.amount}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
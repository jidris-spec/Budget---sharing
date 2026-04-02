import { useState, useEffect } from "react";

export default function ExpenseForm({
  members,
  onAddExpense,
  editIndex,
  editData,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  // ✅ Fill form when editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setAmount(editData.amount);
      setPaidBy(editData.paidBy);
    }
  }, [editData]);

  function handleSubmit() {
    if (!title || !amount || !paidBy) return;

    const newExpense = {
      title,
      amount: Number(amount),
      paidBy,
    };

    onAddExpense(newExpense);

    setTitle("");
    setAmount("");
    setPaidBy("");
  }

  return (
    <div className="flex flex-col gap-4 w-80">
      <h3 className="font-bold">
        {editIndex !== null ? "Edit Expense" : "Add Expense"}
      </h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2"
      />

      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        className="border p-2"
      >
        <option value="">Select payer</option>
        {members.map((m, i) => (
          <option key={i} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white py-2"
      >
        {editIndex !== null ? "Update Expense" : "Add Expense"}
      </button>
    </div>
  );
}
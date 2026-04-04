import { useState } from "react";

export default function ExpenseForm({ members, onSubmit, editData, isEditing }) {
  const [description, setDescription] = useState(editData?.description ?? "");
  const [amount, setAmount] = useState(editData?.amount ?? "");
  const [paidBy, setPaidBy] = useState(editData?.paidBy ?? members[0]);

  const isValid = description.trim() !== "" && Number(amount) > 0 && paidBy;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ description, amount: Number(amount), paidBy });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">
        {isEditing ? "Edit Expense" : "Add Expense"}
      </h2>

      <div>
        <label className="text-sm text-gray-600">Description</label>
        <input
          type="text"
          placeholder="e.g. Dinner, Transport..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Amount</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Paid by</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          {members.map((member) => (
            <option key={member}>{member}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-3 rounded-xl font-medium transition ${
          isValid
            ? "bg-black text-white hover:opacity-90 active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isEditing ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}

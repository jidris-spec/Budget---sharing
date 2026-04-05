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
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {isEditing ? "Edit Expense" : "New Expense"}
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
        <input
          type="text"
          placeholder="Dinner, Taxi, Hotel..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-sm transition"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
            $
          </span>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-7 pr-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-sm transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Paid by</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-sm transition bg-white"
        >
          {members.map((member) => (
            <option key={member}>{member}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isValid
            ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isEditing ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}

import { useState, useEffect } from "react";
import { calculateBalance } from "../utils/calculateBalance";
import { settleBalances } from "../utils/settleBalances";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseForm from "../components/ExpenseForm";

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ name, size = "w-8 h-8 text-xs" }) {
  return (
    <div
      className={`${size} shrink-0 rounded-full flex items-center justify-center font-semibold ring-2 ring-white dark:ring-gray-900 ${avatarColor(
        name
      )}`}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconPencil(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function IconReceipt(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 3h16v18l-3-2-2 2-2-2-2 2-2-2-2 2-3-2Z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function IconSplit(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 8h6l3 4 3-4h6" />
      <path d="M16 5l3 3-3 3" />
      <path d="M8 13l-3 3 3 3" />
    </svg>
  );
}

function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
    </button>
  );
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");

  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

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
      summaryText = `${biggestDebtor[0]} owes the most ($${Math.abs(
        biggestDebtor[1]
      ).toFixed(2)})`;
    }
  }

  const canCreateGroup = groupName.trim() !== "" && members.trim() !== "";

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

  // Create Group Screen
  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex justify-end mb-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center mb-4 shadow-lg shadow-black/10">
              <IconSplit className="w-7 h-7 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">SplitFlow</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Split expenses. Settle up. Stay friends.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 p-7">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">Create a group</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Name your group and add who's splitting</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Group name</label>
                <input
                  type="text"
                  placeholder="Weekend Trip, Roommates..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:border-black dark:focus:border-white text-sm transition bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Members</label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Sam, Jordan"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:border-black dark:focus:border-white text-sm transition bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Separate names with commas</p>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!canCreateGroup}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
                  canCreateGroup
                    ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                }`}
              >
                Create Group
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <IconSplit className="w-4 h-4 text-white dark:text-gray-900" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-50 tracking-tight">SplitFlow</span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Group Header */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Group</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{group.name}</h1>
            </div>

            <div className="flex -space-x-2">
              {group.members.slice(0, 6).map((m) => (
                <Avatar key={m} name={m} />
              ))}
              {group.members.length > 6 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-semibold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  +{group.members.length - 6}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Total spent</p>
              <p className="font-bold text-lg text-gray-900 dark:text-gray-50">${Number(total).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Per person</p>
              <p className="font-bold text-lg text-gray-900 dark:text-gray-50">${Number(share).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Settlements */}
        {settlements.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in">
            <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">Who pays who</h3>
            <div className="space-y-3">
              {settlements.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.from} size="w-7 h-7 text-[11px]" />
                    <IconArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
                    <Avatar name={s.to} size="w-7 h-7 text-[11px]" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{s.from}</span> pays <span className="font-medium text-gray-900 dark:text-gray-100">{s.to}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">${Number(s.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {summaryText && (
          <div className="bg-black dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 animate-fade-in">
            <IconSplit className="w-4 h-4 shrink-0" />
            {summaryText}
          </div>
        )}

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditIndex(null);
          }}
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <IconPlus className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in">
            <ExpenseForm
              key={editIndex ?? "new"}
              members={group.members}
              isEditing={editIndex !== null}
              editData={editIndex !== null ? expenses[editIndex] : null}
              onSubmit={handleExpenseSubmit}
            />
          </div>
        )}

        {balances && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800">
            <BalanceSummary balances={balances} />
          </div>
        )}

        {/* Expenses */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1">Expenses</h3>

          {expenses.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-12 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3">
                <IconReceipt className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No expenses yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Add your first expense to get started</p>
            </div>
          ) : (
            expenses.map((exp, i) => (
              <div
                key={i}
                className="group flex justify-between items-center bg-white dark:bg-gray-900 px-4 py-3.5 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={exp.paidBy} />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{exp.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Paid by {exp.paidBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-gray-900 dark:text-gray-50">${Number(exp.amount).toFixed(2)}</span>

                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditIndex(i);
                        setShowForm(true);
                      }}
                      aria-label="Edit expense"
                      className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <IconPencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(i)}
                      aria-label="Delete expense"
                      className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

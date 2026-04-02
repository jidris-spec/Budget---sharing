export function calculateBalance(members, expenses) {
  // Step 1: initialize balances
  const balances = {};

  members.forEach((member) => {
    balances[member] = 0;
  });

  // Step 2: calculate total expense
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 3: calculate equal share
  const share = total / members.length;

  // Step 4: add payments
  expenses.forEach((exp) => {
    balances[exp.paidBy] += exp.amount;
  });

  // Step 5: subtract share
  members.forEach((member) => {
    balances[member] -= share;
  });

  return balances;
}
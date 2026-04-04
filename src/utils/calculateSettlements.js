export function calculateSettlements(balances) {
  const creditors = [];
  const debtors = [];

  // Step 1: split into two groups
  for (const [name, balance] of Object.entries(balances)) {
    if (balance > 0) {
      creditors.push({ name, amount: balance });
    } else if (balance < 0) {
      debtors.push({ name, amount: -balance }); // make positive
    }
  }

  const settlements = [];

  let i = 0; // debtor index
  let j = 0; // creditor index

  // Step 2: match them
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const payment = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: payment,
    });

    debtor.amount -= payment;
    creditor.amount -= payment;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return settlements;
}
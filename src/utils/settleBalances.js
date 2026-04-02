export function settleBalances(balances) {
  const owes = [];
  const receives = [];

  // separate people
  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < 0) {
      owes.push({ person, amount: -balance });
    } else if (balance > 0) {
      receives.push({ person, amount: balance });
    }
  });

  const transactions = [];

  // match them
  let i = 0;
  let j = 0;

  while (i < owes.length && j < receives.length) {
    const owe = owes[i];
    const receive = receives[j];

    const amount = Math.min(owe.amount, receive.amount);

    transactions.push({
      from: owe.person,
      to: receive.person,
      amount,
    });

    owe.amount -= amount;
    receive.amount -= amount;

    if (owe.amount === 0) i++;
    if (receive.amount === 0) j++;
  }

  return transactions;
}
export default function BalanceSummary({ balances }) {
  if (!balances || Object.keys(balances).length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No balances yet
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow w-80">
      <h3 className="font-bold mb-2">Balances</h3>

      {Object.entries(balances).map(([person, balance]) => {
        if (balance > 0) {
          return (
            <div key={person} className="text-green-600">
              {person} should receive ${balance}
            </div>
          );
        } else if (balance < 0) {
          return (
            <div key={person} className="text-red-600">
              {person} owes ${Math.abs(balance)}
            </div>
          );
        } else {
          return (
            <div key={person} className="text-gray-600">
              {person} is settled
            </div>
          );
        }
      })}
    </div>
  );
}
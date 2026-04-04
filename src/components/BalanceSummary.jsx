export default function BalanceSummary({ balances }) {
  if (!balances || Object.keys(balances).length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No balances yet
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Who owes what
      </h2>

      <div className="space-y-3">
        {Object.entries(balances).map(([person, balance]) => {
          const isPositive = balance > 0;
          const isNegative = balance < 0;

          return (
            <div
              key={person}
              className="flex justify-between items-center p-3 rounded-lg border"
            >
              <p className="font-medium">{person}</p>

              {isPositive && (
                <p className="text-green-600 font-semibold">
                  +${balance}
                </p>
              )}

              {isNegative && (
                <p className="text-red-600 font-semibold">
                  -${Math.abs(balance)}
                </p>
              )}

              {!isPositive && !isNegative && (
                <p className="text-gray-400 text-sm">
                  settled
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
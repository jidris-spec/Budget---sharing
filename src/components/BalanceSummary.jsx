export default function BalanceSummary({ balances }) {
  if (!balances || Object.keys(balances).length === 0) {
    return (
      <div className="text-center text-gray-400 py-6 text-sm">No balances yet</div>
    );
  }

  const max = Math.max(...Object.values(balances).map(Math.abs), 1);

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Balances</p>
      <div className="space-y-4">
        {Object.entries(balances).map(([person, balance]) => {
          const isPositive = balance > 0;
          const isNegative = balance < 0;
          const pct = Math.round((Math.abs(balance) / max) * 100);

          return (
            <div key={person}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                    {person[0].toUpperCase()}
                  </div>
                  <p className="font-medium text-sm text-gray-900">{person}</p>
                </div>
                      {isPositive && (
                        <p className="text-green-600 font-bold text-sm">
                          +${balance.toFixed(2)} <span className="text-xs font-normal">to receive</span>
                        </p>
                      )}
                      {isNegative && (
                          <p className="text-red-500 font-bold text-sm">
                            -${Math.abs(balance).toFixed(2)} <span className="text-xs font-normal">owes</span>
                          </p>
                        )}
                {!isPositive && !isNegative && (
                  <p className="text-gray-400 text-xs font-medium">Settled ✓</p>
                )}
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive ? "bg-green-400" : isNegative ? "bg-red-400" : "bg-gray-300"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
          
        })}
      </div>
    </div>
  );
}

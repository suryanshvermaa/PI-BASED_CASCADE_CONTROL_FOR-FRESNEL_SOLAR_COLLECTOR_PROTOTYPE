import { formatNumber } from '../../utils/formatters';

const COLUMNS = [
  { key: 'time', label: 'Time', align: 'left' },
  { key: 'inletTemp', label: 'Inlet (°C)', align: 'right', decimals: 1 },
  { key: 'outletTemp', label: 'Outlet (°C)', align: 'right', decimals: 1 },
  { key: 'deltaTemp', label: 'ΔTemp (°C)', align: 'right', decimals: 1 },
  { key: 'flowRate', label: 'Flow (L/min)', align: 'right', decimals: 2 },
  { key: 'pwm', label: 'PWM', align: 'right', decimals: 0 },
];

function DeltaTempCell({ value }) {
  const num = Number(value);
  if (!Number.isFinite(num)) return <span className="text-text-muted">--</span>;
  const color = num >= 10 ? 'text-danger' : num <= 3 ? 'text-success' : 'text-warning';
  return <span className={`font-medium ${color}`}>{num.toFixed(1)}</span>;
}

/**
 * DataTable — shows rolling history of sensor readings.
 * Displays most-recent first with DeltaTemp color coding.
 */
export default function DataTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Historical Readings</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="h-10 w-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
            <span className="text-lg">📊</span>
          </div>
          <p className="text-sm text-text-muted">No data yet</p>
          <p className="text-xs text-text-muted mt-1">Sensor readings will appear here</p>
        </div>
      </div>
    );
  }

  const reversed = [...history].reverse();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">Historical Readings</h2>
        <span className="text-xs text-text-muted">{history.length} entries</span>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`
                    pb-2.5 font-medium text-text-muted uppercase tracking-wider
                    ${col.align === 'right' ? 'text-right' : 'text-left'}
                    px-2 first:pl-0 last:pr-0
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {reversed.slice(0, 20).map((row, i) => (
              <tr
                key={i}
                className="hover:bg-white/[0.02] transition-colors duration-100 group"
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      py-2 px-2 first:pl-0 last:pr-0
                      ${col.align === 'right' ? 'text-right' : 'text-left'}
                      ${i === 0 ? 'font-medium' : ''}
                    `}
                  >
                    {col.key === 'deltaTemp' ? (
                      <DeltaTempCell value={row[col.key]} />
                    ) : col.key === 'time' ? (
                      <span className="font-mono text-text-secondary">{row[col.key]}</span>
                    ) : (
                      <span className="text-text-secondary tabular-nums">
                        {formatNumber(row[col.key], col.decimals ?? 1)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

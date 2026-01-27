import type { DashboardTableProps } from "../../../types/types";


export const DashboardTable = <T extends Record<string, any>>({
  columns,
  data,
  title,
}: DashboardTableProps<T>) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {title && (
        <h2 className="text-xl font-bold text-primaryText mb-4">
          {title}
        </h2>
      )}

      <div className="overflow-hidden rounded-xl border border-primaryBorder shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-primaryBorder">
            <thead>
              <tr className="bg-background">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-sm font-semibold text-primaryText"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primaryBorder bg-white">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-background/50 transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-6 py-4 text-sm text-primaryText"
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};
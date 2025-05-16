import React, { useState, useEffect } from "react";

const GoalSummary = ({ data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.pendingGoals && data.completeGoals) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const TableComponent = ({ title, goals, type }) => (
    <div className="w-full lg:w-[50%] mb-6 lg:mb-0">
      <h3 className="mb-5 text-[16px] md:text-[18px] font-semibold leading-[24px] px-4">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goals.length > 0 ? (
                  goals.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.title}
                        {/* Mobile-only description */}
                        <div className="md:hidden text-xs text-gray-500 mt-1">
                          {item.description}
                        </div>
                        {/* Mobile-only date */}
                        <div className="md:hidden text-xs text-gray-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {item.amount.toFixed(2)}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                      No {type} Goals available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col lg:flex-row lg:gap-6">
        <TableComponent
          title="Latest Pending Goals"
          goals={data.pendingGoals}
          type="Pending"
        />
        <TableComponent
          title="Latest Completed Goals"
          goals={data.completeGoals}
          type="Completed"
        />
      </div>
    </div>
  );
};

export default GoalSummary;
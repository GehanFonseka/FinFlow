import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "./../../assets/images/print_logo.png";

const MonthlyIncomeReport = ({ data, date }) => {
  const componentRef = useRef();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const formatDateTime = () => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
      return `Generated ${formattedDate} at ${formattedTime}`;
    };
    setCurrentDateTime(formatDateTime());
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print Preview",
  });

  const totalIncome = data?.reduce((sum, item) => sum + (item?.amount || 0), 0);

  return (
    <div>
      <div ref={componentRef} className="print-content p-3 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
          <img src={logo} alt="brand" className="w-[150px] sm:w-[200px]" />
          <div className="text-left sm:text-right">
            <div className="text-[20px] sm:text-[25px] font-[600]">
              Monthly Income Report
            </div>
            <div className="text-[14px] sm:text-[16px] font-semibold">{date}</div>
            <div className="text-[12px] sm:text-[14px]">{currentDateTime}</div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 sm:mt-8 text-[14px] sm:text-[16px] font-semibold">
          Total Monthly Income: Rs.{totalIncome?.toFixed(2)}
        </div>

        {/* Table Section */}
        <div className="relative mt-4 sm:mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                  Title
                </th>
                <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                  Description
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                  Amount
                </th>
                <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium text-gray-900">
                      {item.title}
                      {/* Mobile-only info */}
                      <div className="sm:hidden space-y-1 mt-1 text-xs text-gray-500">
                        <div>{item.description}</div>
                        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm text-[#25C935] font-semibold whitespace-nowrap">
                      Rs. {item.amount?.toFixed(2)}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                    No income records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-4 sm:mt-6 px-3 sm:px-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto rounded-full border-2 border-[#25C935] bg-[#7fff8c] px-4 sm:px-5 py-2 text-[14px] font-bold hover:bg-[#6ce979] transition-colors"
        >
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default MonthlyIncomeReport;

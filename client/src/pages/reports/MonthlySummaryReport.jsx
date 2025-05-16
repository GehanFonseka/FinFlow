import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "./../../assets/images/print_logo.png";

const MonthlySummaryReport = ({ data, date }) => {
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

  return (
    <div>
      <div ref={componentRef} className="print-content p-3 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
          <img src={logo} alt="brand" className="w-[150px] sm:w-[200px]" />
          <div className="text-left sm:text-right">
            <div className="text-[20px] sm:text-[25px] font-[600]">
              Monthly Summary Report
            </div>
            <div className="text-[14px] sm:text-[16px] font-semibold">{date}</div>
            <div className="text-[12px] sm:text-[14px]">{currentDateTime}</div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="mt-6 sm:mt-8 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-gray-100">
              {/* Total Saving Row */}
              <tr className="border-b border-gray-200">
                <th scope="row" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-extrabold text-gray-700 whitespace-nowrap">
                  Total Saving
                </th>
                <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-900">
                  Rs. {data?.summary?.[0]?.totalSaving 
                    ? parseFloat(data.summary[0].totalSaving).toFixed(2) 
                    : "0.00"}
                </td>
              </tr>

              {/* Month Total Income Row */}
              <tr className="border-b border-gray-200">
                <th scope="row" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-extrabold text-gray-700 whitespace-nowrap">
                  Month Total Income
                </th>
                <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-[#25C935]">
                  Rs. {data?.summary?.[0]?.totalIncome 
                    ? parseFloat(data.summary[0].totalIncome).toFixed(2) 
                    : "0.00"}
                </td>
              </tr>

              {/* Month Total Expense Row */}
              <tr className="border-b border-gray-200">
                <th scope="row" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-extrabold text-gray-700 whitespace-nowrap">
                  Month Total Expense
                </th>
                <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-red-600">
                  Rs. {data?.summary?.[0]?.totalExpense 
                    ? parseFloat(data.summary[0].totalExpense).toFixed(2) 
                    : "0.00"}
                </td>
              </tr>

              {/* Month Total Saving Row */}
              <tr>
                <th scope="row" className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-extrabold text-gray-700 whitespace-nowrap">
                  Month Total Saving
                </th>
                <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-[#25C935]">
                  Rs. {data?.summary?.[0]?.totalExpense && data?.summary?.[0]?.totalIncome
                    ? (parseFloat(data.summary[0].totalIncome) - parseFloat(data.summary[0].totalExpense)).toFixed(2)
                    : "0.00"}
                </td>
              </tr>
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

export default MonthlySummaryReport;

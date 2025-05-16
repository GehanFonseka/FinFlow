import React, { useState, useEffect } from "react";
import MonthlySummaryReport from "./MonthlySummaryReport";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import GoalReport from "./GoalReport";
import MonthlyBudgetReport from "./MonthlyBudgetReport";
import MonthlyExpenseReport from "./MonthlyExpenseReport";
import MonthlyIncomeReport from "./MonthlyIncomeReport";

const Report = () => {
  const { user } = useStateContext();
  const userId = user.id;

  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return { year, month };
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
  };

  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const { year, month } = getCurrentMonth();
    setSelectedYear(year);
    setSelectedMonth(month);
    setCurrentMonth(`${year}-${month}`);
  }, []);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setCurrentMonth(newMonth);
    const [year, month] = newMonth.split("-");
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const fetchReportData = async () => {
    try {
      const response = await axiosClient.get(
        `/report/${userId}/${selectedYear}/${selectedMonth}`,
      );
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch report data");
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [userId, selectedYear, selectedMonth]);

  let date = selectedYear +" "+ getMonthName(selectedMonth);
  console.log(date)
  return (
    <div className="bg-white p-4 sm:p-5">
      {/* Header with Year-Month */}
      <div className="text-[18px] sm:text-[20px] font-semibold break-words">
        {selectedYear} {getMonthName(selectedMonth)} Reports
      </div>

      {/* Month Picker */}
      <div className="mt-6 sm:mt-10">
        <input
          type="month"
          value={selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : currentMonth}
          onChange={handleMonthChange}
          className="w-full sm:w-auto rounded-md border-2 border-gray-400 px-3 py-2 text-[13px] focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-5 mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-5">
        {[
          { key: "summary", label: "Monthly Summary" },
          { key: "income", label: "Income Report" },
          { key: "expense", label: "Expense Report" },
          { key: "budget", label: "Budget Report" },
          { key: "goal", label: "Goal Report" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-3 py-2 text-sm sm:text-base font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-[#25C935] text-white shadow-md hover:bg-[#1ea32b]"
                : "border-2 border-[#25C935] bg-white text-black hover:bg-gray-50"
            } min-w-[120px] sm:min-w-fit`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="mt-6 sm:mt-8">
        {activeTab === "summary" && (
          <div className="overflow-x-auto">
            <MonthlySummaryReport data={data} date={date} />
          </div>
        )}
        {activeTab === "income" && (
          <div className="overflow-x-auto">
            <MonthlyIncomeReport 
              data={data.incomes} 
              date={date}
            />
          </div>
        )}
        {activeTab === "expense" && (
          <div className="overflow-x-auto">
            <MonthlyExpenseReport
              data={data.expenses}
              date={date}
            />
          </div>
        )}
        {activeTab === "budget" && (
          <div className="overflow-x-auto">
            <MonthlyBudgetReport
              data={data.budgetsWithUsedAmount}
              saving={data.summary[0].totalSaving}
              date={date}
            />
          </div>
        )}
        {activeTab === "goal" && (
          <div className="overflow-x-auto">
            <GoalReport
              date={date}
              data={data.goals}
              saving={data.summary[0].totalSaving}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;

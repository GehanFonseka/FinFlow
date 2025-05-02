import React, { useState } from "react";
import { ExpenseIcon, IncomeIcon, SavingIcon, WalletIcon } from "../../utils/icons";
import getFinancialAdvice from "../../utils/getFinancialAdvice";

const Summary = ({ data }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFinancialAdvice = async () => {
    setLoading(true);
    try {
      const advice = await getFinancialAdvice(
        data.totalSaving || 0,
        data.totalExpense || 0,
        data.totalIncome || 0,
        data.pendingGoals || "No pending goals"
      );
      setAdvice(advice);
    } catch (error) {
      setAdvice("Unable to fetch financial advice at the moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Financial Summary Cards */}
      <div className="flex gap-10">
        {/* Total Saving */}
        <div className="h-auto w-1/4 border-2 border-black bg-black p-4">
          <div className="px-2 py-1 bg-green-800 w-[45px] rounded-full mb-4">
            <WalletIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-300">
            Current Total Saving
          </div>
          <div className="pt-1 text-[20px] font-extrabold uppercase text-white">
            Rs.{parseFloat(data.totalSaving || 0).toFixed(2)}
          </div>
        </div>

        {/* Month Saving */}
        <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <SavingIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Saving
          </div>
          <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
            Rs.{((parseFloat(data.totalIncome || 0)) - (parseFloat(data.totalExpense || 0))).toFixed(2)}
          </div>
        </div>

        {/* Total Income */}
        <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <IncomeIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Total Income
          </div>
          <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
            Rs.{parseFloat(data.totalIncome || 0).toFixed(2)}
          </div>
        </div>

        {/* Total Expense */}
        <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <ExpenseIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Total Expense
          </div>
          <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
            Rs.{parseFloat(data.totalExpense || 0).toFixed(2)}
          </div>
        </div>
      </div>

{/* Financial Advice Section */}
<div className="mt-10 relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
  {/* Glass effect background */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-white/60 backdrop-blur-sm z-0"></div>
  
  {/* Content container */}
  <div className="relative z-10">
    <div className="flex items-center gap-4 mb-6">
      {/* Icon container with 3D effect */}
      <div className="relative p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6">
        <div className="absolute inset-0 bg-blue-600 rounded-2xl transform -rotate-3 opacity-75 blur-sm"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative h-8 w-8 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Smart Financial Advice
      </h2>
    </div>

    {/* Advice content with glass morphism */}
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100">
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">
            Analyzing your financial data...
          </p>
        </div>
      ) : (
        <p className="text-gray-800 text-lg leading-relaxed">
          {advice || "Get personalized AI-powered insights to optimize your financial performance."}
        </p>
      )}
    </div>

    {/* Modern 3D button */}
    <button
      onClick={fetchFinancialAdvice}
      className="group mt-6 relative inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)] active:translate-y-[1px]"
    >
      <span>Get Financial Advice</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 7l5 5m0 0l-5 5m5-5H6" 
        />
      </svg>
      {/* Button highlight effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
  </div>
</div>
    </div>
    );
};

export default Summary;

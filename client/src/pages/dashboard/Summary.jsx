import React, { useState, useRef } from "react";
import { ExpenseIcon, IncomeIcon, SavingIcon, WalletIcon } from "../../utils/icons";
import getFinancialAdvice from "../../utils/getFinancialAdvice";

const Summary = ({ data }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  // Professional Text-to-Speech handler
  const speakAdvice = () => {
    if (!advice) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const synth = window.speechSynthesis;
    const utterance = new window.SpeechSynthesisUtterance(advice);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = synth.getVoices();
    const preferredVoice = voices.find(
      v =>
        (v.name && v.name.toLowerCase().includes("english")) &&
        (v.name.toLowerCase().includes("professional") ||
         v.name.toLowerCase().includes("female") ||
         v.name.toLowerCase().includes("male") ||
         v.name.toLowerCase().includes("us"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const fetchFinancialAdvice = async () => {
    setLoading(true);
    try {
      const advice = await getFinancialAdvice(
        data.totalSaving || 0,
        data.totalExpense || 0,
        data.totalIncome || 0,
        data.pendingGoals || [],
        data.budgets || [],
        data.expenses || [],
        data.incomes || [],
        data.totalSaving || 0,
        data.totalRemainingAmount || 0
      );
      setAdvice(advice);
    } catch (error) {
      setAdvice("Unable to fetch financial advice at the moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-0">
      {/* Financial Summary Cards */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:flex md:flex-row md:gap-6 lg:gap-10">
        {/* Total Saving */}
        <div className="w-full md:w-1/4 border-2 border-black bg-black p-4 rounded-xl">
          <div className="px-2 py-1 bg-green-800 w-[45px] rounded-full mb-4">
            <WalletIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-300">
            Current Total Saving
          </div>
          <div className="pt-1 text-[18px] md:text-[20px] font-extrabold uppercase text-white">
            Rs.{parseFloat(data.totalSaving || 0).toFixed(2)}
          </div>
        </div>

        {/* Month Saving */}
        <div className="w-full md:w-1/4 border-2 border-white bg-white p-4 rounded-xl">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <SavingIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Saving
          </div>
          <div className="pt-1 text-[18px] md:text-[20px] font-extrabold uppercase text-black">
            Rs.{((parseFloat(data.totalIncome || 0)) - (parseFloat(data.totalExpense || 0))).toFixed(2)}
          </div>
        </div>

        {/* Total Income */}
        <div className="w-full md:w-1/4 border-2 border-white bg-white p-4 rounded-xl">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <IncomeIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Total Income
          </div>
          <div className="pt-1 text-[18px] md:text-[20px] font-extrabold uppercase text-black">
            Rs.{parseFloat(data.totalIncome || 0).toFixed(2)}
          </div>
        </div>

        {/* Total Expense */}
        <div className="w-full md:w-1/4 border-2 border-white bg-white p-4 rounded-xl">
          <div className="px-2 py-1 bg-gray-200 w-[45px] rounded-full mb-4">
            <ExpenseIcon />
          </div>
          <div className="text-[13px] font-bold uppercase text-gray-700">
            Month Total Expense
          </div>
          <div className="pt-1 text-[18px] md:text-[20px] font-extrabold uppercase text-black">
            Rs.{parseFloat(data.totalExpense || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* 2050-Style Modern Financial Advice Section */}
      <section className="mt-6 md:mt-10 relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-blue-200 bg-gradient-to-br from-[#e0e7ff] via-white to-[#f0f9ff] shadow-xl md:shadow-2xl p-6 md:p-10 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] futuristic-glow">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-white/80 backdrop-blur-2xl z-0"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-5 mb-6 md:mb-8">
            <div className="p-3 md:p-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl futuristic-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-10 md:w-10 text-white"
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
            <h2 className="text-2xl md:text-3xl text-center sm:text-left font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400 tracking-tight drop-shadow futuristic-font">
              Smart Financial Advice
              <span className="text-[16px] md:text-[18px] font-normal text-blue-400 ml-2"></span>
            </h2>
          </div>

          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-inner border border-blue-100 min-h-[140px] futuristic-panel">
            {loading ? (
              <div className="flex items-center gap-3 md:gap-4">
                <div className="animate-spin h-6 w-6 md:h-7 md:w-7 rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-700 font-semibold text-base md:text-lg">
                  Analyzing your financial data...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {advice
                  ? advice.split("\n").map((line, idx) =>
                      line.trim() ? (
                        <p key={idx} className="text-gray-900 text-base md:text-lg leading-relaxed futuristic-text">
                          {line}
                        </p>
                      ) : null
                    )
                  : (
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      Get personalized AI-powered insights to optimize your financial performance.
                    </p>
                  )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-6 md:mt-8">
            <button
              onClick={fetchFinancialAdvice}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-700 to-cyan-500 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl futuristic-btn disabled:opacity-50"
              disabled={loading}
            >
              <span>Get Financial Advice</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 transform transition-transform group-hover:translate-x-1"
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
            </button>
            {!isSpeaking ? (
              <button
                onClick={speakAdvice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-100 text-blue-700 font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl border border-cyan-300 hover:bg-cyan-200 transition-all duration-200 futuristic-btn disabled:opacity-50"
                disabled={!advice}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5v14m-7-7h14" />
                </svg>
                Listen Advice
              </button>
            ) : (
              <button
                onClick={stopSpeaking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl border border-red-300 hover:bg-red-200 transition-all duration-200 futuristic-btn"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Stop Listening
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Summary;

import axiosClient from "../../axios-client";

const getFinancialAdvice = async (totalBudget, totalExpense, totalIncome, pendingGoals, budgets, expenses, incomes, totalSaving, totalRemainingAmount) => {
  try {
    // Ensure all values are defined with defaults
    const payload = {
      totalBudget: totalBudget || 0,
      totalExpense: totalExpense || 0,
      totalIncome: totalIncome || 0,
      pendingGoals: pendingGoals || [],
      budgets: budgets || [],
      expenses: expenses || [],
      incomes: incomes || [],
      totalSaving: totalSaving || 0,
      totalRemainingAmount: totalRemainingAmount || 0
    };

    // Use axiosClient so baseURL and CORS settings are respected
    const res = await axiosClient.post("/advice", payload);

    return res.data?.advice;
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    throw new Error('Failed to fetch financial advice');
  }
};

export default getFinancialAdvice;

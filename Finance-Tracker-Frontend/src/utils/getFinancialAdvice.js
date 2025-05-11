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

    const res = await fetch('http://localhost:5000/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.advice;
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    throw new Error('Failed to fetch financial advice');
  }
};

export default getFinancialAdvice;

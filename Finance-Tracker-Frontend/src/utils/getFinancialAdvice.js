const getFinancialAdvice = async (totalBudget, totalExpense, totalIncome, pendingGoals) => {
    try {
      const res = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalBudget, totalExpense, totalIncome, pendingGoals }),
      });
  
      const data = await res.json();
      return data.advice;
    } catch (error) {
      console.error('Error fetching financial advice:', error);
      throw new Error('Failed to fetch financial advice');
    }
  };
  
  export default getFinancialAdvice;
  
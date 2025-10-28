const axios = require("axios");

const makeRequestWithRetry = async (prompt, retries = 3, delay = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await axios.post(
        "https://finflow-proxy-dsf7bqbne3f3f3fe.uaenorth-01.azurewebsites.net/openai",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3002",
            "X-Title": "FinFlow AI Advice"
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`Rate limit hit. Retrying in ${delay}ms...`);
        attempt++;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("OpenRouter Error:", error.response ? error.response.data : error.message);
        throw error;
      }
    }
  }

  throw new Error("Exceeded retry attempts. Try again later.");
};

const getFinancialAdvice = async (req, res) => {
  const { 
    totalBudget = 0, 
    totalExpense = 0, 
    totalIncome = 0, 
    pendingGoals = [],
    budgets = [], 
    expenses = [], 
    incomes = [], 
    totalSaving = 0,
    totalRemainingAmount = 0
  } = req.body;

  try {
    // Calculate spending patterns if expenses exist
    const categorySpending = {};
    if (expenses && expenses.length > 0) {
      expenses.forEach(expense => {
        if (!categorySpending[expense.budgetId]) {
          categorySpending[expense.budgetId] = 0;
        }
        categorySpending[expense.budgetId] += expense.amount;
      });
    }

    // Calculate budget utilization if budgets exist
    const budgetUtilization = budgets && budgets.length > 0 ? budgets.map(budget => ({
      category: budget.budgetName || 'Uncategorized',
      allocated: budget.price || 0,
      used: categorySpending[budget._id] || 0,
      remaining: (budget.price || 0) - (categorySpending[budget._id] || 0)
    })) : [];

    // Identify overspent categories
    const overspentCategories = budgetUtilization
      .filter(b => b.used > b.allocated)
      .map(b => b.category);

    // Calculate monthly savings potential
    const monthlySavingsPotential = totalIncome - totalExpense;

    // Generate detailed prompt
    const prompt = `
      As a financial advisor, analyze the following user's financial data and provide personalized, actionable recommendations. 
      Compare all values and highlight strengths, weaknesses, and opportunities for improvement.

      --- USER FINANCIAL DETAILS ---
      • Total Budget: Rs.${totalBudget}
      • Total Remaining Amount: Rs.${totalRemainingAmount}
      • Total Income: Rs.${totalIncome}
      • Total Expenses: Rs.${totalExpense}
      • Current Savings: Rs.${totalSaving}

      ${budgets && budgets.length > 0 ? `
      --- BUDGET BREAKDOWN ---
      ${budgetUtilization.map(b => 
        `• ${b.category}: Rs.${b.allocated} allocated | Rs.${b.used} used (${Math.round((b.used/b.allocated)*100)}%) | Rs.${b.remaining} left`
      ).join('\n')}
      ` : ''}

      ${incomes && incomes.length > 0 ? `
      --- INCOME SOURCES ---
      ${incomes.map(i => `• ${i.title || 'Untitled'}: Rs.${i.amount || 0}`).join('\n')}
      ` : ''}

      ${expenses && expenses.length > 0 ? `
      --- EXPENSES ---
      ${expenses.map(e => `• ${e.title || 'Untitled'}: Rs.${e.amount || 0}`).join('\n')}
      ` : ''}

      --- SAVINGS & GOALS ---
      • Monthly Savings Potential: Rs.${totalIncome - totalExpense}
      ${pendingGoals && pendingGoals.length > 0 ? `
      Pending Goals:
      ${pendingGoals.map(goal => `• ${goal.title || 'Unnamed Goal'}: Rs.${goal.targetAmount || goal.amount || 0}`).join('\n')}
      ` : 'No pending financial goals.'}

      --- ANALYSIS & RECOMMENDATIONS ---
      Please compare all the above details and provide advice in the following format, starting each section on a new line:

      
      1. Expense & Income Analysis: [One sentence comparing income and expenses, highlighting any issues or strengths.]
      2. Savings & Goals: [One sentence about savings and pending goals, with a practical tip.]
      3. Next Steps: [Bullet points with 2-3 immediate, actionable steps.]

      Make your advice specific to the numbers above, concise, and easy to follow.
    `;

    const advice = await makeRequestWithRetry(prompt);

    // Optional: format for frontend display
    const formattedAdvice = advice
      .replace(/1\. Budget Optimization:/g, '\n\n1. Budget Optimization:\n')
      .replace(/2\. Expense & Income Analysis:/g, '\n\n2. Expense & Income Analysis:\n')
      .replace(/3\. Savings & Goals:/g, '\n\n3. Savings & Goals:\n')
      .replace(/4\. Next Steps:/g, '\n\n4. Next Steps:\n')
      .replace(/•/g, '\n•');

    res.json({ advice: formattedAdvice });
  } catch (error) {
    console.error("Error generating advice:", error);
    res.status(500).json({ error: "Failed to get advice from AI" });
  }
};

module.exports = { getFinancialAdvice };

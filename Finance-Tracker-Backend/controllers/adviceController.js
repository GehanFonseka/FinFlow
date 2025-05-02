const axios = require("axios");

const makeRequestWithRetry = async (prompt, retries = 3, delay = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo", // or another available model
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3002", // or your actual frontend domain
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
  const { totalBudget, totalExpense, totalIncome, pendingGoals } = req.body;

  try {
    const prompt = `I have a total budget of ${totalBudget}, total expenses of ${totalExpense}, and total income of ${totalIncome}. My pending financial goals are: ${pendingGoals}. Compare my income and expenses with the budget, identify whether I am overspending or saving efficiently, and give me clear, practical financial advice in two insightful sentences.`;


    const advice = await makeRequestWithRetry(prompt);

    res.json({ advice });
  } catch (error) {
    console.error("Error generating advice:", error);
    res.status(500).json({ error: "Failed to get advice from AI" });
  }
};

module.exports = { getFinancialAdvice };

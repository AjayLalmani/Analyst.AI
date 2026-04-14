require("dotenv").config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.chat = async (req, res) => {
  const { prompt, csvData } = req.body;
  const csvFileData = JSON.stringify(csvData);
  console.log(csvFileData);
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-OpenRouter-Title": "Analyst AI",
        },
        body: JSON.stringify({
          model: "openrouter/free", 
          messages: [
            {
              role: "system",
              content: `You are a data analyst and ${csvFileData} this is your csv data. Follow these rules:
                   - Always respond in bullet points
                   - Keep answers concise and under 100 words
                   - Focus only on data insights
                   - Use simple language, avoid jargon`,
            },
            {
              role: "user",
              content: `${prompt}`,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log(data.choices[0].message.content);
    res.status(200).json({ message: data.choices[0].message.content });
  } catch (e) {
    console.log(e);
  }
};

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
              content: `You are a data analyst. The CSV data is: ${csvFileData}

RULES:
1. If the user asks to generate, show, draw, plot, or create any chart/graph/visualization, you MUST respond with ONLY the following format and nothing else:
CHART_JSON:{"chartType":"bar"|"line"|"pie"|"area","title":"<short title>","xKey":"<field name>","yKey":"<field name>","data":[{"<xKey>":"<value>","<yKey>":<number>},...up to 10 items]}

2. Choose the most meaningful fields for the chart from the CSV data.
3. For pie charts, use "name" and "value" as the keys.
4. For all other requests (not chart), respond in bullet points, concise, under 100 words, data insights only.`,
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
    const content = data.choices[0].message.content;
    console.log(content);
    res.status(200).json({ message: content });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

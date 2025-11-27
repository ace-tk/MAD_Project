import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateQuiz(topic = "DSA", count = 5) {
  try {
    const prompt = `
Generate ${count} multiple choice questions on the topic "${topic}".
Return ONLY JSON in this format:

[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct option"
  }
]
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const result = response.choices[0].message.content;
    return JSON.parse(result);

  } catch (error) {
    console.log("QUIZ ERROR:", error);
    return null;
  }
}

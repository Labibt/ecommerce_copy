import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function summarizeReviews(reviews) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const combined = reviews.map((r, i) => `${i + 1}. ${r}`).join("\n");

  const prompt = `Summarize the following product reviews in 2-3 lines:\n\n${combined}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

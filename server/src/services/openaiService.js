import OpenAI from 'openai';
import { getFallbackQuestions } from '../utils/fallbackQuestions.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateQuestionsWithAI = async ({
  topic,
  difficulty,
  numQuestions,
  performanceSummary,
}) => {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackQuestions(topic, numQuestions);
  }

  const systemPrompt = `You are an adaptive learning assistant that writes multiple-choice questions.
Always respond with valid JSON payloads only.`;

  const userPrompt = `Generate ${numQuestions} multiple-choice questions about "${topic}".
Difficulty level: ${difficulty}.
Take into account this learner summary: ${JSON.stringify(performanceSummary)}.
Each question must include:
- question: string
- options: array of 4 concise options
- correctAnswer: zero-based index of correct option
- explanation: short rationale
Return JSON: { "questions": [ ... ] }`;

  try {
    const completion = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_output_tokens: 1200,
      temperature: 0.7,
    });

    const content = completion.output?.[0]?.content?.[0]?.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return getFallbackQuestions(topic, numQuestions);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.questions || getFallbackQuestions(topic, numQuestions);
  } catch (error) {
    console.error('OpenAI generation failed', error.message);
    return getFallbackQuestions(topic, numQuestions);
  }
};

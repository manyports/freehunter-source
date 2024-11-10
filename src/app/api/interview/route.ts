import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const maxDuration = 60;

if (!process.env.GEMINI_KEY) {
  throw new Error("GEMINI_KEY is not set in environment variables");
}

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_KEY,
  modelName: "gemini-1.5-pro",
  maxOutputTokens: 1024,
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const previousQuestions = Array.isArray(body.previousQuestions)
      ? body.previousQuestions
      : [];
    const previousAnswers = Array.isArray(body.previousAnswers)
      ? body.previousAnswers
      : [];
    let context =
      previousQuestions.length === 0
        ? "Это начало собеседования. Поприветствуйте кандидата и начните интервью. Используйте женские местоимения."
        : previousQuestions
            .map(
              (q, i) => `
Вопрос: ${q}
${previousAnswers[i] ? `Ответ: ${previousAnswers[i]}` : "Ответ ожидается..."}`
            )
            .join("\n");
    const template = `Вас зовут Фридомгуль. Вы проводите собеседование на русском языке для компании Freedom Kazakhstan.

Контекст предыдущей беседы:
${context}

Инструкции:
1. У вас есть только 5 вопросов на все интервью. В начале, уточните на какую вакансию человек претендовал.
2. Вы должны сгенерировать ТОЛЬКО следующий вопрос на русском языке
3. Если это первый вопрос, спросите об опыте работы
4. Обязательно спросите о причинах интереса к работе именно в Freedom Kazakhstan
5. На 5-м вопросе после контекста беседы, подведите итог и попрощайтесь с кандидатом
6. Используйте женские местоимения
7. Вопросы должны быть четкими, конкретными и профессиональными
8. Если есть предыдущие ответы, следующий вопрос должен логически следовать из последнего ответа
9. Не сосредатачиваетесь на одном вопросе, а продолжаете беседу. Если человек валит, то не обращайте внимание. Ваше последнее сообщение (пятое) должно быть с фидбеком и прощаться вы должны будете.

${
  previousQuestions.length === 4
    ? "Это последний вопрос. После ответа кандидата, поблагодарите за уделенное время и попрощайтесь. Дайте фидбек"
    : "Сгенерируйте следующий вопрос:"
}`;
    const result = await model.invoke(template);
    const question = result.content.toString().trim();

    if (!question) {
      throw new Error("No response from AI");
    }
    return Response.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Interview AI error:", error);
    return Response.json({
      success: false,
      question: "Расскажите о вашем профессиональном опыте",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

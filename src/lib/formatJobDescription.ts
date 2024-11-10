export function formatJobDescription(text: string): string {
  if (!text) return "";

  const sections = {
    RESPONSIBILITIES: "Обязанности",
    REQUIREMENTS: "Требования",
    BENEFITS: "Преимущества",
    CONDITIONS: "Условия",
  };

  let formattedText = decodeURIComponent(encodeURIComponent(text));

  formattedText = formattedText.replace(/^\s*[\*•]\s*/gm, "• ");

  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "### $1");

  Object.entries(sections).forEach(([eng, rus]) => {
    formattedText = formattedText.replace(`[${eng}]`, `#### ${rus}`);
  });

  formattedText = formattedText
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (line.startsWith("###")) {
        return line;
      }
      if (line.startsWith("####")) {
        return `\n${line}\n`;
      }
      if (line.startsWith("•") || line.startsWith("*")) {
        return "• " + line.replace(/^[•\*]\s*/, "");
      }
      return line;
    })
    .join("\n");
  formattedText = formattedText.replace(/\n{3,}/g, "\n\n").trim();

  return formattedText;
}

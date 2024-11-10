export async function analyzeResume(text: string) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse = await response.json();
 
    if (!jsonResponse.highlightedSections || !Array.isArray(jsonResponse.highlightedSections)) {
      throw new Error("Invalid response format");
    }
    
    return {
      highlightedSections: jsonResponse.highlightedSections,
      overallScore: jsonResponse.overallScore || 0,
      feedback: jsonResponse.feedback || "Не удалось получить отзыв"
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error("Не удалось проанализировать резюме. Пожалуйста, попробуйте еще раз.");
  }
} 
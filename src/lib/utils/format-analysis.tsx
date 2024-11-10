import React from 'react';

type HighlightedSection = {
  text: string;
  type: 'strong' | 'improve';
};

export function transformAnalysisToReactComponents(sections: HighlightedSection[]) {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const backgroundColor = section.type === 'strong' 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : 'bg-yellow-100 dark:bg-yellow-900/30';
        
        return (
          <div 
            key={index}
            className={`p-4 rounded-lg ${backgroundColor}`}
          >
            <p className="text-sm md:text-base">
              {section.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function formatFeedback(analysis: {
  highlightedSections: HighlightedSection[];
  overallScore: number;
  feedback: string;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Общая оценка: {analysis.overallScore}/10</h3>
        <p className="text-muted-foreground">{analysis.feedback}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Детальный анализ:</h3>
        {transformAnalysisToReactComponents(analysis.highlightedSections)}
      </div>
    </div>
  );
} 
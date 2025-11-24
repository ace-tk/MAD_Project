export const FALLBACK_QUESTION_BANK = {
  javascript: [
    {
      question: 'Which method is used to add an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'concat()'],
      correctAnswer: 0,
      explanation: 'Array.prototype.push appends items to the tail of an array.',
    },
    {
      question: 'What does the === operator do?',
      options: [
        'Compares value and type',
        'Assigns a value',
        'Performs mathematical addition',
        'Creates a new variable',
      ],
      correctAnswer: 0,
      explanation: 'Strict equality compares both value and type without coercion.',
    },
  ],
  react: [
    {
      question: 'What is the purpose of useEffect?',
      options: [
        'Handle side effects in functional components',
        'Manage component styles',
        'Create class components',
        'Define prop types',
      ],
      correctAnswer: 0,
      explanation: 'useEffect lets you synchronize component state with side effects.',
    },
  ],
};

export const getFallbackQuestions = (topic = 'javascript', numQuestions = 5) => {
  const normalized = topic.trim().toLowerCase();
  const questions = FALLBACK_QUESTION_BANK[normalized] || FALLBACK_QUESTION_BANK.javascript;
  return questions.slice(0, numQuestions);
};

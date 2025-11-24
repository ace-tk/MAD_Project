import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { generateQuiz, saveQuizPerformance } from '../services/quizService';

export default function QuizScreen({ onBack }) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load previous performance (in a real app, load from storage)
  const [previousPerformance, setPreviousPerformance] = useState([]);

  const startQuiz = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic for the quiz');
      return;
    }

    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuiz(
        topic.trim(),
        5, // Number of questions
        'medium', // Default difficulty
        previousPerformance
      );

      if (generatedQuestions.length === 0) {
        Alert.alert('Error', 'Failed to generate quiz questions. Please try again.');
        setIsLoading(false);
        return;
      }

      setQuestions(generatedQuestions);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredQuestions([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate quiz. Please check your internet connection and try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please Select', 'Please select an answer before submitting.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setScore((prev) => prev + (isCorrect ? 1 : 0));

    setAnsweredQuestions((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer,
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer
      }
    ]);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const responses = answeredQuestions.map((entry) => ({
      question: questions[entry.questionIndex]?.question,
      selectedAnswer: entry.selectedAnswer,
      correctAnswer: entry.correctAnswer,
      isCorrect: entry.isCorrect,
    }));

    const finalScore = responses.filter((item) => item.isCorrect).length;
    setScore(finalScore);
    setShowResult(true);

    const performance = await saveQuizPerformance({
      topic,
      difficulty: 'medium',
      responses,
    });

    if (performance) {
      setPreviousPerformance([...previousPerformance, performance]);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setAnsweredQuestions([]);
  };

  if (!quizStarted) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🤖 AI-Generated Quiz</Text>
        <Text style={styles.subtitle}>
          Enter a topic and get personalized quiz questions based on your previous performance
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Topic/Subject:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., JavaScript, React, Mathematics, History"
            value={topic}
            onChangeText={setTopic}
            editable={!isLoading}
          />
        </View>

        {previousPerformance.length > 0 && (
          <View style={styles.performanceContainer}>
            <Text style={styles.performanceTitle}>Your Performance:</Text>
            <Text style={styles.performanceText}>
              Average Score: {Math.round(
                previousPerformance.reduce((sum, p) => sum + p.percentage, 0) /
                previousPerformance.length
              )}%
            </Text>
            <Text style={styles.performanceText}>
              Total Quizzes: {previousPerformance.length}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={startQuiz}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate & Start Quiz</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>🎉 Quiz Complete!</Text>
        
        <View style={styles.resultContainer}>
          <Text style={styles.resultScore}>{score} / {questions.length}</Text>
          <Text style={styles.resultPercentage}>{percentage}%</Text>
          
          <Text style={styles.resultMessage}>
            {percentage >= 80
              ? 'Excellent work! 🌟'
              : percentage >= 60
              ? 'Good job! Keep practicing! 💪'
              : 'Keep studying! You\'ll improve! 📚'}
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Question Review:</Text>
          {questions.map((q, index) => {
            const answerData = answeredQuestions.find(a => a.questionIndex === index);
            return (
              <View key={index} style={styles.summaryItem}>
                <Text style={styles.summaryQuestion}>
                  Q{index + 1}: {q.question}
                </Text>
                <Text style={[
                  styles.summaryAnswer,
                  answerData?.isCorrect ? styles.correct : styles.incorrect
                ]}>
                  {answerData?.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </Text>
                {!answerData?.isCorrect && (
                  <Text style={styles.summaryCorrect}>
                    Correct: {q.options[q.correctAnswer]}
                  </Text>
                )}
                <Text style={styles.summaryExplanation}>{q.explanation}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={resetQuiz}
          >
            <Text style={styles.buttonText}>New Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onBack}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={resetQuiz} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showCorrect = showExplanation && isCorrect;
          const showIncorrect = showExplanation && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                showCorrect && styles.optionCorrect,
                showIncorrect && styles.optionIncorrect
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <Text style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
                showCorrect && styles.optionTextCorrect,
                showIncorrect && styles.optionTextIncorrect
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>
            {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </Text>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        {!showExplanation ? (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, selectedAnswer === null && styles.buttonDisabled]}
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.buttonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleNextQuestion}
          >
            <Text style={styles.buttonText}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  performanceContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  performanceText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  optionCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  optionIncorrect: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#4caf50',
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: '#f44336',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 30,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  resultMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  summaryQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  summaryAnswer: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  correct: {
    color: '#4caf50',
  },
  incorrect: {
    color: '#f44336',
  },
  summaryCorrect: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 5,
  },
  summaryExplanation: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
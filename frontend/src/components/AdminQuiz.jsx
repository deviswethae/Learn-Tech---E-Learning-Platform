import { useState } from "react";
import "../App.css";

const AdminQuiz = () => {
  const questions = [
    { question: "Choose the correct HTML element for the largest heading", options: ["<head>", "<heading>", "<h1>", "<h6>"], answer: "<h1>" },
    { question: "Which is the largest planet in our solar system?", options: ["Mars", "Earth", "Jupiter", "Venus"], answer: "Jupiter" },
    { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
    { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Austen", "Dickens"], answer: "Shakespeare" },
    { question: "Which is the smallest continent?", options: ["Asia", "Antarctica", "Australia", "Europe"], answer: "Australia" },
    { question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: "Tokyo" },
    { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Carbon Dioxide" },
    { question: "Who discovered gravity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Newton" },
    { question: "What is the currency of the USA?", options: ["Dollar", "Euro", "Peso", "Yen"], answer: "Dollar" },
    { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (option) => {
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleDownloadCertificate = () => {
    alert("Certificate Downloaded! (You can integrate PDF download logic here)");
  };

  return (
    <div className="quiz-container">
      {showScore ? (
        <div>
          <h2 className="quiz-score">Your Score: {score} / {questions.length}</h2>
          {score >= 8 && (
            <button className="certificate-button" onClick={handleDownloadCertificate}>
              🎓 Download Certificate
            </button>
          )}
        </div>
      ) : (
        <div>
          <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
          <div className="quiz-options">
            {questions[currentQuestion].options.map((option) => (
              <button key={option} onClick={() => handleAnswerClick(option)} className="quiz-button">
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuiz;

import React, { useState, useEffect } from 'react';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    answers: [''],
    correctIndex: 0,
  });

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewQuestion({
      ...newQuestion,
      [name]: value,
    });
  };

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...newQuestion.answers];
    newAnswers[index] = event.target.value;
    setNewQuestion({
      ...newQuestion,
      answers: newAnswers,
    });
  };

  const handleAddAnswer = () => {
    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, ''],
    });
  };

  const handleNewQuestionSubmit = () => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({
          prompt: '',
          answers: [''],
          correctIndex: 0,
        });
      })
      .catch((error) => {
        console.error("Error creating a new question:", error);
      });
  };

  const handleViewQuestions = () => {
    setShowQuestions(true);
  };

  const handleUpdateCorrectAnswer = (id, newCorrectIndex) => {
    // Send a PATCH request to the server to update the correct answer
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then(() => {
        // Update the client state by finding the question by id and updating the correctIndex
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? { ...question, correctIndex: newCorrectIndex } : question
          )
        );
      })
      .catch((error) => {
        console.error("Error updating the correct answer:", error);
      });
  };

  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <section>
      <h1>Quiz Questions</h1>
      {showQuestions && (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              {question.prompt}
              <select
                value={question.correctIndex}
                onChange={(e) => handleUpdateCorrectAnswer(question.id, e.target.value)}
              >
                {question.answers.map((answer, index) => (
                  <option key={index} value={index}>
                    {answer}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
      <h2>Create a New Question</h2>
      <form>
        <div>
          <label htmlFor="prompt">Prompt:</label>
          <input
            type="text"
            id="prompt"
            name="prompt"
            value={newQuestion.prompt}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Answers:</label>
          {newQuestion.answers.map((answer, index) => (
            <div key={index}>
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(e, index)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddAnswer}>
            Add Answer
          </button>
        </div>
        <div>
          <label htmlFor="correctIndex">Correct Answer Index:</label>
          <input
            type="number"
            id="correctIndex"
            name="correctIndex"
            value={newQuestion.correctIndex}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleNewQuestionSubmit}>
          Create Question
        </button>
        <button type="button" onClick={handleViewQuestions}>
          View Questions
        </button>
      </form>
    </section>
  );
}

export default QuestionList;

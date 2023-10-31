import React, { useState, useEffect } from 'react';
import DeleteQuestion from './DeleteQuestion';
import handleUpdateCorrectAnswer from './update'; 

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

  const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting the question:', error);
      });
  };

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

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.prompt}
            <select
              value={question.correctIndex}
              onChange={(e) => handleUpdateCorrectAnswer(question.id, e.target.value)} // Use handleUpdateCorrectAnswer
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
            <DeleteQuestion onDelete={handleDeleteQuestion} questionId={question.id} />
          </li>
        ))}
      </ul>
      <h2>Create a New Question</h2>
      <form onSubmit={handleNewQuestionSubmit}>
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
        <button type="submit">Create Question</button>
      </form>
    </section>
  );
}

export default QuestionList;

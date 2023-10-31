import React from 'react';

function DeleteQuestion({ onDelete, questionId }) {
  const handleDelete = () => {
    onDelete(questionId);
  };

  return (
    <button onClick={handleDelete}>Delete Question</button>
  );
}

export default DeleteQuestion;

export default function QuizCard({ question, index, total, selected, onSelect }) {
  return (
    <div className="quiz-card">
      <div className="quiz-meta"><span>Question {index + 1} of {total}</span><span>{Math.round(((index + 1) / total) * 100)}%</span></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <h2>{question.question}</h2>
      <div className="options">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            className={`option ${selected === optionIndex ? 'selected' : ''}`}
            onClick={() => onSelect(optionIndex)}
          >
            <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

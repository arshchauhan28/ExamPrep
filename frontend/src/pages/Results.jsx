export default function Results({ result, onTryAgain, onDashboard }) {
  const label = result.percentage >= 80 ? 'Excellent!' : result.percentage >= 60 ? 'Good progress' : 'Keep practicing'
  return (
    <main className="shell page-space narrow">
      <div className="results-hero"><span className="eyebrow">Quiz Result</span><div className="result-score"><strong>{result.correct_answers} / {result.total_questions}</strong><span>{result.percentage}%</span></div><h1>{label}</h1><p>{result.topic}</p></div>
      <div className="result-summary"><div><strong>{result.correct_answers}</strong><span>Correct</span></div><div><strong>{result.incorrect_answers}</strong><span>Incorrect</span></div><div><strong>{result.total_questions}</strong><span>Total</span></div></div>
      <section className="review-list">
        <h2>Answer Review</h2>
        {result.question_results.map((q, i) => (
          <article key={q.id} className={`review-item ${q.is_correct ? 'correct' : 'incorrect'}`}>
            <div className="review-title"><span>{q.is_correct ? '✓ Correct' : '✗ Incorrect'}</span><strong>Question {i + 1}</strong></div>
            <h3>{q.question}</h3>
            <p className="answer-line">Your answer: {q.selected_answer === undefined ? 'Not answered' : q.options[q.selected_answer]}</p>
            <p className="answer-line">Correct answer: {q.options[q.correct_answer]}</p>
            <p>{q.explanation}</p>
          </article>
        ))}
      </section>
      <div className="quiz-nav"><button className="secondary-button" onClick={onTryAgain}>Try Again</button><button className="primary-button" onClick={onDashboard}>Back to Dashboard</button></div>
    </main>
  )
}

import QuizCard from '../components/QuizCard'

export default function Quiz({ quiz, answers, current, onSelect, onPrevious, onNext, onSubmit, loading, error }) {
  const question = quiz.questions[current]
  const isLast = current === quiz.questions.length - 1
  const answered = answers[question.id] !== undefined
  return (
    <main className="shell page-space narrow">
      <div className="page-heading compact"><div><span className="eyebrow">Quiz · {quiz.topic}</span><h1>Test your understanding</h1><p>Choose one answer for every question.</p></div></div>
      {error && <div className="error-banner">{error}</div>}
      <QuizCard question={question} index={current} total={quiz.questions.length} selected={answers[question.id]} onSelect={onSelect} />
      <div className="quiz-nav"><button className="secondary-button" onClick={onPrevious} disabled={current === 0}>Previous</button>{isLast ? <button className="primary-button" onClick={onSubmit} disabled={!answered || loading}>{loading ? 'Submitting…' : 'Submit Quiz'}</button> : <button className="primary-button" onClick={onNext} disabled={!answered}>Next</button>}</div>
    </main>
  )
}

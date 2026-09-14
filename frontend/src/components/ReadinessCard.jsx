import ProgressBar from './ProgressBar'

export default function ReadinessCard({ readiness, onWeakTopics }) {
  if (!readiness) return null
  return (
    <section className="readiness-card">
      <div className="readiness-header">
        <div>
          <span className="eyebrow">Exam Readiness</span>
          <h2>{readiness.score}%</h2>
          <p>{readiness.label}</p>
        </div>
        <div className="readiness-ring" style={{ '--score': `${readiness.score * 3.6}deg` }}>
          <strong>{readiness.score}%</strong>
        </div>
      </div>
      <ProgressBar value={readiness.score} />
      <div className="readiness-grid">
        <div><h3>Strong Topics</h3>{readiness.strong.length ? readiness.strong.map((t) => <p key={t}>✓ {t}</p>) : <p>Keep taking quizzes to build evidence.</p>}</div>
        <div><h3>Needs Improvement</h3>{readiness.weak.length ? readiness.weak.map((t) => <p key={t}>⚠ {t}</p>) : <p>Great coverage so far.</p>}</div>
      </div>
      <div className="recommended"><h3>Recommended Next</h3><ol>{readiness.recommended.map((t, i) => <li key={`${t}-${i}`}>{t}</li>)}</ol></div>
      {readiness.weak.length > 0 && <button className="secondary-button" onClick={onWeakTopics}>Study Weak Topics</button>}
    </section>
  )
}

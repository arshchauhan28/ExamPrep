export default function ProgressBar({ value }) {
  return (
    <div className="progress-track readiness-progress" aria-label={`${value}%`}>
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

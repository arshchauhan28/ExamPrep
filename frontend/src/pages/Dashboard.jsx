import TopicCard from '../components/TopicCard'
import ReadinessCard from '../components/ReadinessCard'

export default function Dashboard({
  syllabus,
  fileName,
  readiness,
  onNotes,
  onQuiz,
  onMindMap,
  onStartNew,
}) {
  return (
    <main className="shell page-space">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {fileName || 'Current syllabus'}
          </span>

          <h1>Your Exam Preparation</h1>

          <p>
            {syllabus.subject} · {syllabus.units.length} units detected
          </p>
        </div>

        <div className="page-heading-actions">
          <button
            className="primary-button"
            onClick={onMindMap}
          >
            🧠 Generate Mind Map
          </button>

          <button
            className="secondary-button"
            onClick={onStartNew}
          >
            Start New Syllabus
          </button>
        </div>
      </div>

      {readiness && (
        <ReadinessCard
          readiness={readiness}
          onWeakTopics={() => {
            if (readiness.weak?.length) {
              onQuiz({
                name: readiness.weak[0],
              })
            }
          }}
        />
      )}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              AI analysis
            </span>

            <h2>Topics Detected</h2>
          </div>
        </div>

        <div className="units">
          {syllabus.units.map((unit) => (
            <section
              className="unit"
              key={unit.name}
            >
              <div className="unit-title">
                <span>
                  {unit.name}
                </span>

                <span>
                  {unit.topics.length} topics
                </span>
              </div>

              <div className="topic-list">
                {unit.topics.map((topic) => (
                  <TopicCard
                    key={topic.name}
                    topic={topic}
                    onNotes={onNotes}
                    onQuiz={onQuiz}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
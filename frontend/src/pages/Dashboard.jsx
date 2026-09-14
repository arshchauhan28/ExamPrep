import TopicCard from '../components/TopicCard'
import ReadinessCard from '../components/ReadinessCard'

export default function Dashboard({ syllabus, fileName, readiness, onNotes, onQuiz, onGenerateAllNotes, onGenerateQuiz, onStartNew, bulkLoading, quizLoading }) {
  return (
    <main className="shell page-space">
      <div className="page-heading">
        <div><span className="eyebrow">{fileName || 'Current syllabus'}</span><h1>Your Exam Preparation</h1><p>{syllabus.subject} · {syllabus.units.length} units detected</p></div>
        <button className="secondary-button" onClick={onStartNew}>Start New Syllabus</button>
      </div>
      {readiness && <ReadinessCard readiness={readiness} onWeakTopics={() => onQuiz({ name: readiness.weak[0] })} />}
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">AI analysis</span><h2>Topics Detected</h2></div><div className="bulk-actions"><button className="secondary-button" disabled={bulkLoading} onClick={onGenerateAllNotes}>{bulkLoading ? 'Generating notes…' : 'Generate All Notes'}</button><button className="primary-button" disabled={quizLoading} onClick={onGenerateQuiz}>{quizLoading ? 'Creating quiz…' : 'Generate Quiz'}</button></div></div>
        <div className="units">
          {syllabus.units.map((unit) => (
            <section className="unit" key={unit.name}>
              <div className="unit-title"><span>{unit.name}</span><span>{unit.topics.length} topics</span></div>
              <div className="topic-list">{unit.topics.map((topic) => <TopicCard key={topic.name} topic={topic} onNotes={onNotes} onQuiz={onQuiz} />)}</div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function TopicCard({ topic, onNotes, onQuiz }) {
  return (
    <article className="topic-card">
      <div>
        <h3>{topic.name}</h3>
        {topic.subtopics?.length > 0 && (
          <p className="subtopics">{topic.subtopics.join(' · ')}</p>
        )}
      </div>
      <div className="topic-actions">
        <button className="secondary-button" onClick={() => onNotes(topic)}>Study Notes</button>
        <button className="primary-button" onClick={() => onQuiz(topic)}>Take Quiz</button>
      </div>
    </article>
  )
}

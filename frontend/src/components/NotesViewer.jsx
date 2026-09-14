function ListSection({ title, items }) {
  if (!items?.length) return null
  return (
    <section className="notes-section">
      <h3>{title}</h3>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </section>
  )
}

export default function NotesViewer({ notes }) {
  if (!notes) return null
  return (
    <div className="notes-viewer">
      <div className="notes-overview">
        <span className="eyebrow">Study Notes</span>
        <h2>{notes.topic}</h2>
        <p>{notes.overview}</p>
      </div>
      <ListSection title="Important Concepts" items={notes.important_concepts} />
      <ListSection title="Definitions" items={notes.definitions} />
      <ListSection title="Key Points" items={notes.key_points} />
      <ListSection title="Examples" items={notes.examples} />
      <ListSection title="Important Exam Points" items={notes.exam_points} />
      <ListSection title="Common Mistakes" items={notes.common_mistakes} />
      <ListSection title="Quick Revision" items={notes.quick_revision} />
    </div>
  )
}

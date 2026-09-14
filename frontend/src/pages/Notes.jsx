import NotesViewer from '../components/NotesViewer'

export default function Notes({
  selectedTopic,
  notes,
  loading,
  onGenerate,
  onBack
}) {
  return (
    <main className="shell page-space narrow">

      {/* Back to dashboard */}
      <button
        className="back-link"
        onClick={onBack}
      >
        ← Back to dashboard
      </button>


      {/* Page heading */}
      <div className="page-heading compact">

        <div>
          <span className="eyebrow">
            FOCUSED STUDY
          </span>

          <h1>
            Study Notes
          </h1>

          <p>
            Exam-focused notes for{' '}
            <strong className="topic-highlight">
              {selectedTopic?.name}
            </strong>
          </p>
        </div>

      </div>


      {/* Generated notes */}
      {notes ? (

        <NotesViewer
          notes={notes}
        />

      ) : (

        /* Empty state */
        <div className="empty-card">

          <h2>
            Ready to study?
          </h2>

          <p>
            Generate focused notes for{' '}
            <strong className="topic-highlight">
              {selectedTopic?.name}
            </strong>{' '}
            and start your revision.
          </p>

          <button
            className="primary-button notes-empty-button"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading
              ? 'Generating notes…'
              : 'Generate Notes'}
          </button>

        </div>

      )}

    </main>
  )
}
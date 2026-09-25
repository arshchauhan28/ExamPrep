import { useState } from 'react'
import { analyzeMindmap, friendlyError } from '../services/api'

function MindMapNode({ node, level = 0 }) {
  if (!node) return null

  const type = node.type || 'detail'

  return (
    <div
      className={`mindmap-node mindmap-level-${level} mindmap-type-${type}`}
    >
      <div className="mindmap-card">
        {node.label}
      </div>

      {node.children?.length > 0 && (
        <div className="mindmap-children">
          {node.children.map((child) => (
            <MindMapNode
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MindMap({ syllabus, onBack }) {
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [mindmap, setMindmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectTopic = (unit, topic) => {
    setSelectedUnit(unit)
    setSelectedTopic(topic)
    setMindmap(null)
    setError('')
  }

  const generateMindMap = async () => {
    if (!selectedUnit || !selectedTopic) return

    setLoading(true)
    setError('')

    try {
      const data = await analyzeMindmap(
        syllabus?.subject || '',
        selectedUnit.name,
        selectedTopic.name,
        selectedTopic.subtopics || [],
      )

      setMindmap(data)
    } catch (err) {
      setError(
        friendlyError(
          err,
          'Something went wrong while generating the mind map.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="shell page-space mindmap-page">

      <button
        className="secondary-button mindmap-back"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>

      {/* HEADER */}
      <div className="mindmap-heading">
        <span className="eyebrow">VISUAL LEARNING</span>

        <h1>Topic Mind Maps</h1>

        <p>
          Select a topic to generate a focused visual map of its
          important concepts.
        </p>
      </div>

      {/* TOPIC SELECTOR */}
      <section className="mindmap-topic-selector">

        <div className="section-heading">
          <div>
            <span className="eyebrow">SELECT A TOPIC</span>

            <h2>
              {syllabus?.subject || 'Your syllabus'}
            </h2>
          </div>
        </div>

        <div className="mindmap-units">
          {syllabus?.units?.map((unit) => (
            <div
              className="mindmap-unit"
              key={unit.name}
            >
              <div className="mindmap-unit-title">
                {unit.name}
              </div>

              <div className="mindmap-topic-grid">
                {unit.topics?.map((topic) => {
                  const selected =
                    selectedTopic?.name === topic.name &&
                    selectedUnit?.name === unit.name

                  return (
                    <button
                      key={topic.name}
                      className={`mindmap-topic-button ${
                        selected ? 'selected' : ''
                      }`}
                      onClick={() => selectTopic(unit, topic)}
                    >
                      <span>{topic.name}</span>

                      <span className="mindmap-topic-arrow">
                        →
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* GENERATE */}
        {selectedTopic && (
          <div className="mindmap-generate">

            <div>
              <span className="eyebrow">
                SELECTED TOPIC
              </span>

              <strong>
                {selectedTopic.name}
              </strong>

              <small>
                {selectedUnit?.name}
              </small>
            </div>

            <button
              className="primary-button"
              onClick={generateMindMap}
              disabled={loading}
            >
              {loading
                ? 'Generating...'
                : 'Generate Mind Map'}
            </button>

          </div>
        )}

      </section>

      {/* ERROR */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* RESULT */}
      {mindmap?.root && (
        <section className="mindmap-result">

          <div className="mindmap-result-heading">

            <div>
              <span className="eyebrow">
                AI-GENERATED MAP
              </span>

              <h2>
                {mindmap.topic}
              </h2>

              <p>
                {mindmap.unit} · {mindmap.subject}
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => setMindmap(null)}
            >
              Choose Another Topic
            </button>

          </div>

          {/* ACTUAL MIND MAP */}
          <div className="mindmap-canvas">

            <div className="mindmap-tree">

              <MindMapNode
                node={mindmap.root}
                level={0}
              />

            </div>

          </div>

        </section>
      )}

    </main>
  )
}
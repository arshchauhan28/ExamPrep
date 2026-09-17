import jsPDF from 'jspdf'

function ListSection({ title, items }) {
  if (!items?.length) return null

  return (
    <section className="notes-section">
      <h3>{title}</h3>

      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default function NotesViewer({ notes }) {
  if (!notes) return null

  const downloadNotes = () => {
    const doc = new jsPDF()

    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2

    let y = 20

    const addText = (text, fontSize = 11, spacing = 7) => {
      doc.setFontSize(fontSize)

      const lines = doc.splitTextToSize(
        String(text || ''),
        maxWidth
      )

      if (y + lines.length * spacing > pageHeight - 20) {
        doc.addPage()
        y = 20
      }

      doc.text(lines, margin, y)
      y += lines.length * spacing + 4
    }

    const addSection = (title, items) => {
      if (!items?.length) return

      if (y > pageHeight - 40) {
        doc.addPage()
        y = 20
      }

      doc.setFont('helvetica', 'bold')
      addText(title, 14, 8)

      doc.setFont('helvetica', 'normal')

      items.forEach((item) => {
        addText(`• ${item}`, 11, 7)
      })

      y += 4
    }

    // Title
    doc.setFont('helvetica', 'bold')
    addText('ExamPrep AI', 20, 10)

    doc.setFont('helvetica', 'bold')
    addText(notes.topic || 'Study Notes', 18, 9)

    // Overview
    if (notes.overview) {
      doc.setFont('helvetica', 'bold')
      addText('Overview', 14, 8)

      doc.setFont('helvetica', 'normal')
      addText(notes.overview, 11, 7)

      y += 4
    }

    addSection(
      'Important Concepts',
      notes.important_concepts
    )

    addSection(
      'Definitions',
      notes.definitions
    )

    addSection(
      'Key Points',
      notes.key_points
    )

    addSection(
      'Examples',
      notes.examples
    )

    addSection(
      'Important Exam Points',
      notes.exam_points
    )

    addSection(
      'Common Mistakes',
      notes.common_mistakes
    )

    addSection(
      'Quick Revision',
      notes.quick_revision
    )

    // Footer
    const totalPages = doc.internal.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      doc.text(
        `ExamPrep AI • Page ${i} of ${totalPages}`,
        margin,
        pageHeight - 10
      )
    }

    const safeTopic = (notes.topic || 'Study-Notes')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')

    doc.save(`${safeTopic}-Study-Notes.pdf`)
  }

  return (
    <div className="notes-viewer">

      <div className="notes-overview">
        <div className="notes-header">

          <div>
            <span className="eyebrow">
              Study Notes
            </span>

            <h2>{notes.topic}</h2>
          </div>

          <button
            className="primary-button download-notes-button"
            onClick={downloadNotes}
          >
            ↓ Download Notes
          </button>

        </div>

        <p>{notes.overview}</p>
      </div>

      <ListSection
        title="Important Concepts"
        items={notes.important_concepts}
      />

      <ListSection
        title="Definitions"
        items={notes.definitions}
      />

      <ListSection
        title="Key Points"
        items={notes.key_points}
      />

      <ListSection
        title="Examples"
        items={notes.examples}
      />

      <ListSection
        title="Important Exam Points"
        items={notes.exam_points}
      />

      <ListSection
        title="Common Mistakes"
        items={notes.common_mistakes}
      />

      <ListSection
        title="Quick Revision"
        items={notes.quick_revision}
      />

    </div>
  )
}
import { useRef, useState } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg']

export default function FileUpload({
  file,
  onFileChange,
  onAnalyze,
  onPasteAnalyze,
  loading,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const selectFile = (candidate) => {
    if (!candidate) return

    const name = candidate.name.toLowerCase()
    const validExtension = ALLOWED_EXTENSIONS.some((ext) =>
      name.endsWith(ext)
    )

    if (!validExtension) {
      onFileChange({
        error: 'Please select a PDF, DOCX, TXT, PNG, JPG, or JPEG file.',
      })
      return
    }

    if (candidate.size > MAX_FILE_SIZE) {
      onFileChange({
        error: 'Please choose a file smaller than 10 MB.',
      })
      return
    }

    onFileChange(candidate)
  }

  const handlePasteAnalyze = () => {
    if (!pasteText.trim()) {
      onFileChange({
        error: 'Please paste your syllabus text first.',
      })
      return
    }

    onPasteAnalyze(pasteText.trim())
  }

  return (
    <div className="upload-card">

      {/* FILE UPLOAD */}
      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          selectFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            inputRef.current?.click()
          }
        }}
      >
        <div className="upload-icon">📄</div>

        <h3>
          {file?.name || 'Upload your syllabus'}
        </h3>

        <p>
          {file
            ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected`
            : 'Drag & drop your syllabus here, or browse from your device.'}
        </p>

        <span className="browse-button">
          Browse File
        </span>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          hidden
          onChange={(e) => selectFile(e.target.files?.[0])}
        />
      </div>

      {/* SUPPORTED FILE TYPES */}
      <div className="upload-helper upload-types">
        PDF&nbsp;&nbsp;/&nbsp;&nbsp;DOCX&nbsp;&nbsp;/&nbsp;&nbsp;TXT&nbsp;&nbsp;/&nbsp;&nbsp;Image
      </div>

      {/* FILE GENERATE BUTTON */}
      <button
        className="primary-button full-width"
        disabled={!file || loading}
        onClick={onAnalyze}
      >
        {loading ? 'Generating study material…' : 'Generate Study Material'}
      </button>

      {/* DIVIDER */}
      <div className="upload-divider">
        <span>OR</span>
      </div>

      {/* PASTE SYLLABUS */}
      <div className="paste-section">
        <label htmlFor="syllabus-text">
          Paste syllabus text
        </label>

        <textarea
          id="syllabus-text"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste your syllabus here...

Example:
Unit 1: Data Structures
- Arrays
- Linked Lists
- Stacks
- Queues

Unit 2: Algorithms
- Searching
- Sorting
- Graph Algorithms"
          rows={8}
        />

        <button
          className="secondary-button full-width"
          disabled={!pasteText.trim() || loading}
          onClick={handlePasteAnalyze}
        >
          {loading
            ? 'Generating study material…'
            : 'Generate From Text'}
        </button>
      </div>

    </div>
  )
}
import { useRef, useState } from 'react'

export default function FileUpload({ file, onFileChange, onAnalyze, loading }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const selectFile = (candidate) => {
    if (!candidate) return
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) {
      onFileChange({ error: 'Please select a PDF file.' })
      return
    }
    if (candidate.size > 10 * 1024 * 1024) {
      onFileChange({ error: 'Please choose a PDF smaller than 10 MB.' })
      return
    }
    onFileChange(candidate)
  }

  return (
    <div className="upload-card">
      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files?.[0]) }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <div className="upload-icon">↑</div>
        <h3>{file?.name || 'Upload Your Syllabus'}</h3>
        <p>{file?.name ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected` : 'Drag & drop a PDF here, or browse from your device.'}</p>
        <span className="browse-button">Browse File</span>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => selectFile(e.target.files?.[0])} />
      </div>
      <p className="upload-helper">Upload your syllabus PDF and let AI organize your preparation.</p>
      <button className="primary-button full-width" disabled={!file || loading} onClick={onAnalyze}>
        {loading ? 'Analyzing your syllabus…' : 'Analyze Syllabus'}
      </button>
    </div>
  )
}

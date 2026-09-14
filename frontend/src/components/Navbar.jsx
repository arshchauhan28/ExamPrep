export default function Navbar({ onHome, onDashboard, onNew }) {
  return (
    <header className="nav shell">
      <button
        className="brand"
        onClick={onHome}
        aria-label="ExamPrep AI home"
      >
        <span className="brand-mark">
          E
        </span>

        <span className="brand-text">
          ExamPrep <span>AI</span>
        </span>
      </button>

      <nav className="nav-links">
        <button onClick={onHome}>
          Home
        </button>

        <button onClick={onDashboard}>
          Dashboard
        </button>

        <button
          className="nav-cta"
          onClick={onNew}
        >
          Start New Syllabus
          <span>→</span>
        </button>
      </nav>
    </header>
  )
}
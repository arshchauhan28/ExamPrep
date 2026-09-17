export default function Navbar({ onHome, onDashboard, onNew }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <button
          className="navbar-brand"
          onClick={onHome}
          aria-label="ExamPrep AI home"
        >
          <span className="navbar-logo">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 15L24 7L40 15L24 23L8 15Z"
                fill="currentColor"
              />

              <path
                d="M13 20V31L24 37L35 31V20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M40 15V28"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="navbar-title">
            ExamPrep <span>AI</span>
          </span>
        </button>

        {/* Navigation */}
        <nav className="navbar-links">

          {/* Home */}
          <button
            className="navbar-link active"
            onClick={onHome}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.5L12 3L21 10.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5 9.5V21H19V9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M9 21V15H15V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>Home</span>
          </button>

          {/* Dashboard */}
          <button
            className="navbar-link"
            onClick={onDashboard}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3H14L19 8V21H6V3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M14 3V8H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M9 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M9 16H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <span>Dashboard</span>
          </button>

          {/* Start New Syllabus */}
          <button
            className="navbar-new"
            onClick={onNew}
          >
            <span className="navbar-plus">
              +
            </span>

            <span>Start New Syllabus</span>
          </button>

        </nav>

        {/* AI badge */}
        <div className="navbar-ai-badge">
          <span className="navbar-sparkle">✦</span>
          <span>AI-Powered Learning</span>
        </div>

      </div>
    </header>
  )
}
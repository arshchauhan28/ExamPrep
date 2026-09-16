export default function Navbar({
  onHome,
  onDashboard,
  onNew,
}) {
  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const handleGetStarted = () => {
    const upload = document.getElementById("upload");

    if (upload) {
      upload.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      onNew();
    }
  };

  return (
    <header className="new-navbar">

      <div className="landing-container navbar-inner">

        {/* LOGO */}

        <button
          className="new-brand"
          onClick={onHome}
        >

          <span className="new-brand-icon">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                d="M20 4L35 12L20 20L5 12L20 4Z"
                fill="currentColor"
              />

              <path
                d="M10 17V26L20 32L30 26V17"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M35 12V24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />

            </svg>
          </span>

          <span>
            ExamPrep{" "}
            <strong>
              AI
            </strong>
          </span>

        </button>


        {/* NAV */}

        <nav className="new-nav-links">

          <button
            className="nav-active"
            onClick={onHome}
          >
            Home
          </button>

          <button
            onClick={() =>
              scrollTo("how-it-works")
            }
          >
            How It Works
          </button>

          <button
            onClick={() =>
              scrollTo("features")
            }
          >
            Features
          </button>

          <button
            className="new-nav-cta"
            onClick={handleGetStarted}
          >
            Get Started
            <span>→</span>
          </button>

        </nav>


        {/* MOBILE */}

        <button
          className="new-mobile-menu"
          onClick={handleGetStarted}
          aria-label="Get started"
        >
          ☰
        </button>

      </div>

    </header>
  );
}
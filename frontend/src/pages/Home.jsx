import FileUpload from "../components/FileUpload";

export default function Home({
  file,
  onFileChange,
  onAnalyze,
  onPasteAnalyze,
  loading,
}) {
  return (
    <main className="home-page">

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="how-it-works shell">

        <div className="how-heading">
          <span className="how-eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            From syllabus to{" "}
            <span>exam-ready.</span>
          </h2>

          <p>
            A simple four-step process to turn your syllabus
            into a focused study plan.
          </p>
        </div>

        <div className="steps-wrapper">

          {/* STEP 1 */}
          <div className="step-card">
            <div className="step-number">
              1
            </div>

            <div className="step-icon">
              ↑
            </div>

            <h3>
              Upload Syllabus
            </h3>

            <p>
              Upload your syllabus PDF in seconds.
            </p>
          </div>


          <div className="step-line" />


          {/* STEP 2 */}
          <div className="step-card">
            <div className="step-number">
              2
            </div>

            <div className="step-icon">
              ✦
            </div>

            <h3>
              AI Organizes Topics
            </h3>

            <p>
              Units, topics and subtopics are organized automatically.
            </p>
          </div>


          <div className="step-line" />


          {/* STEP 3 */}
          <div className="step-card">
            <div className="step-number">
              3
            </div>

            <div className="step-icon">
              ▤
            </div>

            <h3>
              Study & Practice
            </h3>

            <p>
              Generate notes and practice with exam-style quizzes.
            </p>
          </div>


          <div className="step-line" />


          {/* STEP 4 */}
          <div className="step-card">
            <div className="step-number">
              4
            </div>

            <div className="step-icon">
              ◔
            </div>

            <h3>
              Check Readiness
            </h3>

            <p>
              See your progress and discover what to study next.
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          UPLOAD / HERO
      ===================================================== */}
      <section className="hero shell">

        <div className="hero-copy">

          <div className="hero-badge">
            <span className="hero-badge-dot" />
            SMART EXAM PREPARATION
          </div>

          <h1>
            Turn Your Syllabus Into A{" "}
            <span>Smarter Study Plan.</span>
          </h1>

          <p>
            Upload your syllabus and let ExamPrep AI organize
            topics, create focused notes, build smart quizzes,
            and show exactly where you stand.
          </p>

          <div className="hero-actions">

            <button
              className="hero-primary-btn"
              onClick={() =>
                document
                  .querySelector(".hero-upload-wrap")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
              }
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                document
                  .querySelector(".how-it-works")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              How It Works
            </button>

          </div>


          <div className="hero-pills">

            <span>
              <b>✦</b>
              AI Notes
            </span>

            <span>
              <b>✓</b>
              Smart Quizzes
            </span>

            <span>
              <b>◉</b>
              Readiness Score
            </span>

          </div>

        </div>


        {/* UPLOAD CARD */}
        <div className="hero-visual">

          <div className="hero-upload-wrap">

            <FileUpload
              file={file}
              onFileChange={onFileChange}
              onAnalyze={onAnalyze}
              onPasteAnalyze={onPasteAnalyze}
              loading={loading}
            />  

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="bottom-cta shell">

        <div>

          <span className="eyebrow">
            PREPARE WITH CONFIDENCE
          </span>

          <h2>
            Study less randomly.
            <br />
            <span>Prepare more intelligently.</span>
          </h2>

          <p>
            Your syllabus already contains the roadmap.
            ExamPrep AI helps you turn it into action.
          </p>

        </div>


        <div className="bottom-cta-badge">

          <span>
            ✦
          </span>

          <div>
            <strong>
              ExamPrep AI
            </strong>

            <small>
              Your personal study assistant
            </small>
          </div>

        </div>

      </section>

    </main>
  );
}
import FileUpload from "../components/FileUpload";

export default function Home({
  file,
  onFileChange,
  onAnalyze,
  onPasteAnalyze,
  loading,
}) {
  const scrollToUpload = () => {
    document
      .getElementById("upload")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <main className="new-landing-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="new-hero">

        <div className="landing-container new-hero-grid">

          {/* LEFT SIDE */}

          <div className="new-hero-content">

            <div className="new-hero-badge">
              <span>✦</span>
              AI-Powered Exam Preparation
            </div>

            <h1>
              Turn Your Syllabus
              <br />
              Into{" "}
              <span>
                Exam-Ready Prep.
              </span>
            </h1>

            <p className="new-hero-description">
              Upload your study material and let AI create
              structured notes, smart quizzes, and a
              personalized study plan to help you score
              better, faster.
            </p>

            <div className="new-hero-actions">

              <button
                className="new-primary-button"
                onClick={scrollToUpload}
              >
                Get Started
                <span>→</span>
              </button>

              <button
                className="new-secondary-button"
                onClick={scrollToHowItWorks}
              >
                <span className="play-circle">
                  ▶
                </span>

                See How It Works
              </button>

            </div>


            {/* FEATURE HIGHLIGHTS */}

            <div
              className="new-feature-highlights"
              id="features"
            >

              <div className="new-feature-item">

                <div className="new-feature-icon blue">
                  📄
                </div>

                <div>
                  <strong>
                    AI Notes
                  </strong>

                  <span>
                    Well-structured
                    <br />
                    study notes
                  </span>
                </div>

              </div>


              <div className="new-feature-item">

                <div className="new-feature-icon teal">
                  🎯
                </div>

                <div>
                  <strong>
                    Smart Quizzes
                  </strong>

                  <span>
                    Practice with
                    <br />
                    AI-generated quizzes
                  </span>
                </div>

              </div>


              <div className="new-feature-item">

                <div className="new-feature-icon green">
                  📊
                </div>

                <div>
                  <strong>
                    Readiness Score
                  </strong>

                  <span>
                    Know how prepared
                    <br />
                    you are
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE VISUAL */}

          <div className="new-hero-visual">

            <div className="hero-glow" />

            {/* SYLLABUS */}

            <div className="syllabus-card">

              <div className="syllabus-card-header">

                <div className="pdf-small-icon">
                  PDF
                </div>

                <div>
                  <strong>
                    Syllabus.pdf
                  </strong>

                  <span />
                </div>

              </div>


              <div className="syllabus-topics">

                <div>
                  <b>Unit 1</b>
                  <small>
                    Introduction
                  </small>
                </div>

                <div>
                  <b>Unit 2</b>
                  <small>
                    Core Concepts
                  </small>
                </div>

                <div>
                  <b>Unit 3</b>
                  <small>
                    Applications
                  </small>
                </div>

                <div>
                  <b>Unit 4</b>
                  <small>
                    Important Topics
                  </small>
                </div>

              </div>

            </div>


            {/* NOTES */}

            <div className="ai-floating-card notes-card">

              <div className="floating-card-icon blue">
                ▤
              </div>

              <div>

                <strong>
                  AI Notes
                </strong>

                <span />
                <span />
                <span className="short" />

              </div>

            </div>


            {/* QUIZ */}

            <div className="ai-floating-card quiz-card">

              <div className="floating-card-icon teal">
                ✓
              </div>

              <div>

                <strong>
                  Quiz
                </strong>

                <span />
                <span />
                <span className="short" />

              </div>

            </div>


            {/* READINESS */}

            <div className="readiness-floating-card">

              <strong>
                Readiness Score
              </strong>

              <div className="readiness-inner">

                <div className="readiness-circle">
                  <span>
                    85%
                  </span>
                </div>

                <p>
                  You're
                  <br />
                  almost ready!
                </p>

              </div>

            </div>


            <div className="visual-arrow arrow-one">
              ↗
            </div>

            <div className="visual-arrow arrow-two">
              ↗
            </div>

            <div className="visual-spark spark-one">
              ✦
            </div>

            <div className="visual-spark spark-two">
              ✦
            </div>

            <div className="handwritten-text">
              Upload → Learn → Succeed
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          UPLOAD
      ===================================================== */}

      <section
        id="upload"
        className="new-upload-section"
      >

        <div className="landing-container">

          <div className="new-upload-card">

            <div className="new-upload-heading">

              <div className="new-upload-icon">
                ↑
              </div>

              <h2>
                Upload Study Material
              </h2>

              <p>
                Upload your files or paste text to get
                started with AI-powered preparation.
              </p>

            </div>

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
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="new-how-section"
      >

        <div className="landing-container">

          <div className="new-section-heading">

            <div className="new-section-badge">
              ⚙ Simple Steps, Big Results
            </div>

            <h2>
              How It Works
            </h2>

            <p>
              Get from your study material to
              exam-ready in just a few steps.
            </p>

          </div>


          <div className="new-how-grid">

            {/* 1 */}

            <div className="new-how-card">

              <div className="new-step-number blue">
                1
              </div>

              <div className="new-how-icon blue-bg">
                📄
              </div>

              <h3>
                Upload
              </h3>

              <p>
                Upload your study material
                using any supported file or
                paste your text.
              </p>

            </div>


            <div className="new-how-arrow">
              →
            </div>


            {/* 2 */}

            <div className="new-how-card">

              <div className="new-step-number teal">
                2
              </div>

              <div className="new-how-icon teal-bg">
                🧠
              </div>

              <h3>
                AI Organizes
              </h3>

              <p>
                Our AI analyzes and structures
                the content into topics and units.
              </p>

            </div>


            <div className="new-how-arrow">
              →
            </div>


            {/* 3 */}

            <div className="new-how-card">

              <div className="new-step-number purple">
                3
              </div>

              <div className="new-how-icon purple-bg">
                📖
              </div>

              <h3>
                Study & Practice
              </h3>

              <p>
                Get detailed notes, chapter-wise
                quizzes and practice questions.
              </p>

            </div>


            <div className="new-how-arrow">
              →
            </div>


            {/* 4 */}

            <div className="new-how-card">

              <div className="new-step-number orange">
                4
              </div>

              <div className="new-how-icon orange-bg">
                📊
              </div>

              <h3>
                Check Readiness
              </h3>

              <p>
                Track your progress with a
                personalized readiness score.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="new-final-cta">

        <div className="landing-container">

          <div>

            <span>
              EXAMPREP AI
            </span>

            <h2>
              Ready to prepare
              <br />
              <strong>
                smarter?
              </strong>
            </h2>

            <p>
              Upload your study material and let
              ExamPrep AI build your study plan.
            </p>

          </div>

          <button
            className="new-primary-button"
            onClick={scrollToUpload}
          >
            Get Started Now
            <span>→</span>
          </button>

        </div>

      </section>

    </main>
  );
}
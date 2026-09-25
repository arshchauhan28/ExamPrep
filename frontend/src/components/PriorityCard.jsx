import React from "react";

function PriorityBadge({ priority }) {
  const labels = {
    high: "HIGH PRIORITY",
    medium: "MEDIUM PRIORITY",
    low: "LOW PRIORITY",
  };

  return (
    <span className={`priority-badge priority-${priority}`}>
      {labels[priority] || priority.toUpperCase()}
    </span>
  );
}

export default function PriorityCard({ analysis }) {
  if (!analysis?.units?.length) {
    return null;
  }

  return (
    <section className="priority-section">
      <div className="priority-section-header">
        <div>
          <p className="section-eyebrow">AI TOPIC ANALYSIS</p>
          <h2>What should you study first?</h2>
          <p>
            AI-generated topic priorities based on the structure of your
            syllabus.
          </p>
        </div>
      </div>

      <div className="priority-units">
        {analysis.units.map((unit, unitIndex) => (
          <div className="priority-unit" key={`${unit.name}-${unitIndex}`}>
            <h3>{unit.name}</h3>

            <div className="priority-topics">
              {unit.topics.map((topic, topicIndex) => (
                <article
                  className="priority-topic"
                  key={`${topic.name}-${topicIndex}`}
                >
                  <div className="priority-topic-top">
                    <h4>{topic.name}</h4>

                    <PriorityBadge priority={topic.priority} />
                  </div>

                  {topic.subtopics?.length > 0 && (
                    <div className="priority-subtopics">
                      {topic.subtopics.map((subtopic, index) => (
                        <span key={`${subtopic}-${index}`}>
                          {subtopic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="priority-reason">
                    <strong>Why?</strong>
                    <p>{topic.reason}</p>
                  </div>

                  <div className="priority-action">
                    <strong>Recommended action</strong>
                    <p>{topic.recommended_action}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
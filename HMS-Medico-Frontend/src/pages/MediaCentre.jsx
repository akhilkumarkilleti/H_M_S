import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MediaCentre() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedMediaId, setExpandedMediaId] = useState(null);

  const mediaItems = [
    {
      id: 1,
      title: "MediCo Opens Advanced Cardiac Care Centre in Hyderabad",
      type: "News",
      date: "September 12, 2026",
      source: "MediCo Newsroom",
      icon: "📰",
      color: "#0284c7",
      description:
        "MediCo has announced the opening of a new advanced cardiac care centre equipped to support comprehensive cardiovascular healthcare.",
      path: "/media-centre/cardiac-care-centre",
    },
    {
      id: 2,
      title: "MediCo Recognized for Excellence in Patient Care",
      type: "Media Coverage",
      date: "August 28, 2026",
      source: "Healthcare Today",
      icon: "📺",
      color: "#ca8a04",
      description:
        "MediCo was featured in Healthcare Today for its continued focus on patient-centred care and healthcare service improvements.",
      path: "/media-centre/patient-care-recognition",
    },
    {
      id: 3,
      title: "MediCo Launches Preventive Health Screening Programme",
      type: "Press Release",
      date: "August 10, 2026",
      source: "MediCo Newsroom",
      icon: "📢",
      color: "#0f766e",
      description:
        "A new preventive health screening initiative has been introduced to encourage regular health assessments and early detection.",
      path: "/media-centre/preventive-health-programme",
    },
    {
      id: 4,
      title: "Doctors at MediCo Present Research at Medical Conference",
      type: "Research & Events",
      date: "July 22, 2026",
      source: "Medical Conference",
      icon: "🔬",
      color: "#7c3aed",
      description:
        "MediCo specialists presented their clinical research and healthcare findings at a national medical conference.",
      path: "/media-centre/medical-conference",
    },
    {
      id: 5,
      title: "MediCo Expands Emergency Care Services",
      type: "News",
      date: "June 18, 2026",
      source: "MediCo Newsroom",
      icon: "🚑",
      color: "#dc2626",
      description:
        "Emergency care capabilities have been expanded across selected MediCo hospitals to improve access to urgent medical services.",
      path: "/media-centre/emergency-care-expansion",
    },
    {
      id: 6,
      title: "MediCo Hosts Community Health Awareness Camp",
      type: "Community",
      date: "May 30, 2026",
      source: "MediCo Community",
      icon: "🤝",
      color: "#ea580c",
      description:
        "Healthcare professionals from MediCo participated in a community health awareness programme offering education and basic health screening.",
      path: "/media-centre/community-health-camp",
    },
    {
      id: 7,
      title: "MediCo Introduces New Digital Patient Services",
      type: "News",
      date: "May 15, 2026",
      source: "MediCo Newsroom",
      icon: "💻",
      color: "#0284c7",
      description:
        "MediCo has introduced new digital services to make appointments, health information, and patient communication more convenient.",
      path: "/media-centre/digital-patient-services",
    },
    {
      id: 8,
      title: "MediCo Featured in National Healthcare Magazine",
      type: "Media Coverage",
      date: "April 28, 2026",
      source: "National Healthcare Magazine",
      icon: "🗞️",
      color: "#ca8a04",
      description:
        "MediCo's healthcare initiatives and specialist services were featured in a national healthcare publication.",
      path: "/media-centre/national-healthcare-feature",
    },
    {
      id: 9,
      title: "MediCo Announces New Preventive Care Initiative",
      type: "Press Release",
      date: "April 10, 2026",
      source: "MediCo Communications",
      icon: "📄",
      color: "#0f766e",
      description:
        "MediCo has announced a new initiative focused on preventive healthcare, awareness, and regular health screening.",
      path: "/media-centre/preventive-care-initiative",
    },
    {
      id: 10,
      title: "MediCo Organizes Medical Education Conference",
      type: "Research & Events",
      date: "March 22, 2026",
      source: "MediCo Academic Centre",
      icon: "🎓",
      color: "#7c3aed",
      description:
        "Doctors and healthcare professionals gathered for an educational programme focused on developments in modern medicine.",
      path: "/media-centre/medical-education-conference",
    },
    {
      id: 11,
      title: "Free Community Health Screening Camp Conducted",
      type: "Community",
      date: "March 10, 2026",
      source: "MediCo Community",
      icon: "❤️",
      color: "#ea580c",
      description:
        "MediCo healthcare professionals conducted a community screening camp offering basic health assessments and health education.",
      path: "/media-centre/community-screening-camp",
    },
    {
      id: 12,
      title: "MediCo Specialists Share Insights on Modern Healthcare",
      type: "Media Coverage",
      date: "February 24, 2026",
      source: "Health News Network",
      icon: "🎙️",
      color: "#ca8a04",
      description:
        "MediCo specialists shared their perspectives on healthcare developments and patient care in a recent media feature.",
      path: "/media-centre/specialist-healthcare-insights",
    },
  ];

  const categories = [
    "All",
    "News",
    "Media Coverage",
    "Press Release",
    "Research & Events",
    "Community",
  ];

  const filteredItems =
    activeCategory === "All"
      ? mediaItems
      : mediaItems.filter(
          (item) => item.type === activeCategory
        );

  return (
    <div className="media-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .media-page {
          min-height: 100vh;
          background: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1e293b;
        }

        /* HERO */

        .media-hero {
          background:
            linear-gradient(
              135deg,
              #075985,
              #0284c7,
              #0f766e
            );
          color: white;
          padding: 75px 20px;
          text-align: center;
        }

        .media-hero h1 {
          margin: 0 0 15px;
          font-size: 44px;
          font-weight: 700;
        }

        .media-hero p {
          max-width: 760px;
          margin: auto;
          font-size: 17px;
          line-height: 1.8;
          color: #e0f2fe;
        }

        .hero-actions {
          margin-top: 28px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-button {
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }

        .hero-button.primary {
          background: white;
          color: #0369a1;
        }

        .hero-button.secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.7);
          color: white;
        }

        /* CONTAINER */

        .media-container {
          width: 92%;
          max-width: 1200px;
          margin: 50px auto;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .section-heading h2 {
          margin: 0 0 12px;
          color: #0f172a;
          font-size: 30px;
        }

        .section-heading p {
          max-width: 720px;
          margin: auto;
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }

        /* CATEGORY FILTER */

        .category-list {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 35px;
        }

        .category-button {
          border: 1px solid #cbd5e1;
          background: white;
          color: #475569;
          padding: 10px 17px;
          border-radius: 22px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .category-button:hover {
          border-color: #0284c7;
          color: #0284c7;
          transform: translateY(-1px);
        }

        .category-button.active {
          background: #0284c7;
          color: white;
          border-color: #0284c7;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        }

        /* RESULT COUNT */

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .results-header h3 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
        }

        .results-count {
          color: #64748b;
          font-size: 13px;
        }

        /* MEDIA GRID */

        .media-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .media-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 27px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
          transition: 0.25s ease;
        }

        .media-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 5px;
          height: 100%;
          background: var(--media-color);
        }

        .media-card:hover {
          transform: translateY(-5px);
          border-color: #bae6fd;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.11);
        }

        .media-top {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .media-icon {
          width: 62px;
          height: 62px;
          border-radius: 14px;
          background: var(--media-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 29px;
          flex-shrink: 0;
        }

        .media-title {
          flex: 1;
        }

        .media-type {
          display: inline-block;
          color: var(--media-color);
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .media-title h3 {
          margin: 0;
          color: #0f172a;
          font-size: 19px;
          line-height: 1.4;
        }

        .media-description {
          color: #64748b;
          font-size: 14px;
          line-height: 1.75;
          margin-bottom: 20px;
        }

        /* META */

        .media-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .meta-badge {
          background: #f1f5f9;
          color: #64748b;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
        }

        /* FOOTER */

        .media-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .media-source {
          color: #64748b;
          font-size: 12px;
        }

        .media-button {
          border: none;
          background: var(--media-color);
          color: white;
          padding: 10px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .media-button:hover {
          opacity: 0.9;
          transform: translateX(2px);
        }

        /* NO RESULTS */

        .no-results {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          padding: 50px 20px;
          text-align: center;
          color: #64748b;
        }

        .no-results-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .no-results h3 {
          margin: 0 0 8px;
          color: #0f172a;
        }

        /* PRESS SECTION */

        .press-section {
          margin-top: 50px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 35px;
          text-align: center;
        }

        .press-section h2 {
          margin: 0 0 12px;
          font-size: 26px;
          color: #0f172a;
        }

        .press-section p {
          max-width: 700px;
          margin: auto;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .press-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .press-button {
          border: none;
          background: #0284c7;
          color: white;
          padding: 11px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .press-button.outline {
          background: white;
          color: #0284c7;
          border: 1px solid #0284c7;
        }

        /* CTA */

        .media-cta {
          margin-top: 40px;
          padding: 30px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            #075985,
            #0369a1
          );
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .media-cta h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .media-cta p {
          margin: 0;
          color: #dbeafe;
          line-height: 1.6;
          font-size: 14px;
        }

        .cta-button {
          border: none;
          background: white;
          color: #0369a1;
          padding: 13px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
        }

        /* FOOTER */

        .page-footer {
          margin-top: 50px;
          background: #0f172a;
          color: #94a3b8;
          text-align: center;
          padding: 25px 20px;
          font-size: 13px;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {
          .media-grid {
            grid-template-columns: 1fr;
          }

          .media-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .media-hero {
            padding: 55px 20px;
          }

          .media-hero h1 {
            font-size: 32px;
          }

          .media-hero p {
            font-size: 15px;
          }

          .media-card {
            padding: 22px;
          }

          .media-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .media-button {
            width: 100%;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .press-section {
            padding: 25px 20px;
          }

          .media-cta {
            padding: 25px;
          }

          .cta-button {
            width: 100%;
          }
        }
      `}</style>

      {/* HERO */}

      <section className="media-hero">
        <h1>Media Centre</h1>

        <p>
          Stay updated with the latest MediCo news, press releases,
          media coverage, healthcare initiatives, research events,
          and community activities.
        </p>

        <div className="hero-actions">
          <button
            className="hero-button primary"
            onClick={() => {
              setActiveCategory("All");

              setTimeout(() => {
                document
                  .getElementById("media")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }, 50);
            }}
          >
            View Latest Updates
          </button>


        </div>
      </section>

      <main className="media-container">
        <section id="media">
          <div className="section-heading">
            <h2>News & Media Coverage</h2>

            <p>
              Explore the latest stories, announcements, achievements,
              research events, and community initiatives from MediCo.
            </p>
          </div>

          {/* CATEGORY FILTER */}

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* RESULTS HEADER */}

          <div className="results-header">
            <h3>
              {activeCategory === "All"
                ? "Latest Updates"
                : activeCategory}
            </h3>

            <span className="results-count">
              {filteredItems.length}{" "}
              {filteredItems.length === 1
                ? "item"
                : "items"}{" "}
              found
            </span>
          </div>

          {/* MEDIA CARDS */}

          {filteredItems.length > 0 ? (
            <div className="media-grid">
              {filteredItems.map((item) => (
                <article
                  className="media-card"
                  key={item.id}
                  style={{
                    "--media-color": item.color,
                    "--media-light": `${item.color}15`,
                  }}
                >
                  <div className="media-top">
                    <div className="media-icon">
                      {item.icon}
                    </div>

                    <div className="media-title">
                      <span className="media-type">
                        {item.type}
                      </span>

                      <h3>{item.title}</h3>
                    </div>
                  </div>

                  <p className="media-description">
                    {item.description}
                  </p>

                  {expandedMediaId === item.id && (
                    <div className="media-description" role="region" aria-label={`${item.title} details`}>
                      <h4>About this update</h4>
                      <p>{item.description}</p>
                      <p>This {item.type.toLowerCase()} update was published by {item.source} on {item.date}. It shares MediCo's latest work and information related to {item.title.toLowerCase()}.</p>
                    </div>
                  )}

                  <div className="media-meta">
                    <span className="meta-badge">
                      📅 {item.date}
                    </span>

                    <span className="meta-badge">
                      📰 {item.source}
                    </span>
                  </div>

                  <div className="media-footer">
                    <span className="media-source">
                      MediCo Media Centre
                    </span>

                    <button
                      className="media-button"
                      type="button"
                      aria-expanded={expandedMediaId === item.id}
                      onClick={() => setExpandedMediaId((current) => current === item.id ? null : item.id)}
                    >
                      {expandedMediaId === item.id ? "Read Less" : "Read More"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                📰
              </div>

              <h3>No Updates Found</h3>

              <p>
                There are currently no media updates available in
                this category.
              </p>
            </div>
          )}
        </section>

        {/* PRESS CONTACT */}

        <section className="press-section">
          <h2>Media & Press Enquiries</h2>

          <p>
            Journalists, media organizations, and publications can
            contact the MediCo communications team for press
            information, interviews, statements, and media-related
            enquiries.
          </p>

          <div className="press-actions">
            <button
              className="press-button"
              onClick={() => navigate("/contact")}
            >
              Contact Media Team
            </button>

            <button
              className="press-button outline"
              onClick={() => navigate("/about")}
            >
              About MediCo
            </button>
          </div>
        </section>

        {/* CTA */}

        <section className="media-cta">
          <div>
            <h2>Looking for More MediCo Updates?</h2>

            <p>
              Explore our research publications, hospital
              announcements, and healthcare initiatives.
            </p>
          </div>

          <button
            className="cta-button"
            onClick={() => navigate("/research")}
          >
            Explore Research
          </button>
        </section>
      </main>



    </div>
  );
}

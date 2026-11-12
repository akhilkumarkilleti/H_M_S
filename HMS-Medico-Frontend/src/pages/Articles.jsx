import React, { useState } from "react";
import "./Articles.css";

function Articles() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      id: 1,
      title: "Common Cold: Symptoms, Causes & Treatment",
      description:
        "Learn about common cold symptoms, causes, prevention and treatment options, including when you should consider seeking medical care.",
      tags: [
        "Common Cold",
        "Cough",
        "Viral Infection",
        "General Health",
      ],
      source: "Mayo Clinic",
      specialization: "General Health",
      url: "https://www.mayoclinic.org/diseases-conditions/common-cold/symptoms-causes/syc-20351605",
    },

    {
      id: 2,
      title: "Fever: Causes, Symptoms and When to Seek Help",
      description:
        "Understand common causes of fever, associated symptoms and situations where medical evaluation may be appropriate.",
      tags: [
        "Fever",
        "Infection",
        "Temperature",
        "General Health",
      ],
      source: "Mayo Clinic",
      specialization: "General Health",
      url: "https://www.mayoclinic.org/symptoms/fever/basics/when-to-see-doctor/sym-20050780",
    },

    {
      id: 3,
      title: "Headache: Causes and Common Triggers",
      description:
        "Explore common headache types, possible triggers and factors that may contribute to recurring headaches.",
      tags: [
        "Headache",
        "Stress",
        "Migraine",
        "General Health",
      ],
      source: "Mayo Clinic",
      specialization: "Neurology",
      url: "https://www.mayoclinic.org/symptoms/headache/basics/when-to-see-doctor/sym-20050800",
    },

    {
      id: 4,
      title: "Abdominal Pain: Common Causes",
      description:
        "Abdominal pain can have many causes. Learn about common reasons for stomach discomfort and when professional evaluation may be needed.",
      tags: [
        "Stomach Pain",
        "Abdominal Pain",
        "Digestion",
        "Digestive Health",
      ],
      source: "Cleveland Clinic",
      specialization: "Digestive Health",
      url: "https://my.clevelandclinic.org/health/symptoms/4167-abdominal-pain",
    },

    {
      id: 5,
      title: "Heartburn and Acid Reflux",
      description:
        "Learn about heartburn and acid reflux, common triggers and lifestyle measures that may help reduce symptoms.",
      tags: [
        "Acidity",
        "Heartburn",
        "Acid Reflux",
        "Digestion",
      ],
      source: "Mayo Clinic",
      specialization: "Gastroenterology",
      url: "https://www.mayoclinic.org/diseases-conditions/gerd/symptoms-causes/syc-20361940",
    },

    {
      id: 6,
      title: "Back Pain: Causes and Treatment",
      description:
        "Back pain is common and can have several causes. Explore common risk factors, symptoms and treatment approaches.",
      tags: [
        "Back Pain",
        "Posture",
        "Muscle Strain",
        "Orthopedic Health",
      ],
      source: "Mayo Clinic",
      specialization: "Orthopedics",
      url: "https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906",
    },

    {
      id: 7,
      title: "Allergies: Symptoms and Causes",
      description:
        "Discover common allergy symptoms, potential triggers and how allergic reactions can affect different parts of the body.",
      tags: [
        "Allergy",
        "Sneezing",
        "Runny Nose",
        "Immune System",
      ],
      source: "Mayo Clinic",
      specialization: "Allergy & Immunology",
      url: "https://www.mayoclinic.org/diseases-conditions/allergies/symptoms-causes/syc-20351497",
    },

    {
      id: 8,
      title: "Dehydration: Symptoms and Causes",
      description:
        "Learn how dehydration happens, recognize common warning signs and understand why maintaining adequate fluid intake matters.",
      tags: [
        "Dehydration",
        "Hydration",
        "Heat",
        "General Health",
      ],
      source: "Mayo Clinic",
      specialization: "General Health",
      url: "https://www.mayoclinic.org/diseases-conditions/dehydration/symptoms-causes/syc-20354086",
    },

    {
      id: 9,
      title: "Constipation: Symptoms and Causes",
      description:
        "Understand common causes of constipation and learn about everyday dietary and lifestyle factors that can affect bowel movements.",
      tags: [
        "Constipation",
        "Fiber",
        "Digestive Health",
        "Diet",
      ],
      source: "Mayo Clinic",
      specialization: "Digestive Health",
      url: "https://www.mayoclinic.org/diseases-conditions/constipation/symptoms-causes/syc-20354253",
    },

    {
      id: 10,
      title: "Eyestrain: Symptoms and Causes",
      description:
        "Long periods of screen use and other activities can contribute to eyestrain. Learn about symptoms, causes and prevention.",
      tags: [
        "Eye Strain",
        "Screen Time",
        "Eye Care",
        "Digital Health",
      ],
      source: "Mayo Clinic",
      specialization: "Eye Care",
      url: "https://www.mayoclinic.org/diseases-conditions/eyestrain/symptoms-causes/syc-20372397",
    },

    {
      id: 11,
      title: "Sore Throat: Causes and Treatment",
      description:
        "Explore common causes of sore throat, associated symptoms and situations where medical attention may be appropriate.",
      tags: [
        "Sore Throat",
        "Cold",
        "Infection",
        "ENT",
      ],
      source: "Mayo Clinic",
      specialization: "ENT",
      url: "https://www.mayoclinic.org/symptoms/sore-throat/basics/when-to-see-doctor/sym-20050938",
    },

    {
      id: 12,
      title: "Sleep: Tips for Getting Better Rest",
      description:
        "Good sleep is important for physical and mental wellbeing. Explore practical advice for developing healthier sleep habits.",
      tags: [
        "Sleep",
        "Sleep Hygiene",
        "Lifestyle",
        "Wellbeing",
      ],
      source: "NHS",
      specialization: "Lifestyle & Wellbeing",
      url: "https://www.nhs.uk/live-well/sleep-and-tiredness/",
    },
  ];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredArticles = normalizedSearch
    ? articles.filter((article) => [
        article.title,
        article.description,
        article.specialization,
        article.source,
        ...article.tags,
      ].join(" ").toLowerCase().includes(normalizedSearch))
    : articles;


  const goContact = () => {
    setMenuOpen(false);

    setTimeout(() => {
      const footer = document.getElementById("medicare-footer");

      if (footer) {
        footer.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  };


  return (
    <div className="articles-page">






      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="articles-main">

        {/* PAGE HEADER */}

        <section className="articles-header">

          <div className="articles-heading">

            <div className="articles-section-label">
              HEALTHCARE ARTICLES
            </div>

            <h1>
              Articles & Daily Health Issues
            </h1>

            <p className="articles-subtitle">
              Explore trusted healthcare information about
              common health problems that people experience
              in everyday life.
            </p>

          </div>

          {/* AI BUTTON */}

          <div className="articles-header-buttons">

            <button
              type="button"
              className="articles-ai-button"
              onClick={() =>
                window.open(
                  "https://www.meetaugust.ai/prescription-reader",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              🤖 AI Prescription Analysis
            </button>

          </div>

        </section>

        {/* ==================================================
            ARTICLE LIST
        ================================================== */}

        <section className="article-search" aria-label="Search health problems">
          <label htmlFor="article-problem-search">Search your problems</label>
          <div className="article-search-control">
            <span aria-hidden="true">⌕</span>
            <input
              id="article-problem-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Try headache, fever, acidity, or back pain"
              autoComplete="off"
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")}>Clear</button>}
          </div>
          <p aria-live="polite">{normalizedSearch ? `${filteredArticles.length} matching article${filteredArticles.length === 1 ? "" : "s"}` : "Search by problem, symptom, or topic."}</p>
        </section>

        <section className="articles-list">

          {filteredArticles.map((article) => (

            <article
              className="article-list-item"
              key={article.id}
            >

              {/* ARTICLE ICON */}

              <div className="article-number">
                <span>✦</span>
              </div>

              {/* CONTENT */}

              <div className="article-content">

                <div className="article-top">

                  <span className="article-source">
                    {article.source}
                  </span>

                  <span className="article-specialization">
                    {article.specialization}
                  </span>

                </div>

                <h2>
                  {article.title}
                </h2>

                <p className="article-description">
                  {article.description}
                </p>

                {expandedArticleId === article.id && (
                  <div className="article-description" role="region" aria-label={`${article.title} details`}>
                    <h3>Article details</h3>
                    <p>{article.description}</p>
                    <p><strong>Topic:</strong> {article.specialization}</p>
                    <p><strong>Published by:</strong> {article.source}</p>
                    
                  </div>
                )}

                <div className="article-tags">

                  {article.tags.map(
                    (tag, tagIndex) => (
                      <span
                        className="article-tag"
                        key={tagIndex}
                      >
                        {tag}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* ACTION */}

              <div className="article-action">

                <button
                  type="button"
                  className="read-more-btn"
                  aria-expanded={expandedArticleId === article.id}
                  onClick={() => setExpandedArticleId((current) => current === article.id ? null : article.id)}
                >
                  <span>
                    {expandedArticleId === article.id ? "Show Less" : "Read Article"}
                  </span>

                  <span className="arrow">
                    ↗
                  </span>

                </button>

              </div>

            </article>

          ))}

          {filteredArticles.length === 0 && (
            <div className="article-search-empty" role="status">
              No articles match “{searchQuery}”. Try another health problem or symptom.
            </div>
          )}

        </section>

        {/* ==================================================
            MEDICAL NOTE
        ================================================== */}

        <div className="articles-footer-note">

          <span className="footer-icon">
            ✓
          </span>

          <p>
            Always consult a qualified healthcare
            professional for personalized medical advice.
          </p>

        </div>

      </main>





    </div>
  );
}

export default Articles;

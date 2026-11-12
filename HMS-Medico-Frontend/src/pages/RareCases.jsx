import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const rareCasesData = [
  {
    id: 1,
    title: "Rare Aortic Arch Replacement Using Frozen Elephant Trunk Technique",
    category: "Cardiac Surgery",
    date: "January 2026",
    hospital: "Max Super Speciality Hospital, Mohali",
    shortDescription:
      "A patient with a complex and life-threatening aortic arch dissection required immediate and advanced surgical intervention.",
    description: `
      A patient with a complex and life-threatening aortic arch dissection was
      recently admitted to Max Super Speciality Hospital, Mohali, requiring an
      immediate and advanced surgical intervention. The condition involved the
      aortic arch, the curved portion of the main artery carrying blood from the
      heart to the brain, arms, and lower body, an area known for its surgical
      complexity and high risk.

      The surgical team performed a complex aortic arch replacement using the
      Frozen Elephant Trunk technique. This advanced procedure combines open
      surgical replacement of the aortic arch with treatment of the descending
      thoracic aorta.

      The procedure required careful planning, advanced imaging, multidisciplinary
      coordination, and highly specialised cardiac and vascular surgical expertise.
      The successful intervention helped address the diseased portion of the aorta
      while providing a comprehensive approach to the patient's complex condition.

      Such procedures are generally undertaken in specialised cardiac centres where
      experienced cardiac surgeons, vascular surgeons, anaesthesiologists,
      intensivists, perfusionists, and supporting teams can work together.
    `,
  },

  {
    id: 2,
    title: "World's 1st Same-Day Discharge Bilateral Total Knee Replacement",
    category: "Orthopaedics",
    date: "10 January 2026",
    hospital: "Max Multi Speciality Centre, Panchsheel Park",
    shortDescription:
      "A 65-year-old woman underwent bilateral total knee replacement with same-day discharge following a carefully planned surgical and recovery pathway.",
    description: `
      At Max Multi Speciality Centre, Panchsheel Park, a 65-year-old woman from
      Agra underwent bilateral total knee replacement and was discharged on the
      same day following surgery.

      The procedure involved replacement of both knee joints during the same
      surgical episode. Bilateral knee replacement can require careful patient
      selection, detailed pre-operative evaluation, anaesthetic planning, pain
      management, early mobilisation, physiotherapy, and close post-operative
      monitoring.

      The clinical team used a coordinated perioperative pathway designed to
      support early mobilisation and recovery. Following surgery, the patient
      underwent appropriate monitoring and rehabilitation before being discharged.

      Same-day discharge following major joint replacement requires careful
      assessment of the patient's overall health, mobility, pain control, wound
      condition, support at home, and ability to safely follow rehabilitation
      instructions.

      The case demonstrates how advances in joint replacement techniques,
      perioperative care, anaesthesia, pain management, and rehabilitation can
      contribute to shorter hospital stays for appropriately selected patients.
    `,
  },

  {
    id: 3,
    title: "Bilateral Hand Transplantation from Female Donor",
    category: "Transplant Surgery",
    date: "Recent Case",
    hospital: "Max Healthcare",
    shortDescription:
      "A highly complex reconstructive transplantation procedure involving transplantation of both hands from a donor.",
    description: `
      Bilateral hand transplantation is an exceptionally complex form of
      reconstructive transplantation that requires extensive coordination between
      transplant surgeons, plastic and reconstructive surgeons, orthopaedic teams,
      vascular surgeons, anaesthesiologists, rehabilitation specialists, and
      immunology teams.

      In a bilateral hand transplant, the donated hands are carefully matched and
      prepared before transplantation. Surgeons must connect bones, tendons,
      arteries, veins, nerves, and other tissues with high precision.

      Following transplantation, the recipient requires long-term monitoring and
      immunosuppressive treatment to reduce the risk of rejection. Rehabilitation
      is also an important component of recovery because the patient needs to
      gradually develop strength, movement, coordination, and functional use of
      the transplanted hands.

      Hand transplantation represents a combination of advanced microsurgery,
      transplantation medicine, reconstructive surgery, immunology, and long-term
      rehabilitation.
    `,
  },

  {
    id: 4,
    title: "Complex Robotic-Assisted Cancer Surgery",
    category: "Cancer Care",
    date: "Recent Case",
    hospital: "Max Institute of Cancer Care",
    shortDescription:
      "A complex cancer surgery was performed using advanced minimally invasive and robotic-assisted surgical techniques.",
    description: `
      Complex cancer surgery can require the removal of tumours located near
      important organs, blood vessels, nerves, or other critical structures.
      Advanced surgical planning can help the clinical team determine the safest
      approach for an individual patient.

      In selected cases, robotic-assisted surgery can provide enhanced
      visualisation and precise instrument control. Depending on the tumour type,
      location, stage, and patient's overall condition, minimally invasive
      surgery may be considered as part of a broader multidisciplinary treatment
      plan.

      Cancer treatment often involves collaboration between medical oncologists,
      surgical oncologists, radiation oncologists, radiologists, pathologists,
      anaesthesiologists, and other specialists.

      The treatment approach is determined according to the individual patient's
      diagnosis and clinical circumstances.
    `,
  },

  {
    id: 5,
    title: "Complex Brain Tumour Surgery with Advanced Navigation",
    category: "Neurosurgery",
    date: "Recent Case",
    hospital: "Max Super Speciality Hospital",
    shortDescription:
      "Advanced image-guided navigation was used to support a complex neurosurgical procedure involving a brain tumour.",
    description: `
      Brain tumour surgery requires exceptional precision because tumours can be
      located close to areas responsible for movement, speech, vision, memory, and
      other important neurological functions.

      Advanced image-guided navigation can assist neurosurgeons in planning and
      performing surgery by providing detailed information about the location of
      the tumour and surrounding anatomical structures.

      Depending on the tumour type and location, surgery may be combined with
      pathology, molecular testing, radiation therapy, chemotherapy, targeted
      therapy, or other treatments.

      The overall treatment plan is developed according to the patient's diagnosis,
      tumour characteristics, neurological condition, and other relevant clinical
      factors.
    `,
  },

  {
    id: 6,
    title: "Rare Paediatric Cardiac Reconstruction",
    category: "Paediatric Cardiology",
    date: "Recent Case",
    hospital: "Max Healthcare",
    shortDescription:
      "A complex congenital heart condition in a child required specialised cardiac evaluation and reconstructive surgery.",
    description: `
      Congenital heart conditions can range from relatively simple abnormalities
      to highly complex anatomical defects involving multiple chambers, valves,
      blood vessels, or connections within the heart.

      Complex paediatric cardiac procedures require detailed imaging, careful
      anaesthetic planning, cardiopulmonary bypass support where required, and
      specialised post-operative intensive care.

      A multidisciplinary paediatric cardiac team may include paediatric
      cardiologists, cardiac surgeons, cardiac anaesthesiologists, intensivists,
      perfusionists, nurses, and rehabilitation specialists.

      Treatment decisions are based on the child's specific anatomy, age, clinical
      condition, and the nature of the congenital heart defect.
    `,
  },
];

function RareCases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCases, setVisibleCases] = useState(3);
  const [expandedCase, setExpandedCase] = useState(null);

  const filteredCases = rareCasesData.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.hospital.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const displayedCases = filteredCases.slice(0, visibleCases);

  const handleViewAll = () => {
    if (visibleCases >= filteredCases.length) {
      setVisibleCases(3);
    } else {
      setVisibleCases(filteredCases.length);
    }
  };

  const toggleDescription = (id) => {
    setExpandedCase(expandedCase === id ? null : id);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .rare-cases-section {
          width: 100%;
          padding: 90px 20px;
          background: #f7fafc;
          font-family: Arial, Helvetica, sans-serif;
          color: #172b4d;
        }

        .rare-cases-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .rare-cases-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          margin-bottom: 45px;
        }

        .section-label {
          display: inline-block;
          margin-bottom: 14px;
          color: #149b9b;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .rare-cases-header h1 {
          margin: 0;
          color: #142c4c;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.05;
          font-weight: 700;
          letter-spacing: -2px;
        }

        .rare-cases-header h1 span {
          color: #159c9d;
        }

        .rare-cases-header p {
          max-width: 700px;
          margin: 20px 0 0;
          color: #68788b;
          font-size: 16px;
          line-height: 1.8;
        }

        .view-all-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          min-width: 150px;
          padding: 15px 22px;
          border: 1px solid #159c9d;
          border-radius: 8px;
          background: #159c9d;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn span {
          font-size: 20px;
          line-height: 1;
          transition: transform 0.3s ease;
        }

        .view-all-btn:hover {
          background: #117f80;
          border-color: #117f80;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(21, 156, 157, 0.2);
        }

        .view-all-btn:hover span {
          transform: translateX(4px);
        }

        /* ================= SEARCH ================= */

        .rare-search-wrapper {
          margin-bottom: 18px;
        }

        .rare-search {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 700px;
          height: 58px;
          background: #fff;
          border: 1px solid #dfe7ed;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(30, 60, 90, 0.04);
          transition: all 0.3s ease;
        }

        .rare-search:focus-within {
          border-color: #159c9d;
          box-shadow: 0 5px 25px rgba(21, 156, 157, 0.12);
        }

        .search-icon {
          margin-left: 20px;
          color: #159c9d;
          font-size: 26px;
          transform: rotate(-20deg);
          display: inline-block;
        }

        .rare-search input {
          flex: 1;
          height: 100%;
          padding: 0 15px;
          border: none;
          outline: none;
          background: transparent;
          color: #253b53;
          font-size: 15px;
        }

        .rare-search input::placeholder {
          color: #9aa7b4;
        }

        .clear-search {
          width: 35px;
          height: 35px;
          margin-right: 12px;
          border: none;
          border-radius: 50%;
          background: #edf5f6;
          color: #567;
          font-size: 22px;
          line-height: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: #159c9d;
          color: #fff;
        }

        /* ================= RESULTS ================= */

        .results-info {
          margin-bottom: 25px;
          color: #81909e;
          font-size: 14px;
        }

        .results-info strong {
          color: #263f5a;
        }

        /* ================= GRID ================= */

        .rare-cases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ================= CARD ================= */

        .rare-case-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 470px;
          padding: 28px;
          background: #fff;
          border: 1px solid #e5ebef;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(20, 45, 70, 0.05);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .rare-case-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(
            90deg,
            #159c9d,
            #63caca
          );
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .rare-case-card:hover {
          transform: translateY(-7px);
          border-color: #d2e8e9;
          box-shadow: 0 18px 45px rgba(20, 45, 70, 0.11);
        }

        .rare-case-card:hover::before {
          transform: scaleX(1);
        }

        /* ================= CARD TOP ================= */

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .case-category {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 30px;
          background: #e9f7f7;
          color: #128d8e;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .case-date {
          color: #99a6b3;
          font-size: 12px;
          white-space: nowrap;
        }

        /* ================= ICON ================= */

        .case-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          margin-bottom: 22px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #e6f8f7,
            #f1fbfb
          );
          color: #159c9d;
          font-size: 32px;
          font-weight: 300;
          line-height: 1;
        }

        /* ================= TITLE ================= */

        .rare-case-card h2 {
          margin: 0 0 17px;
          color: #173552;
          font-size: 21px;
          line-height: 1.35;
          font-weight: 700;
        }

        /* ================= HOSPITAL ================= */

        .hospital-name {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 18px;
          color: #159c9d;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.5;
        }

        .hospital-icon {
          flex-shrink: 0;
          color: #159c9d;
          font-size: 18px;
        }

        /* ================= CONTENT ================= */

        .case-content {
          flex: 1;
        }

        .case-content > p {
          margin: 0;
          color: #6d7d8d;
          font-size: 14px;
          line-height: 1.75;
        }

        .full-description {
          max-height: 300px;
          overflow-y: auto;
          padding-right: 7px;
        }

        .full-description::-webkit-scrollbar {
          width: 4px;
        }

        .full-description::-webkit-scrollbar-track {
          background: #f1f5f6;
          border-radius: 10px;
        }

        .full-description::-webkit-scrollbar-thumb {
          background: #9dd8d8;
          border-radius: 10px;
        }

        .full-description p {
          margin: 0 0 15px;
          color: #6d7d8d;
          font-size: 13.5px;
          line-height: 1.75;
        }

        .full-description p:last-child {
          margin-bottom: 0;
        }

        /* ================= READ MORE ================= */

        .read-more-btn {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 12px;
          margin-top: 25px;
          padding: 0;
          border: none;
          background: transparent;
          color: #159c9d;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .read-more-btn span {
          display: inline-block;
          font-size: 19px;
          transition: transform 0.3s ease;
        }

        .read-more-btn:hover {
          color: #0d7778;
        }

        .read-more-btn:hover span {
          transform: translateX(4px);
        }

        .read-more-btn .rotate-arrow {
          transform: rotate(180deg);
        }

        /* ================= NO RESULTS ================= */

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 320px;
          padding: 50px 20px;
          background: #fff;
          border: 1px solid #e5ebef;
          border-radius: 14px;
          text-align: center;
        }

        .no-results-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          margin-bottom: 20px;
          border-radius: 50%;
          background: #e9f7f7;
          color: #159c9d;
          font-size: 32px;
          transform: rotate(-20deg);
        }

        .no-results h3 {
          margin: 0 0 10px;
          color: #173552;
          font-size: 22px;
        }

        .no-results p {
          margin: 0 0 20px;
          color: #7b8997;
          font-size: 14px;
        }

        .no-results button {
          padding: 11px 20px;
          border: none;
          border-radius: 7px;
          background: #159c9d;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .no-results button:hover {
          background: #117f80;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1050px) {
          .rare-cases-section {
            padding: 70px 20px;
          }

          .rare-cases-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .rare-cases-header {
            align-items: flex-start;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 700px) {
          .rare-cases-section {
            padding: 55px 16px;
          }

          .rare-cases-header {
            flex-direction: column;
            gap: 25px;
            margin-bottom: 30px;
          }

          .rare-cases-header h1 {
            font-size: 42px;
            letter-spacing: -1px;
          }

          .rare-cases-header p {
            font-size: 14px;
            line-height: 1.7;
          }

          .view-all-btn {
            width: 100%;
          }

          .rare-search {
            height: 54px;
          }

          .rare-cases-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .rare-case-card {
            min-height: auto;
            padding: 24px;
          }

          .card-top {
            align-items: flex-start;
          }

          .case-date {
            text-align: right;
            white-space: normal;
          }

          .rare-case-card h2 {
            font-size: 20px;
          }
        }

        /* ================= SMALL MOBILE ================= */

        @media (max-width: 430px) {
          .rare-cases-header h1 {
            font-size: 36px;
          }

          .section-label {
            font-size: 11px;
          }

          .rare-search input {
            font-size: 13px;
          }

          .card-top {
            flex-direction: column;
          }

          .case-date {
            align-self: flex-start;
          }

          .rare-case-card {
            padding: 20px;
          }
        }
      `}</style>

      <section className="rare-cases-section">
        <div className="rare-cases-container">

          {/* Header */}
          <div className="rare-cases-header">
            <div>
              <span className="section-label"><h1>PATIENT-STORIES</h1></span>

              <h1>
               <span>Rare-Cases</span>
              </h1>

              <p>
                Explore some of the complex and rare medical cases managed by
                specialised multidisciplinary teams using advanced treatment
                techniques and technology.
              </p>
            </div>

            <button
              className="view-all-btn"
              onClick={handleViewAll}
              type="button"
            >
              {visibleCases >= filteredCases.length
                ? "Show Less"
                : "View All"}
              <span>→</span>
            </button>
          </div>

          {/* Search */}
          <div className="rare-search-wrapper">
            <div className="rare-search">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search rare cases, specialties or hospitals..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCases(3);
                }}
              />

              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                  type="button"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="results-info">
            {searchTerm ? (
              <>
                Showing <strong>{filteredCases.length}</strong> result
                {filteredCases.length !== 1 ? "s" : ""} for "{searchTerm}"
              </>
            ) : (
              <>
                Showing <strong>{displayedCases.length}</strong> of{" "}
                <strong>{rareCasesData.length}</strong> cases
              </>
            )}
          </div>

          {/* Cards */}
          {displayedCases.length > 0 ? (
            <div className="rare-cases-grid">
              {displayedCases.map((item) => {
                const isExpanded = expandedCase === item.id;

                return (
                  <article
                    className="rare-case-card"
                    key={item.id}
                  >
                    {/* Card top */}
                    <div className="card-top">
                      <span className="case-category">
                        {item.category}
                      </span>

                      <span className="case-date">
                        {item.date}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="case-icon">
                      +
                    </div>

                    {/* Title */}
                    <h2>{item.title}</h2>

                    {/* Hospital */}
                    <div className="hospital-name">
                      <span className="hospital-icon">⌖</span>
                      {item.hospital}
                    </div>

                    {/* Description */}
                    <div className="case-content">
                      {!isExpanded ? (
                        <p>{item.shortDescription}</p>
                      ) : (
                        <div className="full-description">
                          {item.description
                            .trim()
                            .split("\n\n")
                            .map((paragraph, index) => (
                              <p key={index}>
                                {paragraph.trim()}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Read more */}
                    <button
                      className="read-more-btn"
                      type="button"
                      onClick={() => toggleDescription(item.id)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}

                      <span
                        className={
                          isExpanded ? "rotate-arrow" : ""
                        }
                      >
                        →
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">⌕</div>

              <h3>No rare cases found</h3>

              <p>
                Try searching with another case name, specialty,
                or hospital.
              </p>

              <button
                type="button"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default RareCases;


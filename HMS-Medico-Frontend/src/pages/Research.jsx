import React from "react";
import { Link } from "react-router-dom";

export default function Research() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Ananya Rao",
      slug: "dr-ananya-rao",
      specialty: "Cardiology",
      qualification: "MD, DM Cardiology",
      experience: "12 Years Experience",
      hospital: "MediCo Hyderabad - HiTechCity",
      email: "ananya.rao@medico.example",
      papers: [
        {
          title: "Advances in Early Detection of Cardiovascular Disease",
          journal: "International Journal of Cardiology Research",
          year: 2025,
          type: "Original Research",
          status: "Published",
        },
        {
          title: "Role of AI in Predicting Cardiac Risk",
          journal: "Journal of Digital Medicine",
          year: 2024,
          type: "Review Article",
          status: "Published",
        },
        {
          title: "Lifestyle Interventions and Heart Health Outcomes",
          journal: "Clinical Cardiology Review",
          year: 2023,
          type: "Clinical Study",
          status: "Published",
        },
      ],
    },

    {
      id: 2,
      name: "Dr. Rahul Mehta",
      slug: "dr-rahul-mehta",
      specialty: "Neurology",
      qualification: "MBBS, MD, DM Neurology",
      experience: "10 Years Experience",
      hospital: "MediCo Hyderabad - Kukatpally",
      email: "rahul.mehta@medico.example",
      papers: [
        {
          title: "Modern Approaches to Migraine Management",
          journal: "Neurology & Clinical Practice",
          year: 2025,
          type: "Clinical Study",
          status: "Published",
        },
        {
          title: "Machine Learning Applications in Neurological Diagnosis",
          journal: "Medical AI Journal",
          year: 2024,
          type: "Original Research",
          status: "Published",
        },
      ],
    },

    {
      id: 3,
      name: "Dr. Priya Sharma",
      slug: "dr-priya-sharma",
      specialty: "Oncology",
      qualification: "MBBS, MD Oncology",
      experience: "15 Years Experience",
      hospital: "MediCo Hyderabad - Charminar",
      email: "priya.sharma@medico.example",
      papers: [
        {
          title: "Personalized Cancer Treatment Strategies",
          journal: "Indian Journal of Oncology",
          year: 2025,
          type: "Research Paper",
          status: "Published",
        },
        {
          title: "Targeted Therapy in Breast Cancer",
          journal: "Cancer Research & Treatment",
          year: 2024,
          type: "Clinical Research",
          status: "Published",
        },
        {
          title: "Improving Cancer Screening Programs",
          journal: "Public Health Oncology",
          year: 2023,
          type: "Review Article",
          status: "Published",
        },
      ],
    },

    {
      id: 4,
      name: "Dr. Arjun Kumar",
      slug: "dr-arjun-kumar",
      specialty: "Orthopedics",
      qualification: "MBBS, MS Orthopedics",
      experience: "9 Years Experience",
      hospital: "MediCo Bangalore - Marthalli Road",
      email: "arjun.kumar@medico.example",
      papers: [
        {
          title: "Innovations in Minimally Invasive Joint Surgery",
          journal: "Journal of Orthopedic Surgery",
          year: 2025,
          type: "Original Research",
          status: "Published",
        },
        {
          title: "Postoperative Rehabilitation After Knee Replacement",
          journal: "Orthopedic Clinical Research",
          year: 2024,
          type: "Clinical Study",
          status: "Published",
        },
      ],
    },
  ];

  const totalPapers = doctors.reduce(
    (total, doctor) => total + doctor.papers.length,
    0
  );

  return (
    <div className="research-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .research-page {
          min-height: 100vh;
          background: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1e293b;
        }

        .research-header {
          background: linear-gradient(135deg, #075985, #0e7490);
          color: white;
          padding: 70px 20px;
          text-align: center;
        }

        .research-header h1 {
          margin: 0 0 15px;
          font-size: 42px;
        }

        .research-header p {
          margin: 0 auto;
          max-width: 700px;
          font-size: 17px;
          line-height: 1.7;
          color: #e0f2fe;
        }

        .research-container {
          width: 92%;
          max-width: 1200px;
          margin: 40px auto;
        }

        .page-intro {
          text-align: center;
          margin-bottom: 35px;
        }

        .page-intro h2 {
          margin-bottom: 10px;
          font-size: 30px;
          color: #0f172a;
        }

        .page-intro p {
          color: #64748b;
          font-size: 16px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 45px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          text-align: center;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
        }

        .stat-card strong {
          display: block;
          font-size: 32px;
          color: #0284c7;
          margin-bottom: 6px;
        }

        .stat-card span {
          color: #64748b;
          font-size: 14px;
        }

        .doctor-card {
          background: white;
          border-radius: 16px;
          margin-bottom: 30px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.07);
        }

        .doctor-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .doctor-avatar {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0891b2, #0369a1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .doctor-info {
          flex: 1;
        }

        .doctor-info h3 {
          margin: 0 0 7px;
          font-size: 23px;
          color: #0f172a;
        }

        .doctor-info .specialty {
          color: #0284c7;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .doctor-info p {
          margin: 4px 0;
          color: #64748b;
          font-size: 14px;
        }

        .doctor-contact {
          text-align: right;
        }

        .doctor-contact p {
          margin: 5px 0;
          font-size: 14px;
          color: #64748b;
        }

        .papers-section {
          padding: 25px;
        }

        .papers-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .papers-title h4 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
        }

        .paper-count {
          background: #e0f2fe;
          color: #0369a1;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
        }

        .paper {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
        }

        .paper:last-child {
          margin-bottom: 20px;
        }

        .paper:hover {
          border-color: #38bdf8;
          box-shadow: 0 5px 15px rgba(14, 116, 144, 0.08);
        }

        .paper h5 {
          margin: 0 0 8px;
          font-size: 17px;
          color: #0f172a;
        }

        .paper-journal {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .paper-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
        }

        .badge-type {
          background: #f1f5f9;
          color: #475569;
        }

        .badge-year {
          background: #ecfeff;
          color: #0e7490;
        }

        .badge-status {
          background: #dcfce7;
          color: #15803d;
        }

        .view-all-container {
          display: flex;
          justify-content: flex-end;
        }

        .view-all-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          background: #0284c7;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .view-all-button:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .research-header h1 {
            font-size: 32px;
          }

          .doctor-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .doctor-contact {
            text-align: left;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .papers-title {
            gap: 10px;
            align-items: flex-start;
          }

          .view-all-container {
            justify-content: flex-start;
          }
        }
      `}</style>

      <header className="research-header">
        <h1>Medical Research</h1>

        <p>
          Explore research contributions, publications, and academic
          work carried out by doctors and specialists at MediCo.
        </p>
      </header>

      <main className="research-container">
        <div className="page-intro">
          <h2>Doctors & Research Publications</h2>

          <p>
            Learn about our medical professionals and their published
            research work.
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <strong>{doctors.length}</strong>
            <span>Research Doctors</span>
          </div>

          <div className="stat-card">
            <strong>{totalPapers}</strong>
            <span>Research Papers</span>
          </div>

          <div className="stat-card">
            <strong>2023-2025</strong>
            <span>Publication Period</span>
          </div>
        </div>

        {doctors.map((doctor) => (
          <section className="doctor-card" key={doctor.id}>
            <div className="doctor-header">
              <div className="doctor-avatar">
                {doctor.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)}
              </div>

              <div className="doctor-info">
                <h3>{doctor.name}</h3>

                <div className="specialty">
                  {doctor.specialty}
                </div>

                <p>{doctor.qualification}</p>
                <p>{doctor.experience}</p>
                <p>{doctor.hospital}</p>
              </div>

              <div className="doctor-contact">
                <p>
                  <strong>Email:</strong>
                </p>

                <p>{doctor.email}</p>
              </div>
            </div>

            <div className="papers-section">
              <div className="papers-title">
                <h4>Research Papers</h4>

                <span className="paper-count">
                  {doctor.papers.length} Publications
                </span>
              </div>

              {doctor.papers.map((paper, index) => (
                <article className="paper" key={index}>
                  <h5>{paper.title}</h5>

                  <div className="paper-journal">
                    {paper.journal}
                  </div>

                  <div className="paper-meta">
                    <span className="badge badge-type">
                      {paper.type}
                    </span>

                    <span className="badge badge-year">
                      {paper.year}
                    </span>

                    <span className="badge badge-status">
                      {paper.status}
                    </span>
                  </div>
                </article>
              ))}


            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

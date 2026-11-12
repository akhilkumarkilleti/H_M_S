import React from "react";

export default function Investors() {
  const investors = [
    {
      name: "Arvind Healthcare Ventures",
      type: "Institutional Investor",
      investment: "₹120 Crore",
      since: "2021",
      focus: "Healthcare Infrastructure",
      description:
        "Long-term investment partner supporting MediCo's hospital expansion and advanced healthcare infrastructure.",
    },
    {
      name: "Sunrise Capital Partners",
      type: "Private Equity Investor",
      investment: "₹85 Crore",
      since: "2022",
      focus: "Digital Healthcare",
      description:
        "Supports digital transformation, patient technology platforms, and modern healthcare delivery systems.",
    },
    {
      name: "GreenLife Investment Group",
      type: "Strategic Investor",
      investment: "₹65 Crore",
      since: "2023",
      focus: "Speciality Care",
      description:
        "Strategic investment focused on developing speciality care centres and advanced clinical services.",
    },
    {
      name: "Horizon Growth Fund",
      type: "Healthcare Fund",
      investment: "₹50 Crore",
      since: "2024",
      focus: "Hospital Expansion",
      description:
        "Partnering with MediCo to expand its healthcare network across major cities and emerging regions.",
    },
  ];

  const financialHighlights = [
    {
      value: "₹320 Cr",
      label: "Total Investment",
    },
    {
      value: "4",
      label: "Major Investors",
    },
    {
      value: "12",
      label: "Healthcare Facilities",
    },
    {
      value: "8+",
      label: "Cities Served",
    },
  ];

  const resources = [
    {
      title: "Annual Reports",
      description:
        "Access annual reports, business performance information, and organizational updates.",
      icon: "📊",
    },
    {
      title: "Financial Information",
      description:
        "View financial highlights and key performance information for the hospital network.",
      icon: "💰",
    },
    {
      title: "Corporate Governance",
      description:
        "Learn about our governance structure, leadership, ethics, and compliance practices.",
      icon: "🏛️",
    },
    {
      title: "Investor Presentations",
      description:
        "Explore company presentations covering strategy, growth, and healthcare initiatives.",
      icon: "📈",
    },
  ];

  return (
    <div className="investors-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .investors-page {
          min-height: 100vh;
          background: #f5f8fc;
          color: #1e293b;
          font-family: Arial, Helvetica, sans-serif;
        }

        /* HERO */

        .investor-hero {
          background:
            linear-gradient(
              135deg,
              rgba(3, 105, 161, 0.96),
              rgba(15, 118, 110, 0.94)
            );
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .investor-hero h1 {
          font-size: 44px;
          margin: 0 0 16px;
          font-weight: 700;
        }

        .investor-hero p {
          max-width: 760px;
          margin: auto;
          line-height: 1.8;
          font-size: 17px;
          color: #e0f2fe;
        }

        .hero-buttons {
          margin-top: 28px;
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-button {
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .hero-button.primary {
          background: white;
          color: #0369a1;
        }

        .hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          color: white;
        }

        /* MAIN */

        .investor-container {
          width: 92%;
          max-width: 1200px;
          margin: 50px auto;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .section-heading h2 {
          margin: 0 0 10px;
          font-size: 30px;
          color: #0f172a;
        }

        .section-heading p {
          color: #64748b;
          max-width: 700px;
          margin: auto;
          line-height: 1.7;
        }

        /* FINANCIAL HIGHLIGHTS */

        .financial-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 65px;
        }

        .financial-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.05);
        }

        .financial-card strong {
          display: block;
          font-size: 30px;
          color: #0284c7;
          margin-bottom: 8px;
        }

        .financial-card span {
          color: #64748b;
          font-size: 14px;
        }

        /* INVESTORS */

        .investors-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 65px;
        }

        .investor-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 7px 24px rgba(15, 23, 42, 0.06);
          transition: all 0.25s ease;
        }

        .investor-card:hover {
          transform: translateY(-4px);
          border-color: #38bdf8;
          box-shadow: 0 12px 30px rgba(14, 116, 144, 0.12);
        }

        .investor-top {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .investor-logo {
          width: 58px;
          height: 58px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #0284c7,
            #0f766e
          );
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          font-weight: bold;
        }

        .investor-name h3 {
          margin: 0 0 5px;
          font-size: 19px;
          color: #0f172a;
        }

        .investor-type {
          color: #0284c7;
          font-size: 13px;
          font-weight: 600;
        }

        .investor-description {
          color: #64748b;
          line-height: 1.7;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .investor-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .detail-box {
          background: #f8fafc;
          border-radius: 9px;
          padding: 13px;
        }

        .detail-box small {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .detail-box strong {
          color: #334155;
          font-size: 14px;
        }

        /* WHY INVEST */

        .why-invest {
          background: white;
          border-radius: 18px;
          padding: 40px;
          margin-bottom: 65px;
          border: 1px solid #e2e8f0;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-top: 30px;
        }

        .why-item {
          padding: 20px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .why-icon {
          width: 45px;
          height: 45px;
          background: #e0f2fe;
          color: #0369a1;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          margin-bottom: 15px;
        }

        .why-item h3 {
          margin: 0 0 8px;
          color: #0f172a;
          font-size: 17px;
        }

        .why-item p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
          font-size: 14px;
        }

        /* RESOURCES */

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 65px;
        }

        .resource-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;
          transition: 0.2s ease;
        }

        .resource-card:hover {
          border-color: #38bdf8;
          transform: translateY(-3px);
        }

        .resource-icon {
          font-size: 30px;
          margin-bottom: 15px;
        }

        .resource-card h3 {
          margin: 0 0 10px;
          font-size: 17px;
          color: #0f172a;
        }

        .resource-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .resource-link {
          color: #0284c7;
          text-decoration: none;
          font-size: 14px;
          font-weight: bold;
        }

        .resource-link:hover {
          text-decoration: underline;
        }

        /* CONTACT */

        .investor-contact {
          background: linear-gradient(
            135deg,
            #0f172a,
            #164e63
          );
          color: white;
          border-radius: 18px;
          padding: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 50px;
        }

        .investor-contact h2 {
          margin: 0 0 10px;
          font-size: 27px;
        }

        .investor-contact p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.6;
        }

        .contact-button {
          display: inline-block;
          background: #0ea5e9;
          color: white;
          text-decoration: none;
          padding: 13px 22px;
          border-radius: 8px;
          font-weight: 600;
          white-space: nowrap;
        }

        .contact-button:hover {
          background: #0284c7;
        }

        /* FOOTER */

        .investor-footer {
          border-top: 1px solid #e2e8f0;
          padding: 25px 20px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .financial-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .why-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .investor-hero {
            padding: 55px 20px;
          }

          .investor-hero h1 {
            font-size: 32px;
          }

          .investors-grid {
            grid-template-columns: 1fr;
          }

          .financial-grid {
            grid-template-columns: 1fr;
          }

          .resources-grid {
            grid-template-columns: 1fr;
          }

          .investor-contact {
            flex-direction: column;
            align-items: flex-start;
            padding: 30px;
          }

          .investor-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="investor-hero">
        <h1>Investor Relations</h1>

        <p>
          Building a stronger healthcare ecosystem through responsible
          investment, sustainable growth, innovation, and high-quality
          patient care.
        </p>

        <div className="hero-buttons">
          <a href="#investors" className="hero-button primary">
            Our Investors
          </a>

          <a href="#resources" className="hero-button secondary">
            Investor Resources
          </a>
        </div>
      </section>

      <main className="investor-container">

        {/* FINANCIAL HIGHLIGHTS */}
        <section>
          <div className="section-heading">
            <h2>Investment Highlights</h2>
            <p>
              Key information about MediCo's investment network and
              healthcare expansion.
            </p>
          </div>

          <div className="financial-grid">
            {financialHighlights.map((item, index) => (
              <div className="financial-card" key={index}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* INVESTORS */}
        <section id="investors">
          <div className="section-heading">
            <h2>Our Investors</h2>
            <p>
              Our investment partners support MediCo's long-term vision
              for accessible and innovative healthcare.
            </p>
          </div>

          <div className="investors-grid">
            {investors.map((investor, index) => (
              <div className="investor-card" key={index}>
                <div className="investor-top">
                  <div className="investor-logo">
                    {investor.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)}
                  </div>

                  <div className="investor-name">
                    <h3>{investor.name}</h3>
                    <div className="investor-type">
                      {investor.type}
                    </div>
                  </div>
                </div>

                <p className="investor-description">
                  {investor.description}
                </p>

                <div className="investor-details">
                  <div className="detail-box">
                    <small>Investment</small>
                    <strong>{investor.investment}</strong>
                  </div>

                  <div className="detail-box">
                    <small>Since</small>
                    <strong>{investor.since}</strong>
                  </div>

                  <div className="detail-box">
                    <small>Focus</small>
                    <strong>{investor.focus}</strong>
                  </div>

                  <div className="detail-box">
                    <small>Sector</small>
                    <strong>Healthcare</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY INVEST */}
        <section className="why-invest">
          <div className="section-heading">
            <h2>Our Growth Priorities</h2>
            <p>
              MediCo continues to focus on sustainable healthcare
              development and patient-centered innovation.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">🏥</div>
              <h3>Healthcare Infrastructure</h3>
              <p>
                Expanding modern hospitals, speciality centres,
                diagnostic facilities, and emergency care services.
              </p>
            </div>

            <div className="why-item">
              <div className="why-icon">💡</div>
              <h3>Healthcare Innovation</h3>
              <p>
                Investing in technology, digital health platforms,
                research, and modern clinical practices.
              </p>
            </div>

            <div className="why-item">
              <div className="why-icon">🌱</div>
              <h3>Sustainable Growth</h3>
              <p>
                Building a responsible healthcare organization focused
                on long-term growth and community impact.
              </p>
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        <section id="resources">
          <div className="section-heading">
            <h2>Investor Resources</h2>
            <p>
              Access important information and resources for investors
              and stakeholders.
            </p>
          </div>

          <div className="resources-grid">
            {resources.map((resource, index) => (
              <div className="resource-card" key={index}>
                <div className="resource-icon">
                  {resource.icon}
                </div>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <a
                  href="#resource"
                  className="resource-link"
                  onClick={(e) => e.preventDefault()}
                >
                  View Details →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="investor-contact">
          <div>
            <h2>Investor Relations Team</h2>

            <p>
              For investor enquiries, partnership information, or
              corporate information, please contact our investor
              relations team.
            </p>

            <p style={{ marginTop: "10px" }}>
              Email: investors@medico.example
            </p>
          </div>

          <a
            href="mailto:investors@medico.example"
            className="contact-button"
          >
            Contact Investor Relations
          </a>
        </section>
      </main>


    </div>
  );
}

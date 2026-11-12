
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStaffPatients,
  getStaffAppointments,
  getReceptionHealthCheckups,
  addVitals,
  uploadLabReport,
  getPatientReports,
  getPharmacyPatient,
  getPharmacyPrescriptions,
  getPatientVitals,
  getStaffClinicalRecords,
  dispensePrescription,
  getStaffProfile,
  updateStaffProfile, getActiveDoctorsForStaff,
  getLabHealthCheckups, initializeHealthCheckup, completeHealthCheckup,
  deleteLabReport, replaceLabReport, getPharmacyHistory, initializeLabTest, getLabHistory,
} from "../services/staffService";
import { getApprovedDoctors } from "../services/publicDoctorService";
import LocalProfilePhoto from "../components/LocalProfilePhoto";

import { getPendingLabTests } from "../services/labTestService";

const roleLabels = {
  NURSE: "Nurse",
  RECEPTION: "Receptionist",
  LAB: "Laboratory",
  PHARMACY: "Pharmacy",
};

export default function StaffDashboard() {
  const navigate = useNavigate();

  const role = sessionStorage.getItem("adminRole") || "";
  const staffEmail = sessionStorage.getItem("adminEmail") || "";
  const staffId = sessionStorage.getItem("adminId") || "";

  const [profile, setProfile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileForm, setProfileForm] = useState({ fullName: "", phoneNumber: "", email: "", password: "" });

  const staffName = profile?.fullName || sessionStorage.getItem("adminName") || roleLabels[role] || role || "Staff";

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [records, setRecords] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [clinicalRecords, setClinicalRecords] = useState(null);
  const [activeDoctors, setActiveDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [healthCheckups, setHealthCheckups] = useState([]);
  const [labHistory, setLabHistory] = useState([]);
  const [pharmacyHistory, setPharmacyHistory] = useState([]);

  // IMPORTANT:
  // Only the selected section is displayed.
  const [activeView, setActiveView] = useState("dashboard");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [v, setV] = useState({
    patientId: "",
    bpSystolic: "",
    bpDiastolic: "",
    weightKg: "",
  });

  const [lab, setLab] = useState({
    patientId: "",
    labTestId: "",
    reportName: "",
    file: null,
  });

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    [
      "adminToken",
      "adminRole",
      "adminId",
      "adminEmail",
    ].forEach((key) => sessionStorage.removeItem(key));

    navigate("/admin/login", {
      replace: true,
    });
  };

  const loadProfile = async () => {
    try {
      setProfileError("");
      const response = await getStaffProfile();
      const data = response?.user || response?.staff || response;
      const fullName = data?.fullName || sessionStorage.getItem("adminName") || "";
      const phoneNumber = data?.phoneNumber || sessionStorage.getItem("adminPhone") || "";
      const email = data?.email || staffEmail;
      setProfile({ ...data, fullName, phoneNumber, email });
      setProfileForm({ fullName, phoneNumber, email, password: "" });
      if (fullName) sessionStorage.setItem("adminName", fullName);
      if (phoneNumber) sessionStorage.setItem("adminPhone", phoneNumber);
      if (email) sessionStorage.setItem("adminEmail", email);
    } catch (e) {
      setProfileError(e.response?.data?.message || "Unable to load profile.");
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileSaving(true); setProfileError(""); setProfileMessage("");
    try {
      const payload = { ...profileForm };
      if (!payload.password) delete payload.password;
      const result = await updateStaffProfile(payload);
      if (result?.token) sessionStorage.setItem("adminToken", result.token);
      if (result?.email) sessionStorage.setItem("adminEmail", result.email);
      if (result?.user?.fullName) sessionStorage.setItem("adminName", result.user.fullName);
      if (result?.user?.phoneNumber) sessionStorage.setItem("adminPhone", result.user.phoneNumber);
      setProfile(result?.user || { ...profile, ...payload });
      setProfileForm((current) => ({ ...current, password: "", email: result?.email || current.email }));
      setProfileMessage(result?.message || "Profile updated successfully.");
    } catch (e) {
      setProfileError(e.response?.data?.message || "Unable to update profile.");
    } finally { setProfileSaving(false); }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  const load = async (section = activeView) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const staffRole =
        role.toLowerCase() === "reception"
          ? "reception"
          : role.toLowerCase();

      if ((section === "dashboard" || section === "doctors") && (role === "NURSE" || role === "RECEPTION")) {
        const [doctorsData, approvedDoctors] = await Promise.all([getActiveDoctorsForStaff(), getApprovedDoctors()]);
        setActiveDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setAllDoctors(Array.isArray(approvedDoctors) ? approvedDoctors : []);
      }

      if (section === "patients" || section === "vitals") {
        const patientData = await getStaffPatients(staffRole);

        setPatients(
          Array.isArray(patientData)
            ? patientData
            : []
        );
      }

      if (
        section === "appointments" &&
        role === "RECEPTION"
      ) {
        const appointmentData =
          await getStaffAppointments();

        setAppointments(
          Array.isArray(appointmentData)
            ? appointmentData
            : []
        );
      }

      if (section === "reception-health-checkups" && role === "RECEPTION") {
        const data = await getReceptionHealthCheckups();
        setHealthCheckups(Array.isArray(data) ? data : []);
      }

      if (
        section === "pharmacy" &&
        role === "PHARMACY"
      ) {
        const prescriptionData =
          await getPharmacyPrescriptions();

        setRecords(
          Array.isArray(prescriptionData)
            ? prescriptionData
            : []
        );
      }

      if (
        section === "lab" &&
        role === "LAB"
      ) {
        const testData =
          await getPendingLabTests();

        setLabTests(
          Array.isArray(testData)
            ? testData
            : []
        );
      }

      if (section === "health-checkups" && role === "LAB") {
        const data = await getLabHealthCheckups();
        setHealthCheckups(Array.isArray(data) ? data : []);
      }

      if (section === "lab-history" && role === "LAB") {
        const data = await getLabHistory();
        setLabHistory(Array.isArray(data) ? data : []);
      }

      if (section === "pharmacy-history" && role === "PHARMACY") {
        const data = await getPharmacyHistory();
        setPharmacyHistory(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(
        "Unable to load staff data:",
        e
      );

      if (
        e.response?.status === 401 ||
        e.response?.status === 403
      ) {
        logout();
        return;
      }

      setError(
        e.response?.data?.message ||
          "Unable to load staff data."
      );
    } finally {
      setLoading(false);
    }
  };

  // Do NOT load dashboard data.
  // Dashboard only contains role information and quick actions.
  useEffect(() => {
    setActiveView("dashboard");
    if (role === "NURSE" || role === "RECEPTION") load("dashboard");
  }, [role]);

  useEffect(() => {
    if (role !== "RECEPTION" || activeView !== "appointments") return undefined;
    const timer = window.setInterval(async () => {
      try {
        const data = await getStaffAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to refresh reception appointment payment statuses:", err);
      }
    }, 15000);
    return () => window.clearInterval(timer);
  }, [role, activeView]);


  // SIDEBAR NAVIGATION
    const openStaffSection = async (view) => {
    setActiveView(view);

    // Clear section-specific data
    setSelected(null);
    setRecords([]);
    setClinicalRecords(null);
    setError("");
    setMessage("");

    // Dashboard requires no API call.
    if (view === "dashboard") {
      return;
    }
    if (view === "profile") {
      await loadProfile();
      return;
    }
    await load(view);
  };


  // REFRESH CURRENT SECTION

  const refreshDashboard = async () => {
    setSelected(null);
    setRecords([]);
    setClinicalRecords(null);
    setError("");
    setMessage("");

    if (activeView === "dashboard") {
      if (role === "NURSE" || role === "RECEPTION") await load("dashboard");
      return;
    }

    await load(activeView);
  };

  // =========================================================
  // SHOW PATIENT
  // =========================================================

  const showPatient = async (patient) => {
    setSelected(patient);
    setMessage("");
    setError("");

    try {
      if (role === "NURSE") {
        const clinical =
          await getStaffClinicalRecords(
            patient.id
          );

        setClinicalRecords(clinical);

        const data =
          await getPatientVitals(
            patient.id
          );

        setRecords(
          Array.isArray(data)
            ? data
            : []
        );
      }

      if (role === "LAB") {
        const data =
          await getPatientReports(
            patient.id
          );

        setRecords(
          Array.isArray(data)
            ? data
            : []
        );
      }

      if (role === "PHARMACY") {
        const data =
          await getPharmacyPatient(
            patient.id
          );

        setRecords(
          Array.isArray(
            data?.prescriptions
          )
            ? data.prescriptions
            : []
        );
      }
    } catch (e) {
      console.error(
        "Unable to load patient data:",
        e
      );

      setError(
        e.response?.data?.message ||
          "Unable to load patient data."
      );
    }
  };


  // SHOW PATIENT CLINICAL RECORDS
    const showPatientClinical = async (
    patient
  ) => {
    setSelected(patient);
    setMessage("");
    setError("");

    try {
      const data =
        await getStaffClinicalRecords(
          patient.id
        );

      setClinicalRecords(data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load patient clinical records."
      );
    }
  };

  const openClinicalFile = async (type, row) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const path = type === "lab"
        ? `/patient-records/reports/file/${row.id}`
        : `/medical-reports/file/${encodeURIComponent(row.file)}`;
      const response = await fetch(`http://localhost:8080/api${path}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Unable to open file");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (e) { setError(e.message || "Unable to open file."); }
  };


  // SAVE VITALS


  const saveVitals = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await addVitals({
        ...v,
        patientId: Number(v.patientId),
        bpSystolic: Number(v.bpSystolic),
        bpDiastolic: Number(v.bpDiastolic),
        weightKg: Number(v.weightKg),
      });

      setMessage(
        "Vitals saved successfully."
      );

      const patient =
        patients.find(
          (p) =>
            String(p.id) ===
            String(v.patientId)
        );

      setV({
        patientId: "",
        bpSystolic: "",
        bpDiastolic: "",
        weightKg: "",
      });

     if (patient) {
       try {
         const data = await getPatientVitals(patient.id);
         setRecords(Array.isArray(data) ? data : []);
         setSelected(patient);
       } catch (refreshError) {
         console.error("Unable to refresh patient vitals:", refreshError);
         setError("Vitals saved, but unable to refresh the patient records.");
       }
     }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to save vitals."
      );
    }
  };


  // DISPENSE PRESCRIPTION


  const dispense = async (
    prescriptionId
  ) => {
    try {
      setError("");
      setMessage("");

      await dispensePrescription(
        prescriptionId
      );

      setMessage(
        "Medicine marked as dispensed successfully."
      );

      await load("pharmacy");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to dispense medicine."
      );
    }
  };

  // =========================================================
  // UPLOAD LAB REPORT
  // =========================================================

  const upload = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (!lab.file) {
        throw new Error(
          "Please select a report photo or file."
        );
      }

      await uploadLabReport(
        Number(lab.patientId),
        lab.reportName,
        lab.file,
        lab.labTestId
          ? Number(lab.labTestId)
          : undefined
      );

      setMessage(
        "Medical report uploaded successfully."
      );

      setLab({
        patientId: "",
        labTestId: "",
        reportName: "",
        file: null,
      });

      // Stay on LAB section.
      await load("lab");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          "Upload failed."
      );
    }
  };

  const initializeSelectedLabTest = async () => {
    if (!lab.labTestId) { setError("Select a doctor-suggested lab test first."); return; }
    const selectedTest = labTests.find(t => String(t.id) === String(lab.labTestId));
    if (!selectedTest) return;
    if (selectedTest.paymentStatus !== "PAID") { setError("Patient payment is still pending. Initialize the test after payment is confirmed."); return; }
    try {
      setError(""); setMessage("");
      await initializeLabTest(selectedTest.id);
      setMessage("Sample recorded. Lab test is now WAITING_FOR_RESULT.");
      await load("lab");
    } catch (e) { setError(e.response?.data?.message || "Unable to initialize lab test."); }
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const totalPatients = patients.length;
  const totalAppointments =
    appointments.length;
  const pendingLabTests =
    labTests.length;
  const totalPrescriptions =
    records.length;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>

          <h3>
            Loading {staffName} Dashboard...
          </h3>

          <p>
            Please wait while we load your
            staff portal.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div style={styles.page}>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside style={styles.sidebar}>

        {/* BRAND */}

        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            +
          </div>

          <div onClick={() => window.location.reload()}
                 style={{ cursor: "pointer" }}>
            <h2 style={styles.brandTitle}>
               MediCo
            </h2>

            <p style={styles.brandSubtitle}>
              {role} Portal
            </p>
          </div>
        </div>

        {/* STAFF */}

        <div style={styles.staffBox}>
          <div style={{ ...styles.staffAvatar, display: "none" }}>
            {staffName
              .charAt(0)
              .toUpperCase()}
          </div>
          <LocalProfilePhoto role={role || "STAFF"} userKey={staffEmail || staffId} name={staffName} size={48} />

          <div style={styles.staffInfo}>
            <strong>
              {staffName}
            </strong>

            <span style={styles.staffAccount}>
              ID: {staffId || "-"}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="dashboard-sidebar-nav-scroll" style={styles.sidebarNavScroll}>
          <nav style={styles.nav}>

            {/* DASHBOARD */}

            <button
              type="button"
              style={{
                ...styles.navItem,
                ...(activeView ===
                "dashboard"
                  ? styles.activeNavItem
                  : {}),
              }}
              onClick={() =>
                openStaffSection(
                  "dashboard"
                )
              }
            >
              <span style={styles.navIcon}>
                📊
              </span>

              <span>
                Dashboard
              </span>
            </button>

            {(role === "NURSE" || role === "RECEPTION") && (
              <button type="button" style={{ ...styles.navItem, ...(activeView === "doctors" ? styles.activeNavItem : {}) }} onClick={() => openStaffSection("doctors")}>
                <span style={styles.navIcon}>👨‍⚕️</span><span>Doctors</span>
              </button>
            )}

            {/* PROFILE */}
            <button
              type="button"
              style={{ ...styles.navItem, ...(activeView === "profile" ? styles.activeNavItem : {}) }}
              onClick={() => openStaffSection("profile")}
            >
              <span style={styles.navIcon}>👤</span>
              <span>My Profile</span>
            </button>

            {/* PATIENTS */}

            <button
              type="button"
              style={{
                ...styles.navItem,
                ...(activeView ===
                "patients"
                  ? styles.activeNavItem
                  : {}),
              }}
              onClick={() =>
                openStaffSection(
                  "patients"
                )
              }
            >
              <span style={styles.navIcon}>
                👥
              </span>

              <span>
                Patients
              </span>

              {activeView ===
                "patients" && (
                <span
                  style={
                    styles.navBadgeBlue
                  }
                >
                  {totalPatients}
                </span>
              )}
            </button>

            {/* RECEPTION */}

            {role === "RECEPTION" && (
              <button
                type="button"
                style={{
                  ...styles.navItem,
                  ...(activeView ===
                  "appointments"
                    ? styles.activeNavItem
                    : {}),
                }}
                onClick={() =>
                  openStaffSection(
                    "appointments"
                  )
                }
              >
                <span style={styles.navIcon}>
                  📅
                </span>

                <span>
                  Appointments
                </span>

                {totalAppointments >
                  0 && (
                  <span
                    style={
                      styles.navBadge
                    }
                  >
                    {totalAppointments}
                  </span>
                )}
              </button>
            )}

            {role === "RECEPTION" && (
              <button type="button" style={{ ...styles.navItem, ...(activeView === "reception-health-checkups" ? styles.activeNavItem : {}) }} onClick={() => openStaffSection("reception-health-checkups")}>
                <span style={styles.navIcon}>🩺</span><span>Health Checkups</span>
              </button>
            )}

            {/* NURSE */}

            {role === "NURSE" && (
              <button
                type="button"
                style={{
                  ...styles.navItem,
                  ...(activeView ===
                  "vitals"
                    ? styles.activeNavItem
                    : {}),
                }}
                onClick={() =>
                  openStaffSection(
                    "vitals"
                  )
                }
              >
                <span style={styles.navIcon}>
                  ❤️
                </span>

                <span>
                  Patient Vitals
                </span>
              </button>
            )}

            {/* LAB */}

            {role === "LAB" && (
              <button
                type="button"
                style={{
                  ...styles.navItem,
                  ...(activeView === "lab"
                    ? styles.activeNavItem
                    : {}),
                }}
                onClick={() =>
                  openStaffSection("lab")
                }
              >
                <span style={styles.navIcon}>
                  🧪
                </span>

                <span>
                  Lab Reports
                </span>

                {pendingLabTests >
                  0 && (
                  <span
                    style={
                      styles.navBadge
                    }
                  >
                    {pendingLabTests}
                  </span>
                )}
              </button>
            )}

            {/* LAB HEALTH CHECKUPS */}
            {role === "LAB" && (
              <button type="button" style={{...styles.navItem, ...(activeView === "health-checkups" ? styles.activeNavItem : {})}} onClick={() => openStaffSection("health-checkups")}>
                <span style={styles.navIcon}>🩺</span><span>Health Checkups</span>
              </button>
            )}

            {role === "LAB" && (
              <button type="button" style={{...styles.navItem, ...(activeView === "lab-history" ? styles.activeNavItem : {})}} onClick={() => openStaffSection("lab-history")}>
                <span style={styles.navIcon}>🗂️</span><span>Lab History</span>
              </button>
            )}

            {/* PHARMACY */}

            {role === "PHARMACY" && (
              <button
                type="button"
                style={{
                  ...styles.navItem,
                  ...(activeView ===
                  "pharmacy"
                    ? styles.activeNavItem
                    : {}),
                }}
                onClick={() =>
                  openStaffSection(
                    "pharmacy"
                  )
                }
              >
                <span style={styles.navIcon}>
                  💊
                </span>

                <span>
                  Prescriptions
                </span>
              </button>
            )}

            {role === "PHARMACY" && (
              <button type="button" style={{...styles.navItem, ...(activeView === "pharmacy-history" ? styles.activeNavItem : {})}} onClick={() => openStaffSection("pharmacy-history")}>
                <span style={styles.navIcon}>🗂️</span><span>Given Medicine History</span>
              </button>
            )}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}

        <div style={styles.sidebarBottom}>
          <button
            type="button"
            onClick={logout}
            style={styles.sidebarLogout}
          >
            <span>🚪</span>
            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main style={styles.main}>

        {/* HEADER */}

        <div style={styles.topHeader}>
          <div>
            <h1 style={styles.title}>
              {staffName} Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome!. Manage patients
              and your assigned healthcare
              tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshDashboard}
            style={styles.refreshButton}
          >
            🔄 Refresh
          </button>
        </div>

        {/* ALERTS */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {message && (
          <div style={styles.success}>
            ✓ {message}
          </div>
        )}

        {/* =====================================================
            DASHBOARD ONLY
            This is the important fix.
            Everything below is wrapped inside activeView.
        ====================================================== */}

        {activeView === "dashboard" && (
          <>
            {/* WELCOME CARD */}

            <div style={styles.welcomeCard}>
              <div style={styles.welcomeLeft}>
                <div style={styles.largeAvatar}>
                  {staffName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <span
                    style={
                      styles.welcomeSmall
                    }
                  >
                    Welcome !!
                  </span>

                  <h2
                    style={
                      styles.welcomeName
                    }
                  >
                    {staffName}
                  </h2>

                  <p
                    style={
                      styles.welcomeDescription
                    }
                  >
                  MediCo Healthcare Staff Portal
                  </p>
                </div>
              </div>

              <div style={styles.statusArea}>
                <span
                  style={styles.statusLabel}
                >
                  Account Role
                </span>

                <span
                  style={styles.roleBadge}
                >
                  {role || "STAFF"}
                </span>
              </div>
            </div>

            {/* STATS */}

            <div style={styles.statsGrid}>
              <StatCard
                icon="👥"
                label="Total Patients"
                value={totalPatients}
                iconStyle="blue"
              />

              {role === "RECEPTION" && (
                <StatCard
                  icon="📅"
                  label="Appointments"
                  value={totalAppointments}
                  iconStyle="purple"
                />
              )}

              {role === "LAB" && (
                <StatCard
                  icon="🧪"
                  label="Pending Lab Tests"
                  value={pendingLabTests}
                  iconStyle="yellow"
                />
              )}

              {role === "PHARMACY" && (
                <StatCard
                  icon="💊"
                  label="Prescriptions"
                  value={totalPrescriptions}
                  iconStyle="green"
                />
              )}

              {role === "NURSE" && (
                <StatCard
                  icon="❤️"
                  label="Vitals Module"
                  value="Active"
                  iconStyle="red"
                />
              )}

              <StatCard
                icon="🏥"
                label="Department"
                value={staffName}
                iconStyle="blue"
              />

              <StatCard
                icon="🔐"
                label="Access Level"
                value="Staff"
                iconStyle="green"
              />
            </div>

            {(role === "NURSE" || role === "RECEPTION") && <div style={styles.activeDoctorsCard}><div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🩺 Active Doctors Today</h2><p style={styles.sectionSubtitle}>Doctors scheduled as available today.</p></div><span style={styles.countBadge}>{activeDoctors.length} Active</span></div>{activeDoctors.length===0?<div style={styles.emptyInline}>No doctors have marked themselves active for today.</div>:<div style={styles.doctorGrid}>{activeDoctors.map(d=><div key={d.id} style={styles.doctorMiniCard}><div style={styles.doctorMiniAvatar}>Dr</div><div><strong>{d.fullName}</strong><span>{d.specialization||"Doctor"}</span><small>{d.startTime||""}{d.endTime?` - ${d.endTime}`:""}</small><small>{d.hospitalName||d.city||""}</small></div></div>)}</div>}</div>}

            {/* QUICK ACTIONS */}

            <div style={styles.sectionHeader}>
              <div>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  ⚡ Quick Actions
                </h2>

                <p
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Quickly access your staff
                  responsibilities.
                </p>
              </div>
            </div>

            <div style={styles.quickActions}>

              <button
                type="button"
                style={styles.actionCard}
                onClick={() =>
                  openStaffSection(
                    "patients"
                  )
                }
              >
                <span
                  style={
                    styles.actionIcon
                  }
                >
                  👥
                </span>

                <div>
                  <strong>
                    Patients
                  </strong>

                  <span>
                    View patient information
                  </span>
                </div>
              </button>

              {role === "NURSE" && (
                <button
                  type="button"
                  style={styles.actionCard}
                  onClick={() =>
                    openStaffSection(
                      "vitals"
                    )
                  }
                >
                  <span
                    style={
                      styles.actionIcon
                    }
                  >
                    ❤️
                  </span>

                  <div>
                    <strong>
                      Record Vitals
                    </strong>

                    <span>
                      Record BP and weight
                    </span>
                  </div>
                </button>
              )}

              {role === "RECEPTION" && (
                <button
                  type="button"
                  style={styles.actionCard}
                  onClick={() =>
                    openStaffSection(
                      "appointments"
                    )
                  }
                >
                  <span
                    style={
                      styles.actionIcon
                    }
                  >
                    📅
                  </span>

                  <div>
                    <strong>
                      Appointments
                    </strong>

                    <span>
                      View patient schedules
                    </span>
                  </div>
                </button>
              )}

              {role === "LAB" && (
                <button
                  type="button"
                  style={styles.actionCard}
                  onClick={() =>
                    openStaffSection("lab")
                  }
                >
                  <span
                    style={
                      styles.actionIcon
                    }
                  >
                    🧪
                  </span>

                  <div>
                    <strong>
                      Upload Report
                    </strong>

                    <span>
                      Upload patient lab
                      reports
                    </span>
                  </div>
                </button>
              )}

              {role === "PHARMACY" && (
                <button
                  type="button"
                  style={styles.actionCard}
                  onClick={() =>
                    openStaffSection(
                      "pharmacy"
                    )
                  }
                >
                  <span
                    style={
                      styles.actionIcon
                    }
                  >
                    💊
                  </span>

                  <div>
                    <strong>
                      Prescriptions
                    </strong>

                    <span>
                      View doctor
                      prescriptions
                    </span>
                  </div>
                </button>
              )}
            </div>
          </>
        )}

        {/* DOCTORS FOR NURSE AND RECEPTION */}
        {(role === "NURSE" || role === "RECEPTION") && activeView === "doctors" && (() => {
          const activeIds = new Set(activeDoctors.map((doctor) => String(doctor.id)));
          const otherDoctors = allDoctors.filter((doctor) => !activeIds.has(String(doctor.id)));
          const doctorCard = (doctor, available) => (
            <article key={[available ? "available" : "other", doctor.id].join("-")} style={styles.doctorMiniCard}>
              <div style={styles.doctorMiniAvatar}>Dr</div>
              <div>
                <strong>{doctor.fullName || "Doctor"}</strong>
                <span style={{ display: "block", color: "var(--db-muted)", fontSize: 13 }}>{doctor.specialization || doctor.qualification || "Medical specialist"}</span>
                {available && <small style={{ display: "block", color: "var(--db-muted)" }}>{doctor.startTime ? doctor.startTime + (doctor.endTime ? " – " + doctor.endTime : "") : "Available today"}{doctor.hospitalName ? " · " + doctor.hospitalName : ""}</small>}
                {!available && <small style={{ display: "block", color: "var(--db-muted)" }}>{doctor.hospitalName || doctor.city || ""}</small>}
              </div>
            </article>
          );
          return <section style={styles.section}>
            <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>👨‍⚕️ Doctors</h2><p style={styles.sectionSubtitle}>Doctors available today are listed first, followed by the other approved doctors.</p></div></div>
            <div style={styles.activeDoctorsCard}>
              <div style={styles.sectionHeader}><h3 style={styles.cardHeading}>Available Today</h3><span style={styles.countBadge}>{activeDoctors.length} Available</span></div>
              {activeDoctors.length ? <div style={styles.doctorGrid}>{activeDoctors.map((doctor) => doctorCard(doctor, true))}</div> : <div style={styles.emptyInline}>No doctors are available today.</div>}
            </div>
            <div style={styles.activeDoctorsCard}>
              <div style={styles.sectionHeader}><h3 style={styles.cardHeading}>Other Doctors</h3><span style={styles.countBadge}>{otherDoctors.length} Doctors</span></div>
              {otherDoctors.length ? <div style={styles.doctorGrid}>{otherDoctors.map((doctor) => doctorCard(doctor, false))}</div> : <div style={styles.emptyInline}>No other approved doctors.</div>}
            </div>
          </section>;
        })()}

        {activeView === "profile" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>👤 My Profile</h2>
                <p style={styles.sectionSubtitle}>Edit your staff name, phone number, email and password.</p>
              </div>
            </div>
            {profileError && <div style={styles.error}>{profileError}</div>}
            {profileMessage && <div style={styles.success}>✓ {profileMessage}</div>}
            <div style={styles.profileCard}>
              <div style={styles.profileAvatar}>{staffName.charAt(0).toUpperCase()}</div>
              <form onSubmit={saveProfile} style={styles.profileForm}>
                <div style={styles.profileGrid}>
                  <label style={styles.profileField}><span>Staff Name *</span><input type="text" required value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} style={styles.input} /></label>
                  <label style={styles.profileField}><span>Phone Number *</span><input type="tel" required pattern="[6-9][0-9]{9}" maxLength={10} value={profileForm.phoneNumber} onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })} style={styles.input} /></label>
                  <label style={styles.profileField}><span>Email *</span><input type="email" required value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} style={styles.input} /></label>
                  <label style={styles.profileField}><span>New Password</span><input type="password" minLength={6} placeholder="Leave blank to keep current" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} style={styles.input} /></label>
                </div>
                <div style={styles.profileRole}>Role: <strong>{role || "STAFF"}</strong> &nbsp; | &nbsp; Staff ID: <strong>{staffId || "-"}</strong></div>
                <button type="submit" disabled={profileSaving} style={styles.profileSave}>{profileSaving ? "Saving..." : "Save Changes"}</button>
              </form>
            </div>
          </section>
        )}

        {activeView === "patients" && (
          <>
            <div
              style={styles.sectionHeader}
            >
              <div>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  👥 Patients
                </h2>

                <p
                  style={
                    styles.sectionSubtitle
                  }
                >
                  View and manage patient
                  information.
                </p>
              </div>

              <span
                style={styles.countBadge}
              >
                {totalPatients} Patients
              </span>
            </div>

            <div style={styles.card}>
              <div style={styles.tableWrap}>
                <table style={styles.table}>

                  <thead>
                    <tr>
                      <th style={styles.th}>
                        ID
                      </th>

                      <th style={styles.th}>
                        Patient
                      </th>

                      <th style={styles.th}>
                        Gender
                      </th>

                      <th style={styles.th}>
                        Age
                      </th>

                      <th style={styles.th}>
                        Phone
                      </th>

                      <th style={styles.th}>
                        Email
                      </th>

                      {role ==
                        "RECEPTION" && (
                        <th
                          style={
                            styles.th
                          }
                        >
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {patients.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={
                            role ===
                            "RECEPTION"
                              ? 6
                              : 7
                          }
                          style={
                            styles.emptyTable
                          }
                        >
                          No patients
                          available.
                        </td>
                      </tr>
                    ) : (
                      patients.map(
                        (patient) => (
                          <tr
                            key={
                              patient.id
                            }
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              {patient.id}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <div
                                style={
                                  styles.patientCell
                                }
                              >
                                <div
                                  style={
                                    styles.patientAvatar
                                  }
                                >
                                  👤
                                </div>

                                <strong>
                                  {patient.patientName ||
                                    "Patient"}
                                </strong>
                              </div>
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {patient.patientGender ||
                                "-"}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {patient.patientAge ??
                                "-"}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {patient.phoneNumber ||
                                "-"}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {patient.email ||
                                "-"}
                            </td>




                            {true && (
                              <td
                                style={
                                  styles.td
                                }
                              >
                                <button
                                  type="button"
                                  style={
                                    styles.viewButton
                                  }
                                  onClick={() =>
                                    showPatient(
                                      patient
                            )
                                  }
                                >
                                  👁 View
                                </button>


                              </td>
                            )}
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CLINICAL RECORDS */}

            {clinicalRecords && (
              <div style={styles.card}>
                <div
                  style={
                    styles.sectionHeader
                  }
                >
                  <div>
                    <h2
                      style={
                        styles.sectionTitle
                      }
                    >
                      📋 Clinical Records —{" "}
                      {clinicalRecords
                        .patient
                        ?.patientName ||
                        selected?.patientName ||
                        "Patient"}
                    </h2>

                    <p
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      Profile, old medical history, lab tests, health checkups,
                      reports, prescriptions and vitals.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={
                      styles.closeButton
                    }
                    onClick={() =>
                      setClinicalRecords(
                        null
                      )
                    }
                  >
                    ✕ Close Records
                  </button>
                </div>

                <ClinicalRecordList
                  title="🧪 Lab Tests"
                  rows={
                    clinicalRecords.labTests
                  }
                  fields={[
                    "testName",
                    "status",
                    "suggestedAt",
                  ]}
                />

                <ClinicalRecordList
                  title="🩺 Health Checkups"
                  rows={clinicalRecords.healthCheckups}
                  fields={["packageName", "visitType", "visitDate", "status", "paymentStatus"]}
                />

                <ClinicalRecordList
                  title="📄 Lab Reports"
                  rows={
                    clinicalRecords.labReports
                  }
                  fields={[
                    "reportName",
                    "uploadedAt",
                  ]}
                  onViewFile={(row) => openClinicalFile("lab", row)}
                />

                <ClinicalRecordList
                  title="📁 Old Medical History"
                  rows={
                    clinicalRecords.oldMedicalRecords
                  }
                  fields={[
                    "fileName",
                    "createdAt",
                  ]}
                  onViewFile={(row) => openClinicalFile("old", row)}
                />

                <ClinicalRecordList
                  title="💊 Prescriptions"
                  rows={
                    clinicalRecords.prescriptions
                  }
                  fields={[
                    "medicine",
                    "dosage",
                    "duration",
                    "dispensed",
                  ]}
                />

                <ClinicalRecordList
                  title="❤️ Vitals"
                  rows={
                    clinicalRecords.vitals
                  }
                  fields={[
                    "bpSystolic",
                    "bpDiastolic",
                    "weightKg",
                    "recordedAt",
                  ]}
                />
              </div>
            )}

            {/* SELECTED PATIENT */}

            {selected && (
              <>
                <div
                  style={
                    styles.sectionHeader
                  }
                >
                  <div>
                    <h2
                      style={
                        styles.sectionTitle
                      }
                    >
                      👤 Patient Details
                    </h2>

                    <p
                      style={
                        styles.sectionSubtitle
                      }
                    >
                      Selected patient
                      information and
                      records.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={
                      styles.closeButton
                    }
                    onClick={() => {
                      setSelected(null);
                      setRecords([]);
                      setClinicalRecords(
                        null
                      );
                    }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div
                  style={
                    styles.patientDetailsCard
                  }
                >
                  <div
                    style={
                      styles.selectedPatientAvatar
                    }
                  >
                    {selected.patientName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "P"}
                  </div>

                  <div
                    style={
                      styles.selectedPatientInfo
                    }
                  >
                    <h2>
                      {selected.patientName ||
                        "Patient"}
                    </h2>

                    <p>
                      Patient ID:{" "}
                      <strong>
                        {selected.id}
                      </strong>
                    </p>
                  </div>

                  <Detail
                    icon="⚧"
                    label="Gender"
                    value={
                      selected.patientGender ||
                      "-"
                    }
                  />

                  <Detail
                    icon="🎂"
                    label="Age"
                    value={
                      selected.patientAge ??
                      "-"
                    }
                  />

                  <Detail
                    icon="📱"
                    label="Phone"
                    value={
                      selected.phoneNumber ||
                      "-"
                    }
                  />

                  <Detail
                    icon="📧"
                    label="Email"
                    value={
                      selected.email ||
                      "-"
                    }
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* =====================================================
            NURSE VITALS
        ====================================================== */}

        {role === "NURSE" &&
          activeView === "vitals" && (
            <>
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    ❤️ Record Patient
                    Vitals
                  </h2>

                  <p
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    Record blood pressure
                    and patient weight.
                  </p>
                </div>
              </div>

              <div
                style={
                  styles.twoColumnGrid
                }
              >
                <div style={styles.card}>
                  <h3
                    style={
                      styles.cardHeading
                    }
                  >
                    Record Vitals
                  </h3>

                  <form
                    onSubmit={saveVitals}
                    style={styles.form}
                  >
                    <label
                      style={styles.label}
                    >
                      Patient
                    </label>

                    <select
                      style={styles.input}
                      value={
                        v.patientId
                      }
                      onChange={(e) =>
                        setV({
                          ...v,
                          patientId:
                            e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">
                        Select patient
                      </option>

                      {patients.map(
                        (patient) => (
                          <option
                            key={
                              patient.id
                            }
                            value={
                              patient.id
                            }
                          >
                            {
                              patient.patientName
                            }{" "}
                            (ID{" "}
                            {patient.id})
                          </option>
                        )
                      )}
                    </select>

                    <div
                      style={
                        styles.formGrid
                      }
                    >
                      <div>
                        <label
                          style={
                            styles.label
                          }
                        >
                          Systolic BP
                        </label>

                        <input
                          style={
                            styles.input
                          }
                          placeholder="120"
                          type="number"
                          value={
                            v.bpSystolic
                          }
                          onChange={(e) =>
                            setV({
                              ...v,
                              bpSystolic:
                                e.target
                                  .value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          style={
                            styles.label
                          }
                        >
                          Diastolic BP
                        </label>

                        <input
                          style={
                            styles.input
                          }
                          placeholder="80"
                          type="number"
                          value={
                            v.bpDiastolic
                          }
                          onChange={(e) =>
                            setV({
                              ...v,
                              bpDiastolic:
                                e.target
                                  .value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <label
                      style={styles.label}
                    >
                      Weight (kg)
                    </label>

                    <input
                      style={styles.input}
                      placeholder="65.5"
                      type="number"
                      step="0.1"
                      value={
                        v.weightKg
                      }
                      onChange={(e) =>
                        setV({
                          ...v,
                          weightKg:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="submit"
                      style={
                        styles.primaryButton
                      }
                    >
                      ❤️ Save Vitals
                    </button>
                  </form>
                </div>

                <RecordList
                  title={
                    selected
                      ? `Vitals — ${selected.patientName}`
                      : "Patient Vitals"
                  }
                  rows={records}
                  type="vitals"
                />
              </div>
            </>
          )}

        {/* =====================================================
            RECEPTION APPOINTMENTS
        ====================================================== */}

        {role === "RECEPTION" && activeView === "reception-health-checkups" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🩺 Health Checkups</h2><p style={styles.sectionSubtitle}>View patient health checkup bookings and payment status.</p></div></div>
            <div style={styles.card}><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Package</th><th style={styles.th}>Visit</th><th style={styles.th}>Date / Time</th><th style={styles.th}>Checkup Status</th><th style={styles.th}>Payment Status</th></tr></thead><tbody>{healthCheckups.length ? healthCheckups.map(h=><tr key={h.id}><td style={styles.td}>{h.patientName}<br/>ID: {h.patientId}</td><td style={styles.td}>{h.packageName}<br/>₹{h.packagePrice}</td><td style={styles.td}>{h.visitType}{h.homeAddress&&<><br/>{h.homeAddress}</>}</td><td style={styles.td}>{h.visitDate}<br/>{h.visitTime}</td><td style={styles.td}><StatusBadge status={h.status}/></td><td style={styles.td}><PaymentStatusBadge status={h.paymentStatus}/></td></tr>) : <tr><td colSpan={6} style={styles.emptyTable}>No health checkup bookings.</td></tr>}</tbody></table></div></div>
          </section>
        )}

        {role === "RECEPTION" &&
          activeView ===
            "appointments" && (
            <>
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    📅 Appointments
                  </h2>

                  <p
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    View patient appointment
                    schedules.
                  </p>
                </div>
              </div>

              <div style={styles.card}>
                <div
                  style={
                    styles.tableWrap
                  }
                >
                  <table
                    style={styles.table}
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          ID
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Patient
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Doctor
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Date
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Time
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Status
                        </th>
                        <th style={styles.th}>Payment status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            style={
                              styles.emptyTable
                            }
                          >
                            No appointments
                            available.
                          </td>
                        </tr>
                      ) : (
                        appointments.map(
                          (appointment) => (
                            <tr
                              key={
                                appointment.id
                              }
                            >
                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  appointment.id
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  appointment.patientName ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  appointment
                                    .doctor
                                    ?.fullName ||
                                  appointment.doctorName ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  appointment.appointmentDate ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  appointment.appointmentTime ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <StatusBadge
                                  status={
                                    appointment.status
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <PaymentStatusBadge status={appointment.paymentStatus} />
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        {/* =====================================================
            LAB
        ====================================================== */}

        {role === "LAB" &&
          activeView === "lab" && (
            <>
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    🧪 Laboratory
                  </h2>

                  <p
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    Upload medical reports
                    for doctor-requested
                    lab tests.
                  </p>
                </div>

                <span
                  style={
                    styles.warningBadge
                  }
                >
                  {pendingLabTests} Pending
                </span>
              </div>

              <div
                style={
                  styles.twoColumnGrid
                }
              >
                <div style={styles.card}>
                  <h3
                    style={
                      styles.cardHeading
                    }
                  >
                    Upload Medical Report
                  </h3>

                  <form
                    onSubmit={upload}
                    style={styles.form}
                  >
                    <label
                      style={styles.label}
                    >
                      Doctor Suggested Lab
                      Test
                    </label>

                    <select
                      style={styles.input}
                      value={
                        lab.labTestId
                      }
                      onChange={(e) => {
                        const test =
                          labTests.find(
                            (x) =>
                              String(
                                x.id
                              ) ===
                              e.target
                                .value
                          );

                        setLab({
                          ...lab,
                          labTestId:
                            e.target
                              .value,
                          patientId:
                            test
                              ? String(
                                  test.patientId
                                )
                              : lab.patientId,
                          reportName:
                            test
                              ? test.testName
                              : lab.reportName,
                        });
                      }}
                      required
                    >
                      <option value="">
                        Select doctor
                        suggested lab test
                      </option>

                      {labTests.map(
                        (test) => (
                          <option
                            key={test.id}
                            value={test.id}
                          >
                            {
                              test.patientName
                            }{" "}
                            —{" "}
                            {
                              test.testName
                            }{" "}— ₹{((test.pricePaise || 0) / 100).toFixed(2)} · Payment: {test.paymentStatus || "PENDING"}{" "}
                            (ID{" "}
                            {
                              test.patientId
                            })
                          </option>
                        )
                      )}
                    </select>

                    {lab.labTestId && (() => {
                      const selectedTest = labTests.find(x => String(x.id) === String(lab.labTestId));
                      if (!selectedTest) return null;
                      return (
                        <div style={{padding:"10px 12px",borderRadius:8,background:"var(--db-bg)",marginBottom:10}}>
                          <strong>Payment: {selectedTest.paymentStatus || "PENDING"}</strong><span style={{marginLeft:10}}>Test: {selectedTest.status}</span>
                          {String(selectedTest.status).toUpperCase() === "SUGGESTED" && selectedTest.paymentStatus === "PAID" && (
                            <button type="button" style={{...styles.viewButton, marginLeft:10}} onClick={initializeSelectedLabTest}>🧪 Initialize after Sample</button>
                          )}
                          {String(selectedTest.status).toUpperCase() === "WAITING_FOR_RESULT" && <span style={{marginLeft:10,color:"var(--db-amber-text)"}}>Waiting for result upload.</span>}
                        </div>
                      );
                    })()}

                    <label
                      style={styles.label}
                    >
                      Report Name
                    </label>

                    <input
                      style={styles.input}
                      placeholder="Blood Test"
                      value={
                        lab.reportName
                      }
                      onChange={(e) =>
                        setLab({
                          ...lab,
                          reportName:
                            e.target
                              .value,
                        })
                      }
                      required
                    />

                    <label
                      style={styles.label}
                    >
                      Report File
                    </label>

                    <input
                      style={
                        styles.fileInput
                      }
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) =>
                        setLab({
                          ...lab,
                          file:
                            e.target
                              .files?.[0] ||
                            null,
                        })
                      }
                      required
                    />

                    <button
                      type="submit"
                      style={styles.primaryButton}
                      disabled={!lab.labTestId || !labTests.find(x => String(x.id) === String(lab.labTestId)) || String(labTests.find(x => String(x.id) === String(lab.labTestId))?.status).toUpperCase() !== "WAITING_FOR_RESULT"}
                    >
                      📤 Upload Report
                    </button>
                  </form>
                </div>

                <LabReportList
                  title={selected ? `Reports — ${selected.patientName}` : "Patient Reports"}
                  rows={records}
                  onDelete={async (id) => {
                    try { await deleteLabReport(id); setMessage("Lab report deleted."); if(selected) await showPatient(selected); }
                    catch(e){ setError(e.response?.data?.message || "Unable to delete report."); }
                  }}
                  onReupload={async (id,file) => {
                    try {
                      if(!file) return;
                      const old = records.find(r => String(r.id) === String(id));
                      await replaceLabReport(id, old?.reportName || "Lab Report", file);
                      setMessage("Lab report re-uploaded successfully."); await showPatient(selected);
                    } catch(e){ setError(e.response?.data?.message || "Unable to re-upload report."); }
                  }}
                />
              </div>
            </>
          )}

        {/* =====================================================
            HEALTH CHECKUPS FOR LAB
        ====================================================== */}
        {role === "LAB" && activeView === "health-checkups" && (
          <LabHealthCheckupsSection
            rows={healthCheckups}
            onInitialize={async (id) => {
              try { await initializeHealthCheckup(id); setMessage("Health checkup initialized. Status is now WAITING_FOR_RESULT."); await load("health-checkups"); }
              catch(e){ setError(e.response?.data?.message || "Unable to initialize health checkup."); }
            }}
            onComplete={async (id,file) => {
              try { await completeHealthCheckup(id,file); setMessage("Health checkup completed and result uploaded."); await load("health-checkups"); }
              catch(e){ setError(e.response?.data?.message || "Unable to complete health checkup."); }
            }}
          />
        )}

        {role === "LAB" && activeView === "lab-history" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🗂️ Lab History</h2><p style={styles.sectionSubtitle}>All doctor-suggested laboratory tests submitted for patients, including completed records.</p></div></div>
            <div style={styles.card}><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Test</th><th style={styles.th}>Status</th><th style={styles.th}>Suggested</th><th style={styles.th}>Completed</th></tr></thead><tbody>{labHistory.length?labHistory.map(t=><tr key={t.id}><td style={styles.td}>{t.patientName}<br/>ID: {t.patientId}</td><td style={styles.td}>{t.testName}</td><td style={styles.td}><StatusBadge status={t.status}/></td><td style={styles.td}>{t.suggestedAt||"-"}</td><td style={styles.td}>{t.completedAt||"-"}</td></tr>):<tr><td colSpan={5} style={styles.emptyTable}>No laboratory history.</td></tr>}</tbody></table></div></div>
          </section>
        )}

        {/* =====================================================
            PHARMACY HISTORY
        ====================================================== */}
        {role === "PHARMACY" && activeView === "pharmacy-history" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🗂️ Given Medicine History</h2><p style={styles.sectionSubtitle}>Completed prescriptions marked as given by pharmacy staff.</p></div></div>
            <div style={styles.card}><RecordTable rows={pharmacyHistory} empty="No completed pharmacy history." /></div>
          </section>
        )}

        {/* =====================================================
            PHARMACY
        ====================================================== */}

        {role === "PHARMACY" &&
          activeView ===
            "pharmacy" && (
            <>
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    💊 Doctor Prescriptions
                  </h2>

                  <p
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    View prescriptions issued
                    by doctors.
                  </p>
                </div>
              </div>

              <div style={styles.card}>
                <div
                  style={
                    styles.tableWrap
                  }
                >
                  <table
                    style={styles.table}
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Patient
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Medicine
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Dosage
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Duration
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Pharmacy
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Instructions
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Pharmacy Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            style={
                              styles.emptyTable
                            }
                          >
                            No prescriptions
                            available.
                          </td>
                        </tr>
                      ) : (
                        records.map(
                          (prescription) => (
                            <tr
                              key={
                                prescription.id
                              }
                            >
                              <td
                                style={
                                  styles.td
                                }
                              >
                                <strong>
                                  {
                                    prescription.patientName ||
                                    "Patient"
                                  }
                                </strong>

                                <span
                                  style={
                                    styles.subText
                                  }
                                >
                                  ID:{" "}
                                  {
                                    prescription.patientId
                                  }
                                </span>
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  prescription.medicine ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  prescription.dosage ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  prescription.duration ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  prescription.pharmacyName ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  prescription.instructions ||
                                  "-"
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <div style={{marginBottom:8,fontWeight:700,color:prescription.paymentStatus === "PAID" ? "#18794e" : "#b54708"}}>Payment: {prescription.paymentStatus || "PENDING"}</div>
                                {prescription.dispensed ? (
                                  <span
                                    style={
                                      styles.subText
                                    }
                                  >
                                    ✓ Dispensed
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={prescription.paymentStatus !== "PAID"}
                                    title={prescription.paymentStatus !== "PAID" ? "Waiting for patient payment" : "Mark as dispensed"}
                                    style={{...styles.viewButton, opacity: prescription.paymentStatus !== "PAID" ? 0.5 : 1, cursor: prescription.paymentStatus !== "PAID" ? "not-allowed" : "pointer"}}
                                    onClick={() =>
                                      dispense(
                                        prescription.id
                                      )
                                    }
                                  >
                                    💊 Mark Given
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
      </main>
    </div>
  );
}

function LabReportList({ title, rows = [], onDelete, onReupload }) {
  return <div style={{marginTop:"18px"}}>
    <h3 style={{marginBottom:"8px"}}>{title}</h3>
    {!rows.length ? <p style={{color:"var(--db-muted)"}}>No reports available.</p> :
      <div style={{overflowX:"auto"}}><table style={styles.table}><thead><tr>
        <th style={styles.th}>Report</th><th style={styles.th}>Uploaded</th><th style={styles.th}>Actions</th>
      </tr></thead><tbody>{rows.map(r=><tr key={r.id}>
        <td style={styles.td}>{r.reportName || r.fileName}</td><td style={styles.td}>{String(r.uploadedAt||"-")}</td>
        <td style={styles.td}>
          <button type="button" style={styles.viewButton} onClick={()=>openStaffLabFile(r)}>👁 View</button>
          <label style={{...styles.viewButton, marginLeft:6, cursor:"pointer"}}>🔄 Re-upload<input hidden type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e=>onReupload(r.id,e.target.files?.[0])}/></label>
          <button type="button" style={{...styles.viewButton, marginLeft:6}} onClick={()=>onDelete(r.id)}>🗑 Delete</button>
        </td>
      </tr>)}</tbody></table></div>}
  </div>;
}

async function openStaffLabFile(row) {
  try {
    const token=sessionStorage.getItem("adminToken");
    const response=await fetch(`http://localhost:8080/api/lab/reports/${row.id}/file`,{headers:{Authorization:`Bearer ${token}`}});
    if(!response.ok) throw new Error("Unable to open report.");
    const blob=await response.blob(); const url=URL.createObjectURL(blob);
    window.open(url,"_blank","noopener,noreferrer"); setTimeout(()=>URL.revokeObjectURL(url),30000);
  } catch(e) { alert(e.message); }
}

function LabHealthCheckupsSection({ rows=[], onInitialize, onComplete }) {
  return <section style={styles.section}>
    <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🩺 Health Checkups</h2><p style={styles.sectionSubtitle}>All submitted patient health checkups. Initialize after sample collection, then upload the completed result.</p></div></div>
    <div style={styles.card}><div style={styles.tableWrap}><table style={styles.table}><thead><tr>
      <th style={styles.th}>Patient</th><th style={styles.th}>Package</th><th style={styles.th}>Visit</th><th style={styles.th}>Status</th><th style={styles.th}>Payment Status</th><th style={styles.th}>Action</th>
    </tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.id}>
      <td style={styles.td}><strong>{r.patientName}</strong><br/>ID: {r.patientId}</td><td style={styles.td}>{r.packageName}<br/>₹{r.packagePrice}</td>
      <td style={styles.td}>{r.visitType}<br/>{r.visitDate} {r.visitTime}{r.homeAddress&&<><br/><small>{r.homeAddress}</small></>}</td>
      <td style={styles.td}><StatusBadge status={r.status}/></td>
      <td style={styles.td}><PaymentStatusBadge status={r.paymentStatus}/></td>
      <td style={styles.td}>{r.status==="BOOKED" && (r.paymentStatus === "PAID" ? <button type="button" style={styles.viewButton} onClick={()=>onInitialize(r.id)}>🧪 Initialize</button> : <span style={styles.subText}>Waiting for payment</span>)}
        {r.status==="WAITING_FOR_RESULT" && <label style={{...styles.viewButton, cursor:"pointer"}}>📤 Upload Done Result<input hidden type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e=>onComplete(r.id,e.target.files?.[0])}/></label>}
        {r.status==="DONE" && <span style={styles.subText}>✓ Completed</span>}</td>
    </tr>):<tr><td colSpan={6} style={styles.emptyTable}>No health checkup submissions.</td></tr>}</tbody></table></div></div>
  </section>;
}

function RecordTable({rows=[],empty}) {
 return <div style={{overflowX:"auto"}}><table style={styles.table}><thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Medicine</th><th style={styles.th}>Dosage</th><th style={styles.th}>Duration</th><th style={styles.th}>Status</th><th style={styles.th}>Given At</th></tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.id}><td style={styles.td}>{r.patientName} (ID {r.patientId})</td><td style={styles.td}>{r.medicine}</td><td style={styles.td}>{r.dosage}</td><td style={styles.td}>{r.duration}</td><td style={styles.td}>{r.dispensed?"GIVEN":"PENDING"}</td><td style={styles.td}>{r.dispensedAt||"-"}</td></tr>):<tr><td colSpan={6} style={styles.emptyTable}>{empty}</td></tr>}</tbody></table></div>;
}


// =========================================================
// CLINICAL RECORD LIST
// =========================================================

function ClinicalRecordList({
  title,
  rows = [],
  fields = [],
  onViewFile,
}) {
  return (
    <div
      style={{
        marginTop: "18px",
      }}
    >
      <h3
        style={{
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      {rows.length === 0 ? (
        <p
          style={{
            color: "var(--db-muted)",
          }}
        >
          No records available.
        </p>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table style={styles.table}>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th
                    key={field}
                    style={styles.th}
                  >
                    {field}
                  </th>
                ))}
                {onViewFile && <th style={styles.th}>Action</th>}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={
                    row.id || index
                  }
                >
                  {fields.map(
                    (field) => (
                      <td
                        key={field}
                        style={
                          styles.td
                        }
                      >
                        {String(
                          row[field] ??
                            "-"
                        )}
                      </td>
                    )
                  )}
                  {onViewFile && (
                    <td style={styles.td}>
                      <button type="button" style={styles.viewButton} onClick={() => onViewFile(row)}>👁 View</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  label,
  value,
  iconStyle = "blue",
}) {
  const iconStyles = {
    blue: styles.statIcon,
    yellow: styles.statIconPending,
    green: styles.statIconConfirmed,
    red: styles.statIconCancelled,
    purple: styles.statIconPurple,
  };

  return (
    <div style={styles.statCard}>
      <div
        style={
          iconStyles[iconStyle] ||
          styles.statIcon
        }
      >
        {icon}
      </div>

      <div>
        <span
          style={styles.statLabel}
        >
          {label}
        </span>

        <strong
          style={styles.statNumber}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

// =========================================================
// DETAIL
// =========================================================

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div style={styles.detail}>
      <div style={styles.detailIcon}>
        {icon}
      </div>

      <div
        style={styles.detailContent}
      >
        <span
          style={styles.detailLabel}
        >
          {label}
        </span>

        <strong
          style={styles.detailValue}
        >
          {value || "-"}
        </strong>
      </div>
    </div>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ status }) {
  const normalized = String(
    status || "PENDING"
  ).toUpperCase();

  let style =
    styles.pendingStatus;

  if (
    normalized === "CONFIRMED" ||
    normalized === "APPROVED" ||
    normalized === "COMPLETED" ||
    normalized === "DONE"
  ) {
    style = styles.approvedStatus;
  }

  if (
    normalized === "REJECTED" ||
    normalized === "CANCELLED"
  ) {
    style = styles.rejectedStatus;
  }

  return (
    <span
      style={{
        ...styles.statusBadge,
        ...style,
      }}
    >
      {normalized}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const normalized = String(status || "NOT_DUE").toUpperCase();
  const colors = normalized === "PAID"
    ? { background: "var(--db-green-bg)", color: "var(--db-green-text)" }
    : normalized === "PENDING" || normalized === "PAY_AT_HOSPITAL"
      ? { background: "var(--db-amber-bg)", color: "var(--db-amber-text)" }
      : normalized === "INVOICE_MISSING"
        ? { background: "var(--db-red-bg)", color: "var(--db-red-text)" }
        : { background: "var(--db-surface-2)", color: "var(--db-text)" };
  const label = normalized === "PAY_AT_HOSPITAL" ? "PAY AT HOSPITAL · UNPAID" : normalized.replaceAll("_", " ");
  return <span style={{ display: "inline-block", padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", ...colors }}>{label}</span>;
}

// =========================================================
// RECORD LIST
// =========================================================

function RecordList({
  title,
  rows,
  type,
}) {
  return (
    <div style={styles.card}>
      <h3
        style={styles.cardHeading}
      >
        {title}
      </h3>

      {!rows?.length ? (
        <div
          style={styles.emptyCard}
        >
          <div
            style={styles.emptyIcon}
          >
            {type === "vitals"
              ? "❤️"
              : "📄"}
          </div>

          <strong>
            No records available
          </strong>

          <p>
            Select a patient to view
            their records.
          </p>
        </div>
      ) : (
        <div
          style={styles.tableWrap}
        >
          <table
            style={styles.table}
          >
            <thead>
              <tr>
                {type === "vitals" ? (
                  <>
                    <th
                      style={
                        styles.th
                      }
                    >
                      Blood Pressure
                    </th>

                    <th
                      style={
                        styles.th
                      }
                    >
                      Weight
                    </th>

                    <th
                      style={
                        styles.th
                      }
                    >
                      Recorded
                    </th>
                  </>
                ) : (
                  <>
                    <th
                      style={
                        styles.th
                      }
                    >
                      Report
                    </th>

                    <th
                      style={
                        styles.th
                      }
                    >
                      Type
                    </th>

                    <th
                      style={
                        styles.th
                      }
                    >
                      Date
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (record) => (
                  <tr
                    key={record.id}
                  >
                    {type ===
                    "vitals" ? (
                      <>
                        <td
                          style={
                            styles.td
                          }
                        >
                          <strong>
                            {record.bpSystolic ||
                              "-"}/
                            {record.bpDiastolic ||
                              "-"}{" "}
                            mmHg
                          </strong>
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {record.weightKg ??
                            "-"}{" "}
                          kg
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {record.recordedAt ||
                            "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          style={
                            styles.td
                          }
                        >
                          <strong>
                            {record.reportName ||
                              "Medical Report"}
                          </strong>
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {record.contentType ||
                            "-"}
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {record.uploadedAt ||
                            "-"}
                        </td>
                      </>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--db-bg)",
    display: "flex",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  profileCard: { background: "var(--db-surface)", borderRadius: "14px", padding: "24px", boxShadow: "0 5px 18px rgba(0,0,0,.05)", display: "flex", gap: "24px", alignItems: "flex-start" },
  profileAvatar: { width: "64px", height: "64px", borderRadius: "50%", background: "var(--db-blue-bg)", color: "var(--db-blue-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 800, flexShrink: 0 },
  profileForm: { flex: 1, display: "flex", flexDirection: "column", gap: "16px" },
  profileGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" },
  profileField: { display: "flex", flexDirection: "column", gap: "6px", color: "var(--db-text)", fontSize: "12px", fontWeight: 700 },
  profileRole: { padding: "11px 13px", borderRadius: "8px", background: "var(--db-surface-2)", color: "var(--db-text)", fontSize: "13px" },
  profileSave: { alignSelf: "flex-end", padding: "11px 18px", border: "none", borderRadius: "8px", background: "#1769aa", color: "white", cursor: "pointer", fontWeight: 700 },

  loadingPage: {
    minHeight: "100vh",
    background: "var(--db-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingBox: {
    background: "var(--db-surface)",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 8px 30px rgba(0,0,0,.08)",
    minWidth: "320px",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border:
      "4px solid var(--db-blue-border)",
    borderTop:
      "4px solid #1769aa",
    borderRadius: "50%",
    margin:
      "0 auto 12px",
  },

  // =======================================================
  // SIDEBAR
  // =======================================================

  sidebar: {
    width: "250px",
    height: "100vh",
    background:
      "linear-gradient(180deg, #12395b 0%, #0d2b44 100%)",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    padding: "22px 16px",
    boxSizing: "border-box",
    zIndex: 1000,
    overflow: "hidden",
  },

  brand: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding:
      "8px 8px 24px",
    borderBottom:
      "1px solid rgba(255,255,255,.15)",
  },

  brandIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#1769aa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  brandTitle: {
    margin: 0,
    fontSize: "17px",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#b8d4e8",
  },

  staffBox: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding:
      "20px 8px",
    borderBottom:
      "1px solid rgba(255,255,255,.12)",
  },

  staffAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "18px",
    flexShrink: 0,
  },

  staffInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    overflow: "hidden",
  },

  staffAccount: {
    color: "#b8d4e8",
    fontSize: "12px",
    overflow: "hidden",
    textOverflow:
      "ellipsis",
    whiteSpace: "nowrap",
  },

  sidebarNavScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: "10px",
    paddingBottom: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "5px 0",
  },

  navItem: {
    width: "100%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding:
      "13px 14px",
    border: "none",
    borderRadius: "9px",
    background: "transparent",
    color: "#d7e7f2",
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "left",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  activeNavItem: {
    background: "#1769aa",
    color: "white",
    boxShadow:
      "0 4px 12px rgba(0,0,0,.18)",
  },

  navIcon: {
    width: "22px",
    minWidth: "22px",
    textAlign: "center",
    fontSize: "17px",
  },

  navBadge: {
    marginLeft: "auto",
    minWidth: "21px",
    height: "21px",
    padding:
      "0 6px",
    borderRadius: "20px",
    background: "#dc3545",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
  },

  navBadgeBlue: {
    marginLeft: "auto",
    minWidth: "21px",
    height: "21px",
    padding:
      "0 6px",
    borderRadius: "20px",
    background: "#1769aa",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
  },

  sidebarBottom: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "15px",
    borderTop:
      "1px solid rgba(255,255,255,.12)",
    background: "#0d2b44",
  },

  sidebarLogout: {
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    background: "#b42318",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  // =======================================================
  // MAIN
  // =======================================================

  main: {
    marginLeft: "250px",
    width:
      "calc(100% - 250px)",
    minHeight: "100vh",
    padding:
      "30px 35px",
    boxSizing: "border-box",
  },

  topHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "30px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "var(--db-muted)",
    fontSize: "15px",
  },

  refreshButton: {
    border:
      "1px solid #1769aa",
    borderRadius: "8px",
    padding:
      "11px 16px",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // =======================================================
  // WELCOME
  // =======================================================

  welcomeCard: {
    background:
      "linear-gradient(135deg, #1769aa 0%, #12395b 100%)",
    borderRadius: "15px",
    padding: "25px",
    color: "white",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "22px",
    boxShadow:
      "0 7px 25px rgba(23,105,170,.2)",
  },

  welcomeLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  largeAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: 800,
    flexShrink: 0,
  },

  welcomeSmall: {
    color: "#cde6f8",
    fontSize: "13px",
  },

  welcomeName: {
    margin: "4px 0",
    fontSize: "24px",
  },

  welcomeDescription: {
    margin: 0,
    color: "#d8ecfa",
    fontSize: "14px",
  },

  statusArea: {
    textAlign: "right",
  },

  statusLabel: {
    display: "block",
    color: "#cde6f8",
    fontSize: "12px",
    marginBottom: "7px",
  },

  roleBadge: {
    display: "inline-block",
    padding:
      "7px 13px",
    borderRadius: "20px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    fontSize: "12px",
    fontWeight: 800,
  },

  // =======================================================
  // STATS
  // =======================================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  statCard: {
    background: "var(--db-surface)",
    borderRadius: "13px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  statIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statIconPending: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-amber-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statIconConfirmed: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statIconCancelled: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statIconPurple: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-purple-bg)",
    color: "var(--db-purple-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "12px",
    marginBottom: "4px",
  },

  statNumber: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "20px",
  },

  // =======================================================
  // SECTIONS
  // =======================================================

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    marginTop: "8px",
  },

  sectionTitle: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "21px",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "var(--db-muted)",
    fontSize: "13px",
  },

  countBadge: {
    padding:
      "7px 12px",
    borderRadius: "20px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    fontSize: "12px",
    fontWeight: 700,
  },

  warningBadge: {
    padding:
      "7px 12px",
    borderRadius: "20px",
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
    fontSize: "12px",
    fontWeight: 700,
  },

  // =======================================================
  // CARD
  // =======================================================

  card: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "22px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
    marginBottom: "28px",
  },

  cardHeading: {
    margin:
      "0 0 18px",
    color: "var(--db-heading)",
    fontSize: "17px",
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1.5fr)",
    gap: "18px",
    alignItems: "start",
    marginBottom: "10px",
  },

  // =======================================================
  // TABLE
  // =======================================================

  tableWrap: {
    width: "100%",
    overflowX: "auto",
    border:
      "1px solid var(--db-border)",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    minWidth: "720px",
  },

  th: {
    textAlign: "left",
    padding:
      "13px 14px",
    background: "var(--db-surface-2)",
    color: "var(--db-text)",
    fontSize: "12px",
    fontWeight: 800,
    borderBottom:
      "1px solid var(--db-border)",
    whiteSpace: "nowrap",
  },

  td: {
    padding:
      "13px 14px",
    color: "var(--db-text)",
    fontSize: "13px",
    borderBottom:
      "1px solid var(--db-border)",
    verticalAlign: "middle",
  },

  emptyTable: {
    textAlign: "center",
    padding: "35px",
    color: "var(--db-muted)",
    fontSize: "13px",
  },

  patientCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  patientAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0,
  },

  subText: {
    display: "block",
    marginTop: "3px",
    color: "var(--db-muted)",
    fontSize: "11px",
  },

  viewButton: {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 12px",
    background: "#1769aa",
    color: "white",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  // =======================================================
  // PATIENT DETAILS
  // =======================================================

  patientDetailsCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
      "auto minmax(160px, 1fr) repeat(4, minmax(100px, 1fr))",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
    marginBottom: "28px",
  },

  selectedPatientAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 800,
  },

  selectedPatientInfo: {
    minWidth: 0,
  },

  closeButton: {
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    padding:
      "8px 12px",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  detail: {
    padding: "12px",
    borderRadius: "9px",
    background: "var(--db-surface-2)",
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    minWidth: 0,
  },

  detailIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "14px",
  },

  detailContent: {
    minWidth: 0,
  },

  detailLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "10px",
    marginBottom: "3px",
  },

  detailValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "12px",
    wordBreak: "break-word",
  },

  // =======================================================
  // FORM
  // =======================================================

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  label: {
    color: "var(--db-text)",
    fontSize: "12px",
    fontWeight: 700,
    marginTop: "4px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding:
      "11px 12px",
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    fontSize: "13px",
    outline: "none",
  },

  fileInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px",
    border:
      "1px dashed var(--db-border-strong)",
    borderRadius: "8px",
    background: "var(--db-surface-2)",
    color: "var(--db-text)",
    fontSize: "12px",
  },

  primaryButton: {
    marginTop: "8px",
    padding:
      "11px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  // =======================================================
  // STATUS
  // =======================================================

  statusBadge: {
    display: "inline-block",
    padding:
      "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: 800,
  },

  pendingStatus: {
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
  },

  approvedStatus: {
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
  },

  rejectedStatus: {
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
  },

  // =======================================================
  // EMPTY
  // =======================================================

  emptyCard: {
    background: "var(--db-surface-2)",
    borderRadius: "10px",
    padding: "35px",
    textAlign: "center",
    color: "var(--db-muted)",
  },

  emptyIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },

  // =======================================================
  // QUICK ACTIONS
  // =======================================================

  quickActions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },

  actionCard: {
    border:
      "1px solid var(--db-border)",
    borderRadius: "12px",
    background: "var(--db-surface)",
    padding: "17px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow:
      "0 4px 15px rgba(0,0,0,.04)",
  },

  actionIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  // =======================================================
  // ALERTS
  // =======================================================

  error: {
    marginBottom: "20px",
    padding:
      "13px 16px",
    borderRadius: "9px",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
    border:
      "1px solid var(--db-red-border)",
  },

  success: {
    marginBottom: "20px",
    padding:
      "13px 16px",
    borderRadius: "9px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    border:
      "1px solid var(--db-green-border)",
  },
  activeDoctorsCard:{background:"var(--db-surface)",borderRadius:16,padding:20,boxShadow:"0 8px 24px rgba(0,0,0,.06)",marginBottom:20},
  doctorGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12},
  doctorMiniCard:{display:"flex",gap:12,alignItems:"center",border:"1px solid var(--db-border)",borderRadius:12,padding:12},
  doctorMiniAvatar:{width:42,height:42,borderRadius:"50%",background:"var(--db-blue-bg)",color:"var(--db-blue-text)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800},
  emptyInline:{padding:18,borderRadius:10,background:"var(--db-surface-2)",color:"var(--db-muted)"},

};

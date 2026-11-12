import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getMyDoctorAppointments,
  approveDoctorAppointment,
  rejectDoctorAppointment,
} from "../services/appointmentService";

import {
  getDoctorPatientClinicalRecords,
  getDoctorOldMedicalRecordFile,
  getDoctorLabReportFile,
} from "../services/doctorDashboardService";

import {
  createPrescription,
  getDoctorPrescriptions,
} from "../services/prescriptionService";

import { getMyDoctorProfile, updateMyDoctorProfile, getMyDoctorAvailability, saveMyDoctorAvailability } from "../services/doctorService";

import {
  createLabTest,
  getDoctorLabTests,
} from "../services/labTestService";
import { getBillingCatalog } from "../services/billingService";
import LocalProfilePhoto from "../components/LocalProfilePhoto";


function DoctorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // ACTIVE SIDEBAR SECTION
  // =====================================================

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // =====================================================
  // DOCTOR STATE
  // =====================================================

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState("");
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().slice(0,10));
  const [availabilityForm, setAvailabilityForm] = useState({active:false,startTime:"09:00",endTime:"17:00"});
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "", phoneNumber: "", email: "", password: "",
    qualification: "", specialization: "", experienceYears: "",
    consultationFee: "", city: "", hospitalName: "", availableTimings: "",
    languagesKnown: "", about: "", licenseDocument: ""
  });

  // =====================================================
  // APPOINTMENT STATE
  // =====================================================

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clinicalRecords, setClinicalRecords] = useState(null);

  // =====================================================
  // ACTION STATE
  // =====================================================

  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");

  // =====================================================
  // PRESCRIPTION STATE
  // =====================================================

  const [prescriptions, setPrescriptions] = useState([]);

  const [prescriptionForm, setPrescriptionForm] =
    useState({
      appointmentId: "",
      medicines: [],
      pharmacyName: "",
      instructions: "",
    });

  const [prescriptionLoading, setPrescriptionLoading] =
    useState(false);

  const [prescriptionMessage, setPrescriptionMessage] =
    useState("");

  const [prescriptionError, setPrescriptionError] =
    useState("");

  // =====================================================
  // LAB TEST / MEDICAL REPORT STATE
  // =====================================================

  const [labTests, setLabTests] = useState([]);
  const [billingCatalog, setBillingCatalog] = useState({ labTests: [], medicines: [] });
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const [labForm, setLabForm] = useState({
    appointmentId: "",
    testNames: [],
    instructions: "",
  });

  const [labLoading, setLabLoading] =
    useState(false);

  const [labMessage, setLabMessage] =
    useState("");

  const [labError, setLabError] =
    useState("");

  // =====================================================
  // DOCTOR ID
  // =====================================================

  // =====================================================
  // LOAD DOCTOR
  // =====================================================

  const loadDoctor = async () => {
    try {
      setDoctorLoading(true);
      setDoctorError("");

      const profile = await getMyDoctorProfile();

      if (profile) {
        setDoctor(profile);
        if (profile.id) sessionStorage.setItem("doctorId", String(profile.id));
      } else {
        setDoctorError("Doctor details were not returned by the server.");
      }
    } catch (err) {
      console.error(
        "Unable to load doctor details:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        sessionStorage.removeItem(
          "doctorToken"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setDoctorError(
        err.response?.data?.message ||
          "Unable to load doctor details."
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  const loadAvailability = async () => {
    try {
      const from=new Date(); const to=new Date(); to.setDate(to.getDate()+7);
      const data=await getMyDoctorAvailability(from.toISOString().slice(0,10),to.toISOString().slice(0,10));
      setAvailabilityDays(Array.isArray(data)?data:[]);
      const selected=(Array.isArray(data)?data:[]).find(x=>x.availabilityDate===availabilityDate);
      if(selected) setAvailabilityForm({active:!!selected.active,startTime:selected.startTime?.slice(0,5)||"09:00",endTime:selected.endTime?.slice(0,5)||"17:00"});
      else setAvailabilityForm({active:true,startTime:"09:00",endTime:"17:00"});
    } catch(e){ setAvailabilityError(e.response?.data?.message||"Unable to load availability calendar."); }
  };
  const saveAvailability = async (event) => {
    event.preventDefault(); setAvailabilityMessage(""); setAvailabilityError("");
    try { await saveMyDoctorAvailability({date:availabilityDate,...availabilityForm}); setAvailabilityMessage(`Availability saved for ${availabilityDate}.`); await loadAvailability(); } catch(e){ setAvailabilityError(e.response?.data?.message||"Unable to save availability."); }
  };
  const selectAvailabilityDate = (date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${date}T00:00:00`);
    const lastAvailableDate = new Date(today); lastAvailableDate.setDate(lastAvailableDate.getDate() + 7);
    if (selectedDate < today || selectedDate > lastAvailableDate) return;
    setAvailabilityDate(date); const selected=availabilityDays.find(x=>x.availabilityDate===date); setAvailabilityForm(selected?{active:!!selected.active,startTime:selected.startTime?.slice(0,5)||"09:00",endTime:selected.endTime?.slice(0,5)||"17:00"}:{active:true,startTime:"09:00",endTime:"17:00"});
  };

  const openProfileEditor = () => {
    setProfileError("");
    setProfileMessage("");
    setProfileForm({
      fullName: doctor?.fullName || doctor?.name || doctor?.doctorName || "",
      phoneNumber: doctor?.phoneNumber || "",
      email: doctor?.email || "",
      password: "",
      qualification: doctor?.qualification || "",
      specialization: doctor?.specialization || "",
      experienceYears: doctor?.experienceYears ?? doctor?.experience ?? "",
      consultationFee: doctor?.consultationFee ?? "",
      city: doctor?.city || "",
      hospitalName: doctor?.hospitalName || doctor?.hospital || "",
      availableTimings: doctor?.availableTimings || "",
      languagesKnown: doctor?.languagesKnown || "",
      about: doctor?.about || "",
      licenseDocument: doctor?.licenseDocument || ""
    });
    setIsProfileEditorOpen(true);
  };

  const closeProfileEditor = () => {
    if (!profileSaving) setIsProfileEditorOpen(false);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileMessage("");
    try {
      const formData = new FormData();
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") formData.append(key, value);
      });
      const result = await updateMyDoctorProfile(formData);
      if (result?.token) {
        sessionStorage.setItem("doctorToken", result.token);
      }
      if (result?.email) {
        sessionStorage.setItem("doctorEmail", result.email);
      }
      if (result?.id) {
        sessionStorage.setItem("doctorId", String(result.id));
      }
      setDoctor(result?.doctor || doctor);
      setProfileMessage(result?.message || "Profile updated successfully.");
      setProfileForm((current) => ({ ...current, password: "" }));
      setTimeout(() => setIsProfileEditorOpen(false), 700);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyDoctorAppointments();

      console.log(
        "Doctor appointments:",
        data
      );

      setAppointments(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Unable to load doctor appointments:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        sessionStorage.removeItem(
          "doctorToken"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRESCRIPTIONS
  // =====================================================

  const loadPrescriptions = async () => {
    try {
      setPrescriptionError("");

      const data =
        await getDoctorPrescriptions();

      setPrescriptions(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Unable to load prescriptions:",
        err
      );

      setPrescriptionError(
        err.response?.data?.message ||
          "Unable to load prescriptions."
      );
    }
  };

  // =====================================================
  // LOAD LAB TESTS
  // =====================================================

  const loadLabTests = async () => {
    try {
      setLabError("");

      const data =
        await getDoctorLabTests();

      setLabTests(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Unable to load lab tests:",
        err
      );

      setLabError(
        err.response?.data?.message ||
          "Unable to load medical reports."
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadDoctor();
    loadAvailability();
    loadAppointments();
    loadPrescriptions();
    loadLabTests();
    getBillingCatalog()
      .then((catalog) => {
        setBillingCatalog({
          labTests: Array.isArray(catalog?.labTests) ? catalog.labTests : [],
          medicines: Array.isArray(catalog?.medicines) ? catalog.medicines : [],
        });
        setCatalogError("");
      })
      .catch((err) => {
        console.error("Unable to load priced service catalogue:", err);
        setCatalogError(err.response?.data?.message || "Unable to load the priced medicine and lab test list. Refresh the page to try again.");
      })
      .finally(() => setCatalogLoading(false));
    const paymentStatusTimer = window.setInterval(async () => {
      try {
        const data = await getMyDoctorAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to refresh appointment payment statuses:", err);
      }
    }, 15000);
    return () => window.clearInterval(paymentStatusTimer);
  }, []);

  // =====================================================
  // APPROVE APPOINTMENT
  // =====================================================

  const handleApprove = async (
    appointmentId
  ) => {
    if (!appointmentId) {
      alert("Appointment ID is missing.");
      return;
    }

    try {
      setActionLoading(
        `approve-${appointmentId}`
      );

      setActionError("");

      await approveDoctorAppointment(
        appointmentId
      );

      alert(
        "Appointment approved successfully."
      );

      await loadAppointments();
    } catch (err) {
      console.error(
        "Unable to approve appointment:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unable to approve appointment.";

      setActionError(String(message));

      alert(String(message));
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REJECT APPOINTMENT
  // =====================================================

  const handleReject = async (
    appointmentId
  ) => {
    if (!appointmentId) {
      alert("Appointment ID is missing.");
      return;
    }

    const reason = window.prompt(
      "Please enter the reason for rejecting this appointment (required):"
    );
    if (!reason || !reason.trim()) {
      alert("A rejection reason is required.");
      return;
    }
    const suggestReschedule = window.confirm(
      "Would you like to suggest a new appointment date and time to the patient?"
    );
    let suggestedRescheduleDate = null;
    let suggestedRescheduleTime = null;
    if (suggestReschedule) {
      suggestedRescheduleDate = window.prompt("Suggested date (YYYY-MM-DD):");
      if (!suggestedRescheduleDate) return;
      suggestedRescheduleTime = window.prompt("Suggested time (for example 10:30):");
      if (!suggestedRescheduleTime) return;
    }

    try {
      setActionLoading(
        `reject-${appointmentId}`
      );

      setActionError("");

      await rejectDoctorAppointment(appointmentId, {
        reason: reason.trim(),
        suggestedRescheduleDate,
        suggestedRescheduleTime,
      });

      alert(
        "Appointment rejected successfully."
      );

      await loadAppointments();
    } catch (err) {
      console.error(
        "Unable to reject appointment:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unable to reject appointment.";

      setActionError(String(message));

      alert(String(message));
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // SAVE PRESCRIPTION
  // =====================================================

  const handleSavePrescription = async (event) => {
    event.preventDefault();

    if (!prescriptionForm.appointmentId) {
      setPrescriptionError("Please select a confirmed patient.");
      return;
    }
    if (!prescriptionForm.medicines?.length) {
      setPrescriptionError("Select at least one medicine.");
      return;
    }
    if (prescriptionForm.medicines.some((item) => !item.dosage || !item.duration.trim() || !item.dosingTimes?.length)) {
      setPrescriptionError("Choose a dosage, duration and at least one dose time for every medicine.");
      return;
    }

    try {
      setPrescriptionLoading(true);
      setPrescriptionMessage("");
      setPrescriptionError("");

      const created = await createPrescription({
        ...prescriptionForm,
        appointmentId: Number(prescriptionForm.appointmentId),
      });

      setPrescriptionMessage(created.length + " medicine(s) prescribed. An invoice was created for each medicine.");
      setPrescriptionForm({
        appointmentId: "",
        medicines: [],
        pharmacyName: "",
        instructions: "",
      });
      await loadPrescriptions();
    } catch (err) {
      console.error("Unable to create prescription:", err);
      setPrescriptionError(err.response?.data?.message || "Unable to add prescription.");
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // =====================================================
  // SAVE LAB TEST
  // =====================================================

  const handleSaveLabTest = async (
    event
  ) => {
    event.preventDefault();

    if (!labForm.appointmentId) {
      setLabError(
        "Please select a confirmed patient."
      );

      return;
    }

    if (!labForm.testNames?.length) {
      setLabError("Select at least one lab test.");
      return;
    }

    try {
      setLabLoading(true);
      setLabMessage("");
      setLabError("");

      const createdTests = await createLabTest({
        ...labForm,
        appointmentId: Number(labForm.appointmentId),
      });

      setLabMessage(`${createdTests.length} lab test(s) saved. An invoice was created for each selected test.`);

      setLabForm({
        appointmentId: "",
        testNames: [],
        instructions: "",
      });

      await loadLabTests();
    } catch (err) {
      console.error(
        "Unable to create lab test:",
        err
      );

      setLabError(
        err.response?.data?.message ||
          "Unable to suggest medical report."
      );
    } finally {
      setLabLoading(false);
    }
  };

  const viewPatientClinical = async (patientId) => {
    try {
      setError("");
      const data = await getDoctorPatientClinicalRecords(patientId);
      setClinicalRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load patient clinical records.");
    }
  };

  const viewClinicalFile = async (type, recordId) => {
    if (!recordId) {
      setError("Record ID is missing.");
      return;
    }

    try {
      setError("");

      const response =
        type === "old"
          ? await getDoctorOldMedicalRecordFile(recordId)
          : await getDoctorLabReportFile(recordId);

      if (!response?.data) {
        throw new Error("The server returned an empty file.");
      }

      const url = URL.createObjectURL(response.data);
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");

      if (!newWindow) {
        setError("The browser blocked the file window. Please allow pop-ups and try again.");
      }

      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (err) {
      console.error("Unable to open clinical record:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("doctorToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to open clinical record."
      );
    }
  };


  const logout = () => {
    [
      "token",
      "doctorToken",
      "doctorId",
      "doctorEmail",
      "doctorRole",
      "doctorName",
      "doctorSex",
      "doctorAge",
      "status",
      "specialization",
      "doctorSpecialization",
      "qualification",
      "doctorQualification",
      "experienceYears",
      "hospitalName",
      "clinicName",
      "city",
      "consultationFee",
      "availableTimings",
      "adminToken",
      "adminRole",
      "adminId",
      "adminEmail",
    ].forEach((key) => {
      sessionStorage.removeItem(key);
    });

    navigate("/admin/login", {
      replace: true,
    });
  };




  const doctorName =
    doctor?.name ||
    doctor?.fullName ||
    doctor?.doctorName ||
    "";

  // Doctor ID is stored after the logged-in doctor's profile is loaded.
  // Read it from sessionStorage instead of using an undeclared variable.
  const storedDoctorId = sessionStorage.getItem("doctorId") || "";

  const doctorId = doctor?.id
    ? String(doctor.id)
    : storedDoctorId;


  const doctorEmail =
    doctor?.email ||
    "";

  const specialization =
    doctor?.specialization ||
    "";

  const qualification =
    doctor?.qualification ||
    "";

  const experienceYears =
    doctor?.experienceYears ??
    doctor?.experience ??
    "";

  const hospitalName =
    doctor?.hospitalName ||
    doctor?.hospital ||
    "";

  const clinicName =
    doctor?.clinicName ||
    doctor?.clinic ||
    "";

  const city =
    doctor?.city ||
    "";

  const consultationFee =
    doctor?.consultationFee ??
    "";

  const availableTimings =
    doctor?.availableTimings ||
    "";

  const status =
    doctor?.status ||
    "";

  // =====================================================
  // APPOINTMENT COUNTS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "PENDING"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "CONFIRMED"
    ).length;

  const rejectedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "REJECTED"
    ).length;

  // =====================================================
  // CONFIRMED PATIENTS
  // =====================================================

  const confirmedPatients =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() ===
        "CONFIRMED"
    );

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  // =====================================================
  // RECENT APPOINTMENTS
  // =====================================================

  const recentAppointments =
    [...appointments]
      .sort((a, b) => {
        const dateA =
          new Date(
            `${a.appointmentDate || ""}T${
              a.appointmentTime ||
              "00:00"
            }`
          );

        const dateB =
          new Date(
            `${b.appointmentDate || ""}T${
              b.appointmentTime ||
              "00:00"
            }`
          );

        return dateB - dateA;
      })
      .slice(0, 5);

  // =====================================================
  // SIDEBAR ITEMS
  // =====================================================

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: "📊",
      section: "dashboard",
    },

    {
        label: "My Profile",
        icon: "👤",
        section: "profile",
      },
    {
      label: "My Appointments",
      icon: "📅",
      section: "appointments",
      badge: pendingAppointments,
    },


    {
      label: "My Patients",
      icon: "👥",
      section: "patients",
      badge: confirmedPatients.length,
    },
    {
      label: "Suggest Medical Test",
      icon: "📄",
      section: "medicalReports",
    },
    {
      label: "Suggest Medicines",
      icon: "💊",
      section: "prescriptions",
    },
  ];

  // =====================================================
  // SIDEBAR CLICK
  // =====================================================

  const handleSidebarClick = (
    section
  ) => {
    setActiveSection(section);
    setClinicalRecords(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (section === "prescriptions") {
      loadPrescriptions();
    }

    if (section === "medicalReports") {
      loadLabTests();
    }

    if (
      section === "patients" ||
      section === "appointments"
    ) {
      loadAppointments();
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (doctorLoading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>

          <h3>
            Loading Doctor Dashboard...
          </h3>

          <p>
            Please wait while we load your
            professional information.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside style={styles.sidebar}>

        {/* BRAND */}

        <div style={styles.brand}>

          <div style={styles.brandIcon}>
            +
          </div>

             <div
               onClick={() => window.location.reload()}
               style={{ cursor: "pointer" }}
             >
               <h2 style={styles.brandTitle}>
                 MediCo
               </h2>

               <p style={styles.brandSubtitle}>
                 DOCTOR PORTAL
               </p>
             </div>


        </div>

        {/* DOCTOR PROFILE */}

        <div style={styles.doctorBox}>

          <div style={{ ...styles.doctorAvatar, display: "none" }}>
            {doctorName
              ? doctorName
                  .charAt(0)
                  .toUpperCase()
              : "D"}
          </div>

          <LocalProfilePhoto role="DOCTOR" userKey={doctorEmail || sessionStorage.getItem("doctorEmail") || doctorId} name={doctorName || "Doctor"} existingPhoto={doctor?.profilePhoto && doctorId ? `http://localhost:8080/api/doctors/${doctorId}/profile-photo` : ""} size={52} />

          <div style={styles.doctorInfo}>

            <strong>
              Dr.{" "}
              {doctorName ||
                "Doctor"}
            </strong>

            <span style={styles.doctorAccount}>
              ID:{" "}
              {doctorId || "-"}
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <div className="dashboard-sidebar-nav-scroll" style={styles.sidebarNavScroll}>

          <nav style={styles.nav}>

            {sidebarItems.map(
              (item) => {

                const isActive =
                  activeSection ===
                  item.section;

                return (
                  <button
                    key={
                      item.section
                    }
                    type="button"
                    style={{
                      ...styles.navItem,

                      ...(isActive
                        ? styles.activeNavItem
                        : {}),
                    }}
                    onClick={() =>
                      handleSidebarClick(
                        item.section
                      )
                    }
                  >

                    <span
                      style={
                        styles.navIcon
                      }
                    >
                      {item.icon}
                    </span>

                    <span>
                      {item.label}
                    </span>

                    {item.badge >
                      0 && (
                      <span
                        style={
                          styles.navBadge
                        }
                      >
                        {item.badge}
                      </span>
                    )}

                  </button>
                );
              }
            )}

          </nav>

        </div>

        {/* LOGOUT */}

        <div style={styles.sidebarBottom}>

          <button
            type="button"
            onClick={logout}
            style={
              styles.sidebarLogout
            }
          >
            <span>
              🚪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main style={styles.main}>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeSection ===
          "dashboard" && (

          <>
            <div style={styles.topHeader}>

              <div>
                <h1 style={styles.title}>
                  Doctor Dashboard
                </h1>

                <p
                  style={
                    styles.subtitle
                  }
                >
                  Welcome ! Dr.{" "}
                  {doctorName ||
                    "Doctor"}.
                  Manage your patients,
                  appointments and
                  professional information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  loadDoctor();
                  loadAppointments();
                  loadPrescriptions();
                  loadLabTests();
                }}
                style={
                  styles.refreshButton
                }
              >
                🔄 Refresh
              </button>

            </div>


             {/* WELCOME CARD */}

                        <div
                          style={
                            styles.welcomeCard
                          }
                        >

                          <div
                            style={
                              styles.welcomeLeft
                            }
                          >

                            <div
                              style={
                                styles.largeAvatar
                              }
                            >
                              {doctorName
                                ? doctorName
                                    .charAt(0)
                                    .toUpperCase()
                                : "D"}
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
                                Dr.{" "}
                                {doctorName ||
                                  "Doctor"}
                              </h2>

                              <p
                                style={
                                  styles.welcomeSpecialization
                                }
                              >
                                {specialization ||
                                  "Medical Professional"}
                              </p>

                            </div>

                          </div>

                          <div
                            style={
                              styles.statusArea
                            }
                          >

                            <span
                              style={
                                styles.statusLabel
                              }
                            >
                              Account Role
                            </span>

                            <span
                              style={{
                                ...styles.statusBadge,

                                ...(status.toUpperCase() ===
                                "APPROVED"
                                  ? styles.approvedStatus
                                  : styles.pendingStatus),
                              }}
                            >
                              DOCTOR
                            </span>

                          </div>

                        </div>


            {doctorError && (
              <div
                style={styles.error}
              >
                {doctorError}
              </div>
            )}

            {actionError && (
              <div style={styles.error}>{actionError}</div>
            )}

            <div style={styles.availabilityCard}>
              <div style={styles.sectionHeaderRow}>
                <div><h2 style={styles.sectionTitle}>📅 Daily Availability Calendar</h2><p style={styles.sectionSubtitle}>Set each day's active status and working time. Admin, Nurse and Reception can see active doctors.</p></div>
                <span style={{...styles.statusBadge,...(availabilityForm.active?styles.approvedStatus:styles.inactiveStatus)}}>{availabilityForm.active?"ACTIVE":"INACTIVE"}</span>
              </div>
              <div style={styles.availabilityCalendar}>{Array.from({length:8},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;const row=availabilityDays.find(x=>x.availabilityDate===iso);return <button type="button" key={iso} onClick={()=>selectAvailabilityDate(iso)} style={{...styles.dayButton,...(availabilityDate===iso?styles.dayButtonSelected:{})}}><strong>{d.toLocaleDateString(undefined,{weekday:"short"})}</strong><span>{d.getDate()}</span><small>{row ? (row.active ? "Active" : "Inactive") : "Active"}</small></button>})}</div>
              <form onSubmit={saveAvailability} style={styles.availabilityForm}>
                <div><label style={styles.inputLabel}>Selected Date</label><input type="date" min={new Date().toISOString().slice(0,10)} max={new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)} value={availabilityDate} onChange={e=>selectAvailabilityDate(e.target.value)} style={styles.input}/></div>
                <label style={styles.availabilityToggle}><input type="checkbox" checked={availabilityForm.active} onChange={e=>setAvailabilityForm({...availabilityForm,active:e.target.checked})}/> Doctor is available on this day (uncheck only when on leave)</label>
                <div><label style={styles.inputLabel}>Start Time</label><input type="time" value={availabilityForm.startTime} onChange={e=>setAvailabilityForm({...availabilityForm,startTime:e.target.value})} disabled={!availabilityForm.active} style={styles.input}/></div>
                <div><label style={styles.inputLabel}>End Time</label><input type="time" value={availabilityForm.endTime} onChange={e=>setAvailabilityForm({...availabilityForm,endTime:e.target.value})} disabled={!availabilityForm.active} style={styles.input}/></div>
                <button type="submit" style={styles.primaryButton}>Save Day</button>
              </form>
              {availabilityMessage&&<div style={styles.success}>{availabilityMessage}</div>}{availabilityError&&<div style={styles.error}>{availabilityError}</div>}
            </div>




            {/* STATISTICS */}

            <div
              style={
                styles.statsGrid
              }
            >

              <StatCard
                icon="📅"
                label="Total Appointments"
                value={
                  totalAppointments
                }
              />

              <StatCard
                icon="⏳"
                label="Pending Approval"
                value={
                  pendingAppointments
                }
                type="pending"
              />

              <StatCard
                icon="✓"
                label="Confirmed"
                value={
                  confirmedAppointments
                }
                type="confirmed"
              />

              <StatCard
                icon="✕"
                label="Rejected"
                value={
                  rejectedAppointments
                }
                type="rejected"
              />

            </div>

            {/* PENDING */}

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
                  🔔 Pending Appointment Requests
                </h2>

                <p
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Review patient requests
                  and approve or reject
                  them.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSidebarClick(
                    "appointments"
                  )
                }
                style={
                  styles.viewAllButton
                }
              >
                View All
              </button>

            </div>

            {!loading &&
              appointments.filter(
                (appointment) =>
                  String(
                    appointment.status ||
                      ""
                  ).toUpperCase() ===
                  "PENDING"
              ).length ===
                0 && (

                <div
                  style={
                    styles.noPendingCard
                  }
                >

                  <div
                    style={
                      styles.noPendingIcon
                    }
                  >
                    ✓
                  </div>

                  <div>
                    <strong>
                      No pending
                      appointment
                      requests
                    </strong>

                    <p>
                      New patient booking
                      requests will appear
                      here.
                    </p>
                  </div>

                </div>
              )}

            {!loading &&
              appointments
                .filter(
                  (appointment) =>
                    String(
                      appointment.status ||
                        ""
                    ).toUpperCase() ===
                    "PENDING"
                )
                .slice(0, 5)
                .map(
                  (appointment) => {

                    const appointmentId =
                      appointment.id ||
                      appointment.appointmentId;

                    return (
                      <PendingAppointment
                        key={
                          appointmentId
                        }
                        appointment={
                          appointment
                        }
                        appointmentId={
                          appointmentId
                        }
                        actionLoading={
                          actionLoading
                        }
                        handleApprove={
                          handleApprove
                        }
                        handleReject={
                          handleReject
                        }
                        formatDate={
                          formatDate
                        }
                      />
                    );
                  }
                )}

            {/* QUICK ACTIONS */}

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
                  ⚡ Quick Actions
                </h2>

                <p
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Quickly access important
                  doctor portal features.
                </p>
              </div>

            </div>

            <div
              style={
                styles.quickActions
              }
            >

              <QuickAction
                icon="📅"
                title="My Appointments"
                text="Approve or manage appointments"
                onClick={() =>
                  handleSidebarClick(
                    "appointments"
                  )
                }
              />

              <QuickAction
                icon="👥"
                title="My Patients"
                text="View confirmed patients"
                onClick={() =>
                  handleSidebarClick(
                    "patients"
                  )
                }
              />

              <QuickAction
                icon="📄"
                title="Suggest Medical Test"
                text="Suggest patient lab tests"
                onClick={() =>
                  handleSidebarClick(
                    "medicalReports"
                  )
                }
              />

              <QuickAction
                icon="💊"
                title="Prescriptions"
                text="Manage prescriptions"
                onClick={() =>
                  handleSidebarClick(
                    "prescriptions"
                  )
                }
              />

            </div>

            {/* RECENT APPOINTMENTS */}

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
                  📅 Recent Appointments
                </h2>

                <p
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Your latest patient
                  appointments.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSidebarClick(
                    "appointments"
                  )
                }
                style={
                  styles.viewAllButton
                }
              >
                View All
              </button>

            </div>

            {error && (
              <div
                style={styles.error}
              >
                {error}
              </div>
            )}

            {loading ? (

              <div
                style={
                  styles.loadingCard
                }
              >
                <div
                  style={
                    styles.spinner
                  }
                />

                <p>
                  Loading appointments...
                </p>
              </div>

            ) : recentAppointments.length ===
              0 ? (

              <div
                style={
                  styles.emptyCard
                }
              >

                <div
                  style={
                    styles.emptyIcon
                  }
                >
                  📅
                </div>

                <h3>
                  No appointments yet
                </h3>

                <p>
                  Your patient
                  appointments will
                  appear here.
                </p>

              </div>

            ) : (

              <div
                style={
                  styles.appointmentList
                }
              >

                {recentAppointments.map(
                  (appointment) => {

                    const appointmentId =
                      appointment.id ||
                      appointment.appointmentId;

                    const appointmentStatus =
                      String(
                        appointment.status ||
                          "PENDING"
                      ).toUpperCase();

                    return (
                      <AppointmentRow
                        key={
                          appointmentId
                        }
                        appointment={
                          appointment
                        }
                        appointmentId={
                          appointmentId
                        }
                        appointmentStatus={
                          appointmentStatus
                        }
                        actionLoading={
                          actionLoading
                        }
                        handleApprove={
                          handleApprove
                        }
                        handleReject={
                          handleReject
                        }
                        formatDate={
                          formatDate
                        }
                      />
                    );
                  }
                )}

              </div>
            )}

          </>
        )}

                {/* =================================================
                    MY PROFILE
                ================================================= */}

                {activeSection === "profile" && (
                  <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                      <div>
                        <h2 style={styles.sectionTitle}>
                          👤 My Profile
                        </h2>

                        <p style={styles.sectionSubtitle}>
                          View and manage your professional information.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={openProfileEditor}
                        style={styles.editButton}
                      >
                        ✏️ Edit Profile
                      </button>

                    </div>

                    <div style={styles.detailsCard}>

                      {/* PROFESSIONAL INFORMATION */}
                      <div style={styles.detailsSection}>

                        <h3 style={styles.detailsHeading}>
                          Professional Information
                        </h3>

                        <div style={styles.detailsGrid}>

                          <Detail
                            icon="👨‍⚕️"
                            label="Doctor Name"
                            value={
                              doctorName
                                ? `Dr. ${doctorName}`
                                : "-"
                            }
                          />

                          <Detail
                            icon="🆔"
                            label="Doctor ID"
                            value={doctorId || "-"}
                          />

                          <Detail
                            icon="📧"
                            label="Email"
                            value={doctorEmail || "-"}
                          />

                          <Detail
                            icon="🩺"
                            label="Specialization"
                            value={
                              specialization ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="🎓"
                            label="Qualification"
                            value={
                              qualification ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="💼"
                            label="Experience"
                            value={
                              experienceYears !== "" &&
                              experienceYears !== null &&
                              experienceYears !== undefined
                                ? `${experienceYears} years`
                                : "Not specified"
                            }
                          />

                        </div>
                      </div>


                      {/* HOSPITAL & CLINIC INFORMATION */}
                      <div style={styles.detailsSection}>

                        <h3 style={styles.detailsHeading}>
                          Hospital & Clinic
                        </h3>

                        <div style={styles.detailsGrid}>

                          <Detail
                            icon="🏥"
                            label="Hospital"
                            value={
                              hospitalName ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="🏨"
                            label="Clinic"
                            value={
                              clinicName ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="📍"
                            label="City"
                            value={
                              city ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="💰"
                            label="Consultation Fee"
                            value={
                              consultationFee !== "" &&
                              consultationFee !== null &&
                              consultationFee !== undefined
                                ? `₹${consultationFee}`
                                : "Not specified"
                            }
                          />

                          <Detail
                            icon="🕐"
                            label="Available Timings"
                            value={
                              availableTimings ||
                              "Not specified"
                            }
                          />

                          <Detail
                            icon="🔐"
                            label="Verification"
                            value={
                              status
                                ? String(status).toUpperCase()
                                : "PENDING"
                            }
                          />

                        </div>
                      </div>

                    </div>

                  </section>
                )}


        {/* =================================================
            MY APPOINTMENTS
        ================================================= */}

        {activeSection ===
          "appointments" && (

          <AppointmentsSection
            appointments={
              appointments
            }
            loading={loading}
            error={error}
            actionLoading={
              actionLoading
            }
            handleApprove={
              handleApprove
            }
            handleReject={
              handleReject
            }
            formatDate={
              formatDate
            }
          />

        )}

        {/* =================================================
            MY PATIENTS
        ================================================= */}

        {activeSection === "patients" && (
          <>
            <PatientsSection
              patients={confirmedPatients}
              loading={loading}
              error={error}
              formatDate={formatDate}
              onRefresh={loadAppointments}
              onViewRecords={viewPatientClinical}
            />

            {clinicalRecords && (
              <section style={styles.section}>
                <PageHeader
                  title={`📋 Clinical Records — ${
                    clinicalRecords.patient?.patientName || "Patient"
                  }`}
                  subtitle="Complete patient clinical information including lab tests, medical history, reports, prescriptions and vitals."
                />

                <div style={styles.clinicalRecordsGrid}>

                  {/* LAB TESTS */}
                  <div style={styles.clinicalRecordCard}>
                    <div style={styles.clinicalRecordCardHeader}>
                      <div style={styles.clinicalRecordIcon}>
                        🧪
                      </div>

                      <div>
                        <h3 style={styles.clinicalRecordCardTitle}>
                          Lab Tests
                        </h3>

                        <p style={styles.clinicalRecordCardSubtitle}>
                          Requested laboratory tests
                        </p>
                      </div>
                    </div>

                    <ClinicalRecordTable
                      title=""
                      rows={clinicalRecords.labTests}
                      fields={[
                        "testName",
                        "status",
                        "suggestedAt",
                      ]}
                    />
                  </div>

                  {/* LAB REPORTS */}
                  <div style={styles.clinicalRecordCard}>
                    <div style={styles.clinicalRecordCardHeader}>
                      <div style={styles.clinicalRecordIcon}>
                        📄
                      </div>

                      <div>
                        <h3 style={styles.clinicalRecordCardTitle}>
                          Lab Reports
                        </h3>

                        <p style={styles.clinicalRecordCardSubtitle}>
                          Uploaded laboratory reports
                        </p>
                      </div>
                    </div>

                    <ClinicalRecordTable
                      title=""
                      rows={clinicalRecords.labReports}
                      fields={[
                        "reportName",
                        "uploadedAt",
                      ]}
                      onViewFile={(row) =>
                        viewClinicalFile("lab", row.id)
                      }
                    />
                  </div>

                  {/* OLD MEDICAL HISTORY */}
                  <div style={styles.clinicalRecordCard}>
                    <div style={styles.clinicalRecordCardHeader}>
                      <div style={styles.clinicalRecordIcon}>
                        📁
                      </div>

                      <div>
                        <h3 style={styles.clinicalRecordCardTitle}>
                          Old Medical History
                        </h3>

                        <p style={styles.clinicalRecordCardSubtitle}>
                          Previous medical records
                        </p>
                      </div>
                    </div>

                    <ClinicalRecordTable
                      title=""
                      rows={clinicalRecords.oldMedicalRecords}
                      fields={[
                        "fileName",
                        "createdAt",
                      ]}
                      onViewFile={(row) =>
                        viewClinicalFile("old", row.id)
                      }
                    />
                  </div>

                  {/* PRESCRIPTIONS */}
                  <div style={styles.clinicalRecordCard}>
                    <div style={styles.clinicalRecordCardHeader}>
                      <div style={styles.clinicalRecordIcon}>
                        💊
                      </div>

                      <div>
                        <h3 style={styles.clinicalRecordCardTitle}>
                          Prescriptions
                        </h3>

                        <p style={styles.clinicalRecordCardSubtitle}>
                          Medicines prescribed to the patient
                        </p>
                      </div>
                    </div>

                    <ClinicalRecordTable
                      title=""
                      rows={clinicalRecords.prescriptions}
                      fields={[
                        "medicine",
                        "dosage",
                        "duration",
                        "dispensed",
                      ]}
                    />
                  </div>

                  {/* VITALS */}
                  <div style={styles.clinicalRecordCard}>
                    <div style={styles.clinicalRecordCardHeader}>
                      <div style={styles.clinicalRecordIcon}>
                        ❤️
                      </div>

                      <div>
                        <h3 style={styles.clinicalRecordCardTitle}>
                          Patient Vitals
                        </h3>

                        <p style={styles.clinicalRecordCardSubtitle}>
                          Recorded patient vital information
                        </p>
                      </div>
                    </div>

                    <ClinicalRecordTable
                      title=""
                      rows={clinicalRecords.vitals}
                      fields={[
                        "bpSystolic",
                        "bpDiastolic",
                        "weightKg",
                        "recordedAt",
                      ]}
                    />
                  </div>

                </div>

                <div style={styles.closeRecordsContainer}>
                  <button
                    type="button"
                    style={styles.closeRecordsButton}
                    onClick={() => setClinicalRecords(null)}
                  >
                    ✕ Close Records
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* =================================================
            MEDICAL REPORTS
        ================================================= */}

        {activeSection ===
          "medicalReports" && (

          <MedicalReportsSection
            appointments={
              confirmedPatients
            }
            labTests={labTests}
            catalog={billingCatalog.labTests}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            form={labForm}
            setForm={setLabForm}
            loading={labLoading}
            message={labMessage}
            error={labError}
            onSave={
              handleSaveLabTest
            }
            onRefresh={
              loadLabTests
            }
          />

        )}

        {/* =================================================
            PRESCRIPTIONS
        ================================================= */}

        {activeSection ===
          "prescriptions" && (

          <PrescriptionsSection
            appointments={
              confirmedPatients
            }
            prescriptions={
              prescriptions
            }
            form={
              prescriptionForm
            }
            catalog={billingCatalog.medicines}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            setForm={
              setPrescriptionForm
            }
            loading={
              prescriptionLoading
            }
            message={
              prescriptionMessage
            }
            error={
              prescriptionError
            }
            onSave={
              handleSavePrescription
            }
            onRefresh={
              loadPrescriptions
            }
          />

        )}

      {isProfileEditorOpen && (
        <div style={styles.profileModalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) closeProfileEditor(); }}>
          <div style={styles.profileModal}>
            <div style={styles.profileModalHeader}>
              <div>
                <h2 style={{ margin: 0, color: "var(--db-heading)" }}>✏️ Edit  Profile</h2>
                <p style={{ margin: "5px 0 0", color: "var(--db-muted)", fontSize: 13 }}>Update your name, phone, professional details and password.</p>
              </div>
              <button type="button" onClick={closeProfileEditor} disabled={profileSaving} style={styles.profileClose}>×</button>
            </div>
            {profileError && <div style={styles.error}>{profileError}</div>}
            {profileMessage && <div style={styles.success}>{profileMessage}</div>}
            <form onSubmit={handleProfileSave} style={styles.profileForm}>
              <div style={styles.profileFormGrid}>
                {[["fullName","Full Name *","text"],["phoneNumber","Phone Number *","tel"],["email","Email *","email"],["qualification","Qualification *","text"],["specialization","Specialization *","text"],["experienceYears","Experience (years) *","number"],["consultationFee","Consultation Fee","number"],["city","City","text"],["hospitalName","Hospital","text"],["availableTimings","Available Timings","text"],["languagesKnown","Languages Known","text"]].map(([key,label,type]) => (
                  <label key={key} style={styles.profileField}>
                    <span>{label}</span>
                    <input type={type} value={profileForm[key]} min={key === "experienceYears" ? 0 : undefined} onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })} required={label.includes("*")} style={styles.input} />
                  </label>
                ))}
                <label style={{ ...styles.profileField, gridColumn: "1 / -1" }}>
                  <span>New Password (leave blank to keep current)</span>
                  <input type="password" minLength={6} value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} style={styles.input} placeholder="Minimum 6 characters" />
                </label>
                <label style={{ ...styles.profileField, gridColumn: "1 / -1" }}>
                  <span>About</span>
                  <textarea value={profileForm.about} onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })} style={{ ...styles.input, minHeight: 80, resize: "vertical" }} />
                </label>
              </div>
              <div style={styles.profileActions}>
                <button type="button" onClick={closeProfileEditor} disabled={profileSaving} style={styles.profileCancel}>Cancel</button>
                <button type="submit" disabled={profileSaving} style={styles.profileSave}>{profileSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

// ==========================================================
// PATIENTS SECTION
// ==========================================================
function ClinicalRecordTable({
  title,
  rows,
  fields,
  onViewFile,
}) {
  return (
    <div>
      {title && (
        <h4 style={styles.clinicalRecordTitle}>
          {title}
        </h4>
      )}

      {!rows || rows.length === 0 ? (
        <div style={styles.clinicalRecordEmpty}>
          No records available.
        </div>
      ) : (
        <div style={styles.clinicalRecordTableWrap}>
          <table style={styles.clinicalRecordTable}>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th
                    key={field}
                    style={styles.clinicalRecordTableHeader}
                  >
                    {field}
                  </th>
                ))}

                {onViewFile && (
                  <th style={styles.clinicalRecordTableHeader}>
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || index}>
                  {fields.map((field) => (
                    <td
                      key={field}
                      style={styles.clinicalRecordTableCell}
                    >
                      {String(row[field] ?? "-")}
                    </td>
                  ))}

                  {onViewFile && (
                    <td
                      style={styles.clinicalRecordTableCell}
                    >
                      <button
                        type="button"
                        style={styles.clinicalRecordFileButton}
                        onClick={() => onViewFile(row)}
                      >
                        👁 View File
                      </button>
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



function PatientsSection({
  patients,
  loading,
  error,
  formatDate,
  onRefresh,
  onViewRecords,
}) {
  return (
    <>
      <PageHeader
        title="My Patients"
        subtitle="Confirmed patients assigned to you."
        onRefresh={onRefresh}
      />

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingCard text="Loading confirmed patients..." />
      ) : patients.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            👥
          </div>

          <h3>
            No confirmed patients
          </h3>

          <p>
            Patients will appear here
            after you confirm their
            appointments.
          </p>
        </div>
      ) : (
        <div style={styles.patientGrid}>
          {patients.map(
            (patient) => (
              <div
                key={
                  patient.id ||
                  patient.appointmentId
                }
                style={
                  styles.patientCard
                }
              >
                <div
                  style={
                    styles.patientCardHeader
                  }
                >
                  <div
                    style={
                      styles.largePatientAvatar
                    }
                  >
                    👤
                  </div>

                  <div>
                    <h3
                      style={
                        styles.patientCardName
                      }
                    >
                      {patient.patientName ||
                        "Patient"}
                    </h3>


                  </div>
                </div>

                <div style={styles.patientInfoGrid}>



                  <InfoItem
                    label="Patient ID"
                    value={
                      patient.patientId ||
                      patient.id ||
                      "-"
                    }
                  />
                  <InfoItem
                                      label="Problem"
                                      value={
                                        patient.problem ||
                                        patient.reason ||
                                        "Not provided"
                                      }
                                    />



                  <InfoItem
                    label="Age"
                    value={
                      patient.patientAge ??
                      patient.age ??
                      patient.patient?.patientAge ??
                      patient.patient?.age ??
                      "-"
                    }
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      patient.patientGender ||
                      patient.gender ||
                      patient.sex ||
                      patient.patient?.patientGender ||
                      patient.patient?.gender ||
                      patient.patient?.sex ||
                      "-"
                    }
                  />





                </div>
                <div
                  style={
                    styles.confirmedPatientBadge
                  }
                >
                  ✓ CONFIRMED
                </div>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() =>
                    onViewRecords(
                      patient.patientId ||
                      patient.id
                    )
                  }
                >
                  📋 View Medical Records
                </button>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}




// ==========================================================
// APPOINTMENTS SECTION
// ==========================================================

function AppointmentsSection({
  appointments,
  loading,
  error,
  actionLoading,
  handleApprove,
  handleReject,
  formatDate,
}) {
  return (
    <>
      <PageHeader
        title="My Appointments"
        subtitle="Manage patient appointment requests."
      />

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingCard text="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            📅
          </div>

          <h3>
            No appointments
          </h3>

          <p>
            Patient appointments will
            appear here.
          </p>
        </div>
      ) : (
        <div style={styles.fullAppointmentList}>
          {appointments.map(
            (appointment) => {

              const appointmentId =
                appointment.id ||
                appointment.appointmentId;

              const appointmentStatus =
                String(
                  appointment.status ||
                    "PENDING"
                ).toUpperCase();

              return (
                <AppointmentRow
                  key={
                    appointmentId
                  }
                  appointment={
                    appointment
                  }
                  appointmentId={
                    appointmentId
                  }
                  appointmentStatus={
                    appointmentStatus
                  }
                  actionLoading={
                    actionLoading
                  }
                  handleApprove={
                    handleApprove
                  }
                  handleReject={
                    handleReject
                  }
                  formatDate={
                    formatDate
                  }
                />
              );
            }
          )}
        </div>
      )}


    </>
  );
}

// ==========================================================
// MEDICAL REPORTS SECTION
// ==========================================================

function MedicalReportsSection({
  appointments,
  labTests,
  catalog = [],
  catalogLoading = false,
  catalogError = "",
  form,
  setForm,
  loading,
  message,
  error,
  onSave,
  onRefresh,
}) {
  return (
    <>
      <PageHeader
        title="Suggest Medical Test for Patients"
        subtitle="Suggest medical reports and lab tests for confirmed patients."
        onRefresh={onRefresh}
      />

      {message && (
        <div style={styles.success}>
          {message}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <section
        style={
          styles.formCard
        }
      >
        <h2 style={styles.cardTitle}>
          📄 Suggest Medical Test
        </h2>

        <p
          style={
            styles.cardDescription
          }
        >
          Select a confirmed patient and
          suggest the required laboratory
          test.
        </p>

        <form
          onSubmit={onSave}
          style={
            styles.form
          }
        >
          <select
            value={
              form.appointmentId
            }
            onChange={(e) =>
              setForm({
                ...form,
                appointmentId:
                  e.target.value,
              })
            }
            required
            style={
              styles.input
            }
          >
            <option value="">
              Select confirmed patient
            </option>

            {appointments.map(
              (appointment) => (
                <option
                  key={
                    appointment.id ||
                    appointment.appointmentId
                  }
                  value={
                    appointment.id ||
                    appointment.appointmentId
                  }
                >
                  {appointment.patientName ||
                    "Patient"}{" "}
                  —{" "}
                  {appointment.appointmentDate ||
                    "-"}{" "}
                  {appointment.appointmentTime ||
                    ""}
                  {" "}
                  (ID{" "}
                  {appointment.id ||
                    appointment.appointmentId}
                  )
                </option>
              )
            )}
          </select>

          <fieldset style={{ gridColumn: "1 / -1",border: "1px solid var(--db-border-strong)", borderRadius: 8, padding: 14, margin: 0 }}>
            <legend style={{ padding: "0 6px", fontWeight: 700, color: "var(--db-text)" }}>Select one or more priced lab tests</legend>
            <div style={{ display: "grid", gap: 8, maxHeight: 220, overflowY: "auto" }}>
              {catalogLoading && <p style={styles.cardDescription}>Loading priced lab tests…</p>}
              {!catalogLoading && catalogError && <p role="alert" style={styles.error}>{catalogError}</p>}
              {!catalogLoading && !catalogError && catalog.length === 0 && <p style={styles.cardDescription}>No priced lab tests are available.</p>}
              {catalog.map((item) => {
                const selected = (form.testNames || []).includes(item.name);
                return (
                  <label key={item.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: selected ? "#eff8ff" : "#fff", cursor: "pointer" }}>
                    <input type="checkbox" checked={selected} onChange={(event) => setForm({ ...form, testNames: event.target.checked ? [...(form.testNames || []), item.name] : (form.testNames || []).filter((name) => name !== item.name) })} />
                    <span>{item.name}</span><strong style={{ marginLeft: "auto" }}>₹{(item.pricePaise / 100).toFixed(2)}</strong>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {(form.testNames || []).length > 0 && <p style={styles.cardDescription}>Selected {(form.testNames || []).length} test(s). Total invoice amount: ₹{((form.testNames || []).reduce((sum, name) => sum + (catalog.find((item) => item.name === name)?.pricePaise || 0), 0) / 100).toFixed(2)}. An invoice will be created for each test.</p>}

          <textarea
            placeholder="Instructions (optional)"
            value={
              form.instructions
            }
            onChange={(e) =>
              setForm({
                ...form,
                instructions:
                  e.target.value,
              })
            }
            style={
              styles.textarea
            }
          />

          <button
            type="submit"
            disabled={loading}
            style={
              styles.primaryButton
            }
          >
            {loading
              ? "Saving..."
              : "📄 Request for Medical Test"}
          </button>
        </form>
      </section>


    </>
  );
}



function PrescriptionsSection({
  appointments,
  prescriptions,
  catalog = [],
  catalogLoading = false,
  catalogError = "",
  form,
  setForm,
  loading,
  message,
  error,
  onSave,
  onRefresh,
}) {
  return (
    <>
      <PageHeader
        title="Prescriptions"
        subtitle="Create prescriptions for your confirmed patients."
        onRefresh={onRefresh}
      />

      {message && (
        <div style={styles.success}>
          {message}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <section
        style={
          styles.formCard
        }
      >
        <h2 style={styles.cardTitle}>
          💊 Suggest Medicine
        </h2>

        <p
          style={
            styles.cardDescription
          }
        >
          Choose a confirmed patient and
          create their prescription.
        </p>

        <form
          onSubmit={onSave}
          style={
            styles.form
          }
        >
          <select
            value={
              form.appointmentId
            }
            onChange={(e) =>
              setForm({
                ...form,
                appointmentId:
                  e.target.value,
              })
            }
            required
            style={
              styles.input
            }
          >
            <option value="">
              Select confirmed patient
            </option>

            {appointments.map(
              (appointment) => (
                <option
                  key={
                    appointment.id ||
                    appointment.appointmentId
                  }
                  value={
                    appointment.id ||
                    appointment.appointmentId
                  }
                >
                  {appointment.patientName ||
                    "Patient"}{" "}
                  —{" "}
                  {appointment.appointmentDate ||
                    "-"}{" "}
                  {appointment.appointmentTime ||
                    ""}
                  {" "}
                  (ID{" "}
                  {appointment.id ||
                    appointment.appointmentId}
                  )
                </option>
              )
            )}
          </select>

          <fieldset style={{ gridColumn: "1 / -1", border: "1px solid var(--db-border-strong)", borderRadius: 8, padding: 14, margin: 0 }}>
            <legend style={{ padding: "0 6px", fontWeight: 700, color: "var(--db-text)" }}>Select medicines</legend>
            <div style={{ display: "grid", gap: 8, maxHeight: 200, overflowY: "auto" }}>
              {catalogLoading && <p style={styles.cardDescription}>Loading priced medicines…</p>}
              {!catalogLoading && catalogError && <p role="alert" style={styles.error}>{catalogError}</p>}
              {!catalogLoading && !catalogError && catalog.length === 0 && <p style={styles.cardDescription}>No priced medicines are available.</p>}
              {catalog.map((item) => {
                const selected = (form.medicines || []).some((entry) => entry.medicine === item.name);
                return (
                  <label key={item.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: selected ? "#eff8ff" : "#fff", cursor: "pointer" }}>
                    <input type="checkbox" checked={selected} onChange={(event) => setForm({ ...form, medicines: event.target.checked ? [...(form.medicines || []), { medicine: item.name, dosage: "", duration: "", dosingTimes: [] }] : (form.medicines || []).filter((entry) => entry.medicine !== item.name) })} />
                    <span>{item.name}</span><strong style={{ marginLeft: "auto" }}>₹{(item.pricePaise / 100).toFixed(2)}</strong>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {(form.medicines || []).map((entry, index) => (
            <div key={entry.medicine} style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "minmax(150px, 1fr) 1fr 1fr", gap: 12, alignItems: "center", padding: 12, border: "1px solid var(--db-border)", borderRadius: 8 }}>
              <strong>{entry.medicine}</strong>
              <select aria-label={`${entry.medicine} dosage`} value={entry.dosage} onChange={(event) => setForm({ ...form, medicines: form.medicines.map((item, i) => i === index ? { ...item, dosage: event.target.value } : item) })} required style={styles.input}><option value="">Select dosage</option>{["1 tablet", "2 tablets", "3 tablets", "1 capsule", "2 capsules", "5 ml", "10 ml", "1 drop"].map((dose) => <option key={dose} value={dose}>{dose}</option>)}</select>
              <input type="text" placeholder="Duration (e.g. 5 days)" value={entry.duration} onChange={(event) => setForm({ ...form, medicines: form.medicines.map((item, i) => i === index ? { ...item, duration: event.target.value } : item) })} required style={styles.input} />
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, flexWrap: "wrap" }}><span>Take at:</span>{["Morning", "Afternoon", "Evening"].map((time) => <label key={time} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><input type="checkbox" checked={(entry.dosingTimes || []).includes(time)} onChange={(event) => setForm({ ...form, medicines: form.medicines.map((item, i) => i === index ? { ...item, dosingTimes: event.target.checked ? [...(item.dosingTimes || []), time] : (item.dosingTimes || []).filter((value) => value !== time) } : item) })} />{time}</label>)}</div>
            </div>
          ))}
          {(form.medicines || []).length > 0 && <p style={{ ...styles.cardDescription, gridColumn: "1 / -1" }}>Combined medicine total: ₹{((form.medicines || []).reduce((sum, entry) => sum + (catalog.find((item) => item.name === entry.medicine)?.pricePaise || 0), 0) / 100).toFixed(2)}. Each medicine has its own dosage, duration and invoice.</p>}

          <input
            type="text"
            placeholder="Suggested Pharmacy (optional)"
            value={
              form.pharmacyName
            }
            onChange={(e) =>
              setForm({
                ...form,
                pharmacyName:
                  e.target.value,
              })
            }
            style={
              styles.input
            }
          />

          <textarea
            placeholder="Instructions (optional)"
            value={
              form.instructions
            }
            onChange={(e) =>
              setForm({
                ...form,
                instructions:
                  e.target.value,
              })
            }
            style={
              styles.textarea
            }
          />

          <button
            type="submit"
            disabled={loading}
            style={
              styles.primaryButton
            }
          >
            {loading
              ? "Saving..."
              : "💊 Save Prescription"}
          </button>
        </form>
      </section>


    </>
  );
}

// ==========================================================
// APPOINTMENT ROW
// ==========================================================

function AppointmentRow({
  appointment,
  appointmentId,
  appointmentStatus,
  actionLoading,
  handleApprove,
  handleReject,
  formatDate,
}) {
  const pending =
    appointmentStatus ===
    "PENDING";

  const confirmed =
    appointmentStatus ===
    "CONFIRMED";

  const rejected =
    appointmentStatus ===
    "REJECTED";

  const cancelled =
    appointmentStatus ===
    "CANCELLED";

  return (
    <div
      style={
        styles.appointmentCard
      }
    >
      <div
        style={
          styles.appointmentPatient
        }
      >
        <div
          style={
            styles.patientAvatar
          }
        >
          👤
        </div>

        <div>
          <strong
            style={
              styles.patientName
            }
          >
            {appointment.patientName ||
              "Patient"}
          </strong>

          <span
            style={
              styles.patientId
            }
          >
            Patient ID:{" "}
            {appointment.patientId ||
              "-"}
          </span>
        </div>
      </div>

      <div
        style={
          styles.appointmentDetails
        }
      >
        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Date
          </span>

          <strong>
            {formatDate(
              appointment.appointmentDate
            )}
          </strong>
        </div>

        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Time
          </span>

          <strong>
            {appointment.appointmentTime ||
              "-"}
          </strong>
        </div>

        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Reason
          </span>

          <strong
            style={
              styles.reason
            }
          >
            {appointment.problem ||
              "Not provided"}
          </strong>
        </div>
      </div>

      <span
        style={{
          ...styles.appointmentStatus,

          ...(confirmed
            ? styles.confirmedStatus
            : rejected ||
              cancelled
            ? styles.cancelledStatus
            : styles.pendingStatus),
        }}
      >
        {appointmentStatus}
      </span>

      <span style={{
        display: "inline-block",
        width: "fit-content",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: appointment.paymentStatus === "PAID" ? "#dcfce7" : appointment.paymentStatus === "INVOICE_MISSING" ? "#fee2e2" : appointment.paymentStatus === "NOT_DUE" ? "#f1f5f9" : "#fef3c7",
        color: appointment.paymentStatus === "PAID" ? "#166534" : appointment.paymentStatus === "INVOICE_MISSING" ? "#991b1b" : appointment.paymentStatus === "NOT_DUE" ? "#475569" : "#92400e",
      }}>
        Payment: {(appointment.paymentStatus || (confirmed ? "INVOICE_MISSING" : "NOT_DUE")).replaceAll("_", " ")}
      </span>

      {pending && (
        <div
          style={
            styles.recentActions
          }
        >
          <button
            type="button"
            disabled={
              actionLoading !==
              null
            }
            onClick={() =>
              handleApprove(
                appointmentId
              )
            }
            style={
              styles.smallApproveButton
            }
          >
            {actionLoading ===
            `approve-${appointmentId}`
              ? "..."
              : "✓ Approve"}
          </button>

          <button
            type="button"
            disabled={
              actionLoading !==
              null
            }
            onClick={() =>
              handleReject(
                appointmentId
              )
            }
            style={
              styles.smallRejectButton
            }
          >
            {actionLoading ===
            `reject-${appointmentId}`
              ? "..."
              : "✕ Reject"}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// PENDING APPOINTMENT
// ==========================================================

function PendingAppointment({
  appointment,
  appointmentId,
  actionLoading,
  handleApprove,
  handleReject,
  formatDate,
}) {
  return (
    <div
      style={
        styles.pendingAppointmentCard
      }
    >
      <div
        style={
          styles.appointmentPatient
        }
      >
        <div
          style={
            styles.patientAvatar
          }
        >
          👤
        </div>

        <div>
          <strong
            style={
              styles.patientName
            }
          >
            {appointment.patientName ||
              "Patient"}
          </strong>

          <span
            style={
              styles.patientId
            }
          >
            Patient ID:{" "}
            {appointment.patientId ||
              "-"}
          </span>
        </div>
      </div>

      <div
        style={
          styles.pendingDetails
        }
      >
        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Date
          </span>

          <strong>
            {formatDate(
              appointment.appointmentDate
            )}
          </strong>
        </div>

        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Time
          </span>

          <strong>
            {appointment.appointmentTime ||
              "-"}
          </strong>
        </div>

        <div>
          <span
            style={
              styles.appointmentLabel
            }
          >
            Reason
          </span>

          <strong
            style={
              styles.reason
            }
          >
            {appointment.problem ||
              "Not provided"}
          </strong>
        </div>
      </div>

      <div
        style={
          styles.appointmentActions
        }
      >
        <button
          type="button"
          disabled={
            actionLoading !== null
          }
          onClick={() =>
            handleApprove(
              appointmentId
            )
          }
          style={
            styles.approveButton
          }
        >
          {actionLoading ===
          `approve-${appointmentId}`
            ? "Approving..."
            : "✓ Approve"}
        </button>

        <button
          type="button"
          disabled={
            actionLoading !== null
          }
          onClick={() =>
            handleReject(
              appointmentId
            )
          }
          style={
            styles.rejectButton
          }
        >
          {actionLoading ===
          `reject-${appointmentId}`
            ? "Rejecting..."
            : "✕ Reject"}
        </button>
      </div>
    </div>
  );
}

// ==========================================================
// PAGE HEADER
// ==========================================================

function PageHeader({
  title,
  subtitle,
  onRefresh,
}) {
  return (
    <div
      style={
        styles.topHeader
      }
    >
      <div>
        <h1
          style={
            styles.title
          }
        >
          {title}
        </h1>

        <p
          style={
            styles.subtitle
          }
        >
          {subtitle}
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          style={
            styles.refreshButton
          }
        >
          🔄 Refresh
        </button>
      )}
    </div>
  );
}

// ==========================================================
// LOADING CARD
// ==========================================================

function LoadingCard({
  text,
}) {
  return (
    <div
      style={
        styles.loadingCard
      }
    >
      <div
        style={
          styles.spinner
        }
      />

      <p>{text}</p>
    </div>
  );
}

// ==========================================================
// DETAIL
// ==========================================================

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={
        styles.detail
      }
    >
      <div
        style={
          styles.detailIcon
        }
      >
        {icon}
      </div>

      <div
        style={
          styles.detailContent
        }
      >
        <span
          style={
            styles.detailLabel
          }
        >
          {label}
        </span>

        <strong
          style={
            styles.detailValue
          }
        >
          {value || "-"}
        </strong>
      </div>
    </div>
  );
}

// ==========================================================
// STAT CARD
// ==========================================================

function StatCard({
  icon,
  label,
  value,
  type,
}) {
  let iconStyle =
    styles.statIcon;

  if (type === "pending") {
    iconStyle =
      styles.statIconPending;
  }

  if (type === "confirmed") {
    iconStyle =
      styles.statIconConfirmed;
  }

  if (type === "rejected") {
    iconStyle =
      styles.statIconCancelled;
  }

  return (
    <div
      style={
        styles.statCard
      }
    >
      <div
        style={iconStyle}
      >
        {icon}
      </div>

      <div>
        <span
          style={
            styles.statLabel
          }
        >
          {label}
        </span>

        <strong
          style={
            styles.statNumber
          }
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

// ==========================================================
// QUICK ACTION
// ==========================================================

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        styles.actionCard
      }
    >
      <span
        style={
          styles.actionIcon
        }
      >
        {icon}
      </span>

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>
      </div>
    </button>
  );
}

// ==========================================================
// INFO ITEM
// ==========================================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div
      style={
        styles.infoItem
      }
    >
      <span
        style={
          styles.infoLabel
        }
      >
        {label}
      </span>

      <strong
        style={
          styles.infoValue
        }
      >
        {value || "-"}
      </strong>
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "var(--db-bg)",
    display: "flex",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "var(--db-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  // SIDEBAR

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
  },

  brandTitle: {
    margin: 0,
    fontSize: "17px",
  },

  brandSubtitle: {
    margin:
      "3px 0 0",
    fontSize: "12px",
    color: "#b8d4e8",
  },

  doctorBox: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding:
      "20px 8px",
    borderBottom:
      "1px solid rgba(255,255,255,.12)",
  },

  doctorAvatar: {
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
  },

  doctorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },

  doctorAccount: {
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
    paddingTop: "10px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  navItem: {
    width: "100%",
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
  },

  activeNavItem: {
    background: "#1769aa",
    color: "white",
    boxShadow:
      "0 4px 12px rgba(0,0,0,.18)",
  },

  navIcon: {
    width: "22px",
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

  sidebarBottom: {
    flexShrink: 0,
    paddingTop: "15px",
    borderTop:
      "1px solid rgba(255,255,255,.12)",
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

  // MAIN

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
    margin:
      "7px 0 0",
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

  // WELCOME

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
    marginBottom: "22px",
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
  },

  welcomeSmall: {
    color: "#cde6f8",
    fontSize: "13px",
  },

  welcomeName: {
    margin:
      "4px 0",
    fontSize: "24px",
  },

  welcomeSpecialization: {
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

  statusBadge: {
    display: "inline-block",
    padding:
      "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
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

  confirmedStatus: {
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
  },

  cancelledStatus: {
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
  },

  // DETAILS

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    marginTop: "5px",
  },

  sectionTitle: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "21px",
  },

  sectionSubtitle: {
    margin:
      "4px 0 0",
    color: "var(--db-muted)",
    fontSize: "13px",
  },

  profileModalOverlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  profileModal: { width: "min(900px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "var(--db-surface)", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
  profileModalHeader: { display: "flex", justifyContent: "space-between", gap: "15px", alignItems: "flex-start", marginBottom: "18px" },
  profileClose: { border: "none", background: "var(--db-surface-2)", width: "36px", height: "36px", borderRadius: "50%", fontSize: "24px", cursor: "pointer" },
  profileForm: { display: "flex", flexDirection: "column", gap: "16px" },
  profileFormGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "13px" },
  profileField: { display: "flex", flexDirection: "column", gap: "6px", color: "var(--db-text)", fontSize: "12px", fontWeight: 700 },
  profileActions: { display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" },
  profileCancel: { padding: "10px 16px", border: "1px solid var(--db-border-strong)", borderRadius: "8px", background: "var(--db-surface)", cursor: "pointer", fontWeight: 700 },
  profileSave: { padding: "10px 18px", border: "none", borderRadius: "8px", background: "#1769aa", color: "white", cursor: "pointer", fontWeight: 700 },

  editButton: {
    border:
      "1px solid #1769aa",
    borderRadius: "8px",
    padding:
      "9px 14px",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  viewAllButton: {
    border: "none",
    background: "transparent",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  detailsCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "23px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
    marginBottom: "28px",
  },

  detailsSection: {
    marginBottom: "24px",
  },

  detailsHeading: {
    margin:
      "0 0 15px",
    color: "var(--db-heading)",
    fontSize: "16px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },

  detail: {
    padding: "14px",
    borderRadius: "9px",
    background: "var(--db-surface-2)",
    display: "flex",
    gap: "10px",
  },

  detailIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  detailContent: {
    minWidth: 0,
  },

  detailLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "11px",
    marginBottom: "4px",
  },

  detailValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "13px",
    wordBreak:
      "break-word",
  },

  // STATS

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
    fontSize: "22px",
  },

  // APPOINTMENTS

  pendingAppointmentCard: {
    background: "var(--db-surface)",
    borderRadius: "13px",
    padding: "18px",
    marginBottom: "12px",
    display: "grid",
    gridTemplateColumns:
      "1.2fr 2fr auto",
    alignItems: "center",
    gap: "20px",
    border:
      "1px solid var(--db-amber-border)",
  },

  pendingDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },

  appointmentActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  approveButton: {
    minWidth: "110px",
    padding:
      "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#198754",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  rejectButton: {
    minWidth: "110px",
    padding:
      "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#dc3545",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  noPendingCard: {
    background: "var(--db-surface)",
    borderRadius: "13px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "28px",
  },

  noPendingIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  appointmentList: {
    display: "grid",
    gap: "12px",
    marginBottom: "30px",
  },

  fullAppointmentList: {
    display: "grid",
    gap: "15px",
  },

  appointmentCard: {
    background: "var(--db-surface)",
    borderRadius: "12px",
    padding: "16px",
    display: "grid",
    gridTemplateColumns:
      "1.2fr 2fr auto",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,.05)",
    border:
      "1px solid var(--db-border)",
  },

  appointmentPatient: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: 0,
  },

  patientAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  patientName: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "14px",
  },

  patientId: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "11px",
    marginTop: "3px",
  },

  appointmentDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },

  appointmentLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "11px",
    marginBottom: "3px",
  },

  reason: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "12px",
    wordBreak:
      "break-word",
  },

  appointmentStatus: {
    padding:
      "7px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  recentActions: {
    display: "flex",
    gap: "7px",
    gridColumn:
      "1 / -1",
    borderTop:
      "1px solid var(--db-border)",
    paddingTop: "12px",
  },

  smallApproveButton: {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 12px",
    background: "#198754",
    color: "white",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  smallRejectButton: {
    border: "none",
    borderRadius: "7px",
    padding:
      "7px 12px",
    background: "#dc3545",
    color: "white",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  // QUICK ACTION

  quickActions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "28px",
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

  // PATIENTS

  patientGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  patientCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
    border:
      "1px solid var(--db-border)",
    position: "relative",
  },

  patientCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "18px",
  },

  largePatientAvatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  patientCardName: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "17px",
  },

  patientInfoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  infoItem: {
    padding: "11px",
    borderRadius: "8px",
    background: "var(--db-surface-2)",
  },

  infoLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "10px",
    marginBottom: "4px",
  },

  infoValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "12px",
    wordBreak:
      "break-word",
  },

  confirmedPatientBadge: {
    display: "inline-block",
    marginTop: "16px",
    padding:
      "6px 10px",
    borderRadius: "15px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    fontSize: "10px",
    fontWeight: 800,
  },

  // FORMS

  formCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  cardTitle: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "19px",
  },

  cardDescription: {
    margin:
      "6px 0 20px",
    color: "var(--db-muted)",
    fontSize: "13px",
  },

  form: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  input: {
    width: "100%",

    padding:
      "12px 13px",
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    padding:
      "12px 13px",
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    fontSize: "13px",
    boxSizing: "border-box",
    resize: "vertical",
    gridColumn:
      "1 / -1",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  primaryButton: {
    gridColumn:
      "1 / -1",
    padding:
      "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    padding:
      "10px 18px",
    border: "none",
    borderRadius: "8px",
    marginLeft:"100px",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
  },


  // TABLE

  tableCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "23px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
    marginBottom: "30px",
  },

  tableHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  countBadge: {
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    padding:
      "7px 12px",
    borderRadius: "20px",
    fontWeight: 800,
    fontSize: "12px",
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    fontSize: "12px",
  },

  tableStatus: {
    display: "inline-block",
    padding:
      "5px 9px",
    borderRadius: "15px",
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
    fontWeight: 700,
  },

  emptyTable: {
    padding: "30px",
    textAlign: "center",
    color: "var(--db-muted)",
    background: "var(--db-surface-2)",
    borderRadius: "9px",
  },

  // COMMON

  success: {
    marginBottom: "20px",
    padding:
      "13px 16px",
    borderRadius: "9px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
  },

  error: {
    marginBottom: "20px",
    padding:
      "13px 16px",
    borderRadius: "9px",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
  },

  emptyCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "45px",
    textAlign: "center",
    color: "var(--db-muted)",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  loadingCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "35px",
    textAlign: "center",
    color: "var(--db-muted)",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },


  clinicalRecordsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  clinicalRecordCard: {
    background: "var(--db-surface)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid var(--db-border)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
    minWidth: 0,
  },

  clinicalRecordCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "18px",
    paddingBottom: "15px",
    borderBottom: "1px solid var(--db-border)",
  },

  clinicalRecordIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  clinicalRecordCardTitle: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "17px",
    fontWeight: 700,
  },

  clinicalRecordCardSubtitle: {
    margin: "4px 0 0",
    color: "var(--db-muted)",
    fontSize: "12px",
  },

  clinicalRecordTableWrap: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "10px",
    border: "1px solid var(--db-border)",
  },

  clinicalRecordTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    background: "var(--db-surface)",
  },

  clinicalRecordTableHeader: {
    background: "#1769aa",
    color: "#ffffff",
    padding: "11px 12px",
    textAlign: "left",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  clinicalRecordTableCell: {
    padding: "11px 12px",
    borderBottom: "1px solid var(--db-border)",
    color: "var(--db-text)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },

  clinicalRecordFileButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "7px 12px",
    border: "1px solid #1769aa",
    borderRadius: "7px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },

  clinicalRecordStatus: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "14px",
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
    fontSize: "10px",
    fontWeight: 700,
  },

  clinicalRecordEmpty: {
    padding: "20px",
    textAlign: "center",
    background: "var(--db-surface-2)",
    borderRadius: "8px",
    color: "var(--db-muted)",
    fontSize: "12px",
  },

  closeRecordsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },

  closeRecordsButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 20px",
    border: "none",
    borderRadius: "9px",
    background: "#1769aa",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(23, 105, 170, 0.20)",
  },









  availabilityCard:{background:"var(--db-surface)",borderRadius:16,padding:20,boxShadow:"0 8px 24px rgba(0,0,0,.06)",marginBottom:20},
  sectionHeaderRow:{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",marginBottom:14},
  availabilityCalendar:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(82px,1fr))",gap:8,marginBottom:16},
  dayButton:{border:"1px solid var(--db-border)",background:"var(--db-surface)",borderRadius:10,padding:"10px 6px",cursor:"pointer",display:"grid",gap:4,textAlign:"center"},
  dayButtonSelected:{border:"2px solid #0f766e",background:"var(--db-cyan-bg)"},
  availabilityForm:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,alignItems:"end"},
  availabilityToggle:{display:"flex",gap:8,alignItems:"center",fontWeight:600,color:"var(--db-text)",paddingBottom:10},
  inactiveStatus:{background:"var(--db-surface-2)",color:"var(--db-text)"},
  primaryButton:{border:"none",background:"#0f766e",color:"white",borderRadius:8,padding:"11px 16px",fontWeight:700,cursor:"pointer"},
  success:{marginTop:12,padding:10,borderRadius:8,background:"var(--db-green-bg)",color:"var(--db-green-text)"},
};


export default DoctorDashboard;

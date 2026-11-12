import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalProfilePhoto from "../components/LocalProfilePhoto";

import {
  getAllAdmins, getAllPatients, getAllAppointments, getAllDoctors, createAdmin,
  approveDoctor, rejectDoctor, getActivityLogs, getPatientClinicalRecords, createDoctor, updateStaffByAdmin, deleteStaffByAdmin, updateDoctorByAdmin, deleteDoctorByAdmin, getAllHealthCheckups, getAdminBillingInvoices, renewAdminBillingInvoice,
} from "../services/adminService";

function buildAdminInvoicesPdf(invoices) {
  const safeText = (value) => String(value ?? "-")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .slice(0, 110);
  const pages = invoices.map((invoice) => {
    const paid = String(invoice.status || "").toUpperCase() === "PAID";
    const status = paid ? "PAID" : invoice.paymentExpired ? "EXPIRED" : String(invoice.status || "PENDING").toUpperCase();
    const amount = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((invoice.amountPaise || 0) / 100);
    return [
      `Invoice: ${invoice.invoiceNumber || `INV-${invoice.id}`}`,
      `Status: ${status}`,
      `Patient: ${invoice.patientName || "Patient"}`,
      `Patient ID: ${invoice.patientId || "-"}`,
      `Invoice type: ${String(invoice.invoiceType || "APPOINTMENT").replaceAll("_", " ")}`,
      `Item: ${invoice.itemName || "Consultation"}`,
      `Amount: INR ${amount}`,
      `Payment method: ${invoice.paymentMethod || "-"}`,
      `Created at: ${invoice.createdAt || "-"}`,
      `Paid at: ${invoice.paidAt || "-"}`,
      `Appointment: ${invoice.appointmentId ? `#${invoice.appointmentId}` : "-"}`,
      `Doctor: ${invoice.doctorName || "-"}`,
      `Specialization: ${invoice.specialization || "-"}`,
      `Hospital: ${invoice.hospitalName || "-"}`,
      `Razorpay payment ID: ${invoice.razorpayPaymentId || "-"}`,
      `Razorpay order ID: ${invoice.razorpayOrderId || "-"}`,
    ];
  });
  const pageObjects = pages.map((lines, index) => {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    const content = ["BT", "/F1 18 Tf", "1 0 0 1 50 755 Tm (MediCore - Invoice) Tj", "/F1 11 Tf",
      ...lines.map((line, lineIndex) => `1 0 0 1 50 ${715 - lineIndex * 27} Tm (${safeText(line)}) Tj`), "ET"].join("\n");
    return [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R >> >> /Contents ${contentId} 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ];
  });
  const fontId = 3 + pages.length * 2;
  const kids = pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`,
    ...pageObjects.flat(),
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function downloadInvoicePdf(invoice) {
  const url = URL.createObjectURL(buildAdminInvoicesPdf([invoice]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(invoice.invoiceNumber || `invoice-${invoice.id}`).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function viewInvoicePdf(invoice) {
  const url = URL.createObjectURL(buildAdminInvoicesPdf([invoice]));
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function downloadPatientInvoicesPdf(invoices, patientId) {
  if (!invoices.length) return;
  const url = URL.createObjectURL(buildAdminInvoicesPdf(invoices));
  const link = document.createElement("a");
  link.href = url;
  link.download = `patient-${String(patientId).replace(/[^a-zA-Z0-9_-]/g, "_")}-invoices.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadAllInvoicesPdf(invoices) {
  if (!invoices.length) return;
  const url = URL.createObjectURL(buildAdminInvoicesPdf(invoices));
  const link = document.createElement("a");
  link.href = url;
  link.download = "all-patient-invoices.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadAllInvoicesCsv(invoices) {
  if (!invoices.length) return;
  const headers = ["Invoice", "Patient", "Patient ID", "Type", "Item", "Amount (INR)", "Payment Method", "Status", "Created At", "Paid At"];
  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber || `#${invoice.id}`,
    invoice.patientName || "Patient",
    invoice.patientId || "",
    String(invoice.invoiceType || "APPOINTMENT").replaceAll("_", " "),
    invoice.itemName || "Consultation",
    ((invoice.amountPaise || 0) / 100).toFixed(2),
    invoice.paymentMethod || "",
    String(invoice.status || "PENDING").toUpperCase() === "PAID" ? "PAID" : invoice.paymentExpired ? "EXPIRED" : invoice.status || "PENDING",
    invoice.createdAt || "",
    invoice.paidAt || "",
  ]);
  const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `all-patient-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminDashboard() {

  const navigate = useNavigate();

  const role = sessionStorage.getItem("adminRole");
  const adminId = sessionStorage.getItem("adminId");
  const adminEmail = sessionStorage.getItem("adminEmail");
  const adminName = sessionStorage.getItem("adminName") || (role === "MAIN_ADMIN" ? "Main Administrator" : "Administrator");
  const adminPhone = sessionStorage.getItem("adminPhone") || "Not set";

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [healthCheckups, setHealthCheckups] = useState([]);
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [clinicalRecords, setClinicalRecords] = useState(null);
  const [trackingFilter, setTrackingFilter] = useState("ALL");
  const [patientSearch, setPatientSearch] = useState("");
  const [billingSearch, setBillingSearch] = useState("");
  const [selectedBillingPatientId, setSelectedBillingPatientId] = useState("");
  const [trackingSearch, setTrackingSearch] = useState("");

  const [form, setForm] = useState({fullName: "", phoneNumber: "", email: "", password: "", role: "NURSE",});


  const [doctorForm, setDoctorForm] = useState({
    fullName: "", phoneNumber: "", email: "", password: "", qualification: "", specialization: "",
    experienceYears: "", consultationFee: "", city: "", hospitalName: "", availableTimings: "",
    languagesKnown: "", about: "", profilePhoto: null, licenseDocument: ""
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editForm, setEditForm] = useState({});



  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const [s, p, d, a, h, invoices] = await Promise.all([
        getAllAdmins(),
        getAllPatients(),
        getAllDoctors(),
        getAllAppointments(),
        getAllHealthCheckups(),
        getAdminBillingInvoices(),
      ]);

      setStaff(Array.isArray(s) ? s.filter((item) => item.role !== "DOCTOR") : []);
      setPatients(Array.isArray(p) ? p : []);
      setDoctors(Array.isArray(d) ? d : []);
      setAppointments(Array.isArray(a) ? a : []);
      setHealthCheckups(Array.isArray(h) ? h : []);
      setBillingInvoices(Array.isArray(invoices) ? invoices : []);
    } catch (e) {
      console.error("Unable to load admin data:", e);

      if (
        e.response?.status === 401 ||
        e.response?.status === 403
      ) {
        logout();
        return;
      }

      setErr(
        e.response?.data?.message ||
          "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  const renewInvoice = async (invoice) => {
    try {
      setActionLoading(`renew-invoice-${invoice.id}`);
      setErr("");
      setMsg("");
      const renewedInvoice = await renewAdminBillingInvoice(invoice.id);
      setMsg(`New invoice ${renewedInvoice.invoiceNumber || `#${renewedInvoice.id}`} generated with a 24-hour payment window.`);
      const updatedInvoices = await getAdminBillingInvoices();
      setBillingInvoices(Array.isArray(updatedInvoices) ? updatedInvoices : []);
    } catch (e) {
      setErr(e.response?.data?.message || "Unable to renew invoice.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    load();
  }, []);


  const loadTracking = async (filter = "ALL") => {
    try {
      setErr("");
      const data = await getActivityLogs(filter);
      setActivityLogs(Array.isArray(data) ? data : []);
      setTrackingFilter(filter);
    } catch (e) {
      console.error("Unable to load activity tracking:", e);
      if (e.response?.status === 401 || e.response?.status === 403) {
        logout();
        return;
      }
      setErr(e.response?.data?.message || "Unable to load activity tracking.");
    }
  };

  const changePage = async (page) => {
    setCurrentPage(page);
    setMsg("");
    setErr("");
    setClinicalRecords(null);

    if (page === "tracking") {
      await loadTracking("ALL");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewPatientClinical = async (patientId) => {
    try {
      setErr("");
      const data = await getPatientClinicalRecords(patientId);
      setClinicalRecords(data);
    } catch (e) {
      setErr(e.response?.data?.message || "Unable to load patient clinical records.");
    }
  };

  const openClinicalFile = async (type, id) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const url = type === "lab" ? `/clinical-records/admin/lab-reports/${id}/file` : `/clinical-records/admin/old-records/${id}/file`;
      const response = await fetch(`http://localhost:8080/api${url}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Unable to open file");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    } catch (e) { setErr(e.message || "Unable to open file."); }
  };



  const create = async (e) => {
    e.preventDefault();

    try {
      setMsg("");
      setErr("");

      await createAdmin(form);

      setMsg("Account created successfully. Login credentials have been sent to the employee's email.");

      setForm({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "NURSE",
      });

      await load();
    } catch (e) {
      console.error("Unable to create account:", e);

      setErr(
        e.response?.data?.message ||
          "Unable to create account."
      );
    }
  };



  const createDoctorAccount = async (e) => {
    e.preventDefault();
    try {
      setErr(""); setMsg("");
      const phone = doctorForm.phoneNumber.trim();
      if (!/^[6-9]\d{9}$/.test(phone)) throw new Error("Enter a valid 10-digit doctor mobile number.");
      if (doctorForm.password.length < 6) throw new Error("Doctor password must contain at least 6 characters.");
      if (!doctorForm.licenseDocument.trim()) throw new Error("License document number is required.");
      const data = new FormData();
      Object.entries(doctorForm).forEach(([key, value]) => {
        if (key === "profilePhoto") { if (value) data.append(key, value); }
        else data.append(key, value ?? "");
      });
      await createDoctor(data);
      setMsg("Doctor added successfully. Login credentials have been sent to the doctor's email.");
      setDoctorForm({fullName:"",phoneNumber:"",email:"",password:"",qualification:"",specialization:"",experienceYears:"",consultationFee:"",city:"",hospitalName:"",availableTimings:"",languagesKnown:"",about:"",profilePhoto:null,licenseDocument:""});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Unable to add doctor.");
    }
  };

  // APPROVE DOCTOR

  const handleApproveDoctor = async (doctorId) => {
    if (!doctorId) {
      return;
    }

    try {
      setActionLoading(`approve-${doctorId}`);
      setErr("");
      setMsg("");

      await approveDoctor(doctorId);

      setMsg("Doctor approved successfully.");

      await load();
    } catch (e) {
      console.error("Approval failed:", e);

      setErr(
        e.response?.data?.message ||
          "Approval failed."
      );
    } finally {
      setActionLoading(null);
    }
  };


  // REJECT DOCTOR
  const handleRejectDoctor = async (doctorId) => {
    if (!doctorId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this doctor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`reject-${doctorId}`);
      setErr("");
      setMsg("");

      await rejectDoctor(doctorId);

      setMsg("Doctor rejected successfully.");

      await load();
    } catch (e) {
      console.error("Rejection failed:", e);

      setErr(
        e.response?.data?.message ||
          "Rejection failed."
      );
    } finally {
      setActionLoading(null);
    }
  };


  const startStaffEdit = (item) => { setEditingStaff(item); setEditingDoctor(null); setEditForm({fullName:item.fullName||"",phoneNumber:item.phoneNumber||"",email:item.email||"",role:item.role||"",password:""}); setMsg(""); setErr(""); };
  const startDoctorEdit = (item) => { setEditingDoctor(item); setEditingStaff(null); setEditForm({fullName:item.fullName||"",phoneNumber:item.phoneNumber||"",email:item.email||"",password:"",qualification:item.qualification||"",specialization:item.specialization||"",experienceYears:item.experienceYears??"",consultationFee:item.consultationFee??"",city:item.city||"",hospitalName:item.hospitalName||"",availableTimings:item.availableTimings||"",languagesKnown:item.languagesKnown||"",about:item.about||"",licenseDocument:item.licenseDocument||"",status:item.status||"APPROVED"}); setMsg(""); setErr(""); };
  const saveAdminEdit = async (event) => { event.preventDefault(); setActionLoading("save-edit"); setErr(""); setMsg(""); try { if(editingStaff) await updateStaffByAdmin(editingStaff.id,{...editForm}); else if(editingDoctor) await updateDoctorByAdmin(editingDoctor.id,{...editForm,experienceYears:editForm.experienceYears===""?null:Number(editForm.experienceYears),consultationFee:editForm.consultationFee===""?null:Number(editForm.consultationFee)}); setMsg("Details updated successfully."); setEditingStaff(null); setEditingDoctor(null); await load(); } catch(e){ setErr(e.response?.data?.message||"Unable to update details."); } finally { setActionLoading(null); } };
  const removeStaff = async (item) => { if(!window.confirm(`Remove ${item.fullName || item.email}?`)) return; try { setActionLoading(`delete-staff-${item.id}`); await deleteStaffByAdmin(item.id); setMsg("Staff member removed successfully."); await load(); } catch(e){ setErr(e.response?.data?.message||"Unable to remove staff member."); } finally { setActionLoading(null); } };
  const removeDoctor = async (item) => { if(!window.confirm(`Remove Dr. ${item.fullName || item.email}? This removes the doctor's appointments, prescriptions and lab test assignments.`)) return; try { setActionLoading(`delete-doctor-${item.id}`); await deleteDoctorByAdmin(item.id); setMsg("Doctor removed successfully."); await load(); } catch(e){ setErr(e.response?.data?.message||"Unable to remove doctor."); } finally { setActionLoading(null); } };

  const logout = () => {
    [
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



  const totalStaff = staff.length;
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const pendingDoctors = doctors.filter(
    (doctor) =>
      String(doctor.status || "").toUpperCase() ===
      "PENDING"
  ).length;

  const approvedDoctors = doctors.filter(
    (doctor) =>
      String(doctor.status || "").toUpperCase() ===
      "APPROVED"
  ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "CONFIRMED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() === "PENDING"
    ).length;

  const filteredPatients = patients.filter((patient) =>
    [patient.id, patient.patientName, patient.patientGender, patient.patientAge, patient.phoneNumber, patient.email]
      .some((value) => String(value ?? "").toLowerCase().includes(patientSearch.trim().toLowerCase()))
  );
  const billingPatients = [...new Map(billingInvoices.map((invoice) => [String(invoice.patientId ?? invoice.patientName), {
    id: invoice.patientId ?? invoice.patientName,
    name: invoice.patientName || "Patient",
  }])).values()];
  const selectedPatientInvoices = selectedBillingPatientId
    ? billingInvoices.filter((invoice) => String(invoice.patientId ?? invoice.patientName) === selectedBillingPatientId)
    : [];
  const filteredBillingInvoices = billingInvoices.filter((invoice) => {
    const matchesPatient = !selectedBillingPatientId || String(invoice.patientId ?? invoice.patientName) === selectedBillingPatientId;
    const matchesSearch = [invoice.id, invoice.invoiceNumber, invoice.patientName, invoice.patientId, invoice.invoiceType, invoice.itemName, invoice.amountPaise, invoice.paymentMethod, invoice.paymentExpired && String(invoice.status || "").toUpperCase() !== "PAID" ? "EXPIRED" : invoice.status, invoice.createdAt, invoice.paidAt]
      .some((value) => String(value ?? "").toLowerCase().includes(billingSearch.trim().toLowerCase()));
    return matchesPatient && matchesSearch;
  });



  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = new Date(
        `${a.appointmentDate || ""}T${
          a.appointmentTime || "00:00"
        }`
      );

      const dateB = new Date(
        `${b.appointmentDate || ""}T${
          b.appointmentTime || "00:00"
        }`
      );

      return dateB - dateA;
    })
    .slice(0, 5);



  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };



  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>

          <h3>Loading Admin Dashboard...</h3>

          <p>
            Please wait while we load hospital
            information.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div style={styles.page}>



      <aside style={styles.sidebar}>

        <div style={styles.brand}>
          <div style={styles.brandIcon}>+</div>
          <div onClick={() => window.location.reload()}
                 style={{ cursor: "pointer" }}>
            <h2 style={styles.brandTitle}> MediCo</h2>
            <p style={styles.brandSubtitle}> ADMIN PORTAL </p>
          </div>
        </div>

        <div style={styles.adminBox}>
          <div style={{ ...styles.adminAvatar, display: "none" }}>
            {role === "MAIN_ADMIN" ? "M" : "A"}
          </div>
          <LocalProfilePhoto role={role || "ADMIN"} userKey={adminEmail || adminId} name={adminName} size={48} />
          <div style={styles.adminInfo}>
            <strong>  {role === "MAIN_ADMIN"  ? "Main Administrator"  : "Administrator"}</strong>
            <span style={styles.adminAccount}>  {adminEmail || `ID: ${adminId || "-"}`}</span>
          </div>
        </div>


        <div className="dashboard-sidebar-nav-scroll" style={styles.sidebarNavScroll}>
          <nav style={styles.nav}>

            <button  type="button"  style={{  ...styles.navItem,  ...(currentPage === "dashboard"   ? styles.activeNavItem : {}), }} onClick={() =>  changePage("dashboard") } >
              <span style={styles.navIcon}>  📊</span>
              <span>Dashboard</span>
            </button>

            <button type="button"  style={{   ...styles.navItem,  ...(currentPage === "staff"   ? styles.activeNavItem  : {}),  }} onClick={() => changePage("staff")}>
              <span style={styles.navIcon}>  👥 </span>
              <span>Staff Accounts</span>
            </button>

            <button  type="button"  style={{   ...styles.navItem, ...(currentPage === "doctors"  ? styles.activeNavItem : {}),  }}  onClick={() =>  changePage("doctors")  } >
              <span style={styles.navIcon}>  👨‍⚕️ </span>
              <span>Doctors</span> {pendingDoctors > 0 && (<span style={styles.navBadge}>  {pendingDoctors}</span>)}
            </button>

            <button type="button" style={{ ...styles.navItem, ...(currentPage === "patients"  ? styles.activeNavItem : {}), }}  onClick={() =>  changePage("patients") }>
              <span style={styles.navIcon}> 🧑‍🤝‍🧑</span>
              <span>Patients</span>
            </button>

            <button type="button" style={{...styles.navItem,  ...(currentPage === "appointments"   ? styles.activeNavItem   : {}),  }}  onClick={() =>  changePage("appointments")  }>
              <span style={styles.navIcon}> 📅</span>
              <span>Appointments</span>  {pendingAppointments > 0 && ( <span style={styles.navBadge}>  {pendingAppointments}  </span> )}
            </button>
            <button type="button" style={{...styles.navItem, ...(currentPage === "health-checkups" ? styles.activeNavItem : {})}} onClick={() => changePage("health-checkups")}>
              <span style={styles.navIcon}>🩺</span><span>Health Checkups</span>
            </button>

            <button type="button" style={{...styles.navItem, ...(currentPage === "billing" ? styles.activeNavItem : {})}} onClick={() => changePage("billing")}><span style={styles.navIcon}>💳</span><span>Billing</span></button>

            <button type="button" style={{...styles.navItem, ...(currentPage === "tracking" ? styles.activeNavItem : {})}} onClick={() => changePage("tracking")}>
              <span style={styles.navIcon}>🕵️</span>
              <span>Activity Tracking</span>
            </button>

          </nav>
        </div>


        <div style={styles.sidebarBottom}>
          <button  type="button"  onClick={logout} style={styles.sidebarLogout} >
            <span>🚪</span> <span>Logout</span>
          </button>
        </div>

      </aside>


      <main style={styles.main}>

        <div style={styles.topHeader}>

          <div>
            <h1 style={styles.title}>
              {currentPage === "dashboard" &&
                "Administrator Dashboard"}

              {currentPage === "staff" &&
                "Staff Accounts"}

              {currentPage === "doctors" &&
                "Doctors"}

              {currentPage === "patients" &&
                "Patients"}

              {currentPage === "appointments" &&
                "Appointments"}

              {currentPage === "billing" && "Billing"}
              {currentPage === "tracking" &&
                "Activity Tracking"}
              {currentPage === "health-checkups" &&
                "Health Checkups"}
            </h1>

            <p style={styles.subtitle}>
              {currentPage === "dashboard" &&
                "Manage doctors, staff, patients and appointments from one place."}

              {currentPage === "staff" &&
                "Manage administrator and hospital staff accounts."}

              {currentPage === "doctors" &&
                "Manage doctors added by the Main Admin. Existing pending registrations can still be reviewed."}

              {currentPage === "patients" &&
                "View all registered patients in the system."}

              {currentPage === "appointments" &&
                "View recent patient appointment activity."}

              {currentPage === "billing" && "Review patient invoices, amounts, payment methods and current payment status."}
              {currentPage === "tracking" &&
                "Track who changed doctor, appointment, laboratory, pharmacy and billing records."}
              {currentPage === "health-checkups" &&
                "View every patient health checkup booking, visit type, location and laboratory result status."}
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            style={styles.refreshButton}
          >
            🔄 Refresh
          </button>

        </div>

        {/* MESSAGES */}

        {msg && (
          <div style={styles.success}>
            ✓ {msg}
          </div>
        )}

        {err && (
          <div style={styles.error}>
            {err}
          </div>
        )}

        {/* =====================================
            DASHBOARD PAGE
        ====================================== */}

        {currentPage === "dashboard" && (
          <>
            {/* WELCOME */}

            <div style={styles.welcomeCard}>

              <div style={styles.welcomeLeft}>

                <div style={styles.largeAvatar}>
                  🛡️
                </div>

                <div>
                  <span style={styles.welcomeSmall}>
                    Welcome !!
                  </span>

                  <h2 style={styles.welcomeName}>
                    {role === "MAIN_ADMIN"
                      ? "Main Administrator"
                      : "Administrator"}
                  </h2>

                  <p style={styles.welcomeSubtitle}>
                     MediCo Hospital Management
                  </p>
                </div>

              </div>

              <div style={styles.statusArea}>

                <span style={styles.statusLabel}>
                  Account Role
                </span>

                <span style={styles.adminStatusBadge}>
                  {role || "ADMIN"}
                </span>

              </div>

            </div>

            {/* STATISTICS */}

            <div style={styles.statsGrid}>

              <StatCard
                icon="👥"
                label="Staff Accounts"
                number={totalStaff}
                iconStyle={styles.statIcon}
              />

              <StatCard
                icon="👨‍⚕️"
                label="Total Doctors"
                number={totalDoctors}
                iconStyle={styles.statIconBlue}
              />

              <StatCard
                icon="🧑‍🤝‍🧑"
                label="Total Patients"
                number={totalPatients}
                iconStyle={styles.statIconGreen}
              />

              <StatCard
                icon="📅"
                label="Appointments"
                number={totalAppointments}
                iconStyle={styles.statIconPurple}
              />

            </div>

            {/* QUICK OVERVIEW */}

            <div style={styles.overviewGrid}>





              <div style={styles.overviewCard}>
                <div style={styles.overviewIconConfirmed}>
                  ✓
                </div>

                <div>
                  <span style={styles.overviewLabel}>
                    Confirmed Appointments
                  </span>

                  <strong style={styles.overviewNumber}>
                    {confirmedAppointments}
                  </strong>
                </div>
              </div>

              <div style={styles.overviewCard}>
                <div style={styles.overviewIconAppointment}>
                  ⏰
                </div>

                <div>
                  <span style={styles.overviewLabel}>
                    Pending Appointments
                  </span>

                  <strong style={styles.overviewNumber}>
                    {pendingAppointments}
                  </strong>
                </div>
              </div>

            </div>

            {/* DASHBOARD RECENT APPOINTMENTS */}

            <section style={styles.section}>

              <div style={styles.sectionHeader}>

                <div>
                  <h2 style={styles.sectionTitle}>
                    📅 Recent Appointments
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Latest patient appointment activity.
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.viewButton}
                  onClick={() =>
                    changePage("appointments")
                  }
                >
                  View All
                </button>

              </div>

              {recentAppointments.length === 0 ? (
                <EmptyCard
                  icon="📅"
                  title="No appointments"
                  text="Patient appointments will appear here."
                />
              ) : (
                <div style={styles.appointmentList}>
                  {recentAppointments.map(
                    (appointment) => {

                      const appointmentStatus =
                        String(
                          appointment.status ||
                            "PENDING"
                        ).toUpperCase();

                      return (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          status={appointmentStatus}
                          formatDate={formatDate}
                        />
                      );
                    }
                  )}
                </div>
              )}

            </section>
          </>
        )}

        {/* =====================================
            STAFF PAGE
        ====================================== */}

        {currentPage === "staff" && (
          <section style={styles.section}>

            {role === "MAIN_ADMIN" && (
              <div style={styles.createSection}>

                <div style={styles.sectionHeader}>

                  <div>
                    <h2 style={styles.sectionTitle}>
                      👤 Create Staff Account
                    </h2>

                    <p style={styles.sectionSubtitle}>
                      Add ADMIN, NURSE, RECEPTION, LAB
                      or PHARMACY accounts.
                    </p>
                  </div>

                </div>

                <div style={styles.createCard}>

                  <form
                    style={styles.createForm}
                    onSubmit={create}
                  >

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>
                        Staff Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter staff full name"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="Enter staff email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>
                        Password
                      </label>

                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={form.password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                        minLength={6}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>
                        Role
                      </label>

                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            role: e.target.value,
                          })
                        }
                        style={styles.input}
                      >
                        {[
                          "ADMIN",
                          "NURSE",
                          "RECEPTION",
                          "LAB",
                          "PHARMACY",
                        ].map((r) => (
                          <option
                            key={r}
                            value={r}
                          >
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      style={styles.createButton}
                    >
                      + Create Account
                    </button>

                  </form>

                </div>

              </div>
            )}

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  👥 Staff & Admin Accounts
                </h2>

                <p style={styles.sectionSubtitle}>
                  All administrator and hospital staff
                  accounts.
                </p>
              </div>

              <span style={styles.countBadge}>
                {staff.length} Accounts
              </span>

            </div>

            {staff.length === 0 ? (
              <EmptyCard
                icon="👥"
                title="No staff accounts"
                text="Staff accounts will appear here."
              />
            ) : (
              <div style={styles.tableCard}><div style={styles.tableWrap}><table style={styles.table}><thead><tr>{["ID","Name","Phone","Email","Role","Main Admin","Actions"].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead><tbody>{staff.map(x=><tr key={x.id}><td style={styles.td}>{x.id}</td><td style={styles.td}>{x.fullName||"-"}</td><td style={styles.td}>{x.phoneNumber||"-"}</td><td style={styles.td}>{x.email}</td><td style={styles.td}>{x.role}</td><td style={styles.td}>{x.mainAdmin?"YES":"NO"}</td><td style={styles.td}>{!x.mainAdmin && <><button type="button" style={styles.viewButton} onClick={()=>startStaffEdit(x)}>✏️ Edit</button>{x.role!=="MAIN_ADMIN" && <button type="button" style={styles.deleteButton} disabled={actionLoading===`delete-staff-${x.id}`} onClick={()=>removeStaff(x)}>🗑 Delete</button>}</>}</td></tr>)}</tbody></table></div></div>
            )}

          </section>
        )}

        {/* ===
            DOCTORS PAGE
        === */}

        {currentPage === "doctors" && (
          <section style={styles.section}>

            {role === "MAIN_ADMIN" && (
              <div style={{...styles.createSection, marginBottom: 24}}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>➕ Add Doctor</h2>
                    <p style={styles.sectionSubtitle}>Add doctors directly from the Main Admin panel. No doctor registration page is required.</p>
                  </div>
                  <span style={styles.countBadge}>Auto Approved</span>
                </div>
                <form onSubmit={createDoctorAccount} style={{...styles.createCard, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14}}>
                  {[
                    ["fullName","Full Name","text",true],["phoneNumber","Mobile Number","tel",true],["email","Email","email",true],["password","Password","password",true],
                    ["qualification","Qualification","text",true],["specialization","Specialization","text",true],["experienceYears","Experience (Years)","number",true],["consultationFee","Consultation Fee","number",false],
                    ["city","City","text",false],["hospitalName","Hospital Name","text",false],["availableTimings","Available Timings","text",false],["languagesKnown","Languages Known","text",false],["licenseDocument","License Document / Number","text",true]
                  ].map(([name,label,type,required]) => (
                    <div style={styles.inputGroup} key={name}>
                      <label style={styles.inputLabel}>{label}</label>
                      <input type={type} required={required} min={type === "number" ? "0" : undefined} value={doctorForm[name]} onChange={(e)=>setDoctorForm({...doctorForm,[name]:e.target.value})} style={styles.input} placeholder={label} />
                    </div>
                  ))}
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e)=>setDoctorForm({...doctorForm,profilePhoto:e.target.files?.[0] || null})} style={styles.input} />
                  </div>
                  <div style={{...styles.inputGroup, gridColumn:"1 / -1"}}>
                    <label style={styles.inputLabel}>About Doctor</label>
                    <textarea value={doctorForm.about} onChange={(e)=>setDoctorForm({...doctorForm,about:e.target.value})} style={{...styles.input,minHeight:90,resize:"vertical"}} placeholder="Doctor profile / about" />
                  </div>
                  <button type="submit" style={{...styles.createButton, gridColumn:"1 / -1"}}>+ Add Doctor</button>
                </form>
              </div>
            )}

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  👨‍⚕️ Doctors
                </h2>

                <p style={styles.sectionSubtitle}>
                  Manage doctors added by the Main Admin. Existing pending registrations can still be reviewed.
                </p>
              </div>

              <span style={styles.countBadge}>
                {doctors.length} Doctors
              </span>

            </div>

            {pendingDoctors > 0 && (
              <div style={styles.pendingNotice}>

                <span style={styles.noticeIcon}>
                  🔔
                </span>

                <div>
                  <strong>
                    {pendingDoctors} doctor
                    {pendingDoctors > 1
                      ? "s"
                      : ""}{" "}
                    waiting for approval
                  </strong>

                  <p>
                    Review the pending doctor
                    registrations below.
                  </p>
                </div>

              </div>
            )}

            <div style={styles.tableCard}>

              <div style={styles.tableWrap}>

                <table style={styles.table}>

                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Doctor",
                        "Email",
                        "Specialization",
                        "Status",
                        "Today",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          style={styles.th}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    {doctors.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          style={styles.noData}
                        >
                          No doctors found.
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doctor) => {

                        const doctorStatus =
                          String(
                            doctor.status || ""
                          ).toUpperCase();

                        const approveLoading =
                          actionLoading ===
                          `approve-${doctor.id}`;

                        const rejectLoading =
                          actionLoading ===
                          `reject-${doctor.id}`;

                        return (
                          <tr key={doctor.id}>

                            <td style={styles.td}>
                              {doctor.id}
                            </td>

                            <td style={styles.td}>
                              <div style={styles.personCell}>

                                <div
                                  style={
                                    styles.personAvatar
                                  }
                                >
                                  👨‍⚕️
                                </div>

                                <div>
                                  <strong>
                                    {doctor.fullName ||
                                      "Doctor"}
                                  </strong>
                                </div>

                              </div>
                            </td>

                            <td style={styles.td}>
                              {doctor.email || "-"}
                            </td>

                            <td style={styles.td}>
                              {doctor.specialization ||
                                "-"}
                            </td>

                            <td style={styles.td}>
                              <StatusBadge status={doctorStatus} />
                            </td>
                            <td style={styles.td}>
                              <span style={{...styles.statusBadge,...(doctor.activeToday?styles.approvedStatus:styles.inactiveStatus)}}>{doctor.activeToday?"ACTIVE":"INACTIVE"}</span>
                            </td>

                            <td style={styles.td}>

                              {doctorStatus ===
                              "PENDING" ? (
                                <div
                                  style={
                                    styles.actionButtons
                                  }
                                >

                                  <button
                                    type="button"
                                    disabled={
                                      actionLoading !==
                                      null
                                    }
                                    onClick={() =>
                                      handleApproveDoctor(
                                        doctor.id
                                      )
                                    }
                                    style={{
                                      ...styles.approveButton,
                                      ...(approveLoading
                                        ? styles.disabledButton
                                        : {}),
                                    }}
                                  >
                                    {approveLoading
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
                                      handleRejectDoctor(
                                        doctor.id
                                      )
                                    }
                                    style={{
                                      ...styles.rejectButton,
                                      ...(rejectLoading
                                        ? styles.disabledButton
                                        : {}),
                                    }}
                                  >
                                    {rejectLoading
                                      ? "..."
                                      : "✕ Reject"}
                                  </button>

                                </div>
                              ) : (
                                <span style={styles.noAction}></span>
                              )}
                              <div style={{marginTop:8}}><button type="button" style={styles.viewButton} onClick={()=>startDoctorEdit(doctor)}>✏️ Edit</button><button type="button" style={styles.deleteButton} disabled={actionLoading===`delete-doctor-${doctor.id}`} onClick={()=>removeDoctor(doctor)}>🗑 Delete</button></div>
                            </td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* ===
            PATIENTS PAGE
        === */}

        {currentPage === "patients" && (
          <section style={styles.section}>

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  🧑‍🤝‍🧑 Patients
                </h2>

                <p style={styles.sectionSubtitle}>
                  Registered patients in the system.
                </p>
              </div>

              <span style={styles.countBadge}>
                {patients.length} Patients
              </span>

            </div>

            <input
              type="search"
              aria-label="Search patients"
              placeholder="Search patients by name, ID, phone, email, age, or gender..."
              value={patientSearch}
              onChange={(event) => setPatientSearch(event.target.value)}
              style={styles.searchInput}
            />

            {filteredPatients.length === 0 ? (
              <EmptyCard
                icon="🧑‍🤝‍🧑"
                title={patients.length ? "No matching patients" : "No patients"}
                text={patients.length ? "Try another name, ID, phone number, or email." : "Registered patients will appear here."}
              />
            ) : (
              <>
              <p style={{ margin: "0 0 12px", color: "var(--db-muted)" }}>
                Click a patient row to view the complete clinical record.
              </p>
              <Table
                headers={[
                  "Patient ID",
                  "Name",
                  "Gender",
                  "Age",
                  "Phone",
                  "Email",
                ]}
                rows={filteredPatients.map((x) => [
                  x.id ?? x.patientId ?? "-",
                  x.patientName,
                  x.patientGender,
                  x.patientAge,
                  x.phoneNumber,
                  x.email,
                ])}
                onRowClick={(row) => viewPatientClinical(row[0])}
              />
              </>
            )}

          </section>
        )}

        {clinicalRecords && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>📋 Clinical Records — {clinicalRecords.patient?.patientName || "Patient"}</h2>
                <p style={styles.sectionSubtitle}>Profile, old medical history, lab tests, lab reports, prescriptions and vitals.</p>
              </div>
              <button type="button" style={styles.refreshButton} onClick={() => setClinicalRecords(null)}>Close</button>
            </div>
            <ClinicalRecordTable title="🧪 Lab Tests" rows={clinicalRecords.labTests} fields={["testName","status","suggestedAt"]} />
            <ClinicalRecordTable title="📄 Lab Reports" rows={clinicalRecords.labReports} fields={["reportName","uploadedAt"]} onViewFile={(row) => openClinicalFile("lab", row.id)} />
            <ClinicalRecordTable title="📁 Old Medical History" rows={clinicalRecords.oldMedicalRecords} fields={["fileName","createdAt"]} onViewFile={(row) => openClinicalFile("old", row.id)} />
            <ClinicalRecordTable title="💊 Prescriptions" rows={clinicalRecords.prescriptions} fields={["medicine","dosage","duration","dispensed"]} />
            <ClinicalRecordTable title="❤️ Vitals" rows={clinicalRecords.vitals} fields={["bpSystolic","bpDiastolic","weightKg","recordedAt"]} />
          </section>
        )}

        {currentPage === "health-checkups" && (
          <section style={styles.card}>
            <div style={styles.sectionHeader}><div><h2 style={styles.sectionTitle}>🩺 Health Checkup Bookings</h2><p style={styles.sectionSubtitle}>All hospital and home health-checkup bookings submitted by patients.</p></div></div>
            <div style={styles.tableWrap}><table style={styles.table}><thead><tr>
              <th style={styles.th}>Patient</th><th style={styles.th}>Package</th><th style={styles.th}>Visit</th><th style={styles.th}>Date / Time</th><th style={styles.th}>Status</th><th style={styles.th}>Payment</th><th style={styles.th}>Result</th>
            </tr></thead><tbody>{healthCheckups.length ? healthCheckups.map(h=><tr key={h.id}>
              <td style={styles.td}>{h.patientName}<br/>ID: {h.patientId}</td><td style={styles.td}>{h.packageName}<br/>₹{h.packagePrice}</td>
              <td style={styles.td}>{h.visitType}{h.homeAddress&&<><br/>{h.homeAddress}</>}</td><td style={styles.td}>{h.visitDate}<br/>{h.visitTime}</td><td style={styles.td}>{h.status}</td><td style={styles.td}><AdminPaymentStatus status={h.paymentStatus}/></td>
              <td style={styles.td}>{h.reportFileName ? <button type="button" style={styles.viewButton} onClick={async()=>{try{const r=await fetch(`http://localhost:8080/api/health-checkups/${h.id}/file`,{headers:{Authorization:`Bearer ${sessionStorage.getItem("adminToken")}`}});const b=await r.blob();const u=URL.createObjectURL(b);window.open(u,"_blank","noopener,noreferrer");setTimeout(()=>URL.revokeObjectURL(u),30000)}catch(e){setErr("Unable to open result.")}}}>👁 View Result</button> : "Not uploaded"}</td>
            </tr>):<tr><td colSpan={7} style={styles.emptyTable}>No health checkup bookings.</td></tr>}</tbody></table></div>
          </section>
        )}

        {currentPage === "billing" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>💳 Patient Billing</h2>
                <p style={styles.sectionSubtitle}>Invoices for appointments, laboratory tests, medicines and health checkups.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={styles.countBadge}>{filteredBillingInvoices.length} Invoices</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "nowrap", marginBottom: 14, width: "100%" }}>
              <input type="search" aria-label="Search billing invoices" placeholder="Search invoices or patients..." value={billingSearch} onChange={(event) => setBillingSearch(event.target.value)} style={{ ...styles.searchInput, flex: "1 1 auto", minWidth: 180, marginBottom: 0 }} />
              <select aria-label="Filter invoices by patient" value={selectedBillingPatientId} onChange={(event) => setSelectedBillingPatientId(event.target.value)} style={{ ...styles.input, width: 190, flex: "0 0 190px" }}>
                <option value="">All patients</option>
                {billingPatients.map((patient) => <option key={patient.id} value={String(patient.id)}>{patient.name}{typeof patient.id === "number" ? ` (ID ${patient.id})` : ""}</option>)}
              </select>
              <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceDownloadButton }} disabled={!selectedPatientInvoices.length} onClick={() => downloadPatientInvoicesPdf(selectedPatientInvoices, selectedBillingPatientId)}>⬇ Patient PDF</button>
              <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceDownloadButton }} disabled={!billingInvoices.length} onClick={() => downloadAllInvoicesPdf(billingInvoices)}>⬇ Download all invoices (PDF)</button>
              <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceDownloadButton }} disabled={!billingInvoices.length} onClick={() => downloadAllInvoicesCsv(billingInvoices)}>⬇ Download all invoices (CSV)</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Invoice</th><th style={styles.th}>Patient</th><th style={styles.th}>Item</th><th style={styles.th}>Amount</th><th style={styles.th}>Payment Method</th><th style={styles.th}>Status</th><th style={styles.th}>Created / Paid</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {filteredBillingInvoices.length ? filteredBillingInvoices.map((invoice) => {
                    const paid = String(invoice.status || "").toUpperCase() === "PAID";
                    const expired = !!invoice.paymentExpired && !paid;
                    const displayedStatus = expired ? "EXPIRED" : invoice.status;
                    return (
                      <tr key={invoice.id}>
                        <td style={styles.td}>{invoice.invoiceNumber || `#${invoice.id}`}</td>
                        <td style={styles.td}>{invoice.patientName || "Patient"}<br />ID: {invoice.patientId || "-"}</td>
                        <td style={styles.td}>{String(invoice.invoiceType || "APPOINTMENT").replaceAll("_", " ")}<br />{invoice.itemName || "Consultation"}</td>
                        <td style={styles.td}>₹{((invoice.amountPaise || 0) / 100).toFixed(2)}</td>
                        <td style={styles.td}>{invoice.paymentMethod || "Not selected"}</td>
                        <td style={styles.td}><AdminPaymentStatus status={displayedStatus} /></td>
                        <td style={styles.td}>{invoice.createdAt || "-"}<br />Paid: {invoice.paidAt || "-"}</td>
                        <td style={{ ...styles.td, minWidth: 205 }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceViewButton }} onClick={() => viewInvoicePdf(invoice)}>View</button>
                            <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceDownloadButton }} onClick={() => downloadInvoicePdf(invoice)}>⬇ Download</button>
                            {expired && <button type="button" style={{ ...styles.invoiceActionButton, ...styles.invoiceRenewButton }} disabled={actionLoading === `renew-invoice-${invoice.id}`} onClick={() => renewInvoice(invoice)}>{actionLoading === `renew-invoice-${invoice.id}` ? "Renewing…" : "Renew 24 hrs"}</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  }) : <tr><td colSpan={8} style={styles.emptyTable}>No billing invoices found.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {currentPage === "tracking" && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🕵️ Hospital Activity Tracking</h2>
                <p style={styles.sectionSubtitle}>Track exactly who performed laboratory, nurse, pharmacy, doctor and appointment actions for each patient.</p>
              </div>
              <span style={styles.countBadge}>{activityLogs.length} Total Events</span>
            </div>

            <div style={styles.trackingFilterBar}>
              {[
                ["ALL", "📋 All Activity"],
                ["LAB", "🧪 Laboratory"],
                ["NURSE", "🩺 Nurse"],
                ["PHARMACY", "💊 Pharmacy"],
                ["DOCTOR", "👨‍⚕️ Doctor"],
                ["APPOINTMENT", "📅 Appointments"],
                ["BILLING", "💳 Billing"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => loadTracking(value)}
                  style={{
                    ...styles.trackingFilterButton,
                    ...(trackingFilter === value ? styles.trackingFilterButtonActive : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              type="search"
              aria-label="Search activity tracking"
              placeholder="Search by patient ID, staff, role, module, action, or details..."
              value={trackingSearch}
              onChange={(event) => setTrackingSearch(event.target.value)}
              style={styles.searchInput}
            />

            {(() => {
              const query = trackingSearch.trim().toLowerCase();
              const filteredLogs = activityLogs.filter((log) =>
                [log.patientId, log.actorName, log.actorRole, log.module, log.action, log.details, log.createdAt]
                  .some((value) => String(value ?? "").toLowerCase().includes(query))
              );

              if (filteredLogs.length === 0) {
                return (
                  <EmptyCard
                    icon={trackingFilter === "LAB" ? "🧪" : trackingFilter === "NURSE" ? "🩺" : trackingFilter === "PHARMACY" ? "💊" : "🕵️"}
                    title={`No ${trackingFilter === "ALL" ? "tracked" : trackingFilter.toLowerCase()} activity yet`}
                    text="When a staff member performs an action, the actor, patient, role, action and time will appear here."
                  />
                );
              }

              return (
                <div style={styles.tableCard}>
                  <div style={styles.trackingSummaryGrid}>
                    <div style={styles.trackingSummaryCard}>
                      <span style={styles.overviewLabel}>Visible Events</span>
                      <strong style={styles.overviewNumber}>{filteredLogs.length}</strong>
                    </div>
                    <div style={styles.trackingSummaryCard}>
                      <span style={styles.overviewLabel}>Patients Involved</span>
                      <strong style={styles.overviewNumber}>
                        {new Set(filteredLogs.filter((log) => log.patientId != null).map((log) => String(log.patientId))).size}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.tableWrap}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Time</th>
                          <th style={styles.th}>Patient ID</th>
                          <th style={styles.th}>Staff / User</th>
                          <th style={styles.th}>Role</th>
                          <th style={styles.th}>Module</th>
                          <th style={styles.th}>Action / Status</th>
                          <th style={styles.th}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr key={log.id}>
                            <td style={styles.td}>
                              {log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN") : "-"}
                            </td>
                            <td style={styles.td}>{log.patientId ?? "-"}</td>
                            <td style={styles.td}>{log.actorName || "-"}</td>
                            <td style={styles.td}>{log.actorRole || "-"}</td>
                            <td style={styles.td}>
                              <strong>{log.module || "-"}</strong>
                            </td>
                            <td style={styles.td}>{log.action || "-"}</td>
                            <td style={styles.td}>{log.details || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* =====================================
            APPOINTMENTS PAGE
        ====================================== */}

        {currentPage === "appointments" && (
          <section style={styles.section}>

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  📅 Appointments
                </h2>

                <p style={styles.sectionSubtitle}>
                  Latest patient appointment activity.
                </p>
              </div>

              <span style={styles.countBadge}>
                {appointments.length} Total
              </span>

            </div>

            {appointments.length === 0 ? (
              <EmptyCard
                icon="📅"
                title="No appointments"
                text="Patient appointments will appear here."
              />
            ) : (
              <div style={styles.appointmentList}>

                {recentAppointments.map(
                  (appointment) => {

                    const appointmentStatus =
                      String(
                        appointment.status ||
                          "PENDING"
                      ).toUpperCase();

                    return (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        status={appointmentStatus}
                        formatDate={formatDate}
                      />
                    );
                  }
                )}

              </div>
            )}

          </section>
        )}

      {(editingStaff || editingDoctor) && <div style={styles.modalOverlay}><form onSubmit={saveAdminEdit} style={styles.modalCard}><div style={styles.modalHeader}><h2 style={styles.sectionTitle}>{editingStaff?"Edit Staff Member":"Edit Doctor"}</h2><button type="button" style={styles.closeButton} onClick={()=>{setEditingStaff(null);setEditingDoctor(null);}}>✕</button></div><div style={styles.modalGrid}>{[["fullName","Full Name","text"],["phoneNumber","Phone Number","tel"],["email","Email","email"],["password","New Password (optional)","password"]].map(([n,l,t])=><div style={styles.inputGroup} key={n}><label style={styles.inputLabel}>{l}</label><input style={styles.input} type={t} value={editForm[n]||""} onChange={e=>setEditForm({...editForm,[n]:e.target.value})} required={n!=="password"}/></div>)}{editingStaff&&<div style={styles.inputGroup}><label style={styles.inputLabel}>Role</label><select style={styles.input} value={editForm.role||"NURSE"} onChange={e=>setEditForm({...editForm,role:e.target.value})}>{["ADMIN","NURSE","RECEPTION","LAB","PHARMACY"].map(r=><option key={r}>{r}</option>)}</select></div>}{editingDoctor&&[["qualification","Qualification"],["specialization","Specialization"],["experienceYears","Experience Years"],["consultationFee","Consultation Fee"],["city","City"],["hospitalName","Hospital Name"],["availableTimings","Available Timings"],["languagesKnown","Languages Known"],["licenseDocument","License Document"]].map(([n,l])=><div style={styles.inputGroup} key={n}><label style={styles.inputLabel}>{l}</label><input style={styles.input} value={editForm[n]??""} onChange={e=>setEditForm({...editForm,[n]:e.target.value})}/></div>)}</div>{editingDoctor&&<><div style={styles.inputGroup}><label style={styles.inputLabel}>About</label><textarea style={{...styles.input,minHeight:90}} value={editForm.about||""} onChange={e=>setEditForm({...editForm,about:e.target.value})}/></div><div style={styles.inputGroup}><label style={styles.inputLabel}>Status</label><select style={styles.input} value={editForm.status||"APPROVED"} onChange={e=>setEditForm({...editForm,status:e.target.value})}><option>PENDING</option><option>APPROVED</option><option>REJECTED</option></select></div></>}<div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}><button type="button" style={styles.closeButton} onClick={()=>{setEditingStaff(null);setEditingDoctor(null);}}>Cancel</button><button type="submit" style={styles.createButton} disabled={actionLoading==="save-edit"}>{actionLoading==="save-edit"?"Saving...":"Save Changes"}</button></div></form></div>}

      </main>
    </div>
  );
}

// ==========================================
// APPOINTMENT CARD
// ==========================================

function AppointmentCard({
  appointment,
  status,
  formatDate,
}) {
  return (
    <div style={styles.appointmentCard}>

      {/* PATIENT */}

      <div style={styles.appointmentPatient}>

        <div style={styles.patientAvatar}>
          👤
        </div>

        <div>

          <strong style={styles.patientName}>
            {appointment.patientName ||
              "Patient"}
          </strong>

          <span style={styles.patientId}>
            Patient ID:{" "}
            {appointment.patientId || "-"}
          </span>

        </div>

      </div>

      {/* DETAILS */}

      <div style={styles.appointmentDetails}>

        <div>
          <span style={styles.appointmentLabel}>
            Doctor
          </span>

          <strong>
            {appointment.doctor?.fullName ||
              appointment.doctorName ||
              "-"}
          </strong>
        </div>

        <div>
          <span style={styles.appointmentLabel}>
            Date
          </span>

          <strong>
            {formatDate(
              appointment.appointmentDate
            )}
          </strong>
        </div>

        <div>
          <span style={styles.appointmentLabel}>
            Time
          </span>

          <strong>
            {appointment.appointmentTime ||
              "-"}
          </strong>
        </div>

      </div>

      {/* STATUS */}

      <StatusBadge status={status} />

      {String(appointment.status || status).toUpperCase() === "REJECTED" && appointment.rejectionReason && (
        <div style={{ flexBasis: "100%", marginTop: 10, padding: 12, borderRadius: 8, background: "var(--db-amber-bg)", color: "var(--db-amber-text)", fontSize: 13 }}>
          <strong>Doctor's rejection message:</strong> {appointment.rejectionReason}
          {appointment.suggestedRescheduleDate && (
            <div style={{ marginTop: 5 }}><strong>Suggested reschedule:</strong> {formatDate(appointment.suggestedRescheduleDate)}{appointment.suggestedRescheduleTime ? ` at ${appointment.suggestedRescheduleTime}` : ""}</div>
          )}
        </div>
      )}

    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  label,
  number,
  iconStyle,
}) {
  return (
    <div style={styles.statCard}>

      <div style={iconStyle}>
        {icon}
      </div>

      <div>
        <span style={styles.statLabel}>
          {label}
        </span>

        <strong style={styles.statNumber}>
          {number}
        </strong>
      </div>

    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const normalized =
    String(status || "PENDING").toUpperCase();

  let badgeStyle = styles.pendingStatus;

  if (
    normalized === "APPROVED" ||
    normalized === "CONFIRMED" ||
    normalized === "COMPLETED"
  ) {
    badgeStyle = styles.approvedStatus;
  }

  if (
    normalized === "REJECTED" ||
    normalized === "CANCELLED"
  ) {
    badgeStyle = styles.rejectedStatus;
  }

  return (
    <span
      style={{
        ...styles.statusBadge,
        ...badgeStyle,
      }}
    >
      {normalized}
    </span>
  );
}

// ==========================================
// TABLE
// ==========================================

function ClinicalRecordTable({ title, rows = [], fields = [], onViewFile }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <h3>{title}</h3>
      {rows.length === 0 ? <p style={{ color: "var(--db-muted)" }}>No records available.</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead><tr>{fields.map(f => <th key={f} style={styles.th}>{f}</th>)}{onViewFile && <th style={styles.th}>Action</th>}</tr></thead>
            <tbody>{rows.map((r,i) => <tr key={r.id || i}>{fields.map(f => <td key={f} style={styles.td}>{String(r[f] ?? "-")}</td>)}{onViewFile && <td style={styles.td}><button type="button" style={styles.viewButton} onClick={() => onViewFile(r)}>👁 View</button></td>}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Table({ headers, rows, onRowClick }) {
  return (
    <div style={styles.tableCard}>

      <div style={styles.tableWrap}>

        <table style={styles.table}>

          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  style={styles.th}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} onClick={() => onRowClick?.(row)} style={onRowClick ? { cursor: "pointer" } : undefined}>

                {row.map((value, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={styles.td}
                  >
                    {String(value ?? "-")}
                  </td>
                ))}

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// ==========================================
// EMPTY CARD
// ==========================================

function AdminPaymentStatus({ status }) {
  const value = String(status || "PENDING").toUpperCase();
  const color = value === "PAID" ? { background: "var(--db-green-bg)", color: "var(--db-green-text)" } : value === "EXPIRED" ? { background: "var(--db-red-bg)", color: "var(--db-red-text)" } : { background: "var(--db-amber-bg)", color: "var(--db-amber-text)" };
  const label = value === "PAY_AT_HOSPITAL" ? "PAY AT HOSPITAL · UNPAID" : value.replaceAll("_", " ");
  return <span style={{ display: "inline-block", padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, ...color }}>{label}</span>;
}

function EmptyCard({
  icon,
  title,
  text,
}) {
  return (
    <div style={styles.emptyCard}>

      <div style={styles.emptyIcon}>
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
  searchInput: {
    width: "100%",
    maxWidth: "520px",
    boxSizing: "border-box",
    margin: "0 0 16px",
    padding: "11px 14px",
    border: "1px solid var(--db-border-strong)",
    borderRadius: "9px",
    background: "var(--db-surface)",
    color: "var(--db-heading)",
    fontSize: "14px",
    outlineColor: "#1769aa",
  },
  trackingFilterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  trackingFilterButton: {
    border: "1px solid var(--db-border-strong)",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  trackingFilterButtonActive: {
    background: "#1d4ed8",
    color: "#ffffff",
    borderColor: "#1d4ed8",
  },
  trackingSummaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    padding: "18px",
  },
  trackingSummaryCard: {
    border: "1px solid var(--db-border)",
    borderRadius: "10px",
    padding: "14px",
    background: "var(--db-surface-2)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  page: {
    minHeight: "100vh",
    background: "var(--db-bg)",
    display: "flex",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  // ========================================
  // LOADING
  // ========================================

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
    margin: "0 auto 12px",
  },

  // ========================================
  // SIDEBAR
  // ========================================

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

  // ========================================
  // ADMIN PROFILE
  // ========================================

  adminBox: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 8px",
    borderBottom:
      "1px solid rgba(255,255,255,.12)",
  },

  adminAvatar: {
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

  adminInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    overflow: "hidden",
  },

  adminAccount: {
    color: "#b8d4e8",
    fontSize: "11px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // ========================================
  // NAVIGATION
  // ========================================

  sidebarNavScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: "10px",
    paddingBottom: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    boxSizing: "border-box",
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
    padding: "13px 14px",
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
    padding: "0 6px",
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

  // ========================================
  // MAIN
  // ========================================

  main: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    minHeight: "100vh",
    padding: "30px 35px",
    boxSizing: "border-box",
  },

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
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
    border: "1px solid #1769aa",
    borderRadius: "8px",
    padding: "11px 16px",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  viewButton: {
    border: "1px solid #1769aa",
    borderRadius: "8px",
    padding: "8px 14px",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  invoiceActionButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minHeight: 34,
    border: "1px solid transparent",
    borderRadius: 8,
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "background .15s ease, box-shadow .15s ease, transform .15s ease",
  },

  invoiceViewButton: {
    color: "var(--db-blue-text)",
    background: "var(--db-blue-bg)",
    borderColor: "var(--db-blue-border)",
  },

  invoiceDownloadButton: {
    color: "var(--db-green-text)",
    background: "var(--db-green-bg)",
    borderColor: "var(--db-green-border)",
  },

  invoiceRenewButton: {
    color: "var(--db-amber-text)",
    background: "var(--db-amber-bg)",
    borderColor: "var(--db-amber-border)",
  },

  // ========================================
  // MESSAGES
  // ========================================

  success: {
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "9px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    fontWeight: 600,
  },

  error: {
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "9px",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
  },

  // ========================================
  // WELCOME
  // ========================================

  welcomeCard: {
    background:
      "linear-gradient(135deg, #1769aa 0%, #12395b 100%)",
    borderRadius: "15px",
    padding: "25px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
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

  welcomeSubtitle: {
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

  adminStatusBadge: {
    display: "inline-block",
    padding: "7px 13px",
    borderRadius: "20px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    fontSize: "12px",
    fontWeight: 800,
  },

  // ========================================
  // STATISTICS
  // ========================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "16px",
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

  statIconBlue: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statIconGreen: {
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
    fontSize: "22px",
  },

  // ========================================
  // OVERVIEW
  // ========================================

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "28px",
  },

  overviewCard: {
    background: "var(--db-surface)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,.04)",
  },

  overviewLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "11px",
    marginBottom: "3px",
  },

  overviewNumber: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "20px",
  },

  overviewIconPending: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--db-amber-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  overviewIconApproved: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: 800,
  },

  overviewIconConfirmed: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: 800,
  },

  overviewIconAppointment: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  // ========================================
  // SECTIONS
  // ========================================

  section: {
    marginBottom: "30px",
  },

  createSection: {
    marginBottom: "30px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
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
    margin: "4px 0 0",
    color: "var(--db-muted)",
    fontSize: "13px",
  },

  countBadge: {
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    borderRadius: "20px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  // ========================================
  // CREATE ACCOUNT
  // ========================================

  createCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    padding: "23px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  createForm: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1.5fr 1fr auto",
    alignItems: "end",
    gap: "15px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  inputLabel: {
    color: "var(--db-text)",
    fontSize: "12px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    color: "var(--db-heading)",
    background: "var(--db-surface)",
    fontSize: "13px",
  },

  createButton: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ========================================
  // TABLE
  // ========================================

  tableCard: {
    background: "var(--db-surface)",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    background: "var(--db-surface-2)",
    color: "var(--db-text)",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".3px",
    padding: "13px 15px",
    textAlign: "left",
    borderBottom:
      "1px solid var(--db-border)",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 15px",
    color: "var(--db-text)",
    fontSize: "13px",
    borderBottom:
      "1px solid var(--db-border)",
    verticalAlign: "middle",
  },

  noData: {
    padding: "35px",
    textAlign: "center",
    color: "var(--db-muted)",
  },

  // ========================================
  // PERSON
  // ========================================

  personCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  personAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ========================================
  // STATUS
  // ========================================

  statusBadge: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
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

  // ========================================
  // DOCTOR ACTIONS
  // ========================================

  actionButtons: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
  },

  approveButton: {
    border: "none",
    borderRadius: "7px",
    padding: "7px 11px",
    background: "#198754",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  rejectButton: {
    border: "none",
    borderRadius: "7px",
    padding: "7px 11px",
    background: "#dc3545",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  noAction: {
    color: "var(--db-faint)",
  },

  // ========================================
  // PENDING NOTICE
  // ========================================

  pendingNotice: {
    background: "var(--db-amber-bg)",
    border:
      "1px solid var(--db-amber-border)",
    borderRadius: "12px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "15px",
  },

  noticeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "var(--db-amber-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ========================================
  // APPOINTMENTS
  // ========================================

  appointmentList: {
    display: "grid",
    gap: "12px",
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
    fontSize: "18px",
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

  // ========================================
  // EMPTY
  // ========================================

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
  deleteButton: { marginLeft: 8, border: "1px solid var(--db-red-border)", background: "var(--db-red-bg)", color: "var(--db-red-text)", borderRadius: 7, padding: "7px 10px", cursor: "pointer" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 1000 },
  modalCard: { width: "min(900px,100%)", maxHeight: "90vh", overflowY: "auto", background: "var(--db-surface)", borderRadius: 16, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  modalGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 },
  inactiveStatus:{background:"var(--db-surface-2)",color:"var(--db-text)",padding:"5px 9px",borderRadius:999,fontWeight:700,fontSize:12},

};

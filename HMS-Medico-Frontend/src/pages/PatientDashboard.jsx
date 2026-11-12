
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getMyPatientAppointments,
} from "../services/appointmentService";

import {
  getMyPatientProfile,
  updateMyPatientProfile,
} from "../services/patientService";
import {
  createRazorpayOrder,
  getMyBillingInvoices,
  selectPayAtHospital,
  verifyRazorpayPayment,
} from "../services/billingService";

import api from "../services/axiosConfig";

import { getApprovedDoctors } from "../services/publicDoctorService";
import LocalProfilePhoto from "../components/LocalProfilePhoto";
import { getAvailableAppointmentSlots } from "../utils/appointmentSlots";

import {
  getPatientRecords,
} from "../services/staffService";

import {
  getMyMedicalReports,
  getMedicalReportFile,
  uploadMedicalReport as uploadMedicalReportService,
} from "../services/medicalReportService";

const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

function isInvoiceExpired(invoice) {
  if (invoice?.paymentExpired) return true;
  const createdAt = invoice?.createdAt ? new Date(invoice.createdAt).getTime() : NaN;
  return Number.isFinite(createdAt) && Date.now() >= createdAt + PAYMENT_WINDOW_MS;
}


export default function PatientDashboard() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [patient, setPatient] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [billingMessage, setBillingMessage] = useState("");
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  const [vitals, setVitals] = useState([]);

  const [reports, setReports] = useState([]);

  const [prescriptions, setPrescriptions] = useState([]);

  const [labTests, setLabTests] = useState([]);

  const [labReports, setLabReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [recordsLoading, setRecordsLoading] = useState(false);

  const [error, setError] = useState("");

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // Find Doctors and inline appointment booking state
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingForm, setBookingForm] = useState({
    problem: "",
    appointmentDate: "",
    appointmentTime: "",
  });


  // =========================================================
  // EDIT PROFILE STATE
  // =========================================================

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [profileForm, setProfileForm] = useState({
    patientName: "",
    email: "",
    phoneNumber: "",
    patientGender: "",
    patientAge: "",
    password: "",
  });


  // =========================================================
  // MEDICAL REPORT / OLD RECORDS UPLOAD STATE
  // =========================================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadingReport, setUploadingReport] =
    useState(false);

  const [uploadSuccess, setUploadSuccess] =
    useState("");


  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const redirectToLogin = useCallback(() => {

    sessionStorage.removeItem("patientToken");

    navigate(
      "/patient/login?redirect=/patient/dashboard",
      {
        replace: true,
      }
    );

  }, [navigate]);


  // =========================================================
  // LOAD BASIC DASHBOARD DATA
  // =========================================================

  const loadDashboard = useCallback(async () => {

    const token =
      sessionStorage.getItem("patientToken");

    if (!token) {

      redirectToLogin();

      return;
    }

    try {

      setLoading(true);

      setError("");

      const [
        patientData,
        appointmentData,
        invoiceData,
      ] = await Promise.all([
        getMyPatientProfile(),
        getMyPatientAppointments(),
        getMyBillingInvoices(),
      ]);

      setPatient(
        patientData || null
      );

      setAppointments(
        Array.isArray(appointmentData)
          ? appointmentData
          : Array.isArray(appointmentData?.data)
            ? appointmentData.data
            : []
      );
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);

    } catch (err) {

      console.error(
        "Unable to load patient dashboard:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        redirectToLogin();

        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to load your dashboard."
      );

    } finally {

      setLoading(false);

    }

  }, [redirectToLogin]);


  const loadInvoices = useCallback(async () => {
    setBillingLoading(true);
    setBillingError("");
    try {
      const data = await getMyBillingInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        redirectToLogin();
        return;
      }
      setBillingError(err.response?.data?.message || "Unable to load appointment invoices.");
    } finally {
      setBillingLoading(false);
    }
  }, [redirectToLogin]);

  const payInvoiceOnline = useCallback(async (invoice) => {
    if (isInvoiceExpired(invoice)) {
      await loadInvoices();
      setBillingError("This invoice has expired. Please contact the hospital admin to renew it.");
      return;
    }
    setPayingInvoiceId(invoice.id);
    setBillingError("");
    setBillingMessage("");
    try {
      const order = await createRazorpayOrder(invoice.id);
      if (!order?.keyId || !order?.orderId || !order?.amountPaise) {
        throw new Error("Razorpay did not return a valid order. Check the backend Razorpay test API key configuration.");
      }
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
          document.body.appendChild(script);
        });
      }
      if (typeof window.Razorpay !== "function") {
        throw new Error("Razorpay Checkout did not load correctly. Please refresh and try again.");
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency || "INR",
        name: "MediCore",
        description: `Appointment invoice ${order.invoiceNumber}`,
        order_id: order.orderId,
        prefill: {
          name: patient?.patientName || "",
          email: patient?.email || "",
          contact: patient?.phoneNumber || "",
        },
        theme: { color: "var(--db-blue-text)" },
        handler: async (payment) => {
          setPayingInvoiceId(invoice.id);
          try {
            await verifyRazorpayPayment(invoice.id, payment);
            setBillingMessage(`Invoice ${order.invoiceNumber} paid successfully.`);
            await loadInvoices();
          } catch (err) {
            setBillingError(err.response?.data?.message || "Payment was received but could not be verified. Contact the hospital with your Razorpay receipt.");
          } finally {
            setPayingInvoiceId(null);
          }
        },
        modal: { ondismiss: () => setPayingInvoiceId(null) },
      });
      checkout.on("payment.failed", (response) => {
        setBillingError(response.error?.description || "Razorpay payment failed. You can retry or choose pay at hospital.");
        setPayingInvoiceId(null);
      });
      checkout.open();
    } catch (err) {
      setBillingError(err.response?.data?.message || err.message || "Unable to start online payment.");
      setPayingInvoiceId(null);
    }
  }, [loadInvoices, patient]);

  const payAtHospital = useCallback(async (invoice) => {
    if (isInvoiceExpired(invoice)) {
      await loadInvoices();
      setBillingError("This invoice has expired. Please contact the hospital admin to renew it.");
      return;
    }
    setPayingInvoiceId(invoice.id);
    setBillingError("");
    setBillingMessage("");
    try {
      const updated = await selectPayAtHospital(invoice.id);
      if (updated.status !== "PAY_AT_HOSPITAL") {
        throw new Error("The hospital payment option was not saved. Please retry.");
      }
      setInvoices((current) => current.map((item) => item.id === updated.id ? updated : item));
      setBillingMessage(`Invoice ${updated.invoiceNumber} set to pay at the hospital before your appointment.`);
      await loadInvoices();
    } catch (err) {
      setBillingError(err.response?.data?.message || err.message || "Unable to select pay at hospital.");
    } finally {
      setPayingInvoiceId(null);
    }
  }, [loadInvoices]);


  // =========================================================
  // LOAD MEDICAL RECORDS
  // =========================================================

  const loadMedicalRecords = useCallback(
    async (recordType) => {

      const token =
        sessionStorage.getItem("patientToken");

      if (!token) {

        redirectToLogin();

        return;
      }

      try {

        setRecordsLoading(true);

        setError("");

        const data =
          await getPatientRecords(recordType);

        const safeData =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

        switch (recordType) {

          case "vitals":

            setVitals(safeData);

            break;

          case "prescriptions":

            setPrescriptions(safeData);

            break;

          case "lab-tests":

            setLabTests(safeData);

            break;

          default:
            break;
        }

      } catch (err) {

        console.error(
          `Unable to load ${recordType}:`,
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          redirectToLogin();

          return;
        }

        setError(
          err.response?.data?.message ||
          `Unable to load ${recordType}.`
        );

      } finally {

        setRecordsLoading(false);

      }

    },
    [redirectToLogin]
  );


  // =========================================================
  // LOAD OLD MEDICAL RECORDS
  // =========================================================

  const loadMedicalReports = useCallback(
    async () => {

      try {

        setRecordsLoading(true);

        setError("");

        const data =
          await getMyMedicalReports();

        const safeData =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setReports(safeData);

      } catch (err) {

        console.error(
          "Unable to load old medical records:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          redirectToLogin();

          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load old medical records."
        );

      } finally {

        setRecordsLoading(false);

      }

    },
    [redirectToLogin]
  );


  // =========================================================
  // OPEN SECTION
  // =========================================================

  const openSection = useCallback(
    async (
      sectionName,
      recordType = null
    ) => {

      setError("");

      setUploadSuccess("");

      setProfileSuccess("");

      setActiveSection(sectionName);

      if (sectionName !== "profile") {
        setEditingProfile(false);
      }

      if (sectionName === "billing") {
        await loadInvoices();
        return;
      }

      /*
       * Old Records
       */

      if (
        sectionName === "old-records" ||
        sectionName === "reports"
      ) {

        await loadMedicalReports();

        return;
      }


      /*
       * Medical Records
       */

      if (
        sectionName === "medical-records"
      ) {

        try {

          setRecordsLoading(true);

          const patientToken =
            sessionStorage.getItem(
              "patientToken"
            );

          if (!patientToken) {

            redirectToLogin();

            return;
          }

          const [
            testsResponse,
            reportsResponse,
          ] = await Promise.all([

            api.get(
              "/patient-records/lab-tests",
              {
                headers: {
                  Authorization:
                    `Bearer ${patientToken}`,
                },
              }
            ),

            api.get(
              "/patient-records/reports",
              {
                headers: {
                  Authorization:
                    `Bearer ${patientToken}`,
                },
              }
            ),

          ]);

          setLabTests(
            Array.isArray(
              testsResponse.data
            )
              ? testsResponse.data
              : []
          );

          setLabReports(
            Array.isArray(
              reportsResponse.data
            )
              ? reportsResponse.data
              : []
          );

        } catch (err) {

          console.error(
            "Unable to load laboratory records:",
            err
          );

          if (
            err.response?.status === 401 ||
            err.response?.status === 403
          ) {

            redirectToLogin();

            return;
          }

          setError(
            err.response?.data?.message ||
            "Unable to load laboratory tests and reports."
          );

        } finally {

          setRecordsLoading(false);

        }

        return;
      }


      if (recordType) {

        await loadMedicalRecords(
          recordType
        );

      }

    },
    [
      loadMedicalRecords,
      loadMedicalReports,
      loadInvoices,
      redirectToLogin,
    ]
  );


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  // =========================================================
  // AUTO REFRESH DASHBOARD
  // =========================================================

  useEffect(() => {

    const timer =
      setInterval(() => {

        loadDashboard();

      }, 10000);

    return () => {

      clearInterval(timer);

    };

  }, [loadDashboard]);

  useEffect(() => {
    if (activeSection !== "billing") return undefined;
    const timer = setInterval(() => {
      loadInvoices();
    }, 10000);
    return () => clearInterval(timer);
  }, [activeSection, loadInvoices]);


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    [
      "patientToken",
      "patientId",
      "patientName",
      "patientEmail",
      "patientGender",
      "patientAge",
    ].forEach((key) => {

      sessionStorage.removeItem(key);

    });

    navigate(
      "/patient/login",
      {
        replace: true,
      }
    );

  };


  // =========================================================
  // PROFILE FORM HELPERS
  // =========================================================

  const getPatientValue = useCallback(
    (patientData, keys, fallback = "") => {

      for (const key of keys) {

        if (
          patientData?.[key] !== undefined &&
          patientData?.[key] !== null
        ) {

          return patientData[key];

        }

      }

      return fallback;

    },
    []
  );


  // =========================================================
  // START EDITING PROFILE
  // =========================================================

  const startEditingProfile = () => {

    setError("");

    setProfileSuccess("");

    setProfileForm({

      patientName:
        getPatientValue(
          patient,
          [
            "patientName",
            "name",
            "fullName",
          ],
          sessionStorage.getItem(
            "patientName"
          ) || ""
        ),

      email:
        getPatientValue(
          patient,
          [
            "email",
            "patientEmail",
          ],
          sessionStorage.getItem(
            "patientEmail"
          ) || ""
        ),

      phoneNumber:
        getPatientValue(
          patient,
          [
            "phoneNumber",
            "phone",
            "mobileNumber",
          ],
          ""
        ),

      patientGender:
        getPatientValue(
          patient,
          [
            "patientGender",
            "gender",
          ],
          sessionStorage.getItem(
            "patientGender"
          ) || ""
        ),

      patientAge:
        getPatientValue(
          patient,
          [
            "patientAge",
            "age",
          ],
          sessionStorage.getItem(
            "patientAge"
          ) || ""
        ),

      password: "",

    });

    setEditingProfile(true);

  };


  // =========================================================
  // PROFILE INPUT CHANGE
  // =========================================================

  const handleProfileChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setProfileForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");

    setProfileSuccess("");

  };


  // =========================================================
  // CANCEL PROFILE EDIT
  // =========================================================

  const cancelProfileEdit = () => {

    setEditingProfile(false);

    setProfileSuccess("");

    setError("");

    setProfileForm({
      patientName: "",
      email: "",
      phoneNumber: "",
      patientGender: "",
      patientAge: "",
      password: "",
    });

  };


  // =========================================================
  // SAVE PROFILE
  //
  // Backend:
  //
  // PUT /me
  //
  // DTO:
  // patientName
  // email
  // phoneNumber
  // patientGender
  // patientAge
  // password
  // =========================================================

  const saveProfile = async () => {

    setError("");

    setProfileSuccess("");

    const patientName =
      String(
        profileForm.patientName || ""
      ).trim();

    const email =
      String(
        profileForm.email || ""
      ).trim()
      .toLowerCase();

    const phoneNumber =
      String(
        profileForm.phoneNumber || ""
      ).trim();

    const patientGender =
      String(
        profileForm.patientGender || ""
      ).trim();

    const patientAge =
      profileForm.patientAge === "" ||
      profileForm.patientAge === null ||
      profileForm.patientAge === undefined
        ? ""
        : Number(
            profileForm.patientAge
          );

    const password =
      String(
        profileForm.password || ""
      );

    /*
     * Basic frontend validation.
     *
     * Your backend performs the
     * authoritative validation too.
     */

    if (!patientName) {

      setError(
        "Patient name is required."
      );

      return;
    }

    if (!email) {

      setError(
        "Email is required."
      );

      return;
    }

    if (!phoneNumber) {

      setError(
        "Phone number is required."
      );

      return;
    }

    if (!patientGender) {

      setError(
        "Please select your gender."
      );

      return;
    }

    if (
      patientAge === "" ||
      Number.isNaN(patientAge)
    ) {

      setError(
        "Please enter a valid age."
      );

      return;
    }

    if (patientAge <= 0) {

      setError(
        "Age must be greater than 0."
      );

      return;
    }


    try {

      setProfileSaving(true);

      const patientToken =
        sessionStorage.getItem(
          "patientToken"
        );

      if (!patientToken) {

        redirectToLogin();

        return;
      }


      const payload = {

        patientName,

        email,

        phoneNumber,

        patientGender,

        patientAge,

        password,

      };


      const response = await updateMyPatientProfile(payload);


      /*
       * Backend response can be:
       *
       * {
       *   message: "...",
       *   data: {...}
       * }
       *
       * or directly the patient.
       */

      const responseData =
        response?.data;

      const updatedPatient =
        responseData?.data ||
        responseData?.patient ||
        responseData;


      /*
       * Update React state.
       */

      if (
        updatedPatient &&
        typeof updatedPatient ===
          "object"
      ) {

        setPatient(
          updatedPatient
        );

      }


      /*
       * Update sessionStorage so the
       * sidebar also immediately reflects
       * the new information.
       */

      sessionStorage.setItem(
        "patientName",
        patientName
      );

      sessionStorage.setItem(
        "patientEmail",
        email
      );

      sessionStorage.setItem(
        "patientGender",
        patientGender
      );

      sessionStorage.setItem(
        "patientAge",
        String(patientAge)
      );


      setProfileSuccess(
        responseData?.message ||
        "Patient profile updated successfully."
      );

      setEditingProfile(false);

      /*
       * Reload from backend so the UI
       * always uses the actual saved data.
       */

      try {

        const freshPatient =
          await getMyPatientProfile();

        if (freshPatient) {

          setPatient(
            freshPatient
          );

        }

      } catch (refreshError) {

        console.error(
          "Profile saved but refresh failed:",
          refreshError
        );

      }

    } catch (err) {

      console.error(
        "Unable to update patient profile:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        redirectToLogin();

        return;
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to update your profile."
      );

    } finally {

      setProfileSaving(false);

    }

  };


  // =========================================================
  // SELECT MEDICAL REPORT
  // =========================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    setUploadSuccess("");

    setError("");

    if (!file) {

      setSelectedFile(null);

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const fileName =
      file.name.toLowerCase();

    const hasAllowedExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(
            extension
          )
      );

    const hasAllowedMimeType =
      allowedTypes.includes(
        file.type
      );

    if (
      !hasAllowedMimeType &&
      !hasAllowedExtension
    ) {

      setError(
        "Only PDF, JPG, JPEG, PNG and WEBP files are allowed."
      );

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {

      setError(
        "File size must be less than 10 MB."
      );

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);

  };


  // =========================================================
  // REMOVE SELECTED FILE
  // =========================================================

  const removeSelectedFile = () => {

    setSelectedFile(null);

    setError("");

    setUploadSuccess("");

    const fileInput =
      document.getElementById(
        "medicalReportFile"
      );

    if (fileInput) {

      fileInput.value = "";

    }

  };


  // =========================================================
  // UPLOAD OLD MEDICAL RECORD
  // =========================================================

  const uploadMedicalReport = async () => {

    if (!selectedFile) {

      setError(
        "Please select a medical report first."
      );

      return;
    }

    try {

      setUploadingReport(true);

      setError("");

      setUploadSuccess("");

      await uploadMedicalReportService(
        selectedFile
      );

      setUploadSuccess(
        "Old medical record uploaded successfully."
      );

      setSelectedFile(null);

      const fileInput =
        document.getElementById(
          "medicalReportFile"
        );

      if (fileInput) {

        fileInput.value = "";

      }

      await loadMedicalReports();

    } catch (err) {

      console.error(
        "Unable to upload old medical record:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        redirectToLogin();

        return;
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to upload old medical record."
      );

    } finally {

      setUploadingReport(false);

    }

  };


  // =========================================================
  // VIEW OLD MEDICAL RECORD
  // =========================================================

  const viewMedicalReport =
    async (report) => {

      if (!report) {

        setError(
          "Medical record information is missing."
        );

        return;
      }

      const token =
        sessionStorage.getItem(
          "patientToken"
        );

      if (!token) {

        redirectToLogin();

        return;
      }

      const fileName =
        report.file;

      if (!fileName) {

        setError(
          "Stored file information is missing for this medical record."
        );

        return;
      }

      try {

        setError("");

        const response =
          await getMedicalReportFile(
            fileName
          );

        if (!response.data) {

          throw new Error(
            "Empty file response."
          );

        }

        const url =
          URL.createObjectURL(
            response.data
          );

        const newWindow =
          window.open(
            url,
            "_blank",
            "noopener,noreferrer"
          );

        if (!newWindow) {

          setError(
            "The browser blocked the file window. Please allow pop-ups and try again."
          );

        }

        setTimeout(() => {

          URL.revokeObjectURL(
            url
          );

        }, 30000);

      } catch (err) {

        console.error(
          "Unable to open medical record:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          redirectToLogin();

          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to open medical record."
        );

      }

    };


  // =========================================================
  // COUNTS
  // =========================================================

  const pendingCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() ===
        "PENDING"
    ).length;

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() ===
        "CONFIRMED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toUpperCase() ===
        "CANCELLED"
    ).length;


  // =========================================================
  // PROFILE
  // =========================================================

  const profile = {

    name:
      patient?.patientName ||
      patient?.name ||
      patient?.fullName ||
      patient?.patientName ||
      sessionStorage.getItem(
        "patientName"
      ) ||
      "Patient",

    id:
      patient?.id ||
      patient?.patientId ||
      sessionStorage.getItem(
        "patientId"
      ) ||
      "-",

    email:
      patient?.email ||
      patient?.patientEmail ||
      sessionStorage.getItem(
        "patientEmail"
      ) ||
      "-",

    phone:
      patient?.phoneNumber ||
      patient?.phone ||
      patient?.mobileNumber ||
      "-",

    gender:
      patient?.patientGender ||
      patient?.gender ||
      sessionStorage.getItem(
        "patientGender"
      ) ||
      "-",

    age:
      patient?.patientAge ??
      patient?.age ??
      sessionStorage.getItem(
        "patientAge"
      ) ??
      "-",

    photo:
      patient?.profilePhoto
        ? `${api.defaults.baseURL || ""}/patients/${patient.id || patient.patientId}/profile-photo`
        : "",
  };

  // Load approved doctors only when the embedded Find Doctors section opens.
  useEffect(() => {
    if (activeSection !== "doctors") return undefined;

    let cancelled = false;
    const loadDoctors = async () => {
      setDoctorsLoading(true);
      setDoctorsError("");
      try {
        const data = await getApprovedDoctors();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.doctors)
              ? data.doctors
              : [];
        if (!cancelled) setDoctors(list);
      } catch (err) {
        if (!cancelled) {
          setDoctorsError(
            err.response?.data?.message ||
            "Unable to load available doctors. Please try again."
          );
        }
      } finally {
        if (!cancelled) setDoctorsLoading(false);
      }
    };

    loadDoctors();
    return () => { cancelled = true; };
  }, [activeSection]);

  const handleDashboardAppointmentBooking = async (event) => {
    event.preventDefault();
    setBookingError("");
    setBookingMessage("");

    if (!selectedDoctor?.id) {
      setBookingError("Please select a doctor.");
      return;
    }

    const patientName = String(profile.name || "").trim();
    const patientGender = String(profile.gender || "").trim();
    const patientAge = Number(profile.age);
    const problem = bookingForm.problem.trim();

    if (!patientName || patientName === "Patient") {
      setBookingError("Please update your patient name in My Profile first.");
      return;
    }
    if (!patientGender || patientGender === "-") {
      setBookingError("Please add your gender in My Profile first.");
      return;
    }
    if (!Number.isInteger(patientAge) || patientAge < 1 || patientAge > 120) {
      setBookingError("Please add a valid age in My Profile first.");
      return;
    }
    if (!problem) {
      setBookingError("Please enter the reason for your appointment.");
      return;
    }
    if (!bookingForm.appointmentDate || !bookingForm.appointmentTime) {
      setBookingError("Please select an appointment date and time.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${bookingForm.appointmentDate}T00:00:00`);
    if (selectedDate < today) {
      setBookingError("Please select today or a future date.");
      return;
    }

    if (!sessionStorage.getItem("patientToken")) {
      redirectToLogin();
      return;
    }

    try {
      setBookingSaving(true);
      await api.post("/appointments", {
        doctorId: Number(selectedDoctor.id),
        patientName,
        patientGender,
        patientAge,
        problem,
        appointmentDate: bookingForm.appointmentDate,
        appointmentTime: bookingForm.appointmentTime,
      });

      setBookingMessage("Appointment request submitted successfully. It is waiting for doctor confirmation.");
      const latestAppointments = await getMyPatientAppointments();
      setAppointments(
        Array.isArray(latestAppointments)
          ? latestAppointments
          : Array.isArray(latestAppointments?.data)
            ? latestAppointments.data
            : []
      );
      setBookingForm({ problem: "", appointmentDate: "", appointmentTime: "" });
      setSelectedDoctor(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        redirectToLogin();
        return;
      }
      setBookingError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to book the appointment. Please try again."
      );
    } finally {
      setBookingSaving(false);
    }
  };


  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    date
  ) => {

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

      return String(date);

    }

    return parsedDate.toLocaleDateString();

  };


  // =========================================================
  // DATE TIME FORMAT
  // =========================================================

  const formatDateTime =
    (value) => {

      if (!value) {

        return "-";

      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return String(value);

      }

      return date.toLocaleString();

    };


  // =========================================================
  // RECENT APPOINTMENTS
  // =========================================================

  const recentAppointments =
    [...appointments]
      .sort((a, b) => {

        const dateA =
          new Date(
            `${a.appointmentDate || "1900-01-01"}T${
              a.appointmentTime || "00:00"
            }`
          );

        const dateB =
          new Date(
            `${b.appointmentDate || "1900-01-01"}T${
              b.appointmentTime || "00:00"
            }`
          );

        return dateB - dateA;

      })
      .slice(0, 5);


  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (
    loading &&
    !patient
  ) {

    return (

      <div style={styles.loadingPage}>

        <div style={styles.loadingCard}>

          <div style={styles.loadingIcon}>
            🩺
          </div>

          <h2>
            Loading Patient Dashboard...
          </h2>

          <p>
            Getting your information from the server.
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div style={styles.layout}>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside style={styles.sidebar}>

        <div style={styles.logoArea}>

          <div style={styles.logoIcon}>
            +
          </div>

          <div onClick={() => window.location.reload()}
                 style={{ cursor: "pointer" }}>

            <h2 style={styles.logoTitle}>
               MediCo
            </h2>

            <span style={styles.logoSubtitle}>
              PATIENT PORTAL
            </span>

          </div>

        </div>


        {/* PATIENT PROFILE */}

        <div style={styles.patientProfile}>

          <div style={{ ...styles.avatar, display: "none" }}>

            {profile.photo ? (

              <img
                src={profile.photo}
                alt="Profile"
                style={
                  styles.avatarImage
                }
              />

            ) : (

              "👤"

            )}

          </div>

          <LocalProfilePhoto role="PATIENT" userKey={profile.email || profile.id} name={profile.name} existingPhoto={profile.photo} size={56} />

          <div style={styles.profileInfo}>

            <strong
              style={
                styles.profileTitle
              }
            >
              {profile.name}
            </strong>

            <span
              style={
                styles.profileId
              }
            >
              ID: {profile.id}
            </span>

          </div>

        </div>


        {/* SIDEBAR NAVIGATION */}

        <div className="dashboard-sidebar-nav-scroll" style={styles.sidebarNavScroll}>

          <nav style={styles.nav}>

            <NavButton
              icon="📊"
              label="Dashboard"
              active={
                activeSection ===
                "dashboard"
              }
              onClick={() =>
                openSection(
                  "dashboard"
                )
              }
            />


            <NavButton
              icon="👤"
              label="My Profile"
              active={
                activeSection ===
                "profile"
              }
              onClick={() =>
                openSection(
                  "profile"
                )
              }
            />


            <NavButton
              icon="📅"
              label="My Appointments"
              active={
                activeSection ===
                "appointments"
              }
              badge={
                pendingCount > 0
                  ? pendingCount
                  : null
              }
              onClick={() =>
                openSection(
                  "appointments"
                )
              }
            />


            <NavButton
              icon="👨‍⚕️"
              label="Find Doctors"
              active={activeSection === "doctors"}
              onClick={() => openSection("doctors")}
            />


            <NavButton
              icon="🩺"
              label="Health Checkup"
              active={activeSection === "health-checkups"}
              onClick={() => openSection("health-checkups")}
            />


            <NavButton
              icon="💊"
              label="Prescriptions"
              active={
                activeSection ===
                "prescriptions"
              }
              onClick={() =>
                openSection(
                  "prescriptions",
                  "prescriptions"
                )
              }
            />


            <NavButton
              icon="📁"
              label="Old Records"
              active={
                activeSection ===
                "old-records"
              }
              onClick={() =>
                openSection(
                  "old-records"
                )
              }
            />


            <NavButton
              icon="🧪"
              label="Medical Records"
              active={
                activeSection ===
                "medical-records"
              }
              onClick={() =>
                openSection(
                  "medical-records"
                )
              }
            />


            <NavButton
              icon="❤️"
              label="Vital Signs"
              active={
                activeSection ===
                "vitals"
              }
              onClick={() =>
                openSection(
                  "vitals",
                  "vitals"
                )
              }
            />


            <NavButton
              icon="💳"
              label="Billing"
              active={
                activeSection ===
                "billing"
              }
              onClick={() =>
                openSection(
                  "billing"
                )
              }
            />

          </nav>

        </div>


        {/* LOGOUT */}

        <div style={styles.sidebarBottom}>

          <button
            type="button"
            onClick={logout}
            style={styles.logoutButton}
          >

            🚪

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

        {error && (

          <div style={styles.error}>
            ⚠️ {error}
          </div>

        )}


        {activeSection ===
          "dashboard" && (

          <DashboardSection
            profile={profile}
            appointments={
              appointments
            }
            recentAppointments={
              recentAppointments
            }
            pendingCount={
              pendingCount
            }
            confirmedCount={
              confirmedCount
            }
            cancelledCount={
              cancelledCount
            }
            loading={
              loading
            }
            loadDashboard={
              loadDashboard
            }
            navigate={
              navigate
            }
            openSection={
              openSection
            }
            formatDate={
              formatDate
            }
            invoices={invoices}
            billingError={billingError}
            billingMessage={billingMessage}
            payingInvoiceId={payingInvoiceId}
            onPayOnline={payInvoiceOnline}
            onPayAtHospital={payAtHospital}
          />

        )}


        {/* FIND DOCTORS - stays inside the patient dashboard */}
        {activeSection === "doctors" && (
          <PatientDoctorsSection
            doctors={doctors}
            loading={doctorsLoading}
            error={doctorsError}
            search={doctorSearch}
            setSearch={setDoctorSearch}
            selectedDoctor={selectedDoctor}
            bookingForm={bookingForm}
            setBookingForm={setBookingForm}
            bookingSaving={bookingSaving}
            bookingMessage={bookingMessage}
            bookingError={bookingError}
            onSelectDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setBookingError("");
              setBookingMessage("");
            }}
            onCloseBooking={() => {
              setSelectedDoctor(null);
              setBookingError("");
            }}
            onSubmitBooking={handleDashboardAppointmentBooking}
            onRetry={() => {
              setActiveSection("dashboard");
              window.setTimeout(() => setActiveSection("doctors"), 0);
            }}
          />
        )}

        {/* HEALTH CHECKUP — stays inside the patient dashboard */}
        {activeSection === "health-checkups" && (
          <PatientHealthCheckupsSection patient={patient} profile={profile} />
        )}

        {/* PROFILE */}

        {activeSection ===
          "profile" && (

          <ProfileSection
            profile={
              profile
            }
            editingProfile={
              editingProfile
            }
            profileForm={
              profileForm
            }
            profileSaving={
              profileSaving
            }
            profileSuccess={
              profileSuccess
            }
            onEdit={
              startEditingProfile
            }
            onCancel={
              cancelProfileEdit
            }
            onChange={
              handleProfileChange
            }
            onSave={
              saveProfile
            }
          />

        )}


        {activeSection ===
          "appointments" && (

          <AppointmentsSection
            recentAppointments={
              recentAppointments
            }
            navigate={
              navigate
            }
            formatDate={
              formatDate
            }
          />

        )}


        {activeSection ===
          "old-records" && (

          <MedicalReportsSection
            reports={
              reports
            }
            loading={
              recordsLoading
            }
            selectedFile={
              selectedFile
            }
            uploadingReport={
              uploadingReport
            }
            uploadSuccess={
              uploadSuccess
            }
            handleFileChange={
              handleFileChange
            }
            removeSelectedFile={
              removeSelectedFile
            }
            uploadMedicalReport={
              uploadMedicalReport
            }
            viewMedicalReport={
              viewMedicalReport
            }
            formatDateTime={
              formatDateTime
            }
            loadMedicalReports={
              loadMedicalReports
            }
          />

        )}


        {activeSection ===
          "medical-records" && (

          <LabMedicalRecordsSection
            labTests={
              labTests
            }
            labReports={
              labReports
            }
            loading={
              recordsLoading
            }
            formatDateTime={
              formatDateTime
            }
            patientId={
              profile.id
            }
            token={
              sessionStorage.getItem(
                "patientToken"
              )
            }
            onRefresh={() =>
              openSection(
                "medical-records"
              )
            }
          />

        )}


        {activeSection ===
          "lab-tests" && (

          <RecordsSection
            title="🧪 Lab Tests"
            subtitle="Laboratory tests belonging to this patient."
            count={
              labTests.length
            }
            countLabel={
              labTests.length === 1
                ? "Test"
                : "Tests"
            }
            loading={
              recordsLoading
            }
            emptyIcon="🧪"
            emptyTitle="No lab tests available"
            emptyMessage="Laboratory tests for this patient will appear here."
          >

            {labTests.length > 0 && (

              <div
                style={
                  styles.tableWrapper
                }
              >

                <table
                  style={styles.table}
                >

                  <thead>

                    <tr>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Test
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Status
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {labTests.map(
                      (test) => (

                        <tr
                          key={
                            test.id
                          }
                          style={
                            styles.tableRow
                          }
                        >

                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            <strong
                              style={
                                styles.primaryText
                              }
                            >
                              {test.testName ||
                                test.name ||
                                "Lab Test"}
                            </strong>

                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            <span
                              style={
                                styles.testStatus
                              }
                            >
                              {test.status ||
                                "-"}
                            </span>

                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            {formatDateTime(
                              test.suggestedAt ||
                              test.createdAt ||
                              test.testDate
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </RecordsSection>

        )}


        {activeSection ===
          "prescriptions" && (

          <RecordsSection
            title="💊 Prescriptions"
            subtitle="Prescriptions belonging to this patient."
            count={
              prescriptions.length
            }
            countLabel={
              prescriptions.length === 1
                ? "Prescription"
                : "Prescriptions"
            }
            loading={
              recordsLoading
            }
            emptyIcon="💊"
            emptyTitle="No prescriptions available"
            emptyMessage="Doctor prescriptions for this patient will appear here."
          >

            {prescriptions.length > 0 && (

              <div
                style={
                  styles.tableWrapper
                }
              >

                <table
                  style={styles.table}
                >

                  <thead>

                    <tr>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Medicine
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Dosage
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Duration
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Pharmacy
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Instructions
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {prescriptions.map(
                      (prescription) => (

                        <tr
                          key={
                            prescription.id
                          }
                          style={
                            styles.tableRow
                          }
                        >

                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            <strong
                              style={
                                styles.medicineText
                              }
                            >
                              {prescription.medicine ||
                                "-"}
                            </strong>

                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                            {[prescription.dosage, prescription.dosingTimes].filter(Boolean).join(" · ") || "-"}
                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                            {prescription.duration ||
                              "-"}
                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                            {prescription.pharmacyName ||
                              "-"}
                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                            {prescription.instructions ||
                              "-"}
                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                            {formatDateTime(
                              prescription.prescribedAt
                            )}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </RecordsSection>

        )}


        {activeSection ===
          "vitals" && (

          <RecordsSection
            title="❤️ Vital Signs"
            subtitle="Vital signs recorded for this patient."
            count={
              vitals.length
            }
            countLabel={
              vitals.length === 1
                ? "Record"
                : "Records"
            }
            loading={
              recordsLoading
            }
            emptyIcon="❤️"
            emptyTitle="No vital signs available"
            emptyMessage="Recorded vital signs for this patient will appear here."
          >

            {vitals.length > 0 && (

              <div
                style={
                  styles.tableWrapper
                }
              >

                <table
                  style={styles.table}
                >

                  <thead>

                    <tr>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Blood Pressure
                      </th>




                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Weight
                      </th>

                      <th
                        style={
                          styles.tableHeader
                        }
                      >
                        Recorded At
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {vitals.map(
                      (vital) => (

                        <tr
                          key={
                            vital.id
                          }
                          style={
                            styles.tableRow
                          }
                        >

                          <td
                            style={
                              styles.tableCell
                            }
                          >
                           {vital.bpSystolic || "-"}/{vital.bpDiastolic || "-"} mmHg
                          </td>


                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            {vital.weightKg
                              ? `${vital.weightKg} kg`
                              : "-"}

                          </td>

                          <td
                            style={
                              styles.tableCell
                            }
                          >

                            {formatDateTime(
                              vital.recordedAt
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </RecordsSection>

        )}


        {activeSection ===
          "billing" && (

          <InvoiceBillingSection
            patientName={patient?.patientName}
            confirmedCount={
              confirmedCount
            }
            invoices={invoices}
            loading={billingLoading}
            error={billingError}
            message={billingMessage}
            payingInvoiceId={payingInvoiceId}
            onPayOnline={payInvoiceOnline}
            onPayAtHospital={payAtHospital}
          />

        )}

      </main>

    </div>

  );

}


// =========================================================
// MEDICAL REPORTS SECTION
// =========================================================

function MedicalReportsSection({
  reports,
  loading,
  selectedFile,
  uploadingReport,
  uploadSuccess,
  handleFileChange,
  removeSelectedFile,
  uploadMedicalReport,
  viewMedicalReport,
  formatDateTime,
  loadMedicalReports,
}) {

  return (

    <section
      style={
        styles.sectionPage
      }
    >

      <PageHeader
        title="📁 Old Medical Records"
        subtitle="Upload and view your previous medical reports."
      />

      <div
        style={
          styles.uploadCard
        }
      >

        <div
          style={
            styles.uploadIcon
          }
        >
          📤
        </div>

        <div
          style={
            styles.uploadContent
          }
        >

          <h2
            style={
              styles.uploadTitle
            }
          >
            Upload Old Medical Record
          </h2>

          <p
            style={
              styles.uploadDescription
            }
          >
            Upload previous medical reports,
            prescriptions, scan reports,
            laboratory reports or other
            medical documents.
            <br/>Mention File-Name as your-name followed by report-name.
          </p>

          <div
            style={
              styles.fileInputArea
            }
          >

            <input
              id="medicalReportFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              style={
                styles.fileInput
              }
            />

          </div>

          {selectedFile && (

            <div
              style={
                styles.selectedFile
              }
            >

              <span
                style={
                  styles.selectedFileIcon
                }
              >
                📄
              </span>

              <div
                style={
                  styles.selectedFileInfo
                }
              >

                <strong>
                  {selectedFile.name}
                </strong>

                <span
                  style={
                    styles.fileSize
                  }
                >
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}
                  {" MB"}
                </span>

              </div>

              <button
                type="button"
                style={
                  styles.removeFileButton
                }
                onClick={
                  removeSelectedFile
                }
              >
                ✕
              </button>

            </div>

          )}

          {uploadSuccess && (

            <div
              style={
                styles.successMessage
              }
            >
              ✅ {uploadSuccess}
            </div>

          )}

          <div
            style={
              styles.uploadBottom
            }
          >

            <span
              style={
                styles.allowedFiles
              }
            >
              Allowed: PDF, JPG, JPEG, PNG, WEBP
              <br />
              Maximum file size: 10 MB
            </span>

            <button
              type="button"
              onClick={
                uploadMedicalReport
              }
              disabled={
                uploadingReport ||
                !selectedFile
              }
              style={{
                ...styles.uploadButton,

                ...(uploadingReport ||
                !selectedFile
                  ? styles.uploadButtonDisabled
                  : {}),
              }}
            >

              {uploadingReport
                ? "⏳ Uploading..."
                : "📤 Upload Record"}

            </button>

          </div>

        </div>

      </div>


      <div
        style={
          styles.reportsContainer
        }
      >

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
              📋 My Old Medical Records
            </h2>

            <p
              style={
                styles.sectionSubtitle
              }
            >
              Medical records stored in your patient account.
            </p>

          </div>

          <div
            style={
              styles.reportHeaderActions
            }
          >

            <div
              style={
                styles.recordCount
              }
            >
              {reports.length}{" "}
              {reports.length === 1
                ? "Record"
                : "Records"}
            </div>

            <button
              type="button"
              onClick={
                loadMedicalReports
              }
              style={
                styles.secondaryButton
              }
              disabled={
                loading
              }
            >
              🔄 Refresh
            </button>

          </div>

        </div>

        {loading ? (

          <LoadingSection />

        ) : reports.length === 0 ? (

          <EmptyState
            icon="📁"
            title="No old medical records"
            message="Upload your previous medical records using the upload section above."
          />

        ) : (

          <div
            style={
              styles.tableWrapper
            }
          >

            <table
              style={
                styles.table
              }
            >

              <thead>

                <tr>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    File Name
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Uploaded Date
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Stored File
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Patient
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {reports.map(
                  (report) => (

                    <tr
                      key={
                        report.id
                      }
                      style={
                        styles.tableRow
                      }
                    >

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        <div
                          style={
                            styles.reportFileCell
                          }
                        >

                          <div
                            style={
                              styles.reportFileIcon
                            }
                          >
                            📄
                          </div>

                          <strong
                            style={
                              styles.primaryText
                            }
                          >
                            {report.fileName ||
                              "Medical Record"}
                          </strong>

                        </div>

                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        {formatDateTime(
                          report.createdAt
                        )}

                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        <span
                          style={
                            styles.storedFileName
                          }
                        >
                          {report.file ||
                            "-"}
                        </span>

                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        {report.patient ? (

                          <div>

                            <strong
                              style={
                                styles.primaryText
                              }
                            >
                              {report.patient.name ||
                                report.patient.fullName ||
                                report.patient.patientName ||
                                `Patient #${
                                  report.patient.id ||
                                  "-"
                                }`}
                            </strong>

                            {report.patient.email && (

                              <div
                                style={
                                  styles.patientEmail
                                }
                              >
                                {report.patient.email}
                              </div>

                            )}

                          </div>

                        ) : (

                          "-"

                        )}

                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        <button
                          type="button"
                          onClick={() =>
                            viewMedicalReport(
                              report
                            )
                          }
                          style={
                            styles.viewButton
                          }

                        >
                          👁 View
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>

  );

}


// =========================================================
// DASHBOARD SECTION
// =========================================================

function DashboardSection({
  profile,
  appointments,
  recentAppointments,
  pendingCount,
  confirmedCount,
  cancelledCount,
  loading,
  loadDashboard,
  navigate,
  openSection,
  formatDate,
  invoices,
  billingError,
  billingMessage,
  payingInvoiceId,
  onPayOnline,
  onPayAtHospital,
}) {

  return (

    <section>

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
            Patient Dashboard
          </h1>

          <p
            style={
              styles.subtitle
            }
          >
            Welcome ! {" "}
            <strong>
              {profile.name}
            </strong>
            .
          </p>

        </div>

        <button
          type="button"
          onClick={
            loadDashboard
          }
          style={
            styles.refreshButton
          }
          disabled={
            loading
          }
        >
          🔄{" "}
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* WELCOME */}

                  <div style={styles.welcomeCard}>

                    <div style={styles.welcomeLeft}>

                      <div style={styles.largeAvatar}>
                         {profile.name  ? profile.name.charAt(0).toUpperCase()
                                                         : "P"}
                      </div>

                      <div>
                        <span style={styles.welcomeSmall}>
                          Welcome !
                        </span>



                        <p style={styles.welcomeSubtitle}>
                           MediCo Hospital Management
                        </p>
                      </div>

                    </div>

                    <div style={styles.statusArea}>

                      <span style={styles.statusLabel}>
                        Account Role<br/>
                      </span>

                      <span style={styles.adminStatusBadge}>PATINET

                      </span>

                    </div>

                  </div>





      <div
        style={
          styles.quickActions
        }
      >

        <QuickAction
          icon="👨‍⚕️"
          title="Find a Doctor"
          description="Search doctors and book an appointment"
          onClick={() =>
            openSection("doctors")
          }
        />

        <QuickAction
          icon="🩺"
          title="Health Checkup"
          description="Explore health screening and checkup options"
          onClick={() => openSection("health-checkups")}
        />

        <QuickAction
          icon="📅"
          title="Appointments"
          description="View your upcoming appointments"
          onClick={() =>
            openSection(
              "appointments"
            )
          }
        />



        <QuickAction
          icon="📁"
          title="Old Records"
          description="Upload and view previous medical records"
          onClick={() =>
            openSection(
              "old-records"
            )
          }
        />

      </div>


      <DashboardBillingPanel
        invoices={invoices}
        billingError={billingError}
        billingMessage={billingMessage}
        payingInvoiceId={payingInvoiceId}
        onPayOnline={onPayOnline}
        onPayAtHospital={onPayAtHospital}
        onViewInvoices={() => openSection("billing")}
      />


      <div
        style={
          styles.statsGrid
        }
      >

        <StatCard
          icon="📅"
          label="Total Appointments"
          value={
            appointments.length
          }
          iconStyle="blue"
        />

        <StatCard
          icon="⏳"
          label="Pending"
          value={
            pendingCount
          }
          iconStyle="yellow"
        />

        <StatCard
          icon="✓"
          label="Confirmed"
          value={
            confirmedCount
          }
          iconStyle="green"
        />

        <StatCard
          icon="✕"
          label="Cancelled"
          value={
            cancelledCount
          }
          iconStyle="red"
        />

      </div>


      <div
        style={
          styles.section
        }
      >

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
              Your latest appointments.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              openSection(
                "appointments"
              )
            }
            style={
              styles.secondaryButton
            }
          >
            View All
          </button>

        </div>


        {recentAppointments.length ===
        0 ? (

          <EmptyState
            icon="📅"
            title="No appointments yet"
            message="Book an appointment with a doctor to get started."
            buttonText="Find a Doctor"
            onClick={() =>
              navigate(
                "/patient/find-doctors"
              )
            }
          />

        ) : (

          <div
            style={
              styles.appointmentList
            }
          >

            {recentAppointments.map(
              (appointment) => {

                const status =
                  String(
                    appointment.status ||
                    "PENDING"
                  ).toUpperCase();

                let statusStyle =
                  styles.pending;

                if (
                  status ===
                  "CONFIRMED"
                ) {

                  statusStyle =
                    styles.confirmed;

                }

                if (
                  status === "CANCELLED" || status === "REJECTED"
                ) {

                  statusStyle =
                    styles.cancelled;

                }

                return (

                  <AppointmentCard
                    key={
                      appointment.id
                    }
                    appointment={
                      appointment
                    }
                    status={
                      status
                    }
                    statusStyle={
                      statusStyle
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

      </div>

    </section>

  );

}

function DashboardBillingPanel({
  invoices = [],
  billingError,
  billingMessage,
  payingInvoiceId,
  onPayOnline,
  onPayAtHospital,
  onViewInvoices,
}) {
  const outstanding = invoices.filter((invoice) => invoice.status !== "PAID");
  const amountLabel = (amountPaise) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  }).format((amountPaise || 0) / 100);

  return (
    <section style={{ ...styles.section, border: "1px solid var(--db-blue-border)", background: "var(--db-surface-2)" }}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Appointment Billing</h2>
          <p style={styles.sectionSubtitle}>Pay confirmed appointment invoices online or at the hospital.</p>
        </div>

      </div>
      {billingError && <div role="alert" style={styles.error}>{billingError}</div>}
      {billingMessage && <div role="status" style={styles.success}>{billingMessage}</div>}
      {outstanding.length === 0 ? (
        <p style={{ color: "var(--db-muted)", margin: "14px 0 0" }}>
          {invoices.length ? "All appointment invoices are paid." : "Your invoice will appear here after a doctor confirms your appointment."}
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {outstanding.map((invoice) => (
            <div key={invoice.id} style={{ ...styles.billingCard, background: "var(--db-surface)", flexWrap: "wrap", gap: 14 }}>
              {isInvoiceExpired(invoice) && <div style={{ flexBasis: "100%", color: "var(--db-red-text)", fontSize: 13, fontWeight: 700 }}>PAYMENT EXPIRED · Please contact the hospital admin to renew your invoice.</div>}
              <div style={{ flex: "1 1 240px" }}>
                <strong>{invoice.invoiceNumber || `Invoice #${invoice.id}`}</strong>
                <div style={{ color: "var(--db-text)", fontSize: 13, marginTop: 5 }}>Appointment #{invoice.appointmentId} · Dr. {invoice.doctorName || "Doctor"}</div>
                <div style={{ color: "var(--db-amber-text)", fontSize: 12, fontWeight: 700, marginTop: 5 }}>
                  {isInvoiceExpired(invoice) ? "PAYMENT EXPIRED" : invoice.status === "PAY_AT_HOSPITAL" ? "PAY AT HOSPITAL · UNPAID" : "PAYMENT DUE"}
                </div>
              </div>
              <strong style={{ fontSize: 20, color: "var(--db-heading)" }}>{amountLabel(invoice.amountPaise)}</strong>
              {!isInvoiceExpired(invoice) && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" disabled={payingInvoiceId === invoice.id || invoice.paymentExpired} onClick={() => onPayOnline(invoice)} style={styles.primaryButton}>{payingInvoiceId === invoice.id ? "Opening…" : "Pay online"}</button>
                {invoice.status !== "PAY_AT_HOSPITAL" && <button type="button" disabled={payingInvoiceId === invoice.id || invoice.paymentExpired} onClick={() => onPayAtHospital(invoice)} style={styles.secondaryButton}>{payingInvoiceId === invoice.id ? "Saving…" : "Pay at hospital"}</button>}
              </div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


// =========================================================
// APPOINTMENTS SECTION
// =========================================================

function AppointmentsSection({
  recentAppointments,
  navigate,
  formatDate,
}) {

  return (

    <section
      style={
        styles.sectionPage
      }
    >

      <PageHeader
        title="📅 My Appointments"
        subtitle="Your appointments with doctors."
      />

      {recentAppointments.length ===
      0 ? (

        <EmptyState
          icon="📅"
          title="No appointments yet"
          message="Book an appointment with a doctor to get started."
          buttonText="Find a Doctor"
          onClick={() =>
            navigate(
              "/patient/find-doctors"
            )
          }
        />

      ) : (

        <div
          style={
            styles.appointmentList
          }
        >

          {recentAppointments.map(
            (appointment) => {

              const status =
                String(
                  appointment.status ||
                  "PENDING"
                ).toUpperCase();

              let statusStyle =
                styles.pending;

              if (
                status ===
                "CONFIRMED"
              ) {

                statusStyle =
                  styles.confirmed;

              }

              if (
                status === "CANCELLED" || status === "REJECTED"
              ) {

                statusStyle =
                  styles.cancelled;

              }

              return (

                <AppointmentCard
                  key={
                    appointment.id
                  }
                  appointment={
                    appointment
                  }
                  status={
                    status
                  }
                  statusStyle={
                    statusStyle
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

    </section>

  );

}


// =========================================================
// APPOINTMENT CARD
// =========================================================

function AppointmentCard({
  appointment,
  status,
  statusStyle,
  formatDate,
}) {
  const rejected = String(appointment.status || status).toUpperCase() === "REJECTED";

  return (

    <div
      style={{
        ...styles.appointmentCard,
        ...(rejected ? styles.rejectedAppointmentCard : {}),
      }}
    >

      <div
        style={
          styles.appointmentIcon
        }
      >
        👨‍⚕️
      </div>

      <div
        style={
          styles.appointmentInfo
        }
      >

        <strong
          style={
            styles.doctorName
          }
        >
          Dr.{" "}
          {appointment.doctorName ||
            "Doctor"}
        </strong>

        <span
          style={
            styles.doctorMeta
          }
        >

          {appointment.doctorSpecialization ||
            "Medical Doctor"}

          {appointment.hospitalName
            ? ` • ${appointment.hospitalName}`
            : ""}

        </span>

        <span
          style={
            styles.appointmentDate
          }
        >

          📅{" "}
          {formatDate(
            appointment.appointmentDate
          )}

          {" • "}

          🕐{" "}
          {appointment.appointmentTime ||
            "-"}

        </span>

        {appointment.problem && (

          <span
            style={
              styles.problemText
            }
          >
            Problem:{" "}
            {appointment.problem}
          </span>

        )}

      </div>

      <span
        style={{
          ...styles.status,
          ...statusStyle,
        }}
      >
        {status}
      </span>

      {rejected && (
        <div style={styles.rejectionMessage}>
          <strong>{appointment.rejectionReason ? "Doctor's message:" : "Appointment rejected"}</strong>
          {appointment.rejectionReason && <span> {appointment.rejectionReason}</span>}
          {appointment.suggestedRescheduleDate && (
            <div style={{ marginTop: 7 }}><strong>Suggested reschedule:</strong> {formatDate(appointment.suggestedRescheduleDate)}{appointment.suggestedRescheduleTime ? ` at ${appointment.suggestedRescheduleTime}` : ""}</div>
          )}
        </div>
      )}

    </div>

  );

}


// =========================================================
// PROFILE SECTION
// =========================================================

function ProfileSection({
  profile,
  editingProfile,
  profileForm,
  profileSaving,
  profileSuccess,
  onEdit,
  onCancel,
  onChange,
  onSave,
}) {

  return (

    <section
      style={
        styles.sectionPage
      }
    >

      <div
        style={
          styles.profilePageHeader
        }
      >

        <PageHeader
          title="👤 My Profile"
          subtitle={
            editingProfile
              ? "Update your registered personal details."
              : "Your registered personal details."
          }
        />

        {!editingProfile && (

          <button
            type="button"
            onClick={
              onEdit
            }
            style={
              styles.secondaryButton
            }
          >
            ✏️ Edit Profile
          </button>

        )}

      </div>


      {profileSuccess && (

        <div
          style={
            styles.profileSuccess
          }
        >
          ✅ {profileSuccess}
        </div>

      )}


      {editingProfile ? (

        <div
          style={
            styles.editProfileCard
          }
        >

          <div
            style={
              styles.editProfileHeader
            }
          >

            <div>

              <h2
                style={
                  styles.sectionTitle
                }
              >
                ✏️ Edit Profile
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Update your personal information below.
              </p>

            </div>

          </div>


          <div
            style={
              styles.profileFormGrid
            }
          >

            {/* NAME */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                Full Name
              </label>

              <input
                type="text"
                name="patientName"
                value={
                  profileForm.patientName
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
                placeholder="Enter your full name"
              />

            </div>


            {/* EMAIL */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  profileForm.email
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
                placeholder="Enter your email"
              />

            </div>


            {/* PHONE */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                value={
                  profileForm.phoneNumber
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
                placeholder="Enter your phone number"
              />

            </div>


            {/* GENDER */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                Gender
              </label>

              <select
                name="patientGender"
                value={
                  profileForm.patientGender
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
              >

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* AGE */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                Age
              </label>

              <input
                type="number"
                name="patientAge"
                value={
                  profileForm.patientAge
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
                placeholder="Enter your age"
                min="1"
                max="150"
              />

            </div>


            {/* PASSWORD */}

            <div
              style={
                styles.formGroup
              }
            >

              <label
                style={
                  styles.formLabel
                }
              >
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={
                  profileForm.password
                }
                onChange={
                  onChange
                }
                style={
                  styles.formInput
                }
                placeholder="Leave blank to keep current password"
              />

              <span
                style={
                  styles.formHint
                }
              >
                Leave this empty if you do not want to change your password.
              </span>

            </div>

          </div>


          <div
            style={
              styles.formActions
            }
          >

            <button
              type="button"
              onClick={
                onCancel
              }
              style={
                styles.cancelButton
              }
              disabled={
                profileSaving
              }
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                onSave
              }
              style={{
                ...styles.saveButton,

                ...(profileSaving
                  ? styles.saveButtonDisabled
                  : {}),
              }}
              disabled={
                profileSaving
              }
            >

              {profileSaving
                ? "⏳ Saving..."
                : "💾 Save Changes"}

            </button>

          </div>

        </div>

      ) : (

        <div
          style={
            styles.patientInfoCard
          }
        >

          <div
            style={
              styles.largeAvatar
            }
          >

            {profile.photo ? (

              <img
                src={
                  profile.photo
                }
                alt="Profile"
                style={
                  styles.avatarImage
                }
              />

            ) : (

              "👤"

            )}

          </div>

          <div
            style={
              styles.patientInfoGrid
            }
          >

            <InfoItem
              label="Full Name"
              value={
                profile.name
              }
            />

            <InfoItem
              label="Patient ID"
              value={
                profile.id
              }
            />

            <InfoItem
              label="Email"
              value={
                profile.email
              }
            />

            <InfoItem
              label="Phone Number"
              value={
                profile.phone
              }
            />

            <InfoItem
              label="Gender"
              value={
                profile.gender
              }
            />

            <InfoItem
              label="Age"
              value={
                profile.age
              }
            />

          </div>

        </div>

      )}

    </section>

  );

}


// =========================================================
// RECORDS SECTION
// =========================================================

function RecordsSection({
  title,
  subtitle,
  count,
  countLabel,
  loading,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  children,
}) {

  return (

    <section
      style={
        styles.sectionPage
      }
    >

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
            {title}
          </h2>

          <p
            style={
              styles.sectionSubtitle
            }
          >
            {subtitle}
          </p>

        </div>

        <div
          style={
            styles.recordCount
          }
        >
          {count} {countLabel}
        </div>

      </div>


      {loading ? (

        <LoadingSection />

      ) : count === 0 ? (

        <EmptyState
          icon={
            emptyIcon
          }
          title={
            emptyTitle
          }
          message={
            emptyMessage
          }
        />

      ) : (

        children

      )}

    </section>

  );

}


// =========================================================
// BILLING
// =========================================================

function BillingSection({
  appointments,
  confirmedCount,
}) {

  return (

    <section
      style={
        styles.sectionPage
      }
    >

      <PageHeader
        title="💳 Billing"
        subtitle="Appointment information."
      />

      <div
        style={
          styles.billingGrid
        }
      >

        <div
          style={
            styles.billingCard
          }
        >

          <div
            style={
              styles.billingIcon
            }
          >
            💳
          </div>

          <div>

            <span
              style={
                styles.billingLabel
              }
            >
              Total Appointments
            </span>

            <strong
              style={
                styles.billingValue
              }
            >
              {
                appointments.length
              }
            </strong>

          </div>

        </div>


        <div
          style={
            styles.billingCard
          }
        >

          <div
            style={
              styles.billingIcon
            }
          >
            ✓
          </div>

          <div>

            <span
              style={
                styles.billingLabel
              }
            >
              Confirmed Appointments
            </span>

            <strong
              style={
                styles.billingValue
              }
            >
              {
                confirmedCount
              }
            </strong>

          </div>

        </div>

      </div>

    </section>

  );

}


// =========================================================
// PAGE HEADER
// =========================================================

function downloadInvoiceReceipt(invoice, patientName) {
  const clean = (value) => String(value ?? "-")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .slice(0, 100);
  const amount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((invoice.amountPaise || 0) / 100);
  const lines = [
    `Invoice: ${invoice.invoiceNumber || `INV-${invoice.id}`}`,
    `Patient: ${patientName || invoice.patientName || "Patient"}`,
    `Appointment: #${invoice.appointmentId}`,
    `Doctor: Dr. ${invoice.doctorName || "Doctor"}`,
    `Specialization: ${invoice.specialization || "Consultation"}`,
    `Hospital: ${invoice.hospitalName || "-"}`,
    `Appointment date: ${invoice.appointmentDate || "-"} ${invoice.appointmentTime || ""}`,
    `Amount paid: INR ${amount}`,
    `Payment method: ${invoice.paymentMethod === "RAZORPAY" ? "Razorpay online" : invoice.paymentMethod || "-"}`,
    `Paid at: ${invoice.paidAt || "-"}`,
    `Razorpay payment ID: ${invoice.razorpayPaymentId || "-"}`,
    `Razorpay order ID: ${invoice.razorpayOrderId || "-"}`,
    "Status: PAID",
  ];
  const content = [
    "BT",
    "/F1 20 Tf",
    "1 0 0 1 50 755 Tm (MediCore - Payment Receipt) Tj",
    "/F1 11 Tf",
    ...lines.map((line, index) => `1 0 0 1 50 ${710 - index * 30} Tm (${clean(line)}) Tj`),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(invoice.invoiceNumber || `invoice-${invoice.id}`).replace(/[^a-zA-Z0-9_-]/g, "_")}-receipt.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function InvoiceBillingSection({
  patientName,
  confirmedCount,
  invoices,
  loading,
  error,
  message,
  payingInvoiceId,
  onPayOnline,
  onPayAtHospital,
}) {
  const formatAmount = (amountPaise) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((amountPaise || 0) / 100);
  const totalBilled = invoices.reduce((sum, invoice) => sum + (invoice.amountPaise || 0), 0);
  const outstandingBalance = invoices
    .filter((invoice) => invoice.status !== "PAID")
    .reduce((sum, invoice) => sum + (invoice.amountPaise || 0), 0);

  return (
    <section style={styles.sectionPage}>
      <PageHeader title="Billing & Invoices" subtitle="View your appointment bills and choose how to pay." />
      <div role="note" style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "var(--db-blue-bg)", color: "var(--db-blue-text)", fontSize: 13 }}>
        Razorpay test mode: choose UPI in checkout and use <strong>success@razorpay</strong> to simulate a successful payment or <strong>failure@razorpay</strong> to test a failed payment. Live UPI app redirects and QR scanning require live mode.
      </div>
      <div style={{ ...styles.billingGrid, marginTop: 18 }}>
        <div style={styles.billingCard}><div style={styles.billingIcon}>₹</div><div><span style={styles.billingLabel}>Outstanding balance</span><strong style={styles.billingValue}>{formatAmount(outstandingBalance)}</strong></div></div>
        <div style={styles.billingCard}><div style={styles.billingIcon}>▤</div><div><span style={styles.billingLabel}>Total billed</span><strong style={styles.billingValue}>{formatAmount(totalBilled)}</strong></div></div>
        <div style={styles.billingCard}><div style={styles.billingIcon}>▣</div><div><span style={styles.billingLabel}>Invoices</span><strong style={styles.billingValue}>{invoices.length}</strong></div></div>
      </div>
      {error && <div role="alert" style={{ ...styles.error, marginTop: 18 }}>{error}</div>}
      {message && <div role="status" style={{ ...styles.success, marginTop: 18 }}>{message}</div>}
      {loading ? <p style={{ color: "var(--db-muted)", marginTop: 22 }}>Loading your invoices…</p> : invoices.length === 0 ? (
        <div style={{ ...styles.billingCard, marginTop: 20, display: "block" }}>
          <strong>No appointment invoices yet</strong>
          <p style={{ color: "var(--db-muted)", marginBottom: 0 }}>{confirmedCount > 0 ? "You have a confirmed appointment, but an invoice could not be created yet. Please ask the hospital to add a consultation fee for your doctor." : "Once your doctor confirms an appointment, its consultation invoice will appear here."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
          {invoices.map((invoice) => {
            const paid = invoice.status === "PAID";
            const payingAtHospital = invoice.status === "PAY_AT_HOSPITAL";
            const expired = isInvoiceExpired(invoice);
            return (
              <article key={invoice.id} style={{ ...styles.billingCard, display: "block", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div>
                    <strong style={{ color: "var(--db-heading)", fontSize: 16 }}>{invoice.invoiceNumber || `Invoice #${invoice.id}`}</strong>
                    <p style={{ margin: "7px 0", color: "var(--db-text)" }}>Appointment #{invoice.appointmentId} · Dr. {invoice.doctorName || "Doctor"}</p>
                    <p style={{ margin: 0, color: "var(--db-muted)", fontSize: 13 }}>{invoice.specialization || "Consultation"}{invoice.hospitalName ? ` · ${invoice.hospitalName}` : ""}</p>
                    <p style={{ margin: "7px 0 0", color: "var(--db-muted)", fontSize: 13 }}>{invoice.appointmentDate || "Date pending"}{invoice.appointmentTime ? ` at ${invoice.appointmentTime}` : ""}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ display: "block", fontSize: 21, color: "var(--db-heading)" }}>{formatAmount(invoice.amountPaise)}</strong>
                    <span style={{ color: paid ? "#15803d" : expired ? "#b91c1c" : payingAtHospital ? "#b45309" : "#b91c1c", fontSize: 13, fontWeight: 700 }}>
                      {paid ? "PAID" : expired ? "PAYMENT EXPIRED" : payingAtHospital ? "PAY AT HOSPITAL · UNPAID" : "PAYMENT DUE"}
                    </span>
                  </div>
                </div>
                {expired && !paid && <p style={{ margin: "12px 0 0", color: "var(--db-red-text)", fontSize: 13, fontWeight: 600 }}>Payment expired 24 hours after invoice generation. Please contact the hospital admin to renew your invoice.</p>}
                {!paid && !expired && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                  <button type="button" disabled={payingInvoiceId === invoice.id} onClick={() => onPayOnline(invoice)} style={styles.primaryButton}>{payingInvoiceId === invoice.id ? "Opening checkout…" : "Pay online with Razorpay"}</button>
                  {!payingAtHospital && <button type="button" disabled={payingInvoiceId === invoice.id} onClick={() => onPayAtHospital(invoice)} style={styles.secondaryButton}>{payingInvoiceId === invoice.id ? "Saving…" : "Pay at hospital"}</button>}
                </div>}
                {paid && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
                  <button type="button" onClick={() => downloadInvoiceReceipt(invoice, patientName)} style={styles.secondaryButton}>Download receipt (PDF)</button>
                </div>}
                {payingAtHospital && !paid && !expired && <p style={{ margin: "12px 0 0", color: "var(--db-amber-text)", fontSize: 13 }}>Please pay this invoice at the hospital before your appointment.</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PageHeader({
  title,
  subtitle,
}) {

  return (

    <div
      style={
        styles.pageHeader
      }
    >

      <div>

        <h1
          style={
            styles.pageTitle
          }
        >
          {title}
        </h1>

        <p
          style={
            styles.pageSubtitle
          }
        >
          {subtitle}
        </p>

      </div>

    </div>

  );

}


// =========================================================
// NAV BUTTON
// =========================================================

function NavButton({
  icon,
  label,
  active,
  badge,
  onClick,
}) {

  return (

    <button
      type="button"
      style={{
        ...styles.navItem,

        ...(active
          ? styles.activeNavItem
          : {}),
      }}
      onClick={
        onClick
      }
    >

      <span
        style={
          styles.navIcon
        }
      >
        {icon}
      </span>

      <span>
        {label}
      </span>

      {badge && (

        <span
          style={
            styles.navBadge
          }
        >
          {badge}
        </span>

      )}

    </button>

  );

}


// =========================================================
// PATIENT HEALTH CHECKUP SECTION
// =========================================================
function PatientHealthCheckupsSection({ patient, profile }) {
  const packages = [
    { name: "Basic Health Checkup", price: 999, homeVisitAvailable: true },
    { name: "Full Body Checkup", price: 2499, homeVisitAvailable: true },
    { name: "Heart Health Checkup", price: 1799, homeVisitAvailable: false },
    { name: "Diabetes Screening", price: 799, homeVisitAvailable: false },
  ];
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const [form, setForm] = useState({ visitType: "HOSPITAL", visitDate: "", visitTime: "", homeAddress: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [checkupHistory, setCheckupHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [openingReportId, setOpeningReportId] = useState(null);

  const selectedPackage = packages.find((item) => item.name === selectedPackageName) || null;
  const patientId = patient?.id ?? patient?.patientId ?? sessionStorage.getItem("patientId") ?? sessionStorage.getItem("patientID") ?? "";
  const patientName = profile?.name || patient?.patientName || patient?.name || patient?.fullName || sessionStorage.getItem("patientName") || sessionStorage.getItem("name") || "";
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const fieldStyle = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: "1px solid var(--db-border-strong)", borderRadius: 8, fontSize: 14, background: "var(--db-surface)", color: "var(--db-heading)" };
  const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "var(--db-text)" };
  const buttonStyle = { border: 0, borderRadius: 8, padding: "10px 15px", background: "#0f766e", color: "#fff", fontWeight: 700, cursor: "pointer" };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const loadHistory = async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    setHistoryError("");
    try {
      // This endpoint uses the authenticated patient's login token.
      const response = await api.get("/health-checkups/patient/my");
      const data = response.data;
      const records = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : Array.isArray(data?.data) ? data.data : [];
      setCheckupHistory(records);
    } catch (err) {
      console.error("Unable to load health checkup history:", err);
      setHistoryError(err.response?.data?.message || (err.response?.status === 404
        ? "History API not found. Confirm GET /api/health-checkups/patient/my in HealthCheckupController."
        : "Unable to load your booked health checkups. Please try again."));
    } finally {
      setHistoryLoading(false);
    }
  };

  const viewHealthCheckupReport = async (record) => {
    const id = record.id ?? record.checkupId;

    if (!id) {
      alert("Health checkup ID is missing.");
      return;
    }

    // Open a blank tab immediately to avoid popup blockers.
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Please allow pop-ups to view the report.");
      return;
    }

    try {
      setOpeningReportId(id);

      const blob = await getHealthCheckupReport(id);

      // Detect missing reports returned as JSON or text errors.
      if (blob.type.includes("application/json") ||
          blob.type.startsWith("text/")) {
        const message = await blob.text();
        throw new Error(message || "Unable to retrieve the report.");
      }

      const fileUrl = URL.createObjectURL(blob);

      reportWindow.location.href = fileUrl;

      // Release the object URL after the report has had time to load.
      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (error) {
      reportWindow.close();

      console.error("Failed to open health checkup report:", error);

      alert(
        error.response?.status === 404
          ? "Report not found. It may not have been uploaded or the file is missing."
          : error.response?.status === 401
          ? "Please log in again to view the report."
          : error.response?.status === 403
          ? "You are not authorized to view this report."
          : error.message || "Unable to open the report."
      );
    } finally {
      setOpeningReportId(null);
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    if (!patientName.trim()) {
      setError("Patient name is missing. Please check your patient profile and log in again.");
      return;
    }
    if (!selectedPackage || !form.visitDate || !form.visitTime) {
      setError("Please choose a plan, visit date, and visit time.");
      return;
    }
    if (form.visitDate < minDate) {
      setError("Visit date cannot be in the past.");
      return;
    }
    if (form.visitType === "HOME" && !form.homeAddress.trim()) {
      setError("Please enter the full home address for a home visit.");
      return;
    }
    if (form.visitType === "HOME" && !selectedPackage.homeVisitAvailable) {
      setError("Home visit is not available for this health checkup. Please choose Hospital Visit.");
      return;
    }
    const payload = {
      patientId: patientId ? Number(patientId) : undefined,
      patientName: patientName.trim(),
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price,
      visitType: form.visitType,
      visitDate: form.visitDate,
      visitTime: form.visitTime,
      homeAddress: form.visitType === "HOME" ? form.homeAddress.trim() : null,
      status: "BOOKED",
    };
    try {
      setSubmitting(true);
      await api.post("/health-checkups", payload);
      setSuccess("Your health checkup has been booked successfully.");
      setSelectedPackageName("");
      setForm({ visitType: "HOSPITAL", visitDate: "", visitTime: "", homeAddress: "" });
      if (showHistory) await loadHistory();
    } catch (err) {
      console.error("Health checkup booking failed:", err);
      setError(err.response?.data?.message || (err.response?.status === 404
        ? "Booking API not found. Confirm POST /api/health-checkups in HealthCheckupController."
        : "Unable to book this health checkup. Please check the backend API and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ width: "100%", color: "var(--db-heading)" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Health Checkup</h1>
        <p style={{ margin: 0, color: "var(--db-muted)", lineHeight: 1.6 }}>Select a health checkup plan, complete the booking form, or view all your booked plans and lab reports.</p>
      </div>

      {success && <div role="status" style={{ marginBottom: 16, padding: 13, borderRadius: 9, border: "1px solid #86efac", background: "var(--db-green-bg)", color: "var(--db-green-text)" }}>✓ {success}</div>}
      {error && <div role="alert" style={{ marginBottom: 16, padding: 13, borderRadius: 9, border: "1px solid var(--db-red-border)", background: "var(--db-red-bg)", color: "var(--db-red-text)" }}>{error}</div>}

      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap", padding: 20, border: "1px solid #e2e8f0", borderRadius: 12, background: "var(--db-surface)" }}>
        <div style={{ flex: "1 1 280px" }}>
          <label htmlFor="healthCheckupPlan" style={labelStyle}>Choose Health Checkup Plan *</label>
          <select id="healthCheckupPlan" value={selectedPackageName} onChange={(event) => { const nextPackage = packages.find((item) => item.name === event.target.value); setSelectedPackageName(event.target.value); setForm((previous) => ({ ...previous, visitType: nextPackage?.homeVisitAvailable ? previous.visitType : "HOSPITAL", homeAddress: nextPackage?.homeVisitAvailable ? previous.homeAddress : "" })); setError(""); setSuccess(""); }} style={fieldStyle}>
            <option value="">-- Select a health checkup plan --</option>
            {packages.map((item) => <option key={item.name} value={item.name}>{item.name} — ₹{item.price.toLocaleString("en-IN")} ({item.homeVisitAvailable ? "Home or hospital visit" : "Hospital visit only"})</option>)}
          </select>
          {selectedPackage && <p style={{ margin: "8px 0 0", color: "var(--th-teal)", fontSize: 13, fontWeight: 700 }}>Selected plan price: ₹{selectedPackage.price.toLocaleString("en-IN")}</p>}
        </div>
        <button type="button" onClick={loadHistory} style={buttonStyle}>Booking History</button>
      </div>

      {selectedPackage && (
        <form onSubmit={submitBooking} style={{ marginTop: 20, padding: 22, border: "1px solid var(--db-border-strong)", borderRadius: 14, background: "var(--db-surface)" }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ margin: "0 0 5px", fontSize: 21 }}>Book Health Checkup</h2>
            <p style={{ margin: 0, color: "var(--db-muted)", fontSize: 14 }}>Fill in the details below and submit your booking.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
            <div><label style={labelStyle} htmlFor="checkupPatientId">Patient ID</label><input id="checkupPatientId" style={{ ...fieldStyle, background: "var(--db-surface-2)" }} value={patientId} readOnly /></div>
            <div><label style={labelStyle} htmlFor="checkupPatientName">Patient Name</label><input id="checkupPatientName" style={{ ...fieldStyle, background: "var(--db-surface-2)" }} value={patientName} readOnly /></div>
            <div><label style={labelStyle} htmlFor="checkupPackageName">Selected Plan</label><input id="checkupPackageName" style={{ ...fieldStyle, background: "var(--db-surface-2)" }} value={selectedPackage.name} readOnly /></div>
            <div><label style={labelStyle} htmlFor="checkupPackagePrice">Plan Price (₹)</label><input id="checkupPackagePrice" style={{ ...fieldStyle, background: "var(--db-surface-2)" }} value={selectedPackage.price} readOnly /></div>
            <div><label style={labelStyle} htmlFor="checkupVisitType">Visit Type *</label><select id="checkupVisitType" name="visitType" value={form.visitType} onChange={updateForm} required disabled={!selectedPackage.homeVisitAvailable} style={{ ...fieldStyle, ...(!selectedPackage.homeVisitAvailable ? { background: "var(--db-surface-2)", color: "var(--db-text)" } : {}) }}><option value="HOSPITAL">Hospital visit</option>{selectedPackage.homeVisitAvailable && <option value="HOME">Home visit</option>}</select>{!selectedPackage.homeVisitAvailable && <small style={{ display: "block", marginTop: 5, color: "var(--db-muted)" }}>This checkup is available at the hospital only.</small>}</div>
            <div><label style={labelStyle} htmlFor="checkupVisitDate">Visit Date *</label><input id="checkupVisitDate" type="date" name="visitDate" min={minDate} value={form.visitDate} onChange={updateForm} required style={fieldStyle} /></div>
            <div><label style={labelStyle} htmlFor="checkupVisitTime">Visit Time *</label><input id="checkupVisitTime" type="time" name="visitTime" value={form.visitTime} onChange={updateForm} required style={fieldStyle} /></div>
            {form.visitType === "HOME" && <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle} htmlFor="checkupHomeAddress">Home Address *</label><textarea id="checkupHomeAddress" name="homeAddress" rows={3} maxLength={1000} value={form.homeAddress} onChange={updateForm} required placeholder="House/flat, street, area, city, PIN code" style={{ ...fieldStyle, resize: "vertical" }} /></div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <button type="button" onClick={() => { setSelectedPackageName(""); setError(""); }} disabled={submitting} style={{ border: "1px solid var(--db-border-strong)", borderRadius: 8, padding: "11px 16px", background: "var(--db-surface)", color: "var(--db-text)", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ ...buttonStyle, padding: "11px 18px", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>{submitting ? "Submitting..." : "Submit Health Checkup"}</button>
          </div>
        </form>
      )}

      {showHistory && (
        <section aria-live="polite" style={{ marginTop: 22, padding: 20, border: "1px solid var(--db-border-strong)", borderRadius: 14, background: "var(--db-surface-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div><h2 style={{ margin: "0 0 5px", fontSize: 20 }}>All Booked Health Checkups</h2><p style={{ margin: 0, color: "var(--db-muted)", fontSize: 13 }}>Your booking status and any reports uploaded by the lab appear here.</p></div>
            <button type="button" onClick={() => setShowHistory(false)} style={{ border: "1px solid var(--db-border-strong)", borderRadius: 8, padding: "8px 12px", background: "var(--db-surface)", color: "var(--db-text)", fontWeight: 700, cursor: "pointer" }}>Close history</button>
          </div>
          {historyLoading && <p style={{ color: "var(--db-muted)" }}>Loading booking history...</p>}
          {historyError && <div role="alert" style={{ marginBottom: 12, padding: 12, borderRadius: 8, background: "var(--db-red-bg)", color: "var(--db-red-text)", border: "1px solid var(--db-red-border)" }}>{historyError}</div>}
          {!historyLoading && !historyError && checkupHistory.length === 0 && <p style={{ margin: 0, padding: 14, background: "var(--db-surface)", borderRadius: 8, color: "var(--db-muted)" }}>You have no booked health checkups yet.</p>}
          {!historyLoading && checkupHistory.length > 0 && <div style={{ display: "grid", gap: 12 }}>
            {checkupHistory.map((record, index) => {
              const status = String(record.status || "BOOKED").toUpperCase();
              const hasReport = Boolean(record.reportFileName || record.reportPath || record.reportUrl || record.reportDownloadUrl);
              return <article key={record.id ?? record.checkupId ?? `${record.visitDate || "booking"}-${index}`} style={{ padding: 15, background: "var(--db-surface)", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <strong>{record.packageName || "Health Checkup"} · Booking #{record.id ?? record.checkupId ?? index + 1}</strong>
                  <span style={{ display: "inline-block", borderRadius: 999, padding: "5px 10px", background: status === "DONE" || status === "COMPLETED" ? "#dcfce7" : status === "CANCELLED" ? "#fee2e2" : "#dbeafe", color: status === "DONE" || status === "COMPLETED" ? "#166534" : status === "CANCELLED" ? "#991b1b" : "#1d4ed8", fontSize: 12, fontWeight: 800 }}>{status.replaceAll("_", " ")}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 10, fontSize: 13, color: "var(--db-text)" }}>
                  <div><strong>Visit date</strong><br />{record.visitDate || "—"}</div><div><strong>Visit time</strong><br />{record.visitTime || "—"}</div><div><strong>Visit type</strong><br />{record.visitType || "—"}</div><div><strong>Plan price</strong><br />₹{Number(record.packagePrice ?? 0).toLocaleString("en-IN")}</div><div><strong>Booked on</strong><br />{record.createdAt ? String(record.createdAt).replace("T", " ") : "—"}</div><div><strong>Completed on</strong><br />{record.completedAt ? String(record.completedAt).replace("T", " ") : "—"}</div>
                </div>

                {hasReport ? <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><p style={{ margin: 0, fontSize: 13, color: "var(--db-text)" }}><strong>Lab Report:</strong> </p><button type="button" disabled={openingReportId === (record.id ?? record.checkupId)} onClick={() => viewHealthCheckupReport(record)} style={{ ...buttonStyle, padding: "8px 13px", fontSize: 13, opacity: openingReportId === (record.id ?? record.checkupId) ? 0.7 : 1 }}>{openingReportId === (record.id ?? record.checkupId) ? "Opening..." : "View report"}</button></div> : <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--db-muted)" }}>Lab report has not been uploaded yet.</p>}


              </article>;
            })}
          </div>}

        </section>
      )}
      <p style={{ marginTop: 16, color: "var(--db-muted)", fontSize: 12, lineHeight: 1.5 }}>Package prices shown here are sample values; update them to match your hospital's approved prices.</p>
    </section>
  );
}

// =========================================================
// QUICK ACTION
// =========================================================

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={
        onClick
      }
      style={
        styles.quickAction
      }
    >

      <div
        style={
          styles.quickActionIcon
        }
      >
        {icon}
      </div>

      <div
        style={
          styles.quickActionContent
        }
      >

        <strong
          style={
            styles.quickActionTitle
          }
        >
          {title}
        </strong>

        <span
          style={
            styles.quickActionDescription
          }
        >
          {description}
        </span>

      </div>

      <span
        style={
          styles.quickActionArrow
        }
      >
        →
      </span>

    </button>

  );

}


// =========================================================
// INFO ITEM
// =========================================================

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


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  label,
  value,
  iconStyle,
}) {

  const iconStyles = {

    blue:
      styles.statIconBlue,

    yellow:
      styles.statIconYellow,

    green:
      styles.statIconGreen,

    red:
      styles.statIconRed,

  };

  return (

    <div
      style={
        styles.statCard
      }
    >

      <div
        style={
          iconStyles[
            iconStyle
          ]
        }
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
            styles.statValue
          }
        >
          {value}
        </strong>

      </div>

    </div>

  );

}


// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({
  icon,
  title,
  message,
  buttonText,
  onClick,
}) {

  return (

    <div
      style={
        styles.empty
      }
    >

      <div
        style={
          styles.emptyIcon
        }
      >
        {icon}
      </div>

      <h3
        style={
          styles.emptyTitle
        }
      >
        {title}
      </h3>

      <p
        style={
          styles.emptyMessage
        }
      >
        {message}
      </p>

      {buttonText &&
        onClick && (

        <button
          type="button"
          onClick={
            onClick
          }
          style={
            styles.primaryButton
          }
        >
          {buttonText}
        </button>

      )}

    </div>

  );

}


// =========================================================
// LOADING SECTION
// =========================================================

function LoadingSection() {

  return (

    <div
      style={
        styles.sectionLoading
      }
    >

      <div
        style={
          styles.sectionLoadingIcon
        }
      >
        🩺
      </div>

      <strong>
        Loading patient data...
      </strong>

      <span>
        Please wait while we retrieve the records.
      </span>

    </div>

  );

}


// =========================================================
// LAB TESTS + LAB REPORTS SECTION
// =========================================================

function LabMedicalRecordsSection({
  labTests,
  labReports,
  loading,
  formatDateTime,
  patientId,
  token,
  onRefresh,
}) {

  const [
    openingId,
    setOpeningId,
  ] = useState(null);


  const openLabReport =
    async (report) => {

      if (
        !report?.id ||
        !token
      ) {

        return;

      }

      try {

        setOpeningId(
          report.id
        );

        const response =
          await api.get(
            `/patient-records/reports/${report.id}/file`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              responseType:
                "blob",
            }
          );

        const url =
          URL.createObjectURL(
            response.data
          );

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

        setTimeout(() => {

          URL.revokeObjectURL(
            url
          );

        }, 30000);

      } catch (e) {

        console.error(
          "Unable to open lab report:",
          e
        );

      } finally {

        setOpeningId(
          null
        );

      }

    };


  return (

    <section
      style={
        styles.sectionPage
      }
    >

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
            🧪 Lab Tests & Reports
          </h2>

          <p
            style={
              styles.sectionSubtitle
            }
          >
            View laboratory tests suggested by your doctor and reports uploaded by the lab.
          </p>

        </div>

        <button
          type="button"
          onClick={
            onRefresh
          }
          style={
            styles.secondaryButton
          }
          disabled={
            loading
          }
        >
          🔄 Refresh
        </button>

      </div>


      <div
        style={
          styles.card
        }
      >

        <h3
          style={
            styles.cardHeading
          }
        >
          Suggested Lab Tests
        </h3>

        {loading ? (

          <LoadingSection />

        ) : labTests.length === 0 ? (

          <EmptyState
            icon="🧪"
            title="No lab tests"
            message="Doctor-suggested laboratory tests will appear here."
          />

        ) : (

          <div
            style={
              styles.tableWrapper
            }
          >

            <table
              style={
                styles.table
              }
            >

              <thead>

                <tr>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Test
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Instructions
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Status
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Suggested
                  </th>

                </tr>

              </thead>

              <tbody>

                {labTests.map(
                  (test) => (

                    <tr
                      key={
                        test.id
                      }
                      style={
                        styles.tableRow
                      }
                    >

                      <td
                        style={
                          styles.tableCell
                        }
                      >
                        <strong>
                          {
                            test.testName ||
                            "-"
                          }
                        </strong>
                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >
                        {
                          test.instructions ||
                          "-"
                        }
                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        <span
                          style={
                            styles.testStatus
                          }
                        >
                          {
                            test.status ||
                            "-"
                          }
                        </span>

                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >
                        {
                          formatDateTime(
                            test.suggestedAt
                          )
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      <div
        style={
          styles.card
        }
      >

        <h3
          style={
            styles.cardHeading
          }
        >
          Uploaded Lab Reports
        </h3>

        {loading ? (

          <LoadingSection />

        ) : labReports.length === 0 ? (

          <EmptyState
            icon="📄"
            title="No lab reports"
            message="Completed laboratory reports will appear here."
          />

        ) : (

          <div
            style={
              styles.tableWrapper
            }
          >

            <table
              style={
                styles.table
              }
            >

              <thead>

                <tr>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Report
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Uploaded
                  </th>

                  <th
                    style={
                      styles.tableHeader
                    }
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {labReports.map(
                  (report) => (

                    <tr
                      key={
                        report.id
                      }
                      style={
                        styles.tableRow
                      }
                    >

                      <td
                        style={
                          styles.tableCell
                        }
                      >
                        <strong>
                          {
                            report.reportName ||
                            report.fileName ||
                            "Lab Report"
                          }
                        </strong>
                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >
                        {
                          formatDateTime(
                            report.uploadedAt
                          )
                        }
                      </td>

                      <td
                        style={
                          styles.tableCell
                        }
                      >

                        <button
                          type="button"
                          style={
                            styles.viewButton
                          }
                          onClick={() =>
                            openLabReport(
                              report
                            )
                          }
                          disabled={
                            openingId ===
                            report.id
                          }
                        >
                          {
                            openingId ===
                            report.id
                              ? "Opening..."
                              : "👁 View"
                          }
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>

  );

}


// =========================================================
// STYLES
// =========================================================

// =========================================================
// PATIENT DASHBOARD: FIND DOCTORS + INLINE BOOKING
// =========================================================
function PatientDoctorsSection({
  doctors,
  loading,
  error,
  search,
  setSearch,
  selectedDoctor,
  bookingForm,
  setBookingForm,
  bookingSaving,
  bookingMessage,
  bookingError,
  onSelectDoctor,
  onCloseBooking,
  onSubmitBooking,
  onRetry,
}) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [doctorAvailable, setDoctorAvailable] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState(null);
  useEffect(() => {
    if (!selectedDoctor?.id || !bookingForm.appointmentDate) { setBookedSlots([]); setDoctorAvailable(null); setDoctorAvailability(null); return; }
    let active = true;
    setDoctorAvailable(null);
    setDoctorAvailability(null);
    Promise.all([
      api.get(`/appointments/patient/doctor/${selectedDoctor.id}/booked-slots`, { params: { date: bookingForm.appointmentDate } }),
      api.get(`/appointments/patient/doctor/${selectedDoctor.id}/availability`, { params: { date: bookingForm.appointmentDate } }),
    ])
      .then(([slots, availability]) => {
        if (!active) return;
        setBookedSlots(Array.isArray(slots.data) ? slots.data : []);
        setDoctorAvailable(availability.data?.active !== false);
        setDoctorAvailability(availability.data || { active: true });
      })
      .catch(() => { if (active) { setBookedSlots([]); setDoctorAvailable(true); setDoctorAvailability({ active: true }); } });
    return () => { active = false; };
  }, [selectedDoctor?.id, bookingForm.appointmentDate]);
  const availableAppointmentSlots = getAvailableAppointmentSlots(
    doctorAvailability,
    selectedDoctor?.availableTimings,
    bookedSlots,
  );
  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [
      doctor.fullName,
      doctor.name,
      doctor.specialization,
      doctor.qualification,
      doctor.hospitalName,
      doctor.city,
      doctor.languagesKnown,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid var(--db-border-strong)",
    borderRadius: 8,
    fontSize: 14,
    background: "var(--db-surface)",
  };
  const primaryButton = {
    border: 0,
    borderRadius: 8,
    padding: "11px 16px",
    background: "#0f766e",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };
  const mutedText = { color: "var(--db-muted)", fontSize: 13, lineHeight: 1.5 };

  return (
    <section style={{ width: "100%", color: "var(--db-heading)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Find Doctors</h1>
          <p style={{ margin: 0, color: "var(--db-muted)" }}>Browse available doctors and book your appointment without leaving your dashboard.</p>
        </div>
        <span style={{ borderRadius: 999, padding: "7px 12px", background: "var(--db-green-bg)", color: "var(--db-green-text)", fontWeight: 700, fontSize: 13 }}>
          {doctors.length} approved doctor{doctors.length === 1 ? "" : "s"}
        </span>
      </div>

      {bookingMessage && (
        <div role="status" style={{ marginBottom: 16, padding: 13, borderRadius: 9, background: "var(--db-green-bg)", color: "var(--db-green-text)", border: "1px solid var(--db-green-border)" }}>
          ✓ {bookingMessage}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          aria-label="Search doctors"
          type="search"
          placeholder="Search by doctor name, specialization, hospital, or city..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ ...fieldStyle, maxWidth: 620, padding: "13px 15px" }}
        />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 12, background: "var(--db-surface)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🩺</div>
          <strong>Loading available doctors...</strong>
        </div>
      ) : error ? (
        <div style={{ padding: 22, border: "1px solid var(--db-red-border)", borderRadius: 12, background: "var(--db-red-bg)", color: "var(--db-red-text)" }}>
          <p style={{ marginTop: 0 }}>{error}</p>
          <button type="button" onClick={onRetry} style={{ ...primaryButton, background: "#b91c1c" }}>Try again</button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ padding: 35, textAlign: "center", border: "1px dashed var(--db-border-strong)", borderRadius: 12, background: "var(--db-surface)" }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>🔎</div>
          <h3 style={{ margin: "0 0 8px" }}>{doctors.length ? "No matching doctors" : "No approved doctors available"}</h3>
          <p style={{ ...mutedText, margin: 0 }}>{doctors.length ? "Try another name, specialty, hospital, or city." : "Approved doctors will appear here when they are available."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 285px), 1fr))", gap: 16 }}>
          {filteredDoctors.map((doctor) => {
            const name = doctor.fullName || doctor.name || "Doctor";
            const fee = doctor.consultationFee;
            return (
              <article key={doctor.id || doctor.doctorId || name} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, background: "var(--db-surface)", boxShadow: "0 4px 14px rgba(15,23,42,0.04)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                  <div style={{ width: 54, height: 54, flexShrink: 0, borderRadius: "50%", background: "var(--db-cyan-bg)", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700, color: "var(--th-teal)", overflow: "hidden", position: "relative" }}>
                    {name.charAt(0).toUpperCase()}
                    {doctor.profilePhoto && (doctor.id || doctor.doctorId) && (
                      <img
                        src={`${api.defaults.baseURL}/doctors/${doctor.id || doctor.doctorId}/profile-photo`}
                        alt={`${name} profile`}
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 17 }}>{name}</h3>
                    <div style={{ color: "var(--th-teal)", fontWeight: 700, fontSize: 14 }}>{doctor.specialization || "General Physician"}</div>
                  </div>
                </div>
                {doctor.qualification && <div style={mutedText}>🎓 {doctor.qualification}</div>}
                {doctor.experienceYears != null && <div style={mutedText}>💼 {doctor.experienceYears} year{Number(doctor.experienceYears) === 1 ? "" : "s"} of experience</div>}
                {(doctor.hospitalName || doctor.city) && <div style={mutedText}>🏥 {[doctor.hospitalName, doctor.city].filter(Boolean).join(" · ")}</div>}
                {doctor.availableTimings && <div style={mutedText}>🕒 {Array.isArray(doctor.availableTimings) ? doctor.availableTimings.join(", ") : doctor.availableTimings}</div>}
                {doctor.languagesKnown && <div style={mutedText}>🌐 {Array.isArray(doctor.languagesKnown) ? doctor.languagesKnown.join(", ") : doctor.languagesKnown}</div>}
                <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <strong style={{ color: "var(--db-heading)", fontSize: 16 }}>{fee != null && fee !== "" ? `₹${fee}` : "Fee not listed"}</strong>
                  <button type="button" onClick={() => onSelectDoctor(doctor)} style={primaryButton}>Book appointment</button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedDoctor && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !bookingSaving) onCloseBooking(); }} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(15,23,42,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
          <section role="dialog" aria-modal="true" aria-labelledby="dashboard-booking-title" style={{ width: "100%", maxWidth: 520, maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: "var(--db-surface)", borderRadius: 16, padding: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <h2 id="dashboard-booking-title" style={{ margin: "0 0 6px", fontSize: 22 }}>Book an Appointment</h2>
                <p style={{ margin: 0, color: "var(--db-muted)", fontSize: 14 }}>{selectedDoctor.fullName || selectedDoctor.name || "Doctor"} · {selectedDoctor.specialization || "General Physician"}</p>
              </div>
              <button type="button" onClick={onCloseBooking} disabled={bookingSaving} aria-label="Close booking form" style={{ border: 0, background: "var(--db-surface-2)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            {bookingError && <div role="alert" style={{ marginBottom: 14, padding: 11, borderRadius: 8, background: "var(--db-red-bg)", color: "var(--db-red-text)", fontSize: 14 }}>{bookingError}</div>}

            <form onSubmit={onSubmitBooking} style={{ display: "grid", gap: 14 }}>
              <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
                Reason for appointment <span style={{ color: "var(--db-red-text)" }}>*</span>
                <textarea required rows={3} maxLength={1000} placeholder="Describe your symptoms or reason for consultation" value={bookingForm.problem} onChange={(event) => setBookingForm((previous) => ({ ...previous, problem: event.target.value }))} style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }} />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
                Appointment date <span style={{ color: "var(--db-red-text)" }}>*</span>
                <input required type="date" min={new Date().toISOString().slice(0, 10)} max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)} value={bookingForm.appointmentDate} onChange={(event) => setBookingForm((previous) => ({ ...previous, appointmentDate: event.target.value, appointmentTime: "" }))} style={fieldStyle} />
              </label>
              {bookingForm.appointmentDate && doctorAvailable === false && <p role="alert" style={{ margin: 0, padding: 11, borderRadius: 8, background: "var(--db-red-bg)", color: "var(--db-red-text)", fontSize: 14 }}>The doctor is unavailable on this day. Please choose another date.</p>}
              <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
                Appointment time <span style={{ color: "var(--db-red-text)" }}>*</span>
                <select required disabled={doctorAvailable !== true} value={bookingForm.appointmentTime} onChange={(event) => setBookingForm((previous) => ({ ...previous, appointmentTime: event.target.value }))} style={fieldStyle}>
                  <option value="">Select a time within the doctor's available hours</option>
                  {availableAppointmentSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={onCloseBooking} disabled={bookingSaving} style={{ border: "1px solid var(--db-border-strong)", borderRadius: 8, padding: "11px 15px", background: "var(--db-surface)", color: "var(--db-text)", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={bookingSaving} style={{ ...primaryButton, opacity: bookingSaving ? 0.65 : 1, cursor: bookingSaving ? "wait" : "pointer" }}>{bookingSaving ? "Submitting..." : "Confirm booking"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}


const styles = {

  // =======================================================
  // LOADING
  // =======================================================

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--db-bg)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingCard: {
    background: "var(--db-surface)",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
    color: "var(--db-heading)",
    width: "380px",
    maxWidth: "90%",
    boxSizing: "border-box",
  },

  loadingIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },


  // =======================================================
  // LAYOUT
  // =======================================================

  layout: {
    minHeight: "100vh",
    display: "flex",
    background: "var(--db-bg)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },


  // =======================================================
  // SIDEBAR
  // =======================================================

  sidebar: {
    width: "260px",
    height: "100vh",
    background:
      "linear-gradient(180deg, #12395b 0%, #0d2b44 100%)",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    zIndex: 1000,
    overflow: "hidden",
  },

  logoArea: {
    flexShrink: 0,
    padding: "22px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom:
      "1px solid rgba(255,255,255,0.12)",
  },

  logoIcon: {
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

  logoTitle: {
    margin: 0,
    fontSize: "18px",
  },

  logoSubtitle: {
    display: "block",
    marginTop: "3px",
    fontSize: "12px",
    color: "#b9d5e8",
  },

  patientProfile: {
    flexShrink: 0,
    margin: "18px 14px",
    padding: "14px",
    borderRadius: "12px",
    background:
      "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--db-surface)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },

  profileInfo: {
    minWidth: 0,
    overflow: "hidden",
  },

  profileTitle: {
    display: "block",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },

  profileId: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
    color: "#b9d5e8",
  },


  // =======================================================
  // NAVIGATION
  // =======================================================

  sidebarNavScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "5px 0 15px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling:
      "touch",
  },

  nav: {
    padding: "0 12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  navItem: {
    width: "100%",
    minHeight: "46px",
    border: "none",
    borderRadius: "9px",
    padding: "13px 15px",
    background: "transparent",
    color: "#dcebf5",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    flexShrink: 0,
    boxSizing: "border-box",
    transition:
      "background 0.2s ease, color 0.2s ease",
  },

  activeNavItem: {
    background: "#1769aa",
    color: "white",
    boxShadow:
      "0 4px 12px rgba(0,0,0,.15)",
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
    padding: "15px",
    borderTop:
      "1px solid rgba(255,255,255,0.12)",
    background: "#0d2b44",
  },

  logoutButton: {
    width: "100%",
    border: "none",
    borderRadius: "9px",
    padding: "13px",
    background: "#b42318",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxSizing: "border-box",
  },


  // =======================================================
  // MAIN
  // =======================================================

  main: {
    marginLeft: "260px",
    width:
      "calc(100% - 260px)",
    minHeight: "100vh",
    padding: "32px",
    boxSizing: "border-box",
  },

  sectionPage: {
    minHeight:
      "calc(100vh - 64px)",
  },


  // =======================================================
  // HEADERS
  // =======================================================

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  pageHeader: {
    marginBottom: "30px",
  },

  profilePageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
  },

  title: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "28px",
  },

  pageTitle: {
    margin: 0,
    color: "var(--db-heading)",
    fontSize: "28px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "var(--db-muted)",
  },

  pageSubtitle: {
    margin: "7px 0 0",
    color: "var(--db-muted)",
    fontSize: "15px",
  },


  // =======================================================
  // BUTTONS
  // =======================================================

  refreshButton: {
    border:
      "1px solid #1769aa",
    borderRadius: "8px",
    padding: "10px 16px",
    background: "var(--db-surface)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  },

  secondaryButton: {
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    padding: "9px 15px",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  cancelButton: {
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    padding: "11px 20px",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    fontWeight: 700,
    cursor: "pointer",
  },

  saveButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 20px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  saveButtonDisabled: {
    background: "#98a8b5",
    cursor: "not-allowed",
  },

  viewButton: {
    border: "none",
    borderRadius: "7px",
    padding: "8px 12px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    fontWeight: 700,
    cursor: "pointer",
  },


  // =======================================================
  // ERROR / SUCCESS
  // =======================================================

  error: {
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "8px",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
    border:
      "1px solid var(--db-red-border)",
  },

  successMessage: {
    marginBottom: "15px",
    padding: "12px 15px",
    borderRadius: "8px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    border:
      "1px solid var(--db-green-border)",
    fontSize: "14px",
    fontWeight: 600,
  },

  profileSuccess: {
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "8px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    border:
      "1px solid var(--db-green-border)",
    fontSize: "14px",
    fontWeight: 600,
  },


  // =======================================================
  // PROFILE EDIT
  // =======================================================

  editProfileCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  editProfileHeader: {
    marginBottom: "25px",
    paddingBottom: "18px",
    borderBottom:
      "1px solid var(--db-border)",
  },

  profileFormGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  formLabel: {
    color: "var(--db-text)",
    fontSize: "13px",
    fontWeight: 700,
  },

  formInput: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 13px",
    border:
      "1px solid var(--db-border-strong)",
    borderRadius: "8px",
    background: "var(--db-surface)",
    color: "var(--db-text)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  formHint: {
    color: "var(--db-muted)",
    fontSize: "11px",
    lineHeight: 1.4,
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginTop: "28px",
    paddingTop: "20px",
    borderTop:
      "1px solid var(--db-border)",
  },


  // =======================================================
  // QUICK ACTIONS
  // =======================================================

  quickActions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },

  quickAction: {
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    padding: "18px",
    background: "var(--db-surface)",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
    minWidth: 0,
  },

  quickActionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  quickActionContent: {
    minWidth: 0,
    flex: 1,
  },

  quickActionTitle: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "14px",
    marginBottom: "5px",
  },

  quickActionDescription: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "12px",
    lineHeight: 1.4,
  },

  quickActionArrow: {
    color: "var(--db-blue-text)",
    fontSize: "20px",
    fontWeight: 700,
  },


  // =======================================================
  // STATS
  // =======================================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },

  statCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "13px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
  },

  statIconBlue: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statIconYellow: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statIconGreen: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statIconRed: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
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

  statValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "23px",
  },



  // SECTIONS

   section: {
    marginBottom: "30px",
  },

  sectionHeader: {


    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 10,
    color: "var(--db-heading)",
    fontSize: "21px",
  },

  sectionSubtitle: {
    margin:10,
    color: "var(--db-muted)",
    fontSize: "14px",
  },

  recordCount: {
    padding: "8px 13px",
    borderRadius: "20px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },


  // =======================================================
  // UPLOAD
  // =======================================================

  uploadCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "16px",
    padding: "28px",
    display: "flex",
    gap: "22px",
    alignItems: "flex-start",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
    marginBottom: "30px",
  },

  uploadIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    flexShrink: 0,
  },

  uploadContent: {
    flex: 1,
    minWidth: 0,
  },

  uploadTitle: {
    margin:
      "0 0 7px",
    color: "var(--db-heading)",
    fontSize: "20px",
  },

  uploadDescription: {
    margin:
      "0 0 20px",
    color: "var(--db-muted)",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  fileInputArea: {
    border:
      "2px dashed var(--db-border-strong)",
    borderRadius: "12px",
    padding: "20px",
    background: "var(--db-surface-2)",
    marginBottom: "15px",
  },

  fileInput: {
    width: "100%",
    fontSize: "14px",
    color: "var(--db-text)",
    cursor: "pointer",
  },

  selectedFile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px",
    borderRadius: "10px",
    background: "var(--db-surface-2)",
    border:
      "1px solid var(--db-blue-border)",
    marginBottom: "15px",
  },

  selectedFileIcon: {
    fontSize: "22px",
  },

  selectedFileInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  fileSize: {
    color: "var(--db-muted)",
    fontSize: "12px",
  },

  removeFileButton: {
    border: "none",
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 700,
  },

  uploadBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  allowedFiles: {
    color: "var(--db-muted)",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  uploadButton: {
    border: "none",
    borderRadius: "9px",
    padding: "12px 20px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  uploadButtonDisabled: {
    background: "#aab7c4",
    cursor: "not-allowed",
  },


  // =======================================================
  // REPORTS
  // =======================================================

  reportsContainer: {
    marginBottom: "30px",
  },

  reportHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  reportFileCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  reportFileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "9px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  storedFileName: {
    color: "var(--db-muted)",
    fontSize: "12px",
    wordBreak: "break-word",
  },

  patientEmail: {
    color: "var(--db-muted)",
    fontSize: "11px",
    marginTop: "3px",
  },


  // =======================================================
  // APPOINTMENTS
  // =======================================================

  appointmentList: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },

  appointmentCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "13px",
    padding: "17px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.04)",
  },

  rejectedAppointmentCard: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    border: "1px solid var(--db-red-border)",
    background: "var(--db-surface-2)",
  },

  rejectionMessage: {
    flex: "1 0 100%",
    boxSizing: "border-box",
    marginTop: 2,
    padding: "12px 14px",
    border: "1px solid var(--db-amber-border)",
    borderLeft: "4px solid #dc2626",
    borderRadius: 9,
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
    fontSize: 13,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  appointmentIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  appointmentInfo: {
    flex: 1,
    minWidth: 0,
  },

  doctorName: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "15px",
    marginBottom: "4px",
  },

  doctorMeta: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "13px",
    marginBottom: "7px",
  },

  appointmentDate: {
    display: "block",
    color: "var(--db-text)",
    fontSize: "13px",
  },

  problemText: {
    display: "block",
    marginTop: "6px",
    color: "var(--db-muted)",
    fontSize: "12px",
  },

  status: {
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  pending: {
    background: "var(--db-amber-bg)",
    color: "var(--db-amber-text)",
  },

  confirmed: {
    background: "var(--db-green-bg)",
    color: "var(--db-green-text)",
  },

  cancelled: {
    background: "var(--db-red-bg)",
    color: "var(--db-red-text)",
  },


  // =======================================================
  // PROFILE
  // =======================================================

  patientInfoCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "16px",
    padding: "30px",
    display: "flex",
    alignItems: "flex-start",
    gap: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  largeAvatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "var(--db-blue-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    flexShrink: 0,
    overflow: "hidden",
  },

  patientInfoGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  infoItem: {
    padding: "16px",
    borderRadius: "10px",
    background: "var(--db-surface-2)",
    border:
      "1px solid var(--db-border)",
  },

  infoLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "12px",
    marginBottom: "6px",
  },

  infoValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "14px",
    wordBreak: "break-word",
  },


  // =======================================================
  // TABLE
  // =======================================================

  tableWrapper: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    overflowX: "auto",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  tableHeader: {
    padding: "14px 16px",
    background: "var(--db-surface-2)",
    color: "var(--db-text)",
    fontSize: "12px",
    fontWeight: 800,
    textAlign: "left",
    borderBottom:
      "1px solid var(--db-border)",
    whiteSpace: "nowrap",
  },

  tableRow: {
    borderBottom:
      "1px solid var(--db-border)",
  },

  tableCell: {
    padding: "15px 16px",
    color: "var(--db-text)",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  primaryText: {
    color: "var(--db-heading)",
  },

  medicineText: {
    color: "var(--db-blue-text)",
  },

  testStatus: {
    padding: "5px 9px",
    borderRadius: "15px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    fontSize: "11px",
    fontWeight: 700,
  },


  // =======================================================
  // EMPTY STATE
  // =======================================================

  empty: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    padding: "55px 25px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin:
      "0 0 7px",
    color: "var(--db-heading)",
    fontSize: "18px",
  },

  emptyMessage: {
    margin:
      "0 auto 18px",
    color: "var(--db-muted)",
    fontSize: "13px",
    maxWidth: "500px",
    lineHeight: 1.6,
  },


  // =======================================================
  // LOADING
  // =======================================================

  sectionLoading: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    padding: "55px 25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "var(--db-text)",
  },

  sectionLoadingIcon: {
    fontSize: "38px",
    marginBottom: "5px",
  },



  // BILLING


  billingGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  billingCard: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  billingIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "var(--db-blue-bg)",
    color: "var(--db-blue-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  billingLabel: {
    display: "block",
    color: "var(--db-muted)",
    fontSize: "13px",
    marginBottom: "5px",
  },

  billingValue: {
    display: "block",
    color: "var(--db-heading)",
    fontSize: "25px",
  },



  // GENERIC CARDS
    card: {
    background: "var(--db-surface)",
    border:
      "1px solid var(--db-border)",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "20px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  cardHeading: {
    margin:
      "0 0 18px",
    color: "var(--db-heading)",
    fontSize: "18px",
  },


  // WELCOME

    welcomeCard: {
      background: "linear-gradient(135deg, #1769aa 0%, #12395b 100%)",
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


};


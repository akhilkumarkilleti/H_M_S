import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalProfilePhoto from "../components/LocalProfilePhoto";

import {
  getMyDoctorAppointments,
  approveDoctorAppointment,
  rejectDoctorAppointment,
} from "../services/appointmentService";

function DoctorAppointmentsList() {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  const [actionError, setActionError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // =========================================
  // LOAD APPOINTMENTS
  // =========================================

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
          err.response?.data ||
          err.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadAppointments();
  }, []);

  // =========================================
  // APPROVE APPOINTMENT
  // =========================================

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

  // =========================================
  // REJECT APPOINTMENT
  // =========================================

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

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    [
      "doctorToken",
      "doctorId",
      "doctorEmail",
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
    ].forEach((key) => {
      sessionStorage.removeItem(key);
    });

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =========================================
  // DOCTOR INFORMATION
  // =========================================

  const doctorName =
    sessionStorage.getItem(
      "doctorName"
    ) || "Doctor";

  const doctorId =
    sessionStorage.getItem(
      "doctorId"
    ) || "-";

  const specialization =
    sessionStorage.getItem(
      "specialization"
    ) ||
    sessionStorage.getItem(
      "doctorSpecialization"
    ) ||
    "Medical Professional";

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(`${date}T00:00:00`);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // NORMALIZE STATUS
  // =========================================

  const getStatus = (appointment) => {
    return String(
      appointment?.status ||
        "PENDING"
    ).toUpperCase();
  };

  // =========================================
  // COUNTS
  // =========================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        getStatus(appointment) ===
        "PENDING"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        getStatus(appointment) ===
        "CONFIRMED"
    ).length;

  const rejectedAppointments =
    appointments.filter(
      (appointment) =>
        getStatus(appointment) ===
        "REJECTED"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        getStatus(appointment) ===
        "CANCELLED"
    ).length;

  // =========================================
  // FILTER APPOINTMENTS
  // =========================================

  const filteredAppointments =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return appointments.filter(
        (appointment) => {
          const status =
            getStatus(
              appointment
            );

          // STATUS FILTER
          if (
            statusFilter !== "ALL" &&
            status !== statusFilter
          ) {
            return false;
          }

          // SEARCH FILTER
          if (!search) {
            return true;
          }

          const patientName =
            String(
              appointment.patientName ||
                ""
            ).toLowerCase();

          const patientId =
            String(
              appointment.patientId ||
                ""
            ).toLowerCase();

          const problem =
            String(
              appointment.problem ||
                ""
            ).toLowerCase();

          const appointmentId =
            String(
              appointment.id ||
                appointment.appointmentId ||
                ""
            ).toLowerCase();

          const appointmentDate =
            String(
              appointment.appointmentDate ||
                ""
            ).toLowerCase();

          const appointmentTime =
            String(
              appointment.appointmentTime ||
                ""
            ).toLowerCase();

          return (
            patientName.includes(
              search
            ) ||
            patientId.includes(
              search
            ) ||
            problem.includes(
              search
            ) ||
            appointmentId.includes(
              search
            ) ||
            appointmentDate.includes(
              search
            ) ||
            appointmentTime.includes(
              search
            )
          );
        }
      );
    }, [
      appointments,
      searchTerm,
      statusFilter,
    ]);

  // =========================================
  // SORT APPOINTMENTS
  // =========================================

  const sortedAppointments =
    useMemo(() => {
      return [
        ...filteredAppointments,
      ].sort((a, b) => {
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
      });
    }, [filteredAppointments]);

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "CONFIRMED":
        return {
          ...styles.statusBadge,
          ...styles.confirmedStatus,
        };

      case "REJECTED":
        return {
          ...styles.statusBadge,
          ...styles.rejectedStatus,
        };

      case "CANCELLED":
        return {
          ...styles.statusBadge,
          ...styles.cancelledStatus,
        };

      case "PENDING":
      default:
        return {
          ...styles.statusBadge,
          ...styles.pendingStatus,
        };
    }
  };

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div style={styles.page}>

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside style={styles.sidebar}>

        {/* BRAND */}

        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            🏥
          </div>

          <div>
            <h2
              style={
                styles.brandTitle
              }
            >
              Potla MediCore
            </h2>

            <p
              style={
                styles.brandSubtitle
              }
            >
              Doctor Portal
            </p>
          </div>
        </div>

        {/* DOCTOR PROFILE */}

        <div
          style={
            styles.doctorBox
          }
        >
          <div style={{ ...styles.doctorAvatar, display: "none" }}>
            {doctorName
              ? doctorName
                  .charAt(0)
                  .toUpperCase()
              : "D"}
          </div>

          <LocalProfilePhoto role="DOCTOR" userKey={sessionStorage.getItem("doctorEmail") || doctorId} name={doctorName || "Doctor"} existingPhoto={doctorId ? `http://localhost:8080/api/doctors/${doctorId}/profile-photo` : ""} size={52} />

          <div
            style={
              styles.doctorInfo
            }
          >
            <strong>
              Dr.{" "}
              {doctorName}
            </strong>

            <span
              style={
                styles.doctorAccount
              }
            >
              ID: {doctorId}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}

          <div className="dashboard-sidebar-nav-scroll" style={styles.sidebarNavScroll}>
          <nav style={styles.nav}>

            <button
              type="button"
              style={styles.navItem}
              onClick={() =>
                navigate(
                  "/doctor/dashboard"
                )
              }
            >
              <span
                style={
                  styles.navIcon
                }
              >
                📊
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              type="button"
              style={{
                ...styles.navItem,
                ...styles.activeNavItem,
              }}
              onClick={() =>
                navigate(
                  "/doctor/doctorappointmentslist"
                )
              }
            >
              <span
                style={
                  styles.navIcon
                }
              >
                📅
              </span>

              <span>
                My Appointments
              </span>

              {pendingAppointments >
                0 && (
                <span
                  style={
                    styles.navBadge
                  }
                >
                  {
                    pendingAppointments
                  }
                </span>
              )}
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() =>
                navigate(
                  "/doctor/patients"
                )
              }
            >
              <span
                style={
                  styles.navIcon
                }
              >
                👥
              </span>

              <span>
                My Patients
              </span>
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() =>
                navigate(
                  "/doctor/medical-reports"
                )
              }
            >
              <span
                style={
                  styles.navIcon
                }
              >
                📄
              </span>

              <span>
                Medical Reports
              </span>
            </button>

            <button
              type="button"
              style={styles.navItem}
              onClick={() =>
                navigate(
                  "/doctor/prescriptions"
                )
              }
            >
              <span
                style={
                  styles.navIcon
                }
              >
                💊
              </span>

              <span>
                Prescriptions
              </span>
            </button>

          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}

        <div
          style={
            styles.sidebarBottom
          }
        >
          <button
            type="button"
            onClick={logout}
            style={
              styles.sidebarLogout
            }
          >
            <span>🚪</span>

            <span>
              Logout
            </span>
          </button>
        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main style={styles.main}>

        {/* HEADER */}

        <div
          style={
            styles.topHeader
          }
        >
          <div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/doctor/dashboard"
                )
              }
              style={
                styles.backButton
              }
            >
              ← Back to Dashboard
            </button>

            <h1
              style={styles.title}
            >
              My Appointments
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Manage your patient appointment
              requests and scheduled
              consultations.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadAppointments
            }
            disabled={loading}
            style={
              styles.refreshButton
            }
          >
            🔄{" "}
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={styles.error}
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            style={styles.error}
          >
            {actionError}
          </div>
        )}

        {/* =====================================
            SUMMARY CARDS
        ====================================== */}

        <div
          style={
            styles.statsGrid
          }
        >

          <div
            style={
              styles.statCard
            }
          >
            <div
              style={
                styles.statIcon
              }
            >
              📅
            </div>

            <div>
              <span
                style={
                  styles.statLabel
                }
              >
                Total
              </span>

              <strong
                style={
                  styles.statNumber
                }
              >
                {totalAppointments}
              </strong>
            </div>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <div
              style={
                styles.statIconPending
              }
            >
              ⏳
            </div>

            <div>
              <span
                style={
                  styles.statLabel
                }
              >
                Pending
              </span>

              <strong
                style={
                  styles.statNumber
                }
              >
                {pendingAppointments}
              </strong>
            </div>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <div
              style={
                styles.statIconConfirmed
              }
            >
              ✓
            </div>

            <div>
              <span
                style={
                  styles.statLabel
                }
              >
                Confirmed
              </span>

              <strong
                style={
                  styles.statNumber
                }
              >
                {confirmedAppointments}
              </strong>
            </div>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <div
              style={
                styles.statIconRejected
              }
            >
              ✕
            </div>

            <div>
              <span
                style={
                  styles.statLabel
                }
              >
                Rejected
              </span>

              <strong
                style={
                  styles.statNumber
                }
              >
                {rejectedAppointments}
              </strong>
            </div>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <div
              style={
                styles.statIconCancelled
              }
            >
              🚫
            </div>

            <div>
              <span
                style={
                  styles.statLabel
                }
              >
                Cancelled
              </span>

              <strong
                style={
                  styles.statNumber
                }
              >
                {cancelledAppointments}
              </strong>
            </div>
          </div>

        </div>

        {/* =====================================
            FILTER SECTION
        ====================================== */}

        <div
          style={
            styles.filterCard
          }
        >

          <div
            style={
              styles.searchContainer
            }
          >
            <span
              style={
                styles.searchIcon
              }
            >
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search by patient name, patient ID, reason..."
              style={
                styles.searchInput
              }
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                style={
                  styles.clearSearch
                }
              >
                ✕
              </button>
            )}
          </div>

          <div
            style={
              styles.filterGroup
            }
          >
            <label
              style={
                styles.filterLabel
              }
            >
              Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              style={
                styles.statusSelect
              }
            >
              <option value="ALL">
                All Appointments
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

        </div>

        {/* RESULTS INFO */}

        <div
          style={
            styles.resultsHeader
          }
        >
          <div>
            <h2
              style={
                styles.sectionTitle
              }
            >
              Appointment List
            </h2>

            <p
              style={
                styles.sectionSubtitle
              }
            >
              Showing{" "}
              <strong>
                {
                  sortedAppointments.length
                }
              </strong>{" "}
              of{" "}
              <strong>
                {totalAppointments}
              </strong>{" "}
              appointments
            </p>
          </div>

          {(searchTerm ||
            statusFilter !==
              "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter(
                  "ALL"
                );
              }}
              style={
                styles.clearFiltersButton
              }
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* =====================================
            LOADING
        ====================================== */}

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
            ></div>

            <h3>
              Loading appointments...
            </h3>

            <p>
              Please wait while we load
              your appointments.
            </p>
          </div>
        ) : sortedAppointments.length ===
          0 ? (
          /* =====================================
              EMPTY
          ====================================== */

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
              No appointments found
            </h3>

            <p>
              {searchTerm ||
              statusFilter !==
                "ALL"
                ? "No appointments match your current search or filter."
                : "You don't have any appointments yet."}
            </p>

            {(searchTerm ||
              statusFilter !==
                "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(
                    "ALL"
                  );
                }}
                style={
                  styles.resetButton
                }
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* =====================================
              APPOINTMENT LIST
          ====================================== */

          <div
            style={
              styles.appointmentList
            }
          >

            {sortedAppointments.map(
              (appointment) => {
                const appointmentId =
                  appointment.id ||
                  appointment.appointmentId;

                const status =
                  getStatus(
                    appointment
                  );

                const approveLoading =
                  actionLoading ===
                  `approve-${appointmentId}`;

                const rejectLoading =
                  actionLoading ===
                  `reject-${appointmentId}`;

                return (
                  <div
                    key={
                      appointmentId
                    }
                    style={
                      styles.appointmentCard
                    }
                  >

                    {/* TOP */}

                    <div
                      style={
                        styles.cardTop
                      }
                    >

                      {/* PATIENT */}

                      <div
                        style={
                          styles.patientSection
                        }
                      >
                        <div
                          style={
                            styles.patientAvatar
                          }
                        >
                          👤
                        </div>

                        <div
                          style={
                            styles.patientInfo
                          }
                        >
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

                      {/* STATUS */}

                      <span
                        style={
                          getStatusStyle(
                            status
                          )
                        }
                      >
                        {status}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div
                      style={
                        styles.detailsGrid
                      }
                    >

                      <div
                        style={
                          styles.detailBox
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          📅 Date
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detailBox
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          🕐 Time
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {appointment.appointmentTime ||
                            "-"}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detailBox
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          🩺 Reason
                        </span>

                        <strong
                          style={
                            styles.reasonValue
                          }
                        >
                          {appointment.problem ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.detailBox
                        }
                      >
                        <span
                          style={
                            styles.detailLabel
                          }
                        >
                          🆔 Appointment ID
                        </span>

                        <strong
                          style={
                            styles.detailValue
                          }
                        >
                          {appointmentId ||
                            "-"}
                        </strong>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    {status ===
                      "PENDING" && (
                      <div
                        style={
                          styles.actionArea
                        }
                      >

                        <div>
                          <span
                            style={
                              styles.pendingMessage
                            }
                          >
                            ⏳ Waiting for your
                            approval
                          </span>
                        </div>

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
                              handleApprove(
                                appointmentId
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
                              ? "Approving..."
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
                            style={{
                              ...styles.rejectButton,
                              ...(rejectLoading
                                ? styles.disabledButton
                                : {}),
                            }}
                          >
                            {rejectLoading
                              ? "Rejecting..."
                              : "✕ Reject"}
                          </button>

                        </div>
                      </div>
                    )}

                    {status ===
                      "CONFIRMED" && (
                      <div
                        style={
                          styles.confirmedMessage
                        }
                      >
                        ✓ This appointment has
                        been confirmed.
                      </div>
                    )}

                    {status ===
                      "REJECTED" && (
                      <div
                        style={
                          styles.rejectedMessage
                        }
                      >
                        ✕ This appointment has
                        been rejected.
                      </div>
                    )}

                    {status ===
                      "CANCELLED" && (
                      <div
                        style={
                          styles.cancelledMessage
                        }
                      >
                        🚫 This appointment has
                        been cancelled.
                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  // ========================================
  // PAGE
  // ========================================

  page: {
    minHeight: "100vh",
    background: "#f4f8fb",
    display: "flex",
    fontFamily:
      "Arial, Helvetica, sans-serif",
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
    background: "#e7f3ff",
    color: "#1769aa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "18px",
    flexShrink: 0,
  },

  doctorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    overflow: "hidden",
  },

  doctorAccount: {
    color: "#b8d4e8",
    fontSize: "12px",
    overflow: "hidden",
    textOverflow:
      "ellipsis",
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
    scrollbarWidth: "thin",
    scrollbarColor:
      "#3d6d8f transparent",
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

  sidebarBottom: {
    flexShrink: 0,
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
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "25px",
  },

  backButton: {
    display: "block",
    border: "none",
    background: "transparent",
    color: "#1769aa",
    padding: 0,
    marginBottom: "10px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  title: {
    margin: 0,
    color: "#16324f",
    fontSize: "30px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#667085",
    fontSize: "15px",
  },

  refreshButton: {
    border:
      "1px solid #1769aa",
    borderRadius: "8px",
    padding:
      "11px 16px",
    background: "white",
    color: "#1769aa",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ========================================
  // ERROR
  // ========================================

  error: {
    marginBottom: "20px",
    padding:
      "13px 16px",
    borderRadius: "9px",
    background: "#f8d7da",
    color: "#842029",
  },

  // ========================================
  // STATS
  // ========================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    borderRadius: "13px",
    padding: "17px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#e8f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  statIconPending: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#fff3cd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  statIconConfirmed: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#d1e7dd",
    color: "#0f5132",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: 800,
    flexShrink: 0,
  },

  statIconRejected: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#f8d7da",
    color: "#842029",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: 800,
    flexShrink: 0,
  },

  statIconCancelled: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#f1f3f5",
    color: "#495057",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  statLabel: {
    display: "block",
    color: "#667085",
    fontSize: "11px",
    marginBottom: "4px",
  },

  statNumber: {
    display: "block",
    color: "#16324f",
    fontSize: "21px",
  },

  // ========================================
  // FILTER
  // ========================================

  filterCard: {
    background: "white",
    borderRadius: "13px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "20px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  searchContainer: {
    flex: 1,
    maxWidth: "650px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    fontSize: "16px",
    zIndex: 1,
  },

  searchInput: {
    width: "100%",
    padding:
      "11px 40px",
    border:
      "1px solid #d9e1e7",
    borderRadius: "8px",
    outline: "none",
    fontSize: "13px",
    color: "#1f2937",
    boxSizing: "border-box",
  },

  clearSearch: {
    position: "absolute",
    right: "8px",
    border: "none",
    background:
      "transparent",
    color: "#667085",
    cursor: "pointer",
    fontSize: "13px",
  },

  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  filterLabel: {
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
  },

  statusSelect: {
    minWidth: "180px",
    padding:
      "10px 12px",
    border:
      "1px solid #d9e1e7",
    borderRadius: "8px",
    background: "white",
    color: "#1f2937",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },

  // ========================================
  // RESULTS HEADER
  // ========================================

  resultsHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "21px",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#667085",
    fontSize: "13px",
  },

  clearFiltersButton: {
    border:
      "1px solid #1769aa",
    borderRadius: "7px",
    padding:
      "8px 12px",
    background: "white",
    color: "#1769aa",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  // ========================================
  // APPOINTMENT LIST
  // ========================================

  appointmentList: {
    display: "grid",
    gap: "14px",
    paddingBottom: "30px",
  },

  appointmentCard: {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    border:
      "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  cardTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
  },

  patientSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  patientAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#e8f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  patientInfo: {
    minWidth: 0,
  },

  patientName: {
    display: "block",
    color: "#16324f",
    fontSize: "16px",
    marginBottom: "4px",
  },

  patientId: {
    display: "block",
    color: "#667085",
    fontSize: "12px",
  },

  // ========================================
  // STATUS
  // ========================================

  statusBadge: {
    display: "inline-block",
    padding:
      "7px 13px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  pendingStatus: {
    background: "#fff3cd",
    color: "#856404",
  },

  confirmedStatus: {
    background: "#d1e7dd",
    color: "#0f5132",
  },

  rejectedStatus: {
    background: "#f8d7da",
    color: "#842029",
  },

  cancelledStatus: {
    background: "#e9ecef",
    color: "#495057",
  },

  // ========================================
  // DETAILS
  // ========================================

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "12px",
  },

  detailBox: {
    background: "#f7f9fc",
    borderRadius: "9px",
    padding: "13px",
    minWidth: 0,
  },

  detailLabel: {
    display: "block",
    color: "#667085",
    fontSize: "11px",
    marginBottom: "6px",
  },

  detailValue: {
    display: "block",
    color: "#1f2937",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  reasonValue: {
    display: "block",
    color: "#1f2937",
    fontSize: "13px",
    wordBreak: "break-word",
    lineHeight: 1.4,
  },

  // ========================================
  // ACTION AREA
  // ========================================

  actionArea: {
    marginTop: "18px",
    paddingTop: "15px",
    borderTop:
      "1px solid #edf0f2",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "15px",
  },

  pendingMessage: {
    color: "#856404",
    fontSize: "12px",
    fontWeight: 700,
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
  },

  approveButton: {
    minWidth: "115px",
    padding:
      "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#198754",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  rejectButton: {
    minWidth: "115px",
    padding:
      "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#dc3545",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  confirmedMessage: {
    marginTop: "18px",
    paddingTop: "14px",
    borderTop:
      "1px solid #edf0f2",
    color: "#0f5132",
    fontSize: "12px",
    fontWeight: 700,
  },

  rejectedMessage: {
    marginTop: "18px",
    paddingTop: "14px",
    borderTop:
      "1px solid #edf0f2",
    color: "#842029",
    fontSize: "12px",
    fontWeight: 700,
  },

  cancelledMessage: {
    marginTop: "18px",
    paddingTop: "14px",
    borderTop:
      "1px solid #edf0f2",
    color: "#495057",
    fontSize: "12px",
    fontWeight: 700,
  },

  // ========================================
  // LOADING
  // ========================================

  loadingCard: {
    background: "white",
    borderRadius: "14px",
    padding: "55px",
    textAlign: "center",
    color: "#667085",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border:
      "4px solid #dbeafe",
    borderTop:
      "4px solid #1769aa",
    borderRadius: "50%",
    margin:
      "0 auto 15px",
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    background: "white",
    borderRadius: "14px",
    padding: "55px",
    textAlign: "center",
    color: "#667085",
    boxShadow:
      "0 5px 18px rgba(0,0,0,.05)",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  resetButton: {
    marginTop: "12px",
    border: "none",
    borderRadius: "8px",
    padding:
      "10px 16px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default DoctorAppointmentsList;

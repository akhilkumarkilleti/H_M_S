import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HospitalHome from "./pages/HospitalHome";
import DoctorDashboard from "./pages/DoctorDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import FindDoctors from "./pages/FindDoctors";
import BookAppointment from "./pages/BookAppointment";
import PatientLogin from "./pages/PatientLogin";
import PatientForgotPassword from "./pages/PatientForgotPassword";
import StaffForgotPassword from "./pages/StaffForgotPassword";
import PatientRegister from "./pages/PatientRegister";
import Articles from "./pages/Articles";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorAppointmentsList from "./pages/DoctorAppointmentsList";
import HospitalInformationBio from "./pages/HospitalInformationBio";
import StaffDashboard from "./pages/StaffDashboard";
import StaffProtectedRoute from "./pages/StaffProtectedRoute";
import RareCases from "./pages/RareCases";
import Research from "./pages/Research";
import PublicLayout from "./components/PublicLayout";
import ThemeToggle from "./components/ThemeToggle";
import Investors from "./pages/Investors";
import MediaCentre from "./pages/MediaCentre";


import HealthHomePage from "./pages/services/HealthHomePage";
import HealthDonationsPage from "./pages/services/HealthDonationsPage";
import AmbulanceService from "./pages/services/AmbulanceService";
import HealthAllCheckupPage from "./pages/services/HealthAllCheckupPage";
import MaxLabDiagnosticsPage from "./pages/services/MaxLabDiagnosticsPage";

import HospitalTreatments from "./pages/treatments/HospitalTreatments";
import CancerCarePage from "./pages/treatments/CancerCarePage";
import HeartCardioPage from "./pages/treatments/HeartCardioPage";
import NeurologyPage from "./pages/treatments/NeurologyPage";
import OrthoPedicPage from "./pages/treatments/OrthoPedicPage";
import MaternityCarePage from "./pages/treatments/MaternityCarePage";
import KidneyCarePage from "./pages/treatments/KidneyCarePage";
import GastroenterologyPage from "./pages/treatments/GastroenterologyPage";
import EmergencyPage from "./pages/treatments/EmergencyPage";
import CancerBloodPage from "./pages/treatments/CancerBloodPage";
import CancerBreastPage from "./pages/treatments/CancerBreastPage";
import KidneyLiverTransplantPage from "./pages/treatments/KidneyLiverTransplantPage";
import TreatmentDetailPage from "./pages/treatments/TreatmentDetailPage";
import LungCancerPage from "./pages/treatments/LungCancerPage";
import LiverCancerPage from "./pages/treatments/LiverCancerPage";
import BrainCancerPage from "./pages/treatments/BrainCancerPage";
import VascularSciencesPage from "./pages/treatments/VascularSciencesPage";
import SpineCarePage from "./pages/treatments/SpineCarePage";
import SportsInjuryPage from "./pages/treatments/SportsInjuryPage";
import ShoulderCarePage from "./pages/treatments/ShoulderCarePage";
import CardiologyPage from "./pages/treatments/CardiologyPage";
import HeartSurgeryPage from "./pages/treatments/HeartSurgeryPage";
import NeurologyDetailPage from "./pages/treatments/NeurologyDetailPage";
import BrainSpinePage from "./pages/treatments/BrainSpinePage";
import KneeReplacementPage from "./pages/treatments/KneeReplacementPage";
import HipReplacementPage from "./pages/treatments/HipReplacementPage";
import KidneyTransplantPage from "./pages/treatments/KidneyTransplantPage";
import LiverTransplantPage from "./pages/treatments/LiverTransplantPage";
import LivingDonorTransplantPage from "./pages/treatments/LivingDonorTransplantPage";
import TransplantFollowUpPage from "./pages/treatments/TransplantFollowUpPage";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><HospitalHome /></PublicLayout>} />

        <Route path="dashboard"element={<PatientDashboard />}/>
        <Route path="/doctor/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/doctor/doctorappointmentslist" element={<ProtectedRoute><DoctorAppointmentsList /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />

        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/forgot-password" element={<PatientForgotPassword />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/finddoctors" element={<PublicLayout><FindDoctors /></PublicLayout>} />
        <Route path="/patient/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<StaffForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/nurse/dashboard" element={<StaffProtectedRoute roles={["NURSE"]}><StaffDashboard /></StaffProtectedRoute>} />
        <Route path="/reception/dashboard" element={<StaffProtectedRoute roles={["RECEPTION"]}><StaffDashboard /></StaffProtectedRoute>} />
        <Route path="/lab/dashboard" element={<StaffProtectedRoute roles={["LAB"]}><StaffDashboard /></StaffProtectedRoute>} />
        <Route path="/pharmacy/dashboard" element={<StaffProtectedRoute roles={["PHARMACY"]}><StaffDashboard /></StaffProtectedRoute>} />
        <Route path="/articles" element={<PublicLayout><Articles/></PublicLayout>}/>
        <Route path="/hospitalinformationbio" element={<PublicLayout><HospitalInformationBio/></PublicLayout>}/>
        <Route path="/investors" element={<PublicLayout><Investors /></PublicLayout>} />
        <Route path="/mediacentre" element={<PublicLayout><MediaCentre /></PublicLayout>} />
        <Route path="/rarecases" element={<PublicLayout><RareCases/></PublicLayout>} />
        <Route path="/research" element={<PublicLayout><Research /></PublicLayout>} />




        <Route path="/healthdonationspage" element={<PublicLayout><HealthDonationsPage /></PublicLayout>} />
        <Route path="/healthhomepage" element={<PublicLayout><HealthHomePage /></PublicLayout>} />
        <Route path="/ambulanceservice" element={<PublicLayout><AmbulanceService /></PublicLayout>} />
        <Route path="/healthallcheckups" element={<PublicLayout><HealthAllCheckupPage /></PublicLayout>} />
        <Route path="/maxlabdiagnostics" element={<PublicLayout><MaxLabDiagnosticsPage /></PublicLayout>} />


        <Route path="/hospitaltreatments" element={<PublicLayout><HospitalTreatments/></PublicLayout>} />
        <Route path="/cancercarepage" element={<PublicLayout><CancerCarePage /></PublicLayout>} />
        <Route path="/heartcardiopage" element={<PublicLayout><HeartCardioPage /></PublicLayout>} />
        <Route path="/neurologypage" element={<PublicLayout><NeurologyPage /></PublicLayout>} />
        <Route path="/orthopedicpage" element={<PublicLayout><OrthoPedicPage /></PublicLayout>} />
        <Route path="/maternitycarepage" element={<PublicLayout><MaternityCarePage /></PublicLayout>} />
        <Route path="/kidneycarepage" element={<PublicLayout><KidneyCarePage /></PublicLayout>} />
        <Route path="/gastroenterologypage" element={<PublicLayout><GastroenterologyPage /></PublicLayout>} />
        <Route path="/emergencypage" element={<PublicLayout><EmergencyPage /></PublicLayout>} />
        <Route path="/cancerbloodpage" element={<PublicLayout><CancerBloodPage /></PublicLayout>} />
        <Route path="/cancerbreastpage" element={<PublicLayout><CancerBreastPage /></PublicLayout>} />
        <Route path="/kidneylivertransplant" element={<PublicLayout><KidneyLiverTransplantPage /></PublicLayout>} />
        <Route path="/treatments/:treatment" element={<PublicLayout><TreatmentDetailPage /></PublicLayout>} />
        <Route path="/lungcancerpage" element={<PublicLayout><LungCancerPage /></PublicLayout>} />
        <Route path="/livercancerpage" element={<PublicLayout><LiverCancerPage /></PublicLayout>} />
        <Route path="/braincancerpage" element={<PublicLayout><BrainCancerPage /></PublicLayout>} />
        <Route path="/vascularsciencespage" element={<PublicLayout><VascularSciencesPage /></PublicLayout>} />
        <Route path="/spinecarepage" element={<PublicLayout><SpineCarePage /></PublicLayout>} />
        <Route path="/sportsinjurypage" element={<PublicLayout><SportsInjuryPage /></PublicLayout>} />
        <Route path="/shouldercarepage" element={<PublicLayout><ShoulderCarePage /></PublicLayout>} />
        <Route path="/cardiologypage" element={<PublicLayout><CardiologyPage /></PublicLayout>} />
        <Route path="/heartsurgerypage" element={<PublicLayout><HeartSurgeryPage /></PublicLayout>} />
        <Route path="/neurologydetailpage" element={<PublicLayout><NeurologyDetailPage /></PublicLayout>} />
        <Route path="/brainspinepage" element={<PublicLayout><BrainSpinePage /></PublicLayout>} />
        <Route path="/kneereplacementpage" element={<PublicLayout><KneeReplacementPage /></PublicLayout>} />
        <Route path="/hipreplacementpage" element={<PublicLayout><HipReplacementPage /></PublicLayout>} />
        <Route path="/kidneytransplantpage" element={<PublicLayout><KidneyTransplantPage /></PublicLayout>} />
        <Route path="/livertransplantpage" element={<PublicLayout><LiverTransplantPage /></PublicLayout>} />
        <Route path="/livingdonortransplantpage" element={<PublicLayout><LivingDonorTransplantPage /></PublicLayout>} />
        <Route path="/transplantfollowuppage" element={<PublicLayout><TransplantFollowUpPage /></PublicLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ThemeToggle floating />
    </BrowserRouter>
  );
}


export default App;

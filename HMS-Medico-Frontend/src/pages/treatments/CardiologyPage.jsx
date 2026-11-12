import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function CardiologyPage() {
  return <TreatmentInformationPage data={treatmentInformation.cardiology} />;
}

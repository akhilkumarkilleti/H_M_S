import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function ShoulderCarePage() {
  return <TreatmentInformationPage data={treatmentInformation.shoulderCare} />;
}

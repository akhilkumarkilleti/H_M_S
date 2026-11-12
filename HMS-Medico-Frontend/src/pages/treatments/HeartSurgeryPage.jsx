import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function HeartSurgeryPage() {
  return <TreatmentInformationPage data={treatmentInformation.heartSurgery} />;
}

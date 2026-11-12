import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function TransplantFollowUpPage() {
  return <TreatmentInformationPage data={treatmentInformation.transplantFollowUp} />;
}

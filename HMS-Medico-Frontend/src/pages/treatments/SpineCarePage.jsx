import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function SpineCarePage() {
  return <TreatmentInformationPage data={treatmentInformation.spineCare} />;
}

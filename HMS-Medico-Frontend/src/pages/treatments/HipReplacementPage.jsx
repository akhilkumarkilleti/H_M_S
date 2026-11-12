import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function HipReplacementPage() {
  return <TreatmentInformationPage data={treatmentInformation.hipReplacement} />;
}

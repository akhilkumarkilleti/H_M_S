import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function LungCancerPage() {
  return <TreatmentInformationPage data={treatmentInformation.lungCancer} />;
}

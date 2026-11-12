import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function BrainCancerPage() {
  return <TreatmentInformationPage data={treatmentInformation.brainCancer} />;
}

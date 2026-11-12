import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function BrainSpinePage() {
  return <TreatmentInformationPage data={treatmentInformation.brainSpine} />;
}

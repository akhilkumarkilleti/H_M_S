import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function KneeReplacementPage() {
  return <TreatmentInformationPage data={treatmentInformation.kneeReplacement} />;
}

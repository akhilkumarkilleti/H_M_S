import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function CancerBloodPage() {
  return <TreatmentInformationPage data={treatmentInformation.bloodCancer} />;
}

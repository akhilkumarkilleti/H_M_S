import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function CancerBreastPage() {
  return <TreatmentInformationPage data={treatmentInformation.breastCancer} />;
}

import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function NeurologyDetailPage() {
  return <TreatmentInformationPage data={treatmentInformation.neurology} />;
}

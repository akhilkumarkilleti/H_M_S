import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function KidneyTransplantPage() {
  return <TreatmentInformationPage data={treatmentInformation.kidneyTransplant} />;
}

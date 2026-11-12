import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function VascularSciencesPage() {
  return <TreatmentInformationPage data={treatmentInformation.vascularSciences} />;
}

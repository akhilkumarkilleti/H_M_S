import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function LiverCancerPage() {
  return <TreatmentInformationPage data={treatmentInformation.liverCancer} />;
}

import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function LiverTransplantPage() {
  return <TreatmentInformationPage data={treatmentInformation.liverTransplant} />;
}

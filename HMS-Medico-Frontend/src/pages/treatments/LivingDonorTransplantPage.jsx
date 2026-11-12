import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function LivingDonorTransplantPage() {
  return <TreatmentInformationPage data={treatmentInformation.livingDonorTransplant} />;
}

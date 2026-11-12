import React from "react";
import TreatmentInformationPage from "./TreatmentInformationPage";
import { treatmentInformation } from "./treatmentInformationData";

export default function SportsInjuryPage() {
  return <TreatmentInformationPage data={treatmentInformation.sportsInjury} />;
}

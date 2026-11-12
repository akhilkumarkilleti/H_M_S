import React from "react";
import HospitalNavigation from "./HospitalNavigation";
import HospitalFooter from "./HospitalFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <HospitalNavigation />
      {children}
      <HospitalFooter />
    </div>
  );
}

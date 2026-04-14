import React from "react";
import FarmerIDCard from "../components/FarmerIDCard";
import QRScanner from "../components/QRScanner";

export default function FarmerIDPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Farmer ID System</h2>

      <FarmerIDCard />

      <hr style={{ margin: "30px 0" }} />

      <QRScanner />
    </div>
  );
}
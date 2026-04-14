import React from "react";

export default function FarmerProfile({ data }) {
  if (!data) return null;

  const farmer = JSON.parse(data);

  return (
    <div style={{ padding: 20 }}>
      <h2>Farmer Profile</h2>
      <p><b>Name:</b> {farmer.name}</p>
      <p><b>ID:</b> {farmer.id}</p>
      <p><b>District:</b> {farmer.district}</p>
      <p><b>Crop:</b> {farmer.crop}</p>
      <p><b>Carbon:</b> {farmer.carbon}</p>
    </div>
  );
}
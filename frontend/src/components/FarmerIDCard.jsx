import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

export default function FarmerIDCard() {
  const cardRef = useRef();
  const [photo, setPhoto] = useState(null);
  const { user } = useAuth();

  // ✅ Use login user data instead of hardcoded data
  const calcs   = user?.calculations || [];
  const credits = user?.carbonCredits || 0;
  const totalCO2 = calcs.reduce((sum, c) => sum + (c.result?.waste?.co2Avoided || 0), 0);

  const farmer = {
    name:     user?.name     || 'Farmer',
    id:       'AWN-' + (user?.id || Date.now()),
    district: user?.district || user?.village || 'Maharashtra',
    crop:     user?.cropType
                ? user.cropType.charAt(0).toUpperCase() + user.cropType.slice(1)
                : 'N/A',
    carbon:   totalCO2.toFixed(1) + ' Tons CO₂ Saved',
    mobile:   user?.mobile   || '',
    email:    user?.email    || '',
    landArea: user?.landArea || '',
    role:     user?.role     || 'farmer',
  };

 const qrData = `ID:${farmer.id}|${farmer.name}|${farmer.district}|${farmer.crop}`;

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // base64 — works perfectly with html2canvas
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = "farmer-id.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      useCORS: true,
      backgroundColor: null,
    });
    const img = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [100, 60],
    });
    pdf.addImage(img, "PNG", 0, 0, 100, 60);
    pdf.save("farmer-id.pdf");
  };

  return (
    <div style={{ padding: 20 }}>

      {/* Upload photo */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.83rem', fontWeight: 600, color: '#374151', marginRight: 10 }}>
          📷 Upload Profile Photo:
        </label>
        <input type="file" accept="image/*" onChange={handlePhoto} />
      </div>

      {/* ID Card */}
      <div
        ref={cardRef}
        style={{
          width: 360,
          borderRadius: 16,
          padding: 20,
          background: "linear-gradient(135deg, #2C5F2D, #4CAF50)",
          color: "white",
          position: "relative",
          fontFamily: "DM Sans",
          minHeight: 200,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/images/logo2.png"
            alt="logo"
            style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 6 }}
          />
          <div>
            <div style={{ fontWeight: 800 }}>Government of India</div>
            <div style={{ fontSize: 12 }}>AgriWaste Nexus Farmer ID</div>
            <div style={{ fontSize: 12 }}>Ministry of Agriculture & Farmers Welfare</div>
          </div>
        </div>


        {/* Farmer Info */}
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <img
            src={photo || "https://via.placeholder.com/60"}
            alt="farmer"
            style={{ width: 60, height: 60, borderRadius: "50%", objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{farmer.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>ID: {farmer.id}</div>
            {farmer.mobile && (
              <div style={{ fontSize: 12, opacity: 0.8 }}>📱 +91 {farmer.mobile}</div>
            )}
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              {farmer.role === 'farmer' ? '🧑‍🌾 Farmer' : '🏭 Buyer'}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8 }}>
          <div>📍 {farmer.district}</div>
          <div>🌾 {farmer.crop}{farmer.landArea ? ` · ${farmer.landArea} acres` : ''}</div>
          <div>🌍 {farmer.carbon}</div>
        </div>

        {/* QR Code */}
        <div style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          background: "white",
          padding: 5,
          borderRadius: 8,
        }}>
         <QRCode value={qrData} size={80} level="M" />
        </div>
      </div>

      {/* Download Buttons */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button
          onClick={downloadImage}
          className="btn btn-primary"
        >
          📥 Download Image
        </button>
        <button
          onClick={downloadPDF}
          className="btn btn-outline"
        >
          📄 Download PDF
        </button>
      </div>

    </div>
  );
}
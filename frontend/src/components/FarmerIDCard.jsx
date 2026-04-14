import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

export default function FarmerIDCard() {
  const cardRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const { user } = useAuth();

  const calcs = user?.calculations || [];
  const totalCO2 = calcs.reduce(
    (sum, c) => sum + (c.result?.waste?.co2Avoided || 0),
    0
  );

  const farmer = {
    name: user?.name || "Farmer",
    id: "AWN-" + (user?.id || Date.now()),
    district: user?.district || user?.village || "Maharashtra",
    crop: user?.cropType
      ? user.cropType.charAt(0).toUpperCase() + user.cropType.slice(1)
      : "N/A",
    carbon: totalCO2.toFixed(1) + " Tons CO₂ Saved",
    mobile: user?.mobile || "",
    role: user?.role || "farmer",
  };

 const farmerEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(farmer))));
  const qrData = `http://localhost:3000/verify?data=${farmerEncoded}`;

  // ✅ Upload photo
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Start Camera
  const startCamera = async () => {
  setCameraOn(true); // render video first

  setTimeout(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, 100);
};

  // ✅ Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);

    video.srcObject.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  // ✅ Download Image
  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 4 });
    const link = document.createElement("a");
    link.download = "farmer-id.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ✅ Download PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 4 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [100, 60],
    });

    pdf.addImage(img, "PNG", 0, 0, 100, 60);
    pdf.save("farmer-id.pdf");
  };

  return (
    <div style={{ padding: 20 }}>

      {/* Upload + Camera */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: "0.83rem", fontWeight: 600 }}>
          📷 Upload Profile Photo:
        </label>

        <input type="file" accept="image/*" onChange={handlePhoto} />

        <button
          onClick={startCamera}
          className="btn btn-outline"
          style={{ marginLeft: 10 }}
        >
          📷 Capture Live Photo
        </button>
      </div>

      {/* Camera Preview */}
      {cameraOn && (
        <div style={{ marginBottom: 16 }}>
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "100%", maxWidth: 300 }}
          />
          <br />
          <button onClick={capturePhoto} className="btn btn-primary">
            Capture Photo
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

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
    <div style={{ fontSize: 12 }}>
      Ministry of Agriculture & Farmers Welfare
    </div>
  </div>
</div>
        <div style={{ display: "flex", gap: 12 }}>
          <img
            src={photo || "https://via.placeholder.com/60"}
            alt="farmer"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>{farmer.name}</div>
            <div>ID: {farmer.id}</div>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div>📍 {farmer.district}</div>
          <div>🌾 {farmer.crop}</div>
          <div>🌍 {farmer.carbon}</div>
        </div>

        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <QRCode value={qrData} size={80} />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={downloadImage} className="btn btn-primary">
          📥 Download Image
        </button>

        <button onClick={downloadPDF} className="btn btn-outline">
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}
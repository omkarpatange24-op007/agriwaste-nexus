import React, { useState } from "react";
import QrScanner from "react-qr-scanner";

export default function QRScanner() {
  const [data, setData] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setData(result.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Scan Farmer QR</h3>

      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />

      {data && (
        <div style={{ marginTop: 20 }}>
          <h4>Farmer Data:</h4>
          <pre>{data}</pre>
        </div>
      )}
    </div>
  );
}
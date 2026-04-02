import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Mangana() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const loadCount = useRef(0);

  // 📊 Fetch Google Sheet Data
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/gviz/tq?tqx=out:json&gid=1374275130",
    )
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        const formatted = rows.map((row) => ({
          timestamp: row.c[0]?.v,
          item: row.c[1]?.v,
        }));

        setData(formatted.reverse());
      });
  }, []);

  // 🔄 Refresh after form submit
  const handleLoad = () => {
    loadCount.current += 1;
    if (loadCount.current > 1) {
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔝 Top Bar */}
      <div className="topBar">
        <button className="backBtn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1>Mangana hai</h1>
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 🔥 4 items per row
          gap: "15px",
        }}
      >
        {data.map((row, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              background: "#20ee65",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* 📦 Item */}
            <div style={{ fontSize: "20px", fontWeight: "500" }}>
              {row.item}
            </div>
          </div>
        ))}
      </div>
      {/* 📄 GOOGLE FORM */}
      <div style={{ marginTop: "20px" }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScjV3R2pydxRcqbRReL15DJV4TTtb4x2V3MMzn55ZSfvScNqQ/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          title="Mangana Form"
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}

export default Mangana;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SHEET_URL =
  "https://opensheet.elk.sh/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/Form%20Responses%201";

function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const completedOrders = orders
    .filter((o) => o.status?.toLowerCase() === "completed")
    .filter((o) => o.Number?.replace(/\s/g, "").includes(search))
    .reverse();

  return (
    <div className="completedContainer">
      <div className="topBar">
        <button className="backBtn" onClick={() => navigate("/")}>
          ← Back
        </button>

        <div
          style={{ margin: "10px 0", textAlign: "center", marginLeft: "50px" }}
        >
          <input
            type="text"
            placeholder="Search  Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              width: "250px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="tableWrapper">
          <table className="completedTable">
            <thead>
              <tr>
                <th style={{ backgroundColor: "green" }}>Number</th>
                <th style={{ backgroundColor: "green" }}>Product</th>
                <th style={{ backgroundColor: "green" }}>Price</th>
                <th style={{ backgroundColor: "green" }}>Advance</th>
                <th style={{ backgroundColor: "green" }}>Person</th>
                <th style={{ backgroundColor: "green" }}>Completed</th>
              </tr>
            </thead>

            <tbody>
              {completedOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.Number}</td>
                  <td>{order.Product}</td>
                  <td>₹{order.Price}</td>
                  <td>₹{order.Advance}</td>
                  <td>{order.Banayega}</td>
                  <td>{order.Time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompletedOrders;

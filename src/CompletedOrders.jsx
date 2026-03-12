import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SHEET_URL =
  "https://opensheet.elk.sh/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/Form%20Responses%201";

function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed",
  );

  return (
    <div className="completedContainer">
      <div className="topBar">
        <button className="backBtn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1>Completed Orders</h1>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="tableWrapper">
          <table className="completedTable">
            <thead>
              <tr>
                <th>Number</th>
                <th>Product</th>
                <th>Price</th>
                <th>Advance</th>
                <th>Worker</th>
                <th>Completed Date</th>
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

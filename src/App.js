import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./App.css";

const SHEET_URL =
  "https://opensheet.elk.sh/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/Form%20Responses%201";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwx7FrmYqoTfw8VP5dvmbuGHFLOelkV1Dxx3VklYG2BfZEI25zk1XjOm-CSCJ-k0CqNnw/exec";

function App() {
  const [orders, setOrders] = useState([]);
  const [worker, setWorker] = useState(localStorage.getItem("worker") || "All");

  const [loading, setLoading] = useState(true);
  const [completeLoading, setCompleteLoading] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const res = await fetch(SHEET_URL);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders", err);
    }

    setLoading(false);
  };

  const handleWorkerChange = (value) => {
    setWorker(value);
    localStorage.setItem("worker", value);
  };

  const markComplete = async (timestamp) => {
    setCompleteLoading(timestamp);

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        timestamp: timestamp,
      }),
    });

    setOrders((prev) => prev.filter((o) => o.Timestamp !== timestamp));

    setCompleteLoading(null);
  };

  const activeOrders = orders.filter(
    (o) => o["Column 1"]?.toLowerCase() !== "completed",
  );

  const filteredOrders =
    worker === "All"
      ? activeOrders
      : activeOrders.filter((o) => o.Banayega === worker);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => dayjs(a.Time).valueOf() - dayjs(b.Time).valueOf(),
  );

  const getRemainingDays = (dateStr) => {
    const today = dayjs().startOf("day");
    const target = dayjs(dateStr);

    const days = target.diff(today, "day");

    if (days < 0) return "Late ❗";
    if (days === 0) return "Today ⚡";
    return `${days} days`;
  };

  const sendMessage = (number, product) => {
    const text = "";
    const url = `https://wa.me/91${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Order Dashboard</h1>

        <select
          value={worker}
          onChange={(e) => handleWorkerChange(e.target.value)}
        >
          <option value="All">All Workers</option>
          <option value="Rinku">Rinku</option>
          <option value="Vijay">Vijay</option>
          <option value="Nitesh">Nitesh</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading Orders...</div>
      ) : (
        <div className="tableWrapper">
          <table className="ordersTable">
            <thead>
              <tr>
                <th>Number</th>
                <th>Product</th>
                <th>Price</th>
                <th>Advance</th>
                <th>Worker</th>
                <th>Deadline</th>
                <th>Complete</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.Number}</td>
                  <td>{order.Product}</td>
                  <td>₹{order.Price}</td>
                  <td>₹{order.Advance}</td>
                  <td>{order.Banayega}</td>
                  <td>{getRemainingDays(order.Time)}</td>

                  <td>
                    <button
                      className="completeBtn"
                      disabled={completeLoading === order.Timestamp}
                      onClick={() => markComplete(order.Timestamp)}
                    >
                      {completeLoading === order.Timestamp
                        ? "Processing..."
                        : "Complete"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="msgBtn"
                      onClick={() => sendMessage(order.Number)}
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

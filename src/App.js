import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

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
    <div style={{ padding: "20px" }}>
      <h2>Daily Orders</h2>

      <select
        value={worker}
        onChange={(e) => handleWorkerChange(e.target.value)}
        style={{ marginBottom: "20px", padding: "6px" }}
      >
        <option value="All">All</option>
        <option value="Rinku">Rinku</option>
        <option value="Vijay">Vijay</option>
        <option value="Nitesh">Nitesh</option>
      </select>

      {loading ? (
        <h3>Loading Orders...</h3>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Number</th>
              <th>Product</th>
              <th>Price</th>
              <th>Advance</th>
              <th>Banayega</th>
              <th>Time Left</th>
              <th>Complete</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.Number}</td>
                <td>{order.Product}</td>
                <td>{order.Price}</td>
                <td>{order.Advance}</td>
                <td>{order.Banayega}</td>

                <td>{getRemainingDays(order.Time)}</td>

                <td>
                  <button
                    disabled={completeLoading === order.Timestamp}
                    onClick={() => markComplete(order.Timestamp)}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {completeLoading === order.Timestamp
                      ? "Completing..."
                      : "Complete"}
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => sendMessage(order.Number, order.Product)}
                    style={{
                      background: "blue",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

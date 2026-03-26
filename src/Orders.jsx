import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Stats from "./Stats";
import { useNavigate } from "react-router-dom";

const SHEET_URL =
  "https://opensheet.elk.sh/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/Form%20Responses%201";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwx7FrmYqoTfw8VP5dvmbuGHFLOelkV1Dxx3VklYG2BfZEI25zk1XjOm-CSCJ-k0CqNnw/exec";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [worker, setWorker] = useState(localStorage.getItem("worker") || "All");

  const [loading, setLoading] = useState(true);
  const [completeLoading, setCompleteLoading] = useState(null);
  const [deliveredLoading, setDeliveredLoading] = useState(null);

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

  // ✅ COMPLETE (move to completed section)
  const markComplete = async (timestamp) => {
    setCompleteLoading(timestamp);

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        timestamp: timestamp,
        status: "completed",
      }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.Timestamp === timestamp ? { ...o, status: "completed" } : o,
      ),
    );

    setCompleteLoading(null);
  };

  // ✅ DELIVERED (remove from UI)
  const markDelivered = async (timestamp) => {
    setDeliveredLoading(timestamp);

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        timestamp: timestamp,
        status: "delivered",
      }),
    });

    setOrders((prev) => prev.filter((o) => o.Timestamp !== timestamp));

    setDeliveredLoading(null);
  };

  // 🔥 FILTERS
  const pendingOrders = orders.filter(
    (o) =>
      o.status?.toLowerCase() !== "completed" &&
      o.status?.toLowerCase() !== "delivered",
  );

  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed",
  );

  const filteredPending =
    worker === "All"
      ? pendingOrders
      : pendingOrders.filter((o) => o.Banayega === worker);

  const filteredCompleted =
    worker === "All"
      ? completedOrders
      : completedOrders.filter((o) => o.Banayega === worker);

  // 🔥 SORT pending by deadline
  const sortedPending = [...filteredPending].sort(
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

  const sendMessage = (number) => {
    const text = "Your order is ready ✅";
    const url = `https://wa.me/91${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Order Dashboard</h1>

        <button
          className="neworder"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSfYhQ_tslMOWBHoHwVvJckekoZh107JYP7LOzeLXRp8QR13pg/viewform",
              "_blank",
            )
          }
        >
          New Order
        </button>

        <button
          className="completedorder"
          onClick={() => navigate("/completed")}
        >
          Completed Orders
        </button>

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
        <>
          {/* 🔵 PENDING ORDERS */}
          <h2>Pending Orders</h2>
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
                {sortedPending.map((order, index) => (
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
          {/* 🟢 COMPLETED ORDERS */}
          <h2 className="sectionTitle">Completed Orders</h2>

          <div className="tableWrapper">
            <table className="ordersTable completedTable">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Advance</th>
                  <th>Remaining</th>
                  <th>Worker</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompleted.map((order, index) => {
                  const price = parseInt(order.Price) || 0;
                  const advance = parseInt(order.Advance) || 0;
                  const remaining = price - advance;

                  return (
                    <tr key={index} className="completedRow">
                      <td>{order.Number}</td>
                      <td className="product">{order.Product}</td>

                      <td className="price">₹{price}</td>
                      <td className="advance">₹{advance}</td>
                      <td className="remaining">₹{remaining}</td>

                      <td className="worker">{order.Banayega}</td>

                      <td>
                        <button
                          className="deliveredBtn"
                          disabled={deliveredLoading === order.Timestamp}
                          onClick={() => markDelivered(order.Timestamp)}
                        >
                          {deliveredLoading === order.Timestamp
                            ? "Processing..."
                            : "Delivered"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Stats orders={orders} worker={worker} />
    </div>
  );
}

export default Orders;

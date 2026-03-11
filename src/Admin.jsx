import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const SHEET_URL =
  "https://opensheet.elk.sh/1HAj-VY7qofjhh75XhIU2EpgEICxHaCP6roKljB2UzHc/Form%20Responses%201";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [worker, setWorker] = useState("All");

  const workers = ["Nitesh", "Rinku", "Vijay"];

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const completed = orders.filter(
    (o) => o["Column 1"]?.toLowerCase() === "completed",
  );

  const filteredOrders =
    worker === "All"
      ? completed
      : completed.filter((o) => o.Banayega === worker);

  const getStats = (days) => {
    const start = dayjs().subtract(days, "day");

    if (worker === "All") {
      return workers.map((w) => {
        const workerOrders = completed.filter(
          (o) => o.Banayega === w && dayjs(o.Time).isAfter(start),
        );

        const total = workerOrders.reduce(
          (sum, o) => sum + (parseInt(o.Price) || 0),
          0,
        );

        return {
          worker: w,
          count: workerOrders.length,
          amount: total,
        };
      });
    }

    const workerOrders = filteredOrders.filter((o) =>
      dayjs(o.Time).isAfter(start),
    );

    const total = workerOrders.reduce(
      (sum, o) => sum + (parseInt(o.Price) || 0),
      0,
    );

    return [
      {
        worker,
        count: workerOrders.length,
        amount: total,
      },
    ];
  };

  const last30 = getStats(30);

  // last 15 days production
  const getLast15Days = () => {
    const stats = [];

    for (let i = 0; i < 15; i++) {
      const day = dayjs().subtract(i, "day").format("YYYY-MM-DD");

      const dayOrders = filteredOrders.filter(
        (o) => dayjs(o.Time).format("YYYY-MM-DD") === day,
      );

      const total = dayOrders.reduce(
        (sum, o) => sum + (parseInt(o.Price) || 0),
        0,
      );

      stats.push({
        date: day,
        count: dayOrders.length,
        amount: total,
      });
    }

    return stats.reverse();
  };

  const last15 = getLast15Days();

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (parseInt(o.Price) || 0),
    0,
  );

  return (
    <div className="adminContainer">
      <h1>Admin Dashboard</h1>

      {/* Worker Select */}
      <select value={worker} onChange={(e) => setWorker(e.target.value)}>
        <option value="All">All Workers</option>
        {workers.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      {/* Summary */}
      <div className="summaryCards">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{filteredOrders.length}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
      </div>

      {/* Last 30 Days */}
      <div className="statsSection">
        <h2>Last 30 Days Worker Performance</h2>

        {last30.map((w) => (
          <div className="row" key={w.worker}>
            <span>{w.worker}</span>
            <span>{w.count} orders</span>
            <span>₹{w.amount}</span>
          </div>
        ))}
      </div>

      {/* Last 15 Days */}
      <div className="statsSection">
        <h2>Last 15 Days Production</h2>

        {last15.map((d) => (
          <div className="row" key={d.date}>
            <span>{d.date}</span>
            <span>{d.count} orders</span>
            <span>₹{d.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

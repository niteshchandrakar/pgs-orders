import dayjs from "dayjs";

function Stats({ orders, worker }) {
  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed",
  );

  const workerOrders =
    worker === "All"
      ? completedOrders
      : completedOrders.filter((o) => o.Banayega === worker);

  // last 30 days
  const getLast30DaysStats = () => {
    const today = dayjs();
    const last30 = today.subtract(30, "day");

    const last30Orders = workerOrders.filter((o) =>
      dayjs(o.complete).isAfter(last30),
    );

    const totalAmount = last30Orders.reduce(
      (sum, o) => sum + (parseInt(o.Price) || 0),
      0,
    );

    return {
      count: last30Orders.length,
      amount: totalAmount,
    };
  };

  // last 5 days
  const getLast5DaysStats = () => {
    const today = dayjs();
    const stats = [];

    for (let i = 0; i < 5; i++) {
      const day = today.subtract(i, "day").format("YYYY-MM-DD");

      const dayOrders = workerOrders.filter(
        (o) => dayjs(o.complete).format("YYYY-MM-DD") === day,
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

  const last30 = getLast30DaysStats();
  const last5Days = getLast5DaysStats();

  return (
    <div className="statsBox">
      <h2>Last 30 Days</h2>
      <div>
        {worker} → {last30.count} orders
      </div>

      <h2>Last 5 Days</h2>

      {last5Days.map((d) => (
        <div key={d.date}>
          {d.date} → {d.count} orders | ₹{d.amount}
        </div>
      ))}
    </div>
  );
}

export default Stats;

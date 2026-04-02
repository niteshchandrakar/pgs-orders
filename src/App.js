import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./Admin";
import "./App.css";
import Orders from "./Orders";
import CompletedOrders from "./CompletedOrders";
import Mangana from "./components/Mangana";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/completed" element={<CompletedOrders />} />
        <Route path="/mangana" element={<Mangana />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

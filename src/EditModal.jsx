import React, { useState, useEffect } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwx7FrmYqoTfw8VP5dvmbuGHFLOelkV1Dxx3VklYG2BfZEI25zk1XjOm-CSCJ-k0CqNnw/exec";

function EditModal({ isOpen, onClose, order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Number: "",
    Product: "",
    Price: "",
    Advance: "",
    Banayega: "",
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          type: "edit",
          timestamp: order.Timestamp,
          data: formData,
        }),
      });

      onUpdate(formData);
      onClose();
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <h2 className="modalTitle">Edit Order</h2>

        <div className="formGroup">
          <label>Customer Number</label>
          <input
            name="Number"
            value={formData.Number}
            onChange={handleChange}
            placeholder="Enter number"
          />
        </div>

        <div className="formGroup">
          <label>Product</label>
          <input
            name="Product"
            value={formData.Product}
            onChange={handleChange}
            placeholder="Enter product"
          />
        </div>

        <div className="formGroup">
          <label>Price</label>
          <input
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>

        <div className="formGroup">
          <label>Advance</label>
          <input
            name="Advance"
            value={formData.Advance}
            onChange={handleChange}
            placeholder="Enter advance"
          />
        </div>

        <div className="formGroup">
          <label>Worker</label>
          <select
            name="Banayega"
            value={formData.Banayega}
            onChange={handleChange}
          >
            <option value="">Select Worker</option>
            <option value="Rinku">Rinku</option>
            <option value="Vijay">Vijay</option>
            <option value="Nitesh">Nitesh</option>
          </select>
        </div>

        <div className="modalActions">
          <button className="saveBtn" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="loader"></span> : "Save Changes"}
          </button>
          <button className="cancelBtn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;

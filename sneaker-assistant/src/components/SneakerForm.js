import React from "react";

const SneakerForm = ({ budget, colors, setBudget, setColors, handleSubmit }) => {
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Colors (comma-separated)"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />
        <button className="button" type="submit">
          Search Sneakers
        </button>
      </form>
    </div>
  );
};

export default SneakerForm;

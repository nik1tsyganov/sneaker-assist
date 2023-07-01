import React from "react";
import '../App.css';

const SneakerResults = ({ results }) => {
  return (
    <div>
      {results && (
        <table id="results" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Sneaker Name</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {results.map((sneaker, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sneaker.name}</td>
                <td>
                  <img
                    src={sneaker.imageUrl || "#"}
                    alt={sneaker.name}
                    style={{ maxWidth: "500px" }}
                    className="rounded-image"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SneakerResults;

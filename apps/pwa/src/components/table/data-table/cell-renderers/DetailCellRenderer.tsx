/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const DetailCellRenderer = (params: any) => (
  <div style={{ padding: 20, backgroundColor: "#f0f0f0" }}>
    <h4>Details for {params.data.name}</h4>
    <p>{params.data.details.description}</p>
    <ul>
      {params.data.details.properties.map((prop, index) => (
        <li key={index}>{prop}</li>
      ))}
    </ul>
  </div>
);

export default DetailCellRenderer;

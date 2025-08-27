import React from "react";

function JsonTable({data})
 {
    if (!data || data.length ===0){return <p>no data ❌</p>}
  return (
    <div style={{ padding: "1rem" }}>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
           {data.map((row, rowindex) => (
          <tr key={rowindex}>
        {Object.values(row).map((value, cellindex) => (
          <td key={cellindex}>{String(value)}</td>
        ))}
        </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default JsonTable;

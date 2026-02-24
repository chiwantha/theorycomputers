import React from "react";

const Table = ({ colunms, rows, searchkeys, tablename }) => {
  console.log(colunms);
  console.log(rows);
  return (
    <table className="">
      <thead>
        <tr>
          {colunms.map((col, index) => (
            <th key={index} title={col.data_name} className="text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {colunms.map((dn, index) => (
              <td>{row[dn.data_name]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

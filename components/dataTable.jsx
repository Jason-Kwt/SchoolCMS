/* import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';

export default function dataTable({ data, handleEdit }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleButtonClick = () => {
    console.log('btn action clicked');
  };

  const handleChange = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const colums = useMemo(
    () => [
      {
        cell: (row) => (
          <button onClick={() => alert(`${row.name}`)}>Edit</button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
      {
        name: 'Name',
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: 'SID',
        selector: (row) => row.sid,
        sortable: true,
      },
      {
        name: 'Age',
        selector: (row) => row.age,
        sortable: true,
      },
    ],
    [],
  );

  useEffect(() => {
    console.log('state', selectedRows);
  }, [selectedRows]);

  return (
    <div>
      <DataTable
        columns={colums}
        data={data}
        selectableRows
        onSelectedRowsChange={handleChange}
        fixedHeader
        pagination
        persistTableHead
      ></DataTable>
    </div>
  );
}
 */

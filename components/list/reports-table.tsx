"use client"

const ReportsTable = ({ people, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID (Cédula)</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {(people ?? []).map((person, index) => {
            const key = person?.id ?? `person-${index}`;

            return (
              <tr key={key} onClick={() => onRowClick(person?.id)}>
                <td>{person?.name ?? 'N/A'}</td>
                <td>{person?.document ?? 'ID Desconocido'}</td>
                <td>{person?.status ?? 'Estado Desconocido'}</td>
                <td>{person?.timestamp ?? 'Tiempo Desconocido'}</td>
              </tr>
            );
          })}
          {(people?.length ?? 0) === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No se encontraron registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportsTable
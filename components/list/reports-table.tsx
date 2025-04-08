"use client"

const ReportsTable = ({ people, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID (Cédula)</th>
            <th>Reportes Altos</th>
            <th>Reportes Medios</th>
            <th>Reportes Bajos</th>
            <th>Crímenes (Europol)</th>
          </tr>
        </thead>
        <tbody>
          {(people ?? []).map((person, index) => {
            const highReportsCount = person?.dict_hallazgos?.altos?.length ?? 0;
            const mediumReportsCount = person?.dict_hallazgos?.medios?.length ?? 0;
            const lowReportsCount = person?.dict_hallazgos?.bajos?.length ?? 0;
            const crimesList = person?.europol?.crimes ?? [];
            const key = person?.id ?? `person-${index}`;

            return (
              <tr key={key} onClick={() => onRowClick(person)}>
                <td>{person?.nombre ?? 'N/A'}</td>
                <td>{person?.id ?? 'ID Desconocido'}</td>
                <td className={highReportsCount > 0 ? "high-alert" : ""}>
                  {highReportsCount}
                </td>
                <td className={mediumReportsCount > 0 ? "medium-alert" : ""}>
                  {mediumReportsCount}
                </td>
                <td className={lowReportsCount > 0 ? "low-alert" : ""}>
                  {lowReportsCount}
                </td>
                <td>{crimesList.join(", ")}</td>
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
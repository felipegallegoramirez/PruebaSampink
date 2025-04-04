// components/list/reports-table.tsx (o donde corresponda)

"use client"

// Asumiendo que el tipo ApiResponse está definido en otro lugar e importado si es necesario,
// aunque en este archivo no se usa explícitamente para tipar props según la solicitud.

const ReportsTable = ({ people, onRowClick }) => {
  // people es ahora un array de objetos ApiResponse (o un tipo compatible)
  // donde todas las propiedades son opcionales.

  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            {/* Los encabezados se mantienen igual */}
            <th>Name</th>
            <th>ID (Cedula)</th>
            <th>High Reports</th>
            <th>Medium Reports</th>
            <th>Low Reports</th>
            <th>Crimes (Europol)</th> {/* Actualizado para claridad */}
          </tr>
        </thead>
        <tbody>
          {/* Asegurarse de que 'people' exista antes de mapear si pudiera ser null/undefined */}
          {(people ?? []).map((person, index) => {
             // Derivar los conteos de forma segura
            const highReportsCount = person?.dict_hallazgos?.altos?.length ?? 0;
            const mediumReportsCount = person?.dict_hallazgos?.medios?.length ?? 0;
            const lowReportsCount = person?.dict_hallazgos?.bajos?.length ?? 0;
            // Obtener los crímenes de forma segura
            const crimesList = person?.europol?.crimes ?? [];

            // Usar person.id si existe, de lo contrario un fallback como el índice (menos ideal pero seguro)
            const key = person?.id ?? `person-${index}`;

            return (
              <tr key={key} onClick={() => onRowClick(person)}>
                {/* Usar '??' para valores por defecto en caso de undefined/null */}
                <td>{person?.nombre ?? 'N/A'}</td>
                <td>{person?.id ?? 'Unknown ID'}</td>

                {/* Usar los conteos derivados para el valor y la clase */}
                <td className={highReportsCount > 0 ? "high-alert" : ""}>
                  {highReportsCount}
                </td>
                <td className={mediumReportsCount > 0 ? "medium-alert" : ""}>
                  {mediumReportsCount}
                </td>
                <td className={lowReportsCount > 0 ? "low-alert" : ""}>
                  {lowReportsCount}
                </td>

                {/* Unir la lista de crímenes, asegurándose de que sea un array */}
                <td>{crimesList.join(", ")}</td>
              </tr>
            );
          })}
          {/* Opcional: Mostrar un mensaje si no hay personas */}
          {(people?.length ?? 0) === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportsTable
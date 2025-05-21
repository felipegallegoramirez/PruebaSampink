"use client"

const ReportsTable = ({ people, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Tipo de Documento</th>
            <th>ID</th>
            <th>Estado</th>
            <th>Altos</th>
            <th>Medios</th>
            <th>Bajos</th>
            <th>Fecha de Consulta</th>
          </tr>
        </thead>
        <tbody>
          {(people ?? []).map((person, index) => {
            const key = person?.id ?? `person-${index}`;

            return (
              <tr key={key} onClick={() => onRowClick(person?.id)}>
                <td>{person?.typedoc ?? 'N/A'}</td>
                <td>{person?.document ?? 'ID Desconocido'}</td>
                <td>{person?.status ?? 'Estado Desconocido'}</td>
                <td
                  style={{
                    backgroundColor: person?.hallazgos_altos > 0 ? '#ffcccc' : undefined,
                  }}
                >
                  {person?.hallazgos_altos ?? 0}
                </td>
                <td
                  style={{
                    backgroundColor: person?.hallazgos_medios > 0 ? '#fff7cc' : undefined,
                  }}
                >
                  {person?.hallazgos_medios ?? 0}
                </td>
                <td
                  style={{
                    backgroundColor: person?.hallazgos_bajos > 0 ? '#ccffcc' : undefined,
                  }}
                >
                  {person?.hallazgos_bajos ?? 0}
                </td>
                <td>{person?.timestamp ?? 'Tiempo Desconocido'}</td>
              </tr>
            );
          })}
          {(people?.length ?? 0) === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>No se encontraron registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportsTable
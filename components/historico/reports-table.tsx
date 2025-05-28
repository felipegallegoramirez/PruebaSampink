"use client"

const ReportsTable = ({ people, onRowClick, sortConfig, setSortConfig }) => {
  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        const nextDirection =
          prev.direction === "none" ? "asc" :
            prev.direction === "asc" ? "desc" :
              "none"
        return { key: columnKey, direction: nextDirection }
      }
      return { key: columnKey, direction: "asc" }
    })
  }
  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "–"
    if (sortConfig.direction === "asc") return "↑"
    if (sortConfig.direction === "desc") return "↓"
    return "–"
  }
  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Tipo de Documento</th>
            <th>ID</th>
            <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
              Estado {getSortSymbol("status")}
            </th>
            <th onClick={() => handleSort("hallazgos_altos")} style={{ cursor: "pointer" }}>
              Altos {getSortSymbol("hallazgos_altos")}
            </th>
            <th onClick={() => handleSort("hallazgos_medios")} style={{ cursor: "pointer" }}>
              Medios {getSortSymbol("hallazgos_medios")}
            </th>
            <th onClick={() => handleSort("hallazgos_bajos")} style={{ cursor: "pointer" }}>
              Bajos {getSortSymbol("hallazgos_bajos")}
            </th>
            <th onClick={() => handleSort("timestamp")} style={{ cursor: "pointer" }}>
              Fecha de Consulta {getSortSymbol("timestamp")}
            </th>
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
"use client"

import { useState, useEffect } from "react"
import PersonModal from "@/components/historico/person-modal"
import ReportsTable from "@/components/historico/reports-table"
import FilterPanel from "@/components/historico/filter-panel"
import { getStatus, getData, getPerson } from "@/services/table"
import "./styles.css"

export default function Home() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" })
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [peopleDataState, setPeopleDataState] = useState<any[]>([])
  const [filteredPeople, setFilteredPeople] = useState<any[]>([])
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    includeHigh: false,
    includeMedium: false,
    includeLow: false,
  })
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);

  const checkStatus = async () => {
    const id = localStorage.getItem("idUser")
    if (!id) {
      setError("No se encontró el ID del trabajo.")
      setStatus("error")
      return
    }

    try {
      const response = await getStatus(id)
      if (response.status !== "success") {
        setStatus("procesando")
        setTimeout(checkStatus, 10000)
      } else {
        const data = await getData(id)
        if (data?.checks && Array.isArray(data.checks)) {
          setPeopleDataState(data.checks)
          setStatus("finalizado")
        } else {
          setError("Los datos no tienen el formato esperado.")
          setPeopleDataState([])
          setStatus("error")
        }
      }
    } catch (err: any) {
      setError("Error al obtener los datos: " + err.message)
      setStatus("error")
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  useEffect(() => {
    let result = peopleDataState

    // FILTROS
    if (fechaInicio || fechaFin) {
      result = result.filter((person) => {
        const fechaPersona = person?.timestamp
        if (!fechaPersona) return false

        const fecha = new Date(fechaPersona.replace(" ", "T"))
        const desde = fechaInicio ? new Date(fechaInicio + "T00:00:00") : null
        const hasta = fechaFin ? new Date(fechaFin + "T23:59:59") : null

        if (desde && fecha < desde) return false
        if (hasta && fecha > hasta) return false

        return true
      })
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (person) => (person?.status?.toLowerCase() ?? "") === statusFilter
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        person =>
          (person?.document?.toString().toLowerCase() ?? "").includes(term)
      )
    }

    const { includeHigh, includeMedium, includeLow } = advancedFilters
    if (includeHigh || includeMedium || includeLow) {
      result = result.filter((person) => {
        const altos = person?.hallazgos_altos ?? 0
        const medios = person?.hallazgos_medios ?? 0
        const bajos = person?.hallazgos_bajos ?? 0

        return (
          (includeHigh && altos > 0) ||
          (includeMedium && medios > 0) ||
          (includeLow && bajos > 0)
        )
      })
    }

    // ORDENAMIENTO
    if (sortConfig.key && sortConfig.direction !== "none") {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key] ?? 0
        const valB = b[sortConfig.key] ?? 0

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredPeople(result)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [searchTerm, statusFilter, advancedFilters, peopleDataState, fechaInicio, fechaFin, sortConfig])

  const handleRowClick = async (id: string) => {
    try {
      const person = await getPerson(id)
      setSelectedPerson(person)
      setSelectedCheckId(id)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error al obtener datos de la persona:", error)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <main className="app-container">
        <div className="app-header text-left">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Entity Watcher</h1>
          <p className="app-subtitle">Plataforma integral de monitoreo y reportes</p>
        </div>

        <div className="content-container">
          <div className="filters-container">
            <div className="basic-filters">
              <input
                type="text"
                placeholder="Buscar por ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <div className="category-filter">
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="category-select w-full p-2 border border-gray-300 rounded"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="date-range-filter flex gap-2 items-center">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                  placeholder="Desde"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                  placeholder="Hasta"
                />
              </div>
              <button
                className="advanced-filters-button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? "Ocultar Filtros Avanzados" : "Filtros Avanzados"}
              </button>
            </div>

            {showAdvancedFilters && (
              <FilterPanel
                filters={advancedFilters}
                onFilterChange={setAdvancedFilters}
              />
            )}
          </div>

          {status === "procesando" && <div className="loading-message">Cargando datos...</div>}
          {status === "error" && <div className="error-message">{error}</div>}
          {status === "finalizado" && (
            <div className="results-info">
              Mostrando {filteredPeople.length} de {peopleDataState.length} registros
            </div>
          )}

          {status === "finalizado" && filteredPeople.length > 0 ? (
            <ReportsTable people={filteredPeople} onRowClick={handleRowClick} sortConfig={sortConfig}
              setSortConfig={setSortConfig} />
          ) : status === "finalizado" && filteredPeople.length === 0 ? (
            <div className="no-data-message">No se encontraron datos para mostrar.</div>
          ) : null}

          {isModalOpen && selectedPerson && (
            <PersonModal person={selectedPerson} checkId={selectedCheckId} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </main>
    </div>
  )
}
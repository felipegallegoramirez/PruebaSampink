"use client"

import { useState, useEffect } from "react"
import PersonModal from "@/components/list/person-modal"
import ReportsTable from "@/components/list/reports-table"
import FilterPanel from "@/components/list/filter-panel"
import "./styles.css"
import { getStatus, getData } from "@/services/table"
import LayoutClient from "../LayoutClient"

const peopleData = [{}]

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    minHighReports: 0,
    minMediumReports: 0,
    minLowReports: 0,
    specificCrimes: [],
  })
  const [filteredPeople, setFilteredPeople] = useState(peopleData)
  const [peopleDataState, setPeopleDataState] = useState(peopleData)
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const checkStatus = async () => {
    const id = localStorage.getItem("id")
    if (!id) {
      setError("No se encontró el ID del trabajo en el almacenamiento local.")
      return
    }

    try {
      console.log("Enviando solicitud para obtener el estado con el ID:", id);
      const response = await getStatus(id)
      console.log("Respuesta recibida del estado:", response);

      if (response.estado === "procesando") {
        console.log("El estado es 'procesando'. Reintentando en 10 segundos...")
        setTimeout(checkStatus, 10000)
      }
      else if (response.estado === "finalizado") {
        console.log("El estado es 'finalizado'. Obteniendo datos...")
        const data = await getData(id)
        console.log("Datos recibidos:", data);
        setPeopleDataState([data])
        setResults(data)
        setStatus("finalizado")
      }
      else {
        console.log("Estado inesperado:", response.estado)
        setStatus(response.estado)
        setError("Estado inesperado: " + response.estado)
      }
    } catch (error) {
      console.error("Error al verificar el estado o al obtener los datos:", error.message)
      setError("Error al verificar el estado o al obtener los datos: " + error.message)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  useEffect(() => {
    let result = peopleDataState

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (person) =>
          (person?.nombre?.toLowerCase() ?? "").includes(term) ||
          (person?.id?.toLowerCase() ?? "").includes(term),
      )
    }

    if (categoryFilter !== "all") {
      switch (categoryFilter) {
        case "highReports":
          result = result.filter((person) => (person?.dict_hallazgos?.altos?.length ?? 0) > 0)
          break
        case "mediumReports":
          result = result.filter((person) => (person?.dict_hallazgos?.medios?.length ?? 0) > 0)
          break
        case "lowReports":
          result = result.filter((person) => (person?.dict_hallazgos?.bajos?.length ?? 0) > 0)
          break
        case "crimes":
          result = result.filter((person) => (person?.europol?.crimes?.length ?? 0) > 0)
          break
      }
    }

    if (showAdvancedFilters) {
      result = result.filter(
        (person) =>
          (person?.dict_hallazgos?.altos?.length ?? 0) >= advancedFilters.minHighReports &&
          (person?.dict_hallazgos?.medios?.length ?? 0) >= advancedFilters.minMediumReports &&
          (person?.dict_hallazgos?.bajos?.length ?? 0) >= advancedFilters.minLowReports,
      )

      if (advancedFilters.specificCrimes.length > 0) {
        result = result.filter((person) =>
          (person?.europol?.crimes ?? []).some((crime) =>
            crime && advancedFilters.specificCrimes.includes(crime)
          )
        )
      }
    }

    setFilteredPeople(result)
  }, [searchTerm, categoryFilter, advancedFilters, showAdvancedFilters, peopleDataState])

  const handleRowClick = (person) => {
    setSelectedPerson(person)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPerson(null)
  }

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters)
  }

  const handleAdvancedFilterChange = (newFilters) => {
    setAdvancedFilters(newFilters)
  }

  return (
    <div>
      <LayoutClient children={undefined}></LayoutClient>
      <main className="app-container">
        <div className="app-header text-left">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Entity Watcher
          </h1>
          <p className="app-subtitle">Plataforma integral de monitoreo y reportes</p>
        </div>

        <div className="content-container">
          <div className="filters-container">
            <div className="basic-filters">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar por Nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="category-filter">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="category-select"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="highReports">Reportes Altos {'>'} 0</option>
                  <option value="mediumReports">Reportes Medios {'>'} 0</option>
                  <option value="lowReports">Reportes Bajos {'>'} 0</option>
                  <option value="crimes">Con Crímenes</option>
                </select>
              </div>

              <button className="advanced-filters-button" onClick={toggleAdvancedFilters}>
                {showAdvancedFilters ? "Ocultar Filtros Avanzados" : "Filtros Avanzados"}
              </button>
            </div>

            {showAdvancedFilters && (
              <FilterPanel
                filters={advancedFilters}
                onFilterChange={handleAdvancedFilterChange}
              // availableCrimes={allCrimes}
              />
            )}
          </div>

          <div className="results-info">
            Mostrando {filteredPeople.length} de {peopleDataState?.length ?? 0} registros
          </div>

          <ReportsTable people={filteredPeople} onRowClick={handleRowClick} />
        </div>

        {isModalOpen && selectedPerson && (
          <PersonModal person={selectedPerson} onClose={closeModal} />
        )}
      </main>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import PersonModal from "@/components/list/person-modal"
import ReportsTable from "@/components/list/reports-table"
import FilterPanel from "@/components/list/filter-panel"
import "./styles.css"
import { getStatus, getData } from "@/services/table"

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
      setError("No job ID found in localStorage.")
      return
    }

    try {
      console.log("Sending request to getStatus with ID:", id); // Log the request
      const response = await getStatus(id)
      console.log("Received response from getStatus:", response); // Log the response

      if (response.estado === "procesando") {
        console.log("Status is 'procesando'. Retrying in 10 seconds...")
        setTimeout(checkStatus, 10000)
      } else if (response.estado === "finalizado") {
        console.log("Status is 'finalizado'. Fetching data...")
        const data = await getData(id)
        console.log("Received data from getData:", data); // Log the data response
        setPeopleDataState([data])
        setResults(data)
        setStatus("finalizado")
      } else {
        console.log("Unexpected status:", response.estado)
        setStatus(response.estado)
        setError("Unexpected status: " + response.estado)
      }
    } catch (error) {
      console.error("Error checking status or fetching data:", error.message)
      setError("Error checking status or fetching data: " + error.message)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  // useEffect(() => {
  //   console.log("Updated status:", status);
  // }, [status]);
  
  // useEffect(() => {
  //   console.log("Updated results:", results);
  // }, [results]);

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

  // const allCrimes = Array.from(
  //   new Set(
  //     peopleDataState.flatMap(person => person?.europol?.crimes ?? [])
  //                    .filter(crime => crime)
  //   )
  // )

  return (
    <main className="app-container">
      <div className="app-header">
        <h1>Risk Intelligence System</h1>
        <p className="app-subtitle">Comprehensive monitoring and reporting platform</p>
      </div>

      <div className="content-container">
        <div className="filters-container">
          <div className="basic-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by Name or ID..."
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
                <option value="all">All Categories</option>
                <option value="highReports">High Reports {'>'} 0</option>
                <option value="mediumReports">Medium Reports {'>'} 0</option>
                <option value="lowReports">Low Reports {'>'} 0</option>
                <option value="crimes">Has Crimes</option>
              </select>
            </div>

            <button className="advanced-filters-button" onClick={toggleAdvancedFilters}>
              {showAdvancedFilters ? "Hide Advanced Filters" : "Advanced Filters"}
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
          Showing {filteredPeople.length} of {peopleDataState?.length ?? 0} records
        </div>

        <ReportsTable people={filteredPeople} onRowClick={handleRowClick} />
      </div>

      {isModalOpen && selectedPerson && (
        <PersonModal person={selectedPerson} onClose={closeModal} />
      )}
    </main>
  )
}

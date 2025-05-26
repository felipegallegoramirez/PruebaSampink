"use client"

import { useState, useEffect } from "react"
import PersonModal from "@/components/historico/person-modal"
import ReportsTable from "@/components/historico/reports-table"
import FilterPanel from "@/components/historico/filter-panel"
import "./styles.css"
// Asegúrate de que estas funciones devuelvan los datos y el estado esperados
import { getStatus, getData, getPerson } from "@/services/table"

// Inicializamos con un array vacío, ya que los datos vendrán de la API
// const peopleData = [{}] // Eliminamos esta inicialización fija
const peopleData = []

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
    specificCrimes: [], // Asumo que 'specificCrimes' se llenará con datos disponibles
  })
  // Inicializamos con un array vacío
  const [filteredPeople, setFilteredPeople] = useState(peopleData)
  // Inicializamos con un array vacío
  const [peopleDataState, setPeopleDataState] = useState(peopleData)
  const [status, setStatus] = useState(null) // Puede ser 'procesando', 'finalizado', 'error'
  const [results, setResults] = useState(null) // Para guardar los resultados crudos si es necesario
  const [error, setError] = useState(null)
  // Estado para almacenar todos los posibles crímenes para el filtro avanzado
  const [allCrimes, setAllCrimes] = useState([]);


  const checkStatus = async () => {
    const id = localStorage.getItem("idUser") // Obtiene el ID del trabajo/proceso
    if (!id) {
      setError("No se encontró el ID del trabajo en el almacenamiento local.")
      setStatus("error"); // Establecer el estado a error
      return
    }

    try {
      console.log("Enviando solicitud para obtener el estado con el ID:", id);
      const response = await getStatus(id) // Llama a tu servicio para obtener el estado
      console.log("Respuesta recibida del estado:", response);

      // Si el estado indica que aún está procesando, reintenta
      if (response.status !== "success") {
        console.log("El estado es 'procesando'. Reintentando en 10 segundos...")
        setStatus("procesando"); // Establecer el estado a procesando
        setTimeout(checkStatus, 10000) // Reintentar después de 10 segundos
      }
      // Si el estado indica éxito, obtiene los datos
      else if (response.status === "success") {
        console.log("El estado es 'finalizado'. Obteniendo datos...")
        const data = await getData(id) // Llama a tu servicio para obtener los datos finales
        console.log("Datos recibidos:", data); // data ahora contendrá data.checks
        // Verificar si data.checks es un array y usarlo para peopleDataState
        if (data && Array.isArray(data.checks)) {
          console.log("data.checks recibidos:", data.checks.length, "elementos");
          // Establecemos peopleDataState directamente con el array data.checks
          // Asumimos que cada objeto en data.checks tiene al menos 'document', 'timestamp', 'status'
          // y los campos necesarios para los filtros ('id', 'nombre', 'dict_hallazgos', 'europol')
          setPeopleDataState(data.checks);

          // También puedes guardar los resultados crudos si los necesitas
          setResults(data.checks);

          // Opcional: Recolectar todos los crímenes únicos para el filtro avanzado
          const uniqueCrimes = new Set();
          data.checks.forEach(person => {
            if (person.europol && Array.isArray(person.europol.crimes)) {
              person.europol.crimes.forEach(crime => {
                if (crime) uniqueCrimes.add(crime);
              });
            }
          });
          setAllCrimes(Array.from(uniqueCrimes));

          setStatus("finalizado"); // Establecer el estado a finalizado

        } else {
          // Manejar el caso en que data o data.checks no sean lo esperado
          console.error("Error: Los datos de los checks no tienen el formato esperado.", data);
          setError("Error al procesar los datos de los checks.");
          setStatus("error"); // Establecer el estado a error
          setPeopleDataState([]); // Asegurarse de que el estado es un array vacío
        }
        // --- FIN MODIFICACIÓN ---

      }
      // Si el estado es inesperado
      else {
        console.log("Estado inesperado:", response.status)
        setStatus(response.status) // Establecer el estado al valor inesperado
        setError("Estado inesperado: " + response.status)
      }
    } catch (error) {
      console.error("Error al verificar el estado o al obtener los datos:", error.message)
      setError("Error al verificar el estado o al obtener los datos: " + error.message)
      setStatus("error"); // Establecer el estado a error en caso de excepción
    }
  }

  // Efecto para iniciar la verificación del estado al cargar la página
  useEffect(() => {
    checkStatus()
    // La dependencia vacía [] asegura que esto solo se ejecute una vez al montar el componente
  }, [])

  // Efecto para filtrar los datos cada vez que los filtros o los datos originales cambian
  useEffect(() => {
    let result = peopleDataState // Empezar con los datos completos recibidos

    // Filtro por término de búsqueda (nombre o id)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (person) =>
          // Usamos optional chaining (?.) y nullish coalescing (?? "")
          // para evitar errores si las propiedades no existen
          (person?.nombre?.toLowerCase() ?? "").includes(term) ||
          (person?.id?.toLowerCase() ?? "").includes(term)
        // Si los checks tienen 'document', podrías querer buscar también por ahí:
        // (person?.document?.toLowerCase() ?? "").includes(term)
      )
    }

    // Filtro por categoría (altos, medios, bajos, crímenes)
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

    // Filtros avanzados (mínimos reportes por nivel, crímenes específicos)
    if (showAdvancedFilters) {
      result = result.filter(
        (person) =>
          (person?.dict_hallazgos?.altos?.length ?? 0) >= advancedFilters.minHighReports &&
          (person?.dict_hallazgos?.medios?.length ?? 0) >= advancedFilters.minMediumReports &&
          (person?.dict_hallazgos?.bajos?.length ?? 0) >= advancedFilters.minLowReports,
      )

      if (advancedFilters.specificCrimes.length > 0) {
        result = result.filter((person) =>
          // Verificar si la persona tiene un array de crímenes y si alguno de ellos
          // está incluido en los crímenes específicos seleccionados
          (person?.europol?.crimes ?? []).some((crime) =>
            crime && advancedFilters.specificCrimes.includes(crime)
          )
        )
      }
    }

    setFilteredPeople(result) // Actualizar los datos filtrados

    window.scrollTo({ top: 0, behavior: 'smooth' })

  }, [searchTerm, categoryFilter, advancedFilters, showAdvancedFilters, peopleDataState]) // Dependencias del efecto

  // Manejar clic en una fila de la tabla
  const handleRowClick = async (id) => {
    // Aquí asumimos que 'id' es suficiente para obtener los datos completos de una persona
    // Si los objetos en peopleDataState ya tienen todos los datos, podrías buscarlo ahí en lugar de llamar a getPerson
    try {
      console.log("id:", id)
      const person = await getPerson(id); // Llama a tu servicio para obtener datos detallados de la persona
      console.log("person:", person)
      setSelectedPerson(person)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error al obtener datos de la persona:", error);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  }

  // Cerrar el modal de detalles de la persona
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPerson(null) // Limpiar la persona seleccionada al cerrar el modal
  }

  // Alternar la visibilidad de los filtros avanzados
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters)
  }

  // Manejar cambios en los filtros avanzados
  const handleAdvancedFilterChange = (newFilters) => {
    setAdvancedFilters(newFilters)
  }

  return (
    <div>
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <main className="app-container">
          <div className="app-header text-left">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Entity Watcher</h1>
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
                  availableCrimes={allCrimes}
                />
              )}
            </div>

            {/* Mostrar estado de carga y errores */}
            {status === "procesando" && <div className="loading-message">Cargando datos...</div>}
            {status === "error" && error && <div className="error-message">{error}</div>}
            {status === "finalizado" && (
              <div className="results-info">
                Mostrando {filteredPeople.length} de {peopleDataState?.length ?? 0} registros
              </div>
            )}

            {/* Tabla o mensaje de no datos */}
            {status === "finalizado" && peopleDataState.length > 0 ? (
              <ReportsTable people={filteredPeople} onRowClick={handleRowClick} />
            ) : status === "finalizado" && peopleDataState.length === 0 ? (
              <div className="no-data-message">No se encontraron datos para mostrar.</div>
            ) : null}
          </div>

          {/* Modal */}
          {isModalOpen && selectedPerson && (
            <PersonModal person={selectedPerson} onClose={closeModal} />
          )}
        </main>
      </div>
    </div>
  );
}
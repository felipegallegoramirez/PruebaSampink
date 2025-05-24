"use client"

import { useState, useEffect } from "react"

// Definir una interfaz para los criterios de filtro
interface FilterCriteria {
  minHighReports: number;
  minMediumReports: number;
  minLowReports: number;
  specificCrimes: string[];
}

// Definir una interfaz para los props del componente
interface FilterPanelProps {
  filters: FilterCriteria;
  onFilterChange: (newFilters: FilterCriteria) => void;
}

// List of all possible crimes from the dataset
// Considerar si esta lista debe ser dinámica o si está bien hardcodeada
const allCrimes = [
  "Theft",
  "Fraud",
  "Vandalism",
  "Assault",
  "Drug Possession",
  "Trespassing",
  "Robbery",
  "Identity Theft",
  "crimen1", // Añadidos desde tu ejemplo de ApiResponse
  "crimen2", // Añadidos desde tu ejemplo de ApiResponse
]

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  // Usar la interfaz para el estado local
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters)

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Tipar el evento
    const { name, value } = e.target
    const newFilters: FilterCriteria = { // Usar la interfaz
      ...localFilters,
      [name]: Number.parseInt(value, 10) || 0, // Añadir fallback por si parseInt falla
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCrimeToggle = (crime: string) => { // Tipar el parámetro
    let newCrimes: string[] // Tipar la variable
    if (localFilters.specificCrimes.includes(crime)) {
      newCrimes = localFilters.specificCrimes.filter((c) => c !== crime)
    } else {
      newCrimes = [...localFilters.specificCrimes, crime]
    }

    const newFilters: FilterCriteria = { // Usar la interfaz
      ...localFilters,
      specificCrimes: newCrimes,
    }

    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetValues: FilterCriteria = { // Usar la interfaz
      minHighReports: 0,
      minMediumReports: 0,
      minLowReports: 0,
      specificCrimes: [],
    }
    setLocalFilters(resetValues)
    onFilterChange(resetValues)
  }

  // Obtener lista única de crímenes posibles (si fuera necesario dinámicamente)
  // const possibleCrimes = useMemo(() => {
  //   // Lógica para extraer todos los crímenes únicos de tus datos ApiResponse si fuera necesario
  //   return [...new Set(allCrimes)]; // Usar la lista hardcodeada por ahora
  // }, []);
  const possibleCrimes = allCrimes; // Usando la lista hardcodeada

  return (
    <div className="advanced-filter-panel bg-gray-100 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Filtros Avanzados</h3>

      <div className="filter-section mb-4">
        <h4 className="text-md font-medium mb-2">Reportes Mínimos</h4>
        <div className="filter-controls grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="filter-control">
            <label htmlFor="minHighReports" className="block text-sm font-medium text-gray-700 mb-1">Reportes Altos:</label>
            <input
              id="minHighReports"
              type="number"
              name="minHighReports"
              min="0"
              value={localFilters.minHighReports}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="filter-control">
            <label htmlFor="minMediumReports" className="block text-sm font-medium text-gray-700 mb-1">Reportes Medios:</label>
            <input
              id="minMediumReports"
              type="number"
              name="minMediumReports"
              min="0"
              value={localFilters.minMediumReports}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="filter-control">
            <label htmlFor="minLowReports" className="block text-sm font-medium text-gray-700 mb-1">Reportes Bajos:</label>
            <input
              id="minLowReports"
              type="number"
              name="minLowReports"
              min="0"
              value={localFilters.minLowReports}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="filter-section mb-4">
        <h4 className="text-md font-medium mb-2">Crímenes Específicos</h4>
        <div className="crimes-filter grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {possibleCrimes.map((crime) => (
            <div key={crime} className="crime-checkbox flex items-center">
              <input
                type="checkbox"
                id={`crime-${crime}`}
                checked={localFilters.specificCrimes.includes(crime)}
                onChange={() => handleCrimeToggle(crime)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`crime-${crime}`} className="ml-2 block text-sm text-gray-900">{crime}</label>
            </div>
          ))}
        </div>
      </div>

      <button
        className="reset-filters-button w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        onClick={resetFilters}
      >
        Reiniciar Filtros
      </button>
    </div>
  )
}

export default FilterPanel
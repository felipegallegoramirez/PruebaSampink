"use client"

import { useState, useEffect } from "react"

// Definir una interfaz para los criterios de filtro
interface FilterCriteria {
  includeHigh: boolean;
  includeMedium: boolean;
  includeLow: boolean;
}

// Definir una interfaz para los props del componente
interface FilterPanelProps {
  filters: FilterCriteria;
  onFilterChange: (newFilters: FilterCriteria) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  // Usar la interfaz para el estado local
  const [localFilters, setLocalFilters] = useState<FilterCriteria>({
    includeHigh: false,
    includeMedium: false,
    includeLow: false
  })

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    const newFilters: FilterCriteria = {
      ...localFilters,
      [name as keyof FilterCriteria]: checked,
    }

    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetValues: FilterCriteria = { // Usar la interfaz
      includeHigh: false,
      includeMedium: false,
      includeLow: false
    }
    setLocalFilters(resetValues)
    onFilterChange(resetValues)
  }

  return (
    <div className="advanced-filter-panel bg-gray-100 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Filtros Avanzados</h3>

      <div className="filter-section mb-4">
        <h4 className="text-md font-medium mb-2">Filtrar por niveles de hallazgo</h4>
        <div className="filter-controls grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="includeHigh"
              checked={localFilters.includeHigh}
              onChange={handleCheckboxChange}
              className="form-checkbox text-red-600"
            />
            Reportes Altos
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="includeMedium"
              checked={localFilters.includeMedium}
              onChange={handleCheckboxChange}
              className="form-checkbox text-yellow-500"
            />
            Reportes Medios
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="includeLow"
              checked={localFilters.includeLow}
              onChange={handleCheckboxChange}
              className="form-checkbox text-blue-500"
            />
            Reportes Bajos
          </label>
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
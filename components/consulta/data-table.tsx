"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { DataRow } from "./data-entry-app"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Trash2, Loader2 } from "lucide-react"

interface DataTableProps {
  data: DataRow[]
  onUpdateRow: (row: DataRow) => void
  onDeleteRow: (id: string) => void
  onBulkDelete: (ids: string[]) => void
  isLoading: boolean
}

const tipoOpciones = ["CC", "CE", "INT", "NIT", "PP", "PPT", "NOMBRE"]

export default function DataTable({ data, onUpdateRow, onDeleteRow, onBulkDelete, isLoading }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: keyof DataRow
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing cell changes
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  const handleCellClick = (rowId: string, field: keyof DataRow) => {
    if (field !== "id") {
      setEditingCell({ rowId, field })
    }
  }

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: string, field: keyof DataRow) => {
    const row = data.find((r) => r.id === rowId)
    if (row) {
      const updatedRow = { ...row, [field]: e.target.value }
      onUpdateRow(updatedRow)
    }
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldIndex: number) => {
    if (e.key === "Enter") {
      setEditingCell(null)
    } else if (e.key === "Tab") {
      e.preventDefault()

      // Determine next cell to focus
      const fields: (keyof DataRow)[] = ["documento", "fechaExpedicion", "tipo"]
      const nextFieldIndex = (fieldIndex + 1) % fields.length

      // If we're at the last field and there are more rows
      if (nextFieldIndex === 0 && rowIndex < data.length - 1) {
        setEditingCell({
          rowId: data[rowIndex + 1].id,
          field: fields[0],
        })
      } else {
        setEditingCell({
          rowId: data[rowIndex].id,
          field: fields[nextFieldIndex],
        })
      }
    }
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(data.map((row) => row.id))
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      onBulkDelete(selectedRows)
      setSelectedRows([])
    }
  }

  const validateCedula = (cedula: string) => {
    return /^\d+$/.test(cedula)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Procesando archivo...</span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay datos disponibles. Sube un archivo de Excel o añade filas manualmente.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {selectedRows.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm">{selectedRows.length} filas seleccionadas</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Seleccionados
          </Button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left w-10">
              <Checkbox
                checked={data.length > 0 && selectedRows.length === data.length}
                onCheckedChange={toggleAllRows}
              />
            </th>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Fecha de Expedición</th>
            <th className="p-2 text-left">Tipo de documento</th>
            <th className="p-2 text-left w-10">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`border-b hover:bg-gray-50 ${selectedRows.includes(row.id) ? "bg-primary/5" : ""}`}
            >
              <td className="p-2">
                <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={() => toggleRowSelection(row.id)} />
              </td>
              <td
                className={`p-2 ${!validateCedula(row.documento) && row.documento ? "text-red-500" : ""}`}
                onClick={() => handleCellClick(row.id, "documento")}
              >
                {editingCell?.rowId === row.id && editingCell?.field === "documento" ? (
                  <Input
                    ref={inputRef}
                    value={row.documento}
                    onChange={(e) => handleCellChange(e, row.id, "documento")}
                    onBlur={handleCellBlur}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                    className={`p-1 h-8 ${!validateCedula(row.documento) ? "border-red-500" : ""}`}
                  />
                ) : (
                  <div className="min-h-[32px] flex items-center">
                    {row.documento || <span className="text-gray-400">Ingresar ID</span>}
                  </div>
                )}
              </td>
              <td className="p-2" onClick={() => handleCellClick(row.id, "fechaExpedicion")}>
                {editingCell?.rowId === row.id && editingCell?.field === "fechaExpedicion" ? (
                  <Input
                    ref={inputRef}
                    value={row.fechaExpedicion}
                    onChange={(e) => handleCellChange(e, row.id, "fechaExpedicion")}
                    onBlur={handleCellBlur}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                    className="p-1 h-8"
                  />
                ) : (
                  <div className="min-h-[32px] flex items-center">
                    {row.fechaExpedicion || <span className="text-gray-400">DD/MM/AAAA</span>}
                  </div>
                )}
              </td>
              <td className="p-2" onClick={() => handleCellClick(row.id, "tipo")}>
                {editingCell?.rowId === row.id && editingCell?.field === "tipo" ? (
                  <select
                    ref={inputRef as React.RefObject<HTMLSelectElement>}
                    value={row.tipo}
                    onChange={e => {
                      onUpdateRow({ ...row, tipo: e.target.value })
                      setEditingCell(null)
                    }}
                    onBlur={handleCellBlur}
                    className="p-1 h-8 border rounded w-full"
                  >
                    <option value="">Seleccione</option>
                    {tipoOpciones.map(opcion => (
                      <option key={opcion} value={opcion}>{opcion}</option>
                    ))}
                  </select>
                ) : (
                  <div className="min-h-[32px] flex items-center">
                    {row.tipo || <span className="text-gray-400">Ingresar tipo de documento</span>}
                  </div>
                )}
              </td>
              <td className="p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRow(row.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DataRow } from "./data-entry-app"
import { Upload, FileWarning } from "lucide-react"
import * as XLSX from "xlsx"

interface FileUploadProps {
  onDataLoaded: (data: DataRow[]) => void
  onError: (error: string) => void
  setIsLoading: (isLoading: boolean) => void
}

export default function FileUpload({ onDataLoaded, onError, setIsLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Check if file is an Excel file
    if (!file.name.endsWith(".xlsx")) {
      onError("Please upload a valid Excel (.xlsx) file")
      return
    }

    setIsLoading(true)

    try {
      const data = await readExcelFile(file)

      // Validate the Excel structure
      const requiredColumns = ["cedula", "fechaExpedicion", "nombre"]
      const fileColumns = Object.keys(data[0] || {}).map((key) => key.toLowerCase())

      const missingColumns = requiredColumns.filter((col) => !fileColumns.includes(col.toLowerCase()))

      if (missingColumns.length > 0) {
        onError(`Missing required columns: ${missingColumns.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Transform data to match our structure
      const formattedData: DataRow[] = data.map((row: any) => ({
        id: crypto.randomUUID(),
        cedula: row.cedula?.toString() || "",
        fechaExpedicion: row.fechaexpedicion?.toString() || "",
        nombre: row.nombre?.toString() || "",
      }))

      onDataLoaded(formattedData)
    } catch (error) {
      onError("Error processing Excel file. Please check the file format.")
      console.error(error)
    } finally {
      setIsLoading(false)
      // Reset the file input
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "binary" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const json = XLSX.utils.sheet_to_json(worksheet)
          resolve(json)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => reject(error)
      reader.readAsBinaryString(file)
    })
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input ref={inputRef} type="file" accept=".xlsx" onChange={handleChange} className="hidden" />

      <div className="flex flex-col items-center justify-center space-y-4">
        {dragActive ? (
          <FileWarning className="h-12 w-12 text-primary" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400" />
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {dragActive ? "Drop the file here" : "Drag & drop your Excel file here"}
          </h3>
          <p className="text-sm text-gray-500">Only .xlsx files with columns: Cedula, Fecha de Expedición, Nombre</p>
        </div>

        <div className="flex justify-center">
          <Button type="button" onClick={onButtonClick} variant="outline">
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  )
}


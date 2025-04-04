"use client"

import { useState } from "react"
import FileUpload from "./file-upload"
import DataTable from "./data-table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import styles from "../../styles/auth.module.css"
import { postList } from "@/services/table"

export type DataRow = {
  id: string
  cedula: string
  fechaExpedicion: string
  nombre: string
}

export default function DataEntryApp() {
  const [data, setData] = useState<DataRow[]>([])
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileData = (fileData: DataRow[]) => {
    setData(fileData)
    showNotification("success", "File data loaded successfully")
  }

  const handleFileError = (error: string) => {
    showNotification("error", error)
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddRow = () => {
    const newRow: DataRow = {
      id: crypto.randomUUID(),
      cedula: "",
      fechaExpedicion: "",
      nombre: "",
    }
    setData([...data, newRow])
    showNotification("success", "New row added")
  }

  const handleUpdateRow = (updatedRow: DataRow) => {
    setData(data.map((row) => (row.id === updatedRow.id ? updatedRow : row)))
  }

  const handleDeleteRow = (id: string) => {
    setData(data.filter((row) => row.id !== id))
    showNotification("success", "Row deleted")
  }

  const handleBulkDelete = (selectedIds: string[]) => {
    setData(data.filter((row) => !selectedIds.includes(row.id)))
    showNotification("success", `${selectedIds.length} rows deleted`)
  }

  const handleSubmit = () => {
    // Validate all data before submission
    const invalidRows = data.filter((row) => {
      return !row.cedula || !row.fechaExpedicion || !row.nombre || !/^\d+$/.test(row.cedula)
    })

    if (invalidRows.length > 0) {
      showNotification("error", "Please correct invalid data before submitting")
      return
    }

    // Here you would typically send the data to an API
    let x = {
      'doc':data[0].cedula,
      'typedoc':data[0].nombre,
      'fechaE':data[0].fechaExpedicion,
    }
    postList(x).then((response) => {
      localStorage.setItem("id", response.jobid)
    })
    showNotification("success", "Data submitted successfully")
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Alert variant={notification.type === "error" ? "destructive" : "default"} className="animate-in fade-in">
          {notification.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
        <FileUpload onDataLoaded={handleFileData} onError={handleFileError} setIsLoading={setIsLoading} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Data Table</h2>
          <Button className={styles.button} onClick={handleAddRow}>Add New Row</Button>
        </div>

        <DataTable
          data={data}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
        />

        {data.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button className={styles.button} onClick={handleSubmit}>Submit Data</Button>
          </div>
        )}
      </div>
    </div>
  )
}


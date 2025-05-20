"use client"

import { useState } from "react"
import FileUpload from "./file-upload"
import DataTable from "./data-table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import styles from "../../styles/auth.module.css"
import { postList } from "@/services/table"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export type DataRow = {
  id: string
  documento: string
  fechaExpedicion: string
  tipo: string
}

export default function IngresoDeDatosApp() {
  const router = useRouter()
  const [data, setData] = useState<DataRow[]>([])
  const [notificacion, setNotificacion] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [cargando, setCargando] = useState(false)

  const manejarDatosDelArchivo = (datosDelArchivo: DataRow[]) => {
    setData(datosDelArchivo)
    mostrarNotificacion("success", "Los datos del archivo se han cargado correctamente")
  }

  const manejarErrorDelArchivo = (error: string) => {
    mostrarNotificacion("error", error)
  }

  const mostrarNotificacion = (type: "success" | "error", message: string) => {
    setNotificacion({ type, message })
    setTimeout(() => setNotificacion(null), 5000)
  }

  const manejarAgregarFila = () => {
    const nuevaFila: DataRow = {
      id: crypto.randomUUID(),
      documento: "",
      fechaExpedicion: "",
      tipo: "",
    }
    setData([...data, nuevaFila])
    mostrarNotificacion("success", "Se ha agregado una nueva fila")
  }

  const manejarActualizarFila = (filaActualizada: DataRow) => {
    setData(data.map((fila) => (fila.id === filaActualizada.id ? filaActualizada : fila)))
  }

  const manejarEliminarFila = (id: string) => {
    setData(data.filter((fila) => fila.id !== id))
    mostrarNotificacion("success", "Fila eliminada")
  }

  const manejarEliminacionMasiva = (idsSeleccionados: string[]) => {
    setData(data.filter((fila) => !idsSeleccionados.includes(fila.id)))
    mostrarNotificacion("success", `${idsSeleccionados.length} filas eliminadas`)
  }

  const manejarEnvio = () => {
    // Validar todos los datos antes de enviar
    const filasInvalidas = data.filter((fila) => {
      return !fila.documento || !fila.fechaExpedicion || !fila.tipo || !/^\d+$/.test(fila.documento)
    })

    if (filasInvalidas.length > 0) {
      mostrarNotificacion("error", "Por favor, corrija los datos inválidos antes de enviar")
      return
    }
    let x =[]
    // Aquí típicamente enviarías los datos a una API
    for (let i = 0; i < data.length; i++) {
       x.push({
        'doc':data[i].documento,
        'typedoc':data[i].tipo,
        'fechaE':data[i].fechaExpedicion,
      })
    }
      let info = {
        'user_id':localStorage.getItem("idUser"),
        'checks':x
      }
    postList(info).then((response) => {
      //localStorage.setItem("id", response.jobid)
      router.push('/list')
      mostrarNotificacion("success", "Datos enviados correctamente")
    })


  }

  return (
    <div className="space-y-6">
      {notificacion && (
        <Alert variant={notificacion.type === "error" ? "destructive" : "default"} className="animate-in fade-in">
          {notificacion.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertDescription>{notificacion.message}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Consulta en bloque</h2>
        <FileUpload onDataLoaded={manejarDatosDelArchivo} onError={manejarErrorDelArchivo} setIsLoading={setCargando} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Consulta en bloque</h2>
          <Button className={styles.button} onClick={manejarAgregarFila}>Agregar Nueva Fila</Button>
        </div>

        <DataTable
          data={data}
          onUpdateRow={manejarActualizarFila}
          onDeleteRow={manejarEliminarFila}
          onBulkDelete={manejarEliminacionMasiva}
          isLoading={cargando}
        />

        {data.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button className={styles.button} onClick={manejarEnvio}>Enviar Datos</Button>
          </div>
        )}
      </div>
    </div>
  )
}
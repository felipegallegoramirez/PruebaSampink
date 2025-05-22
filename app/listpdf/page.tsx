"use client"

import { useState, useEffect } from "react"
import PersonReport from "@/components/listpdf/person-modal"
import "./styles.css"
import { getStatus, getData } from "@/services/table"
import LayoutClient from "../LayoutClient"
import Swal from 'sweetalert2'

// --- Datos de Ejemplo ---
// (Coloca aquí el objeto 'examplePersonData' completo que tenías)
const examplePersonData = {
  "cidob": {
    "Alias": " ",
    "Cargo": "Primer ministro (2010-2014)",
    "Informacion_completa": "link",
    "Mandato": "23 mayo 2013 - 7 abril 2016",
    "Nacimiento": "Ciudad prueba,  marzo 1975",
    "Pais": "Pais pruebas",
    "Partido político": "Partido de pruebas (PD)"
  },
  "contadores_s": [
    {
      "c_dula": "111",
      "contador": "MIGUEL FERNANDO PEREZ GOMEZ",
      "fecha_ejecutoria": "2010-06-23T00:00:00.000",
      "fecha_fin": "2010-12-23T00:00:00.000",
      "fecha_inicio": "2010-06-23T00:00:00.000",
      "fecha_registro": "2010-07-14T00:00:00.000",
      "fecha_resoluci_n": "2009-12-03T00:00:00.000",
      "meses": "6",
      "proceso_jur_dico": "1235",
      "resoluci_n": "372",
      "tipo": "SUSPENSIÓN"
    }
  ],
  "contaduria": true,
  "contaduria_pdf": true,
  "contraloria": true,
  "contraloria2": true,
  "dest": "static/img/63776b99-4f26-4f11-b426-dcbbb124dfb8",
  "dict_hallazgos": {
    "altos": [
      {
        "codigo": "sirna",
        "descripcion": "El titular del documento consultado aparece con sanciones vigentes en los archivos de Antecedentes Disciplinarios de la Comisión, así como los del Tribunal Disciplinario y los de la Sala Jurisdiccional Disciplinaria en el ejercicio de su profesión como abogado.",
        "fuente": "sirna",
        "hallazgo": "SIRNA: Esta sancionado en el Sistema de Información del Registro Nacional de Abogados"
      }
    ],
    "bajos": [
      {
        "codigo": "rama_demandante",
        "descripcion": "El titular consultado ha presentado una demanda contra una persona o entidad, pero la información proporcionada no es suficiente para identificar claramente el tipo de proceso judicial en el que está involucrado el demandado en la Rama Judicial Unificada. Te sugerimos revisar y analizar el detalle de la consulta asociados con el proceso para que puedas identificar y entender mejor la naturaleza del caso.",
        "fuente": "rama_unificada",
        "hallazgo": "Rama Unificada: Registra como demandante en un proceso no identificado (Estudiar evidencia)"
      },
      {
        "codigo": "secop2",
        "descripcion": "El documento registra en la base de datos SECOP 2 (Sistema Electrónico de Contratación Pública), dentro de la cual se encuentran los datos de procesos de contratación con el estado registrados en Colombia compra eficiente.",
        "fuente": "secop2",
        "hallazgo": "SECOP 2: Registra en la fuente"
      },
      {
        "codigo": "reputacional_news",
        "descripcion": "Es posible que el titular de documento se encuentra en al menos una noticia o sitio de internet al consultarlo con base a su nombre completo. Las noticias pueden tener un sentimiento positivo, neutral o negativo. Para mayor información revisar el enlace de la noticia en la sección reputacional.  ",
        "fuente": "reputacional",
        "hallazgo": "Noticias Reputacionales"
      },
      {
        "codigo": "reputacional_social",
        "descripcion": "Es posible que el titular de documento se encuentra en alguna red social como Facebook, LinkedIn, YouTube o Twitter. Para mayor información revisar el enlace de la red social en la sección reputacional. ",
        "fuente": "reputacional",
        "hallazgo": "Redes Sociales"
      }
    ],
    "infos": [
      {
        "codigo": "rut",
        "descripcion": "El titular del documento está inscrito en el Registro Único Tributario (RUT).",
        "fuente": "rut",
        "hallazgo": "RUT: Inscrito en Registro Único Tributario"
      },
      {
        "codigo": "libretamilitar_info",
        "descripcion": "Información de la Libreta Militar para personas que tienen su situación definida expedido por el Comando de Reclutamiento y Control de Reservas del Ejército de Colombia.",
        "fuente": "libretamilitar",
        "hallazgo": "Libreta Militar: Titular posee libreta militar: Reservista-2da Clase"
      }
    ],
    "medios": [
      {
        "codigo": "juzgados_tyba",
        "descripcion": "El titular consultado se encuentra relacionado ya sea como demandado o demandante, pero la información proporcionada no es suficiente para identificar claramente el tipo de proceso judicial en el que está involucrado en los Juzgados TYBA Te sugerimos revisar y analizar el detalle de la consulta asociados con el proceso para que puedas identificar y entender mejor la naturaleza del caso.",
        "fuente": "juzgados_tyba",
        "hallazgo": "Juzgados TYBA: Registra en la Rama Judicial TYBA"
      }
    ]
  },
  "error": false,
  "errores": [],
  "europol": {
    "birth_date": "Ene 22, 1975 (48 años)",
    " s": [ // Nota: este campo tiene un espacio en el nombre, podría ser un error tipográfico en tus datos originales
      "crimen1",
      "crimen2"
    ],
    "gender": "Hombre",
    "more_info": "Info",
    "name": "PEREZ GOMEZ, Miguel Fernando",
    "nationality": "Prueba",
    "picture": "link",
    "state_of_case": "Investigación activa",
    "status": "Wanted by prueba"
  },
  "fecha": "Este reporte fue generado el 4, Oct 2023 a las 10:00AM",
  "fopep": {
    "documento": "111",
    "estado": "",
    "fecha_inclusion": "2014-12-01",
    "tipo_documento": "CC"
  },
  "garantias_mobiliarias": [
    {
      "Acreedor(es)": "Banco s.a.",
      "Detalles": {
        "Acreedor": { "Celular": "", "Ciudad": "Ciudad de prueba", "Correo Electrónico 1": "", "Correo Electrónico 2": "", "Dirección": "", "Dígito De Verificación": "8", "Número de Identificación": "852", "Porcentaje de participación": "100,00%", "Razón Social o Nombre": "Banco s.a.", "Teléfono": "", "Tipo Identificación": "NIT" },
        "Bienes garantizados": {},
        "Bienes inmuebles": {},
        "Deudor": { "Bien para uso": "", "Celular": "", "Ciudad": "PASTO", "Correo Electrónico": "", "Dirección": "", "Dígito De Verificación": "", "Género": "MASCULINO", "Número de Identificación": "111", "Razón Social o Nombre": "MIGUEL FERNANDO PEREZ GOMEZ", "Sectores": "Otras actividades de servicios.", "Tamaño de la empresa": "", "Teléfono": "", "Tipo Identificación": "CEDULA DE CIUDADANIA" },
        "Info general": { "Fecha Finalización": "19/01/2030 11:59:59 p.m.", "Fecha de inscripción en el registro especial o de celebración del contrato": "", "Garantía Inscrita en un Registro Especial": "", "Monto Máximo de la obligación garantizada": "$ 69.990.000", "Tipo Garantía": "Garantía Mobiliaria" }
      },
      "Fecha de inscripción inicial\n(dd/mm/aaaa hh:mm:ss)": "23/01/2018 12:49:25 p.m.",
      "Folio Electrónico": "45484864564211351",
      "Garante - Deudor": "MIGUEL FERNANDO PEREZ GOMEZ",
      "Número de Identificación": "111",
      "Ultima Operación": "Formulario Registral de Inscripción Inicial"
    }
  ],
  "genero": "M",
  "google": [
    { "description": "Descripción de prueba", "idioma": "es", "keyword": "MIGUEL FERNANDO PEREZ GOMEZ", "link": "link", "rank": 1, "sentimiento": "neutral", "source": "google", "title": "MIGUEL FERNANDO PEREZ GOMEZ" },
    { "description": "Descripccion de prueba 2", "idioma": "es", "keyword": "MIGUEL FERNANDO PEREZ GOMEZ", "link": "link", "rank": 3, "sentimiento": "neutral", "source": "google", "title": "titulo de prueba" }
  ],
  "hallazgos": "alto",
  "iadb": [
    { "_from": "January 10, 2022", "country": "PAIS DE PRUEBA", "entity": "Individual", "grounds": "Fraud", "nationality": "NACIONALIDAD DE PRUEBA", "source": "IDB", "title": "MIGUEL FERNANDO PEREZ GOMEZ", "to": "January 09, 2025" }
  ],
  "id": "111", // ID de ejemplo
  "inmov_bog": { /* ... */ },
  "inpec": { "Establecimiento a cargo": "COMPLEJO CARCELARIO Y PENITENCIARIO CIUDAD DE PRUEBA", "Estado de ingreso": "PRISION DOMICILIARIA", "Género": "MASCULINO", "Identificación": "111", "Nombre": "MIGUEL FERNANDO PEREZ GOMEZ", "Número único (INPEC)": "486524", "Situación jurídica": "CONDENADO" },
  "interpol": true,
  "juzgados_tyba": [ /* ... */],
  "libretamilitar": { "clase": "Reservista-1ra Clase", "documento": "111", "nombre": "MIGUEL FERNANDO PEREZ GOMEZ", "tipo_documento": "Cédula de Ciudadanía" },
  "lista_banco_mundial": { "debarred_firms_individuals": [], "others_sanctions": [] },
  "lista_onu": true,
  "monitoring_date": "Wed, 27 Sep 2023 00:00:00 GMT",
  "nombre": "MIGUEL FERNANDO PEREZ GOMEZ",
  "nombre-procuraduria": "MIGUEL FERNANDO PEREZ GOMEZ",
  "ofac": { "": "Ciudad de prueba, Pais de prueba", "Citizenship:": "", "Date of Birth:": "22 Jen 1975", "First Name:": "Miguel Fernando", "Last Name:": "Perez Gomez", "List:": "Individual", "Nationality:": "Nacionalidad de prueba", "Place of Birth:": "Ciudad de prueba, Pais de prueba", "Program:": "SDNTK", "Remarks": "", "Title": "", "Type": "Individual", "addresses": [/*...*/], "aliases": [/*...*/], "docs": [/*...*/] },
  "ofac_nombre": { /* ... Mismos datos que OFAC ... */ },
  "peps": [ /* ... */],
  "peps2": true,
  "peps_denom": [ /* ... */],
  "personeriabog": [ /* ... */],
  "policia": true,
  "procuraduria": [ /* ... */],
  "profesion": { "abogado": {}, "abogados_judicial": [], "anec": {}, "colpsic": {}, "comvezcol": {}, "conalpe": {}, "conaltel": [], "consejopro": {}, "copnia": { "certificate_number": "123585-346875", "certificate_status": "VIGENTE", "certificate_type": "MATRICULA PROFESIONAL", "document_number": "111", "document_type": "CEDULA DE CIUDADANIA", "full_name": "MIGUEL FERNANDO PEREZ GOMEZ", "profession": "INGENIERIA AMBIENTAL", "resolution_date": "7/13/2018", "resolution_number": "328" }, "cpae": {}, "cpbiol": {}, "cpiq": {}, "cpnt": {}, "cpqcol": {}, "jcc": {}, "rethus": {} },
  "proveedores_ficticios": true,
  "rama": { /* ... */ },
  "rama_unificada": [ /* ... */],
  "registraduria_certificado": { "cedula": "111", "estado": "VIGENTE", "fecha_exp": "20 DE DICIEMBRE DE 1999", "lugar_exp": "MEDELLIN - ANTIOQUIA", "nombre": "MIGUEL FERNANDO PEREZ GOMEZ" },
  "relacionados": [ /* ... */],
  "reputacional": { /* ... */ },
  "rndc": [ /* ... */],
  "rnmc": { /* ... */ },
  "rues": true,
  "ruaf": { /* ... */ },
  "runt_app": { /* ... */ },
  "rut": "111-1",
  "rut_estado": "REGISTRO ACTIVO",
  "secop2": [ /* ... */],
  "secop": [ /* ... */],
  "secop_s": [ /* ... */],
  "sena": [ /* ... */],
  "sigep": { /* ... */ },
  "simit": { /* ... */ },
  "simur": [ /* ... */],
  "sirna": [ /* ... */],
  "sisben": { /* ... */ },
  "sisconmp": { /* ... */ },
  "transitobog": true
};
// --- Fin Datos de Ejemplo ---


export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);


  useEffect(() => {
    const USE_API = false; // Cambia a true para usar API

    const fetchData = async () => {
      const id = localStorage.getItem("id");

      if (USE_API) {
        try {
          setStatus("loading");
          const person = await getData(id);
          setSelectedPerson(person);
          setStatus("finalizado");
        } catch (error) {
          console.error("Error al obtener datos de la API:", error);
          setStatus("error");
        }
      } else {
        console.log("Cargando datos de ejemplo directamente.");
        setStatus("loading");
        setTimeout(() => {
          setSelectedPerson(examplePersonData);
          setStatus("finalizado");
          console.log("Datos de ejemplo cargados.");
        }, 500);
      }
    };

    fetchData();
  }, []);


  // --- FUNCIÓN PARA DESCARGAR PDF ---
  const handleDownloadPdf = async () => {
    const element = document.getElementById('pdf-content')

    if (!element) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el contenido para el PDF.',
      });
      return;
    }

    // Paso 1: Mostrar confirmación
    Swal.fire({
      title: '¿Descargar PDF?',
      text: 'Esto generará un archivo con la información completa.',
      icon: 'question',
      confirmButtonText: 'Descargar',
      confirmButtonColor: '#565eb4',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Paso 2: Mostrar carga mientras se genera
        Swal.fire({
          title: 'Generando PDF...',
          text: 'Esto puede tardar unos segundos.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const opt = {
          margin: 0.5,
          filename: 'sampink-demo.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // ✅ Importa html2pdf.js dinámicamente solo en el cliente
        const html2pdf = (await import('html2pdf.js')).default;

        html2pdf()
          .from(element)
          .set(opt)
          .save()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'PDF descargado',
              confirmButtonColor: '#565eb4',
              timer: 1500,
              showConfirmButton: false
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error al generar PDF',
              text: 'Revisa la consola para más información.'
            });
          });
      }
    });
  };

  // --- Renderizado del Componente ---
  return (
    <div id="pdf-content">
      <LayoutClient children={undefined}></LayoutClient>
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <main className="report-page-container">
          <div className="person-report-header">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
              Reporte de Persona
            </h1>
          </div>

          {/* Mensajes de Estado */}
          {status === 'loading' && <p className="status-message loading">Cargando datos del reporte...</p>}
          {status === 'procesando' && <p className="status-message processing">Procesando reporte...</p>}
          {error && <p className="status-message error">Error: {error}</p>}

          {/* Renderiza PersonReport SI hay datos Y el estado es 'finalizado' */}
          {selectedPerson && status === 'finalizado' && (
            <PersonReport
              person={selectedPerson}
              onDownloadPdf={handleDownloadPdf} // Pasa la función como prop
            />
          )}

          {/* Mensaje si no hay datos y no está cargando/error */}
          {!selectedPerson && status === 'idle' && (
            <p className="status-message">Esperando datos...</p>
          )}

        </main>
      </div>
    </div>
  );
}
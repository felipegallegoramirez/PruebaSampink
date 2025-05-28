"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'; // Import useRouter
import CollapsibleSection from "./collapsible-section" // Asume que este componente existe y funciona

// Importa la interfaz si la tienes definida en un archivo separado (opcional pero recomendado)
// import { ApiResponse } from './ruta/a/tu/interfaz';

// Helper function to display professions (simple example)
const displayProfessions = (profesionData) => {
  if (!profesionData) return 'No disponible';
  const foundProfessions = [];
  if (profesionData.copnia?.profession) foundProfessions.push(`${profesionData.copnia.profession} (COPNIA ${profesionData.copnia.certificate_status ?? ''})`);
  if (profesionData.jcc?.contador) foundProfessions.push(`Contador (JCC)`); // Asume que jcc tiene una propiedad 'contador' si existe
  if (profesionData.rethus) foundProfessions.push(`Profesional Salud (RETHUS)`); // Asume que rethus indica presencia
  // Añadir más lógica para otras entidades profesionales (cpiq, cpqcol, etc.)
  return foundProfessions.length > 0 ? foundProfessions.join(", ") : 'No especificada';
}

// Helper para mostrar OFAC/PEP de forma concisa
const displayListStatus = (listData, listName) => {
  if (listData && (Array.isArray(listData) ? listData.length > 0 : true)) {
    // Si es un objeto OFAC, podríamos mostrar más detalles
    if (listName === 'OFAC' && typeof listData === 'object' && !Array.isArray(listData)) {
      return `Registra (${listData['Program:'] ?? 'Programa Desconocido'})`;
    }
    if (listName === 'PEP' && Array.isArray(listData)) {
      return `Registra (${listData.length} entradas)`;
    }
    return 'Registra';
  }
  return 'No registra';
}

const PersonModal = ({ person, checkId, onClose }) => {
  // const PersonModal = ({ person, onClose }: { person: ApiResponse | null, onClose: () => void }) => { // Con tipos explícitos
  const modalRef = useRef(null)
  const [activeTab, setActiveTab] = useState("general") // Mantenemos los tabs originales como guía
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  // Si no hay persona, no renderizar nada (o un loader)
  if (!person) return null

  // --- Renderizado Principal ---
  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        {/* Close button remains in the top right */}
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          {/* Usa encadenamiento opcional y valor por defecto */}
          <h2>{person?.nombre ?? 'Nombre no disponible'}</h2>

          {/* --- PDF Button --- */}
          <div className="modal-actions" style={{ position: 'absolute', top: '15px', right: '50px' /* Adjust as needed */ }}>
            <button
              className="pdf-button" // Add class for better styling via CSS
              onClick={() => router.push(`/listpdf?id=${checkId}`)}
              style={{
                padding: '5px 10px',
                marginRight: '10px', // Space before close button if needed
                backgroundColor: '#565eb4', // Example green
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: 'bold'
              }}
            >
              Generar PDF
            </button>
          </div>
          {/* --- End PDF Button --- */}


          <div className="modal-tabs">
            {/* Los nombres de los tabs se mantienen, el contenido se adapta */}
            <button
              className={`modal-tab ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              Información General
            </button>
            <button
              className={`modal-tab ${activeTab === "hallazgos" ? "active" : ""}`}
              onClick={() => setActiveTab("hallazgos")}
            >
              Hallazgos y Sanciones
            </button>
            <button
              className={`modal-tab ${activeTab === "entidades" ? "active" : ""}`}
              onClick={() => setActiveTab("entidades")}
            >
              Consultas Entidades
            </button>
            <button
              className={`modal-tab ${activeTab === "adicional" ? "active" : ""}`}
              onClick={() => setActiveTab("adicional")}
            >
              Información Adicional
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* ============================== */}
          {/* === Información General Tab === */}
          {/* ============================== */}
          {activeTab === "general" && (
            <div className="tab-content">
              {/* --- Sección Identificación Básica --- */}
              <CollapsibleSection title="Identificación y Detalles Personales" defaultOpen={true}>
                <div className="info-grid">
                  <div className="info-item"> <span className="info-label">ID:</span> <span className="info-value">{person?.id ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Nombre Completo:</span> <span className="info-value">{person?.nombre ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Nombre Procuraduría:</span> <span className="info-value">{person?.['nombre-procuraduria'] ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Género:</span> <span className="info-value">{person?.genero ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">RUT:</span> <span className="info-value">{person?.rut ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Estado RUT:</span> <span className="info-value">{person?.rut_estado ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Fecha Reporte:</span> <span className="info-value">{person?.fecha ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Fecha Monitoreo:</span> <span className="info-value">{person?.monitoring_date ? new Date(person.monitoring_date).toLocaleDateString() : '--'}</span> </div>
                </div>
                {person?.registraduria_certificado && (
                  <>
                    <h4>Certificado Registraduría</h4>
                    <div className="info-grid">
                      <div className="info-item"> <span className="info-label">Cédula (Cert.):</span> <span className="info-value">{person.registraduria_certificado.cedula ?? '--'}</span> </div>
                      <div className="info-item"> <span className="info-label">Nombre (Cert.):</span> <span className="info-value">{person.registraduria_certificado.nombre ?? '--'}</span> </div>
                      <div className="info-item"> <span className="info-label">Estado (Cert.):</span> <span className="info-value">{person.registraduria_certificado.estado ?? '--'}</span> </div>
                      <div className="info-item"> <span className="info-label">Fecha Exp. (Cert.):</span> <span className="info-value">{person.registraduria_certificado.fecha_exp ?? '--'}</span> </div>
                      <div className="info-item"> <span className="info-label">Lugar Exp. (Cert.):</span> <span className="info-value">{person.registraduria_certificado.lugar_exp ?? '--'}</span> </div>
                    </div>
                  </>
                )}
              </CollapsibleSection>
              {/* --- Sección CIDOB --- */}
              <CollapsibleSection title="Información PEP" defaultOpen={!!person?.cidob}>
                {person?.cidob ? (
                  <div className="info-grid">
                    <div className="info-item"> <span className="info-label">Alias:</span> <span className="info-value">{person.cidob.Alias ?? '--'}</span> </div>
                    <div className="info-item"> <span className="info-label">Cargo:</span> <span className="info-value">{person.cidob.Cargo ?? '--'}</span> </div>
                    <div className="info-item"> <span className="info-label">Mandato:</span> <span className="info-value">{person.cidob.Mandato ?? '--'}</span> </div>
                    <div className="info-item"> <span className="info-label">Nacimiento:</span> <span className="info-value">{person.cidob.Nacimiento ?? '--'}</span> </div>
                    <div className="info-item"> <span className="info-label">País:</span> <span className="info-value">{person.cidob.Pais ?? '--'}</span> </div>
                    <div className="info-item"> <span className="info-label">Partido Político:</span> <span className="info-value">{person.cidob['Partido político'] ?? '--'}</span> </div>
                    <div className="info-item full-width"> <span className="info-label">Info Completa:</span> <span className="info-value">{person.cidob.Informacion_completa ? <a href={person.cidob.Informacion_completa} target="_blank" rel="noopener noreferrer">Link</a> : '--'}</span> </div>
                  </div>
                ) : <p className="no-findings">No hay información CIDOB disponible.</p>}
              </CollapsibleSection>



              {/* --- Sección Información Profesional --- */}
              <CollapsibleSection title="Información Profesional" defaultOpen={!!person?.profesion}>
                {person?.profesion ? (
                  <>
                    <p><strong>Profesiones Detectadas:</strong> {displayProfessions(person.profesion)}</p>
                    {/* Mostrar detalles de COPNIA si existen */}
                    {person.profesion.copnia && (
                      <>
                        <h4>Detalles COPNIA (Ingeniería)</h4>
                        <div className="info-grid">
                          <div className="info-item"><span className="info-label">Profesión:</span><span className="info-value">{person.profesion.copnia.profession ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Matrícula:</span><span className="info-value">{person.profesion.copnia.certificate_number ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{person.profesion.copnia.certificate_status ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Fecha Res.:</span><span className="info-value">{person.profesion.copnia.resolution_date ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label"># Res.:</span><span className="info-value">{person.profesion.copnia.resolution_number ?? '--'}</span></div>
                        </div>
                      </>
                    )}
                    {/* Mostrar detalles de JCC si existen */}
                    {person.profesion.jcc && (
                      <>
                        <h4>Detalles JCC (Contaduría)</h4>
                        {/* Asumiendo que 'jcc' es un objeto con datos, si no, adaptar */}
                        <p>Registra en Junta Central de Contadores. (Mostrar más detalles si la estructura los provee)</p>
                      </>
                    )}
                    {/* Añadir bloques similares para otras profesiones: rethus, cpiq, etc. */}
                  </>
                ) : <p className="no-findings">No hay información profesional detallada disponible.</p>}
              </CollapsibleSection>
            </div>
          )}

          {/* ==================================== */}
          {/* === Hallazgos y Sanciones Tab === */}
          {/* ==================================== */}
          {activeTab === "hallazgos" && (
            <div className="tab-content">
              <CollapsibleSection title="Resumen Hallazgos" defaultOpen={true}>
                <p><strong>Nivel General de Hallazgos:</strong> {person?.hallazgos?.toUpperCase() ?? 'No determinado'}</p>
                {/* Mostrar conteos si dict_hallazgos existe */}
                {person?.dict_hallazgos && (
                  <div className="counters-grid">
                    <div className="counter-item"><span className="counter-label">Altos:</span><span className="counter-value">{person.dict_hallazgos.altos?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Medios:</span><span className="counter-value">{person.dict_hallazgos.medios?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Bajos:</span><span className="counter-value">{person.dict_hallazgos.bajos?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Informativos:</span><span className="counter-value">{person.dict_hallazgos.infos?.length ?? 0}</span></div>
                  </div>
                )}
              </CollapsibleSection>

              {/* --- Hallazgos Detallados --- */}
              {['altos', 'medios', 'bajos', 'infos'].map(level => {
                const hallazgos = person?.dict_hallazgos?.[level];
                const levelTitle = level.charAt(0).toUpperCase() + level.slice(1);
                const isOpen = (hallazgos?.length ?? 0) > 0;

                return (
                  <CollapsibleSection key={level} title={`Hallazgos ${levelTitle}`} defaultOpen={isOpen}>
                    {(hallazgos?.length ?? 0) > 0 ? (
                      <div className={`findings-list ${level}-findings`}>
                        {hallazgos.map((finding, index) => (
                          <div key={`${level}-${index}-${finding?.codigo ?? index}`} className="finding-item">
                            <div className="finding-header">
                              <span className="finding-code">{finding?.codigo ?? 'S/C'}</span>
                              <span className="finding-description">{finding?.hallazgo ?? 'Descripción no disponible'}</span>
                            </div>
                            <div className="finding-details">
                              <div className="finding-source">Fuente: {finding?.fuente ?? '--'}</div>
                              <div className="finding-text">{finding?.descripcion ?? '--'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-findings">No hay hallazgos de nivel {levelTitle} reportados.</p>
                    )}
                  </CollapsibleSection>
                );
              })}

              {/* --- Sanciones Contadores --- */}
              <CollapsibleSection title="Sanciones Contadores (JCC)" defaultOpen={(person?.contadores_s?.length ?? 0) > 0}>
                {(person?.contadores_s?.length ?? 0) > 0 ? (
                  <div className="findings-list sanctions-list">
                    {person.contadores_s.map((sancion, index) => (
                      <div key={`${sancion?.c_dula}-${index}`} className="finding-item">
                        <div className="finding-header">
                          <span className="finding-code">Resolución: {sancion?.resoluci_n ?? '--'}</span>
                          <span className="finding-description">{sancion?.tipo ?? 'Tipo no especificado'}</span>
                        </div>
                        <div className="finding-details info-grid">
                          <div className="info-item"><span className="info-label">Contador:</span><span className="info-value">{sancion?.contador ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Cédula:</span><span className="info-value">{sancion?.c_dula ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Inicio:</span><span className="info-value">{sancion?.fecha_inicio ? new Date(sancion.fecha_inicio).toLocaleDateString() : '--'}</span></div>
                          <div className="info-item"><span className="info-label">Fin:</span><span className="info-value">{sancion?.fecha_fin ? new Date(sancion.fecha_fin).toLocaleDateString() : '--'}</span></div>
                          <div className="info-item"><span className="info-label">Meses:</span><span className="info-value">{sancion?.meses ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Ejecutoria:</span><span className="info-value">{sancion?.fecha_ejecutoria ? new Date(sancion.fecha_ejecutoria).toLocaleDateString() : '--'}</span></div>
                          <div className="info-item"><span className="info-label">Proceso:</span><span className="info-value">{sancion?.proceso_jur_dico ?? '--'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-findings">No se encontraron sanciones reportadas por la JCC.</p>
                )}
              </CollapsibleSection>

              {/* --- Antecedentes Procuraduría --- */}
              <CollapsibleSection
                title="Antecedentes Procuraduría"
                defaultOpen={Array.isArray(person?.procuraduria) && person.procuraduria.length > 0}
              >
                {Array.isArray(person?.procuraduria) && person.procuraduria.length > 0 ? (
                  <div className="findings-list disciplinary-list">
                    {person.procuraduria.map((antecedente, index) => (
                      <div key={`proc-${index}`} className="finding-item">
                        <h4>{antecedente?.delito ?? 'Antecedente Disciplinario'}</h4>
                        {(antecedente?.datos ?? []).map((dato, datoIndex) => (
                          <div
                            key={`proc-dato-${datoIndex}`}
                            style={{ marginLeft: '10px', marginBottom: '15px' }}
                          >
                            <p><strong>SIRI:</strong> {dato?.SIRI ?? '--'}</p>

                            {Array.isArray(dato?.Sanciones) && dato.Sanciones.length > 0 && (
                              <>
                                <h5>Sanciones:</h5>
                                {dato.Sanciones.map((s, sIndex) => (
                                  <div key={`sancion-${sIndex}`} className="info-grid small-grid">
                                    <div className="info-item">
                                      <span className="info-label">Tipo:</span>
                                      <span className="info-value">{s?.['Clase sanción'] ?? '--'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Sanción:</span>
                                      <span className="info-value">{s?.Sanción ?? '--'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Término:</span>
                                      <span className="info-value">{s?.Término || '--'}</span>
                                    </div>
                                    <div className="info-item full-width">
                                      <span className="info-label">Entidad:</span>
                                      <span className="info-value">{s?.Entidad ?? '--'}</span>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                            {Array.isArray(dato?.Instancias) && dato.Instancias.length > 0 && (
                              <>
                                <h5>Instancias:</h5>
                                {dato.Instancias.map((i, iIndex) => (
                                  <div key={`inst-${iIndex}`} className="info-grid small-grid">
                                    <div className="info-item">
                                      <span className="info-label">Nombre:</span>
                                      <span className="info-value">{i?.Nombre ?? '--'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Autoridad:</span>
                                      <span className="info-value">{i?.Autoridad ?? '--'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Fecha Prov.:</span>
                                      <span className="info-value">{i?.['Fecha providencia'] ?? '--'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Fecha Efecto:</span>
                                      <span className="info-value">{i?.['fecha efecto Juridicos'] ?? '--'}</span>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-findings">No se encontraron antecedentes en Procuraduría.</p>
                )}
              </CollapsibleSection>

              {/* --- SIRNA (Abogados) --- */}
              <CollapsibleSection title="Sanciones SIRNA (Abogados)" defaultOpen={(person?.sirna?.length ?? 0) > 0}>
                {(person?.sirna?.length ?? 0) > 0 ? (
                  <div className="findings-list sanctions-list">
                    {person.sirna.map((s, index) => (
                      <div key={`sirna-${index}`} className="finding-item">
                        <div className="finding-header">
                          <span className="finding-code">Estado: {s?.estado_de_la_sancion ?? '--'}</span>
                          <span className="finding-description">{s?.tipo_de_sancion ?? 'Tipo no especificado'}</span>
                        </div>
                        <div className="finding-details info-grid">
                          <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{`${s?.nombres ?? ''} ${s?.apellidos ?? ''}`}</span></div>
                          <div className="info-item"><span className="info-label">Cédula:</span><span className="info-value">{s?.numero_de_cedula ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Inicio:</span><span className="info-value">{s?.fecha_de_inicio ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Fin:</span><span className="info-value">{s?.fecha_de_finalizacion ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Código Estado:</span><span className="info-value">{s?.codigo_de_estado_de_sancion ?? '--'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-findings">No se encontraron sanciones en SIRNA.</p>
                )}
              </CollapsibleSection>

            </div>
          )}

          {/* ==================================== */}
          {/* === Consultas Entidades Tab === */}
          {/* ==================================== */}
          {activeTab === "entidades" && (
            <div className="tab-content">
              <CollapsibleSection title="Listas Restrictivas Internacionales" defaultOpen={true}>
                <div className="info-grid">
                  <div className="info-item"> <span className="info-label">OFAC:</span> <span className="info-value">{displayListStatus(person?.ofac, 'OFAC')}</span> </div>
                  <div className="info-item"> <span className="info-label">ONU:</span> <span className="info-value">{person?.lista_onu ? 'Registra' : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">Banco Mundial:</span> <span className="info-value">{displayListStatus(person?.lista_banco_mundial?.debarred_firms_individuals, 'BM Debarred')}{(person?.lista_banco_mundial?.others_sanctions?.length ?? 0) > 0 ? ' / Otras Sanc.' : ''}</span> </div>
                  <div className="info-item"> <span className="info-label">IADB:</span> <span className="info-value">{displayListStatus(person?.iadb, 'IADB')}</span> </div>
                  <div className="info-item"> <span className="info-label">Europol:</span> <span className="info-value">{person?.europol?.status ? `Registra (${person.europol.status})` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">Interpol:</span> <span className="info-value">{person?.interpol ? 'Registra' : 'No registra'}</span> </div>
                </div>
                {/* Detalles OFAC si existen */}
                {person?.ofac && typeof person.ofac === 'object' && !Array.isArray(person.ofac) && ( // Added check for object type
                  <>
                    <h4>Detalles OFAC</h4>
                    <div className="info-grid small-grid">
                      <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{person.ofac['First Name:'] ?? '--'} {person.ofac['Last Name:'] ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Tipo:</span><span className="info-value">{person.ofac['Type:'] ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Programa:</span><span className="info-value">{person.ofac['Program:'] ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Nacimiento:</span><span className="info-value">{person.ofac['Date of Birth:'] ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Nacionalidad:</span><span className="info-value">{person.ofac['Nationality:'] ?? '--'}</span></div>
                      {/* Mostrar Aliases y Documentos si existen */}
                      {(person.ofac.aliases?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Aliases:</span><span className="info-value">{(person.ofac.aliases ?? []).map(a => `${a.Name} (${a.Type})`).join(', ')}</span></div>}
                      {(person.ofac.docs?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Docs:</span><span className="info-value">{(person.ofac.docs ?? []).map(d => `${d.Type}: ${d['ID#']}`).join(', ')}</span></div>}
                    </div>
                  </>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Listas PEP" defaultOpen={(person?.peps?.length ?? 0) > 0 || person?.peps2}>
                <p><strong>Verificación PEP (Listas):</strong> {displayListStatus(person?.peps, 'PEP')}</p>
                <p><strong>Verificación PEP (Cargo/Denominación):</strong> {person?.peps2 ? 'Positivo (Requiere análisis)' : 'Negativo'}</p>
                {/* Mostrar detalles de la lista PEP */}
                {(person?.peps?.length ?? 0) > 0 && (
                  <>
                    <h4>Detalles Lista PEP</h4>
                    {person.peps.slice(0, 5).map((pep, index) => ( // Mostrar solo los primeros 5 para brevedad
                      <div key={`pep-${index}`} className="info-grid small-grid finding-item">
                        <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{pep?.NOMBRECOMPLETO ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">ID:</span><span className="info-value">{pep?.ID ?? '--'} ({pep?.TIPO_ID ?? ''})</span></div>
                        <div className="info-item"><span className="info-label">Rol:</span><span className="info-value">{pep?.ROL_O_DESCRIPCION1 ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Lista:</span><span className="info-value">{pep?.NOMBRE_LISTA ?? '--'}</span></div>
                      </div>
                    ))}
                    {person.peps.length > 5 && <p>... y {person.peps.length - 5} más.</p>}
                  </>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Consultas Judiciales y Control" defaultOpen={true}>
                <div className="info-grid">
                  <div className="info-item"> <span className="info-label">Rama Unificada:</span> <span className="info-value">{(person?.rama_unificada?.length ?? 0) > 0 ? `${person.rama_unificada.length} proceso(s)` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">Juzgados TYBA:</span> <span className="info-value">{(person?.juzgados_tyba?.length ?? 0) > 0 ? `${person.juzgados_tyba.length} proceso(s)` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">Procuraduría:</span> <span className="info-value">{(person?.procuraduria?.length ?? 0) > 0 ? `${person.procuraduria.length} antecedente(s)` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">Contraloría:</span> <span className="info-value">{person?.contraloria ? 'Registra' : 'No registra'} / {person?.contraloria2 ? 'Registra (2)' : 'No registra (2)'}</span> </div>
                  <div className="info-item"> <span className="info-label">Policía:</span> <span className="info-value">{person?.policia === false ? 'Registra Antecedentes' : (person?.policia === true ? 'Sin Antecedentes Activos' : 'No verificado')}</span> </div>
                  <div className="info-item"> <span className="info-label">Personería Bogotá:</span> <span className="info-value">{(person?.personeriabog?.length ?? 0) > 0 ? `${person.personeriabog.length} registro(s)` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">INPEC:</span> <span className="info-value">{person?.inpec ? `Registra (${person.inpec['Situación jurídica'] ?? ''} - ${person.inpec['Estado de ingreso'] ?? ''})` : 'No registra'}</span> </div>
                </div>
                {/* Podría añadirse detalle de procesos judiciales si la estructura lo permitiera */}
              </CollapsibleSection>

              <CollapsibleSection title="Consultas Contratación (SECOP)" defaultOpen={(person?.secop?.length ?? 0) > 0 || (person?.secop2?.length ?? 0) > 0 || (person?.secop_s?.length ?? 0) > 0}>
                <p><strong>SECOP I:</strong> {(person?.secop?.length ?? 0)} contrato(s)</p>
                <p><strong>SECOP II:</strong> {(person?.secop2?.length ?? 0)} contrato(s)</p>
                <p><strong>SECOP Sanciones:</strong> {(person?.secop_s?.length ?? 0)} sanción(es)</p>
                {/* Mostrar resumen o primeros contratos/sanciones si es necesario */}
                {/* Ejemplo SECOP II */}
                {(person?.secop2?.length ?? 0) > 0 && person.secop2[0] && ( // Added check for person.secop2[0]
                  <>
                    <h4>Primer Contrato SECOP II</h4>
                    <div className="info-grid small-grid finding-item">
                      <div className="info-item"><span className="info-label">ID Contrato:</span><span className="info-value">{person.secop2[0]?.id_contrato ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Entidad:</span><span className="info-value">{person.secop2[0]?.nombre_entidad ?? '--'}</span></div>
                      <div className="info-item"><span className="info-label">Objeto:</span><span className="info-value">{person.secop2[0]?.objeto_del_contrato?.substring(0, 50) ?? '--'}...</span></div>
                      <div className="info-item"><span className="info-label">Valor:</span><span className="info-value">${person.secop2[0]?.valor_del_contrato ? parseInt(person.secop2[0].valor_del_contrato).toLocaleString('es-CO') : '--'}</span></div>
                      <div className="info-item"><span className="info-label">Fecha Firma:</span><span className="info-value">{person.secop2[0]?.fecha_de_firma ? new Date(person.secop2[0].fecha_de_firma).toLocaleDateString() : '--'}</span></div>
                    </div>
                  </>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Otras Consultas Administrativas" defaultOpen={true}>
                <div className="info-grid">
                  <div className="info-item"> <span className="info-label">Libreta Militar:</span> <span className="info-value">{person?.libretamilitar?.clase ?? 'No registra / No aplica'}</span> </div>
                  <div className="info-item"> <span className="info-label">FOPEP:</span> <span className="info-value">{person?.fopep?.estado || 'No registra'} {person?.fopep?.fecha_inclusion ? `(Incluido ${person.fopep.fecha_inclusion})` : ''}</span> </div>
                  <div className="info-item"> <span className="info-label">Proveedores Ficticios:</span> <span className="info-value">{person?.proveedores_ficticios ? 'Registra' : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">RUES:</span> <span className="info-value">{person?.rues ? 'Registra' : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">RNMC (Código Policía):</span> <span className="info-value">{person?.rnmc ? `Registra (Exp: ${person.rnmc.expediente ?? '--'})` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">SISBEN:</span> <span className="info-value">{person?.sisben ? `Registra (Grupo ${person.sisben.Grupo ?? '--'})` : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">SIGEP:</span> <span className="info-value">{person?.sigep ? 'Registra' : 'No registra'}</span> </div>
                  <div className="info-item"> <span className="info-label">SENA Certificados:</span> <span className="info-value">{(person?.sena?.length ?? 0)} certificado(s)</span> </div>
                </div>
              </CollapsibleSection>

            </div>
          )}


          {/* ==================================== */}
          {/* === Información Adicional Tab === */}
          {/* ==================================== */}
          {activeTab === "adicional" && (
            <div className="tab-content">
              <CollapsibleSection title="Información Reputacional" defaultOpen={!!person?.reputacional}>
                {person?.reputacional ? (
                  <>
                    <h4>Noticias</h4>
                    {(person.reputacional.news?.length ?? 0) > 0 ? (
                      person.reputacional.news.slice(0, 5).map((item, index) => (
                        <div key={`news-${index}`} className="reputational-item">
                          <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Sin título'}</a> ({item?.source ?? 'Fuente desconocida'}) - Sentimiento: {item?.sentimiento ?? 'N/A'}
                          <p>{item?.description?.substring(0, 100) ?? ''}...</p>
                        </div>
                      ))
                    ) : <p>No se encontraron noticias relevantes.</p>}
                    {person.reputacional.news?.length > 5 && <p>... y {person.reputacional.news.length - 5} más.</p>}

                    <h4 style={{ marginTop: '15px' }}>Redes Sociales</h4>
                    {(person.reputacional.social?.length ?? 0) > 0 ? (
                      person.reputacional.social.slice(0, 5).map((item, index) => (
                        <div key={`social-${index}`} className="reputational-item">
                          <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Perfil/Publicación'}</a> ({item?.source ?? 'Fuente desconocida'})
                          <p>{item?.description?.substring(0, 100) ?? ''}...</p>
                        </div>
                      ))
                    ) : <p>No se encontraron perfiles sociales relevantes.</p>}
                    {person.reputacional.social?.length > 5 && <p>... y {person.reputacional.social.length - 5} más.</p>}

                    {/* Podría mostrarse info de google aquí también si es relevante */}
                  </>
                ) : <p className="no-findings">No hay información reputacional disponible.</p>}
              </CollapsibleSection>

              <CollapsibleSection title="Información de Tránsito (RUNT, SIMIT, etc.)" defaultOpen={!!person?.runt_app || !!person?.simit}>
                {/* RUNT */}
                {person?.runt_app ? (
                  <>
                    <h4>RUNT</h4>
                    <p><strong>Verificación Exitosa:</strong> {person.runt_app.exitoso ? 'Sí' : 'No'}</p>
                    {person.runt_app.licencia && (
                      <>
                        <h5>Licencias ({person.runt_app.licencia.totalLicencias ?? 0})</h5>
                        {(person.runt_app.licencia.licencias?.length ?? 0) > 0 ? (
                          person.runt_app.licencia.licencias.map(lic => (
                            <div key={lic.numero_licencia} className="info-grid small-grid finding-item">
                              <div className="info-item"><span className="info-label">Número:</span><span className="info-value">{lic.numero_licencia ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Categoría:</span><span className="info-value">{lic.categoria ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{lic.estado ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Expide:</span><span className="info-value">{lic.fecha_expedicion ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Vence:</span><span className="info-value">{lic.fecha_vencimiento ?? '--'}</span></div>
                            </div>
                          ))
                        ) : <p>No se encontraron licencias activas.</p>}
                      </>
                    )}
                    {person.runt_app.multa && (
                      <>
                        <h5>Multas RUNT</h5>
                        <div className="info-grid small-grid">
                          <div className="info-item"><span className="info-label">Paz y Salvo:</span><span className="info-value">{person.runt_app.multa.estado_paz_salvo ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Comparendos:</span><span className="info-value">{person.runt_app.multa.numero_comparendos ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Cancelación:</span><span className="info-value">{person.runt_app.multa.estado_cancelacion ?? '--'} ({person.runt_app.multa.fecha_cancelacion ?? 'N/A'})</span></div>
                          <div className="info-item"><span className="info-label">Suspensión:</span><span className="info-value">{person.runt_app.multa.estado_suspension || 'NO'} ({person.runt_app.multa.fecha_suspension ?? 'N/A'})</span></div>
                        </div>
                      </>
                    )}
                  </>
                ) : <p>No hay información de RUNT disponible.</p>}

                {/* SIMIT */}
                {person?.simit ? (
                  <>
                    <h4 style={{ marginTop: '15px' }}>SIMIT</h4>
                    <div className="info-grid small-grid">
                      <div className="info-item"><span className="info-label">Paz y Salvo:</span><span className="info-value">{person.simit.paz_salvo ? 'Sí' : 'No'}</span></div>
                      <div className="info-item"><span className="info-label">Total a Pagar:</span><span className="info-value">${(person.simit.total_pagar ?? 0).toLocaleString('es-CO')}</span></div>
                      <div className="info-item"><span className="info-label">Multas:</span><span className="info-value">{person.simit.cantidad_multas ?? 0}</span></div>
                      <div className="info-item"><span className="info-label">Acuerdos Pago:</span><span className="info-value">{person.simit.acuerdos_pagar ?? 0}</span></div>
                    </div>
                    {/* Podría mostrar detalle de multas o cursos si existen y son necesarios */}
                  </>
                ) : <p style={{ marginTop: '15px' }}>No hay información de SIMIT disponible.</p>}

                {/* SIMUR */}
                {(person?.simur?.length ?? 0) > 0 && (
                  <>
                    <h4 style={{ marginTop: '15px' }}>SIMUR (Comparendos Bogotá)</h4>
                    {person.simur.map((comp, index) => (
                      <div key={`simur-${index}`} className="info-grid small-grid finding-item">
                        <div className="info-item"><span className="info-label">Número:</span><span className="info-value">{comp['No Comparendo'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Fecha:</span><span className="info-value">{comp['Fecha Infraccion'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Placa:</span><span className="info-value">{comp.Placa ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{comp['Estado comparendo'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Saldo:</span><span className="info-value">${parseInt(comp.Saldo ?? '0').toLocaleString('es-CO')}</span></div>
                      </div>
                    ))}
                  </>
                )}

              </CollapsibleSection>

              <CollapsibleSection title="Afiliaciones (RUAF)" defaultOpen={!!person?.ruaf}>
                {person?.ruaf ? (
                  <>
                    {/* Mostrar resumen de cada sistema */}
                    <p><strong>Salud:</strong> {(person.ruaf.Salud?.length ?? 0) > 0 && person.ruaf.Salud[0] ? `${person.ruaf.Salud[0]?.Administradora ?? ''} (${person.ruaf.Salud[0]?.Régimen ?? ''} - ${person.ruaf.Salud[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                    <p><strong>Pensiones:</strong> {(person.ruaf.Pensiones?.length ?? 0) > 0 && person.ruaf.Pensiones[0] ? `${person.ruaf.Pensiones[0]?.Administradora ?? ''} (${person.ruaf.Pensiones[0]?.Régimen ?? ''} - ${person.ruaf.Pensiones[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                    <p><strong>ARL:</strong> {(person.ruaf.ARL?.length ?? 0) > 0 && person.ruaf.ARL[0] ? `${person.ruaf.ARL[0]?.Administradora ?? ''} (${person.ruaf.ARL[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                    <p><strong>Caja Comp.:</strong> {(person.ruaf['Caja de compensación']?.length ?? 0) > 0 && person.ruaf['Caja de compensación'][0] ? `${person.ruaf['Caja de compensación'][0]?.['Administradora CF'] ?? ''} (${person.ruaf['Caja de compensación'][0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                    <p><strong>Cesantías:</strong> {person.ruaf.Cesantías?.[0]?.Cesantías ?? 'No registra'}</p>
                  </>
                ) : <p className="no-findings">No hay información de afiliaciones RUAF disponible.</p>}
              </CollapsibleSection>

              <CollapsibleSection title="Relacionados y Garantías Mobiliarias" defaultOpen={(person?.relacionados?.length ?? 0) > 0 || (person?.garantias_mobiliarias?.length ?? 0) > 0}>
                {/* Relacionados */}
                {(person?.relacionados?.length ?? 0) > 0 && (
                  <>
                    <h4>Empresas Relacionadas</h4>
                    {person.relacionados.map((rel, index) => (
                      <div key={`rel-${index}`} className="finding-item">
                        <p><strong>{rel.empresa?.razon_social ?? 'Empresa Desconocida'}</strong> (NIT: {rel.nit ?? '--'})</p>
                        {(rel.empresa?.representacion_legal_y_vinculos?.length ?? 0) > 0 && (
                          <ul>
                            {rel.empresa.representacion_legal_y_vinculos
                              .filter(v => v?.['no identificación'] === person.id) // Filtrar si el vínculo es de la persona actual
                              .map((vinc, vIndex) => (
                                <li key={`vinc-${vIndex}`}>{vinc['tipo de vinculo'] ?? 'Vínculo desconocido'}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {/* Garantías Mobiliarias */}
                {(person?.garantias_mobiliarias?.length ?? 0) > 0 && (
                  <>
                    <h4 style={{ marginTop: '15px' }}>Garantías Mobiliarias</h4>
                    {person.garantias_mobiliarias.map((gar, index) => (
                      <div key={`gar-${index}`} className="finding-item">
                        <p><strong>Folio: {gar['Folio Electrónico'] ?? '--'}</strong></p>
                        <div className="info-grid small-grid">
                          <div className="info-item"><span className="info-label">Deudor:</span><span className="info-value">{gar['Garante - Deudor'] ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Acreedor:</span><span className="info-value">{gar['Acreedor(es)'] ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Fecha Inscripción:</span><span className="info-value">{gar['Fecha de inscripción inicial\n(dd/mm/aaaa hh:mm:ss)']?.split(' ')[0] ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Monto Máximo:</span><span className="info-value">{gar.Detalles?.['Info general']?.['Monto Máximo de la obligación garantizada'] ?? '--'}</span></div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {(person?.relacionados?.length ?? 0) === 0 && (person?.garantias_mobiliarias?.length ?? 0) === 0 && (
                  <p className="no-findings">No se encontraron relaciones empresariales ni garantías mobiliarias.</p>
                )}
              </CollapsibleSection>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonModal
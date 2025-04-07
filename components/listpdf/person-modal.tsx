"use client"

import { useRef } from "react" // useRef se puede usar si se implementa jsPDF/html2canvas
import CollapsibleSection from "./collapsible-section" // Asegúrate que la ruta sea correcta

// --- Funciones Auxiliares (Helpers) ---
const displayProfessions = (profesionData) => {
  if (!profesionData) return 'No disponible';
  const foundProfessions = [];
  if (profesionData.copnia?.profession) foundProfessions.push(`${profesionData.copnia.profession} (COPNIA ${profesionData.copnia.certificate_status ?? ''})`);
  if (profesionData.jcc) foundProfessions.push(`Contador (JCC)`); // Asume que jcc indica presencia
  if (profesionData.rethus) foundProfessions.push(`Profesional Salud (RETHUS)`); // Asume que rethus indica presencia
  // Añadir más lógica para otras entidades profesionales...
  return foundProfessions.length > 0 ? foundProfessions.join(", ") : 'No especificada';
}

const displayListStatus = (listData, listName) => {
    const hasData = listData && (Array.isArray(listData) ? listData.length > 0 : (typeof listData === 'object' ? Object.keys(listData).length > 0 : !!listData));
    if (!hasData) return 'No registra';

    // Detalles específicos
    if (listName === 'OFAC' && typeof listData === 'object' && !Array.isArray(listData)) {
         return `Registra (${listData['Program:'] ?? 'Programa Desconocido'})`;
    }
    if (listName === 'PEP' && Array.isArray(listData)) {
         return `Registra (${listData.length} entradas)`;
    }
     if (listName === 'BM Debarred' && Array.isArray(listData)) {
         return `Registra (${listData.length} entradas)`;
    }
     if (listName === 'IADB' && Array.isArray(listData)) {
         return `Registra (${listData.length} entradas)`;
    }
    return 'Registra'; // Para booleanos true u otros objetos/arrays no vacíos
}
// --- Fin Funciones Auxiliares ---


/**
 * Componente para mostrar el reporte detallado de una persona.
 * Recibe los datos de la persona y una función para manejar la descarga del PDF.
 */
const PersonReport = ({ person, onDownloadPdf }) => {
  const reportContainerRef = useRef(null); // Ref para el contenedor principal

  // Si no hay datos de la persona, muestra un mensaje.
  if (!person) {
    return (
        <div className="person-report-container centered-message">
            <p>No hay información de persona para mostrar.</p>
        </div>
    );
  }

  // Helper para decidir si una sección colapsable debe estar abierta por defecto.
  const shouldOpen = (dataCheck) => {
      if (Array.isArray(dataCheck)) return dataCheck.length > 0;
      if (typeof dataCheck === 'object' && dataCheck !== null) return Object.keys(dataCheck).length > 0;
      return !!dataCheck; // Para booleanos u otros tipos
  };

  // --- Renderizado Principal ---
  return (
    <div className="person-report-container" ref={reportContainerRef} id="person-report-content">
        {/* Cabecera del Reporte */}
        <div className="report-header">
          <h2>{person?.nombre ?? 'Nombre no disponible'}</h2>
          {/* --- BOTÓN DE DESCARGA ---
              Este botón llama a la función 'onDownloadPdf' que se recibe como prop.
              La lógica real de la descarga (ej. window.print()) debe estar en
              la función que se pasa desde el componente padre (Home).
          --- */}
          <button onClick={onDownloadPdf} className="download-pdf-button">
             Descargar PDF
          </button>
          <p className="report-date">Reporte generado: {person?.fecha ?? '--'}</p>
        </div>

        {/* Cuerpo del Reporte (Contenido Secuencial) */}
        <div className="report-body">

            {/* ============================== */}
            {/* === Información General === */}
            {/* ============================== */}
            <h3>Información General</h3>

            {/* --- Sección CIDOB --- */}
            <CollapsibleSection title="Información CIDOB" defaultOpen={shouldOpen(person?.cidob)}>
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

            {/* --- Sección Identificación Básica --- */}
            <CollapsibleSection title="Identificación y Detalles Personales" defaultOpen={true}>
              <div className="info-grid">
                 <div className="info-item"> <span className="info-label">ID:</span> <span className="info-value">{person?.id ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Nombre Completo:</span> <span className="info-value">{person?.nombre ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Nombre Procuraduría:</span> <span className="info-value">{person?.['nombre-procuraduria'] ?? person?.nombre ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Género:</span> <span className="info-value">{person?.genero ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">RUT:</span> <span className="info-value">{person?.rut ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Estado RUT:</span> <span className="info-value">{person?.rut_estado ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Fecha Monitoreo:</span> <span className="info-value">{person?.monitoring_date ? new Date(person.monitoring_date).toLocaleDateString() : '--'}</span> </div>
              </div>
              {person?.registraduria_certificado && (
                <>
                  <h4 style={{marginTop: '10px'}}>Certificado Registraduría</h4>
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

            {/* --- Sección Información Profesional --- */}
            <CollapsibleSection title="Información Profesional" defaultOpen={shouldOpen(person?.profesion)}>
              {person?.profesion && Object.keys(person.profesion).some(key => person.profesion[key] && (typeof person.profesion[key] !== 'object' || Object.keys(person.profesion[key]).length > 0) && (!Array.isArray(person.profesion[key]) || person.profesion[key].length > 0)) ? (
                <>
                  <p><strong>Profesiones Detectadas:</strong> {displayProfessions(person.profesion)}</p>
                  {/* Detalles COPNIA */}
                  {person.profesion.copnia && person.profesion.copnia.profession && (
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
                   {/* Detalles JCC */}
                   {person.profesion.jcc && (
                     <>
                      <h4 style={{marginTop: '10px'}}>Detalles JCC (Contaduría)</h4>
                      <p>Registra en Junta Central de Contadores.</p>
                     </>
                   )}
                   {/* Detalles RETHUS */}
                   {person.profesion.rethus && (
                     <>
                      <h4 style={{marginTop: '10px'}}>Detalles RETHUS (Salud)</h4>
                      <p>Registra en Registro Único Nacional del Talento Humano en Salud.</p>
                     </>
                   )}
                  {/* Añadir más bloques para otras profesiones si es necesario */}
                </>
              ) : <p className="no-findings">No hay información profesional detallada disponible.</p>}
            </CollapsibleSection>

            {/* ==================================== */}
            {/* === Hallazgos y Sanciones === */}
            {/* ==================================== */}
             <h3 style={{ marginTop: '20px' }}>Hallazgos y Sanciones</h3>

             {/* --- Resumen Hallazgos --- */}
             <CollapsibleSection title="Resumen Hallazgos" defaultOpen={true}>
                <p><strong>Nivel General de Hallazgos:</strong> {person?.hallazgos?.toUpperCase() ?? 'No determinado'}</p>
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
                  const isOpen = shouldOpen(hallazgos); // Usa shouldOpen para verificar si hay datos

                  return (
                    <CollapsibleSection key={level} title={`Hallazgos ${levelTitle}`} defaultOpen={isOpen}>
                      {isOpen ? (
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
              <CollapsibleSection title="Sanciones Contadores (JCC)" defaultOpen={shouldOpen(person?.contadores_s)}>
                {shouldOpen(person?.contadores_s) ? (
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
                ) : ( <p className="no-findings">No se encontraron sanciones reportadas por la JCC.</p> )}
              </CollapsibleSection>

              {/* --- Antecedentes Procuraduría --- */}
              <CollapsibleSection title="Antecedentes Procuraduría" defaultOpen={shouldOpen(person?.procuraduria)}>
                 {shouldOpen(person?.procuraduria) ? (
                        <div className="findings-list disciplinary-list">
                            {person.procuraduria.map((antecedente, index) => (
                                <div key={`proc-${index}`} className="finding-item">
                                    <h4>{antecedente?.delito ?? 'Antecedente Disciplinario'}</h4>
                                    {(antecedente?.datos ?? []).map((dato, datoIndex) => (
                                        <div key={`proc-dato-${datoIndex}`} style={{ marginLeft: '10px', marginBottom: '15px' }}>
                                            <p><strong>SIRI:</strong> {dato?.SIRI ?? '--'}</p>
                                            {/* Sanciones */}
                                            {dato?.Sanciones?.length > 0 && (
                                                <>
                                                <h5>Sanciones:</h5>
                                                {dato.Sanciones.map((s, sIndex) => (
                                                   <div key={`sancion-${sIndex}`} className="info-grid small-grid">
                                                     <div className="info-item"><span className="info-label">Tipo:</span><span className="info-value">{s?.['Clase sanción'] ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Sanción:</span><span className="info-value">{s?.Sanción ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Término:</span><span className="info-value">{s?.Término || '--'}</span></div>
                                                     <div className="info-item full-width"><span className="info-label">Entidad:</span><span className="info-value">{s?.Entidad ?? '--'}</span></div>
                                                   </div>
                                                ))}
                                                </>
                                            )}
                                             {/* Instancias */}
                                            {dato?.Instancias?.length > 0 && (
                                                <>
                                                <h5 style={{ marginTop: '10px'}}>Instancias:</h5>
                                                {dato.Instancias.map((i, iIndex) => (
                                                   <div key={`inst-${iIndex}`} className="info-grid small-grid">
                                                     <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{i?.Nombre ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Autoridad:</span><span className="info-value">{i?.Autoridad ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Fecha Prov.:</span><span className="info-value">{i?.['Fecha providencia'] ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Fecha Efecto:</span><span className="info-value">{i?.['fecha efecto Juridicos'] ?? '--'}</span></div>
                                                   </div>
                                                ))}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : ( <p className="no-findings">No se encontraron antecedentes en Procuraduría.</p> )}
              </CollapsibleSection>

              {/* --- SIRNA (Abogados) --- */}
              <CollapsibleSection title="Sanciones SIRNA (Abogados)" defaultOpen={shouldOpen(person?.sirna)}>
                  {shouldOpen(person?.sirna) ? (
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
                   ) : ( <p className="no-findings">No se encontraron sanciones en SIRNA.</p> )}
              </CollapsibleSection>

            {/* ==================================== */}
            {/* === Consultas Entidades === */}
            {/* ==================================== */}
            <h3 style={{ marginTop: '20px' }}>Consultas Entidades</h3>

            {/* --- Listas Restrictivas Internacionales --- */}
            <CollapsibleSection title="Listas Restrictivas Internacionales" defaultOpen={true}>
                <div className="info-grid">
                    <div className="info-item"> <span className="info-label">OFAC:</span> <span className="info-value">{displayListStatus(person?.ofac, 'OFAC')}</span> </div>
                    <div className="info-item"> <span className="info-label">ONU:</span> <span className="info-value">{displayListStatus(person?.lista_onu, 'ONU')}</span> </div>
                    <div className="info-item"> <span className="info-label">Banco Mundial (Exclusión):</span> <span className="info-value">{displayListStatus(person?.lista_banco_mundial?.debarred_firms_individuals, 'BM Debarred')}</span> </div>
                    <div className="info-item"> <span className="info-label">Banco Mundial (Otras Sanc.):</span> <span className="info-value">{displayListStatus(person?.lista_banco_mundial?.others_sanctions, 'BM Other')}</span> </div>
                    <div className="info-item"> <span className="info-label">IADB:</span> <span className="info-value">{displayListStatus(person?.iadb, 'IADB')}</span> </div>
                    <div className="info-item"> <span className="info-label">Europol:</span> <span className="info-value">{person?.europol?.status ? `Registra (${person.europol.status})` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">Interpol:</span> <span className="info-value">{displayListStatus(person?.interpol, 'Interpol')}</span> </div>
                </div>
                {/* Detalles OFAC si existen */}
                {person?.ofac && (
                    <>
                      <h4 style={{marginTop: '10px'}}>Detalles OFAC</h4>
                      <div className="info-grid small-grid">
                        <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{person.ofac['First Name:'] ?? '--'} {person.ofac['Last Name:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Tipo:</span><span className="info-value">{person.ofac['Type:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Programa:</span><span className="info-value">{person.ofac['Program:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Nacimiento:</span><span className="info-value">{person.ofac['Date of Birth:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Nacionalidad:</span><span className="info-value">{person.ofac['Nationality:'] ?? '--'}</span></div>
                        {(person.ofac.aliases?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Aliases:</span><span className="info-value">{(person.ofac.aliases ?? []).map(a => `${a.Name} (${a.Type})`).join(', ')}</span></div>}
                        {(person.ofac.docs?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Docs:</span><span className="info-value">{(person.ofac.docs ?? []).map(d => `${d.Type}: ${d['ID#']}`).join(', ')}</span></div>}
                      </div>
                    </>
                )}
                 {/* Detalles IADB si existen */}
                {shouldOpen(person?.iadb) && (
                    <>
                      <h4 style={{marginTop: '10px'}}>Detalles IADB</h4>
                      {person.iadb.map((item, index) => (
                        <div key={`iadb-${index}`} className="info-grid small-grid finding-item">
                           <div className="info-item"><span className="info-label">Título:</span><span className="info-value">{item?.title ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">País:</span><span className="info-value">{item?.country ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">Motivo:</span><span className="info-value">{item?.grounds ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">Desde:</span><span className="info-value">{item?._from ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">Hasta:</span><span className="info-value">{item?.to ?? '--'}</span></div>
                        </div>
                      ))}
                    </>
                 )}
            </CollapsibleSection>

            {/* --- Listas PEP --- */}
            <CollapsibleSection title="Listas PEP" defaultOpen={shouldOpen(person?.peps) || shouldOpen(person?.peps2)}>
                <p><strong>Verificación PEP (Listas):</strong> {displayListStatus(person?.peps, 'PEP')}</p>
                <p><strong>Verificación PEP (Cargo/Denominación):</strong> {person?.peps2 === true ? 'Positivo (Requiere análisis)' : (person?.peps2 === false ? 'Negativo' : 'No verificado')} </p>
                {shouldOpen(person?.peps) && (
                   <>
                    <h4 style={{marginTop: '10px'}}>Detalles Lista PEP (primeros 5)</h4>
                    {person.peps.slice(0, 5).map((pep, index) => (
                         <div key={`pep-${index}`} className="info-grid small-grid finding-item">
                             <div className="info-item"><span className="info-label">Nombre:</span><span className="info-value">{pep?.NOMBRECOMPLETO ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">ID:</span><span className="info-value">{pep?.ID ?? '--'} ({pep?.TIPO_ID ?? ''})</span></div>
                             <div className="info-item"><span className="info-label">Rol:</span><span className="info-value">{pep?.ROL_O_DESCRIPCION1 ?? pep?.ROL_O_DESCRIPCION2 ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">Lista:</span><span className="info-value">{pep?.NOMBRE_LISTA ?? '--'}</span></div>
                         </div>
                    ))}
                    {person.peps.length > 5 && <p>... y {person.peps.length - 5} más.</p>}
                   </>
                )}
            </CollapsibleSection>

             {/* --- Consultas Judiciales y Control --- */}
             <CollapsibleSection title="Consultas Judiciales y Control" defaultOpen={true}>
               <div className="info-grid">
                    <div className="info-item"> <span className="info-label">Rama Unificada:</span> <span className="info-value">{(person?.rama_unificada?.length ?? 0) > 0 ? `${person.rama_unificada.length} proceso(s)` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">Juzgados TYBA:</span> <span className="info-value">{(person?.juzgados_tyba?.length ?? 0) > 0 ? `${person.juzgados_tyba.length} proceso(s)` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">Procuraduría (Anteced.):</span> <span className="info-value">{(person?.procuraduria?.length ?? 0) > 0 ? `${person.procuraduria.length} antecedente(s)` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">Contraloría:</span> <span className="info-value">{displayListStatus(person?.contraloria, 'Contraloria')} / {displayListStatus(person?.contraloria2, 'Contraloria2')}</span> </div>
                    <div className="info-item"> <span className="info-label">Policía (Anteced.):</span> <span className="info-value">{person?.policia === false ? 'Registra' : (person?.policia === true ? 'Sin Registros Activos' : 'No verificado')}</span> </div>
                    <div className="info-item"> <span className="info-label">Personería Bogotá:</span> <span className="info-value">{(person?.personeriabog?.length ?? 0) > 0 ? `${person.personeriabog.length} registro(s)` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">INPEC:</span> <span className="info-value">{person?.inpec ? `Registra (${person.inpec['Situación jurídica'] ?? ''} - ${person.inpec['Estado de ingreso'] ?? ''})` : 'No registra'}</span> </div>
               </div>
               {/* Detalles Rama Unificada (si existen) */}
                {shouldOpen(person?.rama_unificada) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Detalles Rama Judicial Unificada (primeros 3)</h4>
                        {person.rama_unificada.slice(0, 3).map((proceso, index) => (
                            <div key={`rama-${index}-${proceso.llaveProceso}`} className="finding-item">
                                <p><strong>Proceso: {proceso.llaveProceso}</strong> ({proceso.claseProceso})</p>
                                <div className="info-grid small-grid">
                                    <div className="info-item"><span className="info-label">Despacho:</span><span className="info-value">{proceso.despacho}</span></div>
                                    <div className="info-item"><span className="info-label">Fecha Proceso:</span><span className="info-value">{proceso.fechaProceso ? new Date(proceso.fechaProceso).toLocaleDateString() : '--'}</span></div>
                                    <div className="info-item full-width"><span className="info-label">Sujetos:</span><span className="info-value">{proceso.sujetosProcesales}</span></div>
                                    <div className="info-item"><span className="info-label">Últ. Actuación:</span><span className="info-value">{proceso.fechaUltimaActuacion ? new Date(proceso.fechaUltimaActuacion).toLocaleDateString() : '--'}</span></div>
                                </div>
                            </div>
                        ))}
                        {person.rama_unificada.length > 3 && <p>... y {person.rama_unificada.length - 3} más procesos.</p>}
                    </>
                )}
                {/* Detalles Personería Bogotá (si existen) */}
                {shouldOpen(person?.personeriabog) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Detalles Personería Bogotá</h4>
                        {person.personeriabog.map((reg, index) => (
                            <div key={`personeria-${index}`} className="finding-item">
                                <p><strong>Nombre:</strong> {reg.nombre} - <strong>Sanción/Registro:</strong> {reg.sancion ?? 'Detalle no especificado'}</p>
                            </div>
                        ))}
                    </>
                )}
             </CollapsibleSection>

            {/* --- Consultas Contratación (SECOP) --- */}
            <CollapsibleSection title="Consultas Contratación (SECOP)" defaultOpen={shouldOpen(person?.secop) || shouldOpen(person?.secop2) || shouldOpen(person?.secop_s)}>
                <p><strong>SECOP I:</strong> {(person?.secop?.length ?? 0)} contrato(s)</p>
                <p><strong>SECOP II:</strong> {(person?.secop2?.length ?? 0)} contrato(s)</p>
                <p><strong>SECOP Sanciones:</strong> {(person?.secop_s?.length ?? 0)} sanción(es)</p>
                {/* Detalles SECOP II (si existen) */}
                {shouldOpen(person?.secop2) && (
                   <>
                    <h4 style={{ marginTop: '10px' }}>Primer Contrato SECOP II</h4>
                     <div className="info-grid small-grid finding-item">
                        <div className="info-item"><span className="info-label">ID Contrato:</span><span className="info-value">{person.secop2[0]?.id_contrato ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Entidad:</span><span className="info-value">{person.secop2[0]?.nombre_entidad ?? '--'}</span></div>
                        <div className="info-item full-width"><span className="info-label">Objeto:</span><span className="info-value">{person.secop2[0]?.objeto_del_contrato ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Valor:</span><span className="info-value">${person.secop2[0]?.valor_del_contrato ? parseInt(person.secop2[0].valor_del_contrato).toLocaleString('es-CO') : '--'}</span></div>
                        <div className="info-item"><span className="info-label">Fecha Firma:</span><span className="info-value">{person.secop2[0]?.fecha_de_firma ? new Date(person.secop2[0].fecha_de_firma).toLocaleDateString() : '--'}</span></div>
                        <div className="info-item"><span className="info-label">URL:</span><span className="info-value">{person.secop2[0]?.urlproceso?.url ? <a href={person.secop2[0].urlproceso.url} target="_blank" rel="noopener noreferrer">Ver Proceso</a> : '--'}</span></div>
                     </div>
                     {person.secop2.length > 1 && <p>... y {person.secop2.length - 1} más contratos en SECOP II.</p>}
                   </>
                 )}
                 {/* Detalles SECOP Sanciones (si existen) */}
                 {shouldOpen(person?.secop_s) && (
                    <>
                      <h4 style={{marginTop: '10px'}}>Sanciones SECOP</h4>
                      {person.secop_s.map((sancion, index) => (
                        <div key={`secop-s-${index}`} className="finding-item">
                            <p><strong>Proceso: {sancion.numero_proceso ?? '--'}</strong> ({sancion.nombre_entidad ?? '--'})</p>
                             <div className="info-grid small-grid">
                                <div className="info-item"><span className="info-label">Contrato:</span><span className="info-value">{sancion.numero_de_contrato ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Tipo Incumplimiento:</span><span className="info-value">{sancion.tipo_incumplimiento ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Valor Sanción:</span><span className="info-value">{sancion.valor_sancion ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Fecha Publicación:</span><span className="info-value">{sancion.fecha_de_publicacion ?? '--'}</span></div>
                                <div className="info-item full-width"><span className="info-label">Descripción:</span><span className="info-value">{sancion.descripcion_contrato ?? '--'}</span></div>
                             </div>
                        </div>
                      ))}
                    </>
                 )}
            </CollapsibleSection>

            {/* --- Otras Consultas Administrativas --- */}
            <CollapsibleSection title="Otras Consultas Administrativas" defaultOpen={true}>
                 <div className="info-grid">
                    <div className="info-item"> <span className="info-label">Libreta Militar:</span> <span className="info-value">{person?.libretamilitar?.clase ?? 'No registra / No aplica'}</span> </div>
                    <div className="info-item"> <span className="info-label">FOPEP:</span> <span className="info-value">{person?.fopep?.fecha_inclusion ? `Registra (Incluido ${person.fopep.fecha_inclusion})` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">Proveedores Ficticios:</span> <span className="info-value">{displayListStatus(person?.proveedores_ficticios, 'ProvFicticios')}</span> </div>
                    <div className="info-item"> <span className="info-label">RUES:</span> <span className="info-value">{displayListStatus(person?.rues, 'RUES')}</span> </div>
                    <div className="info-item"> <span className="info-label">RNMC (Código Policía):</span> <span className="info-value">{person?.rnmc ? `Registra (Exp: ${person.rnmc.expediente ?? '--'})` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">SISBEN:</span> <span className="info-value">{person?.sisben ? `Registra (Grupo ${person.sisben.Grupo ?? '--'})` : 'No registra'}</span> </div>
                    <div className="info-item"> <span className="info-label">SIGEP:</span> <span className="info-value">{displayListStatus(person?.sigep, 'SIGEP')}</span> </div>
                    <div className="info-item"> <span className="info-label">SENA Certificados:</span> <span className="info-value">{(person?.sena?.length ?? 0)} certificado(s)</span> </div>
                 </div>
                 {/* Detalles RNMC si existen */}
                {person?.rnmc && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Detalles RNMC (Código Policía)</h4>
                        <div className="info-grid small-grid finding-item">
                            <div className="info-item"><span className="info-label">Expediente:</span><span className="info-value">{person.rnmc.expediente ?? '--'}</span></div>
                            <div className="info-item"><span className="info-label">Fecha:</span><span className="info-value">{person.rnmc.fecha ?? '--'}</span></div>
                            <div className="info-item"><span className="info-label">Municipio:</span><span className="info-value">{person.rnmc.municipio ?? '--'}</span></div>
                            <div className="info-item full-width"><span className="info-label">Artículo:</span><span className="info-value">{person.rnmc.articulo ?? '--'}</span></div>
                        </div>
                    </>
                )}
                 {/* Detalles SIGEP si existen */}
                 {person?.sigep && (
                     <>
                         <h4 style={{marginTop: '10px'}}>Detalles SIGEP</h4>
                         {person.sigep['Informacion basica'] && (
                             <div className="info-grid small-grid finding-item">
                                <div className="info-item"><span className="info-label">Nombre Funcionario:</span><span className="info-value">{person.sigep['Informacion basica'].nombre_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Cargo:</span><span className="info-value">{person.sigep['Informacion basica'].cargo_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Institución:</span><span className="info-value">{person.sigep['Informacion basica'].institucion_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Dependencia:</span><span className="info-value">{person.sigep['Informacion basica'].dependencia_funcionario ?? '--'}</span></div>
                             </div>
                         )}
                         {person.sigep['Formación Académica'] && person.sigep['Formación Académica'].length > 0 && (
                            <p><strong>Formación Académica:</strong> {person.sigep['Formación Académica'].join(' | ')}</p>
                         )}
                         {/* Podría mostrarse Experiencia Laboral si la estructura fuera más detallada */}
                     </>
                 )}
                 {/* Detalles SENA si existen */}
                {shouldOpen(person?.sena) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Certificados SENA (primeros 3)</h4>
                        {person.sena.slice(0, 3).map((cert, index) => (
                            <div key={`sena-${index}`} className="finding-item">
                                <p><strong>{cert.Programa ?? 'Programa Desconocido'}</strong></p>
                                <div className="info-grid small-grid">
                                    <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{cert['Estado del Aprendiz'] ?? '--'}</span></div>
                                    <div className="info-item"><span className="info-label">Certificación:</span><span className="info-value">{cert['Estado de Certificación'] ?? '--'} ({cert.Certificación ? new Date(cert.Certificación).toLocaleDateString() : '--'})</span></div>
                                    <div className="info-item"><span className="info-label">Registro:</span><span className="info-value">{cert.Registro ?? '--'}</span></div>
                                    {cert.Descarga && <div className="info-item"><span className="info-label"></span><span className="info-value"><a href={cert.Descarga} target="_blank" rel="noopener noreferrer">Ver Certificado</a></span></div>}
                                </div>
                            </div>
                        ))}
                        {person.sena.length > 3 && <p>... y {person.sena.length - 3} más certificados.</p>}
                    </>
                )}
            </CollapsibleSection>

            {/* ==================================== */}
            {/* === Información Adicional === */}
            {/* ==================================== */}
            <h3 style={{ marginTop: '20px' }}>Información Adicional</h3>

            {/* --- Información Reputacional --- */}
            <CollapsibleSection title="Información Reputacional" defaultOpen={shouldOpen(person?.reputacional)}>
               {person?.reputacional && (shouldOpen(person.reputacional.news) || shouldOpen(person.reputacional.social)) ? (
                  <>
                    {shouldOpen(person.reputacional.news) && (
                      <>
                        <h4>Noticias (primeras 5)</h4>
                        {person.reputacional.news.slice(0, 5).map((item, index) => (
                            <div key={`news-${index}`} className="reputational-item">
                                <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Sin título'}</a> ({item?.source ?? 'Fuente desconocida'}) - Sentimiento: {item?.sentimiento ?? 'N/A'}
                                <p>{item?.description?.substring(0, 150) ?? ''}...</p>
                            </div>
                        ))}
                        {person.reputacional.news.length > 5 && <p>... y {person.reputacional.news.length - 5} más.</p>}
                      </>
                    )}

                    {shouldOpen(person.reputacional.social) && (
                      <>
                        <h4 style={{marginTop: '15px'}}>Redes Sociales (primeras 5)</h4>
                        {person.reputacional.social.slice(0, 5).map((item, index) => (
                           <div key={`social-${index}`} className="reputational-item">
                                <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Perfil/Publicación'}</a> ({item?.source ?? 'Fuente desconocida'})
                                <p>{item?.description?.substring(0, 150) ?? ''}...</p>
                            </div>
                        ))}
                         {person.reputacional.social.length > 5 && <p>... y {person.reputacional.social.length - 5} más.</p>}
                      </>
                    )}
                  </>
               ) : <p className="no-findings">No hay información reputacional disponible.</p>}
             </CollapsibleSection>

             {/* --- Información de Tránsito --- */}
             <CollapsibleSection title="Información de Tránsito (RUNT, SIMIT, etc.)" defaultOpen={shouldOpen(person?.runt_app) || shouldOpen(person?.simit) || shouldOpen(person?.simur)}>
                {/* RUNT */}
                {person?.runt_app ? (
                  <>
                    <h4>RUNT</h4>
                    <p><strong>Verificación Exitosa:</strong> {person.runt_app.exitoso ? 'Sí' : 'No'}</p>
                    {person.runt_app.licencia && (
                      <>
                        <h5>Licencias ({person.runt_app.licencia.totalLicencias ?? 0})</h5>
                         {shouldOpen(person.runt_app.licencia.licencias) ? (
                            person.runt_app.licencia.licencias.map(lic => (
                              <div key={lic.numero_licencia ?? Math.random()} className="info-grid small-grid finding-item">
                                 <div className="info-item"><span className="info-label">Número:</span><span className="info-value">{lic.numero_licencia ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Categoría:</span><span className="info-value">{lic.categoria ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{lic.estado ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Expide:</span><span className="info-value">{lic.fecha_expedicion ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Vence:</span><span className="info-value">{lic.fecha_vencimiento ?? '--'}</span></div>
                              </div>
                            ))
                         ) : <p className="no-findings">No se encontraron licencias activas.</p>}
                      </>
                    )}
                    {person.runt_app.multa && (
                        <>
                          <h5 style={{ marginTop: '10px' }}>Multas RUNT</h5>
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
                      <h4 style={{marginTop: '15px'}}>SIMIT</h4>
                      <div className="info-grid small-grid">
                         <div className="info-item"><span className="info-label">Paz y Salvo:</span><span className="info-value">{person.simit.paz_salvo ? 'Sí' : 'No'}</span></div>
                         <div className="info-item"><span className="info-label">Total a Pagar:</span><span className="info-value">${(person.simit.total_pagar ?? 0).toLocaleString('es-CO')}</span></div>
                         <div className="info-item"><span className="info-label">Multas:</span><span className="info-value">{person.simit.cantidad_multas ?? 0}</span></div>
                         <div className="info-item"><span className="info-label">Acuerdos Pago:</span><span className="info-value">{person.simit.acuerdos_pagar ?? 0}</span></div>
                      </div>
                      {/* Detalle Multas SIMIT */}
                      {shouldOpen(person.simit.multas) && (
                        <>
                          <h5 style={{marginTop: '10px'}}>Detalle Multas SIMIT</h5>
                          {person.simit.multas.map((multa, index) => (
                            <div key={`simit-multa-${index}`} className="finding-item">
                                <p><strong>Multa #{multa.numero_multa ?? index+1}</strong></p>
                                {/* Añadir más detalles si la estructura de 'multa' los tiene */}
                            </div>
                          ))}
                        </>
                      )}
                      {/* Detalle Cursos SIMIT */}
                      {shouldOpen(person.simit.cursos) && (
                         <>
                           <h5 style={{marginTop: '10px'}}>Detalle Cursos SIMIT</h5>
                           {person.simit.cursos.map((curso, index) => (
                             <div key={`simit-curso-${index}`} className="finding-item">
                                 <p><strong>{curso.centro_intruccion ?? 'Curso'}</strong> ({curso.cuidad ?? '--'})</p>
                                 <div className="info-grid small-grid">
                                     <div className="info-item"><span className="info-label">Certificado:</span><span className="info-value">{curso.certificado ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Fecha Curso:</span><span className="info-value">{curso.fecha_curso ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{curso.estado ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Comparendo Asociado:</span><span className="info-value">{curso.numero_multa ?? '--'}</span></div>
                                 </div>
                             </div>
                           ))}
                         </>
                       )}
                   </>
                ) : <p style={{marginTop: '15px'}}>No hay información de SIMIT disponible.</p>}

                {/* SIMUR */}
                 {shouldOpen(person?.simur) && (
                   <>
                      <h4 style={{marginTop: '15px'}}>SIMUR (Comparendos Bogotá)</h4>
                       {person.simur.map((comp, index) => (
                           <div key={`simur-${index}`} className="info-grid small-grid finding-item">
                              <div className="info-item"><span className="info-label">Número:</span><span className="info-value">{comp['No Comparendo'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Fecha:</span><span className="info-value">{comp['Fecha Infraccion'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Placa:</span><span className="info-value">{comp.Placa ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Estado:</span><span className="info-value">{comp['Estado comparendo'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Saldo:</span><span className="info-value">${parseInt(comp.Saldo?.replace(/[^\d]/g, '') ?? '0').toLocaleString('es-CO')}</span></div>
                           </div>
                       ))}
                   </>
                 )}

                 {/* Tránsito Bogotá */}
                 {person?.transitobog === false && ( // Asumiendo que 'false' indica un hallazgo
                    <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#c0392b' }}>Alerta: Registra información relevante en Tránsito Bogotá (requiere revisión).</p>
                 )}
                 {person?.transitobog === true && (
                     <p style={{ marginTop: '10px' }}>Tránsito Bogotá: No se encontraron registros relevantes.</p>
                 )}


             </CollapsibleSection>

             {/* --- Afiliaciones (RUAF) --- */}
             <CollapsibleSection title="Afiliaciones (RUAF)" defaultOpen={shouldOpen(person?.ruaf)}>
               {person?.ruaf && Object.keys(person.ruaf).length > 0 ? (
                 <>
                  {/* Salud */}
                  <p><strong>Salud:</strong> {shouldOpen(person.ruaf.Salud) ? `${person.ruaf.Salud[0]?.Administradora ?? ''} (${person.ruaf.Salud[0]?.Régimen ?? ''} - ${person.ruaf.Salud[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                  {/* Pensiones */}
                  <p><strong>Pensiones:</strong> {shouldOpen(person.ruaf.Pensiones) ? `${person.ruaf.Pensiones[0]?.Administradora ?? ''} (${person.ruaf.Pensiones[0]?.Régimen ?? ''} - ${person.ruaf.Pensiones[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                  {/* ARL */}
                  <p><strong>ARL:</strong> {shouldOpen(person.ruaf.ARL) ? `${person.ruaf.ARL[0]?.Administradora ?? ''} (${person.ruaf.ARL[0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                  {/* Caja Compensación */}
                  <p><strong>Caja Comp.:</strong> {shouldOpen(person.ruaf['Caja de compensación']) ? `${person.ruaf['Caja de compensación'][0]?.['Administradora CF'] ?? ''} (${person.ruaf['Caja de compensación'][0]?.['Estado de Afiliación'] ?? ''})` : 'No registra'}</p>
                  {/* Cesantías */}
                  <p><strong>Cesantías:</strong> {(person.ruaf.Cesantías?.[0]?.Cesantías !== 'No se encontraron afiliaciones' && person.ruaf.Cesantías?.[0]?.Cesantías) ? person.ruaf.Cesantías[0].Cesantías : 'No registra'}</p>
                  {/* Pensionado */}
                  <p><strong>Pensionado:</strong> {(person.ruaf.Pensionado?.[0]?.Pensionado !== 'No se encontraron afiliaciones' && person.ruaf.Pensionado?.[0]?.Pensionado) ? person.ruaf.Pensionado[0].Pensionado : 'No registra'}</p>
                 </>
               ) : <p className="no-findings">No hay información de afiliaciones RUAF disponible.</p>}
             </CollapsibleSection>

              {/* --- Relacionados y Garantías Mobiliarias --- */}
              <CollapsibleSection title="Relacionados y Garantías Mobiliarias" defaultOpen={shouldOpen(person?.relacionados) || shouldOpen(person?.garantias_mobiliarias)}>
                {/* Relacionados */}
                {shouldOpen(person?.relacionados) && (
                   <>
                    <h4>Empresas Relacionadas</h4>
                     {person.relacionados.map((rel, index) => (
                        <div key={`rel-${index}`} className="finding-item">
                           <p><strong>{rel.empresa?.razon_social ?? 'Empresa Desconocida'}</strong> (NIT: {rel.nit ?? '--'})</p>
                           {shouldOpen(rel.empresa?.representacion_legal_y_vinculos) && (
                               <ul>
                                   {rel.empresa.representacion_legal_y_vinculos
                                       .filter(v => v?.['no identificación'] === person.id) // Vínculo de la persona actual
                                       .map((vinc, vIndex) => (
                                           <li key={`vinc-${vIndex}`}>{vinc['tipo de vinculo'] ?? 'Vínculo desconocido'}</li>
                                   ))}
                                    {/* Otros vínculos (opcional) */}
                                     {rel.empresa.representacion_legal_y_vinculos
                                       .filter(v => v?.['no identificación'] !== person.id)
                                       .map((vinc, vIndex) => (
                                           <li key={`vinc-other-${vIndex}`} style={{ fontStyle: 'italic', color: '#666'}}>(Relacionado: {vinc?.nombre ?? 'N/A'} - {vinc['tipo de vinculo'] ?? 'Vínculo desconocido'})</li>
                                   ))}
                               </ul>
                           )}
                        </div>
                     ))}
                   </>
                )}
                {/* Garantías Mobiliarias */}
                {shouldOpen(person?.garantias_mobiliarias) && (
                   <>
                    <h4 style={{marginTop: '15px'}}>Garantías Mobiliarias</h4>
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
                {/* Mensaje si no hay datos en ninguna */}
                {!shouldOpen(person?.relacionados) && !shouldOpen(person?.garantias_mobiliarias) && (
                     <p className="no-findings">No se encontraron relaciones empresariales ni garantías mobiliarias.</p>
                )}
              </CollapsibleSection>

        </div> {/* Fin report-body */}
    </div> // Fin person-report-container
  )
}

export default PersonReport
"use client"

import { useRef } from "react" // useRef can be used if jsPDF/html2canvas is implemented
import CollapsibleSection from "./collapsible-section" // Make sure the path is correct

// --- Helper Functions ---
const displayProfessions = (profesionData) => {
  if (!profesionData) return 'Not available';
  const foundProfessions = [];
  if (profesionData.copnia?.profession) foundProfessions.push(`${profesionData.copnia.profession} (COPNIA ${profesionData.copnia.certificate_status ?? ''})`);
  if (profesionData.jcc) foundProfessions.push(`Accountant (JCC)`); // Assume jcc indicates presence
  if (profesionData.rethus) foundProfessions.push(`Health Professional (RETHUS)`); // Assume rethus indicates presence
  // Add more logic for other professional entities...
  return foundProfessions.length > 0 ? foundProfessions.join(", ") : 'Not specified';
}

const displayListStatus = (listData, listName) => {
    const hasData = listData && (Array.isArray(listData) ? listData.length > 0 : (typeof listData === 'object' ? Object.keys(listData).length > 0 : !!listData));
    if (!hasData) return 'No record';

    // Specific details
    if (listName === 'OFAC' && typeof listData === 'object' && !Array.isArray(listData)) {
         return `Record found (${listData['Program:'] ?? 'Unknown Program'})`;
    }
    if (listName === 'PEP' && Array.isArray(listData)) {
         return `Record found (${listData.length} entries)`;
    }
     if (listName === 'BM Debarred' && Array.isArray(listData)) {
         return `Record found (${listData.length} entries)`;
    }
     if (listName === 'IADB' && Array.isArray(listData)) {
         return `Record found (${listData.length} entries)`;
    }
    return 'Record found'; // For true booleans or other non-empty objects/arrays
}
// --- End Helper Functions ---


/**
 * Component to display the detailed report of a person.
 * Receives the person's data and a function to handle PDF download.
 */
const PersonReport = ({ person, onDownloadPdf }) => {
  const reportContainerRef = useRef(null); // Ref for the main container

  // If there is no person data, display a message.
  if (!person) {
    return (
        <div className="person-report-container centered-message">
            <p>No person information to display.</p>
        </div>
    );
  }

  // Helper to decide if a collapsible section should be open by default.
  const shouldOpen = (dataCheck) => {
      if (Array.isArray(dataCheck)) return dataCheck.length > 0;
      if (typeof dataCheck === 'object' && dataCheck !== null) return Object.keys(dataCheck).length > 0;
      return !!dataCheck; // For booleans or other types
  };

  // --- Main Rendering ---
  return (
    <div className="person-report-container" ref={reportContainerRef} id="person-report-content">
        {/* Report Header */}
        <div className="report-header">
          <h2>{person?.nombre ?? 'Name not available'}</h2>
          {/* --- DOWNLOAD BUTTON ---
              This button calls the 'onDownloadPdf' function received as a prop.
              The actual download logic (e.g., window.print()) should be in
              the function passed from the parent component (Home).
          --- */}
          <button onClick={onDownloadPdf} className="download-pdf-button">
             Download PDF
          </button>
          <p className="report-date">Report generated: {person?.fecha ?? '--'}</p>
        </div>

        {/* Report Body (Sequential Content) */}
        <div className="report-body">

            {/* ============================== */}
            {/* === General Information === */}
            {/* ============================== */}
            <h3>General Information</h3>

            {/* --- CIDOB Section --- */}
            <CollapsibleSection title="CIDOB Information" defaultOpen={shouldOpen(person?.cidob)}>
              {person?.cidob ? (
                <div className="info-grid">
                  <div className="info-item"> <span className="info-label">Alias:</span> <span className="info-value">{person.cidob.Alias ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Position:</span> <span className="info-value">{person.cidob.Cargo ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Mandate:</span> <span className="info-value">{person.cidob.Mandato ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Birth:</span> <span className="info-value">{person.cidob.Nacimiento ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Country:</span> <span className="info-value">{person.cidob.Pais ?? '--'}</span> </div>
                  <div className="info-item"> <span className="info-label">Political Party:</span> <span className="info-value">{person.cidob['Partido político'] ?? '--'}</span> </div>
                  <div className="info-item full-width"> <span className="info-label">Full Info:</span> <span className="info-value">{person.cidob.Informacion_completa ? <a href={person.cidob.Informacion_completa} target="_blank" rel="noopener noreferrer">Link</a> : '--'}</span> </div>
                </div>
              ) : <p className="no-findings">No CIDOB information available.</p>}
            </CollapsibleSection>

            {/* --- Basic Identification Section --- */}
            <CollapsibleSection title="Identification and Personal Details" defaultOpen={true}>
              <div className="info-grid">
                 <div className="info-item"> <span className="info-label">ID:</span> <span className="info-value">{person?.id ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Full Name:</span> <span className="info-value">{person?.nombre ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Attorney General's Office Name:</span> <span className="info-value">{person?.['nombre-procuraduria'] ?? person?.nombre ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Gender:</span> <span className="info-value">{person?.genero ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">RUT:</span> <span className="info-value">{person?.rut ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">RUT Status:</span> <span className="info-value">{person?.rut_estado ?? '--'}</span> </div>
                 <div className="info-item"> <span className="info-label">Monitoring Date:</span> <span className="info-value">{person?.monitoring_date ? new Date(person.monitoring_date).toLocaleDateString() : '--'}</span> </div>
              </div>
              {person?.registraduria_certificado && (
                <>
                  <h4 style={{marginTop: '10px'}}>Registry Office Certificate</h4>
                  <div className="info-grid">
                     <div className="info-item"> <span className="info-label">ID Card (Cert.):</span> <span className="info-value">{person.registraduria_certificado.cedula ?? '--'}</span> </div>
                     <div className="info-item"> <span className="info-label">Name (Cert.):</span> <span className="info-value">{person.registraduria_certificado.nombre ?? '--'}</span> </div>
                     <div className="info-item"> <span className="info-label">Status (Cert.):</span> <span className="info-value">{person.registraduria_certificado.estado ?? '--'}</span> </div>
                     <div className="info-item"> <span className="info-label">Exp. Date (Cert.):</span> <span className="info-value">{person.registraduria_certificado.fecha_exp ?? '--'}</span> </div>
                     <div className="info-item"> <span className="info-label">Place of Exp. (Cert.):</span> <span className="info-value">{person.registraduria_certificado.lugar_exp ?? '--'}</span> </div>
                  </div>
                </>
              )}
            </CollapsibleSection>

            {/* --- Professional Information Section --- */}
            <CollapsibleSection title="Professional Information" defaultOpen={shouldOpen(person?.profesion)}>
              {person?.profesion && Object.keys(person.profesion).some(key => person.profesion[key] && (typeof person.profesion[key] !== 'object' || Object.keys(person.profesion[key]).length > 0) && (!Array.isArray(person.profesion[key]) || person.profesion[key].length > 0)) ? (
                <>
                  <p><strong>Detected Professions:</strong> {displayProfessions(person.profesion)}</p>
                  {/* COPNIA Details */}
                  {person.profesion.copnia && person.profesion.copnia.profession && (
                      <>
                        <h4>COPNIA Details (Engineering)</h4>
                        <div className="info-grid">
                          <div className="info-item"><span className="info-label">Profession:</span><span className="info-value">{person.profesion.copnia.profession ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">License Number:</span><span className="info-value">{person.profesion.copnia.certificate_number ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Status:</span><span className="info-value">{person.profesion.copnia.certificate_status ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Res. Date:</span><span className="info-value">{person.profesion.copnia.resolution_date ?? '--'}</span></div>
                          <div className="info-item"><span className="info-label">Res. #:</span><span className="info-value">{person.profesion.copnia.resolution_number ?? '--'}</span></div>
                        </div>
                      </>
                  )}
                   {/* JCC Details */}
                   {person.profesion.jcc && (
                     <>
                      <h4 style={{marginTop: '10px'}}>JCC Details (Accounting)</h4>
                      <p>Registered with the Central Board of Accountants.</p>
                     </>
                   )}
                   {/* RETHUS Details */}
                   {person.profesion.rethus && (
                     <>
                      <h4 style={{marginTop: '10px'}}>RETHUS Details (Health)</h4>
                      <p>Registered in the National Single Registry of Human Talent in Health.</p>
                     </>
                   )}
                  {/* Add more blocks for other professions if necessary */}
                </>
              ) : <p className="no-findings">No detailed professional information available.</p>}
            </CollapsibleSection>

            {/* ==================================== */}
            {/* === Findings and Sanctions === */}
            {/* ==================================== */}
             <h3 style={{ marginTop: '20px' }}>Findings and Sanctions</h3>

             {/* --- Findings Summary --- */}
             <CollapsibleSection title="Findings Summary" defaultOpen={true}>
                <p><strong>General Finding Level:</strong> {person?.hallazgos?.toUpperCase() ?? 'Not determined'}</p>
                {person?.dict_hallazgos && (
                  <div className="counters-grid">
                    <div className="counter-item"><span className="counter-label">High:</span><span className="counter-value">{person.dict_hallazgos.altos?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Medium:</span><span className="counter-value">{person.dict_hallazgos.medios?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Low:</span><span className="counter-value">{person.dict_hallazgos.bajos?.length ?? 0}</span></div>
                    <div className="counter-item"><span className="counter-label">Informative:</span><span className="counter-value">{person.dict_hallazgos.infos?.length ?? 0}</span></div>
                  </div>
                )}
              </CollapsibleSection>

             {/* --- Detailed Findings --- */}
             {['altos', 'medios', 'bajos', 'infos'].map(level => {
                  const hallazgos = person?.dict_hallazgos?.[level];
                  const levelTitle = level.charAt(0).toUpperCase() + level.slice(1);
                  const isOpen = shouldOpen(hallazgos); // Use shouldOpen to check if data exists

                  return (
                    <CollapsibleSection key={level} title={`Findings ${levelTitle}`} defaultOpen={isOpen}>
                      {isOpen ? (
                        <div className={`findings-list ${level}-findings`}>
                          {hallazgos.map((finding, index) => (
                            <div key={`${level}-${index}-${finding?.codigo ?? index}`} className="finding-item">
                              <div className="finding-header">
                                <span className="finding-code">{finding?.codigo ?? 'N/C'}</span>
                                <span className="finding-description">{finding?.hallazgo ?? 'Description not available'}</span>
                              </div>
                              <div className="finding-details">
                                <div className="finding-source">Source: {finding?.fuente ?? '--'}</div>
                                <div className="finding-text">{finding?.descripcion ?? '--'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-findings">No {levelTitle} level findings reported.</p>
                      )}
                    </CollapsibleSection>
                  );
              })}

              {/* --- Accountant Sanctions (JCC) --- */}
              <CollapsibleSection title="Accountant Sanctions (JCC)" defaultOpen={shouldOpen(person?.contadores_s)}>
                {shouldOpen(person?.contadores_s) ? (
                  <div className="findings-list sanctions-list">
                      {person.contadores_s.map((sancion, index) => (
                          <div key={`${sancion?.c_dula}-${index}`} className="finding-item">
                              <div className="finding-header">
                                <span className="finding-code">Resolution: {sancion?.resoluci_n ?? '--'}</span>
                                <span className="finding-description">{sancion?.tipo ?? 'Type not specified'}</span>
                              </div>
                              <div className="finding-details info-grid">
                                <div className="info-item"><span className="info-label">Accountant:</span><span className="info-value">{sancion?.contador ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">ID Card:</span><span className="info-value">{sancion?.c_dula ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Start:</span><span className="info-value">{sancion?.fecha_inicio ? new Date(sancion.fecha_inicio).toLocaleDateString() : '--'}</span></div>
                                <div className="info-item"><span className="info-label">End:</span><span className="info-value">{sancion?.fecha_fin ? new Date(sancion.fecha_fin).toLocaleDateString() : '--'}</span></div>
                                <div className="info-item"><span className="info-label">Months:</span><span className="info-value">{sancion?.meses ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Execution Date:</span><span className="info-value">{sancion?.fecha_ejecutoria ? new Date(sancion.fecha_ejecutoria).toLocaleDateString() : '--'}</span></div>
                                <div className="info-item"><span className="info-label">Process:</span><span className="info-value">{sancion?.proceso_jur_dico ?? '--'}</span></div>
                              </div>
                          </div>
                      ))}
                  </div>
                ) : ( <p className="no-findings">No sanctions reported by JCC found.</p> )}
              </CollapsibleSection>

              {/* --- Attorney General's Office Records --- */}
              <CollapsibleSection title="Attorney General's Office Records" defaultOpen={shouldOpen(person?.procuraduria)}>
                 {shouldOpen(person?.procuraduria) ? (
                        <div className="findings-list disciplinary-list">
                            {person.procuraduria.map((antecedente, index) => (
                                <div key={`proc-${index}`} className="finding-item">
                                    <h4>{antecedente?.delito ?? 'Disciplinary Record'}</h4>
                                    {(antecedente?.datos ?? []).map((dato, datoIndex) => (
                                        <div key={`proc-dato-${datoIndex}`} style={{ marginLeft: '10px', marginBottom: '15px' }}>
                                            <p><strong>SIRI:</strong> {dato?.SIRI ?? '--'}</p>
                                            {/* Sanctions */}
                                            {dato?.Sanciones?.length > 0 && (
                                                <>
                                                <h5>Sanctions:</h5>
                                                {dato.Sanciones.map((s, sIndex) => (
                                                   <div key={`sancion-${sIndex}`} className="info-grid small-grid">
                                                     <div className="info-item"><span className="info-label">Type:</span><span className="info-value">{s?.['Clase sanción'] ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Sanction:</span><span className="info-value">{s?.Sanción ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Term:</span><span className="info-value">{s?.Término || '--'}</span></div>
                                                     <div className="info-item full-width"><span className="info-label">Entity:</span><span className="info-value">{s?.Entidad ?? '--'}</span></div>
                                                   </div>
                                                ))}
                                                </>
                                            )}
                                             {/* Instances */}
                                            {dato?.Instancias?.length > 0 && (
                                                <>
                                                <h5 style={{ marginTop: '10px'}}>Instances:</h5>
                                                {dato.Instancias.map((i, iIndex) => (
                                                   <div key={`inst-${iIndex}`} className="info-grid small-grid">
                                                     <div className="info-item"><span className="info-label">Name:</span><span className="info-value">{i?.Nombre ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Authority:</span><span className="info-value">{i?.Autoridad ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Ruling Date:</span><span className="info-value">{i?.['Fecha providencia'] ?? '--'}</span></div>
                                                     <div className="info-item"><span className="info-label">Effective Date:</span><span className="info-value">{i?.['fecha efecto Juridicos'] ?? '--'}</span></div>
                                                   </div>
                                                ))}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : ( <p className="no-findings">No records found in the Attorney General's Office.</p> )}
              </CollapsibleSection>

              {/* --- SIRNA (Lawyers) --- */}
              <CollapsibleSection title="SIRNA Sanctions (Lawyers)" defaultOpen={shouldOpen(person?.sirna)}>
                  {shouldOpen(person?.sirna) ? (
                      <div className="findings-list sanctions-list">
                           {person.sirna.map((s, index) => (
                              <div key={`sirna-${index}`} className="finding-item">
                                  <div className="finding-header">
                                      <span className="finding-code">Status: {s?.estado_de_la_sancion ?? '--'}</span>
                                      <span className="finding-description">{s?.tipo_de_sancion ?? 'Type not specified'}</span>
                                  </div>
                                  <div className="finding-details info-grid">
                                       <div className="info-item"><span className="info-label">Name:</span><span className="info-value">{`${s?.nombres ?? ''} ${s?.apellidos ?? ''}`}</span></div>
                                       <div className="info-item"><span className="info-label">ID Card:</span><span className="info-value">{s?.numero_de_cedula ?? '--'}</span></div>
                                       <div className="info-item"><span className="info-label">Start:</span><span className="info-value">{s?.fecha_de_inicio ?? '--'}</span></div>
                                       <div className="info-item"><span className="info-label">End:</span><span className="info-value">{s?.fecha_de_finalizacion ?? '--'}</span></div>
                                       <div className="info-item"><span className="info-label">Status Code:</span><span className="info-value">{s?.codigo_de_estado_de_sancion ?? '--'}</span></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                   ) : ( <p className="no-findings">No sanctions found in SIRNA.</p> )}
              </CollapsibleSection>

            {/* ==================================== */}
            {/* === Entity Queries === */}
            {/* ==================================== */}
            <h3 style={{ marginTop: '20px' }}>Entity Queries</h3>

            {/* --- International Watchlists --- */}
            <CollapsibleSection title="International Watchlists" defaultOpen={true}>
                <div className="info-grid">
                    <div className="info-item"> <span className="info-label">OFAC:</span> <span className="info-value">{displayListStatus(person?.ofac, 'OFAC')}</span> </div>
                    <div className="info-item"> <span className="info-label">UN:</span> <span className="info-value">{displayListStatus(person?.lista_onu, 'ONU')}</span> </div>
                    <div className="info-item"> <span className="info-label">World Bank (Debarment):</span> <span className="info-value">{displayListStatus(person?.lista_banco_mundial?.debarred_firms_individuals, 'BM Debarred')}</span> </div>
                    <div className="info-item"> <span className="info-label">World Bank (Other Sanc.):</span> <span className="info-value">{displayListStatus(person?.lista_banco_mundial?.others_sanctions, 'BM Other')}</span> </div>
                    <div className="info-item"> <span className="info-label">IADB:</span> <span className="info-value">{displayListStatus(person?.iadb, 'IADB')}</span> </div>
                    <div className="info-item"> <span className="info-label">Europol:</span> <span className="info-value">{person?.europol?.status ? `Record found (${person.europol.status})` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">Interpol:</span> <span className="info-value">{displayListStatus(person?.interpol, 'Interpol')}</span> </div>
                </div>
                {/* OFAC Details if they exist */}
                {person?.ofac && (
                    <>
                      <h4 style={{marginTop: '10px'}}>OFAC Details</h4>
                      <div className="info-grid small-grid">
                        <div className="info-item"><span className="info-label">Name:</span><span className="info-value">{person.ofac['First Name:'] ?? '--'} {person.ofac['Last Name:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Type:</span><span className="info-value">{person.ofac['Type:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Program:</span><span className="info-value">{person.ofac['Program:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Date of Birth:</span><span className="info-value">{person.ofac['Date of Birth:'] ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Nationality:</span><span className="info-value">{person.ofac['Nationality:'] ?? '--'}</span></div>
                        {(person.ofac.aliases?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Aliases:</span><span className="info-value">{(person.ofac.aliases ?? []).map(a => `${a.Name} (${a.Type})`).join(', ')}</span></div>}
                        {(person.ofac.docs?.length ?? 0) > 0 && <div className="info-item full-width"><span className="info-label">Docs:</span><span className="info-value">{(person.ofac.docs ?? []).map(d => `${d.Type}: ${d['ID#']}`).join(', ')}</span></div>}
                      </div>
                    </>
                )}
                 {/* IADB Details if they exist */}
                {shouldOpen(person?.iadb) && (
                    <>
                      <h4 style={{marginTop: '10px'}}>IADB Details</h4>
                      {person.iadb.map((item, index) => (
                        <div key={`iadb-${index}`} className="info-grid small-grid finding-item">
                           <div className="info-item"><span className="info-label">Title:</span><span className="info-value">{item?.title ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">Country:</span><span className="info-value">{item?.country ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">Grounds:</span><span className="info-value">{item?.grounds ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">From:</span><span className="info-value">{item?._from ?? '--'}</span></div>
                           <div className="info-item"><span className="info-label">To:</span><span className="info-value">{item?.to ?? '--'}</span></div>
                        </div>
                      ))}
                    </>
                 )}
            </CollapsibleSection>

            {/* --- PEP Lists --- */}
            <CollapsibleSection title="PEP Lists" defaultOpen={shouldOpen(person?.peps) || shouldOpen(person?.peps2)}>
                <p><strong>PEP Verification (Lists):</strong> {displayListStatus(person?.peps, 'PEP')}</p>
                <p><strong>PEP Verification (Position/Title):</strong> {person?.peps2 === true ? 'Positive (Requires analysis)' : (person?.peps2 === false ? 'Negative' : 'Not verified')} </p>
                {shouldOpen(person?.peps) && (
                   <>
                    <h4 style={{marginTop: '10px'}}>PEP List Details (first 5)</h4>
                    {person.peps.slice(0, 5).map((pep, index) => (
                         <div key={`pep-${index}`} className="info-grid small-grid finding-item">
                             <div className="info-item"><span className="info-label">Name:</span><span className="info-value">{pep?.NOMBRECOMPLETO ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">ID:</span><span className="info-value">{pep?.ID ?? '--'} ({pep?.TIPO_ID ?? ''})</span></div>
                             <div className="info-item"><span className="info-label">Role:</span><span className="info-value">{pep?.ROL_O_DESCRIPCION1 ?? pep?.ROL_O_DESCRIPCION2 ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">List:</span><span className="info-value">{pep?.NOMBRE_LISTA ?? '--'}</span></div>
                         </div>
                    ))}
                    {person.peps.length > 5 && <p>... and {person.peps.length - 5} more.</p>}
                   </>
                )}
            </CollapsibleSection>

             {/* --- Judicial and Control Queries --- */}
             <CollapsibleSection title="Judicial and Control Queries" defaultOpen={true}>
               <div className="info-grid">
                    <div className="info-item"> <span className="info-label">Unified Judicial Branch:</span> <span className="info-value">{(person?.rama_unificada?.length ?? 0) > 0 ? `${person.rama_unificada.length} process(es)` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">TYBA Courts:</span> <span className="info-value">{(person?.juzgados_tyba?.length ?? 0) > 0 ? `${person.juzgados_tyba.length} process(es)` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">Attorney General's Office (Records):</span> <span className="info-value">{(person?.procuraduria?.length ?? 0) > 0 ? `${person.procuraduria.length} record(s)` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">Comptroller's Office:</span> <span className="info-value">{displayListStatus(person?.contraloria, 'Contraloria')} / {displayListStatus(person?.contraloria2, 'Contraloria2')}</span> </div>
                    <div className="info-item"> <span className="info-label">Police (Records):</span> <span className="info-value">{person?.policia === false ? 'Record found' : (person?.policia === true ? 'No Active Records' : 'Not verified')}</span> </div>
                    <div className="info-item"> <span className="info-label">Bogotá Personería:</span> <span className="info-value">{(person?.personeriabog?.length ?? 0) > 0 ? `${person.personeriabog.length} record(s)` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">INPEC:</span> <span className="info-value">{person?.inpec ? `Record found (${person.inpec['Situación jurídica'] ?? ''} - ${person.inpec['Estado de ingreso'] ?? ''})` : 'No record'}</span> </div>
               </div>
               {/* Unified Judicial Branch Details (if they exist) */}
                {shouldOpen(person?.rama_unificada) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Unified Judicial Branch Details (first 3)</h4>
                        {person.rama_unificada.slice(0, 3).map((proceso, index) => (
                            <div key={`rama-${index}-${proceso.llaveProceso}`} className="finding-item">
                                <p><strong>Process: {proceso.llaveProceso}</strong> ({proceso.claseProceso})</p>
                                <div className="info-grid small-grid">
                                    <div className="info-item"><span className="info-label">Office/Court:</span><span className="info-value">{proceso.despacho}</span></div>
                                    <div className="info-item"><span className="info-label">Process Date:</span><span className="info-value">{proceso.fechaProceso ? new Date(proceso.fechaProceso).toLocaleDateString() : '--'}</span></div>
                                    <div className="info-item full-width"><span className="info-label">Parties:</span><span className="info-value">{proceso.sujetosProcesales}</span></div>
                                    <div className="info-item"><span className="info-label">Last Action:</span><span className="info-value">{proceso.fechaUltimaActuacion ? new Date(proceso.fechaUltimaActuacion).toLocaleDateString() : '--'}</span></div>
                                </div>
                            </div>
                        ))}
                        {person.rama_unificada.length > 3 && <p>... and {person.rama_unificada.length - 3} more processes.</p>}
                    </>
                )}
                {/* Bogotá Personería Details (if they exist) */}
                {shouldOpen(person?.personeriabog) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>Bogotá Personería Details</h4>
                        {person.personeriabog.map((reg, index) => (
                            <div key={`personeria-${index}`} className="finding-item">
                                <p><strong>Name:</strong> {reg.nombre} - <strong>Sanction/Record:</strong> {reg.sancion ?? 'Detail not specified'}</p>
                            </div>
                        ))}
                    </>
                )}
             </CollapsibleSection>

            {/* --- Procurement Queries (SECOP) --- */}
            <CollapsibleSection title="Procurement Queries (SECOP)" defaultOpen={shouldOpen(person?.secop) || shouldOpen(person?.secop2) || shouldOpen(person?.secop_s)}>
                <p><strong>SECOP I:</strong> {(person?.secop?.length ?? 0)} contract(s)</p>
                <p><strong>SECOP II:</strong> {(person?.secop2?.length ?? 0)} contract(s)</p>
                <p><strong>SECOP Sanctions:</strong> {(person?.secop_s?.length ?? 0)} sanction(s)</p>
                {/* SECOP II Details (if they exist) */}
                {shouldOpen(person?.secop2) && (
                   <>
                    <h4 style={{ marginTop: '10px' }}>First SECOP II Contract</h4>
                     <div className="info-grid small-grid finding-item">
                        <div className="info-item"><span className="info-label">Contract ID:</span><span className="info-value">{person.secop2[0]?.id_contrato ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Entity:</span><span className="info-value">{person.secop2[0]?.nombre_entidad ?? '--'}</span></div>
                        <div className="info-item full-width"><span className="info-label">Object/Purpose:</span><span className="info-value">{person.secop2[0]?.objeto_del_contrato ?? '--'}</span></div>
                        <div className="info-item"><span className="info-label">Value:</span><span className="info-value">${person.secop2[0]?.valor_del_contrato ? parseInt(person.secop2[0].valor_del_contrato).toLocaleString('es-CO') : '--'}</span></div>
                        <div className="info-item"><span className="info-label">Signing Date:</span><span className="info-value">{person.secop2[0]?.fecha_de_firma ? new Date(person.secop2[0].fecha_de_firma).toLocaleDateString() : '--'}</span></div>
                        <div className="info-item"><span className="info-label">URL:</span><span className="info-value">{person.secop2[0]?.urlproceso?.url ? <a href={person.secop2[0].urlproceso.url} target="_blank" rel="noopener noreferrer">View Process</a> : '--'}</span></div>
                     </div>
                     {person.secop2.length > 1 && <p>... and {person.secop2.length - 1} more contracts in SECOP II.</p>}
                   </>
                 )}
                 {/* SECOP Sanctions Details (if they exist) */}
                 {shouldOpen(person?.secop_s) && (
                    <>
                      <h4 style={{marginTop: '10px'}}>SECOP Sanctions</h4>
                      {person.secop_s.map((sancion, index) => (
                        <div key={`secop-s-${index}`} className="finding-item">
                            <p><strong>Process: {sancion.numero_proceso ?? '--'}</strong> ({sancion.nombre_entidad ?? '--'})</p>
                             <div className="info-grid small-grid">
                                <div className="info-item"><span className="info-label">Contract:</span><span className="info-value">{sancion.numero_de_contrato ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Type of Breach:</span><span className="info-value">{sancion.tipo_incumplimiento ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Sanction Amount:</span><span className="info-value">{sancion.valor_sancion ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Publication Date:</span><span className="info-value">{sancion.fecha_de_publicacion ?? '--'}</span></div>
                                <div className="info-item full-width"><span className="info-label">Description:</span><span className="info-value">{sancion.descripcion_contrato ?? '--'}</span></div>
                             </div>
                        </div>
                      ))}
                    </>
                 )}
            </CollapsibleSection>

            {/* --- Other Administrative Queries --- */}
            <CollapsibleSection title="Other Administrative Queries" defaultOpen={true}>
                 <div className="info-grid">
                    <div className="info-item"> <span className="info-label">Military ID:</span> <span className="info-value">{person?.libretamilitar?.clase ?? 'No record / Not applicable'}</span> </div>
                    <div className="info-item"> <span className="info-label">FOPEP:</span> <span className="info-value">{person?.fopep?.fecha_inclusion ? `Record found (Included ${person.fopep.fecha_inclusion})` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">Fictitious Suppliers:</span> <span className="info-value">{displayListStatus(person?.proveedores_ficticios, 'ProvFicticios')}</span> </div>
                    <div className="info-item"> <span className="info-label">RUES:</span> <span className="info-value">{displayListStatus(person?.rues, 'RUES')}</span> </div>
                    <div className="info-item"> <span className="info-label">RNMC (Police Code):</span> <span className="info-value">{person?.rnmc ? `Record found (File: ${person.rnmc.expediente ?? '--'})` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">SISBEN:</span> <span className="info-value">{person?.sisben ? `Record found (Group ${person.sisben.Grupo ?? '--'})` : 'No record'}</span> </div>
                    <div className="info-item"> <span className="info-label">SIGEP:</span> <span className="info-value">{displayListStatus(person?.sigep, 'SIGEP')}</span> </div>
                    <div className="info-item"> <span className="info-label">SENA Certificates:</span> <span className="info-value">{(person?.sena?.length ?? 0)} certificate(s)</span> </div>
                 </div>
                 {/* RNMC Details if they exist */}
                {person?.rnmc && (
                    <>
                        <h4 style={{marginTop: '10px'}}>RNMC Details (Police Code)</h4>
                        <div className="info-grid small-grid finding-item">
                            <div className="info-item"><span className="info-label">File:</span><span className="info-value">{person.rnmc.expediente ?? '--'}</span></div>
                            <div className="info-item"><span className="info-label">Date:</span><span className="info-value">{person.rnmc.fecha ?? '--'}</span></div>
                            <div className="info-item"><span className="info-label">Municipality:</span><span className="info-value">{person.rnmc.municipio ?? '--'}</span></div>
                            <div className="info-item full-width"><span className="info-label">Article:</span><span className="info-value">{person.rnmc.articulo ?? '--'}</span></div>
                        </div>
                    </>
                )}
                 {/* SIGEP Details if they exist */}
                 {person?.sigep && (
                     <>
                         <h4 style={{marginTop: '10px'}}>SIGEP Details</h4>
                         {person.sigep['Informacion basica'] && (
                             <div className="info-grid small-grid finding-item">
                                <div className="info-item"><span className="info-label">Official's Name:</span><span className="info-value">{person.sigep['Informacion basica'].nombre_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Position:</span><span className="info-value">{person.sigep['Informacion basica'].cargo_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Institution:</span><span className="info-value">{person.sigep['Informacion basica'].institucion_funcionario ?? '--'}</span></div>
                                <div className="info-item"><span className="info-label">Department:</span><span className="info-value">{person.sigep['Informacion basica'].dependencia_funcionario ?? '--'}</span></div>
                             </div>
                         )}
                         {person.sigep['Formación Académica'] && person.sigep['Formación Académica'].length > 0 && (
                            <p><strong>Academic Training:</strong> {person.sigep['Formación Académica'].join(' | ')}</p>
                         )}
                         {/* Work Experience could be shown if the structure were more detailed */}
                     </>
                 )}
                 {/* SENA Details if they exist */}
                {shouldOpen(person?.sena) && (
                    <>
                        <h4 style={{marginTop: '10px'}}>SENA Certificates (first 3)</h4>
                        {person.sena.slice(0, 3).map((cert, index) => (
                            <div key={`sena-${index}`} className="finding-item">
                                <p><strong>{cert.Programa ?? 'Unknown Program'}</strong></p>
                                <div className="info-grid small-grid">
                                    <div className="info-item"><span className="info-label">Status:</span><span className="info-value">{cert['Estado del Aprendiz'] ?? '--'}</span></div>
                                    <div className="info-item"><span className="info-label">Certification:</span><span className="info-value">{cert['Estado de Certificación'] ?? '--'} ({cert.Certificación ? new Date(cert.Certificación).toLocaleDateString() : '--'})</span></div>
                                    <div className="info-item"><span className="info-label">Registry #:</span><span className="info-value">{cert.Registro ?? '--'}</span></div>
                                    {cert.Descarga && <div className="info-item"><span className="info-label"></span><span className="info-value"><a href={cert.Descarga} target="_blank" rel="noopener noreferrer">View Certificate</a></span></div>}
                                </div>
                            </div>
                        ))}
                        {person.sena.length > 3 && <p>... and {person.sena.length - 3} more certificates.</p>}
                    </>
                )}
            </CollapsibleSection>

            {/* ==================================== */}
            {/* === Additional Information === */}
            {/* ==================================== */}
            <h3 style={{ marginTop: '20px' }}>Additional Information</h3>

            {/* --- Reputational Information --- */}
            <CollapsibleSection title="Reputational Information" defaultOpen={shouldOpen(person?.reputacional)}>
               {person?.reputacional && (shouldOpen(person.reputacional.news) || shouldOpen(person.reputacional.social)) ? (
                  <>
                    {shouldOpen(person.reputacional.news) && (
                      <>
                        <h4>News (first 5)</h4>
                        {person.reputacional.news.slice(0, 5).map((item, index) => (
                            <div key={`news-${index}`} className="reputational-item">
                                <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Untitled'}</a> ({item?.source ?? 'Unknown source'}) - Sentiment: {item?.sentimiento ?? 'N/A'}
                                <p>{item?.description?.substring(0, 150) ?? ''}...</p>
                            </div>
                        ))}
                        {person.reputacional.news.length > 5 && <p>... and {person.reputacional.news.length - 5} more.</p>}
                      </>
                    )}

                    {shouldOpen(person.reputacional.social) && (
                      <>
                        <h4 style={{marginTop: '15px'}}>Social Media (first 5)</h4>
                        {person.reputacional.social.slice(0, 5).map((item, index) => (
                           <div key={`social-${index}`} className="reputational-item">
                                <a href={item?.link ?? '#'} target="_blank" rel="noopener noreferrer">{item?.title ?? 'Profile/Post'}</a> ({item?.source ?? 'Unknown source'})
                                <p>{item?.description?.substring(0, 150) ?? ''}...</p>
                            </div>
                        ))}
                         {person.reputacional.social.length > 5 && <p>... and {person.reputacional.social.length - 5} more.</p>}
                      </>
                    )}
                  </>
               ) : <p className="no-findings">No reputational information available.</p>}
             </CollapsibleSection>

             {/* --- Traffic Information --- */}
             <CollapsibleSection title="Traffic Information (RUNT, SIMIT, etc.)" defaultOpen={shouldOpen(person?.runt_app) || shouldOpen(person?.simit) || shouldOpen(person?.simur)}>
                {/* RUNT */}
                {person?.runt_app ? (
                  <>
                    <h4>RUNT</h4>
                    <p><strong>Successful Verification:</strong> {person.runt_app.exitoso ? 'Yes' : 'No'}</p>
                    {person.runt_app.licencia && (
                      <>
                        <h5>Licenses ({person.runt_app.licencia.totalLicencias ?? 0})</h5>
                         {shouldOpen(person.runt_app.licencia.licencias) ? (
                            person.runt_app.licencia.licencias.map(lic => (
                              <div key={lic.numero_licencia ?? Math.random()} className="info-grid small-grid finding-item">
                                 <div className="info-item"><span className="info-label">Number:</span><span className="info-value">{lic.numero_licencia ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Category:</span><span className="info-value">{lic.categoria ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Status:</span><span className="info-value">{lic.estado ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Issued:</span><span className="info-value">{lic.fecha_expedicion ?? '--'}</span></div>
                                 <div className="info-item"><span className="info-label">Expires:</span><span className="info-value">{lic.fecha_vencimiento ?? '--'}</span></div>
                              </div>
                            ))
                         ) : <p className="no-findings">No active licenses found.</p>}
                      </>
                    )}
                    {person.runt_app.multa && (
                        <>
                          <h5 style={{ marginTop: '10px' }}>RUNT Fines</h5>
                           <div className="info-grid small-grid">
                             <div className="info-item"><span className="info-label">Clearance:</span><span className="info-value">{person.runt_app.multa.estado_paz_salvo ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">Tickets:</span><span className="info-value">{person.runt_app.multa.numero_comparendos ?? '--'}</span></div>
                             <div className="info-item"><span className="info-label">Cancellation:</span><span className="info-value">{person.runt_app.multa.estado_cancelacion ?? '--'} ({person.runt_app.multa.fecha_cancelacion ?? 'N/A'})</span></div>
                             <div className="info-item"><span className="info-label">Suspension:</span><span className="info-value">{person.runt_app.multa.estado_suspension || 'NO'} ({person.runt_app.multa.fecha_suspension ?? 'N/A'})</span></div>
                           </div>
                        </>
                    )}
                  </>
                ) : <p>No RUNT information available.</p>}

                {/* SIMIT */}
                {person?.simit ? (
                   <>
                      <h4 style={{marginTop: '15px'}}>SIMIT</h4>
                      <div className="info-grid small-grid">
                         <div className="info-item"><span className="info-label">Clearance:</span><span className="info-value">{person.simit.paz_salvo ? 'Yes' : 'No'}</span></div>
                         <div className="info-item"><span className="info-label">Total Due:</span><span className="info-value">${(person.simit.total_pagar ?? 0).toLocaleString('es-CO')}</span></div>
                         <div className="info-item"><span className="info-label">Fines:</span><span className="info-value">{person.simit.cantidad_multas ?? 0}</span></div>
                         <div className="info-item"><span className="info-label">Payment Agreements:</span><span className="info-value">{person.simit.acuerdos_pagar ?? 0}</span></div>
                      </div>
                      {/* SIMIT Fine Details */}
                      {shouldOpen(person.simit.multas) && (
                        <>
                          <h5 style={{marginTop: '10px'}}>SIMIT Fine Details</h5>
                          {person.simit.multas.map((multa, index) => (
                            <div key={`simit-multa-${index}`} className="finding-item">
                                <p><strong>Fine #{multa.numero_multa ?? index+1}</strong></p>
                                {/* Add more details if the 'multa' structure has them */}
                            </div>
                          ))}
                        </>
                      )}
                      {/* SIMIT Course Details */}
                      {shouldOpen(person.simit.cursos) && (
                         <>
                           <h5 style={{marginTop: '10px'}}>SIMIT Course Details</h5>
                           {person.simit.cursos.map((curso, index) => (
                             <div key={`simit-curso-${index}`} className="finding-item">
                                 <p><strong>{curso.centro_intruccion ?? 'Course'}</strong> ({curso.cuidad ?? '--'})</p>
                                 <div className="info-grid small-grid">
                                     <div className="info-item"><span className="info-label">Certificate:</span><span className="info-value">{curso.certificado ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Course Date:</span><span className="info-value">{curso.fecha_curso ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Status:</span><span className="info-value">{curso.estado ?? '--'}</span></div>
                                     <div className="info-item"><span className="info-label">Associated Ticket:</span><span className="info-value">{curso.numero_multa ?? '--'}</span></div>
                                 </div>
                             </div>
                           ))}
                         </>
                       )}
                   </>
                ) : <p style={{marginTop: '15px'}}>No SIMIT information available.</p>}

                {/* SIMUR */}
                 {shouldOpen(person?.simur) && (
                   <>
                      <h4 style={{marginTop: '15px'}}>SIMUR (Bogotá Tickets)</h4>
                       {person.simur.map((comp, index) => (
                           <div key={`simur-${index}`} className="info-grid small-grid finding-item">
                              <div className="info-item"><span className="info-label">Number:</span><span className="info-value">{comp['No Comparendo'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Date:</span><span className="info-value">{comp['Fecha Infraccion'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Plate:</span><span className="info-value">{comp.Placa ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Ticket Status:</span><span className="info-value">{comp['Estado comparendo'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Balance:</span><span className="info-value">${parseInt(comp.Saldo?.replace(/[^\d]/g, '') ?? '0').toLocaleString('es-CO')}</span></div>
                           </div>
                       ))}
                   </>
                 )}

                 {/* Transit Bogotá */}
                 {person?.transitobog === false && ( // Assuming 'false' indicates a finding
                    <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#c0392b' }}>Alert: Relevant information found in Transit Bogotá (requires review).</p>
                 )}
                 {person?.transitobog === true && (
                     <p style={{ marginTop: '10px' }}>Transit Bogotá: No relevant records found.</p>
                 )}


             </CollapsibleSection>

             {/* --- Affiliations (RUAF) --- */}
             <CollapsibleSection title="Affiliations (RUAF)" defaultOpen={shouldOpen(person?.ruaf)}>
               {person?.ruaf && Object.keys(person.ruaf).length > 0 ? (
                 <>
                  {/* Health */}
                  <p><strong>Health:</strong> {shouldOpen(person.ruaf.Salud) ? `${person.ruaf.Salud[0]?.Administradora ?? ''} (${person.ruaf.Salud[0]?.Régimen ?? ''} - ${person.ruaf.Salud[0]?.['Estado de Afiliación'] ?? ''})` : 'No record'}</p>
                  {/* Pensions */}
                  <p><strong>Pensions:</strong> {shouldOpen(person.ruaf.Pensiones) ? `${person.ruaf.Pensiones[0]?.Administradora ?? ''} (${person.ruaf.Pensiones[0]?.Régimen ?? ''} - ${person.ruaf.Pensiones[0]?.['Estado de Afiliación'] ?? ''})` : 'No record'}</p>
                  {/* ARL */}
                  <p><strong>ARL:</strong> {shouldOpen(person.ruaf.ARL) ? `${person.ruaf.ARL[0]?.Administradora ?? ''} (${person.ruaf.ARL[0]?.['Estado de Afiliación'] ?? ''})` : 'No record'}</p>
                  {/* Compensation Fund */}
                  <p><strong>Comp. Fund:</strong> {shouldOpen(person.ruaf['Caja de compensación']) ? `${person.ruaf['Caja de compensación'][0]?.['Administradora CF'] ?? ''} (${person.ruaf['Caja de compensación'][0]?.['Estado de Afiliación'] ?? ''})` : 'No record'}</p>
                  {/* Severance Fund */}
                  <p><strong>Severance Fund:</strong> {(person.ruaf.Cesantías?.[0]?.Cesantías !== 'No se encontraron afiliaciones' && person.ruaf.Cesantías?.[0]?.Cesantías) ? person.ruaf.Cesantías[0].Cesantías : 'No record'}</p>
                  {/* Pensioner */}
                  <p><strong>Pensioner:</strong> {(person.ruaf.Pensionado?.[0]?.Pensionado !== 'No se encontraron afiliaciones' && person.ruaf.Pensionado?.[0]?.Pensionado) ? person.ruaf.Pensionado[0].Pensionado : 'No record'}</p>
                 </>
               ) : <p className="no-findings">No RUAF affiliation information available.</p>}
             </CollapsibleSection>

              {/* --- Related Parties and Chattel Mortgages --- */}
              <CollapsibleSection title="Related Parties and Chattel Mortgages" defaultOpen={shouldOpen(person?.relacionados) || shouldOpen(person?.garantias_mobiliarias)}>
                {/* Related Parties */}
                {shouldOpen(person?.relacionados) && (
                   <>
                    <h4>Related Companies</h4>
                     {person.relacionados.map((rel, index) => (
                        <div key={`rel-${index}`} className="finding-item">
                           <p><strong>{rel.empresa?.razon_social ?? 'Unknown Company'}</strong> (NIT: {rel.nit ?? '--'})</p>
                           {shouldOpen(rel.empresa?.representacion_legal_y_vinculos) && (
                               <ul>
                                   {rel.empresa.representacion_legal_y_vinculos
                                       .filter(v => v?.['no identificación'] === person.id) // Link of the current person
                                       .map((vinc, vIndex) => (
                                           <li key={`vinc-${vIndex}`}>{vinc['tipo de vinculo'] ?? 'Unknown link/relationship'}</li>
                                   ))}
                                    {/* Other links (optional) */}
                                     {rel.empresa.representacion_legal_y_vinculos
                                       .filter(v => v?.['no identificación'] !== person.id)
                                       .map((vinc, vIndex) => (
                                           <li key={`vinc-other-${vIndex}`} style={{ fontStyle: 'italic', color: '#666'}}>(Related: {vinc?.nombre ?? 'N/A'} - {vinc['tipo de vinculo'] ?? 'Unknown link/relationship'})</li>
                                   ))}
                               </ul>
                           )}
                        </div>
                     ))}
                   </>
                )}
                {/* Chattel Mortgages */}
                {shouldOpen(person?.garantias_mobiliarias) && (
                   <>
                    <h4 style={{marginTop: '15px'}}>Chattel Mortgages</h4>
                     {person.garantias_mobiliarias.map((gar, index) => (
                        <div key={`gar-${index}`} className="finding-item">
                           <p><strong>Folio: {gar['Folio Electrónico'] ?? '--'}</strong></p>
                           <div className="info-grid small-grid">
                              <div className="info-item"><span className="info-label">Debtor:</span><span className="info-value">{gar['Garante - Deudor'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Creditor(s):</span><span className="info-value">{gar['Acreedor(es)'] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Initial Registration Date:</span><span className="info-value">{gar['Fecha de inscripción inicial\n(dd/mm/aaaa hh:mm:ss)']?.split(' ')[0] ?? '--'}</span></div>
                              <div className="info-item"><span className="info-label">Maximum Amount:</span><span className="info-value">{gar.Detalles?.['Info general']?.['Monto Máximo de la obligación garantizada'] ?? '--'}</span></div>
                           </div>
                        </div>
                     ))}
                   </>
                )}
                {/* Message if no data in either */}
                {!shouldOpen(person?.relacionados) && !shouldOpen(person?.garantias_mobiliarias) && (
                     <p className="no-findings">No related companies or chattel mortgages found.</p>
                )}
              </CollapsibleSection>

        </div> {/* End report-body */}
    </div> // End person-report-container
  )
}

export default PersonReport
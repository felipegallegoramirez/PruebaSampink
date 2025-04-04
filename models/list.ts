
// Interfaces para la estructura 'cidob' - Todas las propiedades opcionales
export interface Cidob {
    Alias?: string;
    Cargo?: string;
    Informacion_completa?: string;
    Mandato?: string;
    Nacimiento?: string;
    Pais?: string;
    'Partido político'?: string;
}

// Interfaces para la estructura 'contadores_s' - Todas las propiedades opcionales
export interface ContadorS {
    c_dula?: string;
    contador?: string;
    fecha_ejecutoria?: string; // Podría ser Date
    fecha_fin?: string;        // Podría ser Date
    fecha_inicio?: string;     // Podría ser Date
    fecha_registro?: string;   // Podría ser Date
    fecha_resoluci_n?: string; // Podría ser Date
    meses?: string;            // Podría ser number
    proceso_jur_dico?: string;
    resoluci_n?: string;
    tipo?: string;
}

// Interfaces para la estructura 'dict_hallazgos' - Todas las propiedades opcionales
export interface HallazgoItem {
    codigo?: string;
    descripcion?: string;
    fuente?: string;
    hallazgo?: string;
}

export interface DictHallazgos {
    altos?: HallazgoItem[];
    bajos?: HallazgoItem[];
    infos?: HallazgoItem[];
    medios?: HallazgoItem[];
}

// Interfaces para la estructura 'europol' - Todas las propiedades opcionales
export interface Europol {
    birth_date?: string;
    crimes?: string[];
    gender?: string;
    more_info?: string;
    name?: string;
    nationality?: string;
    picture?: string;
    state_of_case?: string;
    status?: string;
}

// Interfaces para la estructura 'fopep' - Todas las propiedades opcionales
export interface Fopep {
    documento?: string;
    estado?: string;
    fecha_inclusion?: string; // Podría ser Date
    tipo_documento?: string;
}

// Interfaces para la estructura 'garantias_mobiliarias' - Todas las propiedades opcionales
export interface GarantiaAcreedor {
    Celular?: string;
    Ciudad?: string;
    'Correo Electrónico 1'?: string;
    'Correo Electrónico 2'?: string;
    Dirección?: string;
    'Dígito De Verificación'?: string;
    'Número de Identificación'?: string;
    'Porcentaje de participación'?: string;
    'Razón Social o Nombre'?: string;
    Teléfono?: string;
    'Tipo Identificación'?: string;
}

export interface GarantiaDeudor {
    'Bien para uso'?: string;
    Celular?: string;
    Ciudad?: string;
    'Correo Electrónico'?: string;
    Dirección?: string;
    'Dígito De Verificación'?: string;
    Género?: string;
    'Número de Identificación'?: string;
    'Razón Social o Nombre'?: string;
    Sectores?: string;
    'Tamaño de la empresa'?: string;
    Teléfono?: string;
    'Tipo Identificación'?: string;
}

export interface GarantiaInfoGeneral {
    'Fecha Finalización'?: string;
    'Fecha de inscripción en el registro especial o de celebración del contrato'?: string;
    'Garantía Inscrita en un Registro Especial'?: string;
    'Monto Máximo de la obligación garantizada'?: string;
    'Tipo Garantía'?: string;
}

export interface GarantiaDetalles {
    Acreedor?: GarantiaAcreedor;
    'Bienes garantizados'?: Record<string, any>;
    'Bienes inmuebles'?: Record<string, any>;
    Deudor?: GarantiaDeudor;
    'Info general'?: GarantiaInfoGeneral;
}

export interface GarantiaMobiliaria {
    'Acreedor(es)'?: string;
    Detalles?: GarantiaDetalles;
    'Fecha de inscripción inicial\n(dd/mm/aaaa hh:mm:ss)'?: string;
    'Folio Electrónico'?: string;
    'Garante - Deudor'?: string;
    'Número de Identificación'?: string;
    'Ultima Operación'?: string;
}

// Interfaces para la estructura 'google' - Todas las propiedades opcionales
export interface GoogleResult {
    description?: string;
    idioma?: string;
    keyword?: string;
    link?: string;
    rank?: number;
    sentimiento?: string;
    source?: string;
    title?: string;
}

// Interfaces para la estructura 'iadb' - Todas las propiedades opcionales
export interface IadbEntry {
    _from?: string;
    country?: string;
    entity?: string;
    grounds?: string;
    nationality?: string;
    source?: string;
    title?: string;
    to?: string;
}

// Interfaces para la estructura 'inmov_bog' - Todas las propiedades opcionales
export interface EntradaPatios {
    clase_vehículo?: string;
    comparendo?: string;
    conductor?: string;
    dirección?: string;
    fecha_de_entrada?: string;
    fecha_de_inmovilización?: string;
    imagen_comparendo?: string;
    infracción?: string;
    nombre_conductor?: string;
    nro_documento?: string;
    nro_inventario?: string;
    patio?: string;
    placa?: string;
    servicio?: string;
    tipo_documento?: string;
}

export interface SalidaPatios {
    autorizado_salida?: string;
    día_autorización?: string;
    'el_vehículo_debe_salir_en_grúa'?: string; // Podría ser boolean
    fecha_salida?: string;
    nombre_autorizado?: string;
    nro_autorización?: string;
    nro_documento?: string;
    nro_factura?: string;
    tipo_autorización?: string;
    tipo_documento?: string;
}

export interface InmovBog {
    datos_de_entrada_a_patios?: EntradaPatios[];
    datos_de_salida_a_patios?: SalidaPatios[];
}

// Interfaces para la estructura 'inpec' - Todas las propiedades opcionales
export interface Inpec {
    'Establecimiento a cargo'?: string;
    'Estado de ingreso'?: string;
    Género?: string;
    Identificación?: string;
    Nombre?: string;
    'Número único (INPEC)'?: string;
    'Situación jurídica'?: string;
}

// Interfaces para la estructura 'juzgados_tyba' - Todas las propiedades opcionales
export interface SujetoTyba {
    'ES EMPLAZADO'?: string; // Podría ser boolean
    'FECHA REGISTRO'?: string;
    'NOMBRE(S) Y APELLIDO(S) / RAZÓN SOCIAL'?: string;
    'NÚMERO DE IDENTIFICACIÓN'?: string;
    'TIPO DOCUMENTO'?: string;
    'TIPO SUJETO'?: string;
}

export interface InfoProcesoTyba {
    Celular?: string;
    Ciudad?: string;
    'Clase Proceso'?: string;
    Corporación?: string;
    'Correo Electrónico Externo'?: string;
    'Código Proceso'?: string;
    Departamento?: string;
    Despacho?: string;
    Dirección?: string;
    'Distrito\\Circuito'?: string;
    Especialidad?: string;
    'Fecha Finalización'?: string;
    'Fecha Providencia'?: string;
    'Fecha Publicación'?: string;
    'Número Despacho'?: string;
    'Observaciones Finalización'?: string;
    'Subclase Proceso'?: string;
    Teléfono?: string;
    'Tipo Decisión'?: string;
    'Tipo Proceso'?: string;
    actuaciones?: any[];
    sujetos?: SujetoTyba[];
}

export interface JuzgadoTyba {
    'CODIGO PROCESO'?: string;
    DESPACHO?: string;
    'INFO PROCES0'?: InfoProcesoTyba; // Ojo: 'PROCES0' con cero al final
}

// Interfaces para la estructura 'libretamilitar' - Todas las propiedades opcionales
export interface LibretaMilitar {
    clase?: string;
    documento?: string;
    nombre?: string;
    tipo_documento?: string;
}

// Interfaces para la estructura 'lista_banco_mundial' - Todas las propiedades opcionales
export interface ListaBancoMundial {
    debarred_firms_individuals?: any[];
    others_sanctions?: any[];
}

// Interfaces para la estructura 'ofac' y 'ofac_nombre' - Todas las propiedades opcionales
export interface OfacAddress {
    Address?: string;
    City?: string;
    Country?: string;
    'Postal Code'?: string;
    'State/Province'?: string;
}

export interface OfacAlias {
    Category?: string;
    Name?: string;
    Type?: string;
}

export interface OfacDoc {
    Country?: string;
    'Expire Date'?: string;
    'ID#'?: string;
    'Issue Date'?: string;
    Type?: string;
}

export interface OfacEntry {
    ''?: string;
    'Citizenship:'?: string;
    'Date of Birth:'?: string;
    'First Name:'?: string;
    'Last Name:'?: string;
    'List:'?: string;
    'Nationality:'?: string;
    'Place of Birth:'?: string;
    'Program:'?: string;
    'Remarks:'?: string;
    'Title:'?: string;
    'Type:'?: string;
    addresses?: OfacAddress[];
    aliases?: OfacAlias[];
    docs?: OfacDoc[];
}

// Interfaces para la estructura 'peps' y 'peps_denom' - Todas las propiedades opcionales
export interface PepEntry {
    AKA?: string;
    CATEGORIA?: string;
    CODIGO?: string;
    DIRECCION?: string;
    ESTADO?: string;
    FECHA_FINAL_ROL?: string;
    FECHA_UPDATE?: string;
    ID?: string;
    NACIONALIDAD_PAISDEORIGEN?: string;
    NOMBRECOMPLETO?: string;
    NOMBRE_DESCRIPTIVO_LISTA?: string;
    NOMBRE_LISTA?: string;
    ORIGEN_LISTA?: string;
    PRIMER_APELLIDO?: string;
    PRIMER_NOMBRE?: string;
    RELACIONADO_CON?: string;
    ROL_O_DESCRIPCION1?: string;
    ROL_O_DESCRIPCION2?: string;
    SEGUNDO_APELLIDO?: string;
    SEGUNDO_NOMBRE?: string;
    TIPO_ID?: string;
    TIPO_LISTA?: string;
    TIPO_PERSONA?: string;
}

// Interfaces para la estructura 'personeriabog' - Todas las propiedades opcionales
export interface PersoneriaBogEntry {
    nombre?: string;
    sancion?: string;
}

// Interfaces para la estructura 'procuraduria' - Todas las propiedades opcionales
export interface ProcuraduriaInstancia {
    Autoridad?: string;
    'Fecha providencia'?: string;
    Nombre?: string;
    'fecha efecto Juridicos'?: string;
}

export interface ProcuraduriaSancion {
    'Clase sanción'?: string;
    Entidad?: string;
    Sanción?: string;
    Término?: string;
}

export interface ProcuraduriaDato {
    Instancias?: ProcuraduriaInstancia[];
    SIRI?: string;
    Sanciones?: ProcuraduriaSancion[];
}

export interface ProcuraduriaEntry {
    datos?: ProcuraduriaDato[];
    delito?: string;
}

// Interfaces para la estructura 'profesion' - Todas las propiedades opcionales
export interface Copnia {
    certificate_number?: string;
    certificate_status?: string;
    certificate_type?: string;
    document_number?: string;
    document_type?: string;
    full_name?: string;
    profession?: string;
    resolution_date?: string;
    resolution_number?: string;
}

export interface Profesion {
    abogado?: Record<string, any>;
    abogados_judicial?: any[];
    anec?: Record<string, any>;
    colpsic?: Record<string, any>;
    comvezcol?: Record<string, any>;
    conalpe?: Record<string, any>;
    conaltel?: any[];
    consejopro?: Record<string, any>;
    copnia?: Copnia;
    cpae?: Record<string, any>;
    cpbiol?: Record<string, any>;
    cpiq?: Record<string, any>;
    cpnt?: Record<string, any>;
    cpqcol?: Record<string, any>;
    jcc?: Record<string, any>;
    rethus?: Record<string, any>;
}

// Interfaces para la estructura 'rama' - Todas las propiedades opcionales
export interface Rama {
    armeniajepms?: boolean;
    barranquillajepms?: boolean;
    bogotajepms?: boolean;
    bucaramangajepms?: boolean;
    bugajepms?: boolean;
    calijepms?: boolean;
    cartagenajepms?: boolean;
    florenciajepms?: boolean;
    ibaguejepms?: boolean;
    manizalesjepms?: boolean;
    medellinjepms?: boolean;
    monteriajepms?: boolean;
    neivajepms?: boolean;
    palmirajepms?: boolean;
    pastojepms?: boolean;
    pereirajepms?: boolean;
    popayanjepms?: boolean;
    quibdojepms?: boolean;
    tunjajepms?: boolean;
    villavicenciojepms?: boolean;
}

// Interfaces para la estructura 'rama_unificada' - Todas las propiedades opcionales
export interface RamaUnificadaActuacion {
    actuacion?: string;
    anotacion?: string;
    cant?: number;
    codRegla?: string;
    conDocumentos?: boolean;
    consActuacion?: number;
    fechaActuacion?: string; // Podría ser Date
    fechaFinal?: string;
    fechaInicial?: string;
    fechaRegistro?: string; // Podría ser Date
    idRegActuacion?: number;
    llaveProceso?: string;
}

export interface RamaUnificadaSujeto {
    cant?: number;
    esEmplazado?: boolean;
    idRegSujeto?: number;
    identificacion?: string;
    nombreRazonSocial?: string;
    tipoSujeto?: string;
}

export interface RamaUnificadaEntry {
    actuaciones?: RamaUnificadaActuacion[];
    cantFilas?: number;
    claseProceso?: string;
    contenidoRadicacion?: string;
    demandado?: string[];
    demandante?: string[];
    departamento?: string;
    despacho?: string;
    detalle?: boolean;
    esPrivado?: boolean;
    estado_actuacion?: string;
    fechaConsulta?: string;    // Podría ser Date
    fechaProceso?: string;     // Podría ser Date
    fechaUltimaActuacion?: string; // Podría ser Date
    idConexion?: number;
    idProceso?: number;
    idRegProceso?: number;
    is_demandado?: boolean;
    llaveProceso?: string;
    ponente?: string;
    recurso?: string;
    subclaseProceso?: string;
    sujetos?: RamaUnificadaSujeto[];
    sujetosProcesales?: string;
    tieneActuaciones?: boolean;
    tipoProceso?: string;
    ubicacion?: string;
    ultimaActualizacion?: string;
}

// Interfaces para la estructura 'registraduria_certificado' - Todas las propiedades opcionales
export interface RegistraduriaCertificado {
    cedula?: string;
    estado?: string;
    fecha_exp?: string;
    lugar_exp?: string;
    nombre?: string;
}

// Interfaces para la estructura 'relacionados' - Todas las propiedades opcionales
export interface RepresentacionVinculo {
    'no identificación'?: string;
    nombre?: string;
    'tipo de vinculo'?: string;
}

export interface RelacionadoEmpresa {
    razon_social?: string;
    representacion_legal_y_vinculos?: RepresentacionVinculo[];
}

export interface Relacionado {
    empresa?: RelacionadoEmpresa;
    nit?: number;
}

// Interfaces para la estructura 'reputacional' - Todas las propiedades opcionales
export interface ReputacionalItem {
    description?: string;
    idioma?: string;
    keyword?: string;
    link?: string;
    rank?: number;
    sentimiento?: string;
    source?: string;
    title?: string;
}

export interface Reputacional {
    news?: ReputacionalItem[];
    notable?: Record<string, any>;
    social?: ReputacionalItem[];
}

// Interfaces para la estructura 'rndc' - Todas las propiedades opcionales
export interface RndcEntry {
    'Cedula Conductor'?: string;
    Consecutivo?: string;
    Destino?: string;
    'Fecha Expedición'?: string;
    'Fecha Hora Radicación'?: string;
    'Nombre Empresa Transportadora'?: string;
    'Nro de Radicado'?: string;
    Origen?: string;
    Placa?: string;
    'Placa Remolque'?: string;
    'Tipo Doc'?: string;
}

// Interfaces para la estructura 'rnmc' - Todas las propiedades opcionales
export interface Rnmc {
    apelacion?: string; // Podría ser 'SI' | 'NO'
    articulo?: string;
    departamento?: string;
    expediente?: string;
    expendiente?: string; // Posible typo
    fecha?: string;
    formato?: string;
    identificación?: string;
    infractor?: string;
    municipio?: string;
}

// Interfaces para la estructura 'ruaf' - Todas las propiedades opcionales
export interface RuafARL {
    'Actividad Economica'?: string;
    Administradora?: string;
    'Estado de Afiliación'?: string;
    'Fecha de Afiliación'?: string; // Podría ser Date
    'Fecha de corte'?: string; // Podría ser Date
    'Municipio Labora'?: string;
}

export interface RuafBasico {
    'Fecha de corte'?: string; // Podría ser Date
    'Número de Identificación'?: string;
    'Primer Apellido'?: string;
    'Primer Nombre'?: string;
    'Segundo Apellido'?: string;
    'Segundo Nombre'?: string;
    Sexo?: string;
}

export interface RuafCaja {
    'Administradora CF'?: string;
    'Estado de Afiliación'?: string;
    'Fecha de Afiliación'?: string; // Podría ser Date
    'Fecha de corte'?: string; // Podría ser Date
    'Municipio Labora'?: string;
    'Tipo de Afiliado'?: string;
    'Tipo de Miembro de la Población Cubierta'?: string;
}

export interface RuafCesantias {
    Cesantías?: string;
    'Fecha de corte'?: string; // Podría ser Date
}

export interface RuafPensionado {
    'Fecha de corte'?: string; // Podría ser Date
    Pensionado?: string;
}

export interface RuafPensiones {
    Administradora?: string;
    'Estado de Afiliación'?: string;
    'Fecha de Afiliación'?: string; // Podría ser Date
    'Fecha de corte'?: string; // Podría ser Date
    Régimen?: string;
}

export interface RuafProgramas {
    'Fecha de corte'?: string; // Podría ser Date
    'Programas de Asistencia Social'?: string;
}

export interface RuafSalud {
    Administradora?: string;
    'Departamento -> Municipio'?: string;
    'Estado de Afiliación'?: string;
    'Fecha Afiliacion'?: string; // Podría ser Date
    'Fecha de corte'?: string; // Podría ser Date
    Régimen?: string;
    'Tipo de Afiliado'?: string;
}

export interface Ruaf {
    ARL?: RuafARL[];
    Basico?: RuafBasico[];
    'Caja de compensación'?: RuafCaja[];
    Cesantías?: RuafCesantias[];
    Pensionado?: RuafPensionado[];
    Pensiones?: RuafPensiones[];
    'Programas de Asistencia Social'?: RuafProgramas[];
    Salud?: RuafSalud[];
}

// Interfaces para la estructura 'runt_app' - Todas las propiedades opcionales
export interface RuntLicenciaItem {
    categoria?: string;
    estado?: string;
    fecha_expedicion?: string; // Podría ser Date
    fecha_vencimiento?: string; // Podría ser Date
    numero_licencia?: string;
    sustrato?: string;
}

export interface RuntLicencia {
    licencias?: RuntLicenciaItem[];
    totalLicencias?: number;
}

export interface RuntMulta {
    estado_cancelacion?: string; // Podría ser 'SI' | 'NO'
    estado_paz_salvo?: string; // Podría ser 'SI' | 'NO'
    estado_suspension?: string;
    fecha_cancelacion?: string;
    fecha_suspension?: string;
    numero_comparendos?: string; // Podría ser number
    numero_paz_salvo?: string;
}

export interface RuntApp {
    exitoso?: boolean;
    licencia?: RuntLicencia;
    multa?: RuntMulta;
    nombres?: string;
}

// Interfaces para la estructura 'secop2' - Todas las propiedades opcionales
export interface UrlProceso {
    url?: string;
}

export interface Secop2Entry {
    anno_bpin?: string;
    c_digo_bpin?: string;
    ciudad?: string;
    codigo_de_categoria_principal?: string;
    codigo_entidad?: string;
    codigo_proveedor?: string;
    condiciones_de_entrega?: string;
    departamento?: string;
    descripcion_del_proceso?: string;
    destino_gasto?: string;
    dias_adicionados?: string; // Podría ser number
    documento_proveedor?: string;
    entidad_centralizada?: string;
    es_grupo?: string; // Podría ser boolean
    es_pyme?: string; // Podría ser boolean
    espostconflicto?: string; // Podría ser boolean
    estado_bpin?: string;
    estado_contrato?: string;
    fecha_de_fin_del_contrato?: string; // Podría ser Date
    fecha_de_firma?: string; // Podría ser Date
    fecha_de_inicio_del_contrato?: string; // Podría ser Date
    fecha_fin_liquidacion?: string; // Podría ser Date
    fecha_inicio_liquidacion?: string; // Podría ser Date
    g_nero_representante_legal?: string;
    habilita_pago_adelantado?: string; // Podría ser boolean
    id_contrato?: string;
    identificaci_n_representante_legal?: string;
    justificacion_modalidad_de?: string;
    liquidaci_n?: string; // Podría ser boolean
    localizaci_n?: string;
    modalidad_de_contratacion?: string;
    nacionalidad_representante_legal?: string;
    nit_entidad?: string;
    nombre_entidad?: string;
    nombre_representante_legal?: string;
    objeto_del_contrato?: string;
    obligaci_n_ambiental?: string; // Podría ser boolean
    obligaciones_postconsumo?: string; // Podría ser boolean
    orden?: string;
    origen_de_los_recursos?: string;
    pilares_del_acuerdo?: string;
    presupuesto_general_de_la_nacion_pgn?: string; // Podría ser number
    proceso_de_compra?: string;
    proveedor_adjudicado?: string;
    puntos_del_acuerdo?: string;
    rama?: string;
    recursos_de_credito?: string; // Podría ser number
    recursos_propios?: string; // Podría ser number
    'recursos_propios_alcald_as_gobernaciones_y_resguardos_ind_genas_'?: string; // Podría ser number
    referencia_del_contrato?: string;
    reversion?: string; // Podría ser boolean
    saldo_cdp?: string; // Podría ser number
    saldo_vigencia?: string; // Podría ser number
    sector?: string;
    sistema_general_de_participaciones?: string; // Podría ser number
    sistema_general_de_regal_as?: string; // Podría ser number
    tipo_de_contrato?: string;
    tipo_de_identificaci_n_representante_legal?: string;
    tipodocproveedor?: string;
    ultima_actualizacion?: string; // Podría ser Date
    urlproceso?: UrlProceso;
    valor_amortizado?: string; // Podría ser number
    valor_de_pago_adelantado?: string; // Podría ser number
    valor_del_contrato?: string; // Podría ser number
    valor_facturado?: string; // Podría ser number
    valor_pagado?: string; // Podría ser number
    valor_pendiente_de?: string; // Podría ser number
    valor_pendiente_de_ejecucion?: string; // Podría ser number
    valor_pendiente_de_pago?: string; // Podría ser number
}

// Interfaces para la estructura 'secop' - Todas las propiedades opcionales
export interface RutaProcesoSecopI {
    url?: string;
}

export interface SecopEntry {
    cuantia_proceso?: string; // Podría ser number
    detalle_del_objeto_a_contratar?: string;
    estado_del_proceso?: string;
    fecha_de_firma_del_contrato?: string; // Podría ser Date
    nom_raz_social_contratista?: string;
    nombre_del_represen_legal?: string;
    ruta_proceso_en_secop_i?: RutaProcesoSecopI;
    tipo_de_contrato?: string;
    tipo_de_proceso?: string;
}

// Interfaces para la estructura 'secop_s' - Todas las propiedades opcionales
export interface SecopSEntry {
    descripcion_contrato?: string;
    documento_contratista?: string;
    fecha_de_publicacion?: string; // Podría ser Date
    municipio?: string;
    nit_entidad?: string;
    nivel?: string;
    nombre_contratista?: string;
    nombre_entidad?: string;
    numero_de_contrato?: string;
    numero_de_resolucion?: string;
    numero_proceso?: string;
    orden?: string;
    ruta_de_proceso?: string;
    tipo_documento?: string;
    tipo_incumplimiento?: string;
    valor_sancion?: string; // Podría ser number
}

// Interfaces para la estructura 'sena' - Todas las propiedades opcionales
export interface SenaEntry {
    Certificación?: string; // Podría ser Date
    Descarga?: string;
    'Estado de Certificación'?: string;
    'Estado del Aprendiz'?: string;
    Programa?: string;
    Registro?: string;
    Tipo?: string;
}

// Interfaces para la estructura 'sigep' - Todas las propiedades opcionales
export interface SigepExperiencia {
    'Rangos de salario por nivel'?: string;
}

export interface SigepInformacionBasica {
    cargo_funcionario?: string;
    dependencia_funcionario?: string;
    institucion_funcionario?: string;
    nombre_funcionario?: string;
}

export interface Sigep {
    'Experiencia Laboral'?: SigepExperiencia[];
    'Formación Académica'?: string[];
    'Informacion basica'?: SigepInformacionBasica;
}

// Interfaces para la estructura 'simit' - Todas las propiedades opcionales
export interface SimitCurso {
    centro_intruccion?: string;
    certificado?: string;
    cuidad?: string;
    estado?: string;
    fecha_comparendo?: string;
    fecha_curso?: string; // Podría ser Date
    fecha_reporte?: string;
    numero_multa?: string;
}

export interface Simit {
    acuerdos_pagar?: number;
    acuerdos_pagos?: any[];
    cantidad_multas?: number;
    cursos?: SimitCurso[];
    multas?: any[];
    numero_documento?: string;
    paz_salvo?: boolean;
    total_acuardos_por_pagar?: number;
    total_general?: number;
    total_multas?: number;
    total_multas_pagar?: number;
    total_pagar?: number;
}

// Interfaces para la estructura 'simur' - Todas las propiedades opcionales
export interface SimurEntry {
    'Estado comparendo'?: string;
    'Fecha Infraccion'?: string; // Podría ser Date
    Intereses?: string; // Podría ser number
    'No Comparendo'?: string;
    Placa?: string;
    Saldo?: string; // Podría ser number
    Tipo?: string;
}

// Interfaces para la estructura 'sirna' - Todas las propiedades opcionales
export interface SirnaEntry {
    apellidos?: string;
    codigo_de_estado_de_sancion?: string;
    estado_de_la_sancion?: string;
    fecha_de_finalizacion?: string; // Podría ser Date
    fecha_de_inicio?: string; // Podría ser Date
    nombres?: string;
    numero_de_cedula?: string;
    tipo_de_sancion?: string;
}

// Interfaces para la estructura 'sisben' - Todas las propiedades opcionales
export interface Sisben {
    'Actualizacion Ciudadano'?: string; // Podría ser Date
    Apellido?: string;
    Departamento?: string;
    Estado?: string;
    Ficha?: string;
    Grupo?: string;
    Municipio?: string;
    Nombre?: string;
    'Tipo de grupo'?: string;
}

// Interfaces para la estructura 'sisconmp' - Todas las propiedades opcionales
export interface Sisconmp {
    Apellidos?: string;
    Clase?: string;
    DCInstitucionEducativa?: number;
    DIVCODIGSede?: string;
    DIVNOMBRSede?: string;
    DescripcionClase?: string;
    EntidadCertificadora?: string;
    FechaExpedicion?: string; // Podría ser Date
    FechaExpedicionLicencia?: string; // Podría ser Date
    FechaVencimiento?: string; // Podría ser Date
    FechaVencimientoLicencia?: string; // Podría ser Date
    Inactivo?: string; // Podría ser boolean
    InstitucionEducativa?: string;
    NDI?: string;
    NIDSede?: string;
    NITInstitucionEducativa?: number;
    NombreArchivo?: string;
    NombreCapacitacion?: string;
    NombreSede?: string;
    Nombres?: string;
    NumeroLicencia?: string;
    TDI?: string;
    TipoCapacitacion?: string;
    TipoVehiculo?: string;
    ValorNumericoClase?: number;
}


// --- INTERFAZ PRINCIPAL --- Todas las propiedades opcionales
export interface ApiResponse {
    cidob?: Cidob;
    contadores_s?: ContadorS[];
    contaduria?: boolean;
    contaduria_pdf?: boolean;
    contraloria?: boolean;
    contraloria2?: boolean;
    dest?: string;
    dict_hallazgos?: DictHallazgos;
    error?: boolean;
    errores?: any[];
    europol?: Europol;
    fecha?: string;
    fopep?: Fopep;
    garantias_mobiliarias?: GarantiaMobiliaria[];
    genero?: string;
    google?: GoogleResult[];
    hallazgos?: string;
    iadb?: IadbEntry[];
    id?: string;
    inmov_bog?: InmovBog;
    inpec?: Inpec;
    interpol?: boolean;
    juzgados_tyba?: JuzgadoTyba[];
    libretamilitar?: LibretaMilitar;
    lista_banco_mundial?: ListaBancoMundial;
    lista_onu?: boolean;
    monitoring_date?: string; // Podría ser Date
    nombre?: string;
    'nombre-procuraduria'?: string;
    ofac?: OfacEntry;
    ofac_nombre?: OfacEntry;
    peps?: PepEntry[];
    peps2?: boolean;
    peps_denom?: PepEntry[];
    personeriabog?: PersoneriaBogEntry[];
    policia?: boolean;
    procuraduria?: ProcuraduriaEntry[];
    profesion?: Profesion;
    proveedores_ficticios?: boolean;
    rama?: Rama;
    rama_unificada?: RamaUnificadaEntry[];
    registraduria_certificado?: RegistraduriaCertificado;
    relacionados?: Relacionado[];
    reputacional?: Reputacional;
    rndc?: RndcEntry[];
    rnmc?: Rnmc;
    rues?: boolean;
    ruaf?: Ruaf;
    runt_app?: RuntApp;
    rut?: string;
    rut_estado?: string;
    secop2?: Secop2Entry[];
    secop?: SecopEntry[];
    secop_s?: SecopSEntry[];
    sena?: SenaEntry[];
    sigep?: Sigep;
    simit?: Simit;
    simur?: SimurEntry[];
    sirna?: SirnaEntry[];
    sisben?: Sisben;
    sisconmp?: Sisconmp;
    transitobog?: boolean;
}



import { CreditApplication, DocumentType } from '../types';
import { formatEUR } from './financialCalculations';

export interface LegalDocumentPage {
  pageNumber: number;
  totalPageCount: number;
  pageTitle: string;
  contentHtml: string;
}

export interface RenderedLegalDocument {
  id: string;
  documentType: DocumentType;
  title: string;
  subtitle: string;
  legalBasis: string;
  watermark: string;
  sealText: string;
  pages: LegalDocumentPage[];
  signatureBlock: {
    signerName: string;
    signerDocument: string;
    expeditionCity: string;
    timestamp: string;
    hashSha256: string;
    ipAddress: string;
    verifiedOtp: string;
    accountNumber: string;
  };
}

export function generateLegalDocument(
  app: CreditApplication,
  docType: DocumentType
): RenderedLegalDocument {
  const p = app.personalData;
  const e = app.economicData;
  const b = app.bankDetails;
  const l = app.loanDetails;
  const s = app.signatureDetails;
  const acc = app.digitalAccount;

  const fullName = `${p.firstName} ${p.lastName}`.trim().toUpperCase();
  const documentStr = `${p.documentType} N° ${p.documentNumber} (${p.nationality || 'España'})`;
  const capitalStr = formatEUR(l.capital);
  const totalStr = formatEUR(l.totalToPay);
  const interestStr = formatEUR(l.interestAmount);
  const fgaStr = formatEUR(l.fgaGuaranteeAmount);
  const techStr = formatEUR(l.technologyAndSignature);
  const ivaStr = formatEUR(l.ivaAmount);
  const loanPurposeStr = e.loanPurpose || l.loanPurpose || 'Reformas y Necesidades Personales';
  const monthlyQuotaStr = l.quotas && l.quotas.length > 0 ? formatEUR(l.quotas[0].totalQuota) : totalStr;
  const quotasCount = l.quotas && l.quotas.length > 0 ? l.quotas.length : 1;

  const sigBlock = {
    signerName: fullName,
    signerDocument: documentStr,
    expeditionCity: `${e.city} (${e.province}, España)`,
    timestamp: s.signedAt || app.createdAt,
    hashSha256: s.signatureHash,
    ipAddress: s.ipAddress,
    verifiedOtp: s.otpCode,
    accountNumber: acc.accountNumber
  };

  switch (docType) {
    // -------------------------------------------------------------
    // DOCUMENT 1: CONTRATO DE PRÉSTAMO MERCANTIL AL CONSUMO (4 PÁGS)
    // -------------------------------------------------------------
    case 'contrato_mutuo':
      return {
        id: `MUT-${app.id}`,
        documentType: 'contrato_mutuo',
        title: 'CONTRATO DE PRÉSTAMO Y CRÉDITO AL CONSUMO A DISTANCIA',
        subtitle: 'CONDICIONES GENERALES Y PARTICULARES DE FINANCIACIÓN (LEY 16/2011)',
        legalBasis: 'Ley 16/2011, de 24 de junio, de contratos de crédito al consumo • Directiva 2008/48/CE • Circular 5/2012 Banco de España',
        watermark: 'INSTACREDIT ESPAÑA S.L. - CONTRATO HOMOLOGADO BD-E - NIF B-89412093',
        sealText: 'CONTRATO DE PRÉSTAMO PERSONAL HOMOLOGADO LEY 16/2011 - SUPERVISIÓN BANCO DE ESPAÑA',
        pages: [
          {
            pageNumber: 1,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 1 DE 4: COMPARECENCIA, CONDICIONES PARTICULARES Y FICHA NORMALIZADA (INE)',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p>
                  En Madrid, a <strong>${app.createdAt}</strong>, formalizan de común acuerdo el presente contrato mercantil: de una parte, <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong>, entidad inscrita en el Registro Mercantil de Madrid (Tomo 41.209, Folio 112, Sección 8, Hoja M-729104), con NIF <strong>B-89412093</strong> y sede corporativa en Paseo de la Castellana 95, Planta 14, 28046 Madrid, España (en adelante, <strong>"EL PRESTAMISTA"</strong>); y de otra parte, <strong>${fullName}</strong>, mayor de edad, con domicilio habitual en <strong>${e.address}, ${e.postalCode} ${e.city} (${e.province}, España)</strong>, provisto(a) de <strong>${documentStr}</strong>, móvil de contacto <strong>${p.phone}</strong> y correo <strong>${p.email}</strong> (en adelante, <strong>"EL PRESTATARIO"</strong>).
                </p>

                <div class="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-xs space-y-1.5">
                  <div class="font-bold text-blue-950 border-b border-blue-200 pb-1">
                    CUADRO DE CONDICIONES FINANCIERAS PARTICULARES (INE - LEY 16/2011):
                  </div>
                  <div class="grid grid-cols-2 gap-2 font-mono">
                    <div>Capital Concedido: <strong>${capitalStr}</strong></div>
                    <div>Plazo de Amortización: <strong>${l.termDays} días naturales (${quotasCount} cuotas)</strong></div>
                    <div>Tipo de Interés Nominal (TIN): <strong>6,95% TIN Anual (0,579% mensual)</strong></div>
                    <div>Tasa Anual Equivalente (TAE): <strong>7,82% TAE Regulada</strong></div>
                    <div>Fondo de Garantía Europeo (3%): <strong>${fgaStr}</strong></div>
                    <div>Custodia y Firma Digital eIDAS: <strong>${techStr}</strong></div>
                    <div>IVA Repercutible (21%): <strong>${ivaStr}</strong></div>
                    <div>Cuota Mensual Estimada: <strong>${monthlyQuotaStr} / mes</strong></div>
                    <div>Finalidad Declarada: <strong>${loanPurposeStr}</strong></div>
                    <div>Cuenta Digital Asignada: <strong>${acc.accountNumber}</strong></div>
                    <div class="col-span-2 pt-1 border-t border-blue-200 text-sm font-bold text-blue-900">
                      IMPORTE TOTAL ADEUDADO AL VENCIMIENTO (${l.dueDate}): ${totalStr}
                    </div>
                  </div>
                </div>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA PRIMERA. OBJETO DEL CONTRATO, DEFINICIÓN DE DESEMBOLSO Y DISPONIBILIDAD EN CUENTA INTERNA:
                </p>
                <p>
                  1.1. EL PRESTAMISTA concede a EL PRESTATARIO un préstamo personal al consumo por importe de <strong>${capitalStr}</strong>. A todos los efectos legales y contractuales, se entiende perfeccionado y ejecutado el <strong>DESEMBOLSO</strong> en el momento exacto en que el sistema central, tras la validación y autorización operativa del asesor asignado, abona y acredita los fondos en la <strong>Cuenta Digital Interna Instacredit IBAN ${acc.accountNumber}</strong> creada por el propio usuario en nuestra plataforma.
                </p>
                <p>
                  1.2. Una vez acreditados los fondos en dicha Cuenta Digital Interna, el capital se encuentra bajo la plena titularidad y libre disposición de EL PRESTATARIO, quien podrá ordenar su transferencia inmediata hacia su cuenta bancaria personal externa en <strong>${b.bankName} (IBAN: ${b.iban})</strong> o disponer de los fondos mediante las tarjetas virtuales de débito o crédito vinculadas a su cuenta.
                </p>
                <p>
                  1.3. El prestatario declara bajo su entera responsabilidad que el capital financiado será destinado a: <strong>${loanPurposeStr}</strong>, y queda expresamente estipulado conforme a la Ley 16/2011 que la entidad garantiza la no exigencia de cobros previos antes de que el préstamo sea autorizado y desembolsado en la Cuenta Digital creada por el titular.
                </p>
              </div>
            `
          },
          {
            pageNumber: 2,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 2 DE 4: SISTEMA DE AMORTIZACIÓN, CUOTAS, DOMICILIACIÓN Y REEMBOLSO',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA SEGUNDA. SISTEMA DE AMORTIZACIÓN Y CUADRO DE VENCIMIENTOS:
                </p>
                <p>
                  2.1. El préstamo se amortizará mediante el sistema de cuotas constantes periódicas. La primera cuota devengará a los 30 días de la concesión y las subsiguientes en idéntico día de cada mes natural, concluyendo definitivamente el día <strong>${l.dueDate}</strong>.
                </p>
                <p>
                  2.2. Cada cuota mensual integrará la parte correspondiente de amortización de capital, los intereses remuneratorios devengados calculados sobre el saldo vivo, y las comisiones accesorias reguladas. El importe de cada cuota asciende a <strong>${monthlyQuotaStr}</strong>.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA TERCERA. MODALIDAD DE PAGO, DOMICILIACIÓN BANCARIA Y BIZUM:
                </p>
                <p>
                  3.1. El prestatario autoriza expresamente el adeudo bancario SEPA Direct Debit en la cuenta corriente de la que es titular acreditado en <strong>${b.bankName} con IBAN ${b.iban}</strong>.
                </p>
                <p>
                  3.2. Alternativamente, EL PRESTATARIO podrá abonar las cuotas a través de la pasarela telemática de pago seguro mediante tarjeta bancaria (3D Secure), transferencia bancaria instantánea o mediante el canal oficial Bizum habilitado en el portal digital de clientes de INSTACREDIT.
                </p>
                <p>
                  3.3. Todo pago realizado se imputará en primer término a gastos e impuestos, seguidamente a intereses devengados y finalmente a principal vivo del crédito, conforme a lo establecido en el Artículo 1172 del Código Civil de España.
                </p>
              </div>
            `
          },
          {
            pageNumber: 3,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 3 DE 4: DERECHO DE DESISTIMIENTO (14 DÍAS) Y AMORTIZACIÓN ANTICIPADA',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA CUARTA. DERECHO DE DESISTIMIENTO LEGAL SIN PENALIZACIÓN (ART. 28 LEY 16/2011):
                </p>
                <p>
                  4.1. EL PRESTATARIO dispone de un plazo legal inalienable de <strong>catorce (14) días naturales</strong> a contar desde la formalización telemática del contrato para ejercer su derecho de desistimiento, sin necesidad de alegar causa o justificación alguna y sin que proceda penalización por mora ni indemnización.
                </p>
                <p>
                  4.2. El desistimiento podrá comunicarse fehacientemente mediante correo electrónico dirigido a <strong>sac@instacredit.es</strong> o a través del formulario habilitado en la aplicación web. En tal caso, el prestatario restituirá el capital recibido de <strong>${capitalStr}</strong> y los intereses estrictamente devengados hasta la fecha de efectiva devolución, en un plazo máximo de treinta (30) días naturales.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA QUINTA. AMORTIZACIÓN ANTICIPADA TOTAL O PARCIAL (ART. 30 LEY 16/2011):
                </p>
                <p>
                  5.1. EL PRESTATARIO podrá en cualquier momento liquidar anticipadamente, de forma total o parcial, las obligaciones pendientes del préstamo. En tal supuesto, tendrá derecho a una reducción proporcional del coste total del crédito, que comprenderá los intereses y gastos correspondientes a la duración del contrato que quede por transcurrir.
                </p>
                <p>
                  5.2. INSTACREDIT fija su comisión de compensación por reembolso anticipado en un <strong>0,00% (cero por ciento)</strong>, garantizando la máxima ventaja económica y flexibilidad para el consumidor.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA SEXTA. RÉGIMEN DE MOROSIDAD Y LÍMITES LEGALES (CRITERIO BANCO DE ESPAÑA):
                </p>
                <p>
                  6.1. En caso de retraso no justificado en el pago de alguna cuota, el tipo de interés de demora aplicable será estrictamente el interés remuneratorio pactado incrementado en dos puntos porcentuales anuales, en rigurosa aplicación de la doctrina fijada por la Sala Primera del Tribunal Supremo en Sentencias 265/2015 y 470/2015. Quedan expresamente prohibidos anatocismos o penalizaciones desproporcionadas.
                </p>
              </div>
            `
          },
          {
            pageNumber: 4,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 4 DE 4: VENCIMIENTO ANTICIPADO, FUERO JUDICIAL Y FIRMA ELECTRÓNICA eIDAS',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA SÉPTIMA. CAUSAS TASADAS DE VENCIMIENTO ANTICIPADO:
                </p>
                <p>
                  7.1. EL PRESTAMISTA únicamente podrá resolver el contrato y reclamar la totalidad del préstamo cuando concurra un impago reiterado de cuotas equivalentes al menos a tres mensualidades ordinarias, previa intimación fehaciente otorgando un plazo mínimo de 15 días hábiles para regularizar la situación.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-1">
                  CLÁUSULA OCTAVA. ATENCIÓN AL CLIENTE, DEFENSOR Y FUERO JUDICIAL PROTECTOR:
                </p>
                <p>
                  8.1. Para la resolución de controversias, el usuario dispone del Servicio de Atención al Cliente (SAC) de INSTACREDIT (Orden ECO/734/2004) y subsidiariamente del Departamento de Conducta de Mercado y Reclamaciones del Banco de España.
                </p>
                <p>
                  8.2. Las partes se someten imperativamente a la jurisdicción de los Juzgados y Tribunales competentes del domicilio del consumidor prestatario en <strong>${e.city} (${e.province})</strong>, de conformidad con el Artículo 52.2 de la Ley de Enjuiciamiento Civil y el TRLGDCU.
                </p>

                <div class="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 mt-2">
                  <div class="font-bold text-xs text-[#0B1B3D] border-b pb-1 flex justify-between">
                    <span>CERTIFICADO DE FIRMA ELECTRÓNICA CUALIFICADA (eIDAS UE 910/2014)</span>
                    <span class="text-emerald-700 font-bold">VÁLIDO Y VINCULANTE EN DERECHO</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
                    <div>Firmante Prestatario: <strong>${fullName}</strong></div>
                    <div>Documento Oficial: <strong>${documentStr}</strong></div>
                    <div>IBAN Cuenta Digital: <strong>${acc.accountNumber}</strong></div>
                    <div>Sello Temporal Auditado: <strong>${sigBlock.timestamp}</strong></div>
                    <div>Dirección IP Trazada: <strong>${sigBlock.ipAddress}</strong></div>
                    <div>Código OTP SMS Verificado: <strong class="text-emerald-700">${sigBlock.verifiedOtp} (Conforme Ley 6/2020)</strong></div>
                  </div>
                  <div class="text-[10px] text-slate-500 font-mono pt-1 truncate">
                    Hash Criptográfico SHA-256: ${sigBlock.hashSha256}
                  </div>
                </div>
              </div>
            `
          }
        ],
        signatureBlock: sigBlock
      };

    // -------------------------------------------------------------
    // DOCUMENT 2: CONDICIONES GENERALES DE CONTRATACIÓN (4 PÁGS)
    // -------------------------------------------------------------
    case 'condiciones_generales':
    case 'contrato_apertura_plataforma':
      return {
        id: `CGC-${app.id}`,
        documentType: 'condiciones_generales',
        title: 'CONDICIONES GENERALES DE CONTRATACIÓN Y SERVICIOS DIGITALES',
        subtitle: 'REGLAMENTO CONTRACTUAL PARA CUENTA DIGITAL, SERVICIOS FINANCIEROS Y OPERATIVA ONLINE',
        legalBasis: 'Ley 7/1998, de 13 de abril, sobre Condiciones Generales de la Contratación • Real Decreto Legislativo 1/2007 (TRLGDCU) • Ley 34/2002 (LSSI-CE)',
        watermark: 'INSTACREDIT ESPAÑA S.L. - CONDICIONES GENERALES REGISTRADAS - NIF B-89412093',
        sealText: 'CONDICIONES GENERALES REGISTRADAS DE SERVICIOS FINANCIEROS - BANCO DE ESPAÑA',
        pages: [
          {
            pageNumber: 1,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 1 DE 4: ÁMBITO DE APLICACIÓN, IDENTIFICACIÓN SOCIAL Y CUENTA DIGITAL',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p>
                  Las presentes Condiciones Generales de Contratación (en adelante, <strong>"CGC"</strong>) regulan de manera vinculante la relación mercantil entre <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> (NIF <strong>B-89412093</strong>), con domicilio social en Paseo de la Castellana 95, Planta 14, 28046 Madrid, España; y la persona física o jurídica identificada como <strong>${fullName}</strong>, con <strong>${documentStr}</strong>, domicilio en <strong>${e.address}, ${e.postalCode} ${e.city} (${e.province})</strong> y teléfono <strong>${p.phone}</strong> (en adelante, <strong>"EL CLIENTE"</strong>).
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA 1. APERTURA DE CUENTA DIGITAL INTERNA, TARJETAS VINCULADAS Y DEFINICIÓN DE DESEMBOLSO:
                </p>
                <p>
                  1.1. Con la aceptación de las presentes condiciones, INSTACREDIT procede a la apertura en favor del cliente de una <strong>Cuenta Digital bancaria interna e independiente identificada con el IBAN ${acc.accountNumber}</strong> y código BIC/SWIFT <strong>INSTESMMXXX</strong>.
                </p>
                <p>
                  1.2. Cada cuenta digital es estrictamente personal, intransferible y protegida por verificación de sesión por dispositivo. La cuenta inicia en saldo cero (0,00 €) hasta el momento en que se produzca una recarga voluntaria o la acreditación del desembolso de un préstamo aprobado.
                </p>
                <p>
                  1.3. <strong>Perfeccionamiento del Desembolso:</strong> Las partes acuerdan expresamente que se considera ejecutado y perfeccionado el desembolso del préstamo en el instante en que el sistema central lo autoriza —por acción y validación del asesor asignado— y los fondos quedan depositados y visibles en la Cuenta Digital Interna creada por el usuario, desde la cual el titular tiene el pleno dominio para transferirlos a su banco personal externo o utilizarlos mediante sus tarjetas virtuales de débito y crédito vinculadas.
                </p>
              </div>
            `
          },
          {
            pageNumber: 2,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 2 DE 4: OPERATIVA TRANSACCIONAL, BIZUM, SEPA Y SEGURIDAD TELEMÁTICA',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA 2. OPERATIVA DE FONDOS, TRANSFERENCIAS Y CANALES DE PAGO:
                </p>
                <p>
                  2.1. El cliente podrá movilizar su saldo disponible a través de transferencias SEPA estándar y SEPA Instant hacia cuentas corrientes externas abiertas a su nombre en entidades de crédito del Espacio Económico Europeo, así como recibir fondos de manera instantánea mediante Bizum.
                </p>
                <p>
                  2.2. Por imperativo de la Ley 10/2010 de Prevención del Blanqueo de Capitales y de la Financiación del Terrorismo (SEPBLAC), queda estrictamente prohibida la transferencia de fondos a cuentas bancarias de terceros no titularizados por el cliente solicitante verificado.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA 3. CREDENCIALES DE ACCESO Y SEGURIDAD MULTIFACTOR (SCA / PSD2):
                </p>
                <p>
                  3.1. El acceso a la banca web y PWA de INSTACREDIT exige la autenticación biométrica o contraseña robusta y la verificación de código dinámico remitido por SMS OTP al teléfono verificado <strong>${p.phone}</strong>, en cumplimiento de los estándares de Autenticación Reforzada de Cliente (SCA) exigidos por la Directiva Europea de Servicios de Pago (PSD2).
                </p>
                <p>
                  3.2. El cliente asume el deber de custodiar con la máxima diligencia sus credenciales, obligándose a notificar de inmediato cualquier extravío, robo o sospecha de acceso ilícito a través del canal de urgencias 24/7 disponible en <strong>seguridad@instacredit.es</strong>.
                </p>
              </div>
            `
          },
          {
            pageNumber: 3,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 3 DE 4: POLÍTICA DE TARIFAS Y TRANSPARENCIA 0€ COMISIONES OCULTAS',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA 4. POLÍTICA DE TARIFAS Y COMPROMISO DE CERO COMISIONES OCULTAS:
                </p>
                <p>
                  4.1. En riguroso cumplimiento de la Orden EHA/2899/2011 de transparencia y protección del cliente de servicios bancarios, INSTACREDIT garantiza que los siguientes servicios son de carácter totalmente gratuito (0,00 €):
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-xs text-slate-700">
                  <li>Apertura, mantenimiento y administración de la Cuenta Digital: <strong>0,00 €</strong>.</li>
                  <li>Estudio, análisis de solvencia y scoring previo del préstamo: <strong>0,00 €</strong>.</li>
                  <li>Emisión de certificados de titularidad y certificados de extinción de deuda: <strong>0,00 €</strong>.</li>
                  <li>Cancelación anticipada parcial o total de financiación: <strong>0,00 €</strong>.</li>
                </ul>
                <p>
                  4.2. Cualquier modificación contractual futura de las tarifas será notificada al cliente con una antelación mínima obligatoria de dos (2) meses a través de su buzón telemático, asistiendo al cliente el derecho a resolver el contrato sin coste alguno en caso de discrepancia.
                </p>
              </div>
            `
          },
          {
            pageNumber: 4,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 4 DE 4: ATENCIÓN DE RECLAMACIONES, DURACIÓN Y FIRMA CONTRACTUAL',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA 5. RESOLUCIÓN DE LITIGIOS Y SERVICIO DE ATENCIÓN AL CLIENTE:
                </p>
                <p>
                  5.1. Conforme a la Orden ECO/734/2004, INSTACREDIT cuenta con un Servicio de Atención al Cliente (SAC) que resolverá cualquier queja o reclamación formal en el plazo legal perentorio de quince (15) días hábiles desde su recepción.
                </p>
                <p>
                  5.2. En caso de disconformidad o falta de respuesta en plazo, el cliente podrá acudir ante el Departamento de Conducta de Mercado y Reclamaciones del Banco de España (Calle Alcalá 48, 28014 Madrid) o acudir a la Plataforma Europea de Resolución de Litigios en Línea (ODR).
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-1">
                  CLÁUSULA 6. EFICACIA PROBATORIA DE LA FIRMA DIGITAL:
                </p>
                <p>
                  6.1. Las partes reconocen a la firma electrónica producida mediante consentimiento informado, OTP telefónico y sellado criptográfico pleno valor de documento privado con eficacia equiparada al documento público de conformidad con la Ley 6/2020 y el Reglamento eIDAS.
                </p>

                <div class="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5 mt-2 text-xs font-mono">
                  <div class="font-bold text-[#0B1B3D] border-b pb-1">DATOS DE AUDITORÍA Y ACEPTACIÓN DE CONDICIONES GENERALES</div>
                  <div class="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Cliente: <strong>${fullName}</strong></div>
                    <div>Documento: <strong>${documentStr}</strong></div>
                    <div>IBAN Digital: <strong>${acc.accountNumber}</strong></div>
                    <div>Fecha Formalización: <strong>${sigBlock.timestamp}</strong></div>
                    <div>IP Conexión: <strong>${sigBlock.ipAddress}</strong></div>
                    <div>Verificación OTP: <strong class="text-emerald-700">${sigBlock.verifiedOtp} (Correcto)</strong></div>
                  </div>
                  <div class="text-[10px] text-slate-500 pt-1 truncate">
                    Hash SHA-256 eIDAS: ${sigBlock.hashSha256}
                  </div>
                </div>
              </div>
            `
          }
        ],
        signatureBlock: sigBlock
      };

    // -------------------------------------------------------------
    // DOCUMENT 3: POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS RGPD (4 PÁGS)
    // -------------------------------------------------------------
    case 'politica_privacidad':
      return {
        id: `PRV-${app.id}`,
        documentType: 'politica_privacidad',
        title: 'POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS PERSONALES',
        subtitle: 'INFORMACIÓN TRANSPARENTE EN CUMPLIMIENTO DEL REGLAMENTO (UE) 2016/679 (RGPD) Y LA LEY ORGÁNICA 3/2018 (LOPDGDD)',
        legalBasis: 'Reglamento General de Protección de Datos (UE) 2016/679 • Ley Orgánica 3/2018 (LOPDGDD) • Criterios Agencia Española de Protección de Datos (AEPD)',
        watermark: 'INSTACREDIT ESPAÑA S.L. - RGPD & LOPDGDD AUDITADO - NIF B-89412093',
        sealText: 'POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS RGPD - AGENCIA ESPAÑOLA DE PROTECCIÓN DE DATOS',
        pages: [
          {
            pageNumber: 1,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 1 DE 4: RESPONSABLE DEL TRATAMIENTO, DELEGADO DE PROTECCIÓN (DPO) Y FINES',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p>
                  En <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> nos comprometemos a garantizar la máxima seguridad, confidencialidad y transparencia en el tratamiento de los datos personales de nuestros usuarios y solicitantes de crédito, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO Y DELEGADO DE PROTECCIÓN (DPO):
                </p>
                <div class="bg-slate-50 border border-slate-300 p-3.5 rounded-xl text-xs space-y-1 font-mono">
                  <div><strong>Razón Social:</strong> INSTACREDIT ESPAÑA FINTECH S.L.</div>
                  <div><strong>NIF Mercantil:</strong> B-89412093</div>
                  <div><strong>Domicilio Social:</strong> Paseo de la Castellana 95, Planta 14, 28046 Madrid, España</div>
                  <div><strong>Contacto Delegado de Protección de Datos (DPO):</strong> dpo@instacredit.es</div>
                  <div><strong>Canal para Ejercicio de Derechos:</strong> privacidad@instacredit.es</div>
                </div>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  2. CATEGORÍAS DE DATOS TRATADOS Y FINALIDADES ESPECÍFICAS:
                </p>
                <p>
                  2.1. Tratamos los datos identificativos (nombre, apellidos, DNI/NIE), de contacto (domicilio en <strong>${e.city}</strong>, teléfono <strong>${p.phone}</strong>, email <strong>${p.email}</strong>), socioeconómicos (régimen laboral, ingresos de <strong>${formatEUR(e.monthlyIncome)}/mes</strong>, gastos de <strong>${formatEUR(e.monthlyExpenses)}/mes</strong>, empresa <strong>${e.companyName || 'Declarada'}</strong>) y financieros (IBAN de abono <strong>${b.iban}</strong> y cuenta digital <strong>${acc.accountNumber}</strong>).
                </p>
                <p>
                  2.2. La finalidad primordial consiste en la evaluación del riesgo crediticio y solvencia previa (Ley 16/2011), la formalización del préstamo de <strong>${capitalStr}</strong>, la prevención del fraude y la gestión integral de la Cuenta Digital.
                </p>
              </div>
            `
          },
          {
            pageNumber: 2,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 2 DE 4: BASE JURÍDICA DEL TRATAMIENTO Y OBLIGACIONES LEGALES BANCARIAS',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  3. BASE LEGAL Y LEGITIMACIÓN PARA EL TRATAMIENTO DE LOS DATOS:
                </p>
                <p>
                  El tratamiento de sus datos personales se fundamenta en las siguientes bases jurídicas amparadas por el Artículo 6 del RGPD:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-xs text-slate-700">
                  <li>
                    <strong>Ejecución del contrato mercantil o medidas precontractuales (Art. 6.1.b RGPD):</strong> Necesario para tramitar la solicitud de préstamo de <strong>${capitalStr}</strong>, calcular las cuotas, verificar la titularidad de su IBAN bancario y aperturar su Cuenta Digital.
                  </li>
                  <li>
                    <strong>Cumplimiento de obligaciones legales imperativas (Art. 6.1.c RGPD):</strong> En aplicación de la Ley 16/2011 de contratos de crédito al consumo, la Circular 5/2012 del Banco de España sobre evaluación de solvencia y la Ley 10/2010 de Prevención del Blanqueo de Capitales (SEPBLAC).
                  </li>
                  <li>
                    <strong>Interés legítimo del responsable (Art. 6.1.f RGPD):</strong> Prevención del fraude de identidad, auditoría de seguridad informática y defensa de reclamaciones judiciales.
                  </li>
                  <li>
                    <strong>Consentimiento explícito e informado (Art. 6.1.a RGPD):</strong> Otorgado para la consulta de ficheros comunes de solvencia y el envío de comunicaciones de soporte vía WhatsApp.
                  </li>
                </ul>
              </div>
            `
          },
          {
            pageNumber: 3,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 3 DE 4: DESTINATARIOS, CESIONES OBLIGATORIAS Y TRANSFERENCIAS DE DATOS',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  4. DESTINATARIOS DE LOS DATOS Y COMUNICACIONES LEGALES:
                </p>
                <p>
                  Sus datos personales únicamente serán comunicados a terceros en los supuestos estrictamente necesarios para la operativa o por mandato legal expreso:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-xs text-slate-700">
                  <li>
                    <strong>Ficheros de información sobre solvencia patrimonial y crédito:</strong> Consultas automatizadas en ASNEF (Equifax) y BADEXCUG (Experian), así como a la Central de Información de Riesgos del Banco de España (CIRBE).
                  </li>
                  <li>
                    <strong>Entidades Bancarias y Pasarelas de Pago:</strong> Entidades del sistema SEPA y Bizum para efectuar el desembolso y gestionar los cobros de las cuotas.
                  </li>
                  <li>
                    <strong>Autoridades Públicas y Organismos Supervisores:</strong> Banco de España, Comisión Nacional del Mercado de Valores (CNMV), Agencia Estatal de Administración Tributaria (AEAT), SEPBLAC, Fuerzas y Cuerpos de Seguridad del Estado y Tribunales de Justicia.
                  </li>
                  <li>
                    <strong>Prestadores de Servicios Electrónicos de Confianza:</strong> Proveedores cualificados de firma digital y sellado de tiempo bajo el Reglamento eIDAS (UE 910/2014).
                  </li>
                </ul>
                <p class="text-xs text-slate-600">
                  No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo (EEE). Todos los servidores y centros de datos residen en territorio de la Unión Europea bajo estándares ISO 27001.
                </p>
              </div>
            `
          },
          {
            pageNumber: 4,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 4 DE 4: CONSERVACIÓN, DERECHOS ARCO-POL Y RECLAMACIÓN ANTE LA AEPD',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  5. PLAZO DE CONSERVACIÓN DE LA INFORMACIÓN:
                </p>
                <p>
                  Los datos se conservarán durante la vigencia de la relación contractual del préstamo y de la cuenta digital. Una vez cancelada la financiación, se mantendrán debidamente bloqueados durante los plazos de prescripción de responsabilidades legales (mínimo 10 años conforme a la normativa antiblanqueo de capitales Ley 10/2010 y Código de Comercio).
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  6. EJERCICIO DE DERECHOS ARCO-POL Y TUTELA DE LA AEPD:
                </p>
                <p>
                  6.1. EL CLIENTE puede ejercer en cualquier momento sus derechos de <strong>Acceso, Rectificación, Supresión (Olvido), Limitación del tratamiento, Portabilidad y Oposición</strong>, remitiendo escrito acompañado de copia de su documento a <strong>privacidad@instacredit.es</strong> o a la sede de Paseo de la Castellana 95, 28046 Madrid.
                </p>
                <p>
                  6.2. Si considera que sus derechos han sido vulnerados, tiene derecho a formular reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> a través de su sede electrónica en <strong>www.aepd.es</strong> (Calle Jorge Juan 6, 28001 Madrid).
                </p>

                <div class="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-1 mt-3 text-xs font-mono">
                  <div class="font-bold text-[#0B1B3D] border-b pb-1">CONSTANCIA DE CONSENTIMIENTO INFORMADO RGPD</div>
                  <div>Titular: <strong>${fullName}</strong> (${documentStr})</div>
                  <div>Fecha y Hora de Aceptación: <strong>${sigBlock.timestamp}</strong></div>
                  <div>IP Registrada: <strong>${sigBlock.ipAddress}</strong> | OTP: <strong>${sigBlock.verifiedOtp}</strong></div>
                  <div class="text-[10px] text-slate-500 truncate">Huella SHA-256: ${sigBlock.hashSha256}</div>
                </div>
              </div>
            `
          }
        ],
        signatureBlock: sigBlock
      };

    // -------------------------------------------------------------
    // DOCUMENT 4: CONSENTIMIENTO LOPDGDD Y CONSULTA ASNEF/CIRBE (4 PÁGS)
    // -------------------------------------------------------------
    case 'consentimiento_lopd':
    case 'autorizacion_centrales':
      return {
        id: `LOPD-${app.id}`,
        documentType: 'consentimiento_lopd',
        title: 'AUTORIZACIÓN Y CONSENTIMIENTO EXPRESO LOPDGDD / FICHEROS DE SOLVENCIA',
        subtitle: 'CLÁUSULA DE CONSULTA Y COMUNICACIÓN A FICHEROS COMUNES DE CRÉDITO Y RIESGO BANCARIO (ASNEF / CIRBE / EXPERIAN)',
        legalBasis: 'Ley Orgánica 3/2018 (LOPDGDD, Art. 20) • Ley 44/2002 de Reforma del Sistema Financiero (CIRBE) • Ley 16/2011 de Contratos de Crédito',
        watermark: 'INSTACREDIT ESPAÑA S.L. - ASNEF & CIRBE HOMOLOGADO - NIF B-89412093',
        sealText: 'AUTORIZACIÓN CIRBE Y SISTEMAS DE INFORMACIÓN CREDITICIA - LOPDGDD ART. 20',
        pages: [
          {
            pageNumber: 1,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 1 DE 4: AUTORIZACIÓN PARA CONSULTA EN ASNEF (EQUIFAX) Y BADEXCUG (EXPERIAN)',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p>
                  Yo, <strong>${fullName}</strong>, con <strong>${documentStr}</strong>, mayor de edad y domiciliado en <strong>${e.address}, ${e.postalCode} ${e.city} (${e.province})</strong>, manifiesto que he solicitado formalmente a <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> (NIF <strong>B-89412093</strong>) un préstamo personal por importe de <strong>${capitalStr}</strong>, con devolución fijada para el <strong>${l.dueDate}</strong>.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA PRIMERA. AUTORIZACIÓN EXPRESA PARA CONSULTA DE FICHEROS DE SOLVENCIA:
                </p>
                <p>
                  1.1. De conformidad con lo dispuesto en el Artículo 20 de la Ley Orgánica 3/2018 (LOPDGDD) y la Ley 16/2011 de contratos de crédito al consumo, autorizo de forma expresa, libre, informada e inequívoca a <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> para que consulte mis antecedentes crediticios y de solvencia patrimonial en los sistemas comunes de información crediticia, con carácter enunciativo:
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-xs text-slate-700">
                  <li><strong>ASNEF:</strong> Fichero de la Asociación Nacional de Establecimientos Financieros de Crédito, gestionado por Equifax Ibérica S.L.</li>
                  <li><strong>BADEXCUG:</strong> Base de Datos Experian de Cumplimiento de Obligaciones Dinerarias, operada por Experian Bureau de Crédito S.A.</li>
                  <li><strong>Fichero de Reclamaciones e Impagados del Registro de Aceptaciones Impagadas (RAI).</strong></li>
                </ul>
                <p>
                  1.2. Dicha consulta tiene como exclusiva y legítima finalidad evaluar mi capacidad de endeudamiento, perfil crediticio y solvencia previa a la formalización definitiva de la financiación solicitada.
                </p>
              </div>
            `
          },
          {
            pageNumber: 2,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 2 DE 4: AUTORIZACIÓN DE CONSULTA Y COMUNICACIÓN A LA CIRBE (BANCO DE ESPAÑA)',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA SEGUNDA. AUTORIZACIÓN PARA CONSULTA EN LA CIRBE (LEY 44/2002):
                </p>
                <p>
                  2.1. Conforme a los Artículos 60 a 69 de la Ley 44/2002, de 22 de noviembre, de Medidas de Reforma del Sistema Financiero, y la Circular 1/2013 del Banco de España, autorizo expresamente a INSTACREDIT a solicitar y consultar de la <strong>Central de Información de Riesgos del Banco de España (CIRBE)</strong> los informes relativos a los riesgos directos e indirectos asumidos por mi persona en el sistema financiero español.
                </p>
                <p>
                  2.2. Igualmente, quedo informado de que en caso de que el crédito supere los límites fijados por la normativa sectorial, la presente operación será declarada al Banco de España para su integración en los registros de la CIRBE.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA TERCERA. PREVENCIÓN DEL FRAUDE Y SUPLANTACIÓN DE IDENTIDAD:
                </p>
                <p>
                  3.1. Autorizo la verificación telemática de la autenticidad de mi documento de identidad ante los servicios oficiales de verificación y bases documentales del Ministerio del Interior y Dirección General de la Policía (DGP), con el fin de evitar suplantaciones de identidad.
                </p>
              </div>
            `
          },
          {
            pageNumber: 3,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 3 DE 4: ADVERTENCIA PREVIA Y CONDICIONES DE INCLUSIÓN EN CASO DE IMPAGO',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA CUARTA. REQUERIMIENTO PREVIO E INCLUSIÓN EN SISTEMAS DE INFORMACIÓN CREDITICIA:
                </p>
                <p>
                  4.1. En cumplimiento del Artículo 20.1.c de la Ley Orgánica 3/2018 (LOPDGDD), el titular queda expresamente advertido e informado de que, en caso de no atender el pago de las cuotas a su vencimiento, y siempre que la deuda resulte cierta, vencida, exigible y no sometida a reclamación judicial o administrativa, INSTACREDIT podrá proceder a la comunicación de los datos de impago a los ficheros comunes de solvencia patrimonial (ASNEF / BADEXCUG).
                </p>
                <p>
                  4.2. Dicha inclusión irá precedida imperativamente de un <strong>requerimiento individual previo de pago</strong> remitido por medio fehaciente (SMS certificado, burofax telemático o correo electrónico securizado) con una antelación mínima obligatoria de diez (10) días naturales a la comunicación formal a dichos ficheros.
                </p>
                <p>
                  4.3. El titular podrá en cualquier momento instar la cancelación inmediata de sus datos en dichos ficheros acreditando la extinción o liquidación total de la deuda devengada.
                </p>
              </div>
            `
          },
          {
            pageNumber: 4,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 4 DE 4: CERTIFICACIÓN DE INGRESOS, DECLARACIÓN JURADA Y FIRMA eIDAS',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA QUINTA. DECLARACIÓN JURADA DE VERACIDAD DE DATOS ECONÓMICOS:
                </p>
                <p>
                  5.1. El solicitante certifica bajo juramento que los datos declarados en su solicitud (ingresos mensuales netos de <strong>${formatEUR(e.monthlyIncome)}</strong>, gastos de <strong>${formatEUR(e.monthlyExpenses)}</strong> y ocupación de <strong>${e.occupation}</strong>) son íntegros, vigentes y demostrables mediante nómina, modelo de IRPF o pensión oficial, no hallándose incurso en situación de insolvencia inminente ni en procedimiento concursal de persona física.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-1">
                  CLÁUSULA SEXTA. VALIDEZ PROBATORIA Y FORMALIZACIÓN DIGITAL:
                </p>
                <p>
                  6.1. La presente autorización y consentimiento se formaliza electrónicamente con valor de declaración firmada de conformidad con la Ley 6/2020 y el Reglamento (UE) 910/2014.
                </p>

                <div class="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 mt-3">
                  <div class="font-bold text-xs text-[#0B1B3D] border-b pb-1 flex justify-between">
                    <span>SELLO DIGITAL DE CONSENTIMIENTO LOPDGDD / CIRBE / ASNEF</span>
                    <span class="text-blue-700 font-bold">LEY ORGÁNICA 3/2018</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
                    <div>Titular Autorizante: <strong>${fullName}</strong></div>
                    <div>Documento Oficial: <strong>${documentStr}</strong></div>
                    <div>Cuenta Digital Asignada: <strong>${acc.accountNumber}</strong></div>
                    <div>Estampa Temporal: <strong>${sigBlock.timestamp}</strong></div>
                    <div>Dirección IP: <strong>${sigBlock.ipAddress}</strong></div>
                    <div>Código OTP: <strong class="text-emerald-700">${sigBlock.verifiedOtp} (Consentido)</strong></div>
                  </div>
                  <div class="text-[10px] text-slate-500 font-mono pt-1 truncate">
                    Hash Criptográfico SHA-256: ${sigBlock.hashSha256}
                  </div>
                </div>
              </div>
            `
          }
        ],
        signatureBlock: sigBlock
      };

    // -------------------------------------------------------------
    // DOCUMENT 5: PAGARÉ A LA ORDEN CON CARTA DE INSTRUCCIONES (4 PÁGS)
    // -------------------------------------------------------------
    case 'pagare_en_blanco':
    default:
      return {
        id: `PAG-${app.id}`,
        documentType: 'pagare_en_blanco',
        title: 'PAGARÉ A LA ORDEN DESMATERIALIZADO CON CARTA DE INSTRUCCIONES',
        subtitle: 'TÍTULO VALOR EJECUTIVO MERCANTIL CON FIRMA ELECTRÓNICA CUALIFICADA (eIDAS UE 910/2014)',
        legalBasis: 'Ley 19/1985, de 16 de julio, Cambiaria y del Cheque (Arts. 94 a 97) • Reglamento (UE) 910/2014 (eIDAS) • Ley 6/2020',
        watermark: 'INSTACREDIT ESPAÑA S.L. - TÍTULO EJECUTIVO MERCANTIL - NIF B-89412093',
        sealText: 'FIRMA ELECTRÓNICA CUALIFICADA REGLAMENTO (UE) 910/2014 eIDAS - BANCO DE ESPAÑA',
        pages: [
          {
            pageNumber: 1,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 1 DE 4: CONDICIONES DEL TÍTULO VALOR Y PROMESA INCONDICIONAL DE PAGO',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <div class="bg-slate-50 border border-slate-300 p-3.5 rounded-lg text-xs font-mono space-y-1">
                  <div><strong>NÚMERO DE TÍTULO VALOR:</strong> PAG-${app.id}</div>
                  <div><strong>CUENTA DIGITAL IBAN:</strong> ${acc.accountNumber}</div>
                  <div><strong>FIRMADO POR (DEUDOR PRINCIPAL):</strong> ${fullName}</div>
                  <div><strong>DOCUMENTO DE IDENTIFICACIÓN:</strong> ${documentStr}</div>
                  <div><strong>DOMICILIO EN ESPAÑA:</strong> ${e.address}, ${e.postalCode} ${e.city} (${e.province})</div>
                  <div><strong>TENEDOR Y ACREEDOR:</strong> INSTACREDIT ESPAÑA FINTECH S.L. (NIF B-89412093)</div>
                  <div><strong>IMPORTE NOMINAL DE CAPITAL:</strong> ${capitalStr} EUROS (€)</div>
                  <div><strong>FECHA DE EMISIÓN DIGITAL:</strong> ${app.createdAt}</div>
                  <div><strong>FECHA DE VENCIMIENTO ACORDADA:</strong> ${l.dueDate}</div>
                  <div><strong>DESTINO DECLARADO DEL PRÉSTAMO:</strong> ${loanPurposeStr}</div>
                </div>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA PRIMERA. PROMESA INCONDICIONAL DE PAGO Y DECLARACIÓN DE OBLIGACIÓN:
                </p>
                <p>
                  Por el presente pagaré mercantil a la orden, yo, <strong>${fullName}</strong>, mayor de edad, con plena capacidad jurídica de obrar y contratar conforme a la legislación civil y mercantil española, con domicilio en <strong>${e.city} (${e.province})</strong>, me obligo y prometo incondicionalmente pagar a la orden de <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong>, o a su cesionario legítimo tenedor, en su domicilio social sito en Paseo de la Castellana 95, Planta 14, 28046 Madrid, o mediante adeudo bancario SEPA en los canales telemáticos autorizados, la cantidad total de dinero que resulte de liquidar el capital concedido de <strong>${capitalStr}</strong>, más los intereses pactados, aval de garantía europea (${fgaStr}), custodia y plataforma eIDAS (${techStr}) y el IVA repercutible (${ivaStr}), totalizando <strong>${totalStr}</strong>.
                </p>
              </div>
            `
          },
          {
            pageNumber: 2,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 2 DE 4: LUGAR, FORMA Y DOMICILIACIÓN DEL REEMBOLSO',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA SEGUNDA. LUGAR, FORMA Y DOMICILIACIÓN DEL REEMBOLSO:
                </p>
                <p>
                  El pago de la cantidad principal y sus intereses deberá realizarse no más tarde del día <strong>${l.dueDate}</strong> mediante domiciliación o transferencia bancaria SEPA desde la cuenta <strong>${b.bankName} (IBAN: ${b.iban})</strong>, por Bizum a través de la pasarela oficial, o bien mediante cargo directo en el saldo disponible de mi <strong>Cuenta Digital Instacredit IBAN ${acc.accountNumber}</strong>.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA TERCERA. VENCIMIENTO ANTICIPADO Y ACCIÓN EJECUTIVA CAMBIARIA:
                </p>
                <p>
                  INSTACREDIT ESPAÑA FINTECH S.L. queda facultada para declarar el vencimiento anticipado de la totalidad de las cantidades pendientes, perdiendo el firmante todo plazo de amortización pendiente, en cualquiera de los siguientes supuestos:
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-xs text-slate-700">
                  <li>Falta de pago a la fecha de vencimiento (${l.dueDate}) del capital o cuotas pactadas.</li>
                  <li>Inconsistencia, falsedad o suplantación en los datos de DNI/NIE o ingresos declarados.</li>
                  <li>Insolvencia declarada judicialmente o embargo preventivo de cuentas bancarias.</li>
                  <li>Incumplimiento de las obligaciones sobre Prevención del Blanqueo de Capitales (SEPBLAC).</li>
                </ul>
              </div>
            `
          },
          {
            pageNumber: 3,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 3 DE 4: CARTA DE INSTRUCCIONES Y DISPENSA DE PROTESTO NOTARIAL',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA CUARTA. CARTA DE INSTRUCCIONES Y CUMPLIMENTACIÓN (ART. 96 LEY 19/1985):
                </p>
                <p class="text-xs text-slate-700">
                  De conformidad con la jurisprudencia del Tribunal Supremo y los Artículos 94 a 97 de la Ley 19/1985 Cambiaria y del Cheque, autorizo irrevocablemente a <strong>INSTACREDIT ESPAÑA FINTECH S.L.</strong> a cumplimentar los elementos del pagaré emitido electrónicamente de acuerdo a las siguientes instrucciones tasadas:
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-xs text-slate-700">
                  <li><strong>Importe a liquidar:</strong> El saldo principal vivo impagado más los intereses legales y remuneratorios pactados estrictamente devengados hasta la fecha del reclamo.</li>
                  <li><strong>Fecha de vencimiento:</strong> Aquella en que se declare formalmente vencida la deuda por impago imputable.</li>
                  <li><strong>Lugar de pago:</strong> La cuenta corriente declarada en ${b.bankName} o el domicilio social de la entidad acreedora en Madrid.</li>
                </ul>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-2">
                  CLÁUSULA QUINTA. DISPENSA DE PROTESTO NOTARIAL (ART. 56 LEY 19/1985):
                </p>
                <p>
                  El presente pagaré se emite con la cláusula expresa <strong>"SIN GASTOS"</strong> y <strong>"SIN PROTESTO"</strong>, eximiendo al legítimo tenedor de la obligación de formular protesto notarial o declaración equivalente para conservar su acción cambiaria ejecutiva ante los Juzgados de Primera Instancia de España.
                </p>
              </div>
            `
          },
          {
            pageNumber: 4,
            totalPageCount: 4,
            pageTitle: 'PÁGINA 4 DE 4: VALIDEZ PROBATORIA eIDAS, JURISDICCIÓN Y CERTIFICADO DE FIRMA',
            contentHtml: `
              <div class="space-y-4 text-justify text-sm text-slate-800 leading-relaxed font-serif">
                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D]">
                  CLÁUSULA SEXTA. VALIDEZ PROBATORIA BAJO EL REGLAMENTO (UE) 910/2014 (eIDAS):
                </p>
                <p>
                  De conformidad con el Artículo 25 del Reglamento (UE) 910/2014 del Parlamento Europeo y la Ley 6/2020 de servicios electrónicos de confianza, el suscriptor reconoce expresamente que la formalización electrónica mediante verificación de identidad, código dinámico OTP remitido al teléfono móvil <strong>${p.phone}</strong> y hash criptográfico SHA-256 posee plena eficacia jurídica, equivalencia funcional a la firma manuscrita y fuerza ejecutiva cambiaria.
                </p>

                <p class="font-bold uppercase tracking-wide border-b pb-1 text-[#0B1B3D] pt-1">
                  CLÁUSULA SÉPTIMA. LEGISLACIÓN APLICABLE Y FUERO COMPETENTE:
                </p>
                <p>
                  El presente título valor se rige por las leyes del Reino de España. Para cualquier controversia, las partes se someten a la jurisdicción de los Juzgados y Tribunales del domicilio del prestatario en <strong>${e.city} (${e.province})</strong>.
                </p>

                <div class="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 mt-2">
                  <div class="font-bold text-xs text-[#0B1B3D] border-b pb-1 flex justify-between">
                    <span>CERTIFICADO DE FIRMA ELECTRÓNICA Y SELLO DE TIEMPO eIDAS</span>
                    <span class="text-emerald-700 font-bold">ACREDITADO BD-E</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
                    <div>Firmante: <strong>${fullName}</strong></div>
                    <div>Documento: <strong>${documentStr}</strong></div>
                    <div>IBAN Digital: <strong>${acc.accountNumber}</strong></div>
                    <div>Sello Temporal: <strong>${sigBlock.timestamp}</strong></div>
                    <div>Dirección IP: <strong>${sigBlock.ipAddress}</strong></div>
                    <div>Verificación OTP SMS: <strong class="text-emerald-700">${sigBlock.verifiedOtp} (Válido eIDAS)</strong></div>
                  </div>
                  <div class="text-[10px] text-slate-500 font-mono pt-1 truncate">
                    Hash SHA-256: ${sigBlock.hashSha256}
                  </div>
                </div>
              </div>
            `
          }
        ],
        signatureBlock: sigBlock
      };
  }
}

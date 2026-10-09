import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CreditApplication,
  CustomerReview,
  DocumentType,
  LoanStatus,
  PlatformConfig,
  PqrsRecord,
  LoanTerm,
  BankTransaction,
  UserAccount,
  Advisor,
  AdvisorActionLog,
  ClientLiveQuery,
  AppNotification
} from '../types';
import {
  DEFAULT_PLATFORM_CONFIG,
  DEFAULT_ADVISORS,
  INITIAL_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_LIVE_QUERIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS
} from '../data/initialData';
import {
  calculateLoanBreakdown,
  generateRadicado,
  generateSpanishIBAN,
  formatDateToSpanish
} from '../utils/financialCalculations';

interface AppContextType {
  // Applications
  applications: CreditApplication[];
  selectedApplication: CreditApplication | null;
  setSelectedApplication: (app: CreditApplication | null) => void;
  selectedDocType: DocumentType;
  setSelectedDocType: (type: DocumentType) => void;
  
  // Platform Config
  platformConfig: PlatformConfig;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  
  // Reviews
  customerReviews: CustomerReview[];
  addCustomerReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  
  // Reclamaciones / PQRSF (Banco de España)
  pqrsRecords: PqrsRecord[];
  addPqrsRecord: (record: Omit<PqrsRecord, 'id' | 'createdAt' | 'status' | 'officialResponseDate'>) => string;
  updatePqrsStatus: (id: string, status: PqrsRecord['status'], notes?: string) => void;
  
  // Modals & Navigation
  isApplicationModalOpen: boolean;
  openApplicationModal: (initialAmount?: number, initialTerm?: LoanTerm) => void;
  closeApplicationModal: () => void;
  initialLoanConfig: { capital: number; term: LoanTerm };
  
  isTicketModalOpen: boolean;
  openTicketModal: (app: CreditApplication) => void;
  closeTicketModal: () => void;
  
  isLookupModalOpen: boolean;
  openLookupModal: () => void;
  closeLookupModal: () => void;
  
  isDocumentModalOpen: boolean;
  openDocumentModal: (app: CreditApplication, docType?: DocumentType) => void;
  closeDocumentModal: () => void;
  
  isPqrsModalOpen: boolean;
  openPqrsModal: () => void;
  closePqrsModal: () => void;
  
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;

  // Didactic Accessible Forms with Voice for WhatsApp & Clients
  isDidacticFormOpen: boolean;
  didacticFormApp: CreditApplication | null;
  didacticFormInitialCategory: 'solicitud' | 'registro_cuenta' | 'conocerte_kyc' | 'actividad_laboral' | 'iban' | 'cuota_firma' | 'prorroga' | 'reclamacion';
  openDidacticForm: (app?: CreditApplication, category?: 'solicitud' | 'registro_cuenta' | 'conocerte_kyc' | 'actividad_laboral' | 'iban' | 'cuota_firma' | 'prorroga' | 'reclamacion') => void;
  closeDidacticForm: () => void;

  // User Accounts & Authentication
  currentUser: UserAccount | null;
  userAccounts: UserAccount[];
  isUserLoginModalOpen: boolean;
  openUserLoginModal: () => void;
  closeUserLoginModal: () => void;
  loginUser: (emailOrDoc: string, password: string) => { success: boolean; message: string };
  registerUser: (userData: Partial<UserAccount>) => { success: boolean; message: string; user?: UserAccount };
  logoutUser: () => void;
  
  // User Banking Portal
  isUserBankPortalOpen: boolean;
  openUserBankPortal: (app?: CreditApplication) => void;
  closeUserBankPortal: () => void;
  activeBankUserApp: CreditApplication | null;
  setActiveBankUserApp: (app: CreditApplication | null) => void;
  userDepositToAccount: (appId: string, amount: number, method?: 'Bizum' | 'Tarjeta') => void;
  userPayQuotaFromBalance: (appId: string, quotaIndex?: number) => boolean;
  userWithdrawToExternalBank: (appId: string, amount: number) => boolean;
  
  // Advisor System & Portal
  isAdvisorView: boolean;
  setIsAdvisorView: (value: boolean) => void;
  isAdvisorLoggedIn: boolean;
  loginAdvisor: (advisorId: string, pin: string) => { success: boolean; message: string };
  logoutAdvisor: () => void;
  currentAdvisor: Advisor;
  setCurrentAdvisor: (adv: Advisor) => void;
  advisorsList: Advisor[];
  assignAdvisorToApplication: (appId: string, advisorId: string) => void;
  logAdvisorAction: (appId: string, action: Omit<AdvisorActionLog, 'id' | 'timestamp'>) => void;
  clientQueries: ClientLiveQuery[];
  sendClientMessageToQuery: (queryId: string, text: string, sender: 'cliente' | 'asesor') => void;
  updateQueryStatus: (queryId: string, status: ClientLiveQuery['status']) => void;
  
  // Staff Authentication Gateway Modal
  isStaffAuthModalOpen: boolean;
  staffAuthModalMode: 'advisor' | 'admin';
  openStaffAuthModal: (mode?: 'advisor' | 'admin') => void;
  closeStaffAuthModal: () => void;
  
  // Real-time Cross-Role Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  triggerChatBubbleOpenNotice: (clientName?: string) => void;
  
  // Admin Mode
  isAdminView: boolean;
  setIsAdminView: (value: boolean) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  
  // Application Management by Admin / Advisors
  createNewApplication: (appData: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentStep' | 'digitalAccount' | 'advisorActionLogs' | 'uploadedDocuments'>) => CreditApplication;
  updateApplicationStatus: (id: string, status: LoanStatus, notes?: string) => void;
  updateApplicationApprovedAmount: (id: string, newAmount: number) => void;
  updateApplicationFullData: (id: string, updatedData: Partial<CreditApplication>) => void;
  deleteApplication: (id: string) => void;
  advanceApplicationStep: (id: string) => void;
  findApplicationBySearch: (query: string) => CreditApplication | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const APPS_STORAGE_KEY = 'instacredit_espana_apps_v3';
const CONFIG_STORAGE_KEY = 'instacredit_espana_config_v3';
const USERS_STORAGE_KEY = 'instacredit_espana_users_v3';
const QUERIES_STORAGE_KEY = 'instacredit_espana_queries_v3';
const NOTIFS_STORAGE_KEY = 'instacredit_espana_notifs_v3';
const REVIEWS_STORAGE_KEY = 'instacredit_espana_reviews_v3';
const PQRS_STORAGE_KEY = 'instacredit_espana_pqrs_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load applications
  const [applications, setApplications] = useState<CreditApplication[]>(() => {
    try {
      const stored = localStorage.getItem(APPS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICATIONS;
  });

  // Load platform config
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PLATFORM_CONFIG;
  });

  // Load registered users
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // Current logged in customer
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return userAccounts[0] || null; // Carmen Navarro as default demo user
  });

  // Load advisors
  const [advisorsList] = useState<Advisor[]>(DEFAULT_ADVISORS);
  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>(DEFAULT_ADVISORS[0]);

  // Load client live queries
  const [clientQueries, setClientQueries] = useState<ClientLiveQuery[]>(() => {
    try {
      const stored = localStorage.getItem(QUERIES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LIVE_QUERIES;
  });

  // Load notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Load reviews
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Load reclamaciones
  const [pqrsRecords, setPqrsRecords] = useState<PqrsRecord[]>(() => {
    try {
      const stored = localStorage.getItem(PQRS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'REC-BDE-90214',
        createdAt: '26 de septiembre de 2026',
        applicantName: 'Carlos Benítez Ramos',
        documentNumber: '47182901B',
        email: 'carlos.benitez@gmail.com',
        phone: '+34 654 321 098',
        type: 'Consulta',
        subject: 'Solicitud de certificado de deuda cero tras liquidación',
        description: 'He liquidado mi micropréstamo anticipadamente por Bizum y solicito el certificado de extinción de deuda para mi banco.',
        status: 'Resuelto',
        officialResponseDate: '11 de octubre de 2026',
        responseDetails: 'Certificado oficial expedido y remitido al correo del cliente.'
      }
    ];
  });

  // Navigation & Modals State
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('pagare_en_blanco');
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [initialLoanConfig, setInitialLoanConfig] = useState<{ capital: number; term: LoanTerm }>({
    capital: 750,
    term: 30
  });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isPqrsModalOpen, setIsPqrsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUserLoginModalOpen, setIsUserLoginModalOpen] = useState(false);

  // Didactic Accessible Forms Modal with Voice
  const [isDidacticFormOpen, setIsDidacticFormOpen] = useState(false);
  const [didacticFormApp, setDidacticFormApp] = useState<CreditApplication | null>(null);
  const [didacticFormInitialCategory, setDidacticFormInitialCategory] = useState<'solicitud' | 'registro_cuenta' | 'conocerte_kyc' | 'actividad_laboral' | 'iban' | 'cuota_firma' | 'prorroga' | 'reclamacion'>('solicitud');

  // Digital Banking Portal
  const [isUserBankPortalOpen, setIsUserBankPortalOpen] = useState(false);
  const [activeBankUserApp, setActiveBankUserApp] = useState<CreditApplication | null>(null);

  // Admin & Advisor Views and Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('instacredit_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminView, setIsAdminView] = useState(false);

  const [isAdvisorLoggedIn, setIsAdvisorLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('instacredit_advisor_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdvisorView, setIsAdvisorView] = useState(false);

  // Staff Authentication Gateway Modal
  const [isStaffAuthModalOpen, setIsStaffAuthModalOpen] = useState(false);
  const [staffAuthModalMode, setStaffAuthModalMode] = useState<'advisor' | 'admin'>('advisor');

  const openStaffAuthModal = (mode: 'advisor' | 'admin' = 'advisor') => {
    setStaffAuthModalMode(mode);
    setIsStaffAuthModalOpen(true);
  };

  const closeStaffAuthModal = () => {
    setIsStaffAuthModalOpen(false);
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(platformConfig));
    } catch (e) {
      console.error(e);
    }
  }, [platformConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [userAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(clientQueries));
    } catch (e) {
      console.error(e);
    }
  }, [clientQueries]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Notifications Helpers
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newNotif: AppNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: `Hoy a las ${timeStr}`,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Optional PWA Service Worker push notification or browser notification if allowed
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(notif.title, {
            body: notif.message,
            icon: '/icon.svg',
            badge: '/icon.svg',
            vibrate: [200, 100, 200],
            tag: `insta-alert-${Date.now()}`,
            data: { url: '/' }
          } as any);
        }).catch(() => {
          try {
            new Notification(notif.title, { body: notif.message, icon: '/icon.svg' });
          } catch (err) {
            console.warn('Native notification failed', err);
          }
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(notif.title, { body: notif.message, icon: '/icon.svg' });
        } catch (err) {
          console.warn('Native notification failed', err);
        }
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const triggerChatBubbleOpenNotice = (clientName?: string) => {
    const name = clientName || currentUser?.fullName || 'Visitante web en directo';
    addNotification({
      recipientRole: 'admin',
      title: '💬 Consulta en Burbuja de Chat Directo',
      message: `${name} ha pulsado la burbuja de soporte en la web para hablar con un asesor.`,
      type: 'urgent',
      linkAction: 'asesores'
    });

    addNotification({
      recipientRole: 'advisor',
      title: '⚡ Nueva Interacción de Cliente en Web',
      message: `${name} está solicitando orientación en tiempo real.`,
      type: 'info'
    });
  };

  // User Authentication
  const loginUser = (emailOrDoc: string, password: string) => {
    const cleanSearch = emailOrDoc.trim().toLowerCase();
    const user = userAccounts.find(
      u => (u.email.toLowerCase() === cleanSearch || u.documentNumber.toLowerCase() === cleanSearch)
    );

    if (!user) {
      return { success: false, message: 'No existe una cuenta registrada con este correo o documento.' };
    }

    if (user.passwordHash && user.passwordHash !== password) {
      return { success: false, message: 'Contraseña incorrecta. Por favor compruébala.' };
    }

    setCurrentUser(user);
    const userApp = applications.find(a => a.id === user.applicationId || a.personalData.documentNumber === user.documentNumber);
    if (userApp) {
      setActiveBankUserApp(userApp);
    }
    setIsUserLoginModalOpen(false);
    return { success: true, message: `¡Bienvenido(a), ${user.fullName}!` };
  };

  const registerUser = (userData: Partial<UserAccount>) => {
    if (!userData.email || !userData.fullName || !userData.documentNumber) {
      return { success: false, message: 'Por favor completa todos los campos requeridos.' };
    }

    const existing = userAccounts.find(
      u => u.email.toLowerCase() === userData.email?.toLowerCase() || u.documentNumber === userData.documentNumber
    );

    if (existing) {
      return { success: false, message: 'Ya existe una cuenta con este correo o documento de identidad.' };
    }

    const newUser: UserAccount = {
      id: `USR-ES-${Math.floor(1000 + Math.random() * 9000)}`,
      email: userData.email,
      passwordHash: userData.passwordHash || 'Insta2026!',
      fullName: userData.fullName,
      documentType: userData.documentType || 'DNI',
      documentNumber: userData.documentNumber,
      phone: userData.phone || '+34 600 000 000',
      role: 'customer',
      createdAt: formatDateToSpanish(new Date()),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setUserAccounts(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsUserLoginModalOpen(false);

    addNotification({
      recipientRole: 'admin',
      title: '👤 Nueva Cuenta de Usuario Creada',
      message: `${newUser.fullName} se ha registrado con ${newUser.documentType} ${newUser.documentNumber}.`,
      type: 'info'
    });

    return { success: true, message: '¡Cuenta creada con éxito!', user: newUser };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const openUserLoginModal = () => setIsUserLoginModalOpen(true);
  const closeUserLoginModal = () => setIsUserLoginModalOpen(false);

  // Config Update
  const updatePlatformConfig = (newConfig: Partial<PlatformConfig>) => {
    setPlatformConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Reviews
  const addCustomerReview = (review: Omit<CustomerReview, 'id' | 'date'>) => {
    const newRev: CustomerReview = {
      ...review,
      id: `REV-${Date.now()}`,
      date: formatDateToSpanish(new Date())
    };
    setCustomerReviews(prev => [newRev, ...prev]);
  };

  // Reclamaciones
  const addPqrsRecord = (record: Omit<PqrsRecord, 'id' | 'createdAt' | 'status' | 'officialResponseDate'>): string => {
    const radicadoId = generateRadicado('REC');
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 15);

    const newRecord: PqrsRecord = {
      ...record,
      id: radicadoId,
      createdAt: 'Hoy',
      status: 'Radicado',
      officialResponseDate: formatDateToSpanish(deadline)
    };
    setPqrsRecords(prev => [newRecord, ...prev]);

    addNotification({
      recipientRole: 'admin',
      title: '⚖️ Reclamación Oficial Radicada',
      message: `${record.applicantName} ha presentado una ${record.type} (Radicado: ${radicadoId}). Plazo legal 15 días.`,
      type: 'warning',
      linkAction: 'pqrs'
    });

    return radicadoId;
  };

  const updatePqrsStatus = (id: string, status: PqrsRecord['status'], notes?: string) => {
    setPqrsRecords(prev =>
      prev.map(p => (p.id === id ? { ...p, status, responseDetails: notes || p.responseDetails } : p))
    );
  };

  // Modals
  const openApplicationModal = (initialAmount?: number, initialTerm?: LoanTerm) => {
    if (initialAmount && initialTerm) {
      setInitialLoanConfig({ capital: initialAmount, term: initialTerm });
    }
    setIsApplicationModalOpen(true);
  };
  const closeApplicationModal = () => setIsApplicationModalOpen(false);

  const openTicketModal = (app: CreditApplication) => {
    setSelectedApplication(app);
    setIsTicketModalOpen(true);
  };
  const closeTicketModal = () => setIsTicketModalOpen(false);

  const openLookupModal = () => setIsLookupModalOpen(true);
  const closeLookupModal = () => setIsLookupModalOpen(false);

  const openDocumentModal = (app: CreditApplication, docType: DocumentType = 'pagare_en_blanco') => {
    setSelectedApplication(app);
    setSelectedDocType(docType);
    setIsDocumentModalOpen(true);
  };
  const closeDocumentModal = () => setIsDocumentModalOpen(false);

  const openPqrsModal = () => setIsPqrsModalOpen(true);
  const closePqrsModal = () => setIsPqrsModalOpen(false);

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const openDidacticForm = (
    app?: CreditApplication,
    category: 'solicitud' | 'registro_cuenta' | 'conocerte_kyc' | 'actividad_laboral' | 'iban' | 'cuota_firma' | 'prorroga' | 'reclamacion' = 'solicitud'
  ) => {
    if (app) {
      setDidacticFormApp(app);
    } else if (currentUser) {
      const found = applications.find(a => a.id === currentUser.applicationId || a.personalData.documentNumber === currentUser.documentNumber);
      setDidacticFormApp(found || applications[0] || null);
    } else {
      setDidacticFormApp(applications[0] || null);
    }
    setDidacticFormInitialCategory(category);
    setIsDidacticFormOpen(true);
  };

  // Automatic Deep-Link Router for Direct URLs sent via WhatsApp or Private Advisor Workspaces (?asesor=ADV-01, ?admin=1, ?form=..., ?ver_contratos=..., ?banca_digital=..., ?solicitud_nueva=1)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const asesorParam = params.get('asesor') || params.get('advisor');
    const adminParam = params.get('admin');
    const formParam = params.get('form');
    const expParam = params.get('exp');
    const verContratosParam = params.get('ver_contratos');
    const bancaDigitalParam = params.get('banca_digital');
    const solicitudNuevaParam = params.get('solicitud_nueva');

    if (asesorParam) {
      const normalizedAdv = asesorParam.toUpperCase();
      const foundAdv = advisorsList.find(
        a => a.id.toUpperCase() === normalizedAdv || a.name.toLowerCase().includes(asesorParam.toLowerCase())
      );
      if (foundAdv) {
        setCurrentAdvisor(foundAdv);
      }
      setIsAdvisorLoggedIn(true);
      setIsAdvisorView(true);
      setIsAdminView(false);
    } else if (adminParam === '1' || adminParam === 'true') {
      setIsAdminLoggedIn(true);
      setIsAdminView(true);
      setIsAdvisorView(false);
    }

    const matchedApp = expParam
      ? applications.find(a => a.id.toLowerCase() === expParam.toLowerCase()) || applications[0]
      : applications[0];

    if (formParam) {
      const normalized = formParam.toLowerCase();
      let targetCat:
        | 'solicitud'
        | 'registro_cuenta'
        | 'conocerte_kyc'
        | 'actividad_laboral'
        | 'iban'
        | 'cuota_firma'
        | 'prorroga'
        | 'reclamacion' = 'solicitud';
      if (normalized === 'registro_cuenta' || normalized === 'cuenta' || normalized === 'registro') targetCat = 'registro_cuenta';
      else if (normalized === 'conocerte_kyc' || normalized === 'conocerte' || normalized === 'kyc' || normalized === 'recibo') targetCat = 'conocerte_kyc';
      else if (normalized === 'actividad_laboral' || normalized === 'dedicas' || normalized === 'trabajo' || normalized === 'laboral') targetCat = 'actividad_laboral';
      else if (normalized === 'iban' || normalized === 'verificacion') targetCat = 'iban';
      else if (normalized === 'cuota_firma' || normalized === 'firma') targetCat = 'cuota_firma';
      else if (normalized === 'prorroga') targetCat = 'prorroga';
      else if (normalized === 'reclamacion' || normalized === 'sac' || normalized === 'encuesta') targetCat = 'reclamacion';

      if (matchedApp) setDidacticFormApp(matchedApp);
      setDidacticFormInitialCategory(targetCat);
      setIsDidacticFormOpen(true);
    } else if (verContratosParam) {
      const docApp = applications.find(a => a.id.toLowerCase() === verContratosParam.toLowerCase()) || applications[0];
      if (docApp) {
        setSelectedApplication(docApp);
        setSelectedDocType('contrato_mutuo');
        setIsDocumentModalOpen(true);
      }
    } else if (bancaDigitalParam) {
      const bankApp = applications.find(a => a.id.toLowerCase() === bancaDigitalParam.toLowerCase()) || applications[0];
      if (bankApp) {
        setActiveBankUserApp(bankApp);
        setIsUserBankPortalOpen(true);
      }
    } else if (solicitudNuevaParam) {
      setIsApplicationModalOpen(true);
    }
  }, []);

  const closeDidacticForm = () => {
    setIsDidacticFormOpen(false);
    setDidacticFormApp(null);
  };

  const openUserBankPortal = (app?: CreditApplication) => {
    if (app) {
      setActiveBankUserApp(app);
    } else if (currentUser) {
      const found = applications.find(a => a.id === currentUser.applicationId || a.personalData.documentNumber === currentUser.documentNumber);
      if (found) {
        setActiveBankUserApp(found);
      } else if (applications.length > 0) {
        setActiveBankUserApp(applications[0]);
      }
    } else if (applications.length > 0) {
      setActiveBankUserApp(applications[0]);
    }
    setIsUserBankPortalOpen(true);
  };
  const closeUserBankPortal = () => setIsUserBankPortalOpen(false);

  // Digital Bank Actions
  const userDepositToAccount = (appId: string, amount: number, method: 'Bizum' | 'Tarjeta' = 'Bizum') => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const newBalance = app.digitalAccount.balance + amount;
          const now = new Date();
          const timeStr = `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES')}`;

          const newTx: BankTransaction = {
            id: `TXN-${Date.now()}`,
            type: method === 'Bizum' ? 'Recarga Bizum' : 'Recarga Tarjeta',
            amount,
            date: timeStr,
            description: `Recarga en línea por ${method} a Cuenta Digital`,
            reference: `BIZUM-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Completado',
            balanceAfter: newBalance
          };

          const updatedAccount = {
            ...app.digitalAccount,
            balance: newBalance,
            transactions: [newTx, ...app.digitalAccount.transactions]
          };

          const updatedApp = {
            ...app,
            digitalAccount: updatedAccount
          };

          if (activeBankUserApp?.id === appId) {
            setActiveBankUserApp(updatedApp);
          }

          addNotification({
            recipientRole: 'user',
            recipientId: app.personalData.email,
            title: `💰 Recarga Exitosa por ${method}`,
            message: `Se han acreditado ${amount.toFixed(2)} € en tu Cuenta Digital IBAN ${app.digitalAccount.accountNumber}.`,
            type: 'success'
          });

          return updatedApp;
        }
        return app;
      })
    );
  };

  const userWithdrawToExternalBank = (appId: string, amount: number): boolean => {
    let success = false;
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          if (app.digitalAccount.balance < amount) return app;

          const newBalance = app.digitalAccount.balance - amount;
          const now = new Date();
          const timeStr = `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES')}`;

          const newTx: BankTransaction = {
            id: `TXN-${Date.now()}`,
            type: 'Transferencia SEPA',
            amount: -amount,
            date: timeStr,
            description: `Transferencia SEPA Instantánea a ${app.bankDetails.bankName}`,
            reference: `SEPA-OUT-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Completado',
            balanceAfter: newBalance
          };

          const updatedAccount = {
            ...app.digitalAccount,
            balance: newBalance,
            transactions: [newTx, ...app.digitalAccount.transactions]
          };

          const updatedApp = {
            ...app,
            digitalAccount: updatedAccount
          };

          if (activeBankUserApp?.id === appId) {
            setActiveBankUserApp(updatedApp);
          }

          success = true;

          addNotification({
            recipientRole: 'user',
            recipientId: app.personalData.email,
            title: '💸 Transferencia SEPA Enviada',
            message: `Se ha transferido ${amount.toFixed(2)} € a tu cuenta vinculada de ${app.bankDetails.bankName}.`,
            type: 'info'
          });

          return updatedApp;
        }
        return app;
      })
    );
    return success;
  };

  const userPayQuotaFromBalance = (appId: string, quotaIndex: number = 0): boolean => {
    let success = false;
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const quotaAmount = app.loanDetails.totalToPay;
          if (app.digitalAccount.balance < quotaAmount) {
            return app;
          }

          const newBalance = app.digitalAccount.balance - quotaAmount;
          const now = new Date();
          const timeStr = `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES')}`;

          const newTx: BankTransaction = {
            id: `TXN-${Date.now()}`,
            type: 'Pago de Cuota',
            amount: -quotaAmount,
            date: timeStr,
            description: `Liquidación total de micropréstamo ${app.id}`,
            reference: `PAGO-DEB-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Completado',
            balanceAfter: newBalance
          };

          const updatedQuotas = app.loanDetails.quotas?.map((q, idx) =>
            idx === quotaIndex ? { ...q, status: 'Pagado' as const } : q
          ) || [];

          const updatedAccount = {
            ...app.digitalAccount,
            balance: newBalance,
            usedQuota: 0,
            transactions: [newTx, ...app.digitalAccount.transactions]
          };

          const updatedApp: CreditApplication = {
            ...app,
            loanDetails: {
              ...app.loanDetails,
              quotas: updatedQuotas
            },
            digitalAccount: updatedAccount
          };

          if (activeBankUserApp?.id === appId) {
            setActiveBankUserApp(updatedApp);
          }

          success = true;

          addNotification({
            recipientRole: 'user',
            recipientId: app.personalData.email,
            title: '✅ ¡Préstamo Totalmente Liquidado!',
            message: `Has cancelado la totalidad de tu préstamo de ${quotaAmount.toFixed(2)} €. Tu historial crediticio es 100% positivo.`,
            type: 'success'
          });

          addNotification({
            recipientRole: 'admin',
            title: '💳 Préstamo Liquidado por Cliente',
            message: `${app.personalData.firstName} ${app.personalData.lastName} ha liquidado su crédito ${app.id} por ${quotaAmount.toFixed(2)} €.`,
            type: 'info'
          });

          return updatedApp;
        }
        return app;
      })
    );
    return success;
  };

  // Advisor Operations
  const assignAdvisorToApplication = (appId: string, advisorId: string) => {
    const adv = advisorsList.find(a => a.id === advisorId);
    if (!adv) return;

    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const logItem: AdvisorActionLog = {
            id: `LOG-${Date.now()}`,
            advisorId: adv.id,
            advisorName: adv.name,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            actionType: 'cambio_estado',
            summary: `Expediente asignado formalmente al asesor ${adv.name}.`
          };

          addNotification({
            recipientRole: 'advisor',
            recipientId: adv.id,
            title: '📋 Nuevo Expediente Asignado',
            message: `El administrador te ha asignado la solicitud #${app.id} de ${app.personalData.firstName} ${app.personalData.lastName}.`,
            type: 'info'
          });

          return {
            ...app,
            assignedAdvisorId: adv.id,
            assignedAdvisorName: adv.name,
            advisorActionLogs: [logItem, ...app.advisorActionLogs]
          };
        }
        return app;
      })
    );
  };

  const logAdvisorAction = (appId: string, action: Omit<AdvisorActionLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const logItem: AdvisorActionLog = {
      ...action,
      id: `LOG-${Date.now()}`,
      timestamp: timeStr
    };

    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            advisorActionLogs: [logItem, ...app.advisorActionLogs]
          };
        }
        return app;
      })
    );
  };

  const sendClientMessageToQuery = (queryId: string, text: string, sender: 'cliente' | 'asesor') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setClientQueries(prev =>
      prev.map(q => {
        if (q.id === queryId) {
          const updatedHistory = [...q.history, { sender, text, time: timeStr }];
          return {
            ...q,
            lastMessage: text,
            unreadByAdvisor: sender === 'cliente',
            history: updatedHistory
          };
        }
        return q;
      })
    );

    if (sender === 'asesor') {
      addNotification({
        recipientRole: 'user',
        title: '💬 Respuesta de tu Asesor Personal',
        message: text,
        type: 'info'
      });
    } else {
      addNotification({
        recipientRole: 'advisor',
        title: '💬 Mensaje de Cliente en Espera',
        message: text,
        type: 'urgent'
      });
    }
  };

  const updateQueryStatus = (queryId: string, status: ClientLiveQuery['status']) => {
    setClientQueries(prev => prev.map(q => (q.id === queryId ? { ...q, status } : q)));
  };

  // Create New Application
  const createNewApplication = (
    appData: Omit<CreditApplication, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentStep' | 'digitalAccount' | 'advisorActionLogs' | 'uploadedDocuments'>
  ): CreditApplication => {
    const radicado = generateRadicado('INSTA');
    const now = new Date();
    const dateStr = formatDateToSpanish(now);
    const digitalIban = generateSpanishIBAN();

    const assignedAdv = advisorsList[Math.floor(Math.random() * advisorsList.length)];

    const initialLog: AdvisorActionLog = {
      id: `LOG-${Date.now()}`,
      advisorId: assignedAdv.id,
      advisorName: assignedAdv.name,
      timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      actionType: 'nota_interna',
      summary: 'Solicitud radicada en línea por el usuario. Asignada para verificación de solvencia (ASNEF/CIRBE) y DNI/NIE.'
    };

    const newApp: CreditApplication = {
      ...appData,
      id: radicado,
      createdAt: dateStr,
      updatedAt: dateStr,
      status: 'En Revisión',
      currentStep: 2,
      assignedAdvisorId: assignedAdv.id,
      assignedAdvisorName: assignedAdv.name,
      approvedAmount: appData.loanDetails.capital,
      advisorActionLogs: [initialLog],
      uploadedDocuments: [],
      digitalAccount: {
        accountNumber: digitalIban,
        bicSwift: 'INSTESMMXXX',
        balance: 0, // Starts at 0 € in compliance with Spain neo-banking rules
        creditQuota: appData.loanDetails.capital * 1.5,
        usedQuota: 0,
        transactions: [],
        linkedExternalBank: {
          bankName: appData.bankDetails.bankName,
          iban: appData.bankDetails.iban,
          holderName: `${appData.personalData.firstName} ${appData.personalData.lastName}`
        }
      },
      adminNotes: 'Solicitud registrada. Pendiente de verificación documental y comprobación de solvencia ASNEF.'
    };

    setApplications(prev => [newApp, ...prev]);
    setSelectedApplication(newApp);
    setActiveBankUserApp(newApp);

    // Notify Admin and Assigned Advisor
    addNotification({
      recipientRole: 'admin',
      title: '🚀 Nueva Solicitud de Microcrédito',
      message: `${appData.personalData.firstName} ${appData.personalData.lastName} ha solicitado ${appData.loanDetails.capital.toFixed(2)} € para ${appData.loanDetails.loanPurpose}.`,
      type: 'info',
      linkAction: 'solicitudes'
    });

    addNotification({
      recipientRole: 'advisor',
      recipientId: assignedAdv.id,
      title: '🎯 Nuevo Cliente en tu Cartera',
      message: `Se te ha asignado la solicitud #${radicado} de ${appData.personalData.firstName} ${appData.personalData.lastName}.`,
      type: 'info'
    });

    return newApp;
  };

  // Status updates
  const updateApplicationStatus = (id: string, status: LoanStatus, notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          let step = app.currentStep;
          if (status === 'Pendiente') step = 1;
          if (status === 'En Revisión') step = 2;
          if (status === 'Aprobado') step = 3;
          if (status === 'Desembolsado') step = 4;

          const updatedAccount = { ...app.digitalAccount };

          // If changing to Desembolsado, credit the EUR balance to user's independent account!
          if (status === 'Desembolsado' && app.status !== 'Desembolsado') {
            const capitalToDisburse = app.approvedAmount || app.loanDetails.capital;
            const newBal = updatedAccount.balance + capitalToDisburse;
            const now = new Date();
            const timeStr = `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES')}`;

            const disbTx: BankTransaction = {
              id: `TXN-${Date.now()}`,
              type: 'Desembolso de Crédito',
              amount: capitalToDisburse,
              date: timeStr,
              description: `Desembolso de micropréstamo ${app.id} a Cuenta Digital IBAN`,
              reference: `SEPA-INST-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'Completado',
              balanceAfter: newBal
            };

            updatedAccount.balance = newBal;
            updatedAccount.usedQuota = capitalToDisburse;
            updatedAccount.transactions = [disbTx, ...updatedAccount.transactions];

            addNotification({
              recipientRole: 'user',
              recipientId: app.personalData.email,
              title: '🎉 ¡Préstamo Desembolsado!',
              message: `Se han acreditado ${capitalToDisburse.toFixed(2)} € en tu Cuenta Digital Instacredit. Ya puedes transferirlos o pagar con Bizum.`,
              type: 'success'
            });
          }

          if (status === 'Aprobado' && app.status !== 'Aprobado') {
            addNotification({
              recipientRole: 'user',
              recipientId: app.personalData.email,
              title: '✅ ¡Préstamo Aprobado por el Analista!',
              message: `Tu solicitud #${app.id} por ${(app.approvedAmount || app.loanDetails.capital).toFixed(2)} € ha sido aprobada.`,
              type: 'success'
            });
          }

          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          const actionLogItem: AdvisorActionLog = {
            id: `LOG-${Date.now()}`,
            advisorId: currentAdvisor.id,
            advisorName: currentAdvisor.name,
            timestamp: timeStr,
            actionType: 'cambio_estado',
            summary: `Estado modificado a: "${status}". Notas: ${notes || 'Sin observaciones adicionales'}`
          };

          const updatedApp: CreditApplication = {
            ...app,
            status,
            currentStep: step,
            digitalAccount: updatedAccount,
            adminNotes: notes !== undefined ? notes : app.adminNotes,
            advisorActionLogs: [actionLogItem, ...app.advisorActionLogs],
            updatedAt: 'Hoy'
          };

          if (activeBankUserApp?.id === id) {
            setActiveBankUserApp(updatedApp);
          }
          if (selectedApplication?.id === id) {
            setSelectedApplication(updatedApp);
          }

          return updatedApp;
        }
        return app;
      })
    );
  };

  const updateApplicationApprovedAmount = (id: string, newAmount: number) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const recalculated = calculateLoanBreakdown(newAmount, app.loanDetails.termDays);
          recalculated.loanPurpose = app.loanDetails.loanPurpose;

          const updatedApp = {
            ...app,
            approvedAmount: newAmount,
            loanDetails: recalculated
          };

          if (activeBankUserApp?.id === id) {
            setActiveBankUserApp(updatedApp);
          }
          if (selectedApplication?.id === id) {
            setSelectedApplication(updatedApp);
          }

          addNotification({
            recipientRole: 'user',
            recipientId: app.personalData.email,
            title: '📝 Modificación de Cuantía Aprobada',
            message: `El analista ha ajustado tu importe aprobado a ${newAmount.toFixed(2)} € conforme a tu capacidad de solvencia.`,
            type: 'info'
          });

          return updatedApp;
        }
        return app;
      })
    );
  };

  const updateApplicationFullData = (id: string, updatedData: Partial<CreditApplication>) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          const logItem: AdvisorActionLog = {
            id: `LOG-${Date.now()}`,
            advisorId: currentAdvisor.id,
            advisorName: currentAdvisor.name,
            timestamp: timeStr,
            actionType: 'cambio_estado',
            summary: 'Datos de la solicitud modificados y corregidos manualmente por el administrador.'
          };

          const merged: CreditApplication = {
            ...app,
            ...updatedData,
            personalData: {
              ...app.personalData,
              ...(updatedData.personalData || {})
            },
            economicData: {
              ...app.economicData,
              ...(updatedData.economicData || {})
            },
            bankDetails: {
              ...app.bankDetails,
              ...(updatedData.bankDetails || {})
            },
            loanDetails: {
              ...app.loanDetails,
              ...(updatedData.loanDetails || {})
            },
            digitalAccount: {
              ...app.digitalAccount,
              ...(updatedData.digitalAccount || {})
            },
            advisorActionLogs: [logItem, ...(app.advisorActionLogs || [])],
            updatedAt: 'Hoy'
          };

          if (activeBankUserApp?.id === id) setActiveBankUserApp(merged);
          if (selectedApplication?.id === id) setSelectedApplication(merged);
          return merged;
        }
        return app;
      })
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const advanceApplicationStep = (id: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const nextStep = Math.min(app.currentStep + 1, 4);
          let newStatus = app.status;
          if (nextStep === 2) newStatus = 'En Revisión';
          if (nextStep === 3) newStatus = 'Aprobado';
          if (nextStep === 4) newStatus = 'Desembolsado';

          const updatedAccount = { ...app.digitalAccount };
          if (nextStep === 4 && app.status !== 'Desembolsado') {
            const capitalToDisburse = app.approvedAmount || app.loanDetails.capital;
            const newBal = updatedAccount.balance + capitalToDisburse;
            const now = new Date();
            const timeStr = `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES')}`;

            const disbTx: BankTransaction = {
              id: `TXN-${Date.now()}`,
              type: 'Desembolso de Crédito',
              amount: capitalToDisburse,
              date: timeStr,
              description: `Desembolso micropréstamo ${app.id} a Cuenta Digital`,
              reference: `SEPA-DISP-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'Completado',
              balanceAfter: newBal
            };

            updatedAccount.balance = newBal;
            updatedAccount.usedQuota = capitalToDisburse;
            updatedAccount.transactions = [disbTx, ...updatedAccount.transactions];
          }

          const updated = {
            ...app,
            currentStep: nextStep,
            status: newStatus,
            digitalAccount: updatedAccount,
            updatedAt: 'Hoy'
          };

          if (activeBankUserApp?.id === id) setActiveBankUserApp(updated);
          if (selectedApplication?.id === id) setSelectedApplication(updated);
          return updated;
        }
        return app;
      })
    );
  };

  const findApplicationBySearch = (query: string): CreditApplication | null => {
    const clean = query.trim().toLowerCase();
    if (!clean) return null;
    return (
      applications.find(
        app =>
          app.id.toLowerCase().includes(clean) ||
          app.personalData.documentNumber.toLowerCase().includes(clean) ||
          app.digitalAccount.accountNumber.toLowerCase().includes(clean) ||
          `${app.personalData.firstName} ${app.personalData.lastName}`.toLowerCase().includes(clean)
      ) || null
    );
  };

  const loginAdvisor = (advisorId: string, pin: string) => {
    const adv = advisorsList.find(a => a.id === advisorId);
    if (!adv) {
      return { success: false, message: 'Asesor no encontrado en el sistema.' };
    }
    const cleanPin = pin.trim().toLowerCase();
    if (cleanPin === 'asesor2026' || cleanPin === '1234' || cleanPin === 'instacredit' || cleanPin === adv.id.toLowerCase()) {
      setCurrentAdvisor(adv);
      setIsAdvisorLoggedIn(true);
      setIsAdvisorView(true);
      try {
        sessionStorage.setItem('instacredit_advisor_auth', 'true');
        sessionStorage.setItem('instacredit_advisor_id', adv.id);
      } catch (err) {
        console.warn(err);
      }
      addNotification({
        recipientRole: 'admin',
        title: '🔑 Inicio de Sesión de Asesor',
        message: `${adv.name} (${adv.id}) ha iniciado sesión operativa en el sistema.`,
        type: 'info'
      });
      return { success: true, message: `¡Bienvenido(a), ${adv.name}!` };
    }
    return { success: false, message: 'PIN de asesor incorrecto. Utiliza "asesor2026".' };
  };

  const logoutAdvisor = () => {
    setIsAdvisorLoggedIn(false);
    setIsAdvisorView(false);
    try {
      sessionStorage.removeItem('instacredit_advisor_auth');
      sessionStorage.removeItem('instacredit_advisor_id');
    } catch (err) {
      console.warn(err);
    }
  };

  const loginAdmin = (pass: string) => {
    if (pass === 'admin2026' || pass === 'instacredit') {
      setIsAdminLoggedIn(true);
      setIsAdminView(true);
      try {
        sessionStorage.setItem('instacredit_admin_auth', 'true');
      } catch (err) {
        console.warn(err);
      }
      addNotification({
        recipientRole: 'admin',
        title: '🛡️ Acceso de Administrador Autorizado',
        message: 'Sesión de administración central iniciada correctamente.',
        type: 'info'
      });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsAdminView(false);
    try {
      sessionStorage.removeItem('instacredit_admin_auth');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        selectedApplication,
        setSelectedApplication,
        selectedDocType,
        setSelectedDocType,
        platformConfig,
        updatePlatformConfig,
        customerReviews,
        addCustomerReview,
        pqrsRecords,
        addPqrsRecord,
        updatePqrsStatus,
        isApplicationModalOpen,
        openApplicationModal,
        closeApplicationModal,
        initialLoanConfig,
        isTicketModalOpen,
        openTicketModal,
        closeTicketModal,
        isLookupModalOpen,
        openLookupModal,
        closeLookupModal,
        isDocumentModalOpen,
        openDocumentModal,
        closeDocumentModal,
        isPqrsModalOpen,
        openPqrsModal,
        closePqrsModal,
        isReviewModalOpen,
        openReviewModal,
        closeReviewModal,
        // Didactic Form
        isDidacticFormOpen,
        didacticFormApp,
        didacticFormInitialCategory,
        openDidacticForm,
        closeDidacticForm,
        // User Auth
        currentUser,
        userAccounts,
        isUserLoginModalOpen,
        openUserLoginModal,
        closeUserLoginModal,
        loginUser,
        registerUser,
        logoutUser,
        // Digital Bank
        isUserBankPortalOpen,
        openUserBankPortal,
        closeUserBankPortal,
        activeBankUserApp,
        setActiveBankUserApp,
        userDepositToAccount,
        userPayQuotaFromBalance,
        userWithdrawToExternalBank,
        // Advisor System
        isAdvisorView,
        setIsAdvisorView,
        isAdvisorLoggedIn,
        loginAdvisor,
        logoutAdvisor,
        currentAdvisor,
        setCurrentAdvisor,
        advisorsList,
        assignAdvisorToApplication,
        logAdvisorAction,
        clientQueries,
        sendClientMessageToQuery,
        updateQueryStatus,
        // Staff Auth Modal
        isStaffAuthModalOpen,
        staffAuthModalMode,
        openStaffAuthModal,
        closeStaffAuthModal,
        // Notifications
        notifications,
        unreadNotificationCount,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        triggerChatBubbleOpenNotice,
        // Admin
        isAdminView,
        setIsAdminView,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        createNewApplication,
        updateApplicationStatus,
        updateApplicationApprovedAmount,
        updateApplicationFullData,
        deleteApplication,
        advanceApplicationStep,
        findApplicationBySearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

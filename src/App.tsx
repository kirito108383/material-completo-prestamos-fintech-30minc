import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSimulator } from './components/home/HeroSimulator';
import { WhoWeAre } from './components/home/WhoWeAre';
import { HowItWorksTabs } from './components/home/HowItWorksTabs';
import { AppDownloadBanner } from './components/home/AppDownloadBanner';
import { RegulatoryCompliance } from './components/home/RegulatoryCompliance';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqKnowledgeBase } from './components/home/FaqKnowledgeBase';
import { LoanApplicationModal } from './components/modals/LoanApplicationModal';
import { LoanReceiptTicketModal } from './components/modals/LoanReceiptTicketModal';
import { TicketLookupModal } from './components/modals/TicketLookupModal';
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';
import { PqrsModal } from './components/modals/PqrsModal';
import { ReviewModal } from './components/modals/ReviewModal';
import { UserAuthModal } from './components/modals/UserAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { UserBankPortal } from './components/banking/UserBankPortal';
import { OmniWidget } from './components/widget/OmniWidget';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PushNotificationManager } from './components/pwa/PushNotificationManager';
import { DidacticCustomerFormModal } from './components/forms/DidacticCustomerFormModal';
import { StaffAuthModal } from './components/modals/StaffAuthModal';

const MainContent: React.FC = () => {
  const {
    isAdminView,
    setIsAdminView,
    isAdminLoggedIn,
    isAdvisorView,
    setIsAdvisorView,
    isAdvisorLoggedIn,
    isDidacticFormOpen,
    closeDidacticForm,
    didacticFormApp,
    didacticFormInitialCategory,
    isStaffAuthModalOpen,
    staffAuthModalMode,
    closeStaffAuthModal
  } = useApp();

  // If in Admin Dashboard View - Strictly Guarded by Authentication
  if (isAdminView) {
    if (!isAdminLoggedIn) {
      return (
        <StaffAuthModal
          isOpen={true}
          defaultMode="admin"
          onClose={() => setIsAdminView(false)}
        />
      );
    }

    return (
      <>
        <AdminDashboard />
        <DocumentViewerModal />
        <LoanReceiptTicketModal />
        <UserBankPortal />
        <DidacticCustomerFormModal
          isOpen={isDidacticFormOpen}
          onClose={closeDidacticForm}
          preselectedApp={didacticFormApp}
          initialCategory={didacticFormInitialCategory}
        />
        <OfflineIndicator />
      </>
    );
  }

  // If in Advisor & Customer Service Management Dashboard View - Strictly Guarded
  if (isAdvisorView) {
    if (!isAdvisorLoggedIn) {
      return (
        <StaffAuthModal
          isOpen={true}
          defaultMode="advisor"
          onClose={() => setIsAdvisorView(false)}
        />
      );
    }

    return (
      <>
        <AdvisorDashboard />
        <DocumentViewerModal />
        <LoanReceiptTicketModal />
        <UserBankPortal />
        <DidacticCustomerFormModal
          isOpen={isDidacticFormOpen}
          onClose={closeDidacticForm}
          preselectedApp={didacticFormApp}
          initialCategory={didacticFormInitialCategory}
        />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#0F172A]">
      {/* Navigation */}
      <Navbar />

      {/* PWA Push Notification Activation Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 w-full">
        <PushNotificationManager />
      </div>

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Section 1: Hero & Loan Simulator */}
        <HeroSimulator />

        {/* Section 2: Who We Are (Value Proposition & Spain Regulatory Framing) */}
        <WhoWeAre />

        {/* Section 3: Interactive How It Works (Solicitar, Pagar con Bizum, Extender) */}
        <HowItWorksTabs />

        {/* Section 4: Mobile App Showcase with QR Scanner & PWA */}
        <AppDownloadBanner />

        {/* Section 5: Regulatory Compliance & Banco de España Pillars */}
        <RegulatoryCompliance />

        {/* Section 6: Customer Reviews & Social Proof */}
        <TestimonialsSection />

        {/* Section 7: SEO Knowledge Base & Legal Articles */}
        <FaqKnowledgeBase />
      </main>

      {/* Corporate Footer */}
      <Footer />

      {/* Floating Omnichannel Widget */}
      <OmniWidget />

      {/* Interactive Global Modals */}
      <LoanApplicationModal />
      <LoanReceiptTicketModal />
      <TicketLookupModal />
      <DocumentViewerModal />
      <PqrsModal />
      <ReviewModal />
      <UserAuthModal />
      <StaffAuthModal
        isOpen={isStaffAuthModalOpen}
        onClose={closeStaffAuthModal}
        defaultMode={staffAuthModalMode}
      />
      <DidacticCustomerFormModal
        isOpen={isDidacticFormOpen}
        onClose={closeDidacticForm}
        preselectedApp={didacticFormApp}
        initialCategory={didacticFormInitialCategory}
      />

      {/* Independent Digital Banking Account Portal */}
      <UserBankPortal />

      {/* PWA Offline Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

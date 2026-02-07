import React, { useReducer, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileSidebar } from './components/MobileSidebar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { ModernModal } from './components/ModernModal';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Events from './pages/Events';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

type PopupInfo = { displayFlag: boolean; titleContent: string; bodyContent: string };
type PopupAction =
  | { kind: 'LAUNCH_POPUP'; payload: { titleContent: string; bodyContent: string } }
  | { kind: 'TERMINATE_POPUP' };

const popupReducerFunction = (currentState: PopupInfo, incomingAction: PopupAction): PopupInfo => {
  switch (incomingAction.kind) {
    case 'LAUNCH_POPUP':
      return { displayFlag: true, ...incomingAction.payload };
    case 'TERMINATE_POPUP':
      return { ...currentState, displayFlag: false };
    default:
      return currentState;
  }
};

const initialPopupState: PopupInfo = { displayFlag: false, titleContent: '', bodyContent: '' };

const RestaurantApp: React.FC = () => {
  const [popupInfo, dispatchPopupAction] = useReducer(popupReducerFunction, initialPopupState);

  const launchPopupWindow = useCallback((titleContent: string, bodyContent: string) => {
    dispatchPopupAction({ kind: 'LAUNCH_POPUP', payload: { titleContent, bodyContent } });
  }, []);

  const terminatePopupWindow = useCallback(() => {
    dispatchPopupAction({ kind: 'TERMINATE_POPUP' });
  }, []);

  const bookingRequestAction = useCallback(() => {
    launchPopupWindow('Próximamente', 'Esta funcionalidad estará próximamente disponible.');
  }, [launchPopupWindow]);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-background text-foreground">
        {/* Mobile Sidebar - Only visible on mobile */}
        <MobileSidebar onBooking={bookingRequestAction} />

        {/* Main Content */}
        <main className="min-h-screen pb-20 lg:pb-24">
          <Routes>
            <Route path="/" element={<Home onShowModal={bookingRequestAction} />} />
            <Route path="/menu" element={<Menu onShowModal={launchPopupWindow} />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events onShowModal={bookingRequestAction} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact onShowModal={launchPopupWindow} />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </main>

        {/* Bottom Nav - Only visible on desktop */}
        <BottomNav onBooking={bookingRequestAction} />

        {/* Modal */}
        <ModernModal
          isVisible={popupInfo.displayFlag}
          heading={popupInfo.titleContent}
          content={popupInfo.bodyContent}
          handleDismiss={terminatePopupWindow}
        />
      </div>
    </BrowserRouter>
  );
};

export default RestaurantApp;
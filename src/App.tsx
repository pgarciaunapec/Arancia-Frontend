import React, { useReducer, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileSidebar } from './components/MobileSidebar';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { ModernModal } from './components/ModernModal';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Events from './pages/Events';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Reservations from './pages/Reservations';
import BookingConfirmation from './pages/BookingConfirmation';
import NotFound from './pages/NotFound';

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

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-background text-foreground">
        {/* Top Nav */}
        <TopNav />

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu onShowModal={launchPopupWindow} />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events onShowModal={launchPopupWindow} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact onShowModal={launchPopupWindow} />} />

            {/* New Routes */}
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </main>

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
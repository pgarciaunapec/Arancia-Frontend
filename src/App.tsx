import React, { useReducer, useCallback, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileSidebar } from "./components/MobileSidebar";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { ModernModal } from "./components/ModernModal";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Events from "./pages/Events";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Reservations from "./pages/Reservations";
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyReservations from "./pages/MyReservations";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import DeliveryTracking from "./pages/DeliveryTracking";

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminTables = lazy(() => import("./pages/admin/AdminTables"));
const AdminTableBills = lazy(() => import("./pages/admin/AdminTableBills"));
const AdminCashRegister = lazy(() => import("./pages/admin/AdminCashRegister"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminDelivery = lazy(() => import("./pages/admin/AdminDelivery"));

type PopupInfo = {
  displayFlag: boolean;
  titleContent: string;
  bodyContent: string;
};
type PopupAction =
  | {
      kind: "LAUNCH_POPUP";
      payload: { titleContent: string; bodyContent: string };
    }
  | { kind: "TERMINATE_POPUP" };

const popupReducerFunction = (
  currentState: PopupInfo,
  incomingAction: PopupAction,
): PopupInfo => {
  switch (incomingAction.kind) {
    case "LAUNCH_POPUP":
      return { displayFlag: true, ...incomingAction.payload };
    case "TERMINATE_POPUP":
      return { ...currentState, displayFlag: false };
    default:
      return currentState;
  }
};

const initialPopupState: PopupInfo = {
  displayFlag: false,
  titleContent: "",
  bodyContent: "",
};

const RestaurantApp: React.FC = () => {
  const [popupInfo, dispatchPopupAction] = useReducer(
    popupReducerFunction,
    initialPopupState,
  );

  const launchPopupWindow = useCallback(
    (titleContent: string, bodyContent: string) => {
      dispatchPopupAction({
        kind: "LAUNCH_POPUP",
        payload: { titleContent, bodyContent },
      });
    },
    [],
  );

  const terminatePopupWindow = useCallback(() => {
    dispatchPopupAction({ kind: "TERMINATE_POPUP" });
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
            <Route
              path="/menu"
              element={<Menu onShowModal={launchPopupWindow} />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/events"
              element={<Events onShowModal={launchPopupWindow} />}
            />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route
              path="/contact"
              element={<Contact onShowModal={launchPopupWindow} />}
            />
            <Route path="/reservations" element={<Reservations />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />

            {/* Private Routes */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <PrivateRoute>
                  <MyReservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/delivery/:orderId"
              element={
                <PrivateRoute>
                  <DeliveryTracking />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center min-h-screen bg-black">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5b400]" />
                      </div>
                    }
                  >
                    <AdminLayout />
                  </Suspense>
                </AdminRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={null}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
              <Route
                path="customers"
                element={
                  <Suspense fallback={null}>
                    <AdminCustomers />
                  </Suspense>
                }
              />
              <Route
                path="tables"
                element={
                  <Suspense fallback={null}>
                    <AdminTables />
                  </Suspense>
                }
              />
              <Route
                path="table-bills"
                element={
                  <Suspense fallback={null}>
                    <AdminTableBills />
                  </Suspense>
                }
              />
              <Route
                path="cash-register"
                element={
                  <Suspense fallback={null}>
                    <AdminCashRegister />
                  </Suspense>
                }
              />
              <Route
                path="inventory"
                element={
                  <Suspense fallback={null}>
                    <AdminInventory />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={null}>
                    <AdminOrders />
                  </Suspense>
                }
              />
              <Route
                path="delivery"
                element={
                  <Suspense fallback={null}>
                    <AdminDelivery />
                  </Suspense>
                }
              />
            </Route>

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

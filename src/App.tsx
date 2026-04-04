import React, { useReducer, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileSidebar } from "./components/MobileSidebar";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { ModernModal } from "./components/ModernModal";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ReservationsProvider } from "./context/ReservationsContext";
import { AdminProvider } from "./context/AdminContext";

// Route Guards
import PrivateRoute from "./components/guards/PrivateRoute";
import AdminRoute from "./components/guards/AdminRoute";

// Pages
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
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminClients from "./pages/admin/AdminClients";
import AdminTables from "./pages/admin/AdminTables";
import AdminCashRegister from "./pages/admin/AdminCashRegister";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminDelivery from "./pages/admin/AdminDelivery";
import AdminTableBills from "./pages/admin/AdminTableBills";

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
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <ReservationsProvider>
              <AdminProvider>
                <Routes>
                  {/* ─── Admin Routes (no main layout) ─── */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminOrders />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/clients"
                    element={
                      <AdminRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                          <AdminClients />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/tables"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminTables />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/cash"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminCashRegister />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/inventory"
                    element={
                      <AdminRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                          <AdminInventory />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/delivery"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminDelivery />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/table-bills"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminTableBills />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />

                  {/* ─── Main Layout Routes ─── */}
                  <Route
                    path="/*"
                    element={
                      <div className="min-h-screen w-full bg-background text-foreground">
                        <TopNav />
                        <MobileSidebar />
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
                              element={
                                <Events onShowModal={launchPopupWindow} />
                              }
                            />
                            <Route path="/services" element={<Services />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route
                              path="/contact"
                              element={
                                <Contact onShowModal={launchPopupWindow} />
                              }
                            />

                            {/* Auth */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Public Cart & Reservations */}
                            <Route path="/cart" element={<Cart />} />
                            <Route
                              path="/reservations"
                              element={<Reservations />}
                            />
                            <Route
                              path="/booking-confirmation"
                              element={<BookingConfirmation />}
                            />

                            {/* Protected Routes */}
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
                              path="/profile"
                              element={
                                <PrivateRoute>
                                  <Profile />
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
                              path="/track/:orderId"
                              element={
                                <PrivateRoute>
                                  <OrderTracking />
                                </PrivateRoute>
                              }
                            />

                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <Footer />
                        </main>

                        <ModernModal
                          isVisible={popupInfo.displayFlag}
                          heading={popupInfo.titleContent}
                          content={popupInfo.bodyContent}
                          handleDismiss={terminatePopupWindow}
                        />
                      </div>
                    }
                  />
                </Routes>
              </AdminProvider>
            </ReservationsProvider>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default RestaurantApp;

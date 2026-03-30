import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../contexts/AuthContext";

const mockedUseAuth = vi.mocked(useAuth);

describe("AdminRoute", () => {
  it("muestra loader cuando la autenticacion esta cargando", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      isAdmin: false,
      isStaff: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel admin</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("redirige a login cuando no hay sesion", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      isAdmin: false,
      isStaff: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Panel admin</div>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<div>Pantalla login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Pantalla login")).toBeInTheDocument();
  });

  it("redirige al home cuando el rol no es admin o staff", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: "u1",
        name: "Juan",
        email: "juan@test.com",
        role: "customer",
      },
      isAdmin: false,
      isStaff: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Panel admin</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Pantalla home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Pantalla home")).toBeInTheDocument();
  });

  it("permite acceso cuando el rol es admin", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: "u1",
        name: "Admin",
        email: "admin@test.com",
        role: "admin",
      },
      isAdmin: true,
      isStaff: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel admin</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Panel admin")).toBeInTheDocument();
  });

  it("permite acceso cuando el rol es staff", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: "u2",
        name: "Staff",
        email: "staff@test.com",
        role: "staff",
      },
      isAdmin: false,
      isStaff: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel admin</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Panel admin")).toBeInTheDocument();
  });
});

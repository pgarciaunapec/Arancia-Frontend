import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../contexts/AuthContext";

const mockedUseAuth = vi.mocked(useAuth);

describe("PrivateRoute", () => {
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
      <MemoryRouter initialEntries={["/checkout"]}>
        <PrivateRoute>
          <div>Contenido privado</div>
        </PrivateRoute>
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
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <div>Contenido privado</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Pantalla login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Pantalla login")).toBeInTheDocument();
  });

  it("renderiza children cuando hay sesion activa", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: "u1",
        name: "Ana",
        email: "ana@test.com",
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
      <MemoryRouter>
        <PrivateRoute>
          <div>Contenido privado</div>
        </PrivateRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });
});

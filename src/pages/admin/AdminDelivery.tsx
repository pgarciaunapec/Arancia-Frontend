import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { apiRequest } from "../../lib/api";
import type { ApiEnvelope } from "../../lib/api";
import { mapBackendVehicle } from "../../lib/mappers";
import type { Vehicle } from "../../types";

type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed";

interface DeliveryRecord {
  _id: string;
  status: DeliveryStatus;
  estimatedMinutes?: number;
  order?: { _id: string; total?: number };
  user?: { name?: string; email?: string; phone?: string };
  agent?: { name?: string; phone?: string };
  assignedTo?: { _id?: string; name?: string; email?: string };
  vehicle?: { _id?: string; plate?: string; vehicleModel?: string };
  createdAt?: string;
}

interface EmployeeOption {
  id: string;
  name: string;
}

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  pending: "Pendiente",
  assigned: "Asignado",
  in_transit: "En tránsito",
  delivered: "Entregado",
  failed: "Fallido",
};

const NEXT_STATUS: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  pending: "assigned",
  assigned: "in_transit",
  in_transit: "delivered",
};

const AdminDelivery: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [assignmentByDelivery, setAssignmentByDelivery] = useState<
    Record<string, { assignedTo: string; vehicleId: string }>
  >({});

  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    type: "motorbike",
    vehicleModel: "",
    capacityOrders: 1,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [deliveryResponse, employeesResponse, fleetResponse] =
        await Promise.all([
          apiRequest<ApiEnvelope<DeliveryRecord[]>>("/admin/delivery", {
            auth: true,
          }),
          apiRequest<ApiEnvelope<any[]>>("/admin/users/employees?includeAdmins=true", {
            auth: true,
          }),
          apiRequest<ApiEnvelope<any[]>>("/admin/fleet", { auth: true }),
        ]);

      const nextDeliveries = deliveryResponse.data || [];
      setDeliveries(nextDeliveries);
      setEmployees(
        (employeesResponse.data || []).map((employee) => ({
          id: String(employee._id || employee.id),
          name: employee.name || "Empleado",
        })),
      );
      setVehicles((fleetResponse.data || []).map(mapBackendVehicle));

      const assignmentMap: Record<string, { assignedTo: string; vehicleId: string }> =
        {};
      for (const delivery of nextDeliveries) {
        assignmentMap[delivery._id] = {
          assignedTo: delivery.assignedTo?._id || "",
          vehicleId: delivery.vehicle?._id || "",
        };
      }
      setAssignmentByDelivery(assignmentMap);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar delivery",
      );
      setDeliveries([]);
      setEmployees([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const activeCount = useMemo(
    () =>
      deliveries.filter((item) =>
        ["pending", "assigned", "in_transit"].includes(item.status),
      ).length,
    [deliveries],
  );

  const updateStatus = async (
    delivery: DeliveryRecord,
    status: DeliveryStatus,
  ) => {
    const assignment = assignmentByDelivery[delivery._id] || {
      assignedTo: "",
      vehicleId: "",
    };

    setSavingId(delivery._id);
    setError("");
    try {
      await apiRequest(`/admin/delivery/${delivery._id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          status,
          assignedTo: assignment.assignedTo || undefined,
          vehicleId: assignment.vehicleId || undefined,
        }),
      });
      await loadData();
    } catch {
      setError("No se pudo actualizar el estado del delivery");
    } finally {
      setSavingId("");
    }
  };

  const createVehicle = async () => {
    if (!newVehicle.plate.trim() || !newVehicle.vehicleModel.trim()) {
      setError("Placa y modelo son obligatorios para crear vehículo.");
      return;
    }

    setError("");
    try {
      await apiRequest("/admin/fleet", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          plate: newVehicle.plate,
          type: newVehicle.type,
          vehicleModel: newVehicle.vehicleModel,
          capacityOrders: Number(newVehicle.capacityOrders || 1),
        }),
      });
      setNewVehicle({
        plate: "",
        type: "motorbike",
        vehicleModel: "",
        capacityOrders: 1,
      });
      await loadData();
    } catch {
      setError("No se pudo crear el vehículo.");
    }
  };

  const updateVehicleStatus = async (vehicleId: string, status: string) => {
    try {
      await apiRequest(`/admin/fleet/${vehicleId}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch {
      setError("No se pudo actualizar el vehículo.");
    }
  };

  const deactivateVehicle = async (vehicleId: string) => {
    try {
      await apiRequest(`/admin/fleet/${vehicleId}`, {
        method: "DELETE",
        auth: true,
      });
      await loadData();
    } catch {
      setError("No se pudo desactivar el vehículo.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Delivery y Flota</h1>
        <p className="text-sm text-white/60">Activos: {activeCount}</p>
      </div>

      {error && (
        <Card className="p-4 text-red-400 bg-red-500/10 border-red-500/30">
          {error}
        </Card>
      )}

      <Card className="p-4 bg-[#2d1f0f] border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold text-white">Flota (CRUD)</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={newVehicle.plate}
            onChange={(event) =>
              setNewVehicle((prev) => ({ ...prev, plate: event.target.value }))
            }
            placeholder="Placa"
            className="bg-black/20 border border-white/20 rounded px-3 py-2 text-sm text-white"
          />
          <select
            value={newVehicle.type}
            onChange={(event) =>
              setNewVehicle((prev) => ({ ...prev, type: event.target.value }))
            }
            className="bg-black/20 border border-white/20 rounded px-3 py-2 text-sm text-white"
          >
            <option value="motorbike">Moto</option>
            <option value="car">Carro</option>
            <option value="van">Van</option>
            <option value="bicycle">Bicicleta</option>
          </select>
          <input
            value={newVehicle.vehicleModel}
            onChange={(event) =>
              setNewVehicle((prev) => ({
                ...prev,
                vehicleModel: event.target.value,
              }))
            }
            placeholder="Modelo"
            className="bg-black/20 border border-white/20 rounded px-3 py-2 text-sm text-white"
          />
          <Button onClick={() => void createVehicle()}>Agregar Vehículo</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="text-left p-2">Placa</th>
                <th className="text-left p-2">Tipo</th>
                <th className="text-left p-2">Modelo</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-white/5 text-white/90">
                  <td className="p-2">{vehicle.plate}</td>
                  <td className="p-2">{vehicle.type}</td>
                  <td className="p-2">{vehicle.vehicleModel}</td>
                  <td className="p-2">
                    <select
                      value={vehicle.status}
                      onChange={(event) =>
                        void updateVehicleStatus(vehicle.id, event.target.value)
                      }
                      className="bg-black/20 border border-white/20 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="available">Disponible</option>
                      <option value="in_use">En uso</option>
                      <option value="maintenance">Mantenimiento</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white"
                      onClick={() => void deactivateVehicle(vehicle.id)}
                    >
                      Desactivar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bg-[#2d1f0f] border border-white/10">
        {loading ? (
          <p className="text-white/70">Cargando deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-white/70">No hay deliveries para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60">
                  <th className="text-left p-3">Orden</th>
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Repartidor</th>
                  <th className="text-left p-3">Vehículo</th>
                  <th className="text-left p-3">ETA</th>
                  <th className="text-left p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => {
                  const nextStatus = NEXT_STATUS[delivery.status];
                  const assignment = assignmentByDelivery[delivery._id] || {
                    assignedTo: "",
                    vehicleId: "",
                  };

                  return (
                    <tr
                      key={delivery._id}
                      className="border-b border-white/5 text-white/90"
                    >
                      <td className="p-3 font-mono text-xs">
                        #{delivery.order?._id?.slice(-6) || delivery._id.slice(-6)}
                      </td>
                      <td className="p-3">{delivery.user?.name || "Cliente"}</td>
                      <td className="p-3">{STATUS_LABEL[delivery.status]}</td>
                      <td className="p-3">
                        <select
                          value={assignment.assignedTo}
                          onChange={(event) =>
                            setAssignmentByDelivery((prev) => ({
                              ...prev,
                              [delivery._id]: {
                                ...(prev[delivery._id] || {
                                  assignedTo: "",
                                  vehicleId: "",
                                }),
                                assignedTo: event.target.value,
                              },
                            }))
                          }
                          className="bg-black/20 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="">Sin asignar</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={assignment.vehicleId}
                          onChange={(event) =>
                            setAssignmentByDelivery((prev) => ({
                              ...prev,
                              [delivery._id]: {
                                ...(prev[delivery._id] || {
                                  assignedTo: "",
                                  vehicleId: "",
                                }),
                                vehicleId: event.target.value,
                              },
                            }))
                          }
                          className="bg-black/20 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="">Sin vehículo</option>
                          {vehicles
                            .filter((vehicle) => vehicle.status !== "inactive")
                            .map((vehicle) => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.plate} · {vehicle.vehicleModel}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="p-3">
                        {delivery.estimatedMinutes
                          ? `${delivery.estimatedMinutes} min`
                          : "-"}
                      </td>
                      <td className="p-3">
                        {nextStatus ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white"
                            disabled={savingId === delivery._id}
                            onClick={() => void updateStatus(delivery, nextStatus)}
                          >
                            → {STATUS_LABEL[nextStatus]}
                          </Button>
                        ) : (
                          <span className="text-xs text-white/40">Sin acción</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDelivery;

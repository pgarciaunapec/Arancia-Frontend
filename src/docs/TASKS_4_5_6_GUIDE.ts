/**
 * FRONTEND TASKS 4-5-6 IMPLEMENTATION GUIDE
 * 
 * TASK 5 - Seguridad Admin (Frontend):
 * 
 * Rutas Protegidas:
 * - Crear ProtectedAdminRoute componente que verifica user.role === 'admin'
 * - Si no autenticado O rol cambió: redirigir a /admin/login
 * - Backend retorna 403 si rol revocado → capturar en apiRequest
 * - Limpiar session storage y redirigir a login
 * 
 * Integración:
 * - App.tsx: <ProtectedAdminRoute path="/admin/*" component={AdminLayout} />
 * - AuthContext: Monitorear cambios de rol, invalidar sesión admin si cambia
 * 
 * TASK 4 - Gestión de Imágenes (Frontend):
 * 
 * Form de Upload:
 * - Admin puede pegar URL externa o subir archivo
 * - Si URL: enviar a backend para descarga + storage
 * - Si archivo: multipart upload existente
 * - Previsualizamos dataURL en <img src={previewUrl} />
 * 
 * Integración:
 * - AdminMenu.tsx: Agregar campo imageUrl junto a imageFile
 * - Enviar ambos como payload a backend
 * - Backend resuelve cuál usar y retorna image como dataURL
 * 
 * TASK 6 - Seeding y Flujo de Caja (Frontend):
 * 
 * Vistas Admin:
 * - admin/inventory-movements: Tabla de movimientos (entrada/uso/restock)
 * - admin/cash-register: Sesión de caja, ingresos/egresos
 * - Dashboard integrado en main admin panel
 * 
 * Componentes:
 * - CashRegisterSession: Abrir/cerrar sesión, tracking de transacciones
 * - InventoryMovementTable: Log de movimientos por fecha/tipo
 * 
 * API Calls:
 * - GET /admin/inventory/movements?skip=0&limit=50
 * - GET /admin/cash-register/summary?dateRange=today|week|month
 * - POST /admin/cash-register/open-session
 * - POST /admin/cash-register/:id/close
 */

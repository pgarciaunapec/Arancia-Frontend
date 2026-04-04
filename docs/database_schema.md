# Database Schema — Restaurant01

> Diagrama Entidad-Relación generado a partir de los modelos Mongoose en `backend/src/models/`.
> Sintaxis: [Mermaid ER Diagram](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)

---

## Diagrama ER

```mermaid
erDiagram

    %% ══════════════════════════════════════
    %% RELACIONES
    %% ══════════════════════════════════════

    User ||--o{ Order : "places"
    User |o--o{ Reservation : "makes (optional)"
    Order ||--|{ OrderItem : "contains (embedded)"
    OrderItem }o--|| MenuItem : "references"
    Order |o--|| ShippingAddress : "has (embedded)"
    MenuItem ||--o| Image : "image URL references"

    %% ══════════════════════════════════════
    %% ENTIDADES PRINCIPALES
    %% ══════════════════════════════════════

    User {
        ObjectId _id PK
        string name "required, 2-100 chars"
        string email UK "required, unique, lowercase"
        string password "required, min 6 chars, hashed (bcrypt)"
        string phone "optional"
        string address "optional"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    MenuItem {
        ObjectId _id PK
        string name "required, text-index"
        string category "required, indexed"
        number price "required, min 0"
        string_array ingredients "text-index"
        string image "required, URL to /api/images/:id"
        boolean available "default: true"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    Order {
        ObjectId _id PK
        ObjectId user FK "required, ref: User, indexed"
        array items "embedded OrderItem[]"
        number subtotal "auto-calculated pre-save"
        number tax "auto-calculated, 18 pct"
        number total "auto-calculated: subtotal + tax"
        OrderStatus status "default: cart"
        object shippingAddress "embedded ShippingAddress"
        PaymentStatus paymentStatus "default: pending"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    OrderItem {
        ObjectId menuItem FK "required, ref: MenuItem"
        string name "required (snapshot)"
        number quantity "required, min 1"
        number price "required (snapshot)"
    }

    ShippingAddress {
        string name "required"
        string address "required"
        string city "required"
        string zip "required"
    }

    Reservation {
        ObjectId _id PK
        ObjectId user FK "optional, ref: User"
        Date date "required"
        string time "required"
        number guests "required, 1-20"
        string name "required"
        string email "required, lowercase"
        string phone "required"
        string notes "optional, max 500 chars"
        ReservationStatus status "default: pending"
        string location "default: Restaurante Principal"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    %% ══════════════════════════════════════
    %% ENTIDADES INDEPENDIENTES (sin FK)
    %% ══════════════════════════════════════

    Contact {
        ObjectId _id PK
        string name "required"
        string email "required, lowercase"
        string phone "optional"
        string message "required, max 2000 chars"
        ContactStatus status "default: unread"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    EventRequest {
        ObjectId _id PK
        string name "required"
        string email "required, lowercase"
        string phone "required"
        EventType eventType "required"
        PackageName packageName "optional"
        number guests "required, min 1"
        Date preferredDate "optional"
        string notes "optional, max 1000 chars"
        EventRequestStatus status "default: pending"
        Date createdAt "auto (timestamps)"
        Date updatedAt "auto (timestamps)"
    }

    Image {
        ObjectId _id PK
        string filename "required"
        string contentType "required"
        Buffer data "required (binary)"
        Date createdAt "default: Date.now"
    }
```

---

## Enums / Tipos enumerados

| Enum | Valores |
|---|---|
| **OrderStatus** | `cart`, `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled` |
| **PaymentStatus** | `pending`, `paid`, `refunded` |
| **ReservationStatus** | `pending`, `confirmed`, `cancelled`, `completed` |
| **ContactStatus** | `unread`, `read`, `responded` |
| **EventRequestStatus** | `pending`, `contacted`, `confirmed`, `cancelled` |
| **EventType** | `social`, `corporativo`, `privado`, `otro` |
| **PackageName** | `Esencial`, `Premium`, `Elite` |

---

## Índices

| Colección | Campo(s) | Tipo |
|---|---|---|
| **User** | `email` | unique |
| **MenuItem** | `category` | standard |
| **MenuItem** | `name`, `ingredients` | text (full-text search) |
| **Order** | `user` | standard |
| **Reservation** | `user`, `date` | compound (user ↑, date ↓) |
| **Reservation** | `date`, `time` | compound |

---

## Notas

- **OrderItem** y **ShippingAddress** son _subdocumentos embebidos_ dentro de `Order` (no tienen `_id` propio, `_id: false`).
- **Order** calcula `subtotal`, `tax` (18%) y `total` automáticamente en un hook `pre('save')`.
- **User.password** se hashea con `bcrypt` en `pre('save')` y tiene `select: false` (no se incluye en queries por defecto).
- **Reservation.user** es **opcional** — permite reservaciones sin cuenta de usuario.
- **MenuItem.image** almacena una URL string que apunta al endpoint `/api/images/:id`, creando una relación implícita con la colección `Image`.
- **Contact** y **EventRequest** son entidades independientes sin relaciones FK (formularios públicos).

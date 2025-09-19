# Headless E‑commerce — Node.js · Express · Sequelize · React (Admin: shadcn, Store: daisyUI) · Tailwind · MercadoPago

Estado: EN CONSTRUCCIÓN

Descripción
Proyecto headless e‑commerce en desarrollo. Backend con Node.js/Express y Sequelize; frontends en React + Tailwind (admin usa shadcn; tienda usa daisyUI). Integración de pagos: MercadoPago. Envíos: Correo Argentino.

Estructura
- backend/
- frontend/admin/
- frontend/store/

Tecnologías principales
- Backend: Node.js, Express, Sequelize (Postgres recomendado)
- Frontend: React + Tailwind
  - Admin UI: shadcn
  - Store UI: daisyUI
- Pagos: MercadoPago
- Envíos (planificado): Correo Argentino
- Cache / mejora de rendimiento: (opcional) Redis

Estado funcional (breve)
- Admin (en progreso): creación de productos y categorías; visualización de compras.
- Store (en progreso): catálogo y checkout con MercadoPago; pedidos guardados por usuario.
- Gestión de pedidos: en desarrollo / mejora necesaria.

Checklist (pendientes importantes)
- [ ] Optimizar backend usando Redis (cache, sesiones, rate limiting, locking)
- [ ] Mejorar la seguridad (HTTPS/HSTS, helmet, CSP, rate limiting, saneado de inputs)
- [ ] Adaptar cumplimiento con Ley de Protección de Datos Argentina (Ley 25.326) y requisitos de transparencia fiscal para e‑commerce
- [ ] Mejorar/crear la gestión completa de pedidos (estados, reservación de stock, tracking, facturación)
- [ ] Integrar webhooks seguros/idempotentes para MercadoPago
- [ ] Integrar y validar costos de envío con Correo Argentino y guardar tracking en pedidos
- [ ] Agregar generación/registro de comprobantes fiscales o integración con proveedor/AFIP


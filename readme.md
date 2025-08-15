# Restaurante Online

Este proyecto es una **página web para un restaurante** desarrollada con **React** (frontend), **Node.js** (backend) y **Sequelize** (ORM para base de datos). Permite a los clientes realizar pedidos en línea, elegir el método de pago (efectivo o PayPal) y recibir notificaciones por correo electrónico sobre el estado de sus pedidos.

> ⚠️ **La página está casi terminada. Faltan detalles en el frontend y se están mejorando aspectos de seguridad en el backend, especialmente en la gestión de pagos.**

---

## Características principales

- **Frontend:** React  
- **Backend:** Node.js (Express)  
- **Base de datos:** Sequelize (MySQL, PostgreSQL, etc.)
- **Autenticación:** Registro de usuarios con confirmación de cuenta por correo electrónico
- **Pedidos en línea:** Selección de productos y gestión de pedidos
- **Notificaciones por correo electrónico:**  
  - Confirmación de cuenta  
  - Cambios de estado del pedido (en preparación, en envío, cancelado, etc.)
- **Métodos de pago:** Efectivo o PayPal
- **Modo de uso flexible:**  
  - El usuario puede navegar, armar el pedido y revisar el carrito **sin registrarse**.  
  - **Solo al momento de pagar**, se solicita iniciar sesión o registrarse.

---

## Flujo básico de usuario

1. **Exploración y armado de pedido**  
    - El usuario puede navegar por el menú y armar su pedido **sin necesidad de estar registrado**.
2. **Pago del pedido**  
    - Al proceder al pago (efectivo o PayPal), se solicita iniciar sesión o crear una cuenta.  
    - El usuario recibe un correo de confirmación de cuenta al registrarse.
3. **Seguimiento del pedido**  
    - Por cada cambio de estado del pedido, el usuario recibe un correo notificando la actualización.

---

## Estado actual del proyecto

- [x] Backend funcional con Node.js y Sequelize
- [x] Sistema de autenticación y confirmación por email
- [x] Gestión de pedidos y notificaciones por email
- [x] Integración básica con PayPal y opción de pago en efectivo
- [x] Navegación y armado de pedidos sin registro
- [ ] Mejoras de seguridad en pagos
- [ ] Detalles y mejoras en frontend (experiencia de usuario y diseño)
- [ ] Instrucciones de despliegue

---

## Capturas de pantalla
<img width="382" height="852" alt="Image" src="https://github.com/user-attachments/assets/7cdb2f0c-684e-485c-be93-b48eba8cd765" />
<img width="379" height="853" alt="Image" src="https://github.com/user-attachments/assets/ddf4f9f8-4c65-4c70-8e0d-20f02998000d" />
<img width="379" height="850" alt="Image" src="https://github.com/user-attachments/assets/21edd892-0885-4d47-8911-03c500df2fcb" />
<img width="379" height="850" alt="Image" src="https://github.com/user-attachments/assets/5ed1e80f-9cbf-4db3-b84e-b9033df0f724" />
<img width="379" height="850" alt="Image" src="https://github.com/user-attachments/assets/eb72cd66-b266-4b22-8f80-608ecc21d947" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/8c968fa8-310b-4abf-b397-015b131259e8" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/fdee9838-035d-4053-8e44-fcdc1c381f3e" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/d8b754c9-35be-47e2-86cc-c633ecec5593" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/2f01b446-ae15-4e66-9eab-2cbe3c29ed4d" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/1b3c2d83-da43-4f45-952b-ad8b2a61aa4b" />
<img width="1920" height="933" alt="Image" src="https://github.com/user-attachments/assets/1d02f46f-b9ae-44a2-9882-33dc64e396c6" />
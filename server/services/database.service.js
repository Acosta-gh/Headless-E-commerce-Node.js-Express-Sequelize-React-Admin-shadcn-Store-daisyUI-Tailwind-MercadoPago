const { sequelize, Usuario } = require('../models'); // Importa sequelize y modelos necesarios
const bcrypt = require('bcrypt');

/**
 * Crea el usuario administrador a partir de las variables de entorno si no existe.
 * Esta es una operación de "seeding" (siembra de datos).
 */
async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

   console.log(`[SEEDER] Creando admin con password: '${adminPassword}'`);

  // Verifica que las variables de entorno estén definidas
  if (!adminEmail || !adminPassword) {
    console.warn("⚠️  No se creará usuario admin. Faltan variables de entorno ADMIN_EMAIL o ADMIN_PASSWORD.");
    return;
  }

  try {
    // Verificar si el usuario admin ya existe
    const existingAdmin = await Usuario.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`ℹ️  Usuario administrador ya existe: ${adminEmail}`);
      return;
    }
  
    // Crear el usuario administrador
    await Usuario.create({
      nombre: "Administrador",
      email: adminEmail,
      password: adminPassword, // Se hasheará automáticamente por el hook antes de guardar
      admin: true,
      repartidor: false,
      verificado: true,
    });
    console.log(`✅ Usuario administrador creado con éxito: ${adminEmail}`);

  } catch (error) {
    console.error("❌ Error crítico al intentar crear el usuario administrador:", error);
    // En un caso real, podrías querer detener el arranque si el admin es esencial
    throw error;
  }
}

/**
 * Conecta y sincroniza la base de datos usando Sequelize.
 * @returns {Promise<object>} La instancia de sequelize conectada.
 */
async function connectToDatabase() {
  try {
    // sync() también conecta. Authenticate es una buena verificación explícita.
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida con éxito.");

    // Sincroniza los modelos. Ideal para desarrollo.
    // Para producción, considera usar migraciones.
    await sequelize.sync({ force: false });
    console.log("🔄 Modelos de Sequelize sincronizados.");

    // Una vez conectado, ejecuta la siembra de datos.
    await seedAdminUser();

    return sequelize; // Devuelve la instancia para poder cerrarla después

  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    // Relanza el error para que el `startServer` en server.js lo atrape y detenga el proceso.
    throw error;
  }
}

module.exports = { connectToDatabase };
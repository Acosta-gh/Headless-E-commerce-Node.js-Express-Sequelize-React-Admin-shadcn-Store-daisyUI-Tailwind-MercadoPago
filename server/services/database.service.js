const { sequelize } = require("./models"); // Importa la instancia de Sequelize para manejar la base de datos
const { Usuario } = require("./models"); // Importa el modelo de Usuario para crear un usuario administrador
const bcrypt = require("bcrypt"); // Importa bcrypt para hashear contraseñas

/**
 * Sincroniza el modelo de la base de datos y crea un usuario administrador si no existe.
 * 
 * - Verifica que las variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD estén definidas.
 * - Si el usuario administrador no existe, lo crea con los datos proporcionados y contraseña encriptada.
 * - Si el usuario ya existe, muestra una advertencia.
 * - Autentica la conexión con la base de datos y muestra el estado de la conexión.
 * 
 * @async
 * @returns {Promise<void>} No retorna ningún valor.
 */
async function createDatabase() {
  await sequelize.sync({ force: false });
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) { // Verifica que las variables de entorno estén definidas
    console.error(
      "❌ Variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD no están definidas"
    );
    return;
  }
  try { // Verifica si el usuario administrador ya existe
    const existingAdmin = await Usuario.findOne({where: { email: adminEmail },});
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Usuario.create({ // Crea el usuario administrador
        nombre: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        admin: true,
        repartidor: false,
        verificado: true,
      });
      console.log(`✅ Usuario administrador creado: ${adminEmail}`);
    } else {
      console.log(`⚠️  Usuario administrador ya existe: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Error al crear el usuario administrador:", error);
  }
  await sequelize.authenticate(); // Verifica la conexión con la base de datos
  console.log("✅ Conexión a la base de datos exitosa");
}

module.exports = { createDatabase };

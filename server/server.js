require('@dotenvx/dotenvx').config() // 🌱

const { connectToDatabase } = require('./services/database.service'); // 🔗 Importa la función para conectar a la base de datos
const app = require('./app'); // 🚦 Importa la configuración de la aplicación Express
const PORT = process.env.PORT || 3001; // Puerto en el que el servidor escuchará

/**
 * 🚀 Inicia el servidor de la aplicación y establece la conexión a la base de datos.
 * Si ocurre un error durante la conexión o el inicio del servidor, muestra un mensaje de error y termina el proceso.
 * 
 * @async
 * @function startServer
 * @returns {Promise<void>} No retorna ningún valor, pero puede finalizar el proceso en caso de error.
 */
async function startServer() {
  let dbConnection; // Variable para guardar la conexión
  try {
    dbConnection = await connectToDatabase(); 
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("💥 El servidor no pudo iniciar.");
    process.exit(1);
  }
}

startServer();


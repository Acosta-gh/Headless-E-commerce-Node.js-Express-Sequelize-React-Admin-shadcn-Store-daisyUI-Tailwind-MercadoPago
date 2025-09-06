require('@dotenvx/dotenvx').config() // 🌱

const { createDatabase } = require('./services/database.service'); // 🗄️ Importa la función para crear y conectar la base de datos
const app = require('./app'); // 🚦 Importa la configuración de la aplicación Express

const PORT = process.env.PORT || 3001;

/**
 * 🚀 Inicia el servidor de la aplicación.
 * 
 * Esta función crea y conecta la base de datos antes de iniciar el servidor en el puerto especificado.
 * Si ocurre un error al conectar la base de datos, se muestra un mensaje de error en la consola. ⚠️
 * 
 * @async
 * @function
 * @returns {Promise<void>} No retorna ningún valor, pero inicia el servidor si la base de datos se conecta correctamente.
 */
async function startServer() { // 🏁 Función para iniciar el servidor
    try {
        await createDatabase(); // 🗄️ Crea y conecta la base de datos
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
    }
}

startServer(); // 🏁 Inicia el servidor

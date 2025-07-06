require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
    }
}

startServer();
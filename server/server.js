//require('dotenv').config();
require('@dotenvx/dotenvx').config()

const app = require('./app');
const { sequelize } = require('./models');

const { Usuario } = require('./models');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3001;
async function startServer() {
    try {
        await sequelize.sync({ force: false }); // Esto recrea todas las tablas
        // Crear un usuario administrador por defecto
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPassword) {
            const existingAdmin = await Usuario.findOne({ where: { email: adminEmail } });
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await Usuario.create({
                    nombre: 'Administrador',
                    email: adminEmail,
                    password: hashedPassword,
                    admin: true,
                    repartidor: false
                }); 
                console.log(`✅ Usuario administrador creado: ${adminEmail}`);
            } else {
                console.log(`⚠️  Usuario administrador ya existe: ${adminEmail}`);
            }
        } else {
            console.error('❌ Variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD no están definidas');
        }
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
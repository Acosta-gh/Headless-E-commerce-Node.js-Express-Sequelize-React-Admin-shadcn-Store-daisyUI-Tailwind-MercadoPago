//require('dotenv').config();
require('@dotenvx/dotenvx').config()

module.exports = {
    development: {
        username: process.env.DB_USER || 'dev_user',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'restaurant_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'sqlite',
        storage: './db/ecommerce.sqlite' 
    },
    test: {
        username: process.env.DB_USER || 'test_user',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME_TEST || 'test_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'sqlite',
        storage: './db/ecommerce.sqlite' 
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_PROD,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'postgres'
    }
};
const mysql = require('mysql2/promise');

function createPool() {
    return mysql.createPool({
        host: 'localhost',
        user: 'server_database',
        password: 'Keerthanag@2003',
        database: 'blog_database',
        connectionLimit: 10,
    });
}

// Exporting the createPool function
module.exports = createPool;

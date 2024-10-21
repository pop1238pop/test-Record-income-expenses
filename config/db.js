const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ชื่อผู้ใช้ MySQL ของคุณ
    password: 'root', // รหัสผ่าน MySQL ของคุณ
    database: 'expense_tracker' // ชื่อฐานข้อมูล
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;

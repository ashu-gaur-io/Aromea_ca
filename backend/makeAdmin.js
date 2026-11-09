const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./aromea.db');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
    console.log("Please provide an email address. Example: node makeAdmin.js myemail@gmail.com");
    process.exit(1);
}

db.run(
    'UPDATE USERS SET role = ? WHERE email = ?',
    ['admin', emailToPromote],
    function(err) {
        if (err) {
            console.error('Error:', err.message);
        } else if (this.changes === 0) {
            console.log(`No user found with email: ${emailToPromote}`);
        } else {
            console.log(`SUCCESS! The user ${emailToPromote} is now an Admin!`);
        }
    }
);

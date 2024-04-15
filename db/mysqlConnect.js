import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();
export const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: "",
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err) {
        console.log(err, "555555");
    } else {
        console.log("MySql connected")
    }
});

import bcrypt from "bcrypt";
import {db} from "../db/mysqlConnect.js";
export const insertUser = async (req, res) => {
    const {name,email,password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = {
        name,
        email,
        "password": hash
    }
    db.query("INSERT INTO users SET ?", user, (err, result) => {
        if(err) {
            console.error(err, "error");
            res.status(500).send("Error inserting data into MySQL");
            return;
        }
        console.log("Data inserted successfully");
        res.status(201).redirect("/login");
    });
}

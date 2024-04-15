import {db} from "../db/mysqlConnect.js";

export function getUsers (done) {

    db.query("SELECT * FROM users WHERE 1", (err, users) => {
        if(err) {
            console.error('Error fetching users:', err);
            done(err, null);
            return;
        };

        if(users === undefined) {
            return;
        }
        done(null, users);

    })
}
import {db} from "../db/mysqlConnect.js";
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
import {getUsers} from "../db/users.js";

let allUsers;

export async function  getAllUsers () {
    await getUsers((err, users) => {
        if(err) {
            console.log("Error fetching users: ", err);
        } else {
            // console.log("USERS: ", users)
            allUsers = users;
        }
    });
}
passport.use(new passportLocal.Strategy({

    usernameField: "email"
}, (email, password, done) => {
    db.query("Select * FROM users WHERE email = ?", email, async (error, user) => {
        if(error) {
            console.error("Error fetching user: ", error);
            res.status(500).send("Error fetching user from MySql");
            return
        }
        if(user === undefined) {
            return done(null, null, {message: "incorrect email"})
        }
        if(await bcrypt.compare(password, user[0].password)) {
            // console.log(allUsers, "all")
            return done(null, user[0])
        }

        done(null, null, {message: "incorrect password"})
    })

}))

passport.serializeUser((user, done) => {
    console.log(user, "user22222")
    done(null, user.id)
});
passport.deserializeUser((id, done) => {
    try {
        // console.log('Deserializing user ID:', id);
        console.log(allUsers, "des usesr");
        done(null, allUsers.find(user => user.id === id))
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err);
    }
})

export const postLogin  = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
});

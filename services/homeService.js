import {getUsers} from "../db/users.js";
let allUsers;

export async function getAllUsers () {
    await getUsers((err, users) => {
        if(err) {
            console.log("Error fetching users: ", err);
        } else {
            // console.log("USERS: ", users)
            allUsers = users;
        }
    });
}


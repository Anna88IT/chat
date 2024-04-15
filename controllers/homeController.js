import path from "path";
import {getAllUsers} from "../services/homeService.js";

const home = path.resolve("./public/index.html");

export const getHome = async (req, res) => {

   await getAllUsers();
    console.log("7777777777")
    if(req.isAuthenticated()) {
        console.log("authenticated5555555")
    } else {
        console.log("not authenticated")
    }
    res.sendFile(home);
}


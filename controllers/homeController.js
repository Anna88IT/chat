import path from "path";
import {getAllUsers} from "../services/homeService.js";

const home = path.resolve("./public/index.html");

export const getHome = async (req, res) => {
   await getAllUsers();
    res.sendFile(home);
}


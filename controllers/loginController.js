import path from "path";
import {getAllUsers} from "../services/loginService.js";

const login = path.resolve("./public/login.html");

export const getLogin = async (req, res) => {
   await getAllUsers();
    res.sendFile(login);

}


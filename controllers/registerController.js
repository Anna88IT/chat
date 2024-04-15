import path from "path";
import {insertUser} from "../services/registerService.js";

const filePath = path.resolve("./public/register.html")

export const getRegister = async (req, res) => {
    res.sendFile(filePath)
}

export const postRegister = async (req, res) => {
   await insertUser(req, res);
}
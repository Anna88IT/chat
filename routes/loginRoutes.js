import express from "express";
import {getLogin} from "../controllers/loginController.js"
import {postLogin} from "../services/loginService.js";
import {checknotAuthentication} from "../middleware/checkAutho.js"

const rout = express.Router();

rout.get("/", checknotAuthentication, getLogin);
rout.post("/", postLogin);

export default rout
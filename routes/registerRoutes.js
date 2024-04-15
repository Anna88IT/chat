import express from "express";
import {getRegister} from "../controllers/registerController.js";
import {postRegister} from "../controllers/registerController.js";
import {checknotAuthentication} from "../middleware/checkAutho.js"

const route = express.Router();

route.get("/", checknotAuthentication, getRegister);
route.post("/", postRegister);

export default route;
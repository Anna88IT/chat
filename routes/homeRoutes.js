import express from "express";
import {getHome} from "../controllers/homeController.js";
import {checkAuthentication} from "../middleware/checkAutho.js"
const rout = express.Router();

rout.get("", checkAuthentication, getHome);

export default rout;
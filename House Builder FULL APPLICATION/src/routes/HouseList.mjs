import express from "express";
import { HouseListControler } from "../public/controllers/HouseListController.mjs";

const HouseRoutes = express.Router();

HouseRoutes.get("/list", HouseListControler.viewHouseList);

export default HouseRoutes;
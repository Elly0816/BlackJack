import { Router } from "express";
import { getHomeRouteHandler } from "../controllers/homeRoute";

const homeRoutes = Router();


homeRoutes.get('/', getHomeRouteHandler);


export default homeRoutes;
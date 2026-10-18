import { Router } from "express";
import { createInitialWorld } from "../engine/initialWorld.js";
import { Simulation } from "../engine/simulation.js";

const router = Router();

const simulation = new Simulation(createInitialWorld());

router.get("/", (_req, res) => {
    res.json(simulation.getWorld());
});

router.get("/history", (_req, res) => {
    res.json(simulation.getHistory());
});

router.post("/tick", (_req, res) => {
    const result = simulation.advanceMiraTick();

    res.json(result);
});

export default router;

import { apiClient } from "./index";
import type {WorldState} from "../types/world.ts";
import type {DecisionRecord} from "../types/decision.ts";

export async function getWorld(): Promise<WorldState> {
    const response = await apiClient.get<WorldState>("/world");
    return response.data;
}

export type TickResult = {
    world: WorldState;
    decision: DecisionRecord | null;
};

export async function tickWorld(): Promise<TickResult> {
    const response = await apiClient.post<TickResult>("/world/tick");

    return response.data;
}

export async function getWorldHistory(): Promise<DecisionRecord[]> {
    const response = await apiClient.get<DecisionRecord[]>("/world/history");
    return response.data;
}
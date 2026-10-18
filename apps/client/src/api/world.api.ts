import { apiClient } from "./index";
import type {WorldState} from "../types/world.ts";

export async function getWorld(): Promise<WorldState> {
    const response = await apiClient.get<WorldState>("/world");
    return response.data;
}

export async function tickWorld(): Promise<WorldState> {
    const response = await apiClient.post<{ world: WorldState }>(
        "/world/tick",
    );

    return response.data.world;
}
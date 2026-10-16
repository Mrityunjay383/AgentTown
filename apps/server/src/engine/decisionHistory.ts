import type { DecisionRecord } from "../types/decision.js";

export class DecisionHistory {
    private records: DecisionRecord[] = [];

    add(record: DecisionRecord): void {
        this.records.push(record);
    }

    getAll(): DecisionRecord[] {
        return [...this.records];
    }

    getByAgent(agentId: string): DecisionRecord[] {
        return this.records.filter(
            (record) => record.agentId === agentId,
        );
    }

    clear(): void {
        this.records = [];
    }
}
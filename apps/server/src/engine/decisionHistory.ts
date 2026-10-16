import type { DecisionRecord } from "../types/decision.js";

export class DecisionHistory {
    private records: DecisionRecord[] = [];

    add(record: DecisionRecord): void {
        this.records.push(structuredClone(record));
    }

    getAll(): DecisionRecord[] {
        return structuredClone(this.records);
    }

    getByAgent(agentId: string): DecisionRecord[] {
        return structuredClone(
            this.records.filter((record) => record.agentId === agentId),
        );
    }

    clear(): void {
        this.records = [];
    }
}
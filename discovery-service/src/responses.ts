export interface GroupSummary {
    group: string;
    instances: number;
    createdAt: number;
    lastUpdatedAt: number;
}

export type Summary = GroupSummary[];

export interface Registration {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: any;
}
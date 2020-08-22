import * as mongoose from "mongoose";

export interface GroupModel extends mongoose.Document {
    id: string;
    groupId: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: any
}

export const groupSchema = {
    groupId: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        required: true
    },
    meta: {
        type: Object,
        required: false
    }
}

export const Group = mongoose.model<GroupModel>('groups', new mongoose.Schema(groupSchema));
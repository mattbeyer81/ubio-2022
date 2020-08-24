import * as mongoose from "mongoose";

export interface HeartModel extends mongoose.Document {
    id: string;
    applicationId: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: any
}

export const heartSchema = {
    applicationId: {
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

export const Heart = mongoose.model<HeartModel>('groups', new mongoose.Schema(heartSchema, { versionKey: false }));
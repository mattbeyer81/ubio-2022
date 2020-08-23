import * as mongoose from "mongoose";

export interface ApplicationModel extends mongoose.Document {
    id: string;
    applicationId: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: any
}

export const applicationSchema = {
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

export const Application = mongoose.model<ApplicationModel>('groups', new mongoose.Schema(applicationSchema));
import { Schema, model } from "mongoose";

export interface IHeart {
    id?: string;
    applicationId: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta: any
}

const heartSchema = new Schema<IHeart>({
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
  }, { versionKey: false });

export const Heart = model<IHeart>('groups', heartSchema);
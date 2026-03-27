import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { List } from '~~/types/db/list';


export const MemberSchema = new Schema({
    user: {
        required: true,
        type: Schema.Types.ObjectId || String,
        ref: 'users'
    },
    host: {
        type: String,
        required: true
    },
    permissions: {
        required: true,
        type: Number,
        min: 0,
        default: 0
    }
}, {
    _id: false,
    timestamps: {
        updatedAt: false,
        createdAt: 'addedAt'
    }
});

export const ListSchema = defineMongooseModel<List>({
    name: 'lists',
    schema: {
        user: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        name: {
            type: String,
            minlength: 1,
        },
        private: {
            type: Boolean,
            default: false,
        },
        members: {
            type: [MemberSchema],
            default: () => []
        }
    },
    options: {
        timestamps: true,
    }
});

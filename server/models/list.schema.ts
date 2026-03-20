import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { List } from '~~/types/db/list';

export const ListSchema = defineMongooseModel<List>({
    name: 'lists',
    schema: {
        user: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        name: {
            type: String,
            minlength: 1,
        },
        private: {
            type: Boolean,
            default: false,
        },
    },
    options: {
        timestamps: true,
    },
});

import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { type Log, LogName } from '~~/types/db/log';


export const LogSchema = defineMongooseModel<Log>({
    name: 'logs',
    schema: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        name: {
            type: Number,
            minlength: 1,
            required: true
        },
        props: {
            type: Object
        }
    },
    options: {
        timestamps: true,
    }
});
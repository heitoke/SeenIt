import { defineMongooseModel } from '#nuxt/mongoose';
import mongoose, { Schema } from 'mongoose';

// * Types
import { type Log, LogCode } from '~~/types/db/log';


export const LogSchema = defineMongooseModel<Log>({
    name: 'logs',
    schema: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        code: {
            type: Schema.Types.Int32,
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
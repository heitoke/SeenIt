import { defineMongooseModel } from '#nuxt/mongoose';

// * Types
import type { User } from '~~/types/db/user';


export const UserSchema = defineMongooseModel<User>({
    name: 'users',
    schema: {
        username: {
            type: String,
            minlength: 1,
            unique: true
        },
        email: {
            type: String,
            minlength: 5,
            unique: true
        },
        password: {
            type: String,
            minlength: 3,
        }
    },
    options: {
        timestamps: true
    },
    hooks(schema) {
        schema.pre('save', function(next) {
            if (this.username && this.password) next();

            throw createError({
                statusCode: 500,
                statusMessage: 'validation failed'
            });
        });
    }
});
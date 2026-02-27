import { defineMongooseModel } from '#nuxt/mongoose';


export const UserSchema = defineMongooseModel({
    name: 'users',
    schema: {
        username: {
            type: 'string',
            minlength: 1,
            unique: true
        },
        email: {
            type: 'string',
            minlength: 5,
            unique: true
        },
        password: {
            type: 'string',
            minlength: 3,
        }
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
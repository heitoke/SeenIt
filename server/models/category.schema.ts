import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { Category } from '~~/types/db/category';


export const CategorySchema = defineMongooseModel<Category>({
    name: 'categories',
    schema: {
        list: {
            type: Schema.Types.ObjectId,
            ref: 'lists',
            required: true
        },
        name: {
            type: String,
            minlength: 1
        },
        private: {
            type: Boolean,
            default: false
        },
    },
    options: {
        timestamps: true,
    },
});

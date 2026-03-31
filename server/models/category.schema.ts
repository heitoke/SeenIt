import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { type Category, CategoryType } from '~~/types/db/category';


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
        type: {
            type: Number,
            enum: Object.keys(CategoryType).map(Number).filter(t => !isNaN(t)),
            default: CategoryType.None,
            required: true
        }
    },
    options: {
        timestamps: true,
    },
});

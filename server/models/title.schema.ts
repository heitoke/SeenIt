import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

// * Types
import { Title } from '~~/types/db/title';


export const TitleSchema = defineMongooseModel<Title>({
    name: 'titles',
    schema: {
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
            required: true
        },
        tmdbTitle: {
            type: Schema.Types.ObjectId,
            ref: 'tmdb-titles',
            required: true
        },
        private: {
            type: Boolean,
            default: false
        },
        liked: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 0
        }
    },
    options: {
        timestamps: true
    },
});
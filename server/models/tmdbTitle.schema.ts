import { defineMongooseModel } from '#nuxt/mongoose';

// * Types
import { TMDBTitle } from '~~/types/db/tmdbTitle';


export const TMDBTitleSchema = defineMongooseModel<TMDBTitle>({
    name: 'tmdb-titles',
    schema: {
        tmdbId: {
            type: Number,
            required: true
        },
        mediaType: {
            type: Number,
            required: true
        },
        data: {
            type: Object
        }
    },
    options: {
        timestamps: true,
    }
});

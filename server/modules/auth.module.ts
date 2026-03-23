import { defineNuxtModule, logger } from '@nuxt/kit';
import { hash } from 'ohash';
import { defu } from 'defu';

export interface ModuleOptions {
    secret: string;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'seen-it-auth',
        configKey: 'seenItAuth'
    },
    defaults: {
        secret: process.env.SECRET as string
    },
    async setup(options, nuxt) {
        const config = nuxt.options.runtimeConfig;

        const secret = options.secret || hash(`${Date.now()}${Math.random()}`).slice(0, 32);

        if (!options.secret) {}

        config.auth = defu(config.auth || {}, {
            mongo: {
                secret
            }
        });

        logger.info('SeenIt Auth is injected!');
    }
});
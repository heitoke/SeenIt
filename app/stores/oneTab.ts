import { EventEmitter } from 'events';


class OnaTabEmitter extends EventEmitter {}

export const useOneTabStore = defineStore('one-tab', () => {
    const emitter = new OnaTabEmitter();

    return {
        emitter
    };
});
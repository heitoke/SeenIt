import fs from 'node:fs';
import { resolve } from 'node:path';

import {
    codes,
    languages,
    type CodeName
} from '../types/locale';

import templateLocaleEnglish from '../i18n/locales/en.json';


const { API_TRANSLATE_URL = 'https://translate.heito.xyz' } = process.env;

async function fetchLanguage(code: CodeName) {
    try {
        const res = await fetch(`${API_TRANSLATE_URL}/text`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lang: languages[code].name,
                data: templateLocaleEnglish
            }),
            method: 'POST',
            mode: 'cors'
        });

        if (!res.ok) return null;

        const { result } = await res.json();

        if (!result) return null;

        return result;
    } catch (error) {
        console.log(error);
        
        return null;
    }
}


for (const code of codes) {
    if (code === 'en') continue;
    
    console.log(`Downloading a language pack: ${languages[code].name}`);
    
    const result = await fetchLanguage(code);

    console.log(`Installing the language pack: ${languages[code].name}`);
    
    fs.writeFileSync(resolve(__dirname, `../i18n/locales/${code}.json`), JSON.stringify(result));
}
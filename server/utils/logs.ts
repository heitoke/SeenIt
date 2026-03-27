import { Types } from 'mongoose';

// * Types
import { LogCode } from "~~/types/db/log";


export const LogObjectId = Types.ObjectId;

export async function createLog(userId: string, code: LogCode, props: object = {}) {
    const newLog = await new LogSchema({
        user: userId,
        code,
        props
    });

    await newLog.save();

    return await newLog.toObject();
}

export async function createLogs<T = any>(userId: string, code: LogCode, items: Array<T>, callbackProps: (item: T, index: number, arr: Array<T>) => object | undefined | null) {
    for (let i = 0; i < items.length; i++) {
        const result = callbackProps(items[i]!, i, items);

        if (!result) continue;

        createLog(userId, code, result);
    
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}
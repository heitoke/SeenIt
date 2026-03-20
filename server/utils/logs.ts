import { Types } from 'mongoose';

// * Types
import { LogName } from "~~/types/db/log";


export const LogObjectId = Types.ObjectId;

export async function createLog(userId: string, name: LogName, props: object = {}) {
    const newLog = await new LogSchema({
        user: userId,
        name,
        props
    });

    await newLog.save();

    return await newLog.toObject();
}

export async function createLogs<T = any>(userId: string, name: LogName, items: Array<T>, callbackProps: (item: T, index: number, arr: Array<T>) => object | undefined | null) {
    for (let i = 0; i < items.length; i++) {
        const result = callbackProps(items[i]!, i, items);

        if (!result) continue;

        createLog(userId, name, result);
    
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}
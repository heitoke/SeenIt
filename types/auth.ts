import type { JWTPayload } from 'jose';

export interface AuthPayload extends JWTPayload {
    id?: string;
    createdAt?: number;
}
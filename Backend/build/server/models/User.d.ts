import mongoose from 'mongoose';
import { z } from 'zod';
export declare const userSchemaZod: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "staff"]>>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    role: "admin" | "staff";
}, {
    username: string;
    password: string;
    role?: "admin" | "staff" | undefined;
}>;
export type UserInput = z.infer<typeof userSchemaZod>;
export declare const User: mongoose.Model<{
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    username: string;
    password: string;
    role: "admin" | "staff";
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=User.d.ts.map
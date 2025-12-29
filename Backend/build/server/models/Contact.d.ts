import mongoose from 'mongoose';
import { z } from 'zod';
export declare const contactSchemaZod: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    message: string;
    email: string;
    phone?: string | undefined;
}, {
    name: string;
    message: string;
    email: string;
    phone?: string | undefined;
}>;
export type ContactInput = z.infer<typeof contactSchemaZod>;
export declare const Contact: mongoose.Model<{
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    message: string;
    email: string;
    status: "new" | "read" | "replied";
    phone?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Contact.d.ts.map
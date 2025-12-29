import mongoose from 'mongoose';
import { z } from 'zod';
export declare const productSchemaZod: z.ZodObject<{
    name: z.ZodString;
    nameUrdu: z.ZodString;
    descriptionEn: z.ZodDefault<z.ZodString>;
    descriptionUrdu: z.ZodDefault<z.ZodString>;
    price: z.ZodString;
    category: z.ZodEnum<["wheat", "flour"]>;
    unit: z.ZodDefault<z.ZodEnum<["kg", "maan", "lb"]>>;
    image: z.ZodDefault<z.ZodString>;
    stock: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
}, {
    name: string;
    nameUrdu: string;
    price: string;
    category: "wheat" | "flour";
    descriptionEn?: string | undefined;
    descriptionUrdu?: string | undefined;
    unit?: "kg" | "maan" | "lb" | undefined;
    image?: string | undefined;
    stock?: number | undefined;
}>;
export type ProductInput = z.infer<typeof productSchemaZod>;
export declare const Product: mongoose.Model<{
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    nameUrdu: string;
    descriptionEn: string;
    descriptionUrdu: string;
    price: string;
    category: "wheat" | "flour";
    unit: "kg" | "maan" | "lb";
    image: string;
    stock: number;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Product.d.ts.map
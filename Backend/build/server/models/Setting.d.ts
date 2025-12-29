import mongoose from 'mongoose';
export declare const Setting: mongoose.Model<{
    [x: string]: NativeDate;
    key: string;
    value: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    [x: string]: NativeDate;
    key: string;
    value: string;
}, {}, {
    timestamps: {
        createdAt: false;
        updatedAt: string;
    };
}> & {
    [x: string]: NativeDate;
    key: string;
    value: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: false;
        updatedAt: string;
    };
}, {
    [x: string]: NativeDate;
    key: string;
    value: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    [x: string]: NativeDate;
    key: string;
    value: string;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: {
        createdAt: false;
        updatedAt: string;
    };
}>> & mongoose.FlatRecord<{
    [x: string]: NativeDate;
    key: string;
    value: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const defaultSettings: {
    key: string;
    value: string;
}[];
//# sourceMappingURL=Setting.d.ts.map
import { z } from 'zod';
export declare const errorSchemas: {
    validation: z.ZodObject<{
        message: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        field?: string | undefined;
    }, {
        message: string;
        field?: string | undefined;
    }>;
    notFound: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    internal: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    unauthorized: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
};
export declare const api: {
    products: {
        list: {
            method: "GET";
            path: string;
            responses: {
                200: z.ZodArray<z.ZodType<{
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }>, "many">;
            };
        };
        get: {
            method: "GET";
            path: string;
            responses: {
                200: z.ZodType<{
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }>;
                404: z.ZodObject<{
                    message: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
        create: {
            method: "POST";
            path: string;
            input: z.ZodObject<Omit<{
                id: z.ZodOptional<z.ZodNumber>;
                name: z.ZodString;
                nameUrdu: z.ZodString;
                descriptionEn: z.ZodString;
                descriptionUrdu: z.ZodString;
                price: z.ZodString;
                category: z.ZodEnum<["wheat", "flour"]>;
                unit: z.ZodOptional<z.ZodEnum<["kg", "maan", "lb"]>>;
                image: z.ZodString;
                stock: z.ZodOptional<z.ZodNumber>;
                createdAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
                updatedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
            }, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
                name: string;
                nameUrdu: string;
                descriptionEn: string;
                descriptionUrdu: string;
                price: string;
                category: "wheat" | "flour";
                image: string;
                unit?: "kg" | "maan" | "lb" | undefined;
                stock?: number | undefined;
            }, {
                name: string;
                nameUrdu: string;
                descriptionEn: string;
                descriptionUrdu: string;
                price: string;
                category: "wheat" | "flour";
                image: string;
                unit?: "kg" | "maan" | "lb" | undefined;
                stock?: number | undefined;
            }>;
            responses: {
                201: z.ZodType<{
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }>;
                400: z.ZodObject<{
                    message: z.ZodString;
                    field: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                    field?: string | undefined;
                }, {
                    message: string;
                    field?: string | undefined;
                }>;
            };
        };
        update: {
            method: "PUT";
            path: string;
            input: z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                nameUrdu: z.ZodOptional<z.ZodString>;
                descriptionEn: z.ZodOptional<z.ZodString>;
                descriptionUrdu: z.ZodOptional<z.ZodString>;
                price: z.ZodOptional<z.ZodString>;
                category: z.ZodOptional<z.ZodEnum<["wheat", "flour"]>>;
                unit: z.ZodOptional<z.ZodOptional<z.ZodEnum<["kg", "maan", "lb"]>>>;
                image: z.ZodOptional<z.ZodString>;
                stock: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                nameUrdu?: string | undefined;
                descriptionEn?: string | undefined;
                descriptionUrdu?: string | undefined;
                price?: string | undefined;
                category?: "wheat" | "flour" | undefined;
                unit?: "kg" | "maan" | "lb" | undefined;
                image?: string | undefined;
                stock?: number | undefined;
            }, {
                name?: string | undefined;
                nameUrdu?: string | undefined;
                descriptionEn?: string | undefined;
                descriptionUrdu?: string | undefined;
                price?: string | undefined;
                category?: "wheat" | "flour" | undefined;
                unit?: "kg" | "maan" | "lb" | undefined;
                image?: string | undefined;
                stock?: number | undefined;
            }>;
            responses: {
                200: z.ZodType<{
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    nameUrdu: string;
                    descriptionEn: string;
                    descriptionUrdu: string;
                    price: string;
                    category: "wheat" | "flour";
                    unit: "kg" | "maan" | "lb";
                    image: string;
                    stock: number;
                    createdAt: Date | null;
                    updatedAt: Date | null;
                }>;
                400: z.ZodObject<{
                    message: z.ZodString;
                    field: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                    field?: string | undefined;
                }, {
                    message: string;
                    field?: string | undefined;
                }>;
                404: z.ZodObject<{
                    message: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
        delete: {
            method: "DELETE";
            path: string;
            responses: {
                204: z.ZodVoid;
                404: z.ZodObject<{
                    message: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
    };
    contacts: {
        create: {
            method: "POST";
            path: string;
            input: z.ZodObject<Omit<{
                id: z.ZodOptional<z.ZodNumber>;
                name: z.ZodString;
                email: z.ZodString;
                phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                message: z.ZodString;
                status: z.ZodOptional<z.ZodEnum<["new", "read", "replied"]>>;
                createdAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
            }, "id" | "createdAt" | "status">, "strip", z.ZodTypeAny, {
                name: string;
                message: string;
                email: string;
                phone?: string | null | undefined;
            }, {
                name: string;
                message: string;
                email: string;
                phone?: string | null | undefined;
            }>;
            responses: {
                201: z.ZodType<{
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }>;
                400: z.ZodObject<{
                    message: z.ZodString;
                    field: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                    field?: string | undefined;
                }, {
                    message: string;
                    field?: string | undefined;
                }>;
            };
        };
        list: {
            method: "GET";
            path: string;
            responses: {
                200: z.ZodArray<z.ZodType<{
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }>, "many">;
            };
        };
        updateStatus: {
            method: "PATCH";
            path: string;
            input: z.ZodObject<{
                status: z.ZodEnum<["new", "read", "replied"]>;
            }, "strip", z.ZodTypeAny, {
                status: "new" | "read" | "replied";
            }, {
                status: "new" | "read" | "replied";
            }>;
            responses: {
                200: z.ZodType<{
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }, z.ZodTypeDef, {
                    id: number;
                    name: string;
                    createdAt: Date | null;
                    message: string;
                    email: string;
                    phone: string | null;
                    status: "new" | "read" | "replied";
                }>;
                404: z.ZodObject<{
                    message: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
    };
    auth: {
        login: {
            method: "POST";
            path: string;
            input: z.ZodObject<{
                username: z.ZodString;
                password: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                username: string;
                password: string;
            }, {
                username: string;
                password: string;
            }>;
            responses: {
                200: z.ZodObject<{
                    success: z.ZodBoolean;
                    user: z.ZodObject<{
                        id: z.ZodNumber;
                        username: z.ZodString;
                        role: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        id: number;
                        username: string;
                        role: string;
                    }, {
                        id: number;
                        username: string;
                        role: string;
                    }>;
                }, "strip", z.ZodTypeAny, {
                    user: {
                        id: number;
                        username: string;
                        role: string;
                    };
                    success: boolean;
                }, {
                    user: {
                        id: number;
                        username: string;
                        role: string;
                    };
                    success: boolean;
                }>;
                401: z.ZodObject<{
                    message: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
    };
};
export declare function buildUrl(path: string, params?: Record<string, string | number>): string;
//# sourceMappingURL=routes.d.ts.map
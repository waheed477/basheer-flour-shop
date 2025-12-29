"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.errorSchemas = void 0;
exports.buildUrl = buildUrl;
const zod_1 = require("zod");
const schema_1 = require("./schema");
exports.errorSchemas = {
    validation: zod_1.z.object({
        message: zod_1.z.string(),
        field: zod_1.z.string().optional(),
    }),
    notFound: zod_1.z.object({
        message: zod_1.z.string(),
    }),
    internal: zod_1.z.object({
        message: zod_1.z.string(),
    }),
    unauthorized: zod_1.z.object({
        message: zod_1.z.string(),
    }),
};
exports.api = {
    products: {
        list: {
            method: 'GET',
            path: '/api/products',
            responses: {
                200: zod_1.z.array(zod_1.z.custom()),
            },
        },
        get: {
            method: 'GET',
            path: '/api/products/:id',
            responses: {
                200: zod_1.z.custom(),
                404: exports.errorSchemas.notFound,
            },
        },
        create: {
            method: 'POST',
            path: '/api/products',
            input: schema_1.insertProductSchema,
            responses: {
                201: zod_1.z.custom(),
                400: exports.errorSchemas.validation,
            },
        },
        update: {
            method: 'PUT',
            path: '/api/products/:id',
            input: schema_1.insertProductSchema.partial(),
            responses: {
                200: zod_1.z.custom(),
                400: exports.errorSchemas.validation,
                404: exports.errorSchemas.notFound,
            },
        },
        delete: {
            method: 'DELETE',
            path: '/api/products/:id',
            responses: {
                204: zod_1.z.void(),
                404: exports.errorSchemas.notFound,
            },
        },
    },
    contacts: {
        create: {
            method: 'POST',
            path: '/api/contacts',
            input: schema_1.insertContactSchema,
            responses: {
                201: zod_1.z.custom(),
                400: exports.errorSchemas.validation,
            },
        },
        list: {
            method: 'GET',
            path: '/api/contacts',
            responses: {
                200: zod_1.z.array(zod_1.z.custom()),
            },
        },
        updateStatus: {
            method: 'PATCH',
            path: '/api/contacts/:id/status',
            input: zod_1.z.object({ status: zod_1.z.enum(["new", "read", "replied"]) }),
            responses: {
                200: zod_1.z.custom(),
                404: exports.errorSchemas.notFound,
            },
        },
    },
    auth: {
        login: {
            method: 'POST',
            path: '/api/auth/login',
            input: zod_1.z.object({ username: zod_1.z.string(), password: zod_1.z.string() }),
            responses: {
                200: zod_1.z.object({ success: zod_1.z.boolean(), user: zod_1.z.object({ id: zod_1.z.number(), username: zod_1.z.string(), role: zod_1.z.string() }) }),
                401: exports.errorSchemas.unauthorized,
            },
        },
    },
};
function buildUrl(path, params) {
    let url = path;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (url.includes(`:${key}`)) {
                url = url.replace(`:${key}`, String(value));
            }
        });
    }
    return url;
}
//# sourceMappingURL=routes.js.map
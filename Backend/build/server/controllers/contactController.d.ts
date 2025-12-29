import { Request, Response } from "express";
export declare const contactController: {
    getAll(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=contactController.d.ts.map
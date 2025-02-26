import { EHttpStatus } from '../constants';
export declare class Result<T> {
    code: number;
    status: EHttpStatus;
    message: any;
    error?: any;
    result?: T;
}
export declare class ErrorResult {
    code: number;
    message: string;
    data?: string;
    stack?: string;
    path?: string;
    timestamp?: string;
}
//# sourceMappingURL=result.dto.d.ts.map
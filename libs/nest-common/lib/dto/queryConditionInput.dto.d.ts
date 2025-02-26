import { OrderByCondition } from 'typeorm';
export declare class QueryConditionInput {
    select?: string[];
    conditionLambda: string;
    conditionValue: object;
    orderBy?: OrderByCondition;
    tableName?: string;
    groupBy?: string;
    havingLambda?: string;
    havingValue?: object;
    skip?: number;
    take?: number;
}
//# sourceMappingURL=queryConditionInput.dto.d.ts.map
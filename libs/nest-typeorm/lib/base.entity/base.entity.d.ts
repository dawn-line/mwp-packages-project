export declare abstract class BaseEntity {
    createdAt: Date;
    creatorId: string;
    creatorName: string;
    modifierAt: Date;
    modifierId: string;
    modifierName: string;
    isRemoved: boolean;
    version: number;
    updateVersionTimestamp(): void;
}
//# sourceMappingURL=base.entity.d.ts.map
export interface TGT {
  id: string;
  userId: bigint;
  createdAt: Date;
  expiresAt: Date;
}

export interface ST {
  id: string;
  tgtId: string;
  service: string;
  userId: bigint;
  createdAt: Date;
  expiresAt: Date;
  isFromRenew: boolean;
  used: boolean;
}

export interface PT {
  id: string;
  tgtId: string;
  service: string;
  userId: bigint;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  proxyChain: string[]; // 代理链
}

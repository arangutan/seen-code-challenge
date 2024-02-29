export interface ConsolidatedTransaction {
  createdAt: string;
  updatedAt: string;
  transactionId: number;
  authorizationCode: string;
  status: string;
  description: string;
  transactionType: string;
  metadata: { [key: string]: any };
  timeline: Timeline[];
}

export interface Timeline {
  createdAt: string;
  status: string;
  amount: number;
}

export interface RelatedCustomer {
  relatedCustomerId: number;
  relationType: string;
}

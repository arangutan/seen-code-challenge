import { Transaction } from 'src/providers/http/dto';
import {
  findRelatedCustomers,
  findCustomersWithSharedDevices,
  findP2PRelationships,
} from './getRelatedCustomerByTrxType';

const mockTransactions: Transaction[] = [
  {
    transactionId: 13,
    authorizationCode: 'F10006',
    transactionDate: '2022-09-06T05:31:32+00:00',
    customerId: 3,
    transactionType: 'WIRE_INCOMING',
    transactionStatus: 'SETTLED',
    description: 'Deposit from Coinbase',
    amount: 10000,
    metadata: {},
  },
  {
    transactionId: 14,
    authorizationCode: 'F20006',
    transactionDate: '2022-09-06T05:31:32+00:00',
    customerId: 3,
    transactionType: 'FEE',
    transactionStatus: 'SETTLED',
    description: 'Fee for Incoming Wire',
    amount: 10000,
    metadata: {
      relatedTransactionId: 13,
    },
  },
  {
    transactionId: 15,
    authorizationCode: 'F10007',
    transactionDate: '2022-09-06T11:05:00+00:00',
    customerId: 3,
    transactionType: 'P2P_SEND',
    transactionStatus: 'SETTLED',
    description: 'Transfer to Adam',
    amount: -10000,
    metadata: {
      relatedTransactionId: 16,
      deviceId: 'F210200',
    },
  },
  {
    transactionId: 16,
    authorizationCode: 'F10007',
    transactionDate: '2022-09-06T11:05:00+00:00',
    customerId: 4,
    transactionType: 'P2P_RECEIVE',
    transactionStatus: 'SETTLED',
    description: 'Transfer from Frederik',
    amount: 10000,
    metadata: {
      relatedTransactionId: 15,
    },
  },
  {
    transactionId: 17,
    authorizationCode: 'F10008',
    transactionDate: '2022-09-06T13:05:00+00:00',
    customerId: 4,
    transactionType: 'P2P_SEND',
    transactionStatus: 'SETTLED',
    description: 'Transfer to Weoy',
    amount: -10000,
    metadata: {
      relatedTransactionId: 18,
      deviceId: 'F210200',
    },
  },
  {
    transactionId: 18,
    authorizationCode: 'F10008',
    transactionDate: '2022-09-06T13:05:00+00:00',
    customerId: 5,
    transactionType: 'P2P_RECEIVE',
    transactionStatus: 'SETTLED',
    description: 'Transfer from Adam',
    amount: 10000,
    metadata: {
      relatedTransactionId: 17,
    },
  },
  {
    transactionId: 19,
    authorizationCode: 'F10009',
    transactionDate: '2022-09-07T05:31:32+00:00',
    customerId: 6,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'PENDING',
    description: 'Cash load from Venmo',
    amount: 3000,
    metadata: {},
  },
  {
    transactionId: 20,
    authorizationCode: 'F10009',
    transactionDate: '2022-09-08T06:45:22+00:00',
    customerId: 6,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'SETTLED',
    description: 'Cash load from Venmo',
    amount: 3000,
    metadata: {
      relatedTransactionId: 19,
    },
  },
  {
    transactionId: 21,
    authorizationCode: 'F10010',
    transactionDate: '2022-09-09T11:05:00+00:00',
    customerId: 6,
    transactionType: 'P2P_SEND',
    transactionStatus: 'SETTLED',
    description: 'Transfer to Joseph',
    amount: -3000,
    metadata: {
      relatedTransactionId: 22,
      deviceId: 'F210200',
    },
  },
  {
    transactionId: 22,
    authorizationCode: 'F10010',
    transactionDate: '2022-09-09T11:05:00+00:00',
    customerId: 7,
    transactionType: 'P2P_RECEIVE',
    transactionStatus: 'SETTLED',
    description: 'Transfer from Luis',
    amount: 3000,
    metadata: {
      relatedTransactionId: 21,
    },
  },
  {
    transactionId: 23,
    authorizationCode: 'F10011',
    transactionDate: '2022-09-10T13:05:00+00:00',
    customerId: 7,
    transactionType: 'P2P_SEND',
    transactionStatus: 'SETTLED',
    description: 'Transfer to Weoy',
    amount: -3000,
    metadata: {
      relatedTransactionId: 24,
      deviceId: 'F210200',
    },
  },
];

describe('Test Get Related Custer By trx Types Functions', () => {
  describe('findCustomersWithSharedDevices', () => {
    it('should find customers related by device usage', () => {
      const customerId = 3;
      const relatedCustomers = findCustomersWithSharedDevices(
        mockTransactions,
        customerId,
      );
      expect(relatedCustomers).toBeInstanceOf(Array);
      expect(
        relatedCustomers.some((rc) => rc.relationType === 'DEVICE'),
      ).toBeTruthy();
    });
  });

  describe('findP2PRelationships', () => {
    it('should find customers related by P2P transactions', () => {
      const customerId = 3;
      const relatedCustomers = findP2PRelationships(
        mockTransactions,
        customerId,
      );
      expect(relatedCustomers).toBeInstanceOf(Array);
      expect(
        relatedCustomers.some(
          (rc) =>
            rc.relationType === 'P2P_SEND' || rc.relationType === 'P2P_RECEIVE',
        ),
      ).toBeTruthy();
    });
  });

  describe('findRelatedCustomers', () => {
    it('should correctly integrate device and P2P relationships', () => {
      const customerId = 3;
      const results = findRelatedCustomers(mockTransactions, customerId);
      expect(results.relatedCustomers).toBeInstanceOf(Array);
      expect(
        results.relatedCustomers.some((rc) => rc.relationType === 'DEVICE'),
      ).toBeTruthy();
      expect(
        results.relatedCustomers.some(
          (rc) =>
            rc.relationType === 'P2P_SEND' || rc.relationType === 'P2P_RECEIVE',
        ),
      ).toBeTruthy();
    });

    it('should not contain duplicate entries', () => {
      const customerId = 3;
      const results = findRelatedCustomers(mockTransactions, customerId);
      const ids = results.relatedCustomers.map((rc) => rc.relatedCustomerId);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });
});

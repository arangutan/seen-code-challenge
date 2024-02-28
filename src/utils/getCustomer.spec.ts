import { Transaction } from 'src/providers/http/dto';
import { consolidatedTrx } from './getCustomerTrx';

const transactions: Transaction[] = [
  {
    transactionId: 1,
    authorizationCode: 'F10000',
    transactionDate: '2022-09-01T11:46:42+00:00',
    customerId: 1,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'PENDING',
    description: 'Deposit from Citibank',
    amount: 5000,
    metadata: {},
  },
  {
    transactionId: 2,
    authorizationCode: 'F10000',
    transactionDate: '2022-09-03T15:41:42+00:00',
    customerId: 1,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'SETTLED',
    description: 'Deposit from Citibank',
    amount: 5000,
    metadata: {
      relatedTransactionId: 1,
    },
  },
  {
    transactionId: 3,
    authorizationCode: 'F10001',
    transactionDate: '2022-09-05T11:36:42+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'PENDING',
    description: 'Amazon',
    amount: -143.21,
    metadata: {},
  },
  {
    transactionId: 4,
    authorizationCode: 'F10001',
    transactionDate: '2022-09-06T15:41:42+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'SETTLED',
    description: 'Amazon',
    amount: -143.21,
    metadata: {
      relatedTransactionId: 3,
    },
  },
  {
    transactionId: 5,
    authorizationCode: 'F10002',
    transactionDate: '2022-09-07T08:32:00+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'PENDING',
    description: 'Walmart',
    amount: -89.5,
    metadata: {},
  },
  {
    transactionId: 6,
    authorizationCode: 'F10002',
    transactionDate: '2022-09-08T10:00:30+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'SETTLED',
    description: 'Walmart',
    amount: -90.99,
    metadata: {
      relatedTransactionId: 5,
    },
  },
  {
    transactionId: 7,
    authorizationCode: 'F10003',
    transactionDate: '2022-09-08T10:00:30+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'SETTLED',
    description: 'Steam',
    amount: -50.21,
    metadata: {},
  },
  {
    transactionId: 8,
    authorizationCode: 'F10001',
    transactionDate: '2022-09-10T15:41:42+00:00',
    customerId: 1,
    transactionType: 'POS',
    transactionStatus: 'RETURNED',
    description: 'Amazon',
    amount: 143.21,
    metadata: {
      relatedTransactionId: 4,
    },
  },
  {
    transactionId: 9,
    authorizationCode: 'F10004',
    transactionDate: '2022-09-02T00:35:00+00:00',
    customerId: 2,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'PENDING',
    description: 'Deposit from Chime',
    amount: 3000,
    metadata: {},
  },
  {
    transactionId: 10,
    authorizationCode: 'F10004',
    transactionDate: '2022-09-04T06:00:00+00:00',
    customerId: 2,
    transactionType: 'ACH_INCOMING',
    transactionStatus: 'SETTLED',
    description: 'Deposit from Chime',
    amount: 3000,
    metadata: {
      relatedTransactionId: 9,
    },
  },
  {
    transactionId: 11,
    authorizationCode: 'F10005',
    transactionDate: '2022-09-04T06:30:00+00:00',
    customerId: 2,
    transactionType: 'WIRE_OUTGOING',
    transactionStatus: 'SETTLED',
    description: 'Transfer to Citibank',
    amount: -2995,
    metadata: {
      deviceId: 'F111000',
    },
  },
  {
    transactionId: 12,
    authorizationCode: 'F20005',
    transactionDate: '2022-09-04T06:30:00+00:00',
    customerId: 2,
    transactionType: 'FEE',
    transactionStatus: 'SETTLED',
    description: 'Fee for Outgoing Wire',
    amount: -5,
    metadata: {
      relatedTransactionId: 11,
    },
  },
];

describe('Test cases for consolidatedTrx', () => {
  it('should consolidate transactions by customerId', () => {
    const customerId = 1; // Assuming this customerId is present in the transactions mock
    const result = consolidatedTrx(transactions, customerId);
    expect(result.transactions).toBeInstanceOf(Array);
    // More detailed checks can be added here
  });

  it('should correctly handle transaction lifecycle states', () => {
    const customerId = 1;
    const result = consolidatedTrx(transactions, customerId);
    result.transactions.forEach((trx) => {
      expect(trx.status).not.toBe('PENDING');
      trx.timeline.forEach((tl) => {
        expect(tl.status).toMatch(/PROCESSING|SETTLED|RETURNED/);
      });
    });
  });

  it('should correctly build the transaction timeline', () => {
    const customerId = 1;
    const result = consolidatedTrx(transactions, customerId);
    result.transactions.forEach((trx) => {
      expect(trx.timeline.length).toBeGreaterThan(0);
      // Ensure the timeline is in chronological order
      for (let i = 1; i < trx.timeline.length; i++) {
        const prevDate = new Date(trx.timeline[i - 1].createdAt);
        const currentDate = new Date(trx.timeline[i].createdAt);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(
          prevDate.getTime(),
        );
      }
    });
  });

  it('should return an empty array if the customer has no transactions', () => {
    const customerId = 999; // Assuming this customerId is not present in the transactions mock
    const result = consolidatedTrx(transactions, customerId);
    expect(result.transactions).toEqual([]);
  });
});

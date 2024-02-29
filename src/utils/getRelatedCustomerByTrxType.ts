import { Transaction } from 'src/providers/http/dto';
import { RelatedCustomer } from 'src/types';

const RELATION_TYPE = {
  P2P_SEND: 'P2P_SEND',
  P2P_RECEIVE: 'P2P_RECEIVE',
  DEVICE: 'DEVICE',
};

export function findCustomersWithSharedDevices(
  transactions: Transaction[],
  customerId: number,
): RelatedCustomer[] {
  const devicesUsed = new Set(
    transactions
      .filter((tx) => tx.customerId === customerId && tx.metadata.deviceId)
      .map((tx) => tx.metadata.deviceId),
  );
  const customersWithSharedDevices = transactions
    .filter(
      (tx) =>
        devicesUsed.has(tx.metadata.deviceId) && tx.customerId !== customerId,
    )
    .map((tx) => ({
      relatedCustomerId: tx.customerId,
      relationType: RELATION_TYPE.DEVICE,
    }));

  return customersWithSharedDevices;
}

export function findP2PRelationships(
  transactions: Transaction[],
  customerId: number,
): RelatedCustomer[] {
  const p2pRelationships: RelatedCustomer[] = [];

  transactions.forEach((tx) => {
    if (tx.customerId !== customerId) return;

    const relatedTxId = tx.metadata.relatedTransactionId;
    const relatedTx = transactions.find((t) => t.transactionId === relatedTxId);

    if (!relatedTx) return;

    const relationType =
      tx.transactionType === RELATION_TYPE.P2P_SEND
        ? RELATION_TYPE.P2P_RECEIVE
        : RELATION_TYPE.P2P_SEND;
    p2pRelationships.push({
      relatedCustomerId: relatedTx.customerId,
      relationType,
    });
  });

  return p2pRelationships;
}

export function findRelatedCustomers(
  transactions: Transaction[],
  customerId: number,
): { relatedCustomers: RelatedCustomer[] } {
  const sharedDevicesRelations = findCustomersWithSharedDevices(
    transactions,
    customerId,
  );
  const p2pRelations = findP2PRelationships(transactions, customerId);

  const relatedCustomers = [...sharedDevicesRelations, ...p2pRelations];
  const uniqueRelatedCustomers = Array.from(
    new Map(
      relatedCustomers.map((item) => [item.relatedCustomerId, item]),
    ).values(),
  );

  return { relatedCustomers: uniqueRelatedCustomers };
}

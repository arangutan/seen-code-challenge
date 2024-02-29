import { Transaction } from 'src/providers/http/dto';
import { ConsolidatedTransaction } from 'src/types';

const STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
};

function getStatusTrx(trxStatus: string) {
  return trxStatus.toUpperCase() === STATUS.PENDING
    ? STATUS.PROCESSING
    : trxStatus.toUpperCase();
}

export function findConsolidatedTrx(
  transactions: Transaction[],
  customerId: number,
): { transactions: ConsolidatedTransaction[] } {
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.customerId === customerId,
  );
  const groupedByAuthCode: { [key: string]: Transaction[] } = {};

  // Group transactions by authorizationCode
  filteredTransactions.forEach((transaction) => {
    const { authorizationCode } = transaction;
    if (!groupedByAuthCode[authorizationCode]) {
      groupedByAuthCode[authorizationCode] = [];
    }
    groupedByAuthCode[authorizationCode].push(transaction);
  });

  const aggregatedTransactions: ConsolidatedTransaction[] = [];

  // Generate the final object
  Object.values(groupedByAuthCode).forEach((group) => {
    // Sort by transactionDate following the Transaccion Lyfecycle
    group.sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));
    const firstTransaction = group[0];
    const lastTransaction = group[group.length - 1];

    const timeline = group.map((transaction) => ({
      createdAt: transaction.transactionDate,
      status: getStatusTrx(transaction.transactionStatus),
      amount: transaction.amount,
    }));

    aggregatedTransactions.push({
      createdAt: firstTransaction.transactionDate,
      updatedAt: lastTransaction.transactionDate,
      transactionId: firstTransaction.transactionId,
      authorizationCode: firstTransaction.authorizationCode,
      status: getStatusTrx(lastTransaction.transactionStatus), // Update to match the lifecycle states
      description: firstTransaction.description,
      transactionType: firstTransaction.transactionType,
      metadata: firstTransaction.metadata,
      timeline,
    });
  });

  return { transactions: aggregatedTransactions };
}

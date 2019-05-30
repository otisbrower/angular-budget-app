import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class Transaction {
    id: string;
    createDate: string;
    description: string;
    fromAccount: string;
    fromAccountID: string;
    mainCategory: string;
    subCategory: string;
    toAccount: string;
    toAccountID: string;
    transactionAmount: string;
    transactionDate: object;
    transactionType: string;
    userID: string;
}

import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class Transaction {
    createDate: string;
    description: string;
    fromAccount: string;
    fromAccountID: string;
    mainCategory: string;
    subCategory: string;
    toAccount: string;
    toAccountID: string;
    transactionAmount: string;
    tranactionDate: object;
    transactionType: string;
    userID: string;
}

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction {
  trnDate: string;
  description: string;
  reference: string;
  debits: string;
  credits: string;
  balance: string;
}

export interface IStatement extends Document {
  _id: mongoose.Types.ObjectId;
  qrCodeHash: string;
  customerName: string;
  customerAddress: string;
  branchName: string;
  branchAddress: string;
  accountNo: string;
  productName: string;
  periodFrom: string;
  periodTo: string;
  page: string;
  currencyName: string;
  branchCode: string;
  customerId: string;
  transactions: ITransaction[];
  closingBalance: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    trnDate: { type: String, default: '' },
    description: { type: String, default: '' },
    reference: { type: String, default: '' },
    debits: { type: String, default: '' },
    credits: { type: String, default: '' },
    balance: { type: String, default: '' },
  },
  { _id: false }
);

const StatementSchema: Schema<IStatement> = new Schema(
  {
    qrCodeHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer Name is required'],
      trim: true,
    },
    customerAddress: {
      type: String,
      default: '',
      trim: true,
    },
    branchName: {
      type: String,
      default: 'Gulshan North Branch',
      trim: true,
    },
    branchAddress: {
      type: String,
      default: 'Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212',
      trim: true,
    },
    accountNo: {
      type: String,
      required: [true, 'Account Number is required'],
      trim: true,
    },
    productName: {
      type: String,
      default: 'EBL Power Savings',
      trim: true,
    },
    periodFrom: {
      type: String,
      default: '',
      trim: true,
    },
    periodTo: {
      type: String,
      default: '',
      trim: true,
    },
    page: {
      type: String,
      default: '1',
      trim: true,
    },
    currencyName: {
      type: String,
      default: 'BANGLADESH TAKA',
      trim: true,
    },
    branchCode: {
      type: String,
      default: '127',
      trim: true,
    },
    customerId: {
      type: String,
      default: '',
      trim: true,
    },
    transactions: [TransactionSchema],
    closingBalance: {
      type: String,
      default: '0.00',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Statement: Model<IStatement> =
  mongoose.models.Statement || mongoose.model<IStatement>('Statement', StatementSchema);

export default Statement;

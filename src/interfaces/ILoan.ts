export interface ILoan {
    id: number;
    material_id: number;
    borrower_name: string;
    borrower_contact: string;
    loan_date: string;
    return_date: string | null;
    status: 'active' | 'returned';
}

export type Loan = ILoan;

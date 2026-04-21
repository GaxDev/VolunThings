import api from "./axios";
import type { Loan } from "../interfaces/ILoan";

export const getLoans = (): Promise<Loan[]> =>
    api.get<{ ok: boolean; data: Loan[] }>("/api/loans").then((res) => res.data.data);

export const createLoan = (
    loan: Omit<Loan, "id" | "return_date" | "status">
): Promise<Loan> =>
    api
        .post<{ ok: boolean; data: Loan }>("/api/loans", loan)
        .then((res) => res.data.data);

export const updateLoan = (
    id: number,
    loan: Omit<Loan, "id" | "status">
): Promise<Loan> =>
    api
        .put<{ ok: boolean; data: Loan }>(`/api/loans/${id}`, loan)
        .then((res) => res.data.data);

export const deleteLoan = (id: number): Promise<void> =>
    api.delete(`/api/loans/${id}`).then(() => {});

export const returnLoan = (id: number): Promise<Loan> =>
    api
        .put<{ ok: boolean; data: Loan }>(`/api/loans/${id}/return`)
        .then((res) => res.data.data);

export const extendLoan = (id: number, return_date: string): Promise<Loan> =>
    api
        .put<{ ok: boolean; data: Loan }>(`/api/loans/${id}/extend`, { return_date })
        .then((res) => res.data.data);


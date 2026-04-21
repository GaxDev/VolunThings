import { useState } from "react";
import type { ILoan } from "../interfaces/ILoan";

interface Props {
    onClose: () => void;
    onSave: (loan: Omit<ILoan, "id">) => void;
    loan?: ILoan;
}

const LoanForm = ({ onClose, onSave, loan }: Props) => {
    const isEdit = !!loan;

    const [form, setForm] = useState({
        material_id: loan ? String(loan.material_id) : "",
        borrower_name: loan?.borrower_name ?? "",
        borrower_contact: loan?.borrower_contact ?? "",
        loan_date: loan?.loan_date?.slice(0, 10) ?? "",
    });

    const [confirming, setConfirming] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && !confirming) {
            setConfirming(true);
            return;
        }
        onSave({
            material_id: parseInt(form.material_id),
            borrower_name: form.borrower_name,
            borrower_contact: form.borrower_contact,
            loan_date: form.loan_date,
            return_date: loan?.return_date ?? null,
            status: loan?.status ?? "active",
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-card-header">
                    <h5>{isEdit ? "Editar préstamo" : "Nuevo préstamo"}</h5>
                    <button className="btn-close" onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-card-body">
                        {confirming ? (
                            <div className="text-center py-3">
                                <i className="bi bi-exclamation-triangle-fill text-warning fs-2 d-block mb-2"></i>
                                <p className="fw-semibold mb-1">¿Estás seguro de guardar los cambios?</p>
                                <p className="text-muted small">Esta acción actualizará los datos del préstamo.</p>
                            </div>
                        ) : (
                            <>
                                <div className="form-field">
                                    <label htmlFor="material_id">ID del material</label>
                                    <input
                                        id="material_id"
                                        type="number"
                                        className="form-control"
                                        placeholder="Ej: 1"
                                        value={form.material_id}
                                        onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                                        disabled={isEdit}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="borrower_name">Nombre del prestatario</label>
                                    <input
                                        id="borrower_name"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Juan García"
                                        value={form.borrower_name}
                                        onChange={(e) => setForm({ ...form, borrower_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="borrower_contact">Contacto</label>
                                    <input
                                        id="borrower_contact"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: juan@email.com"
                                        value={form.borrower_contact}
                                        onChange={(e) => setForm({ ...form, borrower_contact: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="loan_date">Fecha de préstamo</label>
                                    <input
                                        id="loan_date"
                                        type="date"
                                        className="form-control"
                                        value={form.loan_date}
                                        onChange={(e) => setForm({ ...form, loan_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-card-footer">
                        {confirming ? (
                            <>
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
                                    Volver
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirmar cambios
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEdit ? "Guardar cambios" : "Registrar préstamo"}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanForm;



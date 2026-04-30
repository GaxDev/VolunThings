import { useState, useMemo, useEffect } from "react";
import "../App.css";
import type { Loan } from "../interfaces/ILoan";
import { getLoans, createLoan, updateLoan, returnLoan, deleteLoan } from "../api/loans";
import LoanForm from "../components/LoanForm";
import Pagination from "../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 10;

type SortKey = keyof Loan;
type SortDir = "asc" | "desc";

const Loans = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [showForm, setShowForm] = useState(false);
    const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getLoans().then((data) => setLoans(data));
    }, []);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sortIcon = (key: SortKey) => {
        if (sortKey !== key) return <i className="bi bi-chevron-expand loan-sort-icon ms-1"></i>;
        return sortDir === "asc"
            ? <i className="bi bi-chevron-up loan-sort-icon loan-sort-active ms-1"></i>
            : <i className="bi bi-chevron-down loan-sort-icon loan-sort-active ms-1"></i>;
    };

    const filtered = useMemo(() => {
        const result = loans.filter((l) => {
            const matchSearch =
                l.borrower_name.toLowerCase().includes(search.toLowerCase()) ||
                l.borrower_contact.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "Todos" || l.status === statusFilter;
            return matchSearch && matchStatus;
        });

        result.sort((a, b) => {
            const aVal = a[sortKey] ?? "";
            const bVal = b[sortKey] ?? "";
            const cmp = String(aVal).localeCompare(String(bVal), "es", { numeric: true });
            return sortDir === "asc" ? cmp : -cmp;
        });

        return result;
    }, [loans, search, statusFilter, sortKey, sortDir]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSave = (loan: Omit<Loan, "id">) => {
        if (editingLoan) {
            updateLoan(editingLoan.id, loan).then((updated) => {
                setLoans((prev) => prev.map((l) => l.id === editingLoan.id ? updated : l));
                setEditingLoan(null);
                toast.success("Préstamo actualizado correctamente");
            }).catch(() => toast.error("Error al actualizar el préstamo"));
        } else {
            createLoan(loan).then((newLoan) => {
                setLoans((prev) => [...prev, newLoan]);
                setShowForm(false);
                toast.success("Préstamo registrado correctamente");
            }).catch(() => toast.error("Error al registrar el préstamo"));
        }
    };
    const handleDelete = (id: number) => {
        deleteLoan(id).then(() => {
            setLoans((prev) => prev.filter((l) => l.id !== id));
            toast.success("Préstamo eliminado");
        }).catch(() => toast.error("Error al eliminar el préstamo"));
    };

    const handleDeleteSelected = () => {
        Promise.all([...selectedIds].map((id) => deleteLoan(id)))
            .then(() => {
                setLoans((prev) => prev.filter((l) => !selectedIds.has(l.id)));
                setSelectedIds(new Set());
                toast.success(`${selectedIds.size} préstamo${selectedIds.size !== 1 ? "s" : ""} eliminado${selectedIds.size !== 1 ? "s" : ""}`);
            })
            .catch(() => toast.error("Error al eliminar los préstamos seleccionados"));
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allSelected = filtered.length > 0 && filtered.every((l) => selectedIds.has(l.id));
    const someSelected = filtered.some((l) => selectedIds.has(l.id));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                filtered.forEach((l) => next.delete(l.id));
                return next;
            });
        } else {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                filtered.forEach((l) => next.add(l.id));
                return next;
            });
        }
    };

    const handleReturn = (id: number) => {
        returnLoan(id).then((updated) => {
            setLoans((prev) => prev.map((l) => l.id === id ? updated : l));
            toast.success("Préstamo marcado como devuelto");
        }).catch(() => toast.error("Error al actualizar el préstamo"));
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold mb-0">Préstamos</h2>
                <div className="d-flex gap-2">
                    {someSelected && (
                        <button className="btn btn-danger" onClick={handleDeleteSelected}>
                            <i className="bi bi-trash me-1"></i>
                            Eliminar seleccionados ({selectedIds.size})
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <i className="bi bi-plus-lg me-1"></i>
                        Nuevo préstamo
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Buscar por prestatario o contacto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-5">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="active">Activos</option>
                        <option value="returned">Devueltos</option>
                    </select>
                </div>
            </div>

            <p className="text-muted mb-3">
                {filtered.length} préstamo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-clipboard-x fs-1"></i>
                    <p className="mt-2">No se han encontrado préstamos.</p>
                </div>
            ) : (
                <div className="table-responsive loan-table-wrapper">
                    <table className="table loan-table align-middle mb-0">
                        <thead>
                            <tr>
                                {([
                                    { key: "select" as unknown as SortKey, label: "" },
                                    { key: "id", label: "#" },
                                    { key: "material_id", label: "Material ID" },
                                    { key: "borrower_name", label: "Prestatario" },
                                    { key: "borrower_contact", label: "Contacto" },
                                    { key: "loan_date", label: "Fecha préstamo" },
                                    { key: "return_date", label: "Fecha devolución" },
                                    { key: "status", label: "Estado" },
                                    { key: "edit", label: "Editar" },
                                    { key: "delete", label: "Eliminar" },
                                ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                                    <th
                                        key={key}
                                        className={`loan-th${key === ("select" as unknown as SortKey) ? " loan-th-check" : ""}`}
                                        onClick={() => key !== ("select" as unknown as SortKey) && handleSort(key)}
                                    >
                                        {key === ("select" as unknown as SortKey) ? (
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={allSelected}
                                                onChange={toggleSelectAll}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <>{label}{sortIcon(key)}</>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((loan) => (
                                <tr key={loan.id} className={`loan-row${selectedIds.has(loan.id) ? " loan-row-selected" : ""}`}>
                                    <td className="loan-td-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedIds.has(loan.id)}
                                            onChange={() => toggleSelect(loan.id)}
                                        />
                                    </td>
                                    <td className="text-muted">#{loan.id}</td>
                                    <td>#{loan.material_id}</td>
                                    <td className="fw-semibold">{loan.borrower_name}</td>
                                    <td>{loan.borrower_contact}</td>
                                    <td>{new Date(loan.loan_date).toLocaleDateString("es-ES")}</td>
                                    <td>
                                        {loan.return_date
                                            ? new Date(loan.return_date).toLocaleDateString("es-ES")
                                            : <span className="text-muted">—</span>}
                                    </td>
                                    <td>
                                        <span className={`badge loan-badge ${loan.status === "active" ? "bg-warning text-dark" : "bg-success"
                                            }`}>
                                            {loan.status === "active" ? "Activo" : "Devuelto"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => { setEditingLoan(loan); setConfirmDeleteId(null); }}
                                            disabled={loan.status === "returned"}
                                            title={loan.status === "returned" ? "No se puede editar un préstamo devuelto" : "Editar"}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                    <td>
                                        {confirmDeleteId === loan.id ? (
                                            <div className="d-flex align-items-center gap-1">
                                                <span className="text-danger small fw-semibold">¿Seguro?</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => {
                                                        deleteLoan(loan.id).then(() => {
                                                            setLoans((prev) => prev.filter((l) => l.id !== loan.id));
                                                            setConfirmDeleteId(null);
                                                            toast.success("Préstamo eliminado");
                                                        }).catch(() => toast.error("Error al eliminar el préstamo"));
                                                    }}
                                                >
                                                    Sí
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setConfirmDeleteId(loan.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {(showForm || editingLoan) && (
                <LoanForm
                    onClose={() => { setShowForm(false); setEditingLoan(null); }}
                    onSave={handleSave}
                    loan={editingLoan ?? undefined}
                />
            )}
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default Loans;

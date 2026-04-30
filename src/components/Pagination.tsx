import "./components.css";

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
    if (totalPages <= 1) return null;

    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <nav aria-label="Paginación" className="pagination-nav">
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>

                {getPages().map((page, i) =>
                    page === "..." ? (
                        <li key={`ellipsis-${i}`} className="page-item disabled">
                            <span className="page-link">…</span>
                        </li>
                    ) : (
                        <li key={page} className={`page-item${currentPage === page ? " active" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page as number)}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}

                <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;

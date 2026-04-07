import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/materials", label: "Materiales" },
    { to: "/loans", label: "Préstamos" },
];

const Search = ({ autoFocus = false }: { autoFocus?: boolean }) => (
    <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
        <input className="form-control me-1 search-input" 
               type="search" 
               placeholder="Buscar..." 
               aria-label="Buscar" 
               autoFocus={autoFocus} />
        <button className="btn btn-outline-light" type="submit">
            <i className="bi bi-search"></i>
        </button>
    </form>
);

const Navbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <nav className="navbar navbar-dark bg-primary py-3">
                <div className="container-fluid px-4 d-flex align-items-center">
                    <div className="flex-grow-1 ps-3">
                        <Link className="navbar-brand fw-bold text-white text-decoration-none" to="/">VolunThings</Link>
                    </div>
                    <div className="d-flex align-items-center d-lg-none flex-shrink-0 gap-2">
                        <button className="btn btn-link text-white fs-5 p-0" type="button" aria-label="Buscar" onClick={() => setSearchOpen(!searchOpen)}>
                            <i className={`bi ${searchOpen ? 'bi-x-lg' : 'bi-search'}`}></i>
                        </button>
                        {searchOpen && <Search autoFocus />}
                    </div>
                    <button className="btn btn-link text-white fs-4 d-lg-none ms-2 p-0" type="button" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}>
                        <i className="bi bi-list"></i>
                    </button>
                    <div className="d-none d-lg-flex align-items-center gap-4">
                        <ul className="navbar-nav d-flex flex-row gap-4 mb-0">
                            {navLinks.map(({ to, label }) => (
                                <li className="nav-item" key={to}>
                                    <Link className="nav-link text-white fw-semibold nav-custom-link p-2" to={to}>{label}</Link>
                                </li>
                            ))}
                        </ul>
                        <Search />
                    </div>
                    <div className="flex-grow-1 d-none d-lg-flex justify-content-end pe-3">
                        <Link to="/login"><button className="btn btn-outline-light fw-bold">Iniciar sesión</button></Link>
                    </div>
                </div>
            </nav>

            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : 'closed'}`} onClick={() => setSidebarOpen(false)} />

            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="d-flex justify-content-between align-items-center px-4 py-4 border-bottom border-primary">
                    <span className="fw-bold fs-5 text-white">VolunThings</span>
                    <button className="btn btn-link text-white fs-4 p-0" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <nav className="flex-grow-1 px-3 py-4 d-flex flex-column gap-1">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to} className="sidebar-link" onClick={() => setSidebarOpen(false)}>{label}</Link>
                    ))}
                </nav>
                <div className="px-4 py-4 border-top border-primary">
                    <Link to="/login" onClick={() => setSidebarOpen(false)}>
                        <button className="btn btn-outline-light fw-bold w-100">Iniciar sesión</button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
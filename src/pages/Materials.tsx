import { useState, useMemo } from "react";

interface Material {
    id: number;
    name: string;
    category: string;
    description: string;
    available: boolean;
    createdAt?: string;
}

const mockMaterials: Material[] = [
    { id: 1, name: "Sillas plegables", category: "Mobiliario", description: "Sillas ligeras para eventos al aire libre.", available: true, createdAt: "2026-03-01T10:00:00Z" },
    { id: 2, name: "Mesas de reunión", category: "Mobiliario", description: "Mesas rectangulares para talleres y reuniones.", available: false, createdAt: "2025-05-02T10:00:00Z" },
    { id: 3, name: "Proyector HD", category: "Electrónica", description: "Proyector portátil con resolución 1080p.", available: true, createdAt: "2025-05-03T10:00:00Z" },
    { id: 4, name: "Altavoz portátil", category: "Electrónica", description: "Altavoz Bluetooth con batería de 8 horas.", available: true, createdAt: "2025-05-04T10:00:00Z" },
    { id: 5, name: "Tienda de campaña", category: "Camping", description: "Tienda para 4 personas, impermeable.", available: false, createdAt: "2025-05-05T10:00:00Z" },
    { id: 6, name: "Botiquín primeros auxilios", category: "Salud", description: "Kit completo de primeros auxilios.", available: true, createdAt: "2025-05-06T10:00:00Z" },
    { id: 7, name: "Lonas impermeables", category: "Camping", description: "Lonas 3x4m para protección ante lluvia.", available: true, createdAt: "2025-04-07T10:00:00Z" },
    { id: 8, name: "Micrófono inalámbrico", category: "Electrónica", description: "Micrófono de mano con receptor UHF.", available: false, createdAt: "2026-01-08T10:00:00Z" },
];

const categories = ["Todas", ...Array.from(new Set(mockMaterials.map((m) => m.category)))];

const Materials = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    const filtered = useMemo(() => {
        return mockMaterials.filter((m) => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = category === "Todas" || m.category === category;
            const matchAvailable = !onlyAvailable || m.available;
            return matchSearch && matchCategory && matchAvailable;
        });
    }, [search, category, onlyAvailable]);

    return (
        <div className="container mt-4">
            <h2 className="text-primary fw-bold mb-4">Materiales</h2>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-5">
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Buscar material..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-3 d-flex align-items-center">
                    <div className="form-check mb-0">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="availableCheck"
                            checked={onlyAvailable}
                            onChange={(e) => setOnlyAvailable(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="availableCheck">
                            Solo disponibles
                        </label>
                    </div>
                </div>
            </div>

            <p className="text-muted mb-3">{filtered.length} material{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>

            {filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-box-seam fs-1"></i>
                    <p className="mt-2">No se encontraron materiales con esos filtros.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {filtered.map((material) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={material.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">{material.name}</h5>
                                        <span className={`badge ${material.available ? 'bg-success' : 'bg-secondary'}`}>
                                            {material.available ? "Disponible" : "No disponible"}
                                        </span>
                                    </div>
                                    <span className="badge bg-primary-subtle text-primary mb-2">{material.category}</span>
                                    <p className="card-text text-muted small">{material.description}</p>
                                    <p className="text-muted small mb-0">Creado el {new Date(material.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <button
                                        className="btn btn-primary btn-sm w-100"
                                        disabled={!material.available}
                                    >
                                        {material.available ? "Solicitar préstamo" : "No disponible"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Materials;
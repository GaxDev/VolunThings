import { useState, useMemo, useEffect } from "react";
import "../App.css";

interface Material {
    id: number;
    name: string;
    category: string;
    description: string;
    available: boolean;
    createdAt?: string;
    images: string[];
}

const mockMaterials: Material[] = [
    { id: 1, name: "Sillas plegables", category: "Mobiliario", description: "Sillas ligeras para eventos al aire libre.", available: true, createdAt: "2026-03-01T10:00:00Z", images: ["https://placehold.co/400x220/0d6efd/white?text=Silla+1", "https://placehold.co/400x220/0d6efd/white?text=Silla+2", "https://placehold.co/400x220/0d6efd/white?text=Silla+3"] },
    { id: 2, name: "Mesas de reunión", category: "Mobiliario", description: "Mesas rectangulares para talleres y reuniones.", available: false, createdAt: "2025-05-02T10:00:00Z", images: ["https://placehold.co/400x220/6c757d/white?text=Mesa+1", "https://placehold.co/400x220/6c757d/white?text=Mesa+2"] },
    { id: 3, name: "Proyector HD", category: "Electrónica", description: "Proyector portátil con resolución 1080p.", available: true, createdAt: "2025-05-03T10:00:00Z", images: ["https://placehold.co/400x220/198754/white?text=Proyector+1", "https://placehold.co/400x220/198754/white?text=Proyector+2"] },
    { id: 4, name: "Altavoz portátil", category: "Electrónica", description: "Altavoz Bluetooth con batería de 8 horas.", available: true, createdAt: "2025-05-04T10:00:00Z", images: ["https://placehold.co/400x220/0dcaf0/white?text=Altavoz+1", "https://placehold.co/400x220/0dcaf0/white?text=Altavoz+2"] },
    { id: 5, name: "Tienda de campaña", category: "Camping", description: "Tienda para 4 personas, impermeable.", available: false, createdAt: "2025-05-05T10:00:00Z", images: ["https://placehold.co/400x220/6c757d/white?text=Tienda+1", "https://placehold.co/400x220/6c757d/white?text=Tienda+2", "https://placehold.co/400x220/6c757d/white?text=Tienda+3"] },
    { id: 6, name: "Botiquín primeros auxilios", category: "Salud", description: "Kit completo de primeros auxilios.", available: true, createdAt: "2025-05-06T10:00:00Z", images: ["https://placehold.co/400x220/dc3545/white?text=Botiquín+1", "https://placehold.co/400x220/dc3545/white?text=Botiquín+2"] },
    { id: 7, name: "Lonas impermeables", category: "Camping", description: "Lonas 3x4m para protección ante lluvia.", available: true, createdAt: "2025-04-07T10:00:00Z", images: ["https://placehold.co/400x220/ffc107/black?text=Lona+1", "https://placehold.co/400x220/ffc107/black?text=Lona+2"] },
    { id: 8, name: "Micrófono inalámbrico", category: "Electrónica", description: "Micrófono de mano con receptor UHF.", available: false, createdAt: "2026-01-08T10:00:00Z", images: ["https://placehold.co/400x220/6c757d/white?text=Micrófono+1", "https://placehold.co/400x220/6c757d/white?text=Micrófono+2"] },
];

const categories = ["Todas", ...Array.from(new Set(mockMaterials.map((m) => m.category)))];

const Materials = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [activeIndexes, setActiveIndexes] = useState<Record<number, number>>(
        () => Object.fromEntries(mockMaterials.map((m) => [m.id, 0]))
    );

    const handlePrev = (e: React.MouseEvent, material: Material) => {
        e.stopPropagation();
        setActiveIndexes((prev) => ({
            ...prev,
            [material.id]: (prev[material.id] - 1 + material.images.length) % material.images.length,
        }));
    };

    const handleNext = (e: React.MouseEvent, material: Material) => {
        e.stopPropagation();
        setActiveIndexes((prev) => ({
            ...prev,
            [material.id]: (prev[material.id] + 1) % material.images.length,
        }));
    };

    useEffect(() => {
        if (hoveredId === null) return;
        const material = mockMaterials.find((m) => m.id === hoveredId);
        if (!material || material.images.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndexes((prev) => ({
                ...prev,
                [hoveredId]: (prev[hoveredId] + 1) % material.images.length,
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, [hoveredId]);

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
        <div className="container mt-5">
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
                                <div
                                    className="position-relative overflow-hidden carousel-container"
                                    onMouseEnter={() => setHoveredId(material.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {material.images.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            className="position-absolute top-0 start-0 w-100 h-100 carousel-image"
                                            style={{ opacity: i === activeIndexes[material.id] ? 1 : 0 }}
                                            alt={`${material.name} ${i + 1}`}
                                        />
                                    ))}
                                    {material.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => handlePrev(e, material)}
                                                className="position-absolute top-50 start-0 border-0 bg-transparent carousel-arrow carousel-arrow-prev"
                                                aria-label="Imagen anterior"
                                            >
                                                &#8249;
                                            </button>
                                            <button
                                                onClick={(e) => handleNext(e, material)}
                                                className="position-absolute top-50 end-0 border-0 bg-transparent carousel-arrow carousel-arrow-next"
                                                aria-label="Imagen siguiente"
                                            >
                                                &#8250;
                                            </button>
                                            <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center gap-1 pb-2">
                                                {material.images.map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-circle bg-white d-inline-block carousel-dot"
                                                        style={{ opacity: i === activeIndexes[material.id] ? 1 : 0.4 }}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
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
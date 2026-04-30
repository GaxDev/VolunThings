import { useState, useMemo, useEffect } from "react";
import "../App.css";
import type { Material } from "../interfaces/IMaterial";
import { getMaterials, createMaterial } from "../api/materials";
import MaterialForm from "../components/MaterialForm";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 9;

const Materials = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [activeIndexes, setActiveIndexes] = useState<Record<number, number>>({});
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSaveMaterial = (newMaterial: Omit<Material, "id" | "created_at" | "images">, images: File[]) => {
        const tempId = Date.now();
        const tempMaterial: Material = {
            ...newMaterial,
            id: tempId,
            created_at: new Date().toISOString(),
            images: images.map((f) => URL.createObjectURL(f)),
        };
        setMaterials((prev) => [...prev, tempMaterial]);
        setActiveIndexes((prev) => ({ ...prev, [tempId]: 0 }));

        createMaterial(newMaterial, images).then((saved) => {
            setMaterials((prev) => prev.map((m) => m.id === tempId ? { ...saved, images: tempMaterial.images } : m));
            setActiveIndexes((prev) => {
                const { [tempId]: idx, ...rest } = prev;
                return { ...rest, [saved.id]: idx };
            });
        });
    };

    useEffect(() => {
        getMaterials().then((data) => {
            setMaterials(data);
            setActiveIndexes(Object.fromEntries(data.map((m) => [m.id, 0])));
        });
    }, []);

    const handlePrev = (e: React.MouseEvent, material: Material) => {
        e.stopPropagation();
        const images = material.images ?? [];
        setActiveIndexes((prev) => ({
            ...prev,
            [material.id]: (prev[material.id] - 1 + images.length) % images.length,
        }));
    };

    const handleNext = (e: React.MouseEvent, material: Material) => {
        e.stopPropagation();
        const images = material.images ?? [];
        setActiveIndexes((prev) => ({
            ...prev,
            [material.id]: (prev[material.id] + 1) % images.length,
        }));
    };

    useEffect(() => {
        if (hoveredId === null) return;
        const material = materials.find((m) => m.id === hoveredId);
        const images = material?.images ?? [];
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndexes((prev) => ({
                ...prev,
                [hoveredId]: (prev[hoveredId] + 1) % images.length,
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, [hoveredId, materials]);

    const categories = useMemo(() => {
        return ["Todas", ...Array.from(new Set(materials.map((m) => m.category)))];
    }, [materials]);

    const filtered = useMemo(() => {
        return materials.filter((m) => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = category === "Todas" || m.category === category;
            const matchAvailable = !onlyAvailable || m.status === "available";
            return matchSearch && matchCategory && matchAvailable;
        });
    }, [materials, search, category, onlyAvailable]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, onlyAvailable]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold mb-0">Materiales</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <i className="bi bi-plus-lg me-1"></i>
                    Añadir material
                </button>
            </div>

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
                    <p className="mt-2">No se han encontrados los materiales.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {paginated.map((material) => {
                        const images = material.images ?? [];
                        return (
                            <div className="col-12 col-sm-6 col-lg-4" key={material.id}>
                                <div className="card h-100 shadow-sm">
                                    {images.length > 0 && (
                                        <div
                                            className="position-relative overflow-hidden carousel-container"
                                            onMouseEnter={() => setHoveredId(material.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            {images.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    className="position-absolute top-0 start-0 w-100 h-100 carousel-image"
                                                    style={{ opacity: i === activeIndexes[material.id] ? 1 : 0 }}
                                                    alt={`${material.name} ${i + 1}`}
                                                />
                                            ))}
                                            {images.length > 1 && (
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
                                                        {images.map((_, i) => (
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
                                    )}
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{material.name}</h5>
                                            <span className={`badge ${material.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                                                {material.status === 'available' ? "Disponible" : "No disponible"}
                                            </span>
                                        </div>
                                        <span className="badge bg-primary-subtle text-primary mb-2">{material.category}</span>
                                        <p className="card-text text-muted small">{material.description}</p>
                                        <p className="text-muted small mb-0">Creado el {new Date(material.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <button
                                            className="btn btn-primary btn-sm w-100"
                                            disabled={material.status !== 'available'}
                                        >
                                            {material.status === 'available' ? "Solicitar préstamo" : "No disponible"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {showForm && (
                <MaterialForm
                    onClose={() => setShowForm(false)}
                    onSave={handleSaveMaterial}
                />
            )}
        </div>
    );
};

export default Materials;
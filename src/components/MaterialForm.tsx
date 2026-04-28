import { useState, useRef } from "react";
import "./components.css";
import type { IMaterial } from "../interfaces/IMaterial";

const MAX_IMAGES = 6;

interface Props {
    onClose: () => void;
    onSave: (material: Omit<IMaterial, "id" | "created_at" | "images">, images: File[]) => void;
}

const initialForm = {
    name: "",
    category: "",
    description: "",
    status: "available" as IMaterial["status"],
};

const MaterialForm = ({ onClose, onSave }: Props) => {
    const [form, setForm] = useState(initialForm);
    const [images, setImages] = useState<File[]>([]);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const atMax = images.length >= MAX_IMAGES;

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
        setImages((prev) => {
            const merged = [...prev, ...valid];
            if (merged.length > MAX_IMAGES) {
                setError(`Máximo ${MAX_IMAGES} imágenes permitidas.`);
                return prev.length < MAX_IMAGES ? merged.slice(0, MAX_IMAGES) : prev;
            }
            setError("");
            return merged;
        });
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setError("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length < 1) {
            setError("Añade al menos 1 imagen.");
            return;
        }
        onSave(form, images);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-card-header">
                    <h5>Añadir nuevo material.</h5>
                    <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-card-body">
                        <div className="form-field">
                            <label>Nombre</label>
                            <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Nombre del material" required />
                        </div>
                        <div className="form-field">
                            <label>Categoría</label>
                            <input className="form-control" name="category" value={form.category} onChange={handleChange} placeholder="Ej: Camping, Tecnología..." required />
                        </div>
                        <div className="form-field">
                            <label>Descripción</label>
                            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Descripción del material" rows={3} />
                        </div>
                        <div className="form-field">
                            <label>Imágenes <span className="text-muted fw-normal">(mín. 1, máx. {MAX_IMAGES})</span></label>
                            <div
                                className={`dropzone${dragging ? " dropzone--active" : ""}${atMax ? " dropzone--disabled" : ""}`}
                                onDragOver={!atMax ? (e) => { e.preventDefault(); setDragging(true); } : undefined}
                                onDragLeave={() => setDragging(false)}
                                onDrop={!atMax ? (e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); } : undefined}
                                onClick={() => !atMax && inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
                                <i className="bi bi-cloud-upload dropzone-icon"></i>
                                <p className="dropzone-text">{atMax ? "Límite de imágenes alcanzado" : "Arrastra imágenes aquí o haz clic para seleccionar"}</p>
                                <span className="dropzone-counter">{images.length} / {MAX_IMAGES}</span>
                            </div>
                            {images.length > 0 && (
                                <div className="dropzone-previews">
                                    {images.map((file, i) => (
                                        <div key={i} className="dropzone-preview">
                                            <img src={URL.createObjectURL(file)} alt={`preview-${i}`} />
                                            <button type="button" className="dropzone-remove" onClick={() => removeImage(i)} aria-label="Eliminar imagen">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {error && <p className="dropzone-error">{error}</p>}
                        </div>
                        <div className="form-field">
                            <label>Estado</label>
                            <select
                                className="form-select"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="available">Disponible</option>
                                <option value="loaned">No disponible</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-card-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialForm;

import api from "./axios";
import type { Material } from "../interfaces/IMaterial";

export const getMaterials = (): Promise<Material[]> =>
    api.get<{ ok: boolean; data: Material[] }>("/api/materials").then((res) => res.data.data);

export const createMaterial = (
    material: Omit<Material, "id" | "created_at" | "images">,
    images: File[]
): Promise<Material> => {
    const formData = new FormData();
    formData.append("name", material.name);
    formData.append("category", material.category);
    formData.append("description", material.description);
    formData.append("status", material.status);
    formData.append("created_at", new Date().toISOString());
    images.forEach((file) => formData.append("images", file));

    return api
        .post<Material>("/api/materials", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
};

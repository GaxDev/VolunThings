export interface IMaterial {
    id: number;
    name: string;
    category: string;
    description: string;
    status: 'available' | 'loaned';
    created_at: string;
    images?: string[];
}

export type Material = IMaterial;

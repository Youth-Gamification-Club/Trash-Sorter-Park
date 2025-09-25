export type Material = "plastic" | "paper" | "metal" | "glass";

export type TrashItem = {
    id: string;
    type: Material;
    src: string;
    alt: string;
    sorted: boolean;
};

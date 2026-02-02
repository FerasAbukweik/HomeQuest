export interface PropertyDTO {
    id: string;
    title: string;
    description: string;
    address: string;
    imagesUrls: string[];
    price: number;
    createdAt: Date;
    userId: string;
    propertyType: number;
    state: number;
}

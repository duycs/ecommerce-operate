export class ProductDto {
    id!: string;
    shopId?: string;
    sku?: string;
    name?: string;
    brandId?: string;
    brandName?: string;
    categoryId?: string;
    categoryName?: string;
    description?: string;
    image?: string;
    thumbIamge?: string;
    images?: string[];
    IsSellFullSize?: boolean;
    productType?: number;
    status?: {
        id: number,
        name: string
    };

    statusChips!: any[];
}


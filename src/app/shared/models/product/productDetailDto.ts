// export interface ProductDetailDto {
//     statusChips: any[],
//     colorChips: any[],
//     sizeChips: any[],

//     items: ProductDetailsChildDto[];
//     attributes: ProductDetailsAttributeDto[];
//     priceMin: any;
//     priceMax: any;
//     id: string,
//     shopId: string,
//     sku: string,
//     name: string,
//     brandName: string,
//     categoryId: string,
//     categoryName: string,
//     isSellFullSize: boolean,
//     image: string,
//     status: number,
//     productStatus: {
//         Id: number,
//         Name: string
//     },
//     description: string, // miss
// }

// export interface ProductDetailsChildDto {
//     id: any;
//     quantity: any;
//     quantityInCart: any;
//     name: string;
//     sku: string;
//     attributeValueIds: any[]
//     price: any;
// }

// export interface ProductDetailsAttributeDto {
//     id: any;
//     name: any;
//     priority: any;
//     values: ProductDetailsAttributeValueDto[];
// }

// export interface ProductDetailsAttributeValueDto {
//     id: any;
//     name: string;
//     value: any;
//     quantity: any;
//     quantityInCart: any;
// }

export interface ProductDetailDto {
    id: string,
    name: string,
    sku: string,
    shop: string,
    shopId: string,
    category: string,
    categoryId: string,
    brand: string,
    brandId: string,
    status: number,
    isApproved: boolean,
    isActived: boolean,
    productStatus: {
        Id: number,
        Name: string
    },
    attributes: [
        {
            id: string,
            code: string,
            name: number,
            value: number,
            attributeName: string,
            priority: number
        },
    ],
    children: [
        {
            id: string,
            name: string,
            sku: string,
            quantityInInventory: number,
            attributeValueIds: any[],
            attributes: [
                {
                    id: string,
                    code: string,
                    name: number,
                    value: number,
                    attributeName: string,
                    priority: number
                },

            ],
            attributeChips?: any[],
            description?: string,
        },

    ],

    image: string,
    minPrice: number,
    maxPrice: number,
    price: number, // giá bán
    cost: number, // giá nhập
    description: string,

    statusChips: any[],
    colorChips: any[],
    sizeChips: any[],
}
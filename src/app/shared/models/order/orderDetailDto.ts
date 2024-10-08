// export interface OrderDetailDto {
//     processStatusChips?: any[],
//     quantityStatusChips?: any[],

//     id: string,
//     items: OrderItem[],

//     code: string, // Mã hàng
//     customer: { // Người mua
//         name: string, // Họ tên
//         phone: string // Số điện thoại
//     },
//     debt: number, // Công nợ
//     debtLimit: number, // Định mức công nợ
//     createdDate: Date, // Thời gian đặt hàng
//     processStatus: string, // Trạng thái xủ lý đơn
//     quantityStatus: string, // Trạng thái số lượng sản phẩm
//     employee: string, // Tên nhân viên hỗ trợ

//     totalQuantity: number, // Tổng số lượng
//     totalPrice: number, // Tổng tiền nguyên giá
//     cashProductDiscount: number, // Triết khấu trên sản phẩm
//     percentOrderDiscount: number, // Triết khấu trên % đơn
//     cashDiscount: number, // Chiết khấu tiền mặt
//     totalPriceAfterDiscount: number, // Tổng tiền hàng sau(sau triết khấu)
//     customerPaid: number, // Khách hàng đã thanh toán
//     deliveryAddress: string, // Địa chỉ giao hàng
//     customerNote: string, // Ghi chú của khách
//     employeeNote: string, // Ghi chú của nhân viên
//     paymentAccount: {  // Tài khoản thanh toán
//         id: string,
//         bankName: string // Tên ngân hàng
//     },
// }

// export interface OrderItem {
//     processStatusChips?: any[],

//     id: string,
//     code: string, // Mã đơn hàng con = Mã đơn-Nhà cung cấp
//     shop: string, // Nhà cung cấp
//     createdDate: Date, // Thời gian tạo đơn hàng con
//     processStatus: string, // Trạng thái đơn
//     quantityProduct: { // Đã giao/Đặt hàng
//         delivered: number, // Đã giao
//         order: number, // Đặt hàng
//         ratio: number
//     },
//     quantityDeliver: { // Sẵn hàng/Còn thiếu
//         inStock: number, // Sẵn hàng
//         lackStock: number, // Còn thiếu
//         ratio: number
//     },
//     quantity: number, // Tổng số lượng sản phẩm
//     totalPrice: string, // Thành tiền
//     products: OrderProduct[] // Sản phẩm
// }

// export interface OrderProduct {
//     code: string, // Mã sản phẩm
//     name: string, // Tên sản phẩm
//     items: ProductItem[] // Item sản phẩm
//     quantity: number, // Tổng số lượng items
//     totalPrice: number, // Tổng tiền các items
//     percentDiscount: number, // Tổng triết khấu % các items
//     cashDiscount: number, // Tổng triết khấu tiền mặt các items
// }

// export interface ProductItem {
//     name: string, // Tên item sản phẩm
//     detail: string, // Chi tiết sản phẩm = danh sách size/số lượng
//     quantity: number, // Số lượng
//     price: number, // Giá
//     percentDiscount: number, // Triết khấu %
//     cashDiscount: number, // Triết khấu tiền mặt,
//     totalPrice: number // Tổng tiền
// }

export interface OrderDetailDto {
    id: string,
    code?: string, // miss
    detail: {
        processStatusChips?: any[],
        quantityStatusChips?: any[],
        quantityProductRatio?: number,
        quantiyDeliverRatio?: number,
        totalQuantity?: number,
        totalPrice?: number,
        cashDiscount?: number,
        cashProductDiscount?: number,
        percentOrderDiscount?: number,
        customerPhoneHidden?: string,

        id: string,
        status: number,
        orderStatus: {
            Id: number,
            Name: string
        },
        customerName: string,
        customerPhone: string,
        customerId: string,
        orderDate: Date,
        shippingAddressPhone: string,
        shippingAddressName: string,
        debt?: number, // miss
        debtLimit?: number, // miss
        staffName?: string,
        customerNote?: string, // miss
        staffNote?: string, // miss
        totalPriceAfterDiscount?: number, // miss
        customerPaid?: number, // miss
        paymentAccount?: { // miss
            id: string,
            bankName: string // Tên ngân hàng
        }

    },
    supplierOrders: SupplierOrder[],
    supplierOrder: SupplierOrder,
}

export interface SupplierOrder {
    processStatusChips?: any[],
    quantityStatusChips?: any[],
    quantityProductRatio?: number,
    quantiyDeliverRatio?: number,
    quantity?: number,

    id: string,
    code?: string,
    shopName: string,
    status: number,
    customerOrderId: string,
    orderStatus: {
        Id: number,
        Name: string
    },
    quantityDelivered: number,
    quantityOrdered: number,
    quantityInStock: number,
    quantityLackStock: number, // miss
    totalPrice: number,
    cashDiscount: number,
    products: Product[],
    createdDate?: Date, // miss
}

export interface Product {
    id: string,
    sku: string,
    name: string,
    supplierOrderId: string,
    quantity: number,
    totalPrice: number,
    discountPrice: number,
    children: ProductChildren[],
}

export interface ProductChildren {
    detail?: string,
    totalPrice?: number, // price * quantity
    attributeName: string,

    id: string,
    name?: string,
    quantity: number,
    price: number,
    discountPrice: number,
    percentDiscount?: number, // miss
    quantityDelivered: number,
    quantityInStock: number,
    quantityLeft: number,
    attributes: ProductAttribute[],

}

export interface ProductAttribute {
    id: string,
    priority: number,
    name: string,
    value: string
}
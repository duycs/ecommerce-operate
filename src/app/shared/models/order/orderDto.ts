// export interface OrderDto {
//     processStatusChips?: any[], // Trạng thái đơn
//     quantityStatusChips?: any[], // Trạng thái số lượng

//     id: string,
//     numericalOrder?: number, // Số thứ tự
//     code: string, // Mã hàng
//     customer: { // Người mua
//         name: string, // Họ tên
//         phone: string // Số điện thoại
//     },
//     orderNumber: number, // Số order thứ n của khách hàng
//     employee: string, // Tên nhân viên
//     quantityProduct: { // Số lượng sản phẩm
//         delivered: number, // Đã giao
//         order: number // Đặt hàng,
//         ratio: number // Tỉ lệ Đã giao/Đặt hàng
//     },  
//     quantityDeliver: { // Số lượng chờ giao
//         inStock: number, // Sẵn hàng
//         lackStock: number // Còn thiếu,
//         ratio: number // Tỉ lệ Sẵn hàng/còn thiếu
//     },
//     cashDiscount: number, // Chiết khấu tiền mặt
//     totalPrice: number, // Tổng tiền
//     processStatus: string, // Trạng thái đơn
//     quantityStatus: string, // Trạng thái số lượng
// }

export interface OrderDto {
    id: string,
    code: string, // miss
    orderNumber: number,
    status: number,
    orderStatus: {
        id: number,
        name: string
    },
    customerName: string,
    customerPhone: string, //miss
    customerId: string,
    totalPrice: number,
    cashDiscount: number,
    quantityDelivered: number,
    quantityOrdered: number,
    quantityInStock: number,
    orderDate: Date,
    quantityLack: number,

    quantityStatus: {
        id: number,
        name: string
    }, // miss

    processStatusChips?: any[], // Trạng thái đơn
    quantityStatusChips?: any[], // Trạng thái số lượng
    quantityProductRatio: number,
    quantityDeliverRatio: number,
}
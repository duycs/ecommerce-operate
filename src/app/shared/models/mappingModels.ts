import { Injectable } from "@angular/core";
import { ConfigService } from "../config.service";
import { OrderDetailDto, ProductAttribute, ProductChildren } from "./order/orderDetailDto";
import { OrderDto } from "./order/orderDto";
import { ProductDetailDto } from "./product/productDetailDto";
import { ProductDto } from "./product/productDto";

@Injectable({
    providedIn: 'root'
})

export class MappingModels {

    constructor(private configService: ConfigService) {
    }

    // mapping orderDetailDtos
    public MappingDisplayFieldsOfOrderDetail(orderDetailDto: OrderDetailDto) {
        orderDetailDto.detail.processStatusChips = this.MappingDisplayProcessStatusChips(orderDetailDto.detail.orderStatus);
        orderDetailDto = this.MappingDisplaySupplierOrders(orderDetailDto);
        this.MappingDisplayQuantityPriceOrderDetail(orderDetailDto);
        orderDetailDto.detail.customerPhoneHidden = this.replaceCustomerPhone(orderDetailDto.detail.customerPhone);
        return orderDetailDto;
    }

    public MappingDisplaySupplierOrders(orderDetailDto: OrderDetailDto) {
        if (orderDetailDto.supplierOrders && orderDetailDto.supplierOrders.length > 0) {
            orderDetailDto.supplierOrders.forEach((supplierOrder: any) => {
                supplierOrder.processStatusChips = this.MappingDisplayProcessStatusChips(supplierOrder.orderStatus);
                supplierOrder.quantity = 0;
                supplierOrder.products.forEach((p: any) => {
                    supplierOrder.quantity += p.quantity;
                });
                supplierOrder.quantiyDeliverRatio = (supplierOrder.quantityDelivered / supplierOrder.quantityOrdered) * 100;
                supplierOrder.quantityProductRatio = (supplierOrder.quantityInStock / (supplierOrder.quantityOrdered - supplierOrder.quantityDelivered)) * 100;
                supplierOrder.quantiyDeliverRatioColorClass = supplierOrder.quantiyDeliverRatio < 100 ? 'progress-orange' : (supplierOrder.quantiyDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
                supplierOrder.quantityProductRatioColorClass = supplierOrder.quantityProductRatio < 100 ? 'progress-orange' : (supplierOrder.quantityProductRatio == 100 ? 'progress-green' : 'progress-blue');
            });
        }

        orderDetailDto = this.MappingQuantityOrder(orderDetailDto);

        return orderDetailDto;
    }

    public replaceCustomerPhone(customerPhone: string) {
        let arr = customerPhone.split('');
        let i = 0;
        while (i < 7) {
            arr[i] = "*";
            i++;
        }

        return arr.join('');
    }

    public MappingQuantityOrder(order: any) {
        if (order.supplierOrder) {
            order.supplierOrder.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(order.supplierOrder.quantityDelivered, order.supplierOrder.quantityOrdered);
            order.supplierOrder.processStatusChips = this.MappingDisplayProcessStatusChips(order.supplierOrder.orderStatus);
            order.supplierOrder.quantity = 0;
            order.supplierOrder.products.forEach((p: any) => {
                order.supplierOrder.quantity += p.quantity;
            });
            order.supplierOrder.quantiyDeliverRatio = (order.supplierOrder.quantityDelivered / order.supplierOrder.quantityOrdered) * 100;
            order.supplierOrder.quantityProductRatio = (order.supplierOrder.quantityInStock / (order.supplierOrder.quantityOrdered - order.supplierOrder.quantityDelivered)) * 100;
            order.quantiyDeliverRatioColorClass = order.supplierOrder.quantiyDeliverRatio < 100 ? 'progress-orange' : (order.supplierOrder.quantiyDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
            order.quantityProductRatioColorClass = order.supplierOrder.quantityProductRatio < 100 ? 'progress-orange' : (order.supplierOrder.quantityProductRatio == 100 ? 'progress-green' : 'progress-blue');
        }

        return order;
    }

    public MappingStaffs(staffs: any[]) {
        staffs.forEach((staff: any) => {
            staff = this.MappingStaff(staff);
        });

        return staffs;
    }

    public MappingStaff(staff: any) {
        if (staff.active) {
            staff.statusChips = [{ "color": "primary", name: "hoạt động" }];
        } else {
            staff.statusChips = [{ "color": "orange", name: "Không hoạt động" }];
        }

        if (staff.staffMoneyAccounts && staff.staffMoneyAccounts.length > 0) {
            staff.moneyAccountChips = staff.staffMoneyAccounts.map((c: any) => { return { name: c.moneyAccountName, id: c.moneyAccountId } });
        }

        return staff;
    }

    public MappingStatusChips(data: any) {
        data.forEach((element: any) => {
            element = this.MappingStatusChip(element);
        });

        return data;
    }

    public MappingStatusChip(data: any) {
        if (data.isActive) {
            data.statusChips = [{ "color": "primary", name: "hoạt động" }];
        } else {
            data.statusChips = [{ "color": "orange", name: "Không hoạt động" }];
        }

        return data;
    }

    public MappingMoneyChips(data: any) {
        data.forEach((element: any) => {
            let money = this.configService.getCurrencyDisplay(element.totalMoney);
            let moneyChips: any = [];
            switch (element.categoryTypeId) {
                case 1:
                    moneyChips.push({ "color": "primary", name: `+ ${money}` });
                    break;

                case 2:
                    moneyChips.push({ "color": "orange", name: `- ${money}` });
                    break;

                case 3:
                    moneyChips.push({ "color": "primary", name: `+ ${money}` });
                    break;

                case 4:
                    moneyChips.push({ "color": "orange", name: `- ${money}` });
                    break;
            }
            element.moneyChips = moneyChips;
        });

        return data;
    }

    public MappingDisplayReceiptStatusChips(order: any) {
        let importReceiptStatusChips = [];
        if (order.importReceiptStatus) {
            switch (order.importReceiptStatus.Id) {
                case 0:
                    importReceiptStatusChips.push({ "color": "primary", name: order.importReceiptStatus.Name });
                    break;

                case 1:
                    importReceiptStatusChips.push({ "color": "#7C4B85", name: order.importReceiptStatus.Name });
                    break;

                case 2:
                    importReceiptStatusChips.push({ "color": "#FFBD8C", name: order.importReceiptStatus.Name });
                    break;

                case 3:
                    importReceiptStatusChips.push({ "color": "#9c27b0", name: order.importReceiptStatus.Name }); // Đang nhập
                    break;

                case 4:
                    importReceiptStatusChips.push({ "color": "#31AD3E", name: order.importReceiptStatus.Name });
                    break;

                case 5:
                    importReceiptStatusChips.push({ "color": "#7C4B85", name: order.importReceiptStatus.Name });
                    break;

                default:
                    importReceiptStatusChips.push({ "color": "none", name: order.importReceiptStatus.Name });
                    break;

            }

            order.importReceiptStatusChips = importReceiptStatusChips;
        }

        return order;
    }

    public MappingDisplayFieldsOfOrderDelivers(orders: any[]) {
        orders.forEach(order => {
            order.deliveryOrderStatusChips = this.MappingDeliveryOrderStatus(order.deliveryOrderStatus);
            order.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(order.importedQuantity, order.quantity);
            order.quantityDeliverRatio = order.quantity !== 0 ? (order.importedQuantity / order.quantity) * 100 : 0;
            order.quantityDeliverRatioColorClass = order.quantityDeliverRatio < 100 ? 'progress-orange' : (order.quantityDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
        });

        return orders;
    }

    public MappingDeliveryOrderStatus(deliveryOrderStatus: any) {
        let deliveryOrderStatusChips = [];
        if (deliveryOrderStatus) {
            switch (deliveryOrderStatus.Id) {
                case 0:
                    deliveryOrderStatusChips.push({ "color": "primary", name: deliveryOrderStatus.Name });
                    break;

                case 1:
                    deliveryOrderStatusChips.push({ "color": "#FFC107", name: deliveryOrderStatus.Name }); // đang tạo, vàng cam
                    break;

                case 2:
                    deliveryOrderStatusChips.push({ "color": "#FF9800", name: deliveryOrderStatus.Name }); // chờ nhập, cam
                    break;

                case 3:
                    deliveryOrderStatusChips.push({ "color": "#9C27B0", name: deliveryOrderStatus.Name }); // đang nhập, tím
                    break;

                case 4:
                    deliveryOrderStatusChips.push({ "color": "#4CAF50", name: deliveryOrderStatus.Name }); // đã quyết toán, xanh lá
                    break;

                case 5:
                    deliveryOrderStatusChips.push({ "color": "#F44336", name: deliveryOrderStatus.Name }); // đã hủy, xanh lá
                    break;

                default:
                    deliveryOrderStatusChips.push({ "color": "primary", name: deliveryOrderStatus.Name });
                    break;
            }
        }

        return deliveryOrderStatusChips;
    }

    // mapping order enter
    public MappingDisplayFieldsOfOrderEnters(orders: any[]) {
        orders.forEach(order => {
            let importReceiptStatusChips = [];
            if (order.importReceiptStatus) {
                switch (order.importReceiptStatus.Id) {
                    case 0:
                        importReceiptStatusChips.push({ "color": "primary", name: order.importReceiptStatus.Name });
                        break;

                    case 1:
                        importReceiptStatusChips.push({ "color": "#7C4B85", name: order.importReceiptStatus.Name }); // đang tạo, vàng cam
                        break;

                    case 2:
                        importReceiptStatusChips.push({ "color": "#FF9800", name: order.importReceiptStatus.Name }); // chờ nhập, cam
                        break;

                    case 3:
                        importReceiptStatusChips.push({ "color": "#9C27B0", name: order.importReceiptStatus.Name }); // đang nhập, tím
                        break;

                    case 4:
                        importReceiptStatusChips.push({ "color": "#4CAF50", name: order.importReceiptStatus.Name }); // đã quyết toán, xanh lá
                        break;

                    case 5:
                        importReceiptStatusChips.push({ "color": "#F44336", name: order.importReceiptStatus.Name }); // đã hủy, 
                        break;

                    default:
                        importReceiptStatusChips.push({ "color": "primary", name: order.importReceiptStatusStatus.Name });
                        break;
                }
            }
            order.importReceiptStatusChips = importReceiptStatusChips;
            order.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(order.quantityImport, order.quantityDelivered);
            order.quantityRatio = ~~order.quantityDelivered !== 0 ? (order.quantityImport / order.quantityDelivered) * 100 : 0;
            order.quantityRatioColorClass = order.quantityRatio < 100 ? 'progress-orange' : (order.quantityRatio == 100 ? 'progress-green' : 'progress-blue');
        });

        return orders;
    }

    // maping orderDtos
    public MappingDisplayFieldsOfOrders(orders: any[]) {
        orders.forEach(order => {
            order = this.MappingDisplayProcessStatusFieldsOfOrder(order);
            order = this.MappingDisplayQuantityStatusFieldsOfOrder(order);
            order.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(order.quantityDelivered, order.quantityOrdered);
            order.quantityDeliverRatio = order.quantityOrdered !== 0 ? (order.quantityDelivered / (order.quantityOrdered ?? order.quantity)) * 100 : 0;
            order.quantityProductRatio = order.quantityInStock / (order.quantityOrdered - order.quantityDelivered) * 100;

            order.quantityDeliverRatioColorClass = order.quantityDeliverRatio < 100 ? 'progress-orange' : (order.quantityDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
            order.quantityProductRatioColorClass = order.quantityProductRatio < 100 ? 'progress-orange' : (order.quantityProductRatio == 100 ? 'progress-green' : 'progress-blue');
        });

        return orders;
    }

    public MappingDisplayFieldsOfOrderSubs(orders: any[]) {
        orders.forEach(order => {
            let processStatusChips = [];
            if (order.orderStatus) {
                switch (order.orderStatus.Id) {
                    case 0:
                        processStatusChips.push({ "color": "primary", name: order.orderStatus.Name });
                        break;

                    case 1:
                        processStatusChips.push({ "color": "#9C27B0", name: order.orderStatus.Name }); // chờ xác nhận, tím
                        break;

                    case 2:
                        processStatusChips.push({ "color": "#FF9800", name: order.orderStatus.Name }); // đang xử lý, cam
                        break;

                    case 3:
                        processStatusChips.push({ "color": "#4CAF50", name: order.orderStatus.Name }); // đã giao hàng, xanh lá
                        break;

                    case 4:
                        processStatusChips.push({ "color": "#E91E63", name: order.orderStatus.Name }); // từ chối, hồng
                        break;

                    case 5:
                        processStatusChips.push({ "color": "#F44336", name: order.orderStatus.Name }); // đã hủy, đỏ
                        break;

                    default:
                        processStatusChips.push({ "color": "primary", name: order.orderStatus.Name });
                        break;
                }
            }

            order.processStatusChips = processStatusChips;

            order = this.MappingDisplayQuantityStatusFieldsOfOrder(order);
            order.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(order.quantityDelivered, order.quantityOrdered);
            order.quantityDeliverRatio = order.quantityOrdered !== 0 ? (order.quantityDelivered / (order.quantityOrdered ?? order.quantity)) * 100 : 0;
            order.quantityProductRatio = order.quantityInStock / (order.quantityOrdered - order.quantityDelivered) * 100;

            order.quantityDeliverRatioColorClass = order.quantityDeliverRatio < 100 ? 'progress-orange' : (order.quantityDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
            order.quantityProductRatioColorClass = order.quantityProductRatio < 100 ? 'progress-orange' : (order.quantityProductRatio == 100 ? 'progress-green' : 'progress-blue');
        });

        return orders;
    }

    public MappingDisplayProcessStatusFieldsOfOrder(order: OrderDto) {
        order.processStatusChips = this.MappingDisplayProcessStatusChips(order.orderStatus);
        return order;
    }

    public MappingDisplayQuantityStatusFieldsOfOrder(order: OrderDto) {
        order.quantityStatusChips = this.MappingDisplayQuantityStatusChips(order.quantityStatus);
        return order;
    }

    public MappingDisplayProcessStatusChips(orderStatus: any) {
        let processStatusChips = [];
        if (orderStatus) {
            switch (orderStatus.Id) {
                case 0:
                    processStatusChips.push({ "color": "primary", name: orderStatus.Name });
                    break;

                case 1:
                    processStatusChips.push({ "color": "#9C27B0", name: orderStatus.Name }); // chờ xác nhận, tím
                    break;

                case 2:
                    processStatusChips.push({ "color": "#FF9800", name: orderStatus.Name }); // đang xử lý, cam
                    break;

                case 3:
                    processStatusChips.push({ "color": "#4CAF50", name: orderStatus.Name }); // đã giao hàng, xanh lá cây
                    break;

                case 4:
                    processStatusChips.push({ "color": "#E91E63", name: orderStatus.Name }); // từ chối, hồng
                    break;

                case 5:
                    processStatusChips.push({ "color": "#F44336", name: orderStatus.Name }); // đã hủy, đỏ
                    break;

                default:
                    processStatusChips.push({ "color": "primary", name: orderStatus.Name });
                    break;
            }
        }

        return processStatusChips;
    }

    public MappingDisplayQuantityStatusByQuantityChips(quantity1: number, quantity2: number) {
        let quantityStatusChips = [];
        if (quantity1 > quantity2) {
            quantityStatusChips.push({ "color": "#0336FF", name: "Thừa hàng" });
        } else if (quantity1 < quantity2) {
            quantityStatusChips.push({ "color": "orange", name: "Thiếu hàng" });
        } else {
            quantityStatusChips.push({ "color": "primary", name: "Đủ hàng" });
        }

        return quantityStatusChips;
    }



    public MappingDisplayQuantityStatusChips(quantityStatus: any) {
        let quantityStatusChips = [];
        if (quantityStatus) {
            switch (quantityStatus) {
                case 0:
                    quantityStatusChips.push({ "color": "primary", name: quantityStatus?.name });
                    break;

                case 1:
                    quantityStatusChips.push({ "color": "orange", name: quantityStatus?.name });
                    break;

                default:
                    quantityStatusChips.push({ "color": "primary", name: quantityStatus?.name });
                    break;
            }
        }

        return quantityStatusChips;
    }

    public MappingDisplayMoneyStatusChips(data: any) {
        data.forEach((item: any) => {
            let money = this.configService.getCurrencyDisplay(item.totalMoney);
            let moneyStatusChips = [];
            if (item.objectType) {
                switch (item.objectType.id) {
                    case 1:
                        moneyStatusChips.push({ "color": "primary", name: `+ ${money}` });
                        break;

                    case 2:
                        moneyStatusChips.push({ "color": "orange", name: `- ${money}` });
                        break;

                    default:
                        moneyStatusChips.push({ "color": "primary", name: money });
                        break;
                }
                item.moneyStatusChips = moneyStatusChips;
            }
        });

        return data;
    }

    public MappingDisplayDebtTransactionStatusChips(data: any) {
        data.forEach((item: any) => {
            let money = this.configService.getCurrencyDisplay(item.totalMoney);
            let moneyStatusChips = [];
            if (item.categoryType) {
                if (item.categoryType.type === "in") {
                    moneyStatusChips.push({ "color": "primary", name: `+ ${money}` });
                } else if (item.categoryType.type === "out") {
                    moneyStatusChips.push({ "color": "orange", name: `- ${money}` });
                } else {
                    moneyStatusChips.push({ "color": "primary", name: `${money}` });
                }

                item.moneyStatusChips = moneyStatusChips;
            }
        });

        return data;
    }



    public MappingDisplayAttributesFieldOfOrderDetail(productAttributes: ProductAttribute[]) {
        if (productAttributes && productAttributes.length > 0) {
            let attributeDescription = productAttributes.map(a => a.name);
            return attributeDescription.join('/');
        }
        return "";
    }

    public MappingDisplayAttributes(product: ProductChildren) {
        if (product.attributes) {
            let attributeNames = product.attributes.filter((a: any) => a.priority < 2).map((b: any) => b.name);
            let details = product.attributes.filter((a: any) => a.priority > 1).map((b: any) => b.name);
            product.detail = details?.join('/') ?? '';
            product.attributeName = attributeNames?.join('/') ?? '';
        }
        return product;
    }

    public mappingProductOrderDetail(products: any[]) {
        products.forEach((p: any) => {
            // mapping display detail attribute, ex: size or color/quantity
            p.productColors = this.MappingDisplayAttributes2(p.children, p);
            p.children.forEach((p: any) => {
                //p = this.MappingDisplayAttributes(p);
                p.totalPrice = this.MappingDisplayTotalPriceProductChildren(p);
                //p.percentDiscount = this.mappingModels.MappingDisplayPercentDiscountProductChildren(p);
            })

            p.quantity = p.children?.map((c: any) => c?.quantity ?? 0)?.reduce(function (total: any, item: any) { return total += item });
            p.quantityDelivered = p.children?.map((c: any) => c?.quantityDelivered ?? 0)?.reduce(function (total: any, item: any) { return total += item });
            p.quantityInStock = p.children?.map((c: any) => c?.quantityInStock ?? 0)?.reduce(function (total: any, item: any) { return total += item });
            p.quantityLeft = p.children?.map((c: any) => c?.quantityLeft ?? 0)?.reduce(function (total: any, item: any) { return total += item });

            p.quantiyDeliverRatio = p.quantity > 0 ? (p.quantityDelivered / p.quantity) * 100 : 0;
            p.quantityProductRatio = p.quantityLeft > 0 ? (p.quantityInStock / p.quantityLeft) * 100 : 0;

            p.quantiyDeliverRatioColorClass = p.quantiyDeliverRatio < 100 ? 'progress-orange' : (p.quantiyDeliverRatio == 100 ? 'progress-green' : 'progress-blue');
            p.quantityProductRatioColorClass = p.quantityProductRatio < 100 ? 'progress-orange' : (p.quantityProductRatio == 100 ? 'progress-green' : 'progress-blue');
        })

        return products;
    }

    public MappingDisplayAttributes2(children: any[], product?: any) {

        let productColors: any[] = [];

        if (children && children.length == 0) return [];

        // set index
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            child.attributes.forEach((c: any) => {
                c.index = i;
                c.quantity = child.quantity;
                c.quantityDelivered = child.quantityDelivered;
                c.quantityInStock = child.quantityInStock;
                c.quantityLeft = child.quantityLeft;
                c.price = child.price;
                c.discountPrice = child.discountPrice
            });
        }


        let attributes = children.map((c: any) => c.attributes).flat(1);
        let attributeColors = attributes.filter((c: any) => c.priority === 1);
        attributeColors = [...new Map(attributeColors.map((m: any) => [m.name, m])).values()]; // remove duplicate

        attributeColors.forEach((c: any) => {
            let indexs = attributes.filter((a: any) => a.name === c.name).map((b: any) => b.index);
            let sizes = attributes.filter((c: any) => indexs.includes(c.index) && c.priority === 2 && c.quantity > 0)

            if (sizes && sizes.length > 0) {
                sizes = this.sortArrayOfObjects(sizes, "name", 'descending');

                //let sizeNames = sizes.map((c: any) => { return `${c.name}${c.quantity}` });
                let totalQuantity = sizes?.map((c: any) => c?.quantity ?? 0)?.reduce(function (total: any, item: any) { return total += item });
                let totalQuantityDelivered = sizes?.map((c: any) => c?.quantityDelivered ?? 0)?.reduce(function (total: any, item: any) { return total += item });
                let totalQuantityInStock = sizes?.map((c: any) => c?.quantityInStock ?? 0)?.reduce(function (total: any, item: any) { return total += item });
                let totalQuantityLeft = sizes?.map((c: any) => c?.quantityLeft ?? 0)?.reduce(function (total: any, item: any) { return total += item });

                let totalPrice = 0;
                sizes.forEach((s: any) => {
                    totalPrice += s.price * s.quantity;
                });

                let discountPrice = 0;
                sizes.forEach((s: any) => {
                    discountPrice += (s?.discountPrice ?? 0) * s.quantity;
                });

                let productColor = {
                    productId: product.id,
                    productName: product?.name,
                    productSku: product?.sku,
                    index: c.index,
                    colorId: c.id,
                    name: c.name, // color
                    detail: sizes, //sizeNames.join(' ') ?? '', // [size/quantity]
                    totalQuantity: totalQuantity,
                    totalQuantityDelivered: totalQuantityDelivered,
                    totalQuantityInStock: totalQuantityInStock,
                    totalQuantityLeft: totalQuantityLeft,
                    totalPrice: totalPrice,
                    price: c.price,
                    discountPrice: discountPrice,
                }

                productColors.push(productColor);
            }
        });

        return productColors;
    }

    public MappingDisplayTotalPriceProductChildren(productChildren: any) {
        return (productChildren.price * productChildren.quantity);
    }

    public MappingDisplayPercentDiscountProductChildren(productChildren: any) {
        if (productChildren.totalPrice && productChildren.totalPrice > 0) {
            return (productChildren.discountPrice * productChildren.totalPrice);
        }

        return 0;
    }

    public MappingDisplayQuantityPriceOrderDetail(orderDetail: any) {
        let totalPrice = 0;
        let quantity = 0;
        let cashDiscount = 0;
        let cashProductDiscount = 0;
        let totalQuantityInStock = 0;
        let totalQuantityDelivered = 0;
        let totalQuantityOrdered = 0;

        // order has many suppliers
        if (orderDetail.supplierOrders && orderDetail.supplierOrders.length > 0) {
            orderDetail.supplierOrders.forEach((s: any) => {
                totalPrice += s.totalPrice;
                quantity += s.quantity ?? 0;
                cashDiscount += s.cashDiscount;
                cashProductDiscount += s.cashDiscount;
                totalQuantityInStock += s.quantityInStock;
                totalQuantityDelivered += s.quantityDelivered;
                totalQuantityOrdered += s.quantityOrdered;
            });
        }

        // sub order has one supplier
        if (orderDetail.supplierOrder) {
            totalPrice += orderDetail.supplierOrder.totalPrice;
            quantity += orderDetail.supplierOrder.quantity ?? 0;
            cashDiscount += orderDetail.supplierOrder.cashDiscount;
            cashProductDiscount += orderDetail.supplierOrder.cashDiscount;
            totalQuantityInStock += orderDetail.supplierOrder.quantityInStock;
            totalQuantityDelivered += orderDetail.supplierOrder.quantityDelivered;
            totalQuantityOrdered += orderDetail.supplierOrder.quantityOrdered;
        }

        orderDetail.detail.cashDiscount = cashDiscount;
        orderDetail.detail.totalQuantity = quantity;
        orderDetail.detail.totalPrice = totalPrice;
        orderDetail.detail.cashProductDiscount = cashProductDiscount;
        orderDetail.detail.percentOrderDiscount = (cashDiscount / totalPrice) * 100;
        orderDetail.detail.totalPriceAfterDiscount = totalPrice - cashDiscount;
        orderDetail.detail.quantityStatusChips = this.MappingDisplayQuantityStatusByQuantityChips(totalQuantityDelivered, totalQuantityOrdered);
        return orderDetail;
    }

    public ToDisplayPostDtos(postDtos: any[]) {
        postDtos.forEach((postDto: any) => {
            postDto = this.ToDisplayPostDto(postDto);
        });

        return postDtos;
    }

    public ToDisplayPostDto(postDto: any) {
        postDto.statusChips = [];
        postDto.approveChips = [];

        switch (postDto.isDeleted) {
            case true:
                postDto.statusChips?.push({ "color": "orange", name: "Đã xóa" })
                break;

            case false:
                postDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                break;

            default:
                postDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        switch (postDto.isApproved) {
            case true:
                postDto.approveChips?.push({ "color": "primary", name: "Đã duyệt" })
                break;

            case false:
                postDto.approveChips?.push({ "color": "orange", name: "Từ chối" })
                break;

            default:
                postDto.approveChips?.push({ "color": "#9E9E9E", name: "Chưa duyệt" })
                break;
        }

        return postDto;
    }

    public ToDisplayProductGroupDtos(productGroupDtos: any[]) {
        productGroupDtos.forEach((group: any) => {
            group = this.ToDisplayProductGroupDto(group);
        });

        return productGroupDtos;
    }

    public ToDisplayProductGroupDto(group: any) {
        group.visibleChips = [];

        switch (group.visible) {
            case true:
                group.visibleChips?.push({ "color": "primary", name: "Hiển thị" })
                break;

            case false:
                group.visibleChips?.push({ "color": "orange", name: "Không hiển thị" })
                break;

            default:
                group.visibleChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        return group;
    }

    public ToDisplayProductDtos(productDtos: ProductDto[]) {
        productDtos.forEach((productDto: any) => {
            productDto = this.ToDisplayProductDto(productDto);
        });

        return productDtos;
    }

    public ToDisplayProductDto(productDto: any) {
        productDto.statusChips = [];
        productDto.approveChips = [];

        switch (productDto.isActived) {
            case true:
                productDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                break;

            case false:
                productDto.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
                break;

            default:
                productDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        // switch (productDto.isApproved) {
        //     case true:
        //         productDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
        //         break;

        //     case false:
        //         productDto.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
        //         break;

        //     default:
        //         productDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
        //         break;
        // }

        switch (productDto.isApproved) {
            case true:
                productDto.approveChips?.push({ "color": "primary", name: "Đã duyệt" })
                break;

            case false:
                productDto.approveChips?.push({ "color": "orange", name: "Từ chối" })
                break;

            default:
                productDto.approveChips?.push({ "color": "#9E9E9E", name: "Chưa duyệt" })
                break;
        }

        if (!productDto?.applyTemplateSettings || productDto.applyTemplateSettings.length === 0) {
            productDto.applyProductPriceSettingChips = [{ color: "orange", name: "chưa thiết lập" }];
        }

        return productDto;
    }

    public ToDisplayCustomerDtos(customerDtos: any[]) {
        customerDtos.forEach((customer: any) => {
            customer = this.ToDisplayCustomerDto(customer);
        });

        return customerDtos;
    }

    public ToDisplayCustomerDto(customerDto: any) {
        customerDto.statusChips = [];
        switch (customerDto.isActivated) {
            case true:
                customerDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                break;

            case false:
                customerDto.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
                break;

            default:
                customerDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        return customerDto;
    }

    public ToDisplayTransporterDtos(transporters: any[]) {
        transporters.forEach((transporter: any) => {
            transporter = this.ToDisplayTransporterDto(transporter);
        });

        return transporters;
    }

    public ToDisplayTransporterDto(transporter: any) {
        transporter.statusChips = [];
        switch (transporter.isAcivated) {
            case true:
                transporter.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                break;

            case false:
                transporter.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
                break;

            default:
                transporter.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        let shopChips: any = [];
        transporter.transporterShops.forEach((s: any) => {
            shopChips.push({ id: s.shopId, name: s.shopName, color: 'primary' });
        })

        transporter.shopChips = shopChips;

        return transporter;
    }


    public ToDisplayShopDtos(shopDtos: any[]) {
        shopDtos.forEach((shopDto: any) => {
            shopDto.statusChips = [];
            switch (shopDto.isActived) {
                case true:
                    shopDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                    break;

                case false:
                    shopDto.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
                    break;

                default:
                    shopDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                    break;
            }
        });

        return shopDtos;
    }

    public ToDisplayShopDto(shopDto: any) {
        shopDto.statusChips = [];
        switch (shopDto.isActived) {
            case true:
                shopDto.statusChips?.push({ "color": "primary", name: "Hoạt động" })
                break;

            case false:
                shopDto.statusChips?.push({ "color": "orange", name: "Không hoạt động" })
                break;

            default:
                shopDto.statusChips?.push({ "color": "#9E9E9E", name: "Unknown" })
                break;
        }

        return shopDto;
    }


    public ToDisplayProductDetailDto(productDetailDto: ProductDetailDto) {
        productDetailDto.statusChips = [];
        switch (productDetailDto.isApproved) {
            case true:
                productDetailDto.statusChips?.push({ color: "primary", name: 'Đã duyệt' })
                break;

            case false:
                productDetailDto.statusChips?.push({ color: "orange", name: 'Chưa phê duyệt' })
                break;

            default:
                productDetailDto.statusChips?.push({ color: "#9E9E9E", name: 'Unknown' })
                break;
        }

        productDetailDto.sizeChips = productDetailDto.attributes
            .filter((p: any) => p.priority === 2).map((p: any) => {
                return { id: p.id, name: p.value, color: "primary" }
            });

        productDetailDto.colorChips = productDetailDto.attributes
            .filter((p: any) => p.priority === 1).map((p: any) => {
                return { id: p.id, name: p.value, color: "primary" }
            });

        productDetailDto.children.forEach((child: any) => {
            child.attributeChips = child.attributes.map((a: any) => {
                return { name: `${a.attributeName}: ${a.value}`, color: "primary" }
            });
        })

        return productDetailDto;
    }

    public ToDisplayProductPriceSettingDtos(productPriceSettings: any[]) {
        productPriceSettings.forEach((item: any) => {
            item = this.ToDisplayProductPriceSettingDto(item);
        })

        return productPriceSettings;
    }

    public ToDisplayProductPriceSettingDto(productPriceSetting: any) {
        productPriceSetting.statusChips = [];

        if (productPriceSetting.price < productPriceSetting.upPrice) {
            productPriceSetting.statusChips?.push({ "color": "#0336FF", name: "tăng giá" });
        } else if (productPriceSetting.price > productPriceSetting.upPrice) {
            productPriceSetting.statusChips?.push({ "color": "orange", name: "giảm giá" });
        } else {
            productPriceSetting.statusChips?.push({ "color": "primary", name: "giữ giá" });
        }

        return productPriceSetting;
    }


    mappingDisplayProductAttribute(product: any) {
        let colors = product.attributes.filter((a: any) => a.code === 'color');
        let colorSizes: any[] = [];
        colors.forEach((c: any) => {
            let sizes: any[] = [];
            let quantity = 0;
            let childId: any;
            let colorId: any;
            let matchColor = false;
            product.children.forEach((child: any) => {
                matchColor = child.attributes.filter((a: any) => Boolean(a.id === c.id)); //Error: dialogRef instancecleanupfn is not a function
                if (matchColor) {
                    colorId = c.id;
                    childId = child.id;
                    let sizeNumbers = child.attributes.filter((a: any) => a.code === 'size').map((s: any) => {
                        return {
                            id: childId,
                            size: ~~s.value,
                            quantity: child.quantityInInventory
                        }
                    });

                    if (sizeNumbers && sizeNumbers.length > 0) {
                        sizes.push(...sizeNumbers)
                    }

                    quantity = child.quantityInInventory;
                }
            });

            if (matchColor) {
                colorSizes.push({
                    id: c.id,
                    name: c.value,
                    code: c.name,
                    sizes: sizes,
                    total: this.sumQuantity(sizes),
                    sizeAll: 1
                })
            }
        });

        product.colorSizes = colorSizes;
        return product;
    }

    sumQuantity(sizes: any[]) {
        if (sizes && sizes.length > 0) {
            return sizes.map((s: any) => s.quantity).reduce(function (a, c) {
                return a + c;
            })

        } else return;
    }

    sortArrayOfObjects = (arr: any[], propertyName: any, order = 'ascending') => {
        const sortedArr = arr.sort((a, b) => {
            if (a[propertyName] < b[propertyName]) {
                return -1;
            }
            if (a[propertyName] > b[propertyName]) {
                return 1;
            }
            return 0;
        });

        if (order === 'descending') {
            return sortedArr.reverse();
        }

        return sortedArr;
    };
}
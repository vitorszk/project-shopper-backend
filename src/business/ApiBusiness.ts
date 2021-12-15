import { ApiDatabase } from "../data/ApiDatabase";
import { OrderInputDTO, Product, ProductInputDTO, ProductInStockDTO } from "../model/Order";
import { GenerateId } from "../services/generateId";

export class ApiBusiness {

    async getInventory(): Promise<Product[]> {
        const apiDatabase = new ApiDatabase();
        const inventory = await apiDatabase.getInventory()

        return inventory
    }

    async createOrder(order: OrderInputDTO) {
        if (
            !order.client_name ||
            !order.delivery_date ||
            !order.amount
        ) {
            throw new Error("Por favor, preencha todas as informações!")
        }

        const genId = new GenerateId()
        const id: string = genId.generate()

        const dateNow = Date.now()
        const created_at = new Date(dateNow).toISOString()

        const newOrder = { id, ...order, created_at }
        const apiDatabase = new ApiDatabase()
        await apiDatabase.createOrder(newOrder)

        return id
    }

    async verifyStock(products: ProductInputDTO[], amount: number) {
        const apiDatabase = new ApiDatabase()
        const promises = products.map(({ id }) =>
            apiDatabase.getProductById(id)
        )

        const productInStock = await Promise.all(promises).then(values => values)

        const invalidProducts = this.verifyQuantity(products, productInStock)

        if (invalidProducts.length > 0) throw new Error(`Produtos invalidos: ${invalidProducts.map(({ id }) => id)}`)

        const amountByStock = this.verifyAmount(products, productInStock)

        if (amountByStock !== amount) throw new Error(`Valor total divergente, deveria ser ${amountByStock}`)


    }

    async createOrderDetail(products: ProductInputDTO[], order_id: string) {
        const apiDatabase = new ApiDatabase();
        const promises = products.map(item => {
            const genId = new GenerateId()
            const id: string = genId.generate()
            const orderDetail = { id, product_id: item.id, order_id, product_qty: item.qty, product_price: item.price }
            return apiDatabase.createOrderDetail(orderDetail)
        })

        await Promise.all(promises)
    }

    verifyQuantity(productReq: ProductInputDTO[], productInStock: ProductInStockDTO[]) {
        const invalidProducts = productReq.filter(element => productInStock.find(element2 => this.validateWriteOff(element, element2)));
        return invalidProducts
    }

    validateWriteOff(productReq: ProductInputDTO, productInStock: ProductInStockDTO) {
        return productReq.id === productInStock.id && productInStock.qty_stock - productReq.qty < 0
    }


    verifyAmount(productReq: ProductInputDTO[], productInStock: ProductInStockDTO[]) {
        let amount = 0

        productReq.forEach(element => {
            const priceInStock = productInStock.find(element2 => element.id === element2.id)?.price
            if (!priceInStock) throw new Error('Produto sem preco')
            amount = amount + this.amountByProduct(priceInStock, element.qty)
        });

        return amount
    }

    amountByProduct(price: number, qty: number) {
        return price * qty
    }



}
export interface ApiProduct  {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null
}


// для удобства работы с отображением
export interface ProductViewModel extends ApiProduct {
    inBasket: boolean
}

export interface BasketItem {
    product: ApiProduct;
    quantity: number
}

export interface PaymentInfo {
    paymentMethod: "Онлайн" | "При получении";
    address: string
}

export interface ContactInfo {
    email: string;
    phone: string
}


export interface Order {
        payment: "online" | "cash",
        email: string,
        phone: string,
        address: string,
        total: number,
        items: string[]
}
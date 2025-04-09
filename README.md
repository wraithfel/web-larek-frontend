@startuml
title UML Диаграмма для WebLarek

' --- Типы данных ---
package "Типы данных" {
  class ApiProduct {
    - id: string
    - description: string
    - image: string
    - title: string
    - category: string
    - price: number | null
  }

  class ProductViewModel {
    - inBasket: boolean
    --
    + getDisplayPrice(): string
  }
  ApiProduct <|-- ProductViewModel

  class BasketItem {
    - product: ApiProduct
    - quantity: number
  }

  class PaymentInfo {
    - paymentMethod: "Онлайн" | "При получении"
    - address: string
  }

  class ContactInfo {
    - email: string
    - phone: string
  }

  class Order {
    - payment: "online" | "cash"
    - email: string
    - phone: string
    - address: string
    - total: number
    - items: string[]
  }
}

' --- Базовые классы ---
package "Базовые классы" {
  class Api {
    - baseUrl: string
    - options: RequestInit
    --
    + get(uri: string): Promise<object>
    + post(uri: string, data: object, method?: "POST"|"PUT"|"DELETE"): Promise<object>
    - handleResponse(response: Response): Promise<object>
  }

  class EventEmitter {
    - _events: Map<EventName, Set<Subscriber>>
    --
    + on<T>(eventName: EventName, callback: (data: T) => void): void
    + off(eventName: EventName, callback: Subscriber): void
    + emit<T>(eventName: string, data?: T): void
    + onAll(callback: (event: EmitterEvent) => void): void
    + offAll(): void
    + trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void
  }
}

' --- Контроллер / UI ---
package "Контроллер / UI" {
  class AppController {
    --
    + init(): void
  }

  class ProductCard {
    --
    + render(product: ProductViewModel): HTMLElement
  }

  class ProductModal {
    --
    + show(product: ProductViewModel): void
    + hide(): void
  }

  class Basket {
    --
    + addItem(item: BasketItem): void
    + removeItem(productId: string): void
  }

  class OrderForm {
    --
    + submitOrder(paymentInfo: PaymentInfo, contactInfo: ContactInfo, total: number, items: string[]): Order
  }
}

AppController --> Api : использует
AppController --> EventEmitter : управляет событиями
ProductCard ..> ProductViewModel : отображает данные
ProductModal ..> ProductViewModel : показывает подробности
Basket ..> BasketItem : содержит
OrderForm ..> Order : формирует

@enduml

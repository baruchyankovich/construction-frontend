export interface Order {
    id: number;
    siteId: number;
    product: string;
    quantity: number;
    date: Date;
    status: string;
  }
  
  export interface CreateOrderModel {
    siteId: number;
    product: string;
    quantity: number;
    status?: string;
  }
  
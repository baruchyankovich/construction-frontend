export interface ProfileResponse {
    user: {
      id: number;
      username: string;
      email: string;
      manager: boolean;
    };
    assignedSites: { id: number; location: string }[];
    ordersStatistics: {
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
    };
  }
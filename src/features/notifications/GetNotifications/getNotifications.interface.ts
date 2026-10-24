import type { AppNotification } from "../notifications.interface";

export interface NotificationsResponseType {
  success: boolean;
  message: string;
  data: {
    notifications: AppNotification[];
  };
  meta: {
    pagination: {
      currentPage: number;
      numberOfPages: number;
      limit: number;
      total: number;
      nextPage?: number;
      prevPage?: number;
    };
  };
}

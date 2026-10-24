export interface NotificationActor {
  _id: string;
  name: string;
  photo?: string;
}

export interface NotificationEntityPost {
  _id: string;
  body?: string;
  image?: string;
  commentsCount?: number;
  sharesCount?: number;
  likesCount?: number;
  topComment?: {
    _id: string;
    content: string;
    commentCreator: NotificationActor;
  } | null;
}

export interface NotificationEntityUser extends NotificationActor {
  username: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export type NotificationType =
  "like_post" | "comment_post" | "share_post" | (string & {});

export interface AppNotification {
  _id: string;
  recipient: NotificationActor;
  actor: NotificationActor;
  type: NotificationType;
  entityType: string;
  entityId: string;
  entity?: NotificationEntityPost | NotificationEntityUser;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsPage {
  notifications: AppNotification[];
  nextPage: number | null;
}

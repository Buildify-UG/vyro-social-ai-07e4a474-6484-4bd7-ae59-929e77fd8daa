export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  header_url: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
  liked_by_user?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
  liked_by_user?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  recipient?: Profile;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: string;
  text_content: string | null;
  created_at: string;
  expires_at: string;
  user?: Profile;
  views_count?: number;
  viewed_by_user?: boolean;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  response: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention';
  post_id: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

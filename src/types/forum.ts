export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  posts: number;
  joined: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  upVotesBy: string[];
  downVotesBy: string[];
  isEdited?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  author: User;
  category: string;
  posts: Post[];
  views: number;
  isPinned?: boolean;
  isLocked?: boolean;
  createdAt: string;
  lastActivity: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  color: string;
}

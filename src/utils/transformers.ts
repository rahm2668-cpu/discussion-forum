import {
  ApiThread,
  ApiThreadDetail,
  ApiUser,
  ApiComment,
} from "../services/api";
import { Thread, Post, User, Category } from "../types/forum";

// Transform API user to app User
export function transformUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    avatar: apiUser.avatar,
    role: "Member",
    posts: 0,
    joined: new Date().toISOString().split("T")[0],
  };
}

// Transform API comment to app Post
export function transformComment(apiComment: ApiComment): Post {
  return {
    id: apiComment.id,
    author: transformUser(apiComment.owner),
    content: apiComment.content,
    timestamp: apiComment.createdAt,
    likes: apiComment.upVotesBy.length,
    dislikes: apiComment.downVotesBy.length,
    upVotesBy: apiComment.upVotesBy,
    downVotesBy: apiComment.downVotesBy,
  };
}

// Transform API thread to app Thread (without detailed posts)
export function transformThread(
  apiThread: ApiThread,
  owner: ApiUser | undefined
): Thread {
  const defaultUser: ApiUser = {
    id: apiThread.ownerId,
    name: "Unknown User",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiThread.ownerId}`,
  };

  // Create placeholder posts for totalComments to show accurate count
  const initialPost: Post = {
    id: `${apiThread.id}-initial`,
    author: transformUser(owner || defaultUser),
    content: apiThread.body,
    timestamp: apiThread.createdAt,
    likes: apiThread.upVotesBy.length,
    dislikes: apiThread.downVotesBy.length,
    upVotesBy: apiThread.upVotesBy,
    downVotesBy: apiThread.downVotesBy,
  };

  // Add placeholder posts to represent the total comment count
  const placeholderPosts: Post[] = Array.from(
    { length: apiThread.totalComments },
    (_, i) => ({
      id: `placeholder-${apiThread.id}-${i}`,
      author: transformUser(defaultUser),
      content: "",
      timestamp: apiThread.createdAt,
      likes: 0,
      dislikes: 0,
      upVotesBy: [],
      downVotesBy: [],
    })
  );

  return {
    id: apiThread.id,
    title: apiThread.title,
    author: transformUser(owner || defaultUser),
    category: apiThread.category,
    views: Math.floor(Math.random() * 500) + apiThread.totalComments * 10, // Simulated views based on engagement
    createdAt: apiThread.createdAt,
    lastActivity: apiThread.createdAt,
    posts: [initialPost, ...placeholderPosts],
  };
}

// Transform API thread detail to app Thread (with all posts)
export function transformThreadDetail(
  apiThreadDetail: ApiThreadDetail,
  owner?: ApiUser
): Thread {
  const defaultUser: ApiUser = {
    id: apiThreadDetail.ownerId,
    name: "Unknown User",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiThreadDetail.ownerId}`,
  };

  const threadOwner = owner || defaultUser;

  const initialPost: Post = {
    id: `${apiThreadDetail.id}-initial`,
    author: transformUser(threadOwner),
    content: apiThreadDetail.body,
    timestamp: apiThreadDetail.createdAt,
    likes: apiThreadDetail.upVotesBy.length,
    dislikes: apiThreadDetail.downVotesBy.length,
    upVotesBy: apiThreadDetail.upVotesBy,
    downVotesBy: apiThreadDetail.downVotesBy,
  };

  const commentPosts: Post[] = apiThreadDetail.comments.map(transformComment);

  return {
    id: apiThreadDetail.id,
    title: apiThreadDetail.title,
    author: transformUser(threadOwner),
    category: apiThreadDetail.category,
    views: 0,
    createdAt: apiThreadDetail.createdAt,
    lastActivity:
      apiThreadDetail.comments.length > 0
        ? apiThreadDetail.comments[apiThreadDetail.comments.length - 1]
            .createdAt
        : apiThreadDetail.createdAt,
    posts: [initialPost, ...commentPosts],
  };
}

// Get icon name based on category name
function getCategoryIcon(categoryName: string): string {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("redux") || lowerName.includes("state")) return "Code";
  if (lowerName.includes("intro") || lowerName.includes("general"))
    return "MessageSquare";
  if (lowerName.includes("help") || lowerName.includes("question"))
    return "HelpCircle";
  if (lowerName.includes("idea") || lowerName.includes("feature"))
    return "Lightbulb";
  if (lowerName.includes("resource") || lowerName.includes("book"))
    return "Bookmark";
  return "Hash";
}

// Get unique categories from threads
export function extractCategories(threads: ApiThread[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];

  threads.forEach((thread) => {
    if (!categoryMap.has(thread.category)) {
      const colorIndex = categoryMap.size % colors.length;
      const categoryName =
        thread.category.charAt(0).toUpperCase() + thread.category.slice(1);
      categoryMap.set(thread.category, {
        id: thread.category,
        name: categoryName,
        description: `Discussions about ${thread.category}`,
        icon: getCategoryIcon(categoryName),
        threadCount: 0,
        postCount: 0,
        color: colors[colorIndex],
      });
    }

    const category = categoryMap.get(thread.category)!;
    category.threadCount++;
    category.postCount += thread.totalComments + 1; // +1 for the initial post
  });

  return Array.from(categoryMap.values());
}

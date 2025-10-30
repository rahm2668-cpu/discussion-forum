const API_BASE_URL = "https://forum-api.dicoding.dev/v1";

export interface ApiThread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface ApiThreadDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: ApiUser;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
  comments: ApiComment[];
}

export interface ApiComment {
  id: string;
  content: string;
  createdAt: string;
  owner: ApiUser;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface ApiUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  score?: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Fetch all threads
export async function fetchThreads(): Promise<ApiThread[]> {
  const response = await fetch(`${API_BASE_URL}/threads`);
  const data: ApiResponse<{ threads: ApiThread[] }> = await response.json();
  return data.data.threads;
}

// Fetch thread detail with comments
export async function fetchThreadDetail(
  threadId: string
): Promise<ApiThreadDetail> {
  const response = await fetch(`${API_BASE_URL}/threads/${threadId}`);
  const data: ApiResponse<{ detailThread: ApiThreadDetail }> =
    await response.json();
  return data.data.detailThread;
}

// Create new thread (requires authentication)
export async function createThread(
  title: string,
  body: string,
  category: string,
  token: string
): Promise<ApiThread> {
  const response = await fetch(`${API_BASE_URL}/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, body, category }),
  });
  const data: ApiResponse<{ thread: ApiThread }> = await response.json();
  return data.data.thread;
}

// Create comment on thread (requires authentication)
export async function createComment(
  threadId: string,
  content: string,
  token: string
): Promise<ApiComment> {
  const response = await fetch(`${API_BASE_URL}/threads/${threadId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data: ApiResponse<{ comment: ApiComment }> = await response.json();
  return data.data.comment;
}

// Fetch all users
export async function fetchUsers(): Promise<ApiUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  const data: ApiResponse<{ users: ApiUser[] }> = await response.json();
  return data.data.users;
}

// Get user by ID (helper function)
export async function getUserById(
  userId: string,
  allUsers: ApiUser[]
): Promise<ApiUser | undefined> {
  return allUsers.find((user) => user.id === userId);
}

// Up-vote a thread (requires authentication)
export async function upVoteThread(
  threadId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/threads/${threadId}/up-vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  await response.json();
}

// Down-vote a thread (requires authentication)
export async function downVoteThread(
  threadId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/down-vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await response.json();
}

// Neutralize thread vote (requires authentication)
export async function neutralizeThreadVote(
  threadId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/neutral-vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await response.json();
}

// Up-vote a comment (requires authentication)
export async function upVoteComment(
  threadId: string,
  commentId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await response.json();
}

// Down-vote a comment (requires authentication)
export async function downVoteComment(
  threadId: string,
  commentId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await response.json();
}

// Neutralize comment vote (requires authentication)
export async function neutralizeCommentVote(
  threadId: string,
  commentId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  await response.json();
}

// Leaderboard user interface
export interface LeaderboardUser extends ApiUser {
  score: number;
}

// Fetch leaderboards
export async function fetchLeaderboards(): Promise<LeaderboardUser[]> {
  const response = await fetch(`${API_BASE_URL}/leaderboards`);
  const data: ApiResponse<{
    leaderboards: { user: ApiUser; score: number }[];
  }> = await response.json();
  return data.data.leaderboards.map((item) => ({
    ...item.user,
    score: item.score,
  }));
}

// Authentication interfaces
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// Register new user
export async function register(userData: RegisterData): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data: ApiResponse<{ user: ApiUser }> = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Registration failed");
  }
  return data.data.user;
}

// Login user
export async function login(credentials: LoginData): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data: ApiResponse<{ token: string }> = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Login failed");
  }
  return data.data.token;
}

// Get own profile (requires authentication)
export async function getOwnProfile(token: string): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: ApiResponse<{ user: ApiUser }> = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Failed to fetch profile");
  }
  return data.data.user;
}

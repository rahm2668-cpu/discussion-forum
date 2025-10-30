import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ApiThread,
  ApiThreadDetail,
  fetchThreads,
  fetchThreadDetail,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
} from "../../services/api";
import { Thread, Category } from "../../types/forum";
import {
  transformThread,
  transformThreadDetail,
  extractCategories,
} from "../../utils/transformers";
import { RootState } from "../store";

interface ThreadsState {
  threads: Thread[];
  categories: Category[];
  selectedThreadDetail: Thread | null;
  isLoading: boolean;
  isLoadingThreadDetail: boolean;
  error: string | null;
}

export const initialState: ThreadsState = {
  threads: [],
  categories: [],
  selectedThreadDetail: null,
  isLoading: false,
  isLoadingThreadDetail: false,
  error: null,
};

export const loadThreads = createAsyncThunk(
  "threads/loadThreads",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { users } = state.users;
    const threadsData = await fetchThreads();

    const transformedThreads = threadsData.map((apiThread) => {
      const owner = users.find((u) => u.id === apiThread.ownerId);
      return transformThread(apiThread, owner);
    });

    const categories = extractCategories(threadsData);

    return { threads: transformedThreads, categories };
  }
);

export const loadThreadDetail = createAsyncThunk(
  "threads/loadThreadDetail",
  async (threadId: string, { getState }) => {
    const state = getState() as RootState;

    // Check if it's a local thread (created locally)
    if (threadId.startsWith("local-thread-")) {
      const thread = state.threads.threads.find((t) => t.id === threadId);
      if (thread) {
        return thread;
      }
      throw new Error("Local thread not found");
    }

    const threadDetail = await fetchThreadDetail(threadId);
    return transformThreadDetail(threadDetail);
  }
);

export const voteOnPost = createAsyncThunk(
  "threads/voteOnPost",
  async (
    {
      postId,
      voteType,
      threadId,
    }: {
      postId: string;
      voteType: "up" | "down" | "neutral";
      threadId: string;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.id || "demo-user";
    const { token } = state.auth;

    if (!state.auth.isAuthenticated || !token) {
      throw new Error("Please log in to vote");
    }

    const thread = state.threads.selectedThreadDetail;
    if (!thread) {
      throw new Error("Thread not found");
    }

    const post = thread.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const isFirstPost = thread.posts[0].id === postId;

    if (isFirstPost) {
      if (voteType === "up") {
        await upVoteThread(threadId, token);
      } else if (voteType === "down") {
        await downVoteThread(threadId, token);
      } else {
        await neutralizeThreadVote(threadId, token);
      }
    } else if (voteType === "up") {
      await upVoteComment(threadId, postId, token);
    } else if (voteType === "down") {
      await downVoteComment(threadId, postId, token);
    } else {
      await neutralizeCommentVote(threadId, postId, token);
    }

    return { postId, voteType, userId };
  }
);

export const createThread = createAsyncThunk(
  "threads/createThread",
  async (
    {
      title,
      body,
      category,
    }: { title: string; body: string; category: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const { token } = state.auth;

    if (!token) {
      throw new Error("User not authenticated");
    }

    const apiThread = await import("../../services/api").then((m) =>
      m.createThread(title, body, category, token)
    );
    const thread = transformThread(apiThread, undefined);

    // Check if category exists, if not add it
    const existingCategory = state.threads.categories.find(
      (cat) => cat.id === category
    );
    let newCategory = null;
    if (!existingCategory) {
      newCategory = {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        description: `Discussions about ${category}`,
        icon: "Hash",
        threadCount: 1,
        postCount: 1,
        color: "bg-blue-500", // Default color
      };
    }

    return { thread, newCategory };
  }
);

export const addReply = createAsyncThunk(
  "threads/addReply",
  async (content: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { token } = state.auth;
    const thread = state.threads.selectedThreadDetail;

    if (!token) {
      throw new Error("User not authenticated");
    }

    if (!thread) {
      throw new Error("No thread selected");
    }

    // Create comment on backend
    const { createComment } = await import("../../services/api");
    const apiComment = await createComment(thread.id, content, token);

    // Transform the API comment to app format
    const { transformComment } = await import("../../utils/transformers");
    const newPost = transformComment(apiComment);

    // Re-fetch thread detail to get updated comments
    await dispatch(loadThreadDetail(thread.id));

    return newPost;
  }
);

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    clearSelectedThread: (state) => {
      state.selectedThreadDetail = null;
    },
    setSelectedThreadDetail: (state, action: PayloadAction<Thread>) => {
      state.selectedThreadDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThreads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadThreads.fulfilled, (state, action) => {
        // Separate local and API threads
        const localThreads = state.threads.filter((t) =>
          t.id.startsWith("local-thread-")
        );
        const apiThreads = action.payload.threads;

        // Combine them, with local threads first
        state.threads = [...localThreads, ...apiThreads];

        // Preserve local categories and merge with API categories
        const localCategories = state.categories.filter(
          (cat) =>
            !action.payload.categories.some((apiCat) => apiCat.id === cat.id)
        );
        state.categories = [...localCategories, ...action.payload.categories];

        state.isLoading = false;
      })
      .addCase(loadThreads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load threads";
      })
      .addCase(loadThreadDetail.pending, (state) => {
        state.isLoadingThreadDetail = true;
        state.error = null;
      })
      .addCase(loadThreadDetail.fulfilled, (state, action) => {
        state.selectedThreadDetail = action.payload;
        state.isLoadingThreadDetail = false;
      })
      .addCase(loadThreadDetail.rejected, (state, action) => {
        state.isLoadingThreadDetail = false;
        state.error = action.error.message || "Failed to load thread detail";
      })
      .addCase(voteOnPost.pending, (state, action) => {
        // No optimistic updates - wait for API response
      })
      .addCase(voteOnPost.fulfilled, (state, action) => {
        if (!state.selectedThreadDetail) return;

        const { postId, voteType, userId } = action.payload;

        const postIndex = state.selectedThreadDetail.posts.findIndex(
          (p) => p.id === postId
        );
        if (postIndex === -1) return;

        const post = state.selectedThreadDetail.posts[postIndex];
        const hasUpVoted = post.upVotesBy.includes(userId);
        const hasDownVoted = post.downVotesBy.includes(userId);

        if (voteType === "up") {
          if (hasUpVoted) {
            // Remove upvote (neutralize)
            post.likes -= 1;
            post.upVotesBy = post.upVotesBy.filter((id) => id !== userId);
          } else {
            // Add upvote
            post.likes += 1;
            post.upVotesBy.push(userId);
            if (hasDownVoted) {
              post.dislikes -= 1;
              post.downVotesBy = post.downVotesBy.filter((id) => id !== userId);
            }
          }
        } else if (voteType === "down") {
          if (hasDownVoted) {
            // Remove downvote (neutralize)
            post.dislikes -= 1;
            post.downVotesBy = post.downVotesBy.filter((id) => id !== userId);
          } else {
            // Add downvote
            post.dislikes += 1;
            post.downVotesBy.push(userId);
            if (hasUpVoted) {
              post.likes -= 1;
              post.upVotesBy = post.upVotesBy.filter((id) => id !== userId);
            }
          }
        } else if (voteType === "neutral") {
          // Remove any existing vote
          if (hasUpVoted) {
            post.likes -= 1;
            post.upVotesBy = post.upVotesBy.filter((id) => id !== userId);
          }
          if (hasDownVoted) {
            post.dislikes -= 1;
            post.downVotesBy = post.downVotesBy.filter((id) => id !== userId);
          }
        }
      })
      .addCase(voteOnPost.rejected, (state, action) => {
        state.error = action.error.message || "Failed to vote";
      })
      .addCase(createThread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.unshift(action.payload.thread);
        if (action.payload.newCategory) {
          state.categories.push(action.payload.newCategory);
        }
        state.isLoading = false;
      })
      .addCase(createThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create thread";
      })
      .addCase(addReply.fulfilled, (state, action) => {
        // Comment is added via re-fetch in the thunk, no additional state update needed
      });
  },
});

export const { clearSelectedThread, setSelectedThreadDetail } =
  threadsSlice.actions;
export default threadsSlice.reducer;

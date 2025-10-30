import { render, screen } from "@testing-library/react";
import { ThreadDetail } from "./ThreadDetail";
import { Thread } from "../../types/forum";

const mockThread: Thread = {
  id: "1",
  title: "Test Thread",
  author: {
    id: "1",
    name: "Test User",
    avatar: "test-avatar.png",
    role: "Member",
    posts: 10,
    joined: "2023-01-01",
  },
  category: "general",
  views: 100,
  createdAt: "2023-01-01T00:00:00Z",
  lastActivity: "2023-01-02T00:00:00Z",
  posts: [
    {
      id: "1",
      author: {
        id: "1",
        name: "Test User",
        avatar: "test-avatar.png",
        role: "Member",
        posts: 10,
        joined: "2023-01-01",
      },
      content: "This is the body of the thread.",
      timestamp: "2023-01-01T00:00:00Z",
      likes: 2,
      dislikes: 1,
      upVotesBy: ["user1", "user2"],
      downVotesBy: ["user3"],
    },
    {
      id: "2",
      author: {
        id: "2",
        name: "Comment User",
        avatar: "comment-avatar.png",
        role: "Member",
        posts: 5,
        joined: "2023-01-01",
      },
      content: "This is a comment.",
      timestamp: "2023-01-02T00:00:00Z",
      likes: 0,
      dislikes: 0,
      upVotesBy: [],
      downVotesBy: [],
    },
  ],
};

describe("ThreadDetail", () => {
  it("renders loading state", () => {
    // 🧩 Arrange
    // Prepare component with loading state
    const loading = true;

    // 🚀 Act
    render(<ThreadDetail loading={loading} />);

    // ✅ Assert
    expect(screen.getByText("Loading thread...")).toBeInTheDocument();
  });

  it("renders thread not found when no thread is provided", () => {
    // 🧩 Arrange
    const thread = undefined;

    // 🚀 Act
    render(<ThreadDetail thread={thread} />);

    // ✅ Assert
    expect(screen.getByText("Thread not found.")).toBeInTheDocument();
  });

  it("renders thread details correctly", () => {
    // 🧩 Arrange
    const thread = mockThread;

    // 🚀 Act
    render(<ThreadDetail thread={thread} />);

    // ✅ Assert
    expect(screen.getByText("Test Thread")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(
      screen.getByText("This is the body of the thread.")
    ).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Comment User")).toBeInTheDocument();
    expect(screen.getByText("This is a comment.")).toBeInTheDocument();
  });

  it("displays upvotes and downvotes correctly", () => {
    // 🧩 Arrange
    const thread = mockThread;

    // 🚀 Act
    render(<ThreadDetail thread={thread} />);

    // ✅ Assert
    expect(screen.getByText("Upvoted by:")).toBeInTheDocument();
    expect(screen.getByText("user1, user2")).toBeInTheDocument();
    expect(screen.getByText("Downvoted by:")).toBeInTheDocument();
    expect(screen.getByText("user3")).toBeInTheDocument();
  });

  it("handles missing owner data with fallbacks", () => {
    // 🧩 Arrange
    const threadWithoutOwner: Thread = {
      ...mockThread,
      author: {
        id: "",
        name: "Unknown User",
        avatar: "",
        role: "Member",
        posts: 0,
        joined: "",
      },
      posts: mockThread.posts.map((p) => ({
        ...p,
        author: {
          id: "",
          name: "Unknown User",
          avatar: "",
          role: "Member",
          posts: 0,
          joined: "",
        },
      })),
    };

    // 🚀 Act
    render(<ThreadDetail thread={threadWithoutOwner} />);

    // ✅ Assert
    expect(screen.getAllByText("Unknown User")).toHaveLength(2);
  });

  it("applies the correct CSS classes", () => {
    // 🧩 Arrange
    const thread = mockThread;

    // 🚀 Act
    const { container } = render(<ThreadDetail thread={thread} />);

    // ✅ Assert
    expect(container.querySelector(".thread-detail")).toBeInTheDocument();
    expect(container.querySelector(".thread-owner")).toBeInTheDocument();
    expect(container.querySelector(".comment")).toBeInTheDocument();
  });
});

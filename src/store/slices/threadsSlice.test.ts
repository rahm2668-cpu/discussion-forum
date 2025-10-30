import { describe, it, expect } from "vitest";
import threadsReducer, {
  initialState,
  setSelectedThreadDetail,
  clearSelectedThread,
} from "./threadsSlice";
import { Thread } from "../../types/forum";

describe("threadsReducer function", () => {
  it("should return the initial state when given by unknown action", () => {
    // Arrange
    const action = { type: "UNKNOWN" };

    // Act
    const nextstate = threadsReducer(undefined, action);

    // Assert
    expect(nextstate).toEqual(initialState);
  });

  it("should set selectedThreadDetail when setSelectedThreadDetail is dispatched", () => {
    // Arrange
    const mockThread: Thread = {
      id: "1",
      title: "Test Thread",
      posts: [],
      author: {
        id: "1",
        name: "Test",
        avatar: "test.png",
        role: "user",
        posts: 0,
        joined: "2023-01-01",
      },
      category: "General",
      views: 0,
      createdAt: "2023-01-01",
      lastActivity: "2023-01-01",
    };
    const action = setSelectedThreadDetail(mockThread);

    // Act
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState.selectedThreadDetail).toEqual(mockThread);
  });

  it("should clear selectedThreadDetail when clearSelectedThread is dispatched", () => {
    // Arrange
    const mockThread: Thread = {
      id: "123",
      title: "Thread",
      posts: [],
      author: {
        id: "1",
        name: "Test",
        avatar: "test.png",
        role: "user",
        posts: 0,
        joined: "2023-01-01",
      },
      category: "General",
      views: 0,
      createdAt: "2023-01-01",
      lastActivity: "2023-01-01",
    };
    // Action
    const stateWithThread = {
      ...initialState,
      selectedThreadDetail: mockThread,
    };
    const nextState = threadsReducer(stateWithThread, clearSelectedThread());
    // Assert
    expect(nextState.selectedThreadDetail).toBeNull();
  });
});

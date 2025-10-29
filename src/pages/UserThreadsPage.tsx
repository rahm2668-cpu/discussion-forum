import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadThreadsByUserId } from "../store/slices/threadsSlice";
import { ThreadListItem } from "../components/ui-components/ThreadListItem";

export function UserThreadsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userThreads, isLoadingUserThreads } = useAppSelector(
    (state) => state.threads
  );

  useEffect(() => {
    if (userId) {
      dispatch(loadThreadsByUserId(userId));
    }
  }, [dispatch, userId]);

  const handleThreadClick = (threadId: string) => {
    navigate(`/threads/${threadId}`);
  };

  if (!userId) {
    return <div className="container mx-auto px-4 py-8">User not found</div>;
  }

  if (isLoadingUserThreads) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading threads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Threads</h1>
        <p className="text-muted-foreground">Threads by user {userId}</p>
      </div>

      <div className="space-y-4">
        {userThreads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No threads found for this user.
          </div>
        ) : (
          userThreads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              onClick={() => handleThreadClick(thread.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

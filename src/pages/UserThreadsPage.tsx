import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ThreadListItem } from "../components/ui-components/ThreadListItem";
import { Thread } from "../types/forum";

export function UserThreadsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { threads } = useAppSelector((state) => state.threads);

  const handleThreadClick = (threadId: string) => {
    navigate(`/threads/${threadId}`);
  };

  if (!userId) {
    return <div className="container mx-auto px-4 py-8">User not found</div>;
  }

  // Filter threads by userId
  const userThreads = threads.filter((thread) => thread.author.id === userId);

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
          userThreads.map((thread: Thread) => (
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

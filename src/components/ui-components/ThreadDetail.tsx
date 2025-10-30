import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sanitizeHtml } from "../../utils/sanitizeHtml";
import { Thread } from "../../types/forum";

interface ThreadDetailProps {
  thread?: Thread;
  loading?: boolean;
}

export const ThreadDetail: React.FC<ThreadDetailProps> = ({
  thread,
  loading,
}) => {
  if (loading) {
    return (
      <div className="thread-detail flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading thread...</span>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="thread-detail p-8 text-center">
        <p>Thread not found.</p>
      </div>
    );
  }

  const initialPost = thread.posts[0];
  const comments = thread.posts.slice(1);

  return (
    <div className="thread-detail">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
        <div className="thread-owner flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
            <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{thread.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(thread.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(initialPost.content),
          }}
        />
        <div className="mt-4 text-sm">
          <p>
            <strong>Upvoted by:</strong>{" "}
            {initialPost.upVotesBy.length > 0
              ? initialPost.upVotesBy.join(", ")
              : "None"}
          </p>
          <p>
            <strong>Downvoted by:</strong>{" "}
            {initialPost.downVotesBy.length > 0
              ? initialPost.downVotesBy.join(", ")
              : "None"}
          </p>
        </div>
      </div>

      {comments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {comments.map((comment) => (
            <div key={comment.id} className="comment border-b pb-4 mb-4">
              <div className="flex items-center gap-4 mb-2">
                <Avatar>
                  <AvatarImage
                    src={comment.author.avatar}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(comment.content),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

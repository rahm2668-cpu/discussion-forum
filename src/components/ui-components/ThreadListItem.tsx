import { Pin, Lock, MessageSquare, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Thread } from "../../types/forum";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ThreadListItemProps {
  thread: Thread;
  onClick: () => void;
}

export function ThreadListItem({ thread, onClick }: ThreadListItemProps) {
  const formatDate = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  const replyCount = thread.posts.length - 1;
  const lastPost = thread.posts[thread.posts.length - 1];

  return (
    <div
      className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
          <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            {thread.isPinned && (
              <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            )}
            {thread.isLocked && (
              <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <h3 className="flex-1 truncate">{thread.title}</h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{thread.author.name}</span>
            <span>•</span>
            <span>{formatDate(thread.createdAt)}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>
                {replyCount} {replyCount === 1 ? "comment" : "comments"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{thread.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={lastPost.author.avatar}
                alt={lastPost.author.name}
              />
              <AvatarFallback>{lastPost.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{lastPost.author.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(thread.lastActivity)}
          </span>
        </div>
      </div>
    </div>
  );
}

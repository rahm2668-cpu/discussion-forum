import { ThumbsUp, ThumbsDown, Flag, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Post } from "../../types/forum";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

interface PostCardProps {
  post: Post;
  isFirstPost?: boolean;
  onUpVote?: (postId: string) => void;
  onDownVote?: (postId: string) => void;
  currentUserId?: string;
}

export function PostCard({
  post,
  isFirstPost,
  onUpVote,
  onDownVote,
  currentUserId = "demo-user",
}: PostCardProps) {
  const formatDate = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  const hasUpVoted = post.upVotesBy.includes(currentUserId);
  const hasDownVoted = post.downVotesBy.includes(currentUserId);

  const voteCount = post.likes - post.dislikes;

  return (
    <div
      className={`p-6 border-b ${isFirstPost ? "bg-muted/30" : "bg-background"}`}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.name}</span>
                <Badge
                  variant={
                    post.author.role === "Admin"
                      ? "default"
                      : post.author.role === "Moderator"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {post.author.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{post.author.posts} posts</span>
                <span>•</span>
                <span>{formatDate(post.timestamp)}</span>
                {post.isEdited && (
                  <>
                    <span>•</span>
                    <span className="italic">edited</span>
                  </>
                )}
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div
            className="prose prose-sm max-w-none mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={hasUpVoted ? "default" : "ghost"}
                size="sm"
                className={`gap-2 ${hasUpVoted ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                onClick={() => onUpVote?.(post.id)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={hasDownVoted ? "destructive" : "ghost"}
                size="sm"
                className={`gap-2 ${hasDownVoted ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
                onClick={() => onDownVote?.(post.id)}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{post.dislikes}</span>
              </Button>
            </motion.div>
            <div className="ml-2 text-sm font-medium text-muted-foreground">
              Score: {voteCount}
            </div>
            <Button variant="ghost" size="sm" className="gap-2 ml-auto">
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

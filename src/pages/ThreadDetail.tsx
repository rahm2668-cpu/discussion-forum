import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { PostCard } from "../components/ui-components/PostCard";
import { ReplyForm } from "../components/ui-components/ReplyForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadThreadDetail,
  addReply,
  voteOnPost,
} from "../store/slices/threadsSlice";

export function ThreadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedThreadDetail, isLoadingThreadDetail, categories } =
    useAppSelector((state) => state.threads);

  useEffect(() => {
    if (id) {
      const loadThread = async () => {
        try {
          await dispatch(loadThreadDetail(id)).unwrap();
        } catch (error) {
          console.error("Error loading thread:", error);
          toast.error("Failed to load thread details. Please try again.");
          navigate("/");
        }
      };
      loadThread();
    }
  }, [id, dispatch, navigate]);

  const handleReply = async (content: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to post replies");
      navigate("/login");
      return;
    }

    try {
      await dispatch(addReply(content)).unwrap();
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply. Please try again.");
    }
  };

  const handleUpVote = async (postId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to vote");
      navigate("/login");
      return;
    }

    if (!selectedThreadDetail) return;

    const post = selectedThreadDetail.posts.find((p) => p.id === postId);
    if (!post) return;

    const currentUserId = user?.id || "demo-user";
    const hasUpVoted = post.upVotesBy.includes(currentUserId);

    try {
      await dispatch(
        voteOnPost({
          postId,
          voteType: hasUpVoted ? "neutral" : "up",
          threadId: selectedThreadDetail.id,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Voting requires authentication. This is demo mode.");
    }
  };

  const handleDownVote = async (postId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to vote");
      navigate("/login");
      return;
    }

    if (!selectedThreadDetail) return;

    const post = selectedThreadDetail.posts.find((p) => p.id === postId);
    if (!post) return;

    const currentUserId = user?.id || "demo-user";
    const hasDownVoted = post.downVotesBy.includes(currentUserId);

    try {
      await dispatch(
        voteOnPost({
          postId,
          voteType: hasDownVoted ? "neutral" : "down",
          threadId: selectedThreadDetail.id,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Voting requires authentication. This is demo mode.");
    }
  };

  if (isLoadingThreadDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (!selectedThreadDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Thread not found</h2>
          <Button onClick={() => navigate("/")}>Go back to forum</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold truncate">
                {selectedThreadDetail.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                in{" "}
                {
                  categories.find((c) => c.id === selectedThreadDetail.category)
                    ?.name
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            {selectedThreadDetail.posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                isFirstPost={index === 0}
                onUpVote={handleUpVote}
                onDownVote={handleDownVote}
                currentUserId={user?.id || "demo-user"}
              />
            ))}
          </Card>

          {!selectedThreadDetail.isLocked && (
            <div>
              <h3 className="mb-4">Post a Reply</h3>
              <ReplyForm onSubmit={handleReply} />
            </div>
          )}

          {selectedThreadDetail.isLocked && (
            <Card className="p-6 text-center text-muted-foreground">
              This thread has been locked and no longer accepts new replies.
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Home,
  Search,
  TrendingUp,
  Clock,
  ChevronLeft,
  Menu,
  Bell,
  Loader2,
  Trophy,
  LogOut,
  Filter,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { CategoryCard } from "../components/ui-components/CategoryCard";
import { ThreadListItem } from "../components/ui-components/ThreadListItem";
import { PostCard } from "../components/ui-components/PostCard";
import { NewThreadDialog } from "../components/ui-components/NewThreadDialog";
import { ReplyForm } from "../components/ui-components/ReplyForm";
import { Leaderboards } from "../components/ui-components/Leaderboards";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { loadUsers } from "../store/slices/usersSlice";
import {
  loadThreads,
  loadThreadDetail,
  addLocalThread,
  addLocalReply,
  voteOnPost,
  setSelectedThreadDetail,
} from "../store/slices/threadsSlice";
import { loadLeaderboards } from "../store/slices/leaderboardsSlice";
import {
  setSearchQuery,
  navigateToCategory,
  navigateToThread,
  navigateBack,
  navigateToHome,
  navigateToLeaderboards,
} from "../store/slices/uiSlice";

export function ForumContainer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    threads,
    categories,
    selectedThreadDetail,
    isLoading,
    isLoadingThreadDetail,
  } = useAppSelector((state) => state.threads);
  const { leaderboards, isLoading: isLoadingLeaderboards } = useAppSelector(
    (state) => state.leaderboards
  );
  const { users, isLoading: isLoadingUsers } = useAppSelector(
    (state) => state.users
  );
  const { currentView, selectedCategory, searchQuery } = useAppSelector(
    (state) => state.ui
  );

  console.log("Leaderboards from store:", leaderboards);

  useEffect(() => {
    const loadData = async () => {
      if (currentView === "leaderboards") {
        await dispatch(loadLeaderboards());
      }
    };
    loadData();
  }, [currentView, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(loadUsers());
      await dispatch(loadThreads());
    };
    loadData();
  }, [dispatch]);

  const handleCategoryClick = (categoryId: string) => {
    dispatch(navigateToCategory(categoryId));
  };

  const handleThreadClick = (threadId: string) => {
    navigate(`/threads/${threadId}`);
  };

  const handleBack = () => {
    dispatch(navigateBack());
  };

  const handleCreateThread = async (
    title: string,
    content: string,
    category: string
  ) => {
    if (!isAuthenticated) {
      toast.error("Please log in to create threads");
      navigate("/login");
      return;
    }

    try {
      const result = await dispatch(
        addLocalThread({ title, content, category })
      ).unwrap();
      toast.success("Thread created locally (demo mode)");
      toast.info(
        "Thread creation requires authentication. Using read-only API access."
      );
      // Navigate to the newly created thread
      navigate(`/threads/${result.thread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Failed to create thread");
    }
  };

  const handleReply = async (content: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to post replies");
      navigate("/login");
      return;
    }

    try {
      await dispatch(addLocalReply(content)).unwrap();
      toast.success("Reply added locally (demo mode)");
      toast.info(
        "Replying requires authentication. Using read-only API access."
      );
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
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

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleShowLeaderboards = async () => {
    dispatch(navigateToLeaderboards());
    await dispatch(loadLeaderboards());
  };

  const filteredThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : threads;

  // Force re-render when threads change to show new categories
  const currentCategories = categories;

  const searchedThreads = searchQuery
    ? filteredThreads.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.posts[0]?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredThreads;

  const recentThreads = [...threads]
    .sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    )
    .slice(0, 5);

  const popularThreads = [...threads]
    .sort((a, b) => b.posts.length - a.posts.length)
    .slice(0, 5);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  if (isLoading || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading forum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl">Discussion Forum App</h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentView === "home" ? "default" : "ghost"}
                onClick={() => dispatch(navigateToHome())}
                className="gap-2"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                variant={currentView === "leaderboards" ? "default" : "ghost"}
                onClick={handleShowLeaderboards}
                className="gap-2"
              >
                <Trophy className="w-5 h-5" />
                <span className="hidden sm:inline">Leaderboards</span>
              </Button>

              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div>
                          <p>{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => navigate("/login")}>Log In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === "home" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="mb-2">Welcome to Dicussion Forum</h2>
                <p className="text-muted-foreground">
                  Join discussions, share knowledge, and connect with developers
                </p>
              </div>
              <NewThreadDialog
                categories={categories}
                onCreateThread={handleCreateThread}
              />
            </div>

            <div className="md:hidden">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3>Categories</h3>
              </div>
              {categories.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => handleCategoryClick(category.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center text-muted-foreground">
                  No categories available
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3>All Threads</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={filterCategory === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterCategory(null)}
                  >
                    All
                  </Badge>
                  {currentCategories.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant={
                        filterCategory === cat.id ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setFilterCategory(cat.id)}
                    >
                      {cat.name}
                      {filterCategory === cat.id && (
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterCategory(null);
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              <Card>
                {(filterCategory
                  ? threads.filter((t) => t.category === filterCategory)
                  : threads
                )
                  .slice(0, 10)
                  .map((thread) => (
                    <ThreadListItem
                      key={thread.id}
                      thread={thread}
                      onClick={() => handleThreadClick(thread.id)}
                    />
                  ))}
                {threads.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    No threads available yet.
                  </div>
                )}
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3>Recent Threads</h3>
                </div>
                <div className="space-y-2">
                  {recentThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleThreadClick(thread.id)}
                    >
                      <p className="truncate mb-1">{thread.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {thread.author.name} • {thread.posts.length - 1}{" "}
                        comments
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3>Popular Threads</h3>
                </div>
                <div className="space-y-2">
                  {popularThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleThreadClick(thread.id)}
                    >
                      <p className="truncate mb-1">{thread.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {thread.posts.length - 1} comments •{thread.views} views
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === "category" && currentCategory && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h2 className="mb-1">{currentCategory.name}</h2>
                <p className="text-muted-foreground">
                  {currentCategory.description}
                </p>
              </div>
              <NewThreadDialog
                categories={categories}
                selectedCategory={selectedCategory || undefined}
                onCreateThread={handleCreateThread}
              />
            </div>

            <div className="mb-4 md:hidden">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Threads</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-0">
                <Card>
                  {searchedThreads.length > 0 ? (
                    searchedThreads.map((thread) => (
                      <ThreadListItem
                        key={thread.id}
                        thread={thread}
                        onClick={() => handleThreadClick(thread.id)}
                      />
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      {searchQuery
                        ? "No threads found matching your search."
                        : "No threads in this category yet. Be the first to start a discussion!"}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="popular" className="space-y-0">
                <Card>
                  {[...searchedThreads]
                    .sort((a, b) => b.posts.length - a.posts.length)
                    .map((thread) => (
                      <ThreadListItem
                        key={thread.id}
                        thread={thread}
                        onClick={() => handleThreadClick(thread.id)}
                      />
                    ))}
                </Card>
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-0">
                <Card>
                  {searchedThreads.filter((t) => t.posts.length === 1).length >
                  0 ? (
                    searchedThreads
                      .filter((t) => t.posts.length === 1)
                      .map((thread) => (
                        <ThreadListItem
                          key={thread.id}
                          thread={thread}
                          onClick={() => handleThreadClick(thread.id)}
                        />
                      ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      No unanswered threads. Great job, community!
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentView === "thread" && (
          <div className="space-y-6">
            {isLoadingThreadDetail ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading thread...</p>
                </div>
              </div>
            ) : selectedThreadDetail ? (
              <>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex-1">
                    <h2>{selectedThreadDetail.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      in{" "}
                      {
                        categories.find(
                          (c) => c.id === selectedThreadDetail.category
                        )?.name
                      }
                    </p>
                  </div>
                </div>

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
                    This thread has been locked and no longer accepts new
                    replies.
                  </Card>
                )}
              </>
            ) : null}
          </div>
        )}

        {currentView === "leaderboards" && (
          <Leaderboards
            users={leaderboards}
            isLoading={isLoadingLeaderboards}
          />
        )}
      </main>
    </div>
  );
}

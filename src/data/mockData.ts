import { User, Thread, Category } from "../types/forum";

export const users: User[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "Admin",
    posts: 1243,
    joined: "2023-01-15",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Moderator",
    posts: 856,
    joined: "2023-03-22",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    role: "Member",
    posts: 342,
    joined: "2023-06-10",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "Member",
    posts: 521,
    joined: "2023-04-18",
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    role: "Member",
    posts: 198,
    joined: "2023-08-05",
  },
];

export const categories: Category[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "Talk about anything and everything",
    icon: "MessageSquare",
    threadCount: 1247,
    postCount: 8934,
    color: "bg-blue-500",
  },
  {
    id: "tech",
    name: "Technology",
    description: "Discuss the latest in tech, programming, and gadgets",
    icon: "Laptop",
    threadCount: 892,
    postCount: 6521,
    color: "bg-purple-500",
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "All things gaming - reviews, tips, and discussions",
    icon: "Gamepad2",
    threadCount: 1543,
    postCount: 12389,
    color: "bg-green-500",
  },
  {
    id: "creative",
    name: "Creative Corner",
    description: "Share your art, music, writing, and creative projects",
    icon: "Palette",
    threadCount: 634,
    postCount: 4127,
    color: "bg-pink-500",
  },
  {
    id: "support",
    name: "Help & Support",
    description: "Get help and support from the community",
    icon: "HelpCircle",
    threadCount: 445,
    postCount: 3892,
    color: "bg-orange-500",
  },
];

export const threads: Thread[] = [
  {
    id: "1",
    title: "Welcome to the Forum! Please read the rules",
    author: users[0],
    category: "general",
    isPinned: true,
    views: 5234,
    createdAt: "2024-01-15T10:00:00Z",
    lastActivity: "2024-10-16T14:30:00Z",
    posts: [
      {
        id: "p1",
        author: users[0],
        content:
          "<div>Bagaimana kabarmu? Semoga baik-baik saja ya. Sekali lagi saya ucapkan selamat datang semuanya!</div><div><br></div><div>Seperti yang sudah disampaikan sebelumnya, pada diskusi ini kamu bisa memperkenalkan diri kamu dan juga berkenalan dengan teman sekelas lainnya.</div><div><br></div><div>Berhubungan baik dengan teman sekelas dan instruktur merupakan bagian penting dari pembelajaran di kelas ini, karena mereka dapat membantu jika kamu mengalami kendala dalam mempelajari dan memahami materi. Oleh karena itu, luangkanlah waktumu untuk saling mengenal dan mencairkan suasana. Membangun interaksi dengan siswa lain akan membuat pengalaman belajar kamu jauh lebih menyenangkan dan menarik.</div><div><br></div><div>Beberapa hal yang dapat kamu tulis pada perkenalan diri:</div><ul><li>Siapa kamu dan dari mana kamu berasal?</li><li>Apa pekerjaan atau pendidikan kamu saat ini?</li><li>Kenapa kamu mengambil pelatihan ini? Apakah mungkin karena kamu sedang mengejar perubahan dalam karir, atau lainnya?</li></ul>",
        timestamp: "2024-01-15T10:00:00Z",
        likes: 89,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p2",
        author: users[2],
        content:
          "Thanks for the warm welcome! Excited to be part of this community.",
        timestamp: "2024-01-15T11:23:00Z",
        likes: 12,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p3",
        author: users[3],
        content:
          "Great guidelines! Looking forward to engaging discussions here.",
        timestamp: "2024-01-15T15:45:00Z",
        likes: 8,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
  {
    id: "2",
    title: "What are you currently working on?",
    author: users[1],
    category: "general",
    views: 892,
    createdAt: "2024-10-14T09:15:00Z",
    lastActivity: "2024-10-17T08:22:00Z",
    posts: [
      {
        id: "p4",
        author: users[1],
        content: `Hey everyone! I thought it would be cool to have a thread where we can share what we're currently working on.

I'll start: I'm building a personal portfolio website using React and Tailwind. It's been a fun learning experience!

What about you? What projects are keeping you busy?`,
        timestamp: "2024-10-14T09:15:00Z",
        likes: 23,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p5",
        author: users[4],
        content:
          "That sounds awesome! I'm currently learning Python and working on a data visualization project. It's challenging but rewarding.",
        timestamp: "2024-10-14T10:32:00Z",
        likes: 7,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p6",
        author: users[3],
        content:
          "Nice! I'm redesigning my blog and experimenting with some new CSS techniques. Also planning to add a dark mode.",
        timestamp: "2024-10-14T14:20:00Z",
        likes: 5,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
  {
    id: "3",
    title: "Best practices for React state management in 2024",
    author: users[2],
    category: "tech",
    views: 1456,
    createdAt: "2024-10-12T13:45:00Z",
    lastActivity: "2024-10-16T19:15:00Z",
    posts: [
      {
        id: "p7",
        author: users[2],
        content: `I've been working with React for a while now, and I'm curious about everyone's thoughts on state management in 2024.

What are you using? Redux? Zustand? Context API? Something else?

I've been experimenting with Zustand lately and I'm really liking how lightweight it is compared to Redux. Would love to hear your experiences!`,
        timestamp: "2024-10-12T13:45:00Z",
        likes: 34,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p8",
        author: users[0],
        content: `Great question! I've moved most of my projects to Zustand as well. For smaller apps, Context API is still perfectly fine though.

The key is choosing the right tool for the job. Don't overcomplicate things if you don't need to!`,
        timestamp: "2024-10-12T15:22:00Z",
        likes: 18,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p9",
        author: users[1],
        content:
          "I still use Redux for enterprise projects, but have been exploring TanStack Query for server state. Game changer!",
        timestamp: "2024-10-13T09:30:00Z",
        likes: 21,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
  {
    id: "4",
    title: "Recommended indie games worth playing",
    author: users[4],
    category: "gaming",
    views: 723,
    createdAt: "2024-10-15T16:20:00Z",
    lastActivity: "2024-10-17T07:45:00Z",
    posts: [
      {
        id: "p10",
        author: users[4],
        content: `Looking for some hidden gem indie games to play this weekend. What are your recommendations?

I really enjoyed Hades and Celeste, so anything in that vein would be great!`,
        timestamp: "2024-10-15T16:20:00Z",
        likes: 15,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p11",
        author: users[3],
        content:
          "If you liked Celeste, you should definitely try Hollow Knight! Amazing platformer with beautiful art.",
        timestamp: "2024-10-15T17:45:00Z",
        likes: 9,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p12",
        author: users[2],
        content:
          "Dead Cells is fantastic if you like roguelikes. Also check out Slay the Spire for something different!",
        timestamp: "2024-10-16T11:20:00Z",
        likes: 6,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
  {
    id: "5",
    title: "Share your latest creative work!",
    author: users[3],
    category: "creative",
    views: 445,
    createdAt: "2024-10-13T12:00:00Z",
    lastActivity: "2024-10-16T20:30:00Z",
    posts: [
      {
        id: "p13",
        author: users[3],
        content: `Let's use this thread to share what we've been creating lately!

I just finished a digital painting I've been working on for the past week. Would love to see what everyone else is up to!`,
        timestamp: "2024-10-13T12:00:00Z",
        likes: 19,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p14",
        author: users[4],
        content:
          "That sounds cool! I've been writing short stories. Just finished one about time travel that I'm pretty proud of.",
        timestamp: "2024-10-14T08:15:00Z",
        likes: 8,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
  {
    id: "6",
    title: "How to fix npm installation errors?",
    author: users[4],
    category: "support",
    views: 234,
    createdAt: "2024-10-16T10:30:00Z",
    lastActivity: "2024-10-16T22:15:00Z",
    posts: [
      {
        id: "p15",
        author: users[4],
        content: `I'm getting errors when trying to install npm packages. The error message mentions something about permissions.

Has anyone encountered this before? Running on macOS.`,
        timestamp: "2024-10-16T10:30:00Z",
        likes: 3,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "p16",
        author: users[0],
        content: `Try running with sudo or fixing your npm permissions. Here's a good guide: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

Let me know if that helps!`,
        timestamp: "2024-10-16T11:45:00Z",
        likes: 5,
        dislikes: 0,
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  },
];

import {
  MessageSquare,
  FileText,
  Hash,
  Code,
  Lightbulb,
  HelpCircle,
  Bookmark,
} from "lucide-react";
import { Card } from "../ui/card";
import { Category } from "../../types/forum";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Hash: <Hash className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  HelpCircle: <HelpCircle className="w-6 h-6" />,
  Bookmark: <Bookmark className="w-6 h-6" />,
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || (
    <MessageSquare className="w-6 h-6" />
  );

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <div style={{ color: category.color }}>{IconComponent}</div>
        </div>
        <div className="flex-1">
          <h3 className="mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {category.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{category.threadCount} threads</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{category.postCount} posts</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

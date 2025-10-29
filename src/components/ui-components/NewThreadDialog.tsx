import {useState} from 'react';
import {PlusCircle, Plus} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Textarea} from '../ui/textarea';
import {Label} from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {Category} from '../../types/forum';

interface NewThreadDialogProps {
  selectedCategory?: string;
  categories?: Category[];
  onCreateThread?: (title: string, content: string, category: string) => void;
}

export function NewThreadDialog({
  selectedCategory,
  categories = [],
  onCreateThread,
}: NewThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(selectedCategory || '');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = showNewCategory && newCategoryName ?
      newCategoryName.toLowerCase().replace(/\s+/g, '-') :
      category;

    if (title && content && finalCategory) {
      onCreateThread?.(title, content, finalCategory);
      setTitle('');
      setContent('');
      setCategory(selectedCategory || '');
      setNewCategoryName('');
      setShowNewCategory(false);
      setOpen(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === '__new__') {
      setShowNewCategory(true);
      setCategory('');
    } else {
      setShowNewCategory(false);
      setCategory(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          New Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>
              Start a new discussion thread. Make sure to choose the right category.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              {!showNewCategory ? (
                <Select value={category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create New Category</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    id="new-category"
                    placeholder="Enter new category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Thread Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="What would you like to discuss?"
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Thread</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

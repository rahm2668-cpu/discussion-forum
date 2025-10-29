import {useState} from 'react';
import {Button} from '../ui/button';
import {Textarea} from '../ui/textarea';
import {Card} from '../ui/card';

interface ReplyFormProps {
  onSubmit: (content: string) => void;
}

export function ReplyForm({onSubmit}: ReplyFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px]"
          required
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setContent('')}>
            Clear
          </Button>
          <Button type="submit">Post Reply</Button>
        </div>
      </form>
    </Card>
  );
}

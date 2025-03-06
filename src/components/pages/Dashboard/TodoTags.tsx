interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TodoTagsProps {
  tags: Tag[];
}

export function TodoTags({ tags }: TodoTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="px-2 py-1 rounded-md text-xs font-medium transition-all duration-200"
          style={{ 
            backgroundColor: `${tag.color}15`,
            color: tag.color,
            border: `1px solid ${tag.color}40`
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
} 
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
  noPadding?: boolean;
}

export function SectionContainer({
  children,
  className = '',
  as: Tag = 'section',
  noPadding = false,
}: SectionContainerProps) {
  return (
    <Tag className={`${noPadding ? '' : 'py-24 md:py-32'} ${className}`}>
      <div className="mx-auto max-w-container px-8 sm:px-10 md:px-14 lg:px-16">
        {children}
      </div>
    </Tag>
  );
}

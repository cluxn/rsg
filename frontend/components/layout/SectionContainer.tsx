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
    <Tag className={`${noPadding ? '' : 'py-28 md:py-40'} ${className}`}>
      <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        {children}
      </div>
    </Tag>
  );
}

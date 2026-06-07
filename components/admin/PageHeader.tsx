export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-lg flex flex-col md:flex-row justify-between md:items-end gap-md">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-xs">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body-md text-body-md text-on-surface-variant">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-sm">{action}</div>}
    </header>
  );
}

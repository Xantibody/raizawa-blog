interface ArticleNavProps {
  breadcrumbs?: { href: string; label: string }[];
}

export default function ArticleNav({ breadcrumbs = [] }: ArticleNavProps) {
  return (
    <nav class="sticky top-0 z-10 bg-base-200 py-2 -mx-4 px-4 mb-4">
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/">トップ</a>
          </li>
          {breadcrumbs.map((crumb) => (
            <li key={crumb.href}>
              <a href={crumb.href}>{crumb.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

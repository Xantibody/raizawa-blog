import { type Child } from "hono/jsx";
import { type TocItem } from "../lib/toc";

const MIN_TOC_ITEMS = 2;
const H2_LEVEL = 2;
const H3_LEVEL = 3;
const H3_INDENT = "pl-4";
const H4_INDENT = "pl-8";

const scrollspyScript = `{
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('article h2[id], article h3[id], article h4[id]');
  if (tocLinks.length === 0 || headings.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector('.toc-link[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    }
  }, { rootMargin: '-5rem 0px -80% 0px' });

  headings.forEach(h => observer.observe(h));
}`;

const shouldShowToc = (items: TocItem[]): boolean => items.length >= MIN_TOC_ITEMS;

const indentClass = (level: number): string => {
  if (level === H3_LEVEL) {
    return H3_INDENT;
  }
  if (level > H3_LEVEL) {
    return H4_INDENT;
  }
  return "";
};

const TocList = ({ items }: { items: TocItem[] }) => (
  <nav>
    <ul class="menu menu-sm">
      {items
        .filter((item) => item.level >= H2_LEVEL)
        .map((item) => (
          <li class={indentClass(item.level)} key={item.id}>
            <a href={`#${item.id}`} class="toc-link">
              {item.text}
            </a>
          </li>
        ))}
    </ul>
  </nav>
);

const MobileToc = ({ items }: { items: TocItem[] }) => (
  <details class="collapse collapse-arrow bg-base-100 shadow-sm mb-6 lg:hidden">
    <summary class="collapse-title font-bold">目次</summary>
    <div class="collapse-content">
      <TocList items={items} />
    </div>
  </details>
);

const TOC_DRAWER_ID = "toc-drawer";

const TocLayout = ({ items, children }: { items: TocItem[]; children: Child }) => {
  if (!shouldShowToc(items)) {
    return <>{children}</>;
  }
  return (
    <>
      <div class="drawer drawer-end lg:drawer-open">
        <input id={TOC_DRAWER_ID} type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <MobileToc items={items} />
          {children}
        </div>
        <div class="drawer-side z-40">
          <label for={TOC_DRAWER_ID} aria-label="close table of contents" class="drawer-overlay" />
          <div class="bg-base-200 min-h-full w-60 p-4">
            <h2 class="font-bold mb-2 text-sm">目次</h2>
            <TocList items={items} />
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: scrollspyScript }} />
    </>
  );
};

export { shouldShowToc, TocLayout };

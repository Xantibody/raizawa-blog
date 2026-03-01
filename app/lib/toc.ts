interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface RenderResult {
  html: string;
  toc: TocItem[];
}

export type { RenderResult, TocItem };

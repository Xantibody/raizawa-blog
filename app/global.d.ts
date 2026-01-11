interface Head {
  title?: string;
}

declare module "hono" {
  type ContextRenderer = (
    content: string | Promise<string>,
    head?: Head,
  ) => Response | Promise<Response>;
}

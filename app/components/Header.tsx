import { SITE_TITLE } from "../lib/config";

export const Header = () => {
  return (
    <header class="border-b-2 border-base-content pb-4 mb-8">
      <h1 class="text-3xl font-bold">{SITE_TITLE}</h1>
      <div class="flex gap-4 mt-2">
        <a
          href="https://github.com/Xantibody"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-primary"
        >
          GitHub
        </a>
        <a
          href="https://zenn.dev/master_peace_36"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-primary"
        >
          Zenn
        </a>
      </div>
    </header>
  );
};

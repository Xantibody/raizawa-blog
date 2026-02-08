import { SITE_TITLE } from "../lib/config";

export default function Header() {
  return (
    <div class="navbar bg-base-100 shadow-sm rounded-box mb-8">
      <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">
          {SITE_TITLE}
        </a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a href="/category">カテゴリ</a>
          </li>
          <li>
            <a href="/tag">タグ</a>
          </li>
          <li>
            <a href="https://github.com/Xantibody" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://zenn.dev/master_peace_36" target="_blank" rel="noopener noreferrer">
              Zenn
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

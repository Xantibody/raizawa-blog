// Post page specific styles
const postStyles = `
  .back-link {
    color: #0066cc;
    text-decoration: none;
  }
  .back-link:hover {
    text-decoration: underline;
  }
  h1 {
    margin: 0.5rem 0;
  }
  .post-meta {
    margin-bottom: 2rem;
  }
  article {
    margin-top: 2rem;
  }
  article h1 { font-size: 2rem; margin-top: 2rem; }
  article h2 { font-size: 1.75rem; margin-top: 1.75rem; }
  article h3 { font-size: 1.5rem; margin-top: 1.5rem; }
  article h4 { font-size: 1.25rem; margin-top: 1.25rem; }
  article blockquote {
    border-left: 4px solid #ddd;
    margin-left: 0;
    padding-left: 1rem;
    color: #666;
  }
  article table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  article table th,
  article table td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  article table th {
    background: #f4f4f4;
  }
  article ul, article ol {
    padding-left: 2rem;
  }
  article a {
    color: #0066cc;
    text-decoration: none;
  }
  article a:hover {
    text-decoration: underline;
  }
  article code:not(pre code) {
    background: #f0f0f0;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 0.9em;
    color: #e53e3e;
  }
`;

const codeBlockStyles = `
  pre.shiki {
    counter-reset: line;
    overflow-x: auto;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }
  pre.shiki .line::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2rem;
    margin-right: 1rem;
    text-align: right;
    color: #6a737d;
    user-select: none;
  }
  .code-title {
    background: #1f2428;
    color: #e1e4e8;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid #444d56;
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  }
  pre.shiki .line.diff.add {
    background-color: rgba(46, 160, 67, 0.2);
  }
  pre.shiki .line.diff.add::before {
    content: '+';
    color: #3fb950;
  }
  pre.shiki .line.diff.remove {
    background-color: rgba(248, 81, 73, 0.2);
  }
  pre.shiki .line.diff.remove::before {
    content: '-';
    color: #f85149;
  }
  pre.shiki .line.highlighted {
    background-color: rgba(56, 139, 253, 0.15);
  }
  pre.shiki .line.highlighted.error {
    background-color: rgba(248, 81, 73, 0.2);
  }
  pre.shiki .line.highlighted.warning {
    background-color: rgba(210, 153, 34, 0.2);
  }
`;

const ogpCardStyles = `
  .ogp-card {
    display: flex;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    margin: 1.5rem 0;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s;
    min-height: 120px;
  }
  .ogp-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-decoration: none;
  }
  .ogp-image {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 200px;
    height: 150px;
    overflow: hidden;
    background: #f0f0f0;
  }
  .ogp-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ogp-noimage {
    color: #999;
    font-size: 0.9rem;
  }
  .ogp-content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ogp-title {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }
  .ogp-description {
    display: block;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ogp-site {
    display: block;
    font-size: 0.85rem;
    color: #999;
  }
`;

const mobileStyles = `
  @media (max-width: 640px) {
    .ogp-card {
      flex-direction: column;
    }
    .ogp-image {
      width: 100%;
      height: 180px;
    }
    pre.shiki .line::before {
      display: none;
    }
    pre.shiki {
      font-size: 0.8rem;
    }
  }
`;

export { codeBlockStyles, mobileStyles, ogpCardStyles, postStyles };

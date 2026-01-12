// Common base styles shared across pages
const baseStyles = `
  body {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  header {
    border-bottom: 2px solid #333;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }
  h1 {
    margin: 0 0 0.5rem 0;
  }
  .links {
    display: flex;
    gap: 1rem;
  }
  .links a {
    text-decoration: none;
    color: #0066cc;
  }
  .links a:hover {
    text-decoration: underline;
  }
  .post-meta {
    color: #666;
    font-size: 0.9rem;
  }
  .post-tags {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .tag {
    background: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    color: #333;
    text-decoration: none;
  }
  .tag:visited {
    color: #333;
  }
  .tag:hover {
    background: #e0e0e0;
  }
  .post-meta a {
    color: #666;
    text-decoration: none;
  }
  .post-meta a:visited {
    color: #666;
  }
  .post-meta a:hover {
    text-decoration: underline;
  }
`;

export default baseStyles;

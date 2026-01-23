// Index page specific styles
const indexStyles = `
  .posts {
    list-style: none;
    padding: 0;
  }
  .post-item {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  .post-item:last-child {
    border-bottom: none;
  }
  .post-title {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }
  .post-title a {
    color: #333;
    text-decoration: none;
  }
  .post-title a:hover {
    color: #0066cc;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }
  .pagination-link {
    color: #0066cc;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }
  .pagination-link:hover {
    text-decoration: underline;
  }
  .pagination-info {
    color: #666;
  }
`;

export default indexStyles;

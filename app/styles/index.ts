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
    gap: 1rem;
  }
  .pagination-prev,
  .pagination-next {
    flex: 0 0 8rem;
  }
  .pagination-prev {
    text-align: left;
  }
  .pagination-next {
    text-align: right;
  }
  .pagination-link {
    color: #0066cc;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }
  .pagination-link:hover {
    text-decoration: underline;
  }
  .pagination-numbers {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .pagination-number {
    color: #0066cc;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    min-width: 2rem;
    text-align: center;
  }
  .pagination-number:hover {
    background: #f0f0f0;
    border-radius: 4px;
  }
  .pagination-current {
    background: #0066cc;
    color: white;
    border-radius: 4px;
    font-weight: bold;
  }
  .pagination-ellipsis {
    color: #666;
    padding: 0.25rem 0.5rem;
  }
`;

export default indexStyles;

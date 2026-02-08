import { getPageHref, getPageNumbers, getPrevHref } from "../lib/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevHref = getPrevHref(currentPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div class="flex justify-center mt-8 pt-6 border-t border-base-300">
      <div class="join">
        {currentPage > 1 && (
          <a href={prevHref} class="join-item btn btn-sm">
            «
          </a>
        )}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${index}`} class="join-item btn btn-sm btn-disabled">
                ...
              </span>
            );
          }
          const pageNumber = Number(pageNum);
          if (pageNumber === currentPage) {
            return (
              <span key={pageNumber} class="join-item btn btn-sm btn-primary">
                {pageNumber}
              </span>
            );
          }
          return (
            <a key={pageNumber} href={getPageHref(pageNumber)} class="join-item btn btn-sm">
              {pageNumber}
            </a>
          );
        })}
        {currentPage < totalPages && (
          <a href={`/page/${currentPage + 1}`} class="join-item btn btn-sm">
            »
          </a>
        )}
      </div>
    </div>
  );
}

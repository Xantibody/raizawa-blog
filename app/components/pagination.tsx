const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const getPrevHref = (currentPage: number): string => {
  if (currentPage === SECOND_PAGE) {
    return "/";
  }
  return `/page/${currentPage - 1}`;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevHref = getPrevHref(currentPage);

  const getPageHref = (page: number): string => {
    if (page === FIRST_PAGE) {
      return "/";
    }
    return `/page/${page}`;
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showRange = 1;

    for (let pageNum = FIRST_PAGE; pageNum <= totalPages; pageNum++) {
      const isFirst = pageNum === FIRST_PAGE;
      const isLast = pageNum === totalPages;
      const isNearCurrent = Math.abs(pageNum - currentPage) <= showRange;

      if (isFirst || isLast || isNearCurrent) {
        pages.push(pageNum);
      } else if (pages.at(-1) !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

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

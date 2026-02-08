const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const prevHref = currentPage === SECOND_PAGE ? "/" : `/page/${currentPage - 1}`;

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
    <div class="join mt-8 pt-6 border-t border-base-300 flex justify-center">
      {currentPage > 1 && (
        <a href={prevHref} class="join-item btn">
          «
        </a>
      )}
      {pageNumbers.map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <span key={`ellipsis-${index}`} class="join-item btn btn-disabled">
              ...
            </span>
          );
        }
        const pageNumber = Number(pageNum);
        if (pageNumber === currentPage) {
          return (
            <span key={pageNumber} class="join-item btn btn-active">
              {pageNumber}
            </span>
          );
        }
        return (
          <a key={pageNumber} href={getPageHref(pageNumber)} class="join-item btn">
            {pageNumber}
          </a>
        );
      })}
      {currentPage < totalPages && (
        <a href={`/page/${currentPage + 1}`} class="join-item btn">
          »
        </a>
      )}
    </div>
  );
};

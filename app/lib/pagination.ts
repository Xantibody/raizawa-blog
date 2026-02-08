const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

/**
 * Get the href for the previous page button.
 * Page 1 is at "/" and page 2+ is at "/page/{n}".
 *
 * @param {number} currentPage - The current page number
 * @returns {string} The href string for the previous page
 */
const getPrevHref = (currentPage: number): string => {
  if (currentPage === SECOND_PAGE) {
    return "/";
  }
  return `/page/${currentPage - 1}`;
};

/**
 * Get the href for a specific page number.
 * Page 1 is at "/" and page 2+ is at "/page/{n}".
 *
 * @param {number} page - The page number to get the href for
 * @returns {string} The href string for the page
 */
const getPageHref = (page: number): string => {
  if (page === FIRST_PAGE) {
    return "/";
  }
  return `/page/${page}`;
};

/**
 * Generate page numbers with ellipsis for pagination display.
 * Always shows first, last, and pages within showRange of currentPage.
 *
 * @param {number} currentPage - The current page number
 * @param {number} totalPages - The total number of pages
 * @param {number} showRange - Number of pages to show around current page (default: 1)
 * @returns {(number | string)[]} Array of page numbers and "..." strings
 *
 * @example
 * getPageNumbers(5, 10, 1) // [1, "...", 4, 5, 6, "...", 10]
 * getPageNumbers(1, 10, 1) // [1, 2, "...", 10]
 * getPageNumbers(10, 10, 1) // [1, "...", 9, 10]
 */
const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  showRange = 1,
): (number | string)[] => {
  const pages: (number | string)[] = [];

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

export { getPageHref, getPageNumbers, getPrevHref };

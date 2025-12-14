import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers
  const pages = [];
  const showEllipsis = totalPages > 7;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Show pages 2, 3, 4, 5
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 3) {
      // Show last 5 pages
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show 2 pages before and 2 pages after current
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    // Always add ellipsis and last page
    pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`pagination-page ${page === currentPage ? 'active' : ''} ${
              page === '...' ? 'ellipsis' : ''
            }`}
            onClick={() => page !== '...' && handlePageClick(page as number)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

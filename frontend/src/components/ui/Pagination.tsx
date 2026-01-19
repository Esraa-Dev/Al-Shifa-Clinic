import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaginationProps } from "../../types/types";



const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
            currentPage === i
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-white text-gray-600 hover:bg-primary/10 border border-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12" dir={i18n.dir()}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-white border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex items-center gap-2 cursor-pointer">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-white border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default Pagination;
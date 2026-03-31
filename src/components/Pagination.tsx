
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

const Pagination = ({
  currentPage,
  hasPrev,
  hasNext,
}: {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="flex justify-between mt-12 w-full">
      <button
        title="previous"
        className="rounded-md bg-vortexBuy text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        disabled={!hasPrev}
        onClick={() => createPageURL(currentPage - 1)}
      >
        Previous
      </button>

      <button
        title="next"
        className="rounded-md bg-vortexBuy text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        disabled={!hasNext}
        onClick={() => createPageURL(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

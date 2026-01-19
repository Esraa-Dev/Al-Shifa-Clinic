export const getPaginationData = (
  page: any,
  limit: any,
  totalItems: number
) => {
  const currentPage = parseInt(page?.toString()) || 1;
  const itemsLimit = parseInt(limit?.toString()) || 10;
  const totalPages = Math.ceil(totalItems / itemsLimit);

  return {
    totalItems,
    totalPages,
    currentPage,
    limit: itemsLimit,
  };
};

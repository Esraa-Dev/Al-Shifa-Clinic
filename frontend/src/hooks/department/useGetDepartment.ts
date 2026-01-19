import { useQuery } from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";

export const useGetDepartment = (
  page?: number,
  limit?: number,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: ["departments", page, searchQuery],
    queryFn: () => departmentService.getDepartments(page, limit, searchQuery),
    staleTime: 10 * 60 * 1000,
  });
};

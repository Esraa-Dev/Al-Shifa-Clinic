import { useQuery } from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";

export const useGetDepartment = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getDepartments,
    staleTime: 10 * 60 * 1000,
  });
}
import { useMutation } from "@tanstack/react-query";
import { fetchCoordinates } from "../api/fetchCoordinates"; // Adjust the path based on your file structure

// Custom hook for fetching coordinates using React Query mutation
export const useFetchCoordinates = () => {
  return useMutation({
    mutationFn: (pincode) => fetchCoordinates(pincode),
  });
};

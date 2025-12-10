import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const useSelect = () => {
    return {
        user : useSelector((state : RootState) => state.auth.user),
        isAuthenticated : useSelector((state : RootState) => state.auth.isAuthenticated),
    }
}
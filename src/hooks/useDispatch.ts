import { loginSuccess, logout, type User } from "@/store/slices/auth.slice"
import { useDispatch } from "react-redux"

export const useAuthActions = () => {
    const dispatch = useDispatch();
    return {
        login : (payload : User) => {dispatch(loginSuccess(payload))},
        logout : () => {dispatch(logout())},
    }
}
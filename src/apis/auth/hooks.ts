import { useMutation } from '@tanstack/react-query';
import { loginUser, signupUser } from '@/apis/auth/auth.api';

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useSignup() {
    return useMutation({
        mutationFn : signupUser,
    })
}

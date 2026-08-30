import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/authApi';
import type {
  ResetPasswordParams,
  ResetPasswordRequestParams,
  VerifyResetCodeParams,
} from '@/types/auth';

export const useRequestResetCode = () => {
  return useMutation({
    mutationFn: (params: ResetPasswordRequestParams) =>
      authApi.resetPasswordRequest(params),
    onSuccess: (data) => {
      toast.success(data?.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
    },
    onError: (error: Error) => {
      toast.error('تعذر إرسال الرمز', {
        description: error.message || 'يرجى التحقق من صحة البريد الإلكتروني.',
      });
    },
  });
};

export const useVerifyResetCode = () => {
  return useMutation({
    mutationFn: (params: VerifyResetCodeParams) =>
      authApi.verifyResetCode(params),
    onSuccess: (data) => {
      toast.success(data?.message || 'تم التحقق من الرمز بنجاح.');
    },
    onError: (error: Error) => {
      toast.error('رمز التحقق غير صحيح', {
        description: error.message || 'يرجى التأكد من الرمز المدخل أو طلب رمز جديد.',
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) =>
      authApi.resetPassword(params),
    onSuccess: (data) => {
      toast.success(data?.message || 'تم تعيين كلمة المرور الجديدة بنجاح.');
    },
    onError: (error: Error) => {
      toast.error('تعذر إعادة تعيين كلمة المرور', {
        description: error.message || 'يرجى المحاولة مرة أخرى.',
      });
    },
  });
};

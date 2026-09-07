import { type ChangeEvent, type FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login, register, type LoginCredentials, type RegisterCredentials } from "../../api/auth";
import { LoadingState } from "../../components/ui/loading-state";
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from "./auth-schemas";
import { currentUserQueryKey } from "./use-current-user";
import TextField from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";

type Mode = "login" | "register";
type FormValues = LoginFormValues | RegisterFormValues;
type FieldErrors = Partial<Record<keyof RegisterFormValues, string>>;

function getErrorMessage(error: Error) {
  if (error instanceof AxiosError && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }

  return "Something went wrong. Please try again.";
}

function validationErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field as keyof FieldErrors]) {
      errors[field as keyof FieldErrors] = issue.message;
    }
    return errors;
  }, {});
}

// main component
export function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRegister = mode === "register";

  const [values, setValues] = useState<RegisterFormValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials | RegisterCredentials) => "name" in credentials ? register(credentials) : login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      toast.success(isRegister ? "Account created." : "Signed in successfully.");
      navigate("/profile", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const schema = isRegister ? registerSchema : loginSchema;
    const result = schema.safeParse(isRegister ? values : { email: values.email, password: values.password });

    if (!result.success) {
      setErrors(validationErrors(result.error.issues));
      return;
    }

    setErrors({});
    mutation.mutate(result.data satisfies FormValues);
  }

  const title = isRegister ? "Create your account" : "Sign in";
  const submitLabel = isRegister ? "Create account" : "Sign in";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 py-8 sm:min-h-[calc(100vh-6rem)]">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 shadow-lg sm:p-8">
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2"><span className="h-5 w-1 rounded-full bg-slate-900" /><p className="text-sm font-medium text-slate-500">File Processing Platform</p></div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{isRegister ? "Use your details to set up access to your workspace." : "Enter your account details to continue."}</p>
        </div>

        <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
          {isRegister && <TextField autoComplete="name" error={errors.name} label="Name" name="name" onChange={handleChange} value={values.name} />}
          <TextField autoComplete="email" error={errors.email} label="Email address" name="email" onChange={handleChange} type="email" value={values.email} />
          <TextField autoComplete={isRegister ? "new-password" : "current-password"} error={errors.password} label="Password" name="password" onChange={handleChange} type="password" value={values.password} />
          {isRegister && <TextField autoComplete="new-password" error={errors.confirmPassword} label="Confirm password" name="confirmPassword" onChange={handleChange} type="password" value={values.confirmPassword} />}

          <Button type="submit" fullWidth isLoading={mutation.isPending} loadingText="Please wait">
            {submitLabel}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Register"}</Link>
        </p>
      </section>
    </div>
  );
}

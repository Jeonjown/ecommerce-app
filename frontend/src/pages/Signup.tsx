import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { useSignupUser } from "../hooks/useSignupUser";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const { mutate, isPending, isSuccess, error, data } = useSignupUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-lg border border-gray-300 bg-white p-6 md:shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Create Your Account
          <p className="mt-2 text-center text-base font-normal text-gray-500">
            Sign up to continue.
          </p>
        </h1>

        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Full Name</label>
            <input
              {...register("name")}
              type="text"
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
              autoComplete="name"
            />
            {errors.name?.message && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Email</label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.email?.message && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Password</label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="relative w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />

            {showPassword ? (
              <FaRegEye
                className="absolute top-9 right-3"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              />
            ) : (
              <LuEyeClosed
                className="absolute top-9 right-3"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              />
            )}
            {errors.password?.message && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col">
            <label className="mb-1 text-sm text-gray-600">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              autoComplete="new-password"
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.confirmPassword?.message && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
            {showConfirmPassword ? (
              <FaRegEye
                className="absolute top-9 right-3"
                onClick={() => {
                  setShowConfirmPassword((prev) => !prev);
                }}
              />
            ) : (
              <LuEyeClosed
                className="absolute top-9 right-3"
                onClick={() => {
                  setShowConfirmPassword((prev) => !prev);
                }}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          {isPending ? "Creating..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
        {data && <p className="text-green-500">{data.message}</p>}
      </form>
    </div>
  );
};

export default Signup;

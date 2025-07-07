import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { useLoginUser } from "../hooks/useLoginUser";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate, data, error, isPending } = useLoginUser();

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
          Welcome Back
          <p className="mt-2 text-center text-base font-normal text-gray-500">
            Log in to your account to continue.
          </p>
        </h1>

        <div className="flex flex-col gap-4">
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
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
        {data && <p className="text-green-500">{data.message}</p>}
      </form>
    </div>
  );
};

export default Login;

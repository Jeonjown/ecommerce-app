import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { useLoginUser } from "../hooks/useLoginUser";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, data, error, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "user@email.com",
      password: "Testpass123!",
    },
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
          <p className="mt-2 text-base text-gray-500">
            Log in to your account to continue.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email?.message && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
            />
            <div
              className="absolute top-7 right-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEye /> : <LuEyeClosed />}
            </div>
            {errors.password?.message && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {isPending ? "Logging in..." : "Log in"}
        </Button>

        {error && <p className="text-sm text-red-500">{error.message}</p>}
        {data && <p className="text-sm text-green-500">{data.message}</p>}
      </form>
    </div>
  );
};

export default Login;

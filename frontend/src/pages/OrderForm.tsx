import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  middleName: z.string().nonempty("Middle name is required"),
  surname: z.string().nonempty("Surname is required"),
  suffix: z.string().optional(),
  street: z.string().nonempty("Street is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  zipcode: z.string().nonempty("Zip code is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(11, "Invalid phone number"),
  age: z.coerce.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }),
  birthday: z
    .string()
    .nonempty("Birthday is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

type FormData = z.infer<typeof schema>;

const OrderForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-screen-lg space-y-6 rounded-lg bg-white p-5 shadow-md md:border md:border-gray-300 md:p-8"
      >
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create Your Account
          <p className="mb-6 text-center text-lg font-normal text-gray-500">
            Sign up to continue.
          </p>
        </h1>

        {/* Name Section */}
        <div className="text-lg font-semibold text-gray-700">Name</div>
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex min-w-[150px] flex-[2] flex-col">
            <label className="mb-1 text-sm text-gray-600">First Name</label>
            <input
              {...register("firstName")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.firstName?.message && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </div>
          <div className="flex min-w-[120px] flex-[1.5] flex-col">
            <label className="mb-1 text-sm text-gray-600">Middle Name</label>
            <input
              {...register("middleName")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.middleName?.message && (
              <span className="text-red-500">{errors.middleName.message}</span>
            )}
          </div>
          <div className="flex min-w-[150px] flex-[2] flex-col">
            <label className="mb-1 text-sm text-gray-600">Surname</label>
            <input
              {...register("surname")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.surname?.message && (
              <span className="text-red-500">{errors.surname.message}</span>
            )}
          </div>
          <div className="flex max-w-[120px] min-w-[80px] flex-[0.5] flex-col">
            <label className="mb-1 text-sm text-gray-600">Suffix</label>
            <input
              {...register("suffix")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.suffix?.message && (
              <span className="text-red-500">{errors.suffix.message}</span>
            )}
          </div>
        </div>

        {/* Age and Birthday */}
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex min-w-[100px] flex-1 flex-col">
            <label className="mb-1 text-sm text-gray-600">Age</label>
            <input
              type="number"
              {...register("age")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.age?.message && (
              <span className="text-red-500">{errors.age.message}</span>
            )}
          </div>
          <div className="flex min-w-[200px] flex-2 flex-col">
            <label className="mb-1 text-sm text-gray-600">Birthday</label>
            <input
              type="date"
              {...register("birthday")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.birthday?.message && (
              <span className="text-red-500">{errors.birthday.message}</span>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="text-lg font-semibold text-gray-700">Address</div>
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex min-w-[200px] flex-[3] flex-col">
            <label className="mb-1 text-sm text-gray-600">Street</label>
            <input
              {...register("street")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.street?.message && (
              <span className="text-red-500">{errors.street.message}</span>
            )}
          </div>
          <div className="flex min-w-[150px] flex-[2] flex-col">
            <label className="mb-1 text-sm text-gray-600">City</label>
            <input
              {...register("city")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.city?.message && (
              <span className="text-red-500">{errors.city.message}</span>
            )}
          </div>
          <div className="flex max-w-[150px] min-w-[100px] flex-[1] flex-col">
            <label className="mb-1 text-sm text-gray-600">State</label>
            <input
              {...register("state")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.state?.message && (
              <span className="text-red-500">{errors.state.message}</span>
            )}
          </div>
          <div className="flex max-w-[120px] min-w-[80px] flex-[0.8] flex-col">
            <label className="mb-1 text-sm text-gray-600">Zip Code</label>
            <input
              {...register("zipcode")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.zipcode?.message && (
              <span className="text-red-500">{errors.zipcode.message}</span>
            )}
          </div>
        </div>

        {/* Contacts Section */}
        <div className="text-lg font-semibold text-gray-700">Contacts</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-1 flex-col">
            <label className="mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.email?.message && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-1 flex-col">
            <label className="mb-1 text-sm text-gray-600">Phone Number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
            {errors.phoneNumber?.message && (
              <span className="text-red-500">{errors.phoneNumber.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

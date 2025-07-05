import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    suffix: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    email: "",
    phoneNumber: "",
    age: "",
    birthday: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-screen-lg space-y-6 rounded-lg bg-white p-5 shadow-md md:border md:border-gray-500 md:p-8"
      >
        {/* Heading */}
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
            <label htmlFor="firstName" className="mb-1 text-sm text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex min-w-[120px] flex-[1.5] flex-col">
            <label htmlFor="middleName" className="mb-1 text-sm text-gray-600">
              Middle Name
            </label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex min-w-[150px] flex-[2] flex-col">
            <label htmlFor="surname" className="mb-1 text-sm text-gray-600">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex max-w-[120px] min-w-[80px] flex-[0.5] flex-col">
            <label htmlFor="suffix" className="mb-1 text-sm text-gray-600">
              Suffix
            </label>
            <input
              type="text"
              id="suffix"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
          {/* Age and Birthday */}
          <div className="flex w-full flex-wrap gap-4">
            <div className="flex min-w-[100px] flex-1 flex-col">
              <label htmlFor="age" className="mb-1 text-sm text-gray-600">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div className="flex min-w-[200px] flex-2 flex-col">
              <label htmlFor="birthday" className="mb-1 text-sm text-gray-600">
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="text-lg font-semibold text-gray-700">Address</div>
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex min-w-[200px] flex-[3] flex-col">
            <label htmlFor="street" className="mb-1 text-sm text-gray-600">
              Street
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex min-w-[150px] flex-[2] flex-col">
            <label htmlFor="city" className="mb-1 text-sm text-gray-600">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex max-w-[150px] min-w-[100px] flex-[1] flex-col">
            <label htmlFor="state" className="mb-1 text-sm text-gray-600">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex max-w-[120px] min-w-[80px] flex-[0.8] flex-col">
            <label htmlFor="zipcode" className="mb-1 text-sm text-gray-600">
              Zip Code
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts Section */}
        <div className="text-lg font-semibold text-gray-700">Contacts</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-1 flex-col">
            <label htmlFor="email" className="mb-1 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="phoneNumber" className="mb-1 text-sm text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+123456789"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
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

export default Signup;

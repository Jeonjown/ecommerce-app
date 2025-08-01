const Error = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-2 text-2xl text-gray-800">Something went wrong.</p>
      <p className="mt-1 text-gray-600">
        We couldn't load this page. Please try again later.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-lg bg-red-500 px-6 py-2 text-white transition hover:bg-red-600"
      >
        Go Home
      </a>
    </div>
  );
};

export default Error;

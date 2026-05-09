import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-8">
        You do not have permission to access this page.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}

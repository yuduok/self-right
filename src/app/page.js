import Link from "next/link";
import Image from "next/image";

// This is a Server Component by default in Next.js App Router
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-8">
        <h1 className="text-4xl font-bold text-center">
          Welcome to Self-Right
        </h1>

        <p className="text-xl text-center max-w-2xl">
          A secure platform for digital identity management and verification
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            prefetch={true}
          >
            Dashboard
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 text-lg font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            prefetch={true}
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 text-lg font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
            prefetch={true}
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

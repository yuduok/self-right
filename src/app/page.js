import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center h-screen gap-5">
        <Link href="/dashboard">
          dashboard
        </Link>
        <Link href="/login">
          login
        </Link>
        <Link href="/register">
          register
        </Link>
      </div>
    </>
  );
}

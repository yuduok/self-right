import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Link href="/dashboard">
          dashboard
        </Link>
      </div>
    </>
  );
}

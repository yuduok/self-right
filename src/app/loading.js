// This is a Server Component by default
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-xl font-medium">Loading...</p>
      </div>
    </div>
  );
}

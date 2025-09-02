export default function NotFoundPage() {
  return (
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-2">404 — Page not found</h1>
        <p class="text-gray-500 mb-4">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <div class="flex justify-center items-center gap-4 mt-4">
          <a
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            href="/"
          >
            Go home
          </a>
          <a
            class="text-blue-500 hover:underline"
            href="javascript:history.back()"
          >
            Go back
          </a>
        </div>
      </div>
    </div>
  );
}

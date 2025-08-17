export default function Dashboard() {
  return (
    <div class="grid gap-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      <h2 class="text-lg font-semibold text-gray-800">
        🔒 Protected Dashboard
      </h2>
      <p class="text-gray-600">
        This page is secured by Arfa.js route protection.
      </p>
      <p class="text-sm text-gray-500">
        👉 Check out <code>pages/dashboard/_layout.tsx</code> to see how it
        works.
      </p>
    </div>
  );
}

// ℹ️ Note: Route protection in Arfa.js is handled
// via layout files (e.g., `pages/dashboard/_layout.tsx`).
// Super easy to set up!

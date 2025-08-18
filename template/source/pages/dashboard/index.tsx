export default function Dashboard() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        🔒 Protected Dashboard
      </h2>
      <p className="text-gray-600 mb-4">
        This page is secured by Arfa.js route protection.
      </p>
      <p className="text-sm text-gray-500">
        👉 Check out <code>pages/dashboard/_layout.tsx</code> to see how it
        works.
      </p>
    </div>
  );
}

// ℹ️ Note: Route protection in Arfa.js is handled
// via layout files (e.g., `pages/dashboard/_layout.tsx`).
// Super easy to set up!

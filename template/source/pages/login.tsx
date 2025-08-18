export default function Login() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        🔒 Login Page!
      </h2>
      <p className="text-gray-600 mb-4">
        You were redirected here because protect function returned false!
      </p>
      <p className="text-sm text-gray-500">
        👉 Check out <code>pages/dashboard/_layout.tsx</code> to see how it
        works.
      </p>
    </div>
  );
}

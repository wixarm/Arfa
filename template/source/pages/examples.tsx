import { onMounted, onEffect, ref } from "arfa-reactives";

/**
 * Examples Component - Reactive state + lifecycle, with a link to the Context demo
 */
export default function Examples() {
  // 1) Reactive state
  const [count, setCount] = ref(1);
  const [showMessage, setShowMessage] = ref(true);

  // 2) Lifecycle
  onMounted(() => {
    console.log("Component mounted!");
    console.log("Initial count:", count());
  });

  // 3) Effects
  onEffect(() => {
    console.log("Count changed to:", count());
    return () => console.log("Cleaning up effect for count:", count());
  }, [count]);

  onEffect(() => {
    console.log("Show message state changed:", showMessage());
  }, [showMessage]);

  // 4) Handlers
  const increment = () => setCount((c) => (c ?? 0) + 1);
  const toggleMessage = () => setShowMessage((prev) => !prev);

  return (
    <div class="p-4 max-w-md mx-auto">
      <h1 class="text-xl font-bold mb-4">Examples</h1>

      {/* Display current count */}
      <div class="mb-2">Current count: {count()}</div>

      {/* Buttons */}
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        onClick={increment}
      >
        Increment (+1)
      </button>

      <button
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={toggleMessage}
      >
        Toggle Message
      </button>

      {/* Conditional rendering */}
      {showMessage() && (
        <div class="mt-4 p-2 bg-green-100 border border-green-400 text-green-700">
          {count() % 2 === 0 ? (
            <span>Count is even!</span>
          ) : (
            <span>Count is odd!</span>
          )}
        </div>
      )}

      {/* Effect demonstration */}
      <div class="mt-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700">
        Check browser console to see effect logs as you interact!
      </div>

      {/* ---- NEW: Navigate to /context (Context demo) ---- */}
      <div class="mt-6 p-3 border rounded bg-slate-50">
        <p class="text-sm text-slate-700 mb-2">
          Want to see how to use <strong>Context</strong> in Arfa JS? Click the
          button below to open the dedicated demo page.
        </p>

        <a
          href="/context"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Open Context example"
          title="Open Context example"
        >
          Open Context Demo
        </a>

        <p class="mt-2 text-xs text-slate-500">
          Tip: The Context demo shows creating a <code>createContext</code>,
          providing a value with <code>withContext</code>, and reading it via{" "}
          <code>useContext</code>. It also includes a persisted store example so
          values survive refresh.
        </p>
      </div>
    </div>
  );
}

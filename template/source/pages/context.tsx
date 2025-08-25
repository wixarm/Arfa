import {
  onMounted,
  onEffect,
  ref,
  createContext,
  useContext,
  withContext,
} from "arfa-reactives";

/**
 * Counter Context + Persist (no child components)
 *
 * - Creates a Context<number>
 * - Uses a persisted ref<number> as the store
 * - Provides the ref *getter* via withContext(...)
 * - Consumes the value with useContext(...) inside the same callback
 */

// Full localStorage key = keyPrefix + key
const COUNT_KEY = "arfa:examples:count";

// Optional: seed from storage so first paint matches persisted value (SSR-safe)
function readInitialCount(defaultValue = 0): number {
  try {
    if (typeof window === "undefined") return defaultValue;
    const raw = window.localStorage.getItem(COUNT_KEY);
    if (!raw) return defaultValue;
    const env = JSON.parse(raw) as { v?: number; d: unknown };
    const n = Number((env as any).d);
    return Number.isFinite(n) ? n : defaultValue;
  } catch {
    return defaultValue;
  }
}

// 1) Define a context (holds *value*, not setter)
const CountCtx = createContext<number>(0);

export default function CounterWithContext() {
  // 2) Persisted store for the counter
  //    NOTE: pass the seeded value so first client render matches storage.
  const [countRef, setCount] = ref<number>(readInitialCount(0), {
    persist: {
      key: "examples:count", // -> "arfa:examples:count"
      version: 1,
      keyPrefix: "arfa:",
      // sync: true (default)
    },
  });

  // Logs just to show it’s hydrating and updating
  onMounted(() => {
    console.log("Mounted. Hydrated count =", countRef());
  });
  onEffect(() => {
    console.log("Count changed ->", countRef());
  }, [countRef]);

  // 3) Provide the context and render everything *inside* the provider callback
  return withContext(CountCtx, countRef, () => {
    // 4) Consume: returns the current number (auto-updates on change)
    const count = useContext(CountCtx);

    // Handlers
    const inc = () => setCount((c) => (c ?? 0) + 1);
    const dec = () => setCount((c) => (c ?? 0) - 1);
    const reset = () => setCount(0);

    return (
      <div class="p-4 max-w-md mx-auto space-y-4">
        <h1 class="text-xl font-bold">Counter (Context + Persist)</h1>

        <div class="p-2 border rounded">
          <div class="text-sm opacity-70">Context value</div>
          <div class="text-2xl font-semibold">{count}</div>
        </div>

        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={inc}
          >
            +1
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={dec}
          >
            -1
          </button>
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={reset}
          >
            Reset
          </button>
        </div>

        <div class="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Refresh the page — the count remains the same (persisted in
          localStorage).
        </div>
      </div>
    );
  });
}

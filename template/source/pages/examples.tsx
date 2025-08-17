import { onMounted, onEffect, ref } from "arfa-reactives";

/**
 * Examples Component - Demonstrates reactive state and lifecycle hooks
 *
 * Features shown:
 * - Creating and using reactive state with ref()
 * - Component lifecycle with onMounted()
 * - Side effects with dependencies using onEffect()
 * - Conditional rendering based on state
 * - Event handlers with state updates
 */
export default function Examples() {
  // 1. Creating reactive state
  // ref() returns a getter function and setter function
  // Initial value is 1
  const [count, setCount] = ref(1);
  const [showMessage, setShowMessage] = ref(true);

  // 2. Component Lifecycle Hook
  // Runs once when component is added to the DOM
  onMounted(() => {
    console.log("Component mounted!");
    // You can access initial state values here
    console.log("Initial count:", count());

    // Example: Could fetch data here
    // fetchData().then(data => setData(data));
  });

  // 3. Effect Hook with Dependency
  // Runs after render when dependencies change
  onEffect(() => {
    console.log("Count changed to:", count());

    // Example side effects:
    // - Updating document title
    // - Making API calls
    // - Working with browser APIs

    // Cleanup function (optional)
    return () => {
      console.log("Cleaning up effect for count:", count());
    };
  }, [count]); // Only re-run when count changes

  // Another effect with different dependency
  onEffect(() => {
    console.log("Show message state changed:", showMessage());
  }, [showMessage]);

  // 4. Event Handlers
  const increment = () => {
    // Update state using functional update to ensure we have latest value
    setCount((c) => (c ?? 0) + 1);
  };

  const toggleMessage = () => {
    setShowMessage((prev) => !prev);
  };

  // 5. Conditional Rendering
  // The component re-renders when state changes
  return (
    <div class="p-4 max-w-md mx-auto">
      <h1 class="text-xl font-bold mb-4">Examples</h1>

      {/* Display current count */}
      <div class="mb-2">Current count: {count()}</div>

      {/* Button to update state */}
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        onClick={increment}
      >
        Increment (+1)
      </button>

      {/* Another state-controlled button */}
      <button
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={toggleMessage}
      >
        Toggle Message
      </button>

      {/* Conditional rendering based on state */}
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
    </div>
  );
}

/**
 * Key Concepts Explained:
 *
 * 1. REACTIVE STATE (ref):
 * - Use ref() to create state that triggers re-renders when changed
 * - Returns [getter, setter] pair
 * - Always access value using getter: count()
 * - Update using setter: setCount(newValue) or setCount(prev => prev + 1)
 *
 * 2. LIFECYCLE HOOKS (onMounted):
 * - Runs once when component is added to DOM
 * - Good for initialization, API calls, event listeners
 *
 * 3. EFFECT HOOKS (onEffect):
 * - Runs after render when dependencies change
 * - Add dependencies array to control when it runs
 * - Return cleanup function for subscriptions, etc.
 *
 * 4. BEST PRACTICES:
 * - Keep state updates pure
 * - Use functional updates when new state depends on previous
 * - Organize related state and effects together
 * - Clean up resources in effect cleanup functions
 *
 * 5. CONDITIONAL RENDERING:
 * - Use JavaScript expressions in JSX
 * - && operator for simple conditions
 * - Ternary for if/else
 */

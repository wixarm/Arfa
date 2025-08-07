export default function App() {
  const count = 0;

  return (
    <div className="app">
      <h1>Pure JSX App</h1>
      <p>No React Needed!</p>
      <button onClick={() => alert("Clicked!")}>Click Me ({count})</button>
    </div>
  );
}

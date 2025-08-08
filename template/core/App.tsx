import { h, Fragment } from "./runtime/jsx";
import "./styles.css";

export default function App() {
  const handleAlert = () => {
    alert("hello!");
  };
  return (
    <>
      <h1 class="test" onClick={handleAlert}>
        Welcome to Arfa App
      </h1>
      <div>test</div>
    </>
  );
}

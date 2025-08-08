import { h, Fragment } from "./runtime/jsx";
import "./styles.css";

export default function App() {
  return (
    <>
      <h1 class="test" onClick={() => alert("test")}>
        Welcome to Arfa App
      </h1>
      <div>test</div>
    </>
  );
}

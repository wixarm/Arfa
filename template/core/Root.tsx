import { WellcomeApp } from "./partials/WellcomeApp";
import "./styles.css";

export default function Root() {
  const handleAlert = () => {
    alert("hello!");
  };
  return (
    <>
      <h1 cl="test" onClick={handleAlert}>
        Welcome to Arfa App
      </h1>

      <WellcomeApp />
      <div>test</div>
    </>
  );
}

import { NavBar } from "../layout/NavBar";
import { FC } from "arfa-types";

const RootLayout: FC = ({ children }) => {
  return (
    <div class="h-dvh overflow-hidden">
      <NavBar />
      <div class="bg-gray-950 h-full text-gray-100 flex flex-col items-center justify-center overflow-hidden relative">
        <div class="content">{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;

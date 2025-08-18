import { FC, GuardFn } from "arfa-types";

/**
 * Authentication guard for protected routes.
 * Returns `true` if access is granted, `false` otherwise.
 * Put your real auth logic here (token/session check).
 */
export const protect: GuardFn = () => {
  // TODO: Implement actual authentication logic
  return true;
};

/**
 * Redirect path for unauthorized access.
 * Router will send users here if `protect` returns false.
 */
export const protectRedirect = "/login" as const;

// If your router passes params to layouts, include them:

const DashboardLayout: FC = ({ children }) => {
  return (
    <div class="bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div class="content">{children}</div>
    </div>
  );
};

export default DashboardLayout;

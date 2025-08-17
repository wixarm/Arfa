/**
 * Authentication guard for protected routes.
 * @returns {boolean} - Returns `true` if access is granted, `false` if denied.
 * @description
 * When this function returns `true`, the routes within this layout will be accessible.
 * Implement your authentication logic here (e.g., check auth tokens, session validation).
 */
export function protect() {
  // TODO: Implement actual authentication logic
  return true;
}

/**
 * Redirect path for unauthorized access.
 * @constant
 * @type {string}
 * @description
 * Users who fail the protect() check will be redirected to this path.
 * Modify this to match your application's authentication flow.
 */
export const protectRedirect = "/login";

export default function DashboardLayout({ children }: any) {
  return (
    <div class="bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div class="content">{children}</div>
    </div>
  );
}

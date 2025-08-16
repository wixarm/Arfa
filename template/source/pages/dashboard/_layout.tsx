export function protect() {
  return true;
} // define protect routes with this structure. when this function returns true, the routes of this layout will be avalable!

export const protectRedirect = "/login"; //you can easily setup redirect url if user is not able to see the routes

export default function DashboardLayout({ children }: any) {
  return (
    <div class="bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div class="content">{children}</div>
    </div>
  );
}

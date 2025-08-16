export function protect() {
  return true;
}

export default function DashboardLayout({ children }: any) {
  return (
    <div class="bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div class="content">{children}</div>
    </div>
  );
}

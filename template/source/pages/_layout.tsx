export default function RootLayout({ children }: any) {
  return (
    <div class="root-layout">
      <div class="content">{children}</div>
    </div>
  );
}

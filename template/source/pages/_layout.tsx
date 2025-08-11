export default function RootLayout({ children }: any) {
  return (
    <div class="root-layout">
      <nav>Root nav</nav>
      <div class="content">{children}</div>
    </div>
  );
}

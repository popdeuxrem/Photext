// This layout can be used to add a consistent header or sidebar
// for the main application views after a user is logged in.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen w-screen">{children}</div>;
}

import UnifiedSidebar from "@/components/shared/unified-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UnifiedSidebar>{children}</UnifiedSidebar>
    </div>
  );
}

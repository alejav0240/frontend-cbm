import Navbar from "@/shared/ui/Navbar";

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

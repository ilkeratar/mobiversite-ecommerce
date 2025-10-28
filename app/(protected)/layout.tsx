import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-2">{children}</main>
      <Footer />
    </div>
  );
} 

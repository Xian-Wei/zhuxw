import Navbar from "../Navbar";

export default function BlogLayout({ children }: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto flex-1">{children}</main>
      <footer className="mt-8 py-4">
        <div className="container mx-auto flex justify-center">
          &copy; 2023 Xian-Wei Zhu
        </div>
      </footer>
    </div>
  );
}

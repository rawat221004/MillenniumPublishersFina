import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Millennium Publishers Admin</h1>
          </div>
          <nav className="mt-4">
            <ul className="flex space-x-6">
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/proposals" className="hover:text-primary transition-colors">
                  Proposals
                </Link>
              </li>
              <li>
                <Link href="/admin/enquiries" className="hover:text-primary transition-colors">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/admin/books" className="hover:text-primary transition-colors">
                  Books
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}

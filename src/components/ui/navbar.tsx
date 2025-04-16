import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/#">
            <Image 
              src="/fulllogo-removebg.png" 
              alt="Millennium Enterprises Logo" 
              width={120} 
              height={40} 
              className="object-contain h-20 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/books" className="text-sm font-medium transition-colors hover:text-primary">
            Books
          </Link>
          <Link href="/subjects" className="text-sm font-medium transition-colors hover:text-primary">
            Subjects
          </Link>
          <Link href="/publishers" className="text-sm font-medium transition-colors hover:text-primary">
            Publishers
          </Link>
          <Link href="/proposal" className="text-sm font-medium transition-colors hover:text-primary">
            Book Proposal
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            AboutUs
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="contact"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Enquiry
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar

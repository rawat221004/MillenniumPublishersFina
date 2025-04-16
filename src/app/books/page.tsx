"use client"

import Link from "next/link"
// Remove unused Image import from next/image if only using <img>
// import Image from "next/image" 
import { ChevronRight, Menu, X } from "lucide-react"
import { useState, useEffect } from "react" 
import { supabase } from "@/lib/supabase.js"; 

// Define the Book type matching the admin page and Supabase table
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string; // Keep this as the original public URL or path
  amazon_link?: string;
  created_at: string;
  signedImageUrl?: string | null; // Add optional property for the signed URL
}


function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground p-2.5 transition-all hover:bg-primary/90"
        aria-label="Toggle Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div 
          style={{ backgroundColor: "#2563eb" }} // Explicit blue color
          className="fixed inset-0 top-16 z-[100] border-t animate-in slide-in-from-left duration-300 h-[100vh] w-full"
        >
          <div className="container py-8">
            <div className="grid gap-8 py-6">
              <div className="border-l-4 border-primary-foreground pl-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </div>
              <div className="border-l-4 border-primary-foreground/90 pl-6">
                <Link
                  href="/about"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  About Us
                </Link>
              </div>
              <div className="border-l-4 border-primary-foreground/80 pl-6">
                <Link
                  href="/books"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Books
                </Link>
              </div>
              <div className="border-l-4 border-primary-foreground/70 pl-6">
                <Link
                  href="/proposal"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Book Proposal
                </Link>
              </div>
              <div className="border-l-4 border-primary-foreground/60 pl-6">
                <Link
                  href="/publishers"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Publishers
                </Link>
              </div>
              <div className="border-l-4 border-primary-foreground/50 pl-6">
                <Link
                  href="/subjects"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  Subjects
                </Link>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/#contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-background px-8 text-base font-medium text-primary shadow transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => setOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BooksPage() { 
  const [books, setBooks] = useState<Book[]>([]); // State holds books with potentially signed URLs
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBooksAndGenerateSignedUrls = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: fetchedBooks, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (fetchError) {
        console.error("Error fetching books:", fetchError);
        setError("Failed to load books. Please try again later.");
        setBooks([]);
        setIsLoading(false);
        return;
      }

      if (!fetchedBooks) {
        setBooks([]);
        setIsLoading(false);
        return;
      }

      // Generate signed URLs for each book image
      const booksWithSignedUrls = await Promise.all(
        fetchedBooks.map(async (book) => {
          let signedImageUrl: string | null = null;
          // Extract path from the full public URL stored in image_url
          const bucketName = "book-covers"; // Your bucket name
          const publicUrlPrefix = `/storage/v1/object/public/${bucketName}/`;
          const pathStartIndex = book.image_url.indexOf(publicUrlPrefix);
          
          if (pathStartIndex !== -1) {
            const imagePath = book.image_url.substring(pathStartIndex + publicUrlPrefix.length);
            
            if (imagePath) {
              const { data: signedUrlData, error: signError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(imagePath, 3600); // 3600 seconds = 1 hour expiration

              if (signError) {
                console.error(`Error generating signed URL for ${imagePath}:`, signError);
              } else {
                signedImageUrl = signedUrlData.signedUrl;
              }
            }
          } else {
             console.warn(`Could not extract path from image_url: ${book.image_url}`);
          }

          return { ...book, signedImageUrl };
        })
      );

      setBooks(booksWithSignedUrls);
      setIsLoading(false);
    };

    fetchBooksAndGenerateSignedUrls();
  }, []); 

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              {/* Use standard img tag for potentially external URLs */}
              <img
                src="/fulllogo-removebg.png"
                alt="Millennium Enterprises Logo"
                width={120}
                height={40} // Maintain aspect ratio if possible
                className="object-contain h-20 w-auto"
                // priority // priority is a Next/Image prop, remove if using <img>
              />
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/books" className="text-sm font-medium transition-colors hover:text-primary">
              Books
            </Link>
            <Link href="/proposal" className="text-sm font-medium transition-colors hover:text-primary">
              Book Proposal
            </Link>
            <Link href="/publishers" className="text-sm font-medium transition-colors hover:text-primary">
              Publishers
            </Link>
            <Link href="/subjects" className="text-sm font-medium transition-colors hover:text-primary">
              Subjects
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link
              href="/#contact"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Enquiry
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-8 md:py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">Featured Books</h1>

          {isLoading && <p className="text-center">Loading books...</p>}
          {error && <p className="text-center text-destructive">{error}</p>}

          {!isLoading && !error && (
            <div className="space-y-8">
              {books.length === 0 ? (
                 <p className="text-center text-muted-foreground">No books available at the moment.</p>
              ) : (
                books.map((book) => (
                  // Dynamically render each book
                  <div key={book.id} className="flex flex-col md:flex-row gap-6 border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="w-full md:w-48 flex-shrink-0">
                      {/* Use signedImageUrl if available, otherwise fallback or show placeholder */}
                      {book.signedImageUrl ? (
                        <img
                          src={book.signedImageUrl} // Use the generated signed URL
                          alt={book.title}
                          className="object-cover w-full h-auto rounded-md"
                        />
                      ) : (
                        // Optional: Placeholder if signed URL failed or path was invalid
                        <div className="w-full h-auto bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <h2 className="text-xl font-bold">{book.title}</h2>
                      <p className="text-muted-foreground">
                        by <span className="text-primary">{book.author}</span>
                      </p>

                      {/* Conditionally render Amazon link */}
                      {book.amazon_link && (
                         <a
                           href={book.amazon_link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm inline-block hover:bg-yellow-200 transition-colors"
                         >
                           Buy On Amazon
                         </a>
                      )}

                      <p className="text-sm text-muted-foreground">
                        {book.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img
                src="/fulllogo-removebg.png"
                alt="Millennium Enterprises Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Millennium Enterprises. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link> */}
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


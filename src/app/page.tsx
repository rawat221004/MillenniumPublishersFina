"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BookOpen, Award, Users, BookMarked, Menu, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { insertData } from "./lib/supabase"

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
                  href="#"
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
                href="#contact"
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

export default function Home() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  // Form status
  const [formStatus, setFormStatus] = useState<{
    isSubmitting: boolean;
    isSubmitted: boolean;
    error: string | null; // Allow string or null for error
  }>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // Add event type
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Add event type
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: 'Please fill out all fields' // Assign string to error
      });
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: 'Please enter a valid email address' // Assign string to error
      });
      return;
    }

    try {
      setFormStatus({
        isSubmitting: true,
        isSubmitted: false,
        error: null
      });
      // Using standard column names that likely match the database
      const { data, error } = await insertData('enquiry', {
        name: formData.name,         // Using "name" instead of "user_name"
        email: formData.email,       // Using "email" instead of "user_email"
        message: formData.message,   // Using "message" instead of "user_message"
        // phone: formData.phone,    // Add phone if you have it in the form
      });

      if (error) {
        throw error; // Throw the Supabase error
      }

      // Reset form and set submitted status
      setFormData({ name: '', email: '', message: '' });
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      // Optional: Hide success message after a delay
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);

    } catch (error: any) { // Catch error as any or unknown
      console.error('Submission error:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        // Safely access message, provide fallback
        error: error?.message || 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
              href="#contact"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Enquiry
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[url('/bookimg.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Literary Excellence
                </h1>
                <p className="mx-auto max-w-[700px] text-lg/relaxed md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-light">
                Curating emerging ideas, technologies, and innovations that challenge, transform, and redefine the future across disciplines.                </p>
              </div>
              <div className="space-x-4 animate-fade-in-up">
                <Link
                  href="/books"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="featured" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                  Featured Publications
                </div>
                <h2 className="text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">Literary Masterpieces</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Explore our Carefully Curated Collection of Thought-Provoking and Beautifully Crafted Literary Works.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
              {/* Book 1 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-lg">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src="/book1.png"
                    alt="Software Architecture book cover"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Link href="/books" target="_blank" className="inline-flex items-center text-sm font-medium">
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif text-xl font-medium">L&T Body Of Knowledge - Case Studies</h3>
                  <p className="text-sm text-muted-foreground mt-1">By Prof. Rajiv Nehru, Dr. Debopam Roy, Dr.Aviraj Bajpai, Dr. Dharmendra Trivedi</p>
                </div>
              </div>

              {/* Book 2 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-lg">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src="/book2.png"
                    alt="Machine Learning book cover"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Link href="/books" target="_blank" className="inline-flex items-center text-sm font-medium">
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif text-xl font-medium">INTELLIGENT FORENSICS</h3>
                  <p className="text-sm text-muted-foreground mt-1">By Dr. Nilakshi Jain & Maj. Vineet Kumar</p>
                </div>
              </div>

              {/* Book 3 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-lg">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src="/book3.png"
                    alt="Cloud Computing book cover"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Link href="/books" target="_blank" className="inline-flex items-center text-sm font-medium">
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif text-xl font-medium">Project Management for Profitable Growth</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    By Prof. Rajiv Nehru, Dr. Hiren Maniar, Dr. Ravindra Shrivastava, Dr. Dharmendra Trivedi
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/books"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Books
              </Link>
            </div>
          </div>
        </section>

        {/* <section id="authors" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Literary Voices</div>
                <h2 className="text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">Meet Our Authors</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Discover the brilliant minds behind our exceptional literary collection.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
              {[1, 2, 3].map((author) => (
                <div key={author} className="group flex flex-col items-center text-center">
                    <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
                    <Image
                      src="/author.JPG"
                      alt={`Author ${author}`}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                    />
                    </div>
                  <h3 className="font-serif text-xl font-medium">Jonathan Winters</h3>
                  <p className="text-sm text-muted-foreground mt-1">Award-winning novelist</p>
                  <p className="text-sm mt-4 max-w-xs">
                    Known for captivating narratives that explore the depths of human experience.
                  </p>
                  <Link href="#" className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    View Profile <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Creating Legacy</div>
                  <h2 className="text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
                    A Tradition of Literary Excellence
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg">
                    Based in Mumbai and founded in 2024, Millennium Enterprises supplies diverse, high-quality printed
                    and e-books across textbooks, references, and professional titles worldwide.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/proposal"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Book Proposal
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-6">
                    <BookMarked className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-medium">5+</h3>
                    <p className="text-sm text-center text-muted-foreground">Published Works</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-6">
                    <Award className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-medium">5+</h3>
                    <p className="text-sm text-center text-muted-foreground">Ratings</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-6">
                    <Users className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-medium">10+</h3>
                    <p className="text-sm text-center text-muted-foreground">Renowned Authors</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-6">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-medium">2+</h3>
                    <p className="text-sm text-center text-muted-foreground">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Get in Touch</div>
                <h2 className="text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">Connect With Us</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Have questions or interested in our publications? We'd love to hear from you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 mt-12">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Contact Information</h3>
                  <p className="text-muted-foreground">
                    Our team is here to assist you with any inquiries about our publications, authors, or events.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Email:</span> millenniumbookss@gmail.com
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Phone:</span> +91-9819828188 / +91-8657502418
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Address:</span> C/5-C, Mangaldas Wadi, Opp Temple, Naaz Cinema
                    Compound 393, Lamington Road, Mumbai - 400 004
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={formStatus.isSubmitting}
                  ></textarea>
                </div>
                
                {formStatus.error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{formStatus.error}</span>
                  </div>
                )}
                
                {formStatus.isSubmitted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your message has been sent successfully!</span>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                  disabled={formStatus.isSubmitting}
                >
                  {formStatus.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/#">
              <Image
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
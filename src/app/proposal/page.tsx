"use client"

import Link from "next/link"
import Image from "next/image"
import LocationDropdowns from "./LocationDropdowns"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { SuccessPopup } from '@/components/ui/success-popup'

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
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  // Form data state
  const [formData, setFormData] = useState({
    proposedTitle: '',
    status: '',
    description: '',
    name: '',
    address: '',
    pinCode: '',
    contactNo: '',
    email: '',
    topics: '',
    shelving: '',
    readership: '',
    whyInterest: '',
    betterThan: '',
    international: '',
    size: '',
    format: '',
    printRun: '',
    royalty: '',
    requirements: '',
    price: '',
    illustrations: [] as string[],
    suggestedType: '',
    bindingStyle: [] as string[]
  })

  // Use useEffect to handle client-side only code
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [name]: [...(prev[name as keyof typeof prev] as string[] || []), value]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: (prev[name as keyof typeof prev] as string[] || []).filter(item => item !== value)
      }))
    }
  }

  // Handle radio button change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Submit handler with Supabase integration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Get manuscript file
      const formElement = e.target as HTMLFormElement
      const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput.files?.[0]
      
      let fileUrl = null
      
      // Upload file if provided
      if (file) {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `book_proposals/${fileName}`
        
        // Upload to Supabase Storage in 'images' bucket
        const { error: uploadError, data } = await supabase.storage
          .from('images')
          .upload(filePath, file)
        
        if (uploadError) {
          throw new Error(uploadError.message)
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        
        fileUrl = urlData.publicUrl
      }
      
      // Submit form data to Supabase
      const { error: insertError } = await supabase
        .from('book_proposals')
        .insert({
          ...formData,
          manuscript_url: fileUrl,
          created_at: new Date().toISOString(),
        })
      
      if (insertError) {
        throw new Error(insertError.message)
      }
      
      setFormSubmitted(true)
      setShowSuccessPopup(true) // Show success popup
      formElement.reset()
      
      // Reset form state
      setFormData({
        proposedTitle: '',
        status: '',
        description: '',
        name: '',
        address: '',
        pinCode: '',
        contactNo: '',
        email: '',
        topics: '',
        shelving: '',
        readership: '',
        whyInterest: '',
        betterThan: '',
        international: '',
        size: '',
        format: '',
        printRun: '',
        royalty: '',
        requirements: '',
        price: '',
        illustrations: [],
        suggestedType: '',
        bindingStyle: []
      })
      
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Only render the full content when the component is mounted on the client
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Simplified header for SSR */}
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Logo placeholder */}
            </div>
            <div></div>
          </div>
        </header>
        <main className="flex-1">
          <div className="container py-8 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Book Proposal Form</h1>
            <div className="h-screen"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
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
          <div className="container py-8 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Book Proposal Form</h1>

            {formSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Thank you for your proposal submission!</p>
                <p>We will review your information and get back to you soon.</p>
              </div>
            ) : null}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Error submitting form</p>
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Title</div>
                <div className="p-4">
                  <div className="space-y-2">
                    <label htmlFor="proposedTitle" className="text-sm">Proposed Title*</label>
                    <input 
                      type="text" 
                      id="proposedTitle" 
                      name="proposedTitle"
                      value={formData.proposedTitle}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Status of Manuscript</div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="status" 
                        value="planning" 
                        checked={formData.status === 'planning'}
                        onChange={handleRadioChange}
                      />
                      Planning
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="status" 
                        value="completed" 
                        checked={formData.status === 'completed'}
                        onChange={handleRadioChange}
                      />
                      Completed
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="status" 
                        value="partiallyCompleted" 
                        checked={formData.status === 'partiallyCompleted'}
                        onChange={handleRadioChange}
                      />
                      Partially Completed
                    </label>
                  </div>
                </div>
              </div>

              {/* File Upload section - with Supabase integration */}
              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Upload Manuscript</div>
                <div className="p-4">
                  <input
                    type="file"
                    name="manuscript"
                    accept=".doc,.docx,.rtf,.pdf,.txt,.jpg,.jpeg,.png"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-gray-500 mt-1">(Supported files: DOC, DOCX, RTF, PDF, TXT, JPG, PNG. Max size: 5MB)*</p>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Book Description</div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Topics Covered, Book&apos;s Scope, Approach, Special Features. In Case of New Edition, differences from the Past edition/revision.
                    </label>
                    <textarea 
                      id="description" 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2 min-h-[100px]" 
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Author Information</div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name of Author(s) / Editor(s) with Affiliations*
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm">
                      Corresponding Address*
                    </label>
                    <input 
                      type="text" 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2" 
                      required 
                    />
                  </div>

                  {/* Location Dropdowns Component */}
                  <LocationDropdowns />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="pinCode" className="text-sm">
                        Pin Code*
                      </label>
                      <input 
                        type="text" 
                        id="pinCode" 
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactNo" className="text-sm">
                        Contact No*
                      </label>
                      <input 
                        type="tel" 
                        id="contactNo" 
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm">
                        Email*
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="border rounded-md overflow-hidden">
                <div className="bg-blue-800 text-white p-2 font-medium">Target Audience</div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="topics" className="text-sm font-medium">
                      Topics*
                    </label>
                    <textarea 
                      id="topics" 
                      name="topics"
                      value={formData.topics}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2 min-h-[100px]" 
                      required
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shelving" className="text-sm font-medium">
                      Shelving / Subjects*
                    </label>
                    <textarea 
                      id="shelving" 
                      name="shelving"
                      value={formData.shelving}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2 min-h-[100px]" 
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="readership" className="text-sm font-medium">
                    Readership*
                  </label>
                  <textarea 
                    id="readership" 
                    name="readership"
                    value={formData.readership}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="whyInterest" className="text-sm font-medium">
                    Why would they be interested in this book?*
                  </label>
                  <textarea 
                    id="whyInterest" 
                    name="whyInterest"
                    value={formData.whyInterest}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="betterThan" className="text-sm font-medium">
                    How would your book be better than the competing titles?*
                  </label>
                  <textarea 
                    id="betterThan" 
                    name="betterThan"
                    value={formData.betterThan}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="international" className="text-sm font-medium">
                    International Appeal*
                  </label>
                  <textarea 
                    id="international" 
                    name="international"
                    value={formData.international}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="size" className="text-sm font-medium">
                    Size (Approx. Extent of Manuscript)*
                  </label>
                  <textarea 
                    id="size" 
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="format" className="text-sm font-medium">
                    Suggested Format / Size*
                  </label>
                  <textarea 
                    id="format" 
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="printRun" className="text-sm font-medium">
                    Print Run*
                  </label>
                  <textarea 
                    id="printRun" 
                    name="printRun"
                    value={formData.printRun}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label htmlFor="royalty" className="text-sm font-medium">
                    Division of Royalty if Joint Authors*
                  </label>
                  <textarea 
                    id="royalty" 
                    name="royalty"
                    value={formData.royalty}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 min-h-[100px]" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="requirements" className="text-sm font-medium">
                  Any Other Requirements?*
                </label>
                <textarea 
                  id="requirements" 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 min-h-[100px]" 
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Suggested Published Price*
                </label>
                <input 
                  type="text" 
                  id="price" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2" 
                  required 
                />
              </div>

              {/* Illustrations */}
              <div className="space-y-2">
                <label className="text-sm font-medium">No. of Illustrations</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="illustrations" 
                      value="bwLine" 
                      checked={formData.illustrations.includes('bwLine')}
                      onChange={handleCheckboxChange}
                    />
                    B/W Line
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="illustrations" 
                      value="bwPhotos" 
                      checked={formData.illustrations.includes('bwPhotos')}
                      onChange={handleCheckboxChange}
                    />
                    B/W Photos
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="illustrations" 
                      value="coloredPhotos" 
                      checked={formData.illustrations.includes('coloredPhotos')}
                      onChange={handleCheckboxChange}
                    />
                    Colored Photos / Illustrations
                  </label>
                </div>
              </div>

              {/* Suggested Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Suggested Type</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="suggestedType" 
                      value="hardbound" 
                      checked={formData.suggestedType === 'hardbound'}
                      onChange={handleRadioChange}
                    />
                    Hardbound
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="suggestedType" 
                      value="paperback" 
                      checked={formData.suggestedType === 'paperback'}
                      onChange={handleRadioChange}
                    />
                    Paperback
                  </label>
                </div>
              </div>

              {/* Binding Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Binding Style</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="bindingStyle" 
                      value="jacket" 
                      checked={formData.bindingStyle.includes('jacket')}
                      onChange={handleCheckboxChange}
                    />
                    Jacket
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="bindingStyle" 
                      value="hbPaster" 
                      checked={formData.bindingStyle.includes('hbPaster')}
                      onChange={handleCheckboxChange}
                    />
                    H/B Paster
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="bindingStyle" 
                      value="paperback" 
                      checked={formData.bindingStyle.includes('paperback')}
                      onChange={handleCheckboxChange}
                    />
                    Paperback
                  </label>
                </div>
              </div>

              {/* Submit Button with loading state */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-800 text-white px-8 py-3 rounded-md font-medium transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Submitting...' : 'SUBMIT'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <footer className="w-full border-t bg-background py-6 md:py-8">
          <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
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
              <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Form Submitted Successfully!"
        message="Thank you for submitting your book proposal. We will review your submission and get back to you soon."
      />
    </>
  )
}


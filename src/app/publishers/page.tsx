"use client"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

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

const publishersData = [
  "A K PETERS",
  "ACADEMIC PRESS",
  "ADDISON WESLEY",
  "AMACOM",
  "AMERICAN CHEMICAL SOCIETY",
  "AMERICAN MATHEMATICAL SOCIETY",
  "ANE BOOKS",
  "ANTHEM PRESS",
  "APA PUBLISHING",
  "APRESS",
  "ARTECH HOUSE",
  "MICHIGAN PRESS",
  "ASHGATE",
  "ASM PRESS",
  "ASTRAL PUBLISHER",
  "AUERBACH PUBLICATIONS",
  "AVA",
  "BIRKHAUSER",
  "BLACKWELL PUBLISHING",
  "BLOOMSBURY",
  "BSP",
  "BUTTERWORTH-HEINEMANN",
  "CAMBRIDGE UNIVERSITY PRESS",
  "CABI",
  "CBS PUBLISHERS",
  "CENGAGE",
  "CHICAGO UNIVERSITY PRESS",
  "CHURCHILL LIVINGSTONE",
  "CLANRYE INTERNATIONAL",
  "COLUMBIA UNIVERSITY PRESS",
  "CALIFORNIA UNIVERSITY PRESS",
  "CRC PRESS",
  "CSHL PRESS",
  "DAYA PUBLISHING HOUSE",
  "DEGRUYTER",
  "DOVER PUBLICATIONS",
  "DREAMTECH PRESS",
  "EDWARD ELGAR PUBLISHING",
  "ELSEVIER",
  "FACET PUBLISHING",
  "FREEMAN MACMILLAN",
  "GOWER",
  "GUILFORD PRESS",
  "HACHETTE",
  "HARPER COLLINS",
  "HARVARD UNIVERSITY PRESS",
  "HINDUSTAN BOOK AGENCY",
  "HUMAN KINETICS",
  "HUMANA PRESS",
  "I.K. INTERNATIONAL",
  "ICE PUBLISHING",
  "IEEE PRESS",
  "IET PUBLISHING",
  "INTECH",
  "ISLAND PRESS",
  "JAICO PUBLISHING HOUSE",
  "JOHN WILEY",
  "JOHNS HOPKINS",
  "JONES & BARTLETT",
  "JOSSEY-BASS",
  "SPRINGER",
  "KLUWER",
  "KRUGER BRENTT",
  "KOGAN PAGE",
  "LIPPINCOTT",
  "LWW",
  "MACMILLAN",
  "MAPLE PRESS",
  "MARCEL DEKKER",
  "MCGRAW HILL",
  "MEDTECH",
  "MEHUL BOOK SALES",
  "MIT PRESS",
  "NEWNES",
  "ORIENT BLACKSWAN",
  "OXFORD UNIVERSITY PRESS",
  "PALGRAVE MACMILLAN",
  "PEARSON",
  "PENGUIN",
  "PHARMA MED PRESS",
  "PHARMACEUTICAL PRESS",
  "PHI PRENTICE HALL",
  "POLITY",
  "PRINCETON UNIVERSITY PRESS",
  "PSYCHOLOGY PRESS",
  "RAWAT PUBLICATION",
  "RED GLOBE PRESS",
  "RIVER PUBLISHERS",
  "ROUTLEDGE",
  "ROWMAN & LITTLEFIELD",
  "ROYAL SOCIETY OF CHEMISTRY",
  "S CHAND",
  "SAGE PUBLISHING",
  "SARAT BOOK DISTRIBUTORS",
  "SIMON & SCHUSTER",
  "SINAUER",
  "SPRINGER",
  "STANFORD UNIVERSITY PRESS",
  "TERI PRESS",
  "TAYLOR & FRANCIS",
  "TECHSAR",
  "TULIKA BOOKS",
  "VIVA",
  "W W NORTON & COMPANY",
  "WAVELAND PRESS",
  "WESTVIEW PRESS",
  "WILEY INDIA",
  "JOHN WILEY",
  "WORLD SCIENTIFIC",
  "WOODHEAD PUBLISHING",
  "WOLTERS KLUWER",
  "YALE UNIVERSITY PRESS"
]

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="bg-gray-300 h-48 w-full"></div>
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default function PublishersPage() {
  const itemsPerRow = 4
  const rows = []
  for (let i = 0; i < publishersData.length; i += itemsPerRow) {
    rows.push(publishersData.slice(i, i + itemsPerRow))
  }

  return (
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
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Publishers</h1>
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-[#e6f0ff]" : "bg-[#d9e6ff]"}>
                    {row.map((publisher, colIndex) => (
                      <td key={colIndex} className="border border-[#b3d1ff] p-2 text-xs md:text-sm">
                        {publisher.toUpperCase()}
                      </td>
                    ))}
                    {/* Fill empty cells if row is not complete */}
                    {row.length < itemsPerRow &&
                      Array(itemsPerRow - row.length)
                        .fill(null)
                        .map((_, i) => <td key={`empty-${i}`} className="border border-[#b3d1ff] p-2"></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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


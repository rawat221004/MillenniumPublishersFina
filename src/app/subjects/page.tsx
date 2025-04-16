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

const subjectsData = [
  "abnormal psychology",
  "accounting",
  "adolescents",
  "aerospace engineering",
  "african politics",
  "agricultural science",
  "agriculture",
  "algebra",
  "algorithms",
  "allied health",
  "analytical chemistry",
  "anatomy",
  "anatomy & physiology",
  "ancient philosophy",
  "anesthesiology",
  "animal science",
  "anthropology",
  "applied mathematics",
  "applied physics",
  "aquaculture",
  "aquatic scinece",
  "archaeology",
  "architecture",
  "artificial intelligence",
  "arts and photography",
  "astronomy",
  "astronomy & astrophysics",
  "astrophysics",
  "automotive engineering",
  "big data",
  "bio energy",
  "biochemistry",
  "bioinformatics",
  "biology",
  "biomedical engineering",
  "biophysics",
  "biostatistics and epidemiology",
  "biotechnology",
  "botany",
  "business & management",
  "business ethics",
  "business management",
  "business mathematics",
  "business, management",
  "calculus",
  "cardiology",
  "cell & molecular biology",
  "cell biology",
  "chemical engineering",
  "chemistry",
  "child & adolescent",
  "child health",
  "children & adolescents",
  "circuitry",
  "civil engineering",
  "classical literature",
  "climatology",
  "clinical nutrition",
  "college text & reference",
  "combinatorics",
  "communication",
  "communication technology",
  "communications engineering",
  "computational statistics",
  "computer algorithms",
  "computer engineering",
  "computer graphics",
  "computer science",
  "construction materials",
  "conveyancing law",
  "corporate social responsibility",
  "crime and society",
  "criminal justice",
  "criminology",
  "criminology & criminal j",
  "critical management studies",
  "critical theory",
  "cyber security",
  "dairy science",
  "data mining",
  "data science",
  "database management",
  "databases",
  "decision-making,computer science",
  "democracy",
  "dermatology",
  "design",
  "design,drafting,drawing and presentation",
  "development economics",
  "developmental english",
  "differential equations",
  "dynamics",
  "earth science",
  "ecology",
  "economics",
  "education",
  "elecgtronics engineering",
  "electrical & electronics engineering",
  "electrical engineering",
  "electronics & electrical engineering",
  "electronics engineering",
  "engineering",
  "engineering design",
  "engineering management",
  "english law",
  "english literature",
  "entrepreneurship",
  "environment",
  "environmental",
  "environmental engineering",
  "environmental engineering & technology",
  "environmental management",
  "environmental politics",
  "environmental science",
  "environmental sciences",
  "environmental studies",
  "equine science",
  "events planning",
  "evolutionary and developmental biology",
  "fabric",
  "finance",
  "food chemistry",
  "food science",
  "forensic science",
  "forestry",
  "gastroenterology",
  "gender",
  "gender politics",
  "general",
  "genetics",
  "geography",
  "geology",
  "geometry",
  "geoscience",
  "graphic design",
  "graphics",
  "gynecology",
  "hardware",
  "health care",
  "health science",
  "hematology",
  "history",
  "history and philosophy",
  "history of engineering",
  "history of technology",
  "horticulture",
  "human genetics",
  "human resource management",
  "human rights",
  "humanities & social science",
  "humanities,mathematics & science",
  "humanities,mathematics and science",
  "image processing",
  "immunology",
  "industrial chemistry",
  "industrial design",
  "industrial electronics",
  "industrial engineering",
  "inorganic chemistry",
  "international politics",
  "internet",
  "journalism",
  "journalsim",
  "kinesiology",
  "language",
  "language & linguistic",
  "language & linguistics",
  "law",
  "learning",
  "library & information science",
  "life science",
  "life sciences",
  "literary criticism",
  "literature",
  "litrature",
  "machine design",
  "machine learning",
  "macroeconomics",
  "management",
  "management and marketing",
  "management education",
  "management of technology",
  "manufacturing & processing",
  "marine engineering",
  "marketing",
  "mass media",
  "mass media & communication",
  "massmedia",
  "material science",
  "material science & naotechnology",
  "material sciences",
  "materials",
  "materials engineering",
  "materials science",
  "materials sciences",
  "mathematic",
  "mathematics",
  "measurement",
  "mechancial engineering",
  "mechanical",
  "mechanical engineering",
  "mechanics",
  "media & communications",
  "media & flim studies",
  "media ethics",
  "media theory",
  "media, information",
  "medical",
  "medical education",
  "medical research",
  "medical science",
  "medicine",
  "microbiology",
  "microeconomics",
  "microelectronics",
  "microwave engineering",
  "military",
  "molecular biology",
  "monitoring and environmental analysis",
  "multilinear algebra",
  "nanomaterials",
  "nanoscience & nanotechnology",
  "nanotechnology",
  "natural history",
  "network",
  "networking",
  "neurology",
  "neuroscience",
  "neurosurgery",
  "nonlinear",
  "nonlinear, statistical and mathematical physics",
  "nuclear engineering",
  "nursing",
  "nutrition",
  "oncology",
  "operations research",
  "ophthalmology",
  "optics",
  "optoelectronics",
  "orthopedics",
  "others",
  "para clinical",
  "paralegal",
  "pathology",
  "pharmacy",
  "phenomenology",
  "philosophy",
  "philosophy and education",
  "philosophy of science",
  "phonetics",
  "photography",
  "physical chemistry",
  "physics",
  "plant",
  "plant ecology",
  "plant science",
  "poetry",
  "political economy",
  "political science",
  "politics",
  "politics & development",
  "polymer science",
  "popular astronomy",
  "power and energy",
  "power resources",
  "pre-calculus",
  "probability & statistics",
  "professional practice",
  "programming",
  "programming languages",
  "projects & industries",
  "property law",
  "psychiatry",
  "psychology",
  "public health",
  "pulmonary medicine",
  "quality control",
  "quantum chemistry",
  "quantum mechanics",
  "quantum theory",
  "radar",
  "radiography",
  "radiology",
  "real estate",
  "regional surveys",
  "religion",
  "religious history",
  "renewable energy",
  "reporting",
  "research methods in education",
  "rn",
  "robotics & automation",
  "science",
  "science & technology",
  "science education",
  "security",
  "semantics",
  "separation processing",
  "signal processing",
  "social geography",
  "social policy",
  "social science",
  "social sciences",
  "social work",
  "sociology",
  "software",
  "software engineering",
  "soil science",
  "space science",
  "sports",
  "sports business",
  "sports psychology",
  "statistical computing",
  "statistics",
  "statistics & probability",
  "strategic",
  "strategic management",
  "surgery",
  "taxation",
  "teaching",
  "technology & engineering",
  "technology and engineering",
  "telecommunication",
  "telecommunication technology",
  "telecommunications",
  "telecomunication",
  "textile engineering",
  "theoretical computer science",
  "tourism",
  "tourism development",
  "toxicology",
  "urban planning",
  "urban sociology",
  "urology",
  "veterinary",
  "veterinary medicine",
  "vetrinary science",
  "virology",
  "virology and parasitology",
  "waste management",
  "women's health nursing",
  "world regional geography",
  "writing",
  "youth counseling",
  "zoology",
];

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

export default function SubjectsPage() {
  const itemsPerRow = 4
  const rows = []
  for (let i = 0; i < subjectsData.length; i += itemsPerRow) {
    rows.push(subjectsData.slice(i, i + itemsPerRow))
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
          <h1 className="text-3xl font-bold mb-6">Subjects</h1>
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-[#e6f0ff]" : "bg-[#d9e6ff]"}>
                    {row.map((subject, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-[#b3d1ff] p-2 text-xs md:text-sm text-black"
                      >
                        {subject.toUpperCase()}
                      </td>
                    ))}
                    {/* Fill empty cells if row is not complete */}
                    {row.length < itemsPerRow &&
                      Array(itemsPerRow - row.length)
                        .fill(null) // Provide null as fill value
                        .map((_, i) => (
                          <td key={`empty-${i}`} className="border border-[#b3d1ff] p-2"></td>
                        ))}
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
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


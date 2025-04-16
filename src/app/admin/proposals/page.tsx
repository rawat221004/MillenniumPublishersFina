"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase' // Fixed import
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from '@/components/ui/use-toast'

// Type definition for a book proposal
type BookProposal = {
  id: number;
  created_at: string;
  proposedTitle: string;
  name: string;
  email: string;
  status: string;
  description: string;
  manuscript_url: string | null;
  address: string;
  pinCode: string;
  contactNo: string;
  topics: string;
  shelving: string;
  readership: string;
  whyInterest: string;
  betterThan: string;
  international: string;
  size: string;
  format: string;
  printRun: string;
  royalty: string;
  requirements: string;
  price: string;
  illustrations: string[] | string;
  suggestedType: string;
  bindingStyle: string[] | string;
}

export default function AdminProposals() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [proposals, setProposals] = useState<BookProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailView, setDetailView] = useState<BookProposal | null>(null)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [proposalToDelete, setProposalToDelete] = useState<number | null>(null)
  
  // Remove hardcoded password
  
  // Extract file path from Supabase URL
  const extractFilePath = (url: string): string => {
    if (!url) return '';
    
    try {
      console.log('Extracting path from URL:', url);
      
      // Method 1: Extract from /object/sign/ URL format
      if (url.includes('/object/sign/')) {
        // Extract using regex - look for the pattern after bucket name
        const pathMatch = url.match(/\/object\/sign\/([^/]+)\/(.+?)(\?|$)/);
        if (pathMatch && pathMatch.length >= 3) {
          console.log('Extracted path (Method 1):', pathMatch[2]);
          return pathMatch[2];
        }
      }
      
      // Method 2: Extract from storage URL format
      if (url.includes('/storage/v1/object/')) {
        const pathMatch = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+?)(\?|$)/);
        if (pathMatch && pathMatch.length >= 3) {
          console.log('Extracted path (Method 2):', pathMatch[2]);
          return pathMatch[2];
        }
      }
      
      // Method 3: If URL is a direct path (like "book_proposals/filename.pdf")
      if (!url.startsWith('http') && url.includes('book_proposals/')) {
        console.log('Using direct path:', url);
        return url;
      }
      
      // Method 4: Try to extract from any URL with book_proposals path segment
      const bookProposalsMatch = url.match(/book_proposals\/([^?&]+)/);
      if (bookProposalsMatch && bookProposalsMatch.length >= 2) {
        const fullPath = `book_proposals/${bookProposalsMatch[1]}`;
        console.log('Extracted path (Method 4):', fullPath);
        return fullPath;
      }
      
      console.warn('Could not extract file path from URL, using as-is:', url);
      return url;
    } catch (e) {
      console.error('Error extracting file path:', e);
      return url;
    }
  };
  
  // Get a fresh signed URL for the file
  const getSignedUrl = async (filePath: string) => {
    try {
      setFileLoading(true);
      console.log('Getting signed URL for:', filePath);
      
      // Extract actual file path if needed
      const path = extractFilePath(filePath);
      console.log('Extracted path:', path);
      
      if (!path) {
        throw new Error('Invalid file path');
      }
      
      // Get a fresh signed URL that will work
      const { data, error } = await supabase
        .storage
        .from('images') // This is your bucket name
        .createSignedUrl(path, 60 * 60); // 1 hour expiry
      
      if (error) {
        console.error('Supabase storage error:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned from Supabase');
      }
      
      console.log('Generated signed URL successfully');
      setFileUrl(data.signedUrl);
      return data.signedUrl;
    } catch (err) {
      console.error('Error getting signed URL:', err);
      
      // Fallback: Try alternative bucket if the main one fails
      try {
        const path = extractFilePath(filePath);
        console.log('Trying fallback bucket with path:', path);
        
        // Try with book_proposals bucket if it exists as an alternative
        const { data, error } = await supabase
          .storage
          .from('book_proposals') // Alternative bucket name
          .createSignedUrl(path.replace('book_proposals/', ''), 60 * 60);
          
        if (!error && data?.signedUrl) {
          console.log('Generated signed URL from fallback bucket');
          setFileUrl(data.signedUrl);
          return data.signedUrl;
        }
      } catch (fallbackErr) {
        console.error('Fallback attempt also failed:', fallbackErr);
      }
      
      return null;
    } finally {
      setFileLoading(false);
    }
  };
  
  // Handle file download click
  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    console.log('File download clicked for URL:', url);
    
    const signedUrl = await getSignedUrl(url);
    if (signedUrl) {
      console.log('Opening signed URL:', signedUrl);
      window.open(signedUrl, '_blank');
    } else {
      console.error('Failed to generate signed URL');
      alert('Could not generate a download link. Please check console for details and try again.');
    }
  };
  
  // Authenticate with password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError("");
      fetchProposals();
    } else {
      setError("Invalid password");
    }
  };
  
  // Fetch proposals from Supabase
  const fetchProposals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('book_proposals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProposals(data || [])
    } catch (err) {
      console.error('Error fetching proposals:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch proposals')
    } finally {
      setLoading(false)
    }
  }
  
  // Delete a proposal
  const deleteProposal = async (id: number) => {
    try {
      setDeleting(true);
      console.log('Deleting proposal with ID:', id);
      
      // Delete the proposal from Supabase
      const { error } = await supabase
        .from('book_proposals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the proposals list by filtering out the deleted proposal
      setProposals(proposals.filter(p => p.id !== id));
      
      toast({
        title: "Proposal deleted",
        description: "The book proposal has been successfully deleted.",
        variant: "default",
      });
      
    } catch (err) {
      console.error('Error deleting proposal:', err);
      
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Failed to delete proposal",
        variant: "destructive",
      });
      
    } finally {
      setDeleting(false);
      setProposalToDelete(null);
    }
  };
  
  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setDetailView(null)
  }
  
  // View proposal details
  const viewDetails = async (proposal: BookProposal) => {
    setDetailView(proposal);
    
    // Pre-generate signed URL if there's a manuscript
    if (proposal.manuscript_url) {
      getSignedUrl(proposal.manuscript_url);
    }
  }
  
  // Back to list view
  const backToList = () => {
    setDetailView(null)
  }
  
  // Check if user was previously authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth') === 'true'
    setIsAuthenticated(isAuth)
    if (isAuth) {
      fetchProposals()
    }
  }, [])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // If authenticated but in detail view
  if (detailView) {
    return (
      <div className="flex min-h-screen flex-col p-4 bg-background">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Proposal Details</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={backToList}>Back</Button>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{detailView.proposedTitle}</CardTitle>
                <Badge>{detailView.status || 'Pending'}</Badge>
              </div>
              <CardDescription>Submitted on {formatDate(detailView.created_at)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Author Information */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Author Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Name:</strong> {detailView.name}</p>
                      <p><strong>Email:</strong> {detailView.email}</p>
                      <p><strong>Contact No:</strong> {detailView.contactNo}</p>
                    </div>
                    <div>
                      <p><strong>Address:</strong> {detailView.address}</p>
                      <p><strong>PIN Code:</strong> {detailView.pinCode}</p>
                    </div>
                  </div>
                </div>
                
                {/* Book Content Details */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Book Content</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-muted-foreground">Description</h3>
                      <p className="whitespace-pre-line">{detailView.description}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">Topics Covered</h3>
                      <p>{detailView.topics}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">Why Readers Will Be Interested</h3>
                      <p>{detailView.whyInterest}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">Better Than Existing Books</h3>
                      <p>{detailView.betterThan}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">International Appeal</h3>
                      <p>{detailView.international}</p>
                    </div>
                  </div>
                </div>
                
                {/* Publishing Details */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Publishing Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Shelving Category:</strong> {detailView.shelving}</p>
                      <p><strong>Target Readership:</strong> {detailView.readership}</p>
                      <p><strong>Book Size:</strong> {detailView.size}</p>
                      <p><strong>Format:</strong> {detailView.format}</p>
                      <p><strong>Print Run:</strong> {detailView.printRun}</p>
                    </div>
                    <div>
                      <p><strong>Royalty Expectations:</strong> {detailView.royalty}</p>
                      <p><strong>Special Requirements:</strong> {detailView.requirements}</p>
                      <p><strong>Price Point:</strong> {detailView.price}</p>
                      <p><strong>Book Type:</strong> {detailView.suggestedType}</p>
                      <p><strong>Binding Style:</strong> {Array.isArray(detailView.bindingStyle) 
                        ? detailView.bindingStyle.join(', ') 
                        : detailView.bindingStyle}
                      </p>
                      <p><strong>Illustrations:</strong> {Array.isArray(detailView.illustrations) 
                        ? detailView.illustrations.join(', ') 
                        : detailView.illustrations}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Uploaded Files */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
                  <div className="space-y-4">
                    {detailView.manuscript_url && (
                      <div>
                        <h3 className="font-medium text-muted-foreground mb-2">Manuscript</h3>
                        <div className="flex flex-col gap-2">
                          <a 
                            href="#"
                            onClick={(e) => handleFileClick(e, detailView.manuscript_url!)}
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 w-fit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {fileLoading ? 'Preparing Download...' : 'Download Manuscript'}
                          </a>
                          
                          {/* File Preview */}
                          {fileUrl && (
                            <div className="mt-4">
                              {fileUrl.toLowerCase().endsWith('.pdf') ? (
                                <div className="border rounded overflow-hidden">
                                  <p className="text-sm text-muted-foreground p-2 bg-muted/50">PDF Preview:</p>
                                  <iframe 
                                    src={fileUrl}
                                    className="w-full h-96 border-t"
                                    title="PDF Preview"
                                  />
                                </div>
                              ) : fileUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) ? (
                                <div className="border rounded overflow-hidden">
                                  <p className="text-sm text-muted-foreground p-2 bg-muted/50">Image Preview:</p>
                                  <div className="p-2 flex justify-center">
                                    <img 
                                      src={fileUrl} 
                                      alt="Uploaded preview" 
                                      className="max-h-96 object-contain"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Preview not available for this file type. Click the download button to view.
                                </p>
                              )}
                            </div>
                          )}
                          
                          {!fileUrl && !fileLoading && (
                            <Button 
                              variant="outline"
                              onClick={() => getSignedUrl(detailView.manuscript_url!)}
                              className="mt-2"
                            >
                              Load Preview
                            </Button>
                          )}
                          
                          {fileLoading && (
                            <p className="text-sm text-muted-foreground animate-pulse">
                              Loading preview...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Additional document previews can be added here if needed */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Default admin view (proposal list)
  return (
    <div className="flex min-h-screen flex-col p-4 bg-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Book Proposals</h1>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">Error: {error}</p>
          </div>
        ) : proposals.length === 0 ? (
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              <p>No proposals found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.proposedTitle}</TableCell>
                      <TableCell>{proposal.name}</TableCell>
                      <TableCell>{formatDate(proposal.created_at)}</TableCell>
                      <TableCell>
                        <Badge>{proposal.status || 'Pending'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewDetails(proposal)}
                          >
                            View
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={deleting && proposalToDelete === proposal.id}
                              >
                                {deleting && proposalToDelete === proposal.id ? "Deleting..." : "Delete"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the proposal &quot;{proposal.proposedTitle}&quot; by {proposal.name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProposal(proposal.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

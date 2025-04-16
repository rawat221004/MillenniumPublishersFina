"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase";

interface Enquiry {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export default function AdminEnquiries() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  
  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiry')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError("");
      fetchEnquiries();
    } else {
      setError("Invalid password");
    }
  };

  // Check if user was previously authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isAuth);
    if (isAuth) {
      fetchEnquiries();
    }
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Delete an enquiry
  const deleteEnquiry = async (id: number) => {
    // Confirm before deletion
    if (!window.confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('enquiry')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the UI by removing the deleted enquiry
      setEnquiries(enquiries.filter(enquiry => enquiry.id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };
  
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
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Enquiries</h1>
      
      {isLoading ? (
        <div className="text-center py-10">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-10">No enquiries found.</div>
      ) : (
        <div className="grid gap-6">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{enquiry.name}</CardTitle>
                    <CardDescription>{enquiry.email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(enquiry.created_at)}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteEnquiry(enquiry.id)}
                      disabled={deleteLoading === enquiry.id}
                    >
                      {deleteLoading === enquiry.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
                {enquiry.phone && (
                  <div className="text-sm">Phone: {enquiry.phone}</div>
                )}
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{enquiry.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

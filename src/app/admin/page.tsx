"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Check if user was previously authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth") === "true";
    setIsAuthenticated(isAuth);
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
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
  
  // If authenticated, show dashboard
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proposals</CardTitle>
            <CardDescription>Manage book proposals from authors</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/proposals">
              <Button className="w-full">View Proposals</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Enquiries</CardTitle>
            <CardDescription>View customer enquiries and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/enquiries">
              <Button className="w-full">View Enquiries</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Books</CardTitle>
            <CardDescription>Manage book catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/books">
              <Button className="w-full">View Books</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

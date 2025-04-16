"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase.js";
import { Textarea } from "@/components/ui/textarea";

// Define the Book type based on your expected Supabase table structure
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  amazon_link?: string;
  created_at: string;
}

export default function AdminBooks() {
  // Restore local authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Keep for login errors
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Keep for book fetching
  const [fetchError, setFetchError] = useState<string | null>(null); // Keep for book fetching/submission errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<Book | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check local storage for authentication status on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAdminAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      fetchBooks(); // Fetch books if already authenticated
    }
  }, []);

  // Restore handleLogin function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use environment variable for admin password
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true"); // Store auth status
      setError("");
      fetchBooks(); // Fetch books after successful login
    } else {
      setError("Incorrect password");
      setIsAuthenticated(false);
      localStorage.removeItem("isAdminAuthenticated");
    }
    setPassword(""); // Clear password field
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      setFetchError("Failed to fetch books. " + error.message);
      setBooks([]);
    } else {
      setBooks(data || []);
    }
    setIsLoading(false);
  };

  // Updated function to handle book addition with file upload
  const handleAddBook = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     setIsSubmitting(true); // Set submitting state
     setFetchError(null); // Clear previous errors

     const form = event.currentTarget;
     const formData = new FormData(form);
     const imageFile = formData.get('image_file') as File | null;

     let imageUrl = null; // Initialize imageUrl

     // 1. Upload image if provided
     if (imageFile && imageFile.size > 0) {
         const fileExt = imageFile.name.split('.').pop();
         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
         const filePath = `book-covers/${fileName}`; // Store in 'book-covers' bucket

         try {
             const { error: uploadError } = await supabase.storage
                 .from('book-covers') // Use your designated bucket name
                 .upload(filePath, imageFile);

             if (uploadError) {
                 throw new Error(`Image upload failed: ${uploadError.message}`);
             }

             // Get public URL
             const { data: urlData } = supabase.storage
                 .from('book-covers') // Use your designated bucket name
                 .getPublicUrl(filePath);

             if (!urlData?.publicUrl) {
                 throw new Error("Could not get public URL for the uploaded image.");
             }
             imageUrl = urlData.publicUrl;

         } catch (uploadError: any) {
             console.error("Error uploading image:", uploadError);
             setFetchError(`Error uploading image: ${uploadError.message}`);
             setIsSubmitting(false);
             return; // Stop execution if upload fails
         }
     } else {
         // Handle case where image is required but not provided, or set a default
         setFetchError("Book cover image is required.");
         setIsSubmitting(false);
         return;
     }


     // 2. Prepare book data
     const newBook = {
         title: formData.get('title') as string,
         author: formData.get('author') as string,
         description: formData.get('description') as string,
         image_url: imageUrl, // Use the uploaded image URL
         amazon_link: (formData.get('amazon_link') as string) || null, // Handle optional field
     };

     // Basic validation
     if (!newBook.title || !newBook.author || !newBook.description || !newBook.image_url) {
         setFetchError("Please fill in all required fields (Title, Author, Description, Image).");
         setIsSubmitting(false);
         return;
     }

     // 3. Insert book data into the database
     try {
         const { error: insertError } = await supabase.from('books').insert([newBook]);
         if (insertError) {
             throw new Error(`Database insert failed: ${insertError.message}`);
         }

         await fetchBooks(); // Refresh the list of books
         form.reset(); // Clear the form
         setFetchError(null); // Clear any previous errors on success

     } catch (insertError: any) {
         console.error("Error adding book:", insertError);
         // Keep the image URL in case only the DB insert failed, maybe log it
         setFetchError(`Error adding book: ${insertError.message}. Image was uploaded to: ${imageUrl}`);
         // Consider adding logic here to delete the uploaded image if the DB insert fails
     } finally {
         setIsSubmitting(false); // Reset submitting state
     }
  };

  // Handle edit button click - update to include image preview
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({ ...book });
    setImagePreview(book.image_url); // Set the current image as preview
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDelete = (book: Book) => {
    setDeleteConfirmBook(book);
    setIsDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for editing a book - update to handle image upload
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFetchError(null);

    try {
      const form = e.target as HTMLFormElement;
      const formDataObj = new FormData(form);
      const imageFile = formDataObj.get('image_file') as File;
      const updateData = { ...formData };

      // Handle image upload if a new file is selected
      if (imageFile && imageFile.size > 0) {
        // Process image upload
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `book-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('book-covers')
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          throw new Error("Could not get public URL for the uploaded image.");
        }

        // Add the new image URL to the update data
        updateData.image_url = urlData.publicUrl;
      }

      // Update book data in the database
      const { error } = await supabase
        .from('books')
        .update(updateData)
        .eq('id', editingBook?.id);

      if (error) throw error;

      // Update local state to reflect changes
      setBooks(books.map(book => 
        book.id === editingBook?.id ? { ...book, ...updateData } : book
      ));

      setSuccessMessage("Book updated successfully!");
      setIsEditModalOpen(false);

      // Refresh data to ensure consistency
      fetchBooks();

    } catch (err: any) {
      console.error("Error updating book:", err);
      setFetchError(`Failed to update book: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image preview for edit form
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!deleteConfirmBook) return;

    setIsSubmitting(true);
    setFetchError(null);

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', deleteConfirmBook.id);

      if (error) throw error;

      // Update local state to remove the book
      setBooks(books.filter(book => book.id !== deleteConfirmBook.id));
      setSuccessMessage("Book deleted successfully!");
      setIsDeleteModalOpen(false);

    } catch (err) {
      console.error("Error deleting book:", err);
      setFetchError("Failed to delete book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel modals
  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingBook(null);
    setDeleteConfirmBook(null);
    setFetchError(null);
  };

  // If not authenticated, show local password form
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter the password to manage books</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Restore Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold">Books Management</h1>
         {/* Restore original Logout Button */}
         <Button onClick={() => {
             setIsAuthenticated(false);
             localStorage.removeItem("isAdminAuthenticated");
             setBooks([]); // Clear books on logout
             setFetchError(null); // Clear errors on logout
         }}>Logout</Button>
      </div>

      {/* Add Book Form - Updated */}
      <Card>
          <CardHeader>
              <CardTitle>Add New Book</CardTitle>
              <CardDescription>Fill in the details and upload a cover image.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleAddBook} className="space-y-4">
                  <Input name="title" placeholder="Title" required disabled={isSubmitting} />
                  <Input name="author" placeholder="Author" required disabled={isSubmitting} />
                  <Textarea name="description" placeholder="Description" required disabled={isSubmitting} />
                  <div>
                      <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                      <Input id="image_file" name="image_file" type="file" accept="image/*" required disabled={isSubmitting} />
                  </div>
                  <Input name="amazon_link" placeholder="Amazon Link (Optional)" disabled={isSubmitting} />
                  {fetchError && <p className="text-destructive text-sm">{fetchError}</p>} {/* Display errors */}
                  <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding Book...' : 'Add Book'}
                  </Button>
              </form>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Books Catalog</CardTitle>
          <CardDescription>Manage the books displayed on the public books page.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading books...</p>}
          {fetchError && <p className="text-destructive">{fetchError}</p>}
          {!isLoading && !fetchError && (
            <div className="space-y-4">
              {books.length === 0 ? (
                <p>No books found.</p>
              ) : (
                books.map((book) => (
                  <div key={book.id} className="flex justify-between items-center border p-4 rounded-md">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(book)}>Delete</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="author" className="block mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image_file" className="block mb-1">Book Cover Image</label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Current image preview */}
                  <div className="flex-shrink-0 w-36 h-48 border rounded-md overflow-hidden">
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Book cover preview" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image_file"
                      name="image_file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a new image only if you want to change the current cover.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="amazon_link" className="block mb-1">Amazon Link (optional)</label>
                <input
                  type="url"
                  id="amazon_link"
                  name="amazon_link"
                  value={formData.amazon_link || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {fetchError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                  {fetchError}
                </div>
              )}
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete "{deleteConfirmBook?.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

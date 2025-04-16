import { createClient } from '@supabase/supabase-js'

// Ensure URLs are properly formatted
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
})

// Enhanced helper functions for database and storage operations
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Enable file overwriting
      })
    
    if (error) throw error
    
    // Get the public URL automatically after upload
    const url = getPublicUrl(bucketName, filePath)
    return { data, url, error: null }
  } catch (error: any) {
    console.error('Error uploading file:', error.message)
    return { data: null, url: null, error }
  }
}

export const getPublicUrl = (
  bucketName: string,
  filePath: string
) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)
    
  return data.publicUrl
}

// Database helper functions
export const insertData = async <T extends object>(
  tableName: string,
  data: T
) => {
  try {
    // Log the operation for debugging
    console.log(`Attempting to insert data into ${tableName} table:`, data);
    
    // First check if the table exists by fetching a single row
    const { error: tableCheckError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (tableCheckError) {
      console.error(`Error checking table ${tableName}:`, tableCheckError);
      return { 
        data: null, 
        error: { 
          message: `Table check failed: ${tableCheckError.message}. 
          Make sure the table '${tableName}' exists in your Supabase database.` 
        } 
      };
    }
    
    // Proceed with insertion
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) {
      console.error(`Supabase error inserting into ${tableName}:`, error);
      
      // Special handling for schema-related errors
      if (error.code === 'PGRST204') {
        return { 
          data: null, 
          error: { 
            message: `Schema error: ${error.message}. 
            Please run SQL commands to create the proper columns in your '${tableName}' table.` 
          } 
        };
      }
      
      return { data: null, error };
    }
    
    console.log(`Successfully inserted data into ${tableName}:`, result);
    return { data: result, error: null };
  } catch (error: any) {
    console.error(`Error inserting data into ${tableName}:`, error.message || error);
    return { data: null, error: { message: error.message || "Unknown error occurred" } };
  }
}

export const fetchData = async (
  tableName: string,
  options?: {
    column?: string
    value?: any
    limit?: number
    orderBy?: { column: string, ascending?: boolean }
  }
) => {
  try {
    let query = supabase.from(tableName).select('*')
    
    if (options?.column && options?.value !== undefined) {
      query = query.eq(options.column, options.value)
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      })
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error(`Error fetching data from ${tableName}:`, error.message)
    return { data: null, error }
  }
}

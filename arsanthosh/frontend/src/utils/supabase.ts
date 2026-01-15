import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only initialize if credentials exist to prevent runtime crash
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const uploadFile = async (file: File, bucket: string = 'product-images') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    if (supabase) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    }

    // Fallback to local upload
    const formData = new FormData();
    formData.append("file", file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    try {
        const response = await fetch(`${apiUrl}/upload`, {
            method: "POST",
            body: formData,
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || "Upload failed");
        }

        return data.data.url;
    } catch (error: any) {
        throw new Error(error.message || "Upload failed");
    }
};

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PropertyClient from "./PropertyClient";

// Initialize a standard Supabase client for fetching public server-side data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate static routes for all properties to keep the site blazing fast
export async function generateStaticParams() {
  const { data: properties } = await supabase.from("properties").select("id");

  return (
    properties?.map((property) => ({
      slug: property.id,
    })) || []
  );
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // Fetch the specific property from the database
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", resolvedParams.slug)
    .single();

  // If there's an error or no property is found, trigger the 404 page
  if (error || !property) {
    return notFound();
  }

  // Pass the real database property down to the interactive client component
  return <PropertyClient property={property} />;
}

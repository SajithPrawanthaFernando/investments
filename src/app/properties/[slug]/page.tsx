// src/app/properties/[slug]/page.tsx
import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyClient from "./PropertyClient"; // We will create this next

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.id,
  }));
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params directly on the server
  const resolvedParams = await params;
  const property = properties.find((p) => p.id === resolvedParams.slug);

  if (!property) return notFound();

  // Pass the found property down to your interactive client component
  return <PropertyClient property={property} />;
}

export type PropertyType = "land" | "apartment" | "house" | "commercial";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  price: string;
  image: string;
  features?: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Prime Oceanfront Acreage",
    type: "land",
    location: "Mirissa, Southern Province",
    price: "LKR 150M",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop",
    features: "2.5 Acres • Beach Access",
  },
  {
    id: "2",
    title: "Skyline Penthouse Suite",
    type: "apartment",
    location: "Colombo 03",
    price: "LKR 220M",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop",
    features: "4 Bed • 4.5 Bath • 4,200 sqft",
  },
  {
    id: "3",
    title: "Heritage Colonial Villa",
    type: "house",
    location: "Galle Fort",
    price: "LKR 310M",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    features: "5 Bed • Private Pool • Restored",
  },
  {
    id: "4",
    title: "Tech Hub Office Floors",
    type: "commercial",
    location: "Nawala, Colombo",
    price: "LKR 850M",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    features: "12,000 sqft • A-Grade Tech Park",
  },
  {
    id: "5",
    title: "Elevated Tea Estate Plot",
    type: "land",
    location: "Nuwara Eliya",
    price: "LKR 95M",
    image:
      "https://images.unsplash.com/photo-1596423735880-5f2a689b903e?q=80&w=2070&auto=format&fit=crop",
    features: "5 Acres • Hill Country Views",
  },
  {
    id: "6",
    title: "Minimalist Urban Loft",
    type: "apartment",
    location: "Colombo 07",
    price: "LKR 115M",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
    features: "2 Bed • 2 Bath • City Views",
  },
];

import CategoryGrid from "@/components/home/CategoryGrid";
import DualCtaBlock from "@/components/home/DualCtaBlock";
import HeroVideo from "@/components/home/HeroVideo";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroVideo />
      <CategoryGrid />
      <DualCtaBlock />
    </div>
  );
}

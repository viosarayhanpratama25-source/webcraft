import React from "react";
import LandingPage from "@/components/LandingPage";
import { getCachedPackages, getCachedBlogs } from "@/lib/cached-data";

export default async function Home() {
  const packagesData = await getCachedPackages();
  const blogsData = await getCachedBlogs();

  return (
    <LandingPage 
      packages={packagesData} 
      testimonials={[]} // Dinonaktifkan sementara, ubah kembali ke testimonialsData jika sudah ada client
      blogs={blogsData} 
    />
  );
}

import React from "react";
import { db } from "@/lib/prisma";
import LandingPage from "@/components/LandingPage";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const packages = await db.projectPackage.findMany();
  
  const packagesData = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    features: JSON.parse(pkg.features),
    deliveryTime: pkg.deliveryTime
  }));
  
  /* 
  // Testimonial query is disabled for performance optimization (currently inactive in UI)
  const testimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        }
      },
      project: {
        select: {
          title: true,
          type: true,
        }
      }
    }
  });

  const testimonialsData = testimonials.map(t => ({
    id: t.id,
    name: t.user.name,
    avatar: t.user.avatar || "/placeholder-avatar.png",
    company: t.project.title,
    rating: t.rating,
    quote: t.content
  }));
  */
  const testimonialsData: any[] = [];

  // Fetch external developer articles via public Dev.to API (100% legal, officially supported)
  // Queries "indonesia" topic to get relevant developer articles in Indonesian language.
  // Falls back to local database articles in case of offline development or API failure.
  let blogsData = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout limit

    const res = await fetch("https://dev.to/api/articles?tag=indonesia&per_page=3", {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
      headers: {
        "User-Agent": "cleavCraft-App/1.0"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to load dev.to articles");
    
    const devToArticles = await res.json();
    blogsData = devToArticles.map((b: any) => ({
      id: b.id.toString(),
      title: b.title,
      slug: b.slug,
      content: b.description || "",
      coverImage: b.cover_image || b.social_image || "/placeholder-blog.png",
      publishedAt: b.published_at ? new Date(b.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }) : "",
      url: b.url
    }));
  } catch (err) {
    console.warn("Dev.to API offline or failed, using local database fallback:", err);
    const blogs = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3
    });
    blogsData = blogs.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      content: b.content,
      coverImage: b.coverImage,
      publishedAt: b.publishedAt ? b.publishedAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }) : "",
      url: ""
    }));
  }

  return (
    <LandingPage 
      packages={packagesData} 
      testimonials={[]} // Dinonaktifkan sementara, ubah kembali ke testimonialsData jika sudah ada client
      blogs={blogsData} 
    />
  );
}

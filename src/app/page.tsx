import React from "react";
import { db } from "@/lib/prisma";
import LandingPage from "@/components/LandingPage";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch packages, testimonials, and blog posts from SQLite db
  const packages = await db.projectPackage.findMany();
  
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

  const blogs = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3
  });

  // Map and structure data for the client page
  const packagesData = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    features: JSON.parse(pkg.features),
    deliveryTime: pkg.deliveryTime
  }));

  const testimonialsData = testimonials.map(t => ({
    id: t.id,
    name: t.user.name,
    avatar: t.user.avatar || "/placeholder-avatar.png",
    company: t.project.title,
    rating: t.rating,
    quote: t.content
  }));

  const blogsData = blogs.map(b => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    content: b.content,
    coverImage: b.coverImage,
    publishedAt: b.publishedAt ? b.publishedAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }) : ""
  }));

  return (
    <LandingPage 
      packages={packagesData} 
      testimonials={testimonialsData} 
      blogs={blogsData} 
    />
  );
}

Build a full-stack web application called "WebCraft" — a SaaS platform for a 
web development agency that offers website creation services. 

TECH STACK:
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes + Server Actions
- Database: PostgreSQL with Prisma ORM
- Auth: NextAuth.js (credentials + Google OAuth)
- Payment: Midtrans / Stripe integration
- Storage: Cloudinary or AWS S3 for file uploads
- Email: Resend or Nodemailer
- Deployment: Vercel + Docker support

CORE MODULES:
1. Public Landing Page (marketing)
2. Client Portal (dashboard, order tracking, project collaboration)
3. Admin Dashboard (project management, analytics, invoicing)
4. Authentication & Authorization (role-based: Admin, Staff, Client)
5. Payment & Invoicing System
6. Notification System (in-app + email)
7. CMS for portfolio/blog (optional)

DATABASE SCHEMA must include:
- users (id, name, email, password, role, avatar, phone, createdAt)
- projects (id, userId, title, description, type, status, budget, deadline, createdAt)
- project_packages (id, name, description, price, features, deliveryTime)
- project_orders (id, projectId, packageId, totalPrice, paymentStatus, paymentMethod, invoiceUrl)
- project_milestones (id, projectId, title, description, status, dueDate)
- project_files (id, projectId, fileName, fileUrl, uploadedBy, createdAt)
- project_messages (id, projectId, senderId, message, attachments, createdAt)
- invoices (id, orderId, invoiceNumber, amount, dueDate, status, pdfUrl)
- testimonials (id, userId, projectId, rating, content, isPublished)
- blog_posts (id, title, slug, content, coverImage, authorId, status, publishedAt)
- contact_submissions (id, name, email, phone, message, serviceType, status)

STATUS ENUMS:
- Project: PENDING, IN_PROGRESS, REVIEW, REVISION, COMPLETED, CANCELLED
- Payment: UNPAID, PARTIAL, PAID, REFUNDED
- Milestone: TODO, IN_PROGRESS, DONE

CREATE the public landing page with these sections:

1. HERO SECTION:
 - Headline: "Wujudkan Website Impian Anda Bersama Kami"
 - Subheadline with CTA button "Mulai Proyek" → links to /order
 - Animated gradient background with floating code elements

2. SERVICES SECTION:
 - Card grid (3 cols): Website Company Profile, E-Commerce, 
 Landing Page, Web Application, SEO Optimization, Maintenance
 - Each card: icon, title, short description, "Pelajari Lebih Lanjut" link

3. PORTFOLIO SECTION:
 - Filterable gallery (tabs: All, Company Profile, E-Commerce, Landing Page)
 - Masonry grid layout with hover overlay showing project details
 - Click → modal with before/after, tech stack used, testimonial

4. PRICING PACKAGES:
 - 3-tier pricing cards (Starter, Professional, Enterprise)
 - Starter: Rp 2.5jt (1 page, responsive, basic SEO, 7 days)
 - Professional: Rp 7.5jt (5 pages, CMS, SEO advanced, contact form, 14 days)
 - Enterprise: Rp 15jt+ (custom, fullstack, API integration, 30 days)
 - Highlight "Recommended" on Professional
 - CTA: "Pilih Paket" → /order?package={id}

5. TESTIMONIALS:
 - Auto-scroll carousel with avatar, name, company, rating stars, quote

6. PROCESS TIMELINE:
 - Horizontal stepper: Konsultasi → Desain → Development → Testing → Launch
 - Animated on scroll

7. FAQ ACCORDION:
 - 8-10 common questions about web dev process, timeline, revision, etc.

8. CTA SECTION:
 - "Siap Memulai? Hubungi Kami Sekarang"
 - Contact form (name, email, phone, message, service dropdown)
 - WhatsApp floating button (bottom-right)

9. FOOTER:
 - Company info, quick links, social media, copyright
 - Newsletter subscription input

DESIGN: Modern, clean, professional. Dark mode by default with 
light mode toggle. Fully responsive (mobile-first). Use Framer Motion 
for scroll animations and micro-interactions.

BUILD complete authentication system:

PAGES:
- /auth/login → Email + password form, Google OAuth button, "Forgot Password" link
- /auth/register → Name, email, phone, password, confirm password, terms checkbox
- /auth/forgot-password → Email input → sends reset link
- /auth/reset-password → New password form (via token in URL)

IMPLEMENTATION:
- NextAuth.js with CredentialsProvider + GoogleProvider
- Password hashing with bcrypt (12 rounds)
- JWT session strategy with 30-day expiry
- Middleware protection: redirect unauthenticated users to /auth/login
- Role-based access: ADMIN can access /admin/*, CLIENT can access /dashboard/*
- After login: CLIENT → /dashboard, ADMIN → /admin
- Profile page at /dashboard/profile with edit functionality
- Email verification flow (optional but scaffold it)

SECURITY:
- Rate limiting on auth routes (5 attempts per 15 minutes)
- CSRF protection
- Input sanitization on all forms
- Secure cookie settings (httpOnly, secure, sameSite: lax)

BUILD the client dashboard at /dashboard with sidebar navigation:

PAGES:
1. /dashboard (Overview)
 - Welcome card with user name + avatar
 - Stats: Active Projects, Total Spent, Pending Invoices
 - Recent activity timeline (last 5 actions)
 - Quick action buttons: "New Order", "View Invoices"

2. /dashboard/projects
 - Table with columns: Project Name, Package, Status (badge), 
 Progress %, Deadline, Actions
 - Status badges: color-coded (Pending=yellow, In Progress=blue, 
 Review=purple, Completed=green, Cancelled=red)
 - Click row → /dashboard/projects/[id]
 - Filter by status, search by name

3. /dashboard/projects/[id] (Project Detail)
 - Header: project title, status badge, deadline countdown
 - Tab navigation: Overview | Milestones | Files | Messages | Invoices
 - Overview: description, package details, budget, timeline
 - Milestones: kanban-style or list with status toggle
 - Files: upload area (drag & drop), file list with download/delete
 - Messages: chat-like interface (client ↔ admin), real-time feel
 - Invoices: linked invoices with payment status

4. /dashboard/orders
 - Order history table with status, amount, date, invoice download

5. /dashboard/invoices
 - Invoice list with filter (Paid/Unpaid/All)
 - Click → invoice detail page with print/PDF download

6. /dashboard/profile
 - Edit name, email, phone, avatar upload
 - Change password section
 - Notification preferences (toggle switches)

DESIGN: Clean sidebar with icons (Lucide), collapsible on mobile. 
Breadcrumb navigation. Loading skeletons on data fetch. 
Toast notifications for actions.

BUILD the complete order flow:

STEP 1 — /order (Package Selection):
- Display 3 pricing cards (same as landing page)
- "Select" button highlights card + shows "Continue" button
- Custom package option: "Butuh sesuatu yang berbeda? Hubungi kami"

STEP 2 — /order/details (Project Brief):
- Form fields:
 * Project Name (text)
 * Website Type (dropdown: Company Profile, E-Commerce, Landing Page, Custom)
 * Description (textarea, rich text optional)
 * Reference URLs (dynamic: add/remove URL inputs)
 * Features needed (checkboxes: Contact Form, Blog, Gallery, Payment, Multi-language, etc.)
 * Budget Range (slider or dropdown)
 * Preferred Deadline (date picker)
 * File Upload (wireframes, brand guidelines, logos — max 10MB each)
- Save as draft button + Continue button

STEP 3 — /order/review (Confirmation):
- Summary card: package, features, total price, deadline
- Terms & conditions checkbox
- "Proceed to Payment" button

STEP 4 — /order/payment:
- Payment method selection: Bank Transfer, Credit Card, E-Wallet
- Midtrans/Stripe integration for card payment
- For bank transfer: show VA number, total, payment instructions
- Auto-redirect to /dashboard/projects/[id] after payment success
- Webhook handler at /api/webhooks/payment for status updates

STEP 5 — /order/success:
- Animated success illustration
- "Project has been created! Check your dashboard"
- CTA: "Go to Dashboard"
- Send confirmation email with order details

API ROUTES:
- POST /api/orders → create order + project
- POST /api/orders/[id]/payment → initiate payment
- POST /api/webhooks/payment → handle payment callback
- GET /api/orders/[id]/status → check payment status

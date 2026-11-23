# WedPlan — Wedding Planning Platform

WedPlan is a full-stack wedding planning platform that connects customers with wedding service providers. Customers can explore wedding services, discover vendors, and submit booking requests. Vendors can manage their services, handle booking requests, and upgrade their subscription plans. Admins can manage users, review services, and monitor platform transactions.

## Live Website

[Visit WedPlan](https://ph-b14-a08-wed-plan-client.vercel.app/)

## Project Repositories

- **Client Repository:** [GitHub Repository](https://github.com/mahzamincodes/PH-B14-A08-WedPlan-Client)
- **Server Repository:** [GitHub Repository](https://github.com/mahzamincodes/PH-B14-A08-WedPlan-Server)

## Key Features

### Customer
- Browse approved and active wedding services.
- Search services by name.
- Filter services by category and location.
- Sort services by price (ascending and descending).
- View service details, images, prices, and vendor information.
- Submit wedding service booking requests.
- Track booking request status.
- Cancel pending booking requests.
- Manage personal profile information.
- Access a personalized customer dashboard.

### Vendor
- Create and manage wedding service listings.
- Upload service images using ImgBB.
- Update and delete personal services.
- Manage service availability.
- View service approval status.
- View customer booking requests.
- Accept or reject pending booking requests.
- Access vendor dashboard statistics.
- Upgrade to Premium using Stripe Checkout.
- Free Plan: Publish up to 3 active services.
- Premium Plan: Publish unlimited active services.
- Display Premium vendor status.

### Admin
- View platform statistics.
- Manage registered customers and vendors.
- Search users and filter by role.
- Block and unblock users.
- Review submitted services.
- Approve or reject services.
- Change service availability.
- Delete inappropriate services.
- Monitor subscription transactions.

### General Features
- Email and password authentication.
- Google authentication.
- Role-based dashboard access.
- Protected routes and authentication persistence.
- Responsive design for desktop, tablet, and mobile.
- Smooth animations using Motion.
- Form validation and toast notifications.
- Loading, empty, and error states.
- Secure Stripe webhook-based Premium activation.

## Technology Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- ShadCN UI
- Better Auth
- Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Checkout and Webhooks
- ImgBB Image Hosting

## Installation and Setup

### Prerequisites
- Node.js (LTS recommended)
- npm
- Git
- MongoDB database
- WedPlan backend server

### 1. Clone the Client Repository

```bash
git clone https://github.com/mahzamincodes/PH-B14-A08-WedPlan-Client.git
```

### 2. Navigate to the Project Directory

```bash
cd PH-B14-A08-WedPlan-Client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Configure the following Better Auth and Google OAuth variables using your own credentials:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
BETTER_AUTH_DB_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Important:** Use the exact values and URLs required by your local environment. Never commit `.env.local` or expose secret credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build the Project

```bash
npm run build
```

### 7. Run the Production Build Locally

```bash
npm start
```

## Backend Environment Configuration

The WedPlan client requires the separate Express.js backend.

**Production Backend API:** [https://ph-b14-a08-wed-plan-server.vercel.app](https://ph-b14-a08-wed-plan-server.vercel.app)

**Local Backend API:** `http://localhost:5000`

The following variables are used for backend authentication, security, image hosting, and application configuration:

```env
JWT_SECRET=
JWT_ISSUER=
JWT_AUDIENCE=
JWT_TTL_SECONDS=
CLIENT_ORIGIN=
IMGBB_API_KEY=
```

The backend also requires the appropriate MongoDB, Better Auth, Google OAuth, and Stripe configuration.

For complete backend installation instructions and environment variable configuration, see the [Server Repository README](https://github.com/mahzamincodes/PH-B14-A08-WedPlan-Server).

## Security

- Sensitive credentials are stored in environment variables.
- Environment files are excluded from Git using `.gitignore`.
- Protected pages require authentication.
- Dashboard access is controlled by user roles.
- Backend APIs verify authentication, authorization, and resource ownership.
- Users cannot change their own role or subscription plan through profile updates.
- Stripe Premium activation depends on verified webhook events.
- Secret keys and credentials must never be exposed in client-side code or committed to GitHub.

## Project Structure

The project follows a component-based structure using Next.js App Router.

- `src/app/` — Application routes and pages.
- `src/components/` — Reusable UI components.
- `src/lib/` — Shared utilities, authentication, and API-related logic.

## Project Status

WedPlan is developed as a full-stack wedding planning platform with separate customer, vendor, and admin experiences.
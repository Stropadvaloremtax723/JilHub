# 🎬 Jil Hub - Premium Video Streaming Platform

A modern, feature-rich video streaming platform built with Next.js 14, featuring a sleek black and orange theme inspired by premium video sites. Complete with a powerful admin panel for content management.

## ✨ Features

### 🎥 Video Management
- Add videos via URL (media.cm, direct links) or upload
- Edit video details, thumbnails, categories, and tags
- Publish/unpublish videos with one click
- Automatic thumbnail generation for media.cm videos

### 👨‍💼 Admin Panel
- YouTube Studio-inspired dashboard
- Real-time statistics and analytics
- View counts and performance metrics
- Manage videos, categories, and tags
- Configurable ad redirect settings

### 🎬 Video Player
- Media.cm embed support (auto-detection)
- Custom controls (play, pause, volume, fullscreen)
- Optional ad redirects (configurable per click count)
- Responsive design for all screen sizes
- Development mode with popup fallback for localhost

### 🔒 Security & Authentication
- Secure admin authentication with NextAuth.js
- Protected routes and API endpoints
- Environment-based configuration
- Password hashing with bcrypt

### 🎨 Modern UI/UX
- PornHub-inspired black/orange color scheme
- Fully responsive design
- Smooth animations and transitions
- Clean, intuitive interface
- Custom favicon and branding

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB Atlas + Prisma ORM |
| **Authentication** | NextAuth.js |
| **Styling** | Tailwind CSS |
| **Video Player** | React Player + media.cm embeds |
| **UI Components** | Radix UI + Custom components |
| **Icons** | Lucide React |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or higher
- MongoDB Atlas account ([Get free tier](https://www.mongodb.com/cloud/atlas))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd JilHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the following variables:
   ```env
   # Database - Your MongoDB Atlas connection string
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/jilhub"
   
   # NextAuth - Generate with: openssl rand -base64 32
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Admin Credentials
   ADMIN_EMAIL="admin@jilhub.com"
   ADMIN_PASSWORD="your-secure-password"
   
   # Optional: Ad Redirect URL
   NEXT_PUBLIC_AD_REDIRECT_URL="https://example.com"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.ts
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📁 Project Structure

```
JilHub/
├── app/                        # Next.js 14 App Router
│   ├── admin/                  # Admin panel
│   │   ├── login/             # Admin authentication
│   │   ├── settings/          # Site settings (redirects, etc.)
│   │   ├── videos/            # Video management
│   │   │   ├── edit/[id]/    # Edit video page
│   │   │   └── new/          # Add new video
│   │   └── page.tsx           # Dashboard
│   ├── api/                   # API routes
│   │   ├── auth/             # NextAuth.js
│   │   ├── settings/         # Settings API
│   │   └── videos/           # Video CRUD operations
│   ├── watch/[id]/           # Video player page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── admin-layout.tsx  # Admin panel layout
│   ├── header.tsx        # Site header
│   ├── video-card.tsx    # Video thumbnail card
│   └── video-player.tsx  # Custom video player
│   ├── ui/                  # Reusable UI components
│   ├── admin-layout.tsx     # Admin sidebar layout
│   ├── header.tsx           # Site header/navigation
│   ├── video-card.tsx       # Video thumbnail card
│   └── video-player.tsx     # Custom video player
├── lib/                     # Utilities
│   ├── prisma.ts           # Prisma client instance
│   └── utils.ts            # Helper functions
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
├── public/                  # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   └── apple-touch-icon.png
├── scripts/                 # Utility scripts
└── middleware.ts            # Route protection
```

## 🎮 Admin Panel

### Access
- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Default Email: `admin@jilhub.com`
- Default Password: `admin123` (⚠️ Change in production!)

### Features

#### 📊 Dashboard
- Total videos count
- Total views analytics
- Recent videos list
- Quick statistics overview

#### 🎬 Video Management
- **Add Videos**: Via URL (media.cm, direct links) or upload
- **Edit Videos**: Update title, description, thumbnail, category, tags
- **Manage Status**: Publish/unpublish with one click
- **Delete Videos**: Remove videos permanently

#### ⚙️ Settings
- **Ad Redirects**: Enable/disable redirect feature
- **Redirect URL**: Set custom redirect destination
- **Click Count**: Configure how many clicks before video plays
- **Real-time Updates**: Changes apply immediately

## 🎬 Video Player

### Supported Formats

- **media.cm**: `https://media.cm/mjvivuhbw52x` or `https://media.cm/e/mjvivuhbw52x`
- **Direct Videos**: MP4, WebM, and other HTML5 video formats
- **Embed URLs**: Any embed-compatible video URL

### Player Features

| Feature | Description |
|---------|-------------|
| **Auto-Detection** | Automatically detects media.cm URLs and converts to embeds |
| **Custom Controls** | Play, pause, volume, seek, fullscreen |
| **Ad Redirects** | Optional feature (configurable in admin settings) |
| **Dev Mode** | Popup fallback for localhost (media.cm blocks localhost) |
| **Responsive** | Adapts to all screen sizes |
| **Session Storage** | Tracks redirect clicks per browser session |

## 📝 How to Add Videos

### Method 1: External URL (Recommended for media.cm)

1. Navigate to **Admin Panel** → **Videos** → **Add Video**
2. Select **"Video URL"** option
3. Paste the video URL:
   ```
   Media.cm: https://media.cm/mjvivuhbw52x
   Direct: https://example.com/video.mp4
   ```
4. Add thumbnail URL (optional for media.cm - auto-detected)
5. Fill in:
   - Title (required)
   - Description
   - Category
   - Tags (comma-separated)
6. Toggle **"Published"** to make it visible
7. Click **"Add Video"**

### Method 2: File Upload

1. Navigate to **Admin Panel** → **Videos** → **Add Video**
2. Select **"Upload File"** option
3. Choose video file (MP4, WebM, etc.)
4. Upload thumbnail image
5. Fill in metadata
6. Publish

## 💾 Database Schema

```prisma
User         → Admin authentication
Video        → Video content and metadata
Category     → Video categories
Tag          → Video tags
TagOnVideo   → Video-Tag relationships (many-to-many)
Settings     → Global site settings (redirects, etc.)
```

### Key Models

- **User**: Email, password (hashed), role (USER/ADMIN)
- **Video**: URL, title, description, thumbnail, views, published status
- **Settings**: Enable redirects, redirect URL, redirect clicks count

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  'jil-orange': '#FF9000',    // Primary brand color
  'jil-yellow': '#FFC107',    // Accent color
  'jil-black': '#000000',     // Background
  'jil-dark': '#1a1a1a',      // Secondary background
  'jil-darker': '#0d0d0d',    // Darker elements
}
```

### Branding

Update "Jil Hub" site name in:
- `components/header.tsx` - Main site header
- `components/admin-layout.tsx` - Admin panel sidebar
- `app/layout.tsx` - Page metadata and title
- `public/favicon.svg` - Site favicon

### Logo

Replace `public/favicon.svg` with your custom logo:
```bash
# Generate favicons from new logo
node scripts/create-favicon.js
node scripts/create-apple-icon.js
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Configure Environment Variables**
   - `DATABASE_URL` - MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` - Generate new secret for production
   - `NEXTAUTH_URL` - Your production URL
   - `ADMIN_EMAIL` - Admin login email
   - `ADMIN_PASSWORD` - Strong password
   - `NEXT_PUBLIC_AD_REDIRECT_URL` - (Optional)

### Other Platforms (Netlify, Railway, etc.)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Configure environment variables** in your platform's settings

### Important Notes

- ⚠️ **Change default admin credentials** in production
- ⚠️ **Use strong NEXTAUTH_SECRET** (32+ characters)
- ✅ Media.cm embeds work on deployed sites
- ⚠️ Media.cm blocks localhost - use DEV MODE for local testing
- ✅ MongoDB Atlas free tier is sufficient for small-medium sites

## 📋 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (32+ chars) | `openssl rand -base64 32` | ✅ Yes |
| `NEXTAUTH_URL` | Full site URL | `http://localhost:3000` | ✅ Yes |
| `ADMIN_EMAIL` | Admin login email | `admin@jilhub.com` | ✅ Yes |
| `ADMIN_PASSWORD` | Admin password | `secure-password-123` | ✅ Yes |
| `NEXT_PUBLIC_AD_REDIRECT_URL` | Redirect URL for ads | `https://example.com` | ❌ No |

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint code linting
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
```

## 🔒 Security Best Practices

- ✅ Change default admin credentials before deployment
- ✅ Use strong `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- ✅ Keep all dependencies updated regularly
- ✅ Never commit `.env` file to version control
- ✅ Use HTTPS in production
- ✅ Enable MongoDB Atlas IP whitelist in production
- ✅ Set up proper CORS policies
- ✅ Implement rate limiting for APIs

## 🐛 Troubleshooting

### Media.cm videos not loading on localhost
**Solution**: Media.cm blocks localhost origins. Videos will show in DEV MODE with popup. Deploy to production for full embed support.

### Prisma connection errors
**Solution**: Check your MongoDB connection string format and network access settings in Atlas.

### Hydration errors
**Solution**: Clear browser cache and restart dev server. Ensure no SSR/CSR mismatches.

### Build errors
**Solution**: Run `npx prisma generate` before building.

## 📄 License

**WTFPL (Do What The Fuck You Want To Public License)**

This project is licensed under the WTFPL - do whatever the fuck you want with it!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using Next.js 14 + MongoDB + Prisma**

⭐ Star this repo if you find it helpful!

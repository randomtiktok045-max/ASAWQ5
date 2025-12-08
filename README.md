# Aswaq - Full-Stack E-Commerce Application

A high-performance e-commerce application built with Next.js, TailwindCSS, Supabase, and Capacitor for Web and Android platforms.

## 🚀 Features

- **Product Browsing**: Browse products with pagination and category filtering
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add products to cart with localStorage persistence
- **Categories**: Organize products by categories
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Performance Optimized**: Client-side caching with SWR (60s deduping interval)
- **Android App**: Native Android app via Capacitor (iOS explicitly excluded)

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Supabase (PostgreSQL database, Auth, Storage)
- **Caching**: SWR for client-side caching
- **Animations**: Framer Motion
- **Mobile**: Capacitor (Android only, no iOS)
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Android Studio (for Android builds)

## 🔧 Environment Setup

1. **Clone and Install**
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Environment Variables**
   
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   > ⚠️ **IMPORTANT**: Never commit `.env.local` to version control. The `SUPABASE_SERVICE_ROLE_KEY` has full database access.

3. **Database Setup**
   
   The Supabase schema has been applied with:
   - `categories` table (id, name, created_at)
   - `products` table (id, name, price, description, image, category_id, created_at)
   - Row Level Security (RLS) policies for public read access
   - Sample data (5 categories, 12 products)

## 🏃 Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Building for Production

### Web Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Android Build

```bash
# Build web assets and sync to Android
npm run android:build

# Build and open in Android Studio
npm run android:sync
```

Then in Android Studio:
1. Wait for Gradle sync to complete
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Find the APK in `android/app/build/outputs/apk/`

## 📱 Capacitor Configuration

- **App ID**: `com.aswaq.app`
- **App Name**: Aswaq
- **Web Directory**: `.next`
- **Platforms**: Android only (iOS explicitly excluded)

## 🎯 Caching Strategy

### Client-Side (SWR)
- **Deduping Interval**: 60 seconds
- **Revalidate on Focus**: Disabled
- **Revalidate on Reconnect**: Enabled

All data fetching is done client-side directly from Supabase using SWR hooks:
- `useProducts(page, limit)` - Paginated products
- `useProduct(id)` - Single product
- `useCategories()` - All categories
- `useCategoryProducts(categoryId, page, limit)` - Category products

### Changing Cache TTL

Edit `lib/useProducts.tsx`:
```typescript
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // Change this value (in milliseconds)
}
```

## 📡 Data Flow

```
User → Next.js Client Component → SWR Hook → Supabase Client → PostgreSQL
                                      ↓
                                  SWR Cache (60s)
```

## 🗂️ Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (products list)
│   ├── products/[id]/     # Product detail
│   ├── categories/        # Categories list
│   ├── category/[id]/     # Category products
│   └── cart/              # Shopping cart
├── components/            # React components
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── CartItem.tsx
│   ├── Header.tsx
│   ├── AddToCartButton.tsx
│   └── LoadingSkeleton.tsx
├── context/               # React Context
│   └── cart-context.tsx   # Cart state management
├── lib/                   # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── useProducts.tsx    # SWR hooks
│   └── products-server.ts # Type definitions
├── android/               # Capacitor Android project
└── capacitor.config.ts    # Capacitor configuration
```

## 🔒 Security

- **RLS Policies**: Public read access for products and categories
- **Service Role Key**: Server-only, never exposed to client
- **Anon Key**: Public key for client-side operations

## ⚡ Performance Optimizations

### Implemented
- ✅ Client-side SWR caching (60s deduping)
- ✅ Image lazy loading
- ✅ Next.js Image optimization
- ✅ TailwindCSS purging (automatic)
- ✅ Code splitting (automatic with Next.js)
- ✅ Pagination for product lists

### Bundle Size Mitigation
- ✅ No iOS dependencies or frameworks
- ✅ Minimal Capacitor plugins
- ✅ Tree-shaking enabled
- ✅ Dynamic imports for heavy components
- ✅ Optimized images (WebP support)

## 🚫 iOS Support

**This project explicitly excludes iOS support** as per requirements:
- No iOS platform added to Capacitor
- No iOS-specific dependencies
- No iOS build configurations
- Android-only Capacitor setup

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run build:web    # Build web assets
npm run android:sync # Build and open in Android Studio
npm run android:build # Build and sync to Android
```

## 🐛 Troubleshooting

### Build Errors
- Ensure all environment variables are set in `.env.local`
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Supabase Connection Issues
- Verify Supabase URL and keys in `.env.local`
- Check Supabase project status in dashboard
- Ensure RLS policies are correctly configured

### Android Build Issues
- Ensure Android Studio is installed
- Run `npx cap sync android` to sync changes
- Check `android/` folder permissions

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [SWR Documentation](https://swr.vercel.app)

## 📄 License

This project is for demonstration purposes.

---

**Built with ❤️ using Next.js, Supabase, and Capacitor**

# The Milk Fairy - Image Assets Guide

## Required Images for Conversion Optimization

### Exit Intent Popup Images
- **milk-warmer-hero.jpg** - Product shot of Magic Warmmy (500x500px)
- **discount-badge.png** - "$30 OFF" badge overlay (200x200px)
- **trust-badges.png** - Security/payment badges (600x100px)

### Landing Page 1: Magic Warmmy
- **warmmy-hero-video.mp4** - Hero section background video
- **warmmy-lifestyle-1.jpg** - Mom using product (1200x800px)
- **warmmy-lifestyle-2.jpg** - Dad warming milk (1200x800px)
- **warmmy-comparison.jpg** - Before/after scenario (1200x600px)
- **testimonial-mom-1.jpg** - Customer photo (400x400px)
- **testimonial-mom-2.jpg** - Customer photo (400x400px)
- **media-logos.png** - "As seen on" media strip (1200x200px)

### Landing Page 2: Freeze-Drying Service
- **freeze-dry-process.jpg** - Process diagram (1200x800px)
- **freeze-dry-lab.jpg** - Clean facility photo (1200x800px)
- **freeze-dry-before-after.jpg** - Milk transformation (1200x600px)
- **certification-badges.png** - Safety certifications (800x200px)

### Mobile Sticky CTA
- **warmmy-icon.svg** - Small product icon (50x50px)

### Trust & Social Proof
- **5-star-reviews.svg** - Star rating graphic
- **aussie-flag.svg** - Australian made indicator
- **shipping-truck.svg** - Free shipping icon
- **guarantee-badge.svg** - 30-day guarantee

## How to Add Images

### Option 1: Shopify Admin (Recommended for product images)
1. Shopify Admin → Content → Files
2. Upload images
3. Copy URL: `https://cdn.shopify.com/s/files/...`

### Option 2: Theme Assets (For UI elements)
1. Add to `/assets/` folder
2. Reference in code: `{{ 'filename.jpg' | asset_url }}`

### Option 3: Shopify Files API
For product images already in Shopify:
```liquid
{{ product.featured_image | image_url: width: 500 }}
```

## Image Optimization Requirements
- **Format**: WebP for photos, SVG for icons, MP4 for videos
- **Size**: Max 200KB for above-fold images
- **Dimensions**: Specified above for each image
- **Naming**: Use descriptive, SEO-friendly names

## Placeholder Images Currently in Use
While you gather actual images, the code references these placeholders:
- `placeholder-warmmy.jpg`
- `placeholder-popup-hero.jpg`
- `placeholder-trust-badges.png`

Replace these with your actual images when ready.
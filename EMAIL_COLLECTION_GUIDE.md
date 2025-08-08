# Email Collection Setup Guide - The Milk Fairy

## 📧 Where Emails Are Collected

### 1. **Shopify Customers Section**
All emails from the exit popup are automatically saved to:
- **Location**: Shopify Admin → Customers
- **URL**: https://admin.shopify.com/store/7d2278-7d/customers
- **Tags Applied**: 
  - `newsletter` - Subscribed to newsletter
  - `exit-popup` - Came from exit popup
  - `discount` - Eligible for discount
  - `milk-warmer-30off` - Specific campaign tag

### 2. **How to View Collected Emails**
1. Go to **Customers** in Shopify Admin
2. Click **Filter** → **Customer tags** 
3. Select `exit-popup` to see all popup subscribers
4. Export as CSV if needed

### 3. **Email Marketing Integration**
The emails automatically sync with:
- **Shopify Email** (built-in)
- **Klaviyo** (if connected)
- **Mailchimp** (if connected)
- **Other email apps** via Shopify's customer API

## 🎯 Discount Code Setup

### Create the $30 OFF Discount:
1. Go to **Discounts** in Shopify Admin
2. Click **Create discount** → **Discount code**
3. Settings:
   - **Code**: `SAVE30`
   - **Type**: Fixed amount
   - **Value**: $30
   - **Applies to**: Specific products → Magic Warmmy
   - **Minimum requirements**: None (or set minimum $89)
   - **Customer eligibility**: Everyone
   - **Usage limits**: One per customer
   - **Active dates**: Set as needed

### Automatic Email with Discount:
1. Go to **Marketing** → **Automations**
2. Create automation:
   - **Trigger**: Customer subscribes (tag = `exit-popup`)
   - **Action**: Send email with code `SAVE30`
   - **Template**: Welcome email with discount

## 📊 Tracking Email Performance

### Key Metrics to Monitor:
- **Capture Rate**: Exit popups shown vs emails collected
- **Conversion Rate**: Emails collected vs purchases made
- **Discount Usage**: How many use the $30 off code

### View Analytics:
1. **Shopify Analytics** → **Reports** → **Marketing**
2. Filter by customer tag `exit-popup`
3. Track conversion funnel

## ✅ Testing Email Collection

### Test the Flow:
1. Visit your site in incognito mode
2. Trigger exit intent (move mouse to leave)
3. Enter test email (use: test+[date]@yourdomain.com)
4. Submit form
5. Check **Customers** section for new entry
6. Verify tags are applied correctly

### What Happens After Submission:
1. **Immediate**: Email saved to Shopify Customers
2. **Tags Applied**: For segmentation
3. **Marketing Consent**: Set to "subscribed"
4. **Success Message**: Shows in popup
5. **Cookie Set**: Prevents repeat popups
6. **Analytics**: Event tracked in GA4/Facebook

## 🔧 Troubleshooting

### If Emails Aren't Appearing:
1. Check form action is `/contact`
2. Verify form_type is `customer`
3. Check browser console for errors
4. Ensure accepts_marketing field is present

### If Discount Code Isn't Working:
1. Verify discount exists in Shopify Admin
2. Check code spelling matches exactly
3. Ensure product eligibility is correct
4. Check expiry dates

## 📈 Expected Results

Based on industry standards:
- **Exit Intent Capture Rate**: 3-5% of visitors
- **With $30 Incentive**: 5-8% capture rate
- **Email to Purchase**: 15-20% conversion
- **Revenue Impact**: ~$4,500-7,500/month additional

## 🚀 Next Steps

1. **Create Discount Code** in Shopify Admin
2. **Set Up Welcome Email** automation
3. **Test Full Flow** with real email
4. **Monitor Daily** for first week
5. **Optimize** popup timing/copy based on results

## 💡 Pro Tips

- **Best Time**: Popup performs best 11pm-2am (nursing mothers)
- **Mobile First**: 70% will see on mobile
- **Copy Testing**: Try "Free Shipping" vs "$30 OFF"
- **Urgency**: Add "Limited Time" to increase conversions
- **Social Proof**: Add "Join 5000+ Aussie Mums"
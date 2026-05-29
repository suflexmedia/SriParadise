# 🚀 Srii Paradiise Static Website - Deployment Guide

## 📁 What's Inside `public_html/`

This folder contains your complete static website ready for cPanel deployment.

### File Structure:
```
public_html/
├── index.html                                      ← Homepage
├── our-story.html                                  ← About page
├── hospitality-destinations.html                   ← Destinations
├── specialty-restaurants-and-lounges.html          ← Restaurants
├── movies-and-web-series-production.html           ← Productions
├── opportunity.html                                ← Opportunities
├── business-and-financial-associates.html          ← Associates
├── founder.html                                    ← Founder page
├── privacy.html                                    ← Privacy policy
├── terms.html                                      ← Terms & conditions
├── 404.html                                        ← Custom error page
├── sitemap.xml                                     ← SEO sitemap
├── favicon.ico                                     ← Site icon
├── contact.php                                     ← Contact form handler
├── .htaccess                                       ← URL rewrites & config
├── css/                                            ← Stylesheets
│   └── style.css
├── js/                                             ← JavaScript
│   └── script.js
└── images/                                         ← All images
    ├── logos/
    ├── ott/
    └── extracted/
```

---

## 🌐 Deployment Steps

### Option 1: cPanel File Manager (Recommended for Beginners)

1. **Login to cPanel**
   - Go to your BigRock hosting dashboard
   - Click on "cPanel" or "File Manager"

2. **Navigate to public_html**
   - Open File Manager
   - Navigate to `/public_html/` (or `/home/yourusername/public_html/`)

3. **Backup Current Site** (if you have one)
   - Select all files in the current `public_html` folder
   - Click "Compress" → Create a backup ZIP
   - Download it to your computer

4. **Clear Old Files**
   - Delete all old files from `public_html` folder
   - Keep the `.htaccess` if you had custom rules (merge later)

5. **Upload New Files**
   - Click "Upload" button
   - Drag and drop ALL files from your local `public_html` folder
   - OR use the ZIP upload method below

6. **Verify**
   - Visit `https://www.sriiparadiise.com/`
   - Test all navigation links
   - Submit the contact form (test email)

---

### Option 2: FTP Upload (Recommended for Large Files)

1. **Download an FTP Client**
   - FileZilla (free): https://filezilla-project.org/
   - WinSCP (Windows): https://winscp.net/

2. **Get FTP Credentials from cPanel**
   - In cPanel → Find "FTP Accounts"
   - Use main account or create a new one
   - Note: Host, Username, Password, Port (usually 21)

3. **Connect via FTP**
   - Open FileZilla
   - Host: `ftp.sriiparadiise.com` or your server IP
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21 (or 22 for SFTP)

4. **Upload Files**
   - Navigate to `/public_html/` on the server (right side)
   - Navigate to your local `public_html` folder (left side)
   - Select ALL files from local → Drag to server
   - Wait for upload to complete

---

### Option 3: SSH / Terminal (Advanced)

If you have SSH access:

```bash
# Connect to your server
ssh yourusername@yourdomain.com

# Navigate to public_html
cd ~/public_html

# Backup current site
tar -czf backup-$(date +%Y%m%d).tar.gz *

# Remove old files (be careful!)
rm -rf *

# Upload from your local machine using SCP
# (Run this on your LOCAL machine, not the server)
scp -r /path/to/SriParadise/public_html/* yourusername@yourdomain.com:~/public_html/
```

---

## ✅ Post-Deployment Checklist

After uploading, verify these features:

- [ ] **Homepage loads** at `https://www.sriiparadiise.com/`
- [ ] **All navigation links work** (menu opens, all pages load)
- [ ] **Clean URLs work** (e.g., `/our-story` without `.html`)
- [ ] **Images display correctly** (check hero, destinations, gallery)
- [ ] **Contact form works** (submit test and check email)
- [ ] **Favicon appears** in browser tab
- [ ] **Mobile responsive** (test on phone)
- [ ] **404 page** shows for broken links (try `/test-nonexistent-page`)
- [ ] **HTTPS enabled** (green padlock in browser)

---

## 📧 Testing the Contact Form

1. Visit the homepage
2. Scroll to "Contact Us" section (or go to `/#premiere`)
3. Fill out the form with test data
4. Submit
5. Check `arjun@sriiparadiise.com` inbox for the email
6. If email doesn't arrive:
   - Check spam folder
   - Verify `contact.php` has correct permissions (644)
   - Check cPanel error logs: `cPanel → Errors → Error Log`

---

## 🔧 Common Issues & Solutions

### Issue 1: Clean URLs not working (404 errors)
**Solution:**
- Ensure `.htaccess` file is uploaded
- In cPanel → Check if "mod_rewrite" is enabled
- File permissions: `.htaccess` should be `644`

### Issue 2: Contact form not sending emails
**Solutions:**
- Check PHP mail() is enabled in cPanel
- Verify email exists: `arjun@sriiparadiise.com`
- Check error logs in cPanel
- Alternative: Use Formspree or SendGrid for forms

### Issue 3: Images not loading
**Solutions:**
- Check file permissions: folders `755`, files `644`
- Clear browser cache (Ctrl+Shift+R)
- Verify image paths are lowercase (case-sensitive on Linux servers)

### Issue 4: CSS/JS not loading
**Solutions:**
- Check file paths in HTML (should be `css/style.css`, not `/css/style.css`)
- Clear browser cache
- Check file permissions

### Issue 5: Site shows old content
**Solution:**
- Clear browser cache
- Clear CDN cache if using Cloudflare
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 🔒 Enable HTTPS (SSL Certificate)

### If SSL is not already active:

1. **cPanel → SSL/TLS Status**
2. Click "Run AutoSSL"
3. Wait 5-10 minutes for certificate installation
4. Once active, edit `.htaccess` and uncomment these lines:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

This will redirect all HTTP traffic to HTTPS automatically.

---

## 🎨 Making Changes Later

### To update content:

1. **Edit HTML files locally** in the `public_html` folder
2. **Re-upload** changed files via FTP or cPanel File Manager
3. **Clear browser cache** to see changes

### To modify styles:

1. Edit `public_html/css/style.css`
2. Upload the new CSS file
3. Hard refresh browser (Ctrl+Shift+R)

### To add new images:

1. Add images to `public_html/images/` folder
2. Reference in HTML: `<img src="images/your-image.webp" alt="Description">`
3. Upload via FTP or cPanel

---

## 📊 SEO & Analytics

### Google Search Console:

1. Go to https://search.google.com/search-console
2. Add property: `https://www.sriiparadiise.com`
3. Submit `sitemap.xml` URL: `https://www.sriiparadiise.com/sitemap.xml`

### Google Analytics (if needed):

Add this before `</head>` in all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📞 Support

**Email Issues:** Check BigRock support docs or contact their hosting support  
**Website Issues:** Review the Common Issues section above  
**Code Updates:** Edit files locally and re-upload

---

## ✨ Summary

Your website is now:
- ✅ Fully static (no server-side dependencies except PHP for contact form)
- ✅ Fast & lightweight
- ✅ SEO optimized with clean URLs
- ✅ Mobile responsive
- ✅ Contact form functional
- ✅ Ready for production deployment

**Domain:** https://www.sriiparadiise.com  
**Admin:** arjun@sriiparadiise.com  
**Hosting:** BigRock cPanel Cloud Hosting

---

**Good luck with your deployment! 🚀**

# 🔥 QUICK REFERENCE - Image Upload Feature

## ⚡ Fastest Way to Get Started

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Login as Admin
- Go to: `http://localhost:3000/login`
- Enter admin credentials

### 3. Create Attractions with Photos
- Go to: `http://localhost:3000/admin/attractions/new`
- Fill form + upload photos
- Click "Publikasikan"

### 4. Create Culinary with Photos
- Go to: `http://localhost:3000/admin/culinary/new`
- Fill form + upload photos
- Click "Publikasikan"

Done! ✅

---

## 📍 URLs

| Action | URL |
|--------|-----|
| Create Attraction | `http://localhost:3000/admin/attractions/new` |
| Edit Attraction | `http://localhost:3000/admin/attractions/[id]` |
| List Attractions | `http://localhost:3000/admin/attractions` |
| Create Culinary | `http://localhost:3000/admin/culinary/new` |
| Edit Culinary | `http://localhost:3000/admin/culinary/[id]` |
| List Culinary | `http://localhost:3000/admin/culinary` |

---

## 🔧 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload?folder=attractions` | POST | Upload photo untuk attractions |
| `/api/upload?folder=culinary` | POST | Upload photo untuk culinary |
| `/api/admin/attractions` | POST | Create attraction (dengan photos) |
| `/api/admin/attractions/[id]` | PATCH | Update attraction (dengan photos) |
| `/api/admin/culinary` | POST | Create culinary (dengan photos) |
| `/api/admin/culinary/[id]` | PATCH | Update culinary (dengan photos) |

---

## 🎯 Key Files Changed

```
✅ /src/app/api/upload/route.ts
✅ /src/components/ui/ImageUpload.tsx (NEW)
✅ /src/components/AttractionForm.tsx
✅ /src/components/CulinaryForm.tsx
```

---

## 📋 Component Props

### ImageUpload
```tsx
<ImageUpload
  value={photos}              // string[]
  onChange={setPhotos}        // (files: string[]) => void
  folder="attractions"        // 'attractions' | 'culinary'
  label="Foto"                // optional
  hint="Drag & drop"          // optional
  maxFiles={10}               // optional
/>
```

---

## 🎨 Form Usage

```tsx
'use client';
import { useState } from 'react';
import ImageUpload from '@/components/ui/ImageUpload';

export default function MyForm() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <form>
      <ImageUpload
        value={photos}
        onChange={setPhotos}
        folder="attractions"
      />
    </form>
  );
}
```

---

## 💾 Database

Photos disimpan sebagai JSON string:
```sql
-- In attractions or culinary table:
photos: "["/uploads/attractions/1729...-abc.jpg", "/uploads/attractions/1729...-def.png"]"
```

Parse di client:
```javascript
const photos = JSON.parse(data.photos); // Array!
```

---

## 🚀 Deployment

Buat folders:
```bash
mkdir -p public/uploads/attractions
mkdir -p public/uploads/culinary
```

Pastikan writable:
```bash
chmod 755 public/uploads/attractions
chmod 755 public/uploads/culinary
```

---

## ❌ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Upload fails | Check file size < 5MB, type is image/* |
| Photos not saving | Check admin role in NextAuth |
| Folder not found | Manually create `/public/uploads/attractions/` & `/culinary/` |
| Permission denied | Run `chmod 755` on folders |
| API 400 error | Check `?folder=` parameter is valid |

---

## 🧪 Quick Test

```bash
# Test upload endpoint
curl -X POST \
  -F "file=@test.jpg" \
  http://localhost:3000/api/upload?folder=attractions

# Expected response:
# { "url": "/uploads/attractions/1729...-abc.jpg", ... }
```

---

## 📸 What You Can Do

✅ Upload multiple photos  
✅ Drag & drop support  
✅ Preview before submit  
✅ Delete individual photos  
✅ Edit & update photos  
✅ Use external URLs  
✅ Max 10 photos per item  
✅ Max 5MB per file  

---

## 📚 Full Documentation

For detailed info, read:
- `IMAGE_UPLOAD_FEATURE.md` - Complete feature guide
- `FEATURE_SUMMARY.md` - Visual overview
- `CODE_EXAMPLES.md` - 10 code samples
- `IMPLEMENTATION_CHECKLIST.md` - Testing checklist

---

## 🎯 Status

✅ Complete  
✅ Tested  
✅ Production Ready  

---

**Start uploading photos now!** 🚀

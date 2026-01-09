# OCR Feature - Quick Reference

## What is OCR in Siksha AI?

OCR (Optical Character Recognition) lets students:
- **📷 Photograph** textbook pages or notes
- **🔍 Extract** text automatically
- **❓ Ask questions** about the content
- **💡 Get AI answers** using the context

## Quick Setup (5 minutes)

### 1. Get Google Vision API Key
- Go to: https://console.cloud.google.com/
- Create new project: "Siksha AI"
- Search & enable: "Cloud Vision API"
- Create API Key (Credentials → API Key)
- Copy the key

### 2. Set Environment Variable
Create `.env.local` in project root:
```
GOOGLE_VISION_API_KEY=your_key_here
```

### 3. Done!
The app is ready to use OCR. Start the dev server:
```bash
npm run dev
# or
expo start
```

## How to Use in the App

### In Tutor Page

1. **Click the 🖼️ button** (next to send button)
2. **Choose image source**:
   - 📱 Camera (take photo)
   - 🖼️ Gallery (existing photo)
3. **Wait for extraction** (auto-processing)
4. **See extracted text** (in modal)
5. **Type your question** (about the content)
6. **Click Send** (AI answers with context)

### Step-by-Step Example

```
User: Wants to understand photosynthesis from textbook

1. Click 🖼️ icon
2. Take photo of textbook page about photosynthesis
3. App extracts: "Photosynthesis is the process by which plants 
   convert light energy into chemical energy..."
4. Type question: "Explain this process in simple terms"
5. Click Send
6. AI: "Photosynthesis is how plants make food from sunlight..."
   (using book content as context)
```

## Features

| Feature | Details |
|---------|---------|
| **Input** | 📷 Camera or 🖼️ Gallery |
| **Text Types** | Printed, handwritten, documents |
| **Quality Check** | Validates extracted text (min 3 words) |
| **Word Count** | Shows how much text was found |
| **Preview Modal** | View full extracted text before asking |
| **Smart Context** | Combines extracted text + question for AI |
| **Message Display** | Shows which messages used OCR |

## What Works Best

### ✅ Good for OCR
- Clear, well-lit photos
- Printed textbook pages
- Typed documents
- Large fonts (12pt+)
- Straight, perpendicular shots
- Black text on white background

### ❌ Avoid
- Blurry/dark photos
- Very small text
- Handwriting (unless very clear)
- Photos at angles
- Poor lighting
- Colored/patterned backgrounds

## Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| No text found | Use clearer, brighter photo |
| Missing API key error | Set `GOOGLE_VISION_API_KEY` in `.env.local` |
| Network error | Check internet connection |
| Partial text | Try DOCUMENT_TEXT_DETECTION instead |
| Slow extraction | Wait 2-5s for API response |

## Technical Details

### Supported Image Formats
- JPEG ✅
- PNG ✅
- GIF ✅
- WebP ✅

### Text Limits
- Minimum: 3 words
- Maximum: 5,000 characters
- Auto-compressed for web

### Providers
- **Default**: Google Cloud Vision API (high accuracy)
- **Fallback**: Tesseract.js (web, no API key)

## Configuration Files

### Key Files
- **`src/services/ocrService.ts`** - OCR logic
- **`app/(tabs)/tutor.tsx`** - UI integration
- **`src/components/ChatBubble.tsx`** - Message display
- **`.env.local`** - API key storage

### Environment Variables
```
GOOGLE_VISION_API_KEY=your_api_key_here
```

## Testing

### Quick Test
1. Open Tutor page
2. Click 🖼️ button
3. Select any image with text
4. See extracted text appear
5. Ask a question → Get answer with context

### With Sample Images
```
# Take or select these test images:
1. Textbook page (printed text)
2. Handwritten notes (if clear)
3. Document/worksheet
4. Chart or diagram (if text present)
```

## Performance Tips

1. **Use clear images** → Faster & accurate extraction
2. **Good lighting** → Better text detection
3. **Keep files small** → Quicker upload to API
4. **Reuse extracted text** → No need to re-extract
5. **Monitor API quota** → Free tier: 1,000 req/month

## API Usage Limits

### Free Tier
- 1,000 requests/month (free)
- 1 MB image size
- ~5 second response time

### Paid Tier
- $1.50 per 1,000 requests
- Higher volume discounts
- Priority support

Check usage: Google Cloud Console → Vision API → Quotas

## Keyboard Shortcuts (Web Only)

| Shortcut | Action |
|----------|--------|
| 🖼️ button | Open image picker |
| Tab | Navigate to image button |
| Enter | Send message |

## FAQ

**Q: Do I need API key for testing?**
A: Yes, for Google Vision. Or use Tesseract.js on web (no key).

**Q: Is my API key safe?**
A: Yes, if stored in .env.local. Use API restrictions.

**Q: How much does OCR cost?**
A: Free for first 1,000 images/month. $1.50 per 1,000 after.

**Q: Can it read handwriting?**
A: Yes, if handwriting is clear. Printed text works better.

**Q: What languages does it support?**
A: English and all Indian languages supported.

**Q: Is it offline compatible?**
A: No, requires internet for Vision API. Tesseract.js works offline on web.

## Next Steps

1. ✅ Set up Google Vision API key
2. ✅ Configure `.env.local`
3. ✅ Test with sample images
4. ✅ Try asking questions about extracted content
5. ✅ Explore different image types
6. ✅ Monitor API usage

## Additional Resources

- [Full OCR Setup Guide](./OCR_SETUP.md) - Detailed instructions
- [Google Vision API Docs](https://cloud.google.com/vision/docs)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Expo Image Picker](https://docs.expo.dev/sdk/imagepicker/)

---

**Last Updated**: January 2026  
**Status**: ✅ Production Ready

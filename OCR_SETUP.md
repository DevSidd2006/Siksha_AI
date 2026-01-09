# OCR (Optical Character Recognition) Setup Guide

## Overview

The Siksha AI app now includes OCR functionality that allows students to:
1. **Photograph textbook pages** or handwritten notes
2. **Extract text automatically** from images
3. **Ask questions** about the extracted content
4. **Get AI-powered answers** from the tutor using the extracted context

## Features

### Image Input Methods
- **📷 Gallery**: Select existing photos from device
- **📱 Camera**: Take photos directly in the app
- **Auto-extraction**: Text extracts automatically after image selection

### Text Processing
- Automatic text validation (minimum 3 words)
- Text preprocessing and normalization
- Support for scanned documents and handwritten text
- Word count tracking for extracted content

### Dual OCR Providers

#### 1. **Google Cloud Vision API (Primary)**
- **Accuracy**: High accuracy for printed text
- **Supported**: Documents, books, printed materials
- **Setup Required**: API key configuration
- **Cost**: Free tier available (300 free requests/month)
- **Detection Types**:
  - DOCUMENT_TEXT_DETECTION (for scanned documents)
  - TEXT_DETECTION (for photographs)

#### 2. **Tesseract.js (Fallback/Web)**
- **Accuracy**: Good for clear images
- **Supported**: Web platform primarily
- **Setup Required**: No API key needed
- **Cost**: Free and open-source
- **Use Case**: Development, offline testing, web version

## Setup Instructions

### Step 1: Get Google Cloud Vision API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a new project**
   - Click on the project dropdown
   - Click "New Project"
   - Enter project name: "Siksha AI"
   - Click "Create"

3. **Enable Vision API**
   - Search for "Cloud Vision API"
   - Click on it
   - Click "Enable"

4. **Create API Key**
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Set Restrictions (Important for Security)**
   - Click on the API key you created
   - Under "API restrictions", select "Cloud Vision API"
   - Under "Application restrictions", choose appropriate restrictions
   - Click "Save"

### Step 2: Configure Environment Variable

#### For Local Development:

**Option A: Using .env file (Recommended)**

1. Create a `.env.local` file in project root:
   ```
   GOOGLE_VISION_API_KEY=your_api_key_here
   ```

2. Load environment variables in your build:
   - The app uses `process.env.GOOGLE_VISION_API_KEY`

**Option B: Using app.json (For Expo)**

1. Update `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "googleVisionApiKey": "your_api_key_here"
       }
     }
   }
   ```

2. Access in code:
   ```typescript
   import Constants from 'expo-constants';
   const apiKey = Constants.expoConfig?.extra?.googleVisionApiKey;
   ```

#### For Production:

1. Use EAS Secrets (Expo)
2. Use environment variables in your CI/CD
3. Use secure secret management service

### Step 3: Install Dependencies

Dependencies are already installed:
- `expo-image-picker`: For image/camera access
- `expo-file-system`: For file reading
- `tesseract.js`: For OCR fallback (web)

If needed, reinstall:
```bash
npm install expo-image-picker expo-file-system tesseract.js
```

## API Configuration

### Google Cloud Vision API Request Format

The app sends requests to:
```
https://vision.googleapis.com/v1/images:annotateRequest?key=API_KEY
```

**Request Body**:
```json
{
  "requests": [
    {
      "image": {
        "content": "base64_encoded_image"
      },
      "features": [
        {
          "type": "DOCUMENT_TEXT_DETECTION",
          "maxResults": 1
        },
        {
          "type": "TEXT_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
}
```

### Success Response
```typescript
interface OCRResult {
  text: string;           // Extracted text
  confidence: number;     // 0-1 confidence score
  language: string;       // Detected language
}
```

## Using OCR in Tutor Page

### UI Components

1. **Image Picker Button** (🖼️)
   - Located in the input bar next to voice button
   - Opens image selection modal
   - Supports camera and gallery

2. **Image Preview Modal**
   - Shows selected image
   - Displays extraction progress
   - Shows word count of extracted text

3. **Extracted Text Banner**
   - Green banner shows when text is extracted
   - Displays word count
   - "View Extracted Text" button to see full content

4. **Extracted Text Modal**
   - Scrollable view of full extracted text
   - Action buttons:
     - "Discard": Remove extracted text
     - "Use This Text": Continue with question

### Workflow

```
1. Click 🖼️ button
   ↓
2. Select image (camera/gallery)
   ↓
3. Image preview appears
   ↓
4. Auto-extraction starts (loading indicator)
   ↓
5. Extracted text displayed in modal
   ↓
6. Type your question in input field
   ↓
7. Click "Send"
   ↓
8. AI responds with context from extracted text
```

## Example Usage Scenarios

### Scenario 1: Textbook Learning
```
1. Photograph a textbook page about photosynthesis
2. App extracts the text
3. Ask: "Explain the steps of photosynthesis"
4. AI responds with explanation using the book content
```

### Scenario 2: Solving Math Problems
```
1. Take photo of math problem from worksheet
2. App extracts the problem text
3. Ask: "Can you solve this step by step?"
4. AI provides solution with explanations
```

### Scenario 3: Understanding Concepts
```
1. Photograph a concept definition from notes
2. App extracts the definition
3. Ask: "Give real-world examples of this concept"
4. AI provides context-specific examples
```

## Error Handling

### Common Issues & Solutions

**Issue**: "No readable text found in image"
- **Solution**: 
  - Ensure image is clear and well-lit
  - Text should be at least 12pt font size
  - Avoid blurry or angled photos
  - Try taking photo directly instead of selecting

**Issue**: "Failed to extract text from image"
- **Solution**:
  - Check internet connection (for Vision API)
  - Verify API key is correct
  - Check API quota limits
  - Try with a simpler image

**Issue**: "Text Extraction Error - API key missing"
- **Solution**:
  - Configure GOOGLE_VISION_API_KEY environment variable
  - Check the key is valid and not expired
  - Verify Vision API is enabled in Google Cloud Console

**Issue**: Extracted text is incomplete or garbled
- **Solution**:
  - Try improving image quality
  - Use DOCUMENT_TEXT_DETECTION instead of TEXT_DETECTION
  - For handwriting, use clearer photos

## Performance Optimization

### Best Practices

1. **Image Quality**
   - Use well-lit, clear photos
   - Avoid shadows and reflections
   - Keep camera perpendicular to text
   - Resolution: 1080p+ recommended

2. **File Size**
   - App automatically compresses images (quality: 0.8)
   - Typical image size: 200-500KB
   - Faster extraction with smaller files

3. **API Calls**
   - Cache extracted text locally
   - Reuse extracted text for multiple questions
   - Batch multiple images if needed

## Rate Limits & Quotas

### Google Vision API Quotas
- **Free Tier**: 1,000 requests/month
- **Paid**: $1.50 per 1,000 requests after free tier
- **Daily Limit**: 1,000,000 requests/day

### Best Practices
- Use fallback (Tesseract.js) on web when API unavailable
- Cache results in localStorage
- Monitor API usage in Google Cloud Console

## Security Considerations

⚠️ **IMPORTANT**: Protect your API key

### What NOT to do
- ❌ Commit API key to version control
- ❌ Expose API key in client-side code
- ❌ Share API key publicly

### Best Practices
- ✅ Use environment variables
- ✅ Set API key restrictions in Google Cloud
- ✅ Use application/server restrictions
- ✅ Monitor API usage regularly
- ✅ Rotate keys periodically
- ✅ Use separate keys for dev/prod

### Recommended Setup
```
Development:  use_dev_api_key
Staging:      use_staging_api_key  
Production:   use_prod_api_key (restricted)
```

## Testing OCR

### Manual Testing

1. **Test with Textbook**
   ```
   - Photograph a clear textbook page
   - Verify all text is extracted
   - Ask detailed questions
   - Check answer quality
   ```

2. **Test with Handwriting**
   ```
   - Photograph handwritten notes (clear)
   - Verify extraction accuracy
   - Ask questions about content
   ```

3. **Test Edge Cases**
   ```
   - Blurry images
   - Low-light photos
   - Angled text
   - Mixed language content
   ```

### Automated Testing

```typescript
// Test OCR extraction
import { OCRService } from '@/services/ocrService';

// Test with sample image
const result = await OCRService.extractTextFromImage(sampleImageUri);
console.log('Extracted text:', result.text);
console.log('Confidence:', result.confidence);

// Test validation
const validation = OCRService.validateExtractedText(result.text);
console.log('Is valid:', validation.isValid);
console.log('Word count:', validation.wordCount);
```

## Troubleshooting

### Debug Logging

Enable detailed logs in services:

```typescript
// In ocrService.ts
console.log('OCR Request:', { imageUri, apiKey });
console.log('OCR Response:', response);
console.log('Extracted:', result.text);

// In tutor.tsx
console.log('Selected image:', selectedImageUri);
console.log('Extracted text:', extractedText);
console.log('Sending question:', contextualQuestion);
```

### Monitor API Usage

1. Go to Google Cloud Console
2. Navigate to "Cloud Vision API"
3. Click "Quotas & System Limits"
4. Monitor monthly request count

## Future Enhancements

### Planned Features
- [ ] Multi-language OCR support
- [ ] Handwriting-specific recognition
- [ ] Document scanning (multiple pages)
- [ ] Text correction/confidence scoring
- [ ] Local OCR (offline mode)
- [ ] Image enhancement before OCR

### Integration Improvements
- [ ] Batch processing multiple images
- [ ] Image upload history
- [ ] Quick re-ask functionality
- [ ] Source attribution in responses

## Support & Resources

### Documentation
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Expo Image Picker](https://docs.expo.dev/sdk/imagepicker/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)

### API Keys & Setup
- [Google Cloud Console](https://console.cloud.google.com)
- [Vision API Pricing](https://cloud.google.com/vision/pricing)
- [API Security Best Practices](https://cloud.google.com/docs/authentication/application-default-credentials)

## Contact & Feedback

For issues or questions about OCR functionality:
1. Check this guide's troubleshooting section
2. Review Google Cloud Vision documentation
3. Check image quality and lighting
4. Verify API key and quota limits

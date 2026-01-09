import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  provider: 'tesseract-local' | 'paddle-local' | 'vision-api';
}

export class OCRService {
  private static tesseractWorker: any = null;
  private static localOCRCache: Map<string, OCRResult> = new Map();
  private static modelLoadingPromise: Promise<void> | null = null;

  /**
   * Initialize Tesseract.js worker (local OCR model)
   * Downloads model on first use, then cached locally
   */
  private static async initializeTesseractWorker() {
    if (this.tesseractWorker) {
      return this.tesseractWorker;
    }

    if (this.modelLoadingPromise) {
      await this.modelLoadingPromise;
      return this.tesseractWorker;
    }

    this.modelLoadingPromise = (async () => {
      try {
        const { createWorker } = await import('tesseract.js');
        this.tesseractWorker = await createWorker('eng');
        console.log('Tesseract.js worker initialized (local OCR model)');
      } catch (error) {
        console.error('Failed to initialize Tesseract worker:', error);
        throw new Error('Failed to initialize local OCR model');
      }
    })();

    await this.modelLoadingPromise;
    return this.tesseractWorker;
  }

  /**
   * Extract text using LOCAL Tesseract.js model (primary method)
   * Works completely offline, no API key required
   * Downloads model on first use (~65MB), then cached
   */
  static async extractTextFromImage(imageUri: string): Promise<OCRResult> {
    try {
      console.log('Starting local OCR extraction with Tesseract.js...');

      // Check cache first
      const cached = this.localOCRCache.get(imageUri);
      if (cached) {
        console.log('Using cached OCR result');
        return cached;
      }

      // Initialize local model
      const worker = await this.initializeTesseractWorker();

      // Read image as base64 for Tesseract processing
      console.log('Reading image file...');
      const base64Image = await FileSystem.readAsStringAsync(
        imageUri,
        { encoding: 'base64' }
      );

      // Convert to data URI format that Tesseract can process
      const dataUri = `data:image/jpeg;base64,${base64Image}`;

      // Recognize text using local model
      console.log('Processing with Tesseract.js...');
      const result = await worker.recognize(dataUri);

      const ocrResult: OCRResult = {
        text: result.data.text.trim(),
        confidence: Math.round((result.data.confidence || 85) / 100 * 100) / 100,
        language: 'en',
        provider: 'tesseract-local',
      };

      // Cache result
      this.localOCRCache.set(imageUri, ocrResult);

      console.log(`Local OCR completed - ${ocrResult.text.split(/\s+/).length} words extracted`);
      return ocrResult;
    } catch (error) {
      console.error('Local OCR Error:', error);
      
      // Try fallback to Vision API if local fails and key is available
      const apiKey = process.env.GOOGLE_VISION_API_KEY;
      if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
        console.log('Local OCR failed, attempting Vision API fallback...');
        return this.extractTextWithVisionAPI(imageUri);
      }

      throw new Error('Local OCR failed. Ensure image is clear and contains readable text. No API key available for fallback.');
    }
  }

  /**
   * Extract text using Google Cloud Vision API (fallback option)
   * Requires GOOGLE_VISION_API_KEY in environment
   */
  private static async extractTextWithVisionAPI(imageUri: string): Promise<OCRResult> {
    try {
      // Read image file as base64
      const base64Image = await FileSystem.readAsStringAsync(
        imageUri,
        { encoding: 'base64' }
      );

      // Use Google Cloud Vision API
      const apiKey = process.env.GOOGLE_VISION_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('Google Vision API key not configured');
      }

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotateRequest?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'DOCUMENT_TEXT_DETECTION',
                    maxResults: 1,
                  },
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 10,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract full text from first annotation
      const fullTextAnnotation = data.responses[0]?.fullTextAnnotation;
      if (!fullTextAnnotation || !fullTextAnnotation.text) {
        throw new Error('No text found in image');
      }

      // Calculate average confidence
      const textAnnotations = data.responses[0]?.textAnnotations || [];
      let totalConfidence = 0;
      let count = 0;

      textAnnotations.forEach((annotation: any) => {
        if (annotation.confidence) {
          totalConfidence += annotation.confidence;
          count++;
        }
      });

      const averageConfidence = count > 0 ? totalConfidence / count : 0.85;

      return {
        text: fullTextAnnotation.text.trim(),
        confidence: Math.round(averageConfidence * 100) / 100,
        language: 'en',
        provider: 'vision-api',
      };
    } catch (error) {
      console.error('Vision API Error:', error);
      throw new Error('Both local and cloud OCR failed. Please try again.');
    }
  }

  /**
   * Extract text using local Tesseract.js directly
   * Same as primary method, exposed for explicit local-only extraction
   */
  static async extractTextWithLocalModel(imageUri: string): Promise<OCRResult> {
    return this.extractTextFromImage(imageUri);
  }

  /**
   * Terminate Tesseract worker to free memory (optional)
   * Call when app closes or OCR no longer needed
   */
  static async terminateWorker() {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
      this.localOCRCache.clear();
      console.log('Tesseract worker terminated and cache cleared');
    }
  }

  /**
   * Clear OCR cache (useful for memory management)
   */
  static clearCache() {
    this.localOCRCache.clear();
    console.log('OCR cache cleared');
  }

  /**
   * Get cache size (for debugging/monitoring)
   */
  static getCacheSize(): number {
    return this.localOCRCache.size;
  }

  /**
   * Validate extracted text quality
   */
  static validateExtractedText(text: string): {
    isValid: boolean;
    message: string;
    wordCount: number;
  } {
    const wordCount = text.trim().split(/\s+/).length;
    const minWords = 3; // At least 3 words required

    if (wordCount < minWords) {
      return {
        isValid: false,
        message: `Text too short (${wordCount} words). Please use a clearer image.`,
        wordCount,
      };
    }

    if (text.length > 5000) {
      return {
        isValid: true,
        message: `Text extracted (${wordCount} words). Note: Some content may be truncated.`,
        wordCount,
      };
    }

    return {
      isValid: true,
      message: `Successfully extracted text (${wordCount} words)`,
      wordCount,
    };
  }

  /**
   * Clean and preprocess extracted text
   */
  static preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([.!?])\s+([A-Z])/g, '$1\n$2') // Break into sentences
      .trim();
  }
}


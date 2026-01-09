# OCR Integration Examples & API Reference

## Table of Contents
1. [Basic OCR Usage](#basic-ocr-usage)
2. [Advanced Integration](#advanced-integration)
3. [Error Handling](#error-handling)
4. [Testing Patterns](#testing-patterns)
5. [Performance Optimization](#performance-optimization)

## Basic OCR Usage

### Simple Image to Text Extraction

```typescript
import { OCRService } from '@/services/ocrService';

// Extract text from image
const result = await OCRService.extractTextFromImage(imageUri);

console.log('Extracted text:', result.text);
console.log('Confidence:', result.confidence);
console.log('Language:', result.language);
```

### With Validation

```typescript
import { OCRService } from '@/services/ocrService';

async function extractAndValidate(imageUri: string) {
  try {
    // Extract
    const result = await OCRService.extractTextFromImage(imageUri);
    
    // Validate
    const validation = OCRService.validateExtractedText(result.text);
    
    if (!validation.isValid) {
      console.warn('Validation issue:', validation.message);
      console.log('Word count:', validation.wordCount);
      return null;
    }
    
    // Preprocess
    const cleaned = OCRService.preprocessText(result.text);
    
    return {
      ...result,
      text: cleaned,
      wordCount: validation.wordCount,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    return null;
  }
}
```

## Advanced Integration

### Tutor Page Integration (Full Example)

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OCRService } from '@/services/ocrService';
import { sendQuestion } from '@/services/api';

export function TutorWithOCR() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pick image and extract text
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setImageUri(uri);
      
      // Auto-extract
      await extractText(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Extract text from selected image
  const extractText = async (uri: string) => {
    setIsProcessing(true);
    try {
      const result = await OCRService.extractTextFromImage(uri);
      const validation = OCRService.validateExtractedText(result.text);
      
      if (validation.isValid) {
        const cleaned = OCRService.preprocessText(result.text);
        setExtractedText(cleaned);
      } else {
        Alert.alert('No readable text found', validation.message);
        setExtractedText(null);
      }
    } catch (error) {
      Alert.alert('Extraction failed', String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  // Send extracted text + question to AI
  const handleAskQuestion = async (userQuestion: string) => {
    if (!extractedText || !userQuestion.trim()) {
      Alert.alert('Error', 'Please provide both text and question');
      return;
    }

    try {
      const context = `Based on this extracted text:\n\n"${extractedText}"\n\nQuestion: ${userQuestion}`;
      const response = await sendQuestion(context, 'Class 5-9');
      
      console.log('AI Response:', response.answer);
      return response.answer;
    } catch (error) {
      Alert.alert('Error', 'Failed to get response');
      throw error;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleImagePicker}>
        <Text>Pick Image</Text>
      </TouchableOpacity>
      
      {extractedText && (
        <View>
          <Text>Extracted ({extractedText.split(' ').length} words):</Text>
          <Text>{extractedText.substring(0, 100)}...</Text>
        </View>
      )}
    </View>
  );
}
```

### Custom OCR Wrapper Component

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { OCRService, OCRResult } from '@/services/ocrService';

interface OCRWrapperProps {
  onTextExtracted: (result: OCRResult, cleaned: string) => void;
  onError: (error: string) => void;
}

export function OCRWrapper({ onTextExtracted, onError }: OCRWrapperProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleExtraction = async (imageUri: string) => {
    setIsExtracting(true);
    try {
      // Extract
      const result = await OCRService.extractTextFromImage(imageUri);
      
      // Validate
      const validation = OCRService.validateExtractedText(result.text);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      // Preprocess
      const cleaned = OCRService.preprocessText(result.text);
      
      // Callback
      onTextExtracted(result, cleaned);
      setExtractedText(cleaned);
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'Text extraction failed';
      onError(message);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <View>
      {/* UI for showing extracted text */}
      <Modal visible={!!extractedText}>
        <View>
          <Text>{extractedText}</Text>
        </View>
      </Modal>
    </View>
  );
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
import { OCRService, OCRResult } from '@/services/ocrService';

enum OCRErrorType {
  INVALID_IMAGE = 'INVALID_IMAGE',
  EXTRACTION_FAILED = 'EXTRACTION_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

interface OCRError {
  type: OCRErrorType;
  message: string;
  originalError?: Error;
}

async function extractWithErrorHandling(
  imageUri: string
): Promise<OCRResult | OCRError> {
  try {
    // Validate image URI
    if (!imageUri || typeof imageUri !== 'string') {
      return {
        type: OCRErrorType.INVALID_IMAGE,
        message: 'Invalid image URI provided',
      };
    }

    // Extract text
    let result: OCRResult;
    try {
      result = await OCRService.extractTextFromImage(imageUri);
    } catch (error) {
      if (error instanceof Error && error.message.includes('network')) {
        return {
          type: OCRErrorType.NETWORK_ERROR,
          message: 'Network connection failed. Check your internet.',
          originalError: error,
        };
      }
      
      if (error instanceof Error && error.message.includes('API')) {
        return {
          type: OCRErrorType.API_ERROR,
          message: 'Vision API error. Check your API key.',
          originalError: error,
        };
      }

      return {
        type: OCRErrorType.EXTRACTION_FAILED,
        message: error instanceof Error 
          ? error.message 
          : 'Failed to extract text from image',
        originalError: error instanceof Error ? error : undefined,
      };
    }

    // Validate extracted text
    const validation = OCRService.validateExtractedText(result.text);
    if (!validation.isValid) {
      return {
        type: OCRErrorType.VALIDATION_FAILED,
        message: validation.message || 'Extracted text did not pass validation',
      };
    }

    return result;
  } catch (error) {
    return {
      type: OCRErrorType.EXTRACTION_FAILED,
      message: 'Unknown error during OCR',
      originalError: error instanceof Error ? error : undefined,
    };
  }
}

// Usage
const result = await extractWithErrorHandling(imageUri);

if ('type' in result) {
  // Error occurred
  console.error(`[${result.type}] ${result.message}`);
  
  // User-friendly message
  const messages: Record<OCRErrorType, string> = {
    [OCRErrorType.INVALID_IMAGE]: 'Please select a valid image',
    [OCRErrorType.EXTRACTION_FAILED]: 'Failed to read text from image',
    [OCRErrorType.VALIDATION_FAILED]: 'Image does not contain enough readable text',
    [OCRErrorType.API_ERROR]: 'API configuration error. Check your setup.',
    [OCRErrorType.NETWORK_ERROR]: 'Network connection failed',
  };
  
  Alert.alert('OCR Error', messages[result.type]);
} else {
  // Success
  console.log('Extracted:', result.text);
}
```

## Testing Patterns

### Unit Tests

```typescript
import { OCRService } from '@/services/ocrService';

describe('OCRService', () => {
  describe('validateExtractedText', () => {
    it('should accept text with minimum 3 words', () => {
      const result = OCRService.validateExtractedText('Hello world test');
      expect(result.isValid).toBe(true);
    });

    it('should reject text with less than 3 words', () => {
      const result = OCRService.validateExtractedText('Hi world');
      expect(result.isValid).toBe(false);
    });

    it('should reject text exceeding max length', () => {
      const longText = 'a '.repeat(2600);
      const result = OCRService.validateExtractedText(longText);
      expect(result.isValid).toBe(false);
    });
  });

  describe('preprocessText', () => {
    it('should normalize whitespace', () => {
      const text = 'Hello   world    test';
      const result = OCRService.preprocessText(text);
      expect(result).toContain('Hello world test');
    });

    it('should break into sentences', () => {
      const text = 'First sentence. Second sentence.';
      const result = OCRService.preprocessText(text);
      expect(result).toContain('First sentence.');
    });
  });
});
```

### Integration Tests

```typescript
import { OCRService } from '@/services/ocrService';

describe('OCR Integration', () => {
  it('should extract text from image and process it', async () => {
    const testImageUri = 'file:///path/to/test-image.jpg';
    
    // Extract
    const result = await OCRService.extractTextFromImage(testImageUri);
    expect(result.text).toBeTruthy();
    
    // Validate
    const validation = OCRService.validateExtractedText(result.text);
    expect(validation.isValid).toBe(true);
    
    // Preprocess
    const cleaned = OCRService.preprocessText(result.text);
    expect(cleaned.length).toBeGreaterThan(0);
  });
});
```

## Performance Optimization

### Caching Extracted Text

```typescript
interface CachedOCRResult {
  imageUri: string;
  result: OCRResult;
  timestamp: number;
  preprocessed: string;
}

class OCRCache {
  private cache: Map<string, CachedOCRResult> = new Map();
  private maxAge: number = 1000 * 60 * 60; // 1 hour

  async extractWithCache(imageUri: string): Promise<OCRResult> {
    // Check cache
    const cached = this.cache.get(imageUri);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      console.log('Using cached OCR result');
      return cached.result;
    }

    // Extract fresh
    const result = await OCRService.extractTextFromImage(imageUri);
    
    // Cache it
    const cleaned = OCRService.preprocessText(result.text);
    this.cache.set(imageUri, {
      imageUri,
      result,
      timestamp: Date.now(),
      preprocessed: cleaned,
    });

    return result;
  }

  clear() {
    this.cache.clear();
  }
}
```

### Batch Processing

```typescript
async function batchExtractText(imageUris: string[]) {
  const results = await Promise.allSettled(
    imageUris.map(uri => OCRService.extractTextFromImage(uri))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        uri: imageUris[index],
        text: result.value.text,
        success: true,
      };
    } else {
      return {
        uri: imageUris[index],
        error: result.reason,
        success: false,
      };
    }
  });
}

// Usage
const results = await batchExtractText([uri1, uri2, uri3]);
results.forEach(r => {
  if (r.success) {
    console.log(`✓ ${r.uri}: ${r.text.substring(0, 50)}...`);
  } else {
    console.log(`✗ ${r.uri}: ${r.error}`);
  }
});
```

### Progress Tracking

```typescript
interface OCRProgress {
  stage: 'reading' | 'uploading' | 'processing' | 'validating' | 'complete';
  progress: number; // 0-100
  message: string;
}

async function extractWithProgress(
  imageUri: string,
  onProgress: (progress: OCRProgress) => void
): Promise<OCRResult> {
  // Reading image
  onProgress({
    stage: 'reading',
    progress: 20,
    message: 'Reading image...',
  });

  // Uploading to API
  onProgress({
    stage: 'uploading',
    progress: 40,
    message: 'Uploading to server...',
  });

  // Processing with Vision API
  onProgress({
    stage: 'processing',
    progress: 70,
    message: 'Extracting text...',
  });

  const result = await OCRService.extractTextFromImage(imageUri);

  // Validating
  onProgress({
    stage: 'validating',
    progress: 90,
    message: 'Validating result...',
  });

  OCRService.validateExtractedText(result.text);

  // Complete
  onProgress({
    stage: 'complete',
    progress: 100,
    message: 'Done!',
  });

  return result;
}
```

## Real-World Examples

### Example 1: Student Homework Helper

```typescript
async function helpWithHomework(imagePath: string, questionText: string) {
  // Extract text from homework image
  const result = await OCRService.extractTextFromImage(imagePath);
  const validation = OCRService.validateExtractedText(result.text);
  
  if (!validation.isValid) {
    throw new Error('Could not read homework clearly');
  }

  // Combine with question
  const context = `
Homework content:
${OCRService.preprocessText(result.text)}

Student question: ${questionText}
`;

  // Get AI help
  const response = await sendQuestion(context, 'Class 5-9');
  
  return {
    extractedHomework: result.text,
    aiExplanation: response.answer,
    wordCount: validation.wordCount,
  };
}
```

### Example 2: Document Scanner

```typescript
async function scanDocument(imageUris: string[]) {
  const pages = await Promise.all(
    imageUris.map(async (uri) => {
      try {
        const result = await OCRService.extractTextFromImage(uri);
        return {
          uri,
          text: OCRService.preprocessText(result.text),
          confidence: result.confidence,
        };
      } catch (error) {
        return {
          uri,
          text: '',
          error: String(error),
        };
      }
    })
  );

  // Combine all pages
  const fullDocument = pages
    .filter(p => !('error' in p))
    .map(p => p.text)
    .join('\n\n--- New Page ---\n\n');

  return {
    fullText: fullDocument,
    pageCount: pages.length,
    successCount: pages.filter(p => !('error' in p)).length,
  };
}
```

---

For more information, see [OCR_SETUP.md](./OCR_SETUP.md)

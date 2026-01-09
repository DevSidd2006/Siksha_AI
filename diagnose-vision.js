import { VisionLanguageService } from './src/services/visionLanguageService';

async function diagnoseVisionConnection() {
  console.log('🔧 Siksha AI Vision-Language Diagnostic Tool');
  console.log('==========================================\n');

  try {
    const result = await VisionLanguageService.testConnection();

    console.log('📊 Connection Test Results:');
    console.log(`Ollama Available: ${result.ollamaAvailable ? '✅' : '❌'}`);
    console.log(`Model Available: ${result.modelAvailable ? '✅' : '❌'}`);

    if (result.workingUrl) {
      console.log(`Working URL: ${result.workingUrl}`);
    }

    if (result.availableModels && result.availableModels.length > 0) {
      console.log(`Available Models: ${result.availableModels.join(', ')}`);
    }

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }

    console.log('\n🔍 Troubleshooting Steps:');
    if (!result.ollamaAvailable) {
      console.log('1. Make sure Ollama is running: ollama serve');
      console.log('2. Check if Ollama is accessible at http://localhost:11434');
      console.log('3. For React Native apps, you may need to use your computer\'s IP address instead of localhost');
      console.log('4. Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)');
      console.log('5. Update the URL in VisionLanguageService if needed');
    } else if (!result.modelAvailable) {
      console.log('1. Pull the vision model: ollama pull qwen3-vl:2b');
      console.log('2. Wait for download to complete (1.9GB)');
      console.log('3. Verify model is listed: ollama list');
    } else {
      console.log('✅ Everything looks good! Vision-language features should work.');
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
}

// Run diagnostic
diagnoseVisionConnection();
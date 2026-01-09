import { NativeModules, Platform } from 'react-native';

type LlamaBridgeModule = {
  init: (modelPath: string) => Promise<boolean>;
  generate: (prompt: string, maxTokens: number, temperature: number) => Promise<string>;
  stop: () => void;
};

const LINKING_ERROR =
  'LlamaBridge native module not found. Add the native implementation (Android/iOS) and rebuild.';

const NativeLlama = NativeModules.LlamaBridge as LlamaBridgeModule | undefined;

let initialized = false;

export const llamaBridge = {
  isAvailable(): boolean {
    return !!NativeLlama && Platform.OS !== 'web';
  },

  async ensure(modelPath: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    if (initialized) return true;
    if (!modelPath) return false;
    try {
      initialized = await NativeLlama!.init(modelPath);
      return initialized;
    } catch (error) {
      console.warn('Llama init failed:', error);
      return false;
    }
  },

  async generate(prompt: string, opts?: { maxTokens?: number; temperature?: number; modelPath?: string }): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error(LINKING_ERROR);
    }

    const modelPath = opts?.modelPath || '';
    const ready = await this.ensure(modelPath);
    if (!ready) {
      throw new Error('Llama model not ready. Check modelPath or native build.');
    }

    const maxTokens = opts?.maxTokens ?? 120;
    const temperature = opts?.temperature ?? 0.7;
    return NativeLlama!.generate(prompt, maxTokens, temperature);
  },

  stop() {
    if (!this.isAvailable()) return;
    try {
      NativeLlama!.stop();
    } catch (error) {
      console.warn('Llama stop failed:', error);
    }
  },
};

// Dev note: Implement the native module named `LlamaBridge` on Android/iOS and expose
// init(modelPath), generate(prompt, maxTokens, temperature), stop(). This JS wrapper
// keeps the app compiling even before the native layer is added.
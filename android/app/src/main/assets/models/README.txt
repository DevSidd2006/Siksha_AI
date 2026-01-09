Place your quantized GGUF model (e.g., an instruction-tuned 3B model such as phi-3-mini or llama3) in this directory with a recognizable filename (for example: model.gguf).

The native bridge expects to receive the full path to the GGUF when `LlamaBridge.init()` is called. You can bundle the model inside the APK (this folder) or download it at runtime and point to the downloaded file inside the app's files directory.

To avoid bloating the APK, download the model on first launch and save the path in AsyncStorage. Update `src/services/offlineTutor.ts`.

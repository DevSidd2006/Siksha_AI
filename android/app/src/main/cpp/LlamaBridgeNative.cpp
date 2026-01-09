#include <jni.h>
#include <string>
#include <mutex>
#include <android/log.h>

static constexpr const char* TAG = "LlamaBridgeNative";
static std::string g_model_path;
static bool g_initialized = false;
static std::mutex g_mutex;

extern "C" JNIEXPORT jboolean JNICALL
Java_com_siksha_ai_LlamaBridgeModule_nativeInit(JNIEnv* env, jobject /* this */, jstring modelPath) {
  const char* path = env->GetStringUTFChars(modelPath, nullptr);
  if (path == nullptr) {
    __android_log_print(ANDROID_LOG_ERROR, TAG, "modelPath was null");
    return JNI_FALSE;
  }

  std::lock_guard<std::mutex> guard(g_mutex);
  g_model_path = path;
  env->ReleaseStringUTFChars(modelPath, path);

  // TODO: Replace the following placeholder with llama.cpp initialization (llama_init_from_file etc.).
  __android_log_print(ANDROID_LOG_INFO, TAG, "Initializing llama model at %s", g_model_path.c_str());
  g_initialized = !g_model_path.empty();
  return g_initialized ? JNI_TRUE : JNI_FALSE;
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_siksha_ai_LlamaBridgeModule_nativeGenerate(JNIEnv* env, jobject /* this */, jstring prompt, jint maxTokens, jdouble temperature) {
  std::lock_guard<std::mutex> guard(g_mutex);
  if (!g_initialized) {
    return env->NewStringUTF("Llama model is not initialized");
  }

  const char* promptChars = env->GetStringUTFChars(prompt, nullptr);
  std::string input = promptChars ? promptChars : "";
  env->ReleaseStringUTFChars(prompt, promptChars);

  // TODO: Use llama.cpp APIs here to encode prompt, run inference, and collect tokens.
  std::string response = "[llama.cpp placeholder] Please install the actual GGUF model and update the JNI bridge.";

  __android_log_print(ANDROID_LOG_INFO, TAG, "Prompt received (%d tokens): %s", maxTokens, input.c_str());
  return env->NewStringUTF(response.c_str());
}

extern "C" JNIEXPORT void JNICALL
Java_com_siksha_ai_LlamaBridgeModule_nativeStop(JNIEnv* /* env */, jobject /* this */) {
  std::lock_guard<std::mutex> guard(g_mutex);
  // TODO: Release llama.cpp resources (llama_free_model, llama_free_context) when implemented.
  g_initialized = false;
  g_model_path.clear();
  __android_log_print(ANDROID_LOG_INFO, TAG, "Stopped llama bridge");
}

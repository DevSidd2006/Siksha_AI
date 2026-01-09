cmake_minimum_required(VERSION 3.18)
project(llamabridge)

add_library(llamabridge SHARED LlamaBridgeNative.cpp)

# Define where llama.cpp lives; replace this path with the folder containing the llama.cpp source tree.
set(LLAMA_CPP_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/llama.cpp" CACHE PATH "Path to llama.cpp source tree")

if(EXISTS "${LLAMA_CPP_ROOT}/CMakeLists.txt")
  add_subdirectory(${LLAMA_CPP_ROOT} llama_cpp_build EXCLUDE_FROM_ALL)
  target_link_libraries(llamabridge llama)
else()
  message(WARNING "llama.cpp not found at ${LLAMA_CPP_ROOT}; using placeholder native implementation.")
endif()

find_library(log-lib log)

target_link_libraries(llamabridge ${log-lib})

target_compile_features(llamabridge PRIVATE cxx_std_17)

# Allow lldb debugging symbols even in release builds while llama.cpp is missing.
set_target_properties(llamabridge PROPERTIES
  POSITION_INDEPENDENT_CODE ON
)

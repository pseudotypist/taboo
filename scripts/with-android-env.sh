#!/bin/sh
# Runs a command with JAVA_HOME and ANDROID_HOME pointing at the Homebrew JDK 21 and
# Android command-line tools, unless they are already set. Used by the npm scripts.
#   scripts/with-android-env.sh npx cap run android
: "${JAVA_HOME:=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home}"
: "${ANDROID_HOME:=/opt/homebrew/share/android-commandlinetools}"
ANDROID_SDK_ROOT="$ANDROID_HOME"
PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
export JAVA_HOME ANDROID_HOME ANDROID_SDK_ROOT PATH
exec "$@"

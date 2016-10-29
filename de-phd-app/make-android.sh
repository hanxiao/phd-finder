ver=$1
rm apk/*
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk alias_name
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk alias_name
~/Library/Android/sdk/build-tools/23.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk apk/zhaodedao-armv7-$ver.apk
~/Library/Android/sdk/build-tools/23.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk apk/zhaodedao-x86-$ver.apk

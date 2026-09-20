App name - FitMate
description - Workout Tracker and Nutrition Tracker
Tech stack - React Native Expo and Google Firebase


https://www.linkedin.com/in/sushant-virghla-b74435329/



this is my first react native expo project and also first project i ever created.
thats why this code contains some unnecessary dependencies and files also including images.
working perfectly but very cluttered and unorganized.


# Setup Instructions

1. Install Node.js and npm
   Make sure you have Node.js version 18 or newer installed on your computer.
   Download from: https://nodejs.org/

2. Install dependencies:
   npm install

3. Create a Firebase app and configure the app with environment variables.
   Copy `.env.example` to `.env` and fill in your Firebase values:
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

4. Install Expo Go app on your phone (Android/iOS)
   or set up a simulator if preferred.

5. Start the project:
   npx expo start --tunnel

6. If you are using Expo Go, scan the QR code shown in the terminal.
   If you are using a simulator, choose the correct platform in the Metro UI.

This project now includes a safe Firebase configuration check so it won't crash if the config is missing or left as placeholder values.

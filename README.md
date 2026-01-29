# PROscore

PROscore is a high-performance basketball scoreboard application built with React Native and Expo.

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Networking**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Local Storage**: [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- [Expo Go](https://expo.dev/expo-go) app on your mobile device (for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npx expo start
```

- Press `a` for Android (requires emulator or device)
- Press `i` for iOS (requires Simulator or device)
- Press `w` for Web
- Scan the QR code with Expo Go to run on a physical device.

## Project Structure

- `app/`: File-based routes (Expo Router)
- `components/`: Reusable UI components
- `services/`: API and external service logic
- `models/`: TypeScript interfaces and types
- `hooks/`: Custom React hooks
- `assets/`: Static assets (images, fonts, etc.)

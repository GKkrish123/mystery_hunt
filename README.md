# Mysteryverse

## Mobile (Capacitor)

This repo is configured to build native iOS and Android shells using Capacitor that load the same Next.js app.

### Dev workflow (live reload from Next dev server)

1. Start Next.js dev server on your machine:

```bash
npm run dev
```

2. In a new terminal, sync Capacitor and open the native IDE, replacing `YOUR-LAN-IP` with your machine IP reachable by the device/simulator:

```bash
npm run mobile:dev:ios    # for Xcode
# or
npm run mobile:dev:android
```

These scripts set `CAP_SERVER_URL` which is read by `capacitor.config.ts` to point the webview at your dev server. Ensure the device/simulator can reach that IP and port 3000.

### Android specifics

- Emulator loopback hostname is `10.0.2.2` (maps to your Mac’s localhost). If your Next dev server runs on a different port (e.g. 3001/3002), update the URL accordingly.

```bash
# Emulator, port 3000
export CAP_SERVER_URL=http://10.0.2.2:3000 && npx cap sync android

# Emulator, port 3001
export CAP_SERVER_URL=http://10.0.2.2:3001 && npx cap sync android

# Physical device (USB), reverse the port so 127.0.0.1 works on device
adb reverse tcp:3000 tcp:3000
export CAP_SERVER_URL=http://127.0.0.1:3000 && npx cap sync android

# Physical device (Wi‑Fi), use your LAN IP
export CAP_SERVER_URL=http://YOUR-LAN-IP:3000 && npx cap sync android
```

Tips:
- Verify connectivity inside the emulator: open the emulator’s Chrome and visit `http://10.0.2.2:3000` (or your port).
- If you change `CAP_SERVER_URL`, re-run `npx cap sync android` and then hit Run ▶ in Android Studio.

### iOS specifics

- Simulator can reach your Mac’s localhost directly. For dev on port 3000/3001/etc:

```bash
# iOS Simulator, port 3000
export CAP_SERVER_URL=http://127.0.0.1:3000 && npx cap sync ios

# iOS Simulator, port 3001
export CAP_SERVER_URL=http://127.0.0.1:3001 && npx cap sync ios

# Physical device (Wi‑Fi), use your LAN IP
export CAP_SERVER_URL=http://YOUR-LAN-IP:3000 && npx cap sync ios
```

Then open/run from Xcode:

```bash
npm run cap:open:ios  # choose a Simulator and press Run ▶
```

Notes:
- If you see a blank screen or “webpage not available”, confirm the dev server URL/port is correct and reachable from the device/simulator.
- When using `http://` URLs, the config sets cleartext appropriately so it works in dev.

### Production build inside the app (optional)

If you prefer bundling static assets into the native app, build your app and sync:

```bash
npm run build
npx cap sync
```

The build output is copied from `out/` into the native projects. Alternatively, set `NEXT_PUBLIC_CAP_SERVER_URL` to a deployed URL and run `npm run mobile:prod` to point the app at a hosted instance.

### Open native projects later

```bash
npm run cap:open:ios
npm run cap:open:android
```

### Notes

- Push notifications, deep links, file access, etc., can be added by installing Capacitor plugins and calling them from the Next.js app.
- Keep `capacitor.config.ts` `webDir` in sync with your build output strategy.

### Troubleshooting

```bash
cd /Users/gkrish/Documents/Codes/mystery_hunt/ios/App && rm -rf Pods Podfile.lock && pod repo update && pod install && chmod -R u+rwX,go+rX Pods && xattr -dr com.apple.quarantine Pods || true && cd - >/dev/null && export CAP_SERVER_URL=http://127.0.0.1:3000 && npx cap sync ios && open ios/App/App.xcworkspace
```
- Next dev server chose a different port:
  - The terminal prints the active port (e.g. `http://localhost:3001`). Use that in `CAP_SERVER_URL` and re-sync.
- Android device cannot reach your Mac’s IP:
  - Try `adb reverse tcp:3000 tcp:3000` and use `http://127.0.0.1:3000` as `CAP_SERVER_URL`.
- iOS build shows blank page:
  - Confirm the simulator/device can open your URL in Safari. Re-sync if you change `CAP_SERVER_URL`.

Welcome to the **Mysteryverse**, your gateway to unraveling mysteries and exploring the unknown.

## Tech Stack

The Mysteryverse App is built using the following technologies:

- **Frontend**: Next.js for building a dynamic and responsive user interface.
- **Backend**: Next.js TRPC Router with Redis, Pub Sub and Cloud Functions for handling server-side logic and APIs.
- **Database**: Firebase for storing user data and mystery-related content.
- **Authentication**: Firebase Mobile and Email Verified signup for secure user authentication.
- **Hosting**: Deployed on Google Cloud Platform with Firebase App Hosting.
- **Version Control**: Git for source code management and collaboration.

These technologies ensure a seamless and robust experience for users as they explore the mysteries within the app.

## What's next? How do I use this app?

**Link** - https://mysteryverse.co.in/

This app is designed to be intuitive and user-friendly, allowing you to dive straight into the world of mysteries. Start exploring the features we've built for you, and feel free to expand or customize as needed.

If you have questions or need assistance, please refer to the resources below or reach out to our community for support.

## Key Features

- **Interactive Mystery Solving**: Engage with puzzles, clues, and challenges.
- **Collaborative Gameplay**: Team up with friends or other users to solve mysteries together.
- **Dynamic Content Updates**: New mysteries and challenges added regularly.
- **Customizable Experience**: Tailor the app to suit your preferences.

## Production Deployment

### Web (Firebase App Hosting + Functions)

1. **Deploy Functions:**
   ```bash
   cd functions
   npm install
   npm run deploy
   ```

2. **Deploy App Hosting:**
   ```bash
   firebase deploy --only apphosting
   ```

3. **Environment Setup:**
   - Ensure `apphosting.yaml` has correct environment variables
   - Set secrets in Firebase Console (e.g., `FB_KING`, `REDIS_URL`)
   - Verify `NODE_ENV=production` is set

### Mobile Apps (Production)

1. **Point to Production URL:**
   ```bash
   # Sync both platforms to production domain
   npm run mobile:prod
   
   # Or manually:
   export NEXT_PUBLIC_CAP_SERVER_URL=https://mysteryverse.co.in
   npx cap sync ios
   npx cap sync android
   ```

2. **Android Release:**
   ```bash
   npm run cap:open:android
   ```
   - In Android Studio: Build → Generate Signed App Bundle
   - Create/upload keystore for signing
   - Select `release` build variant
   - Upload `.aab` to Google Play Console

3. **iOS Release:**
   ```bash
   npm run cap:open:ios
   ```
   - In Xcode: Select "Any iOS Device (arm64)"
   - Product → Archive → Distribute to App Store
   - Ensure signing team is set under Targets → App → Signing & Capabilities
   - Upload to App Store Connect

### Production Scripts

- `npm run mobile:prod` - Sync mobile apps to production URL
- `npm run build` - Build Next.js for production
- `npm run cap:open:ios` / `npm run cap:open:android` - Open native projects

### Verification

- **Web:** Visit your production domain, test all pages and API routes
- **Android:** Install internal testing build, verify it loads from production URL
- **iOS:** TestFlight build, confirm it reaches the production domain

### Environment Variables

Ensure these are set in your production environment:
- `NODE_ENV=production`
- `FB_KING` (Firebase service account key)
- `REDIS_URL` (Redis connection string)
- `NEXT_PUBLIC_CAP_SERVER_URL` (for mobile app URL)

Enjoy your journey into the Mysteryverse!

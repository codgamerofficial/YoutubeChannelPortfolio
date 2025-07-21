# YouTube Channel Portfolio App

A stunning mobile app showcasing your YouTube channel with real-time data integration.

## 🚀 Features

- **Real-time YouTube Data**: Fetches live channel statistics and video data
- **Funky Design**: Modern animations and custom typography
- **Channel Analytics**: Comprehensive stats dashboard
- **Video Gallery**: Browse all channel videos with search and filters
- **About Section**: Channel information and social links

## 📱 Setup Instructions

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Configure the App

1. Open `services/youtubeApi.ts`
2. Replace `YOUR_YOUTUBE_API_KEY` with your actual API key:

```typescript
const YOUTUBE_API_KEY = 'your_actual_api_key_here';
```

### 3. Update Channel Information

The channel ID is already set to: `UCIMBMaomkNyX5uJjO9VVN1A`

If you need to change it, update the `CHANNEL_ID` in `services/youtubeApi.ts`.

### 4. Customize Personal Information

Update the following files with your personal information:

- `app/(tabs)/about.tsx` - Your bio, location, social links
- Channel handle and other personal details

## 🎨 Design Features

- **Custom Fonts**: Orbitron, Space Grotesk, Fira Code
- **Animated Backgrounds**: Floating gradient shapes
- **Smooth Animations**: React Native Reanimated
- **Modern UI**: Glass-morphism effects and gradients

## 📊 Data Integration

The app automatically fetches:
- Subscriber count
- Total views
- Video count
- Latest videos with thumbnails
- Video statistics (views, likes, duration)
- Upload dates

## 🔧 Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📝 Notes

- The app includes fallback demo data if API calls fail
- All data is formatted for better readability (1.5K, 25M, etc.)
- Refresh functionality updates data in real-time
- Error handling with retry options

## 🌟 Customization

You can easily customize:
- Color schemes in the style files
- Animation timings and effects
- Layout and component structure
- Add more social media platforms
- Include additional analytics
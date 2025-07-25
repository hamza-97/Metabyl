# Gemini API Setup Guide

## Quick Setup

1. **Get Gemini API Key**

   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Add API Key to Environment**

   - Add your API key to your environment variables:

   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

   Or add it to your `.env` file:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Update Environment Configuration**
   - Open `src/config/environment.ts`
   - Replace `'YOUR_GEMINI_API_KEY'` with your actual API key

## What's Changed

✅ **Direct Gemini Integration** - No more server calls  
✅ **Self-Contained App** - Everything runs locally  
✅ **Faster Response** - Direct API calls to Google  
✅ **No Server Needed** - App works completely offline (except for AI calls)

## Features

- **Meal Plan Generation** - Uses Gemini 2.0 Flash model
- **Nutritional Information** - Complete macro breakdown
- **Shopping Lists** - Generated automatically
- **Custom Preferences** - Dietary restrictions, cuisine preferences, family size

## Testing

1. Open the app
2. Go to Home screen
3. Tap "Create Meal Plan"
4. Fill in your preferences
5. Tap "Generate Plan"
6. The app will now call Gemini directly!

## Error Handling

- Network errors are handled gracefully
- Invalid API keys will show appropriate errors
- Rate limiting is handled automatically

That's it! Your app now uses Gemini directly without any server dependencies.

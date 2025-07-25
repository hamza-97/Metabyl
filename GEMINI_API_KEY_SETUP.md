# 🔑 Gemini API Key Setup Guide

## ⚠️ Important: You Need a Different API Key

The credentials you provided are for **Google OAuth** (for user authentication), but we need a **Gemini API key** for AI features.

## 🎯 How to Get Gemini API Key

### Step 1: Go to Google AI Studio

Visit: https://makersuite.google.com/app/apikey

### Step 2: Create API Key

1. Click "Create API Key"
2. Give it a name (e.g., "Metabyl App")
3. Copy the generated API key

### Step 3: Add to Your App

**Option A: Environment Variable**

```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```

**Option B: Update Config File**

```typescript
// In src/config/environment.ts
AI: {
  GEMINI_API_KEY: 'your_gemini_api_key_here', // Replace this!
},
```

## 🔍 What's Different

| Type                  | Purpose               | Where to Get         |
| --------------------- | --------------------- | -------------------- |
| **OAuth Credentials** | User login/signup     | Google Cloud Console |
| **Gemini API Key**    | AI features (recipes) | Google AI Studio     |

## 🚀 Quick Test

Once you have the Gemini API key:

1. Add it to your environment
2. Run the app
3. Go to Recipes tab
4. Tap any recipe
5. Should see real AI-generated recipe details!

## 💡 Pro Tip

You can use the same Google account for both:

- OAuth credentials (for user auth)
- Gemini API key (for AI features)

But they're different services and need different setup steps.

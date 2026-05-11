# Browser Extension Errors - Ignore These

## About the Error

You're seeing this error:
```
Denying load of <URL>. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
```

**This is NOT a problem with Symphonia.** This is a browser extension error.

## What Causes It

Browser extensions (like ad blockers, password managers, developer tools, etc.) sometimes try to inject scripts or load resources into web pages. Modern browsers block these if the extension hasn't properly declared them in their manifest file.

## Is It Harmful?

❌ **No, it's completely harmless!** It doesn't affect:
- Your app's functionality
- Registration/login
- Data loading
- Any features

## How to Ignore It

### Option 1: Filter Console (Recommended)

In Chrome/Edge DevTools:
1. Open Console (F12)
2. Click the filter icon (funnel) in the console
3. Add a filter: `-web_accessible_resources -manifest`
   - The minus sign (`-`) excludes these messages
4. Click "Exclude network messages" checkbox

### Option 2: Disable Extensions (For Testing)

To see if an extension is causing it:
1. Chrome: `chrome://extensions/`
2. Edge: `edge://extensions/`
3. Toggle extensions off one by one
4. Refresh the page to see if the error disappears

Common culprits:
- Ad blockers (uBlock Origin, AdBlock)
- Password managers
- Developer tools extensions
- Privacy extensions

### Option 3: Use Incognito/Private Mode

Extensions are often disabled in incognito mode:
- Chrome: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- Edge: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)

## Finding Real Errors

To see actual app errors:

1. **Filter the console:**
   - Keep only errors/warnings from `localhost`
   - Ignore extension-related messages

2. **Check the Network tab:**
   - Look for failed API requests (red entries)
   - Check the Response tab for server errors

3. **Look for these patterns:**
   - ✅ Real error: `Failed to fetch`, `Network error`, `400/500 status`
   - ❌ Extension error: `web_accessible_resources`, `manifest`, extension names

## Quick Filter Script

You can paste this in your browser console to hide extension errors:

```javascript
// Run this in console to filter extension errors
const originalError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (!message.includes('web_accessible_resources') && 
      !message.includes('manifest key') &&
      !message.includes('extension')) {
    originalError.apply(console, args);
  }
};
```

## Focusing on Registration Errors

If you're still having registration issues:

1. **Check backend console** for actual error messages
2. **Check browser Network tab:**
   - Find the `/api/auth/register` request
   - Click on it
   - Check the "Response" tab for the actual error message

3. **Look for these real errors:**
   - "JWT_SECRET is not configured"
   - "Email already registered"
   - "Invalid email format"
   - "All fields are required"

The browser extension errors can be safely ignored - they won't affect your registration or any app functionality.

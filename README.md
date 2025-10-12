# ZyroAI - Deployment Guide for Render

## 📁 Project Structure

Your project should be organized as follows:

```
zyroai/
│
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── render.yaml           # Render configuration
├── build.sh              # Build script for system dependencies
├── README.md             # This file
│
├── templates/
│   └── index.html        # Your existing HTML file
│
├── static/
│   ├── style.css         # Your existing CSS file
│   ├── xyro01.js         # Your existing JavaScript file
│   └── xyro02.js         # Your existing JavaScript file
│
└── uploads/              # Created automatically (for temporary files)
```

## 🚀 Deployment Steps

### 1. Prepare Your Files

1. Create a new folder named `zyroai`
2. Copy all the files I provided:
   - `app.py` (main application)
   - `requirements.txt` (dependencies)
   - `render.yaml` (Render config)
   - `build.sh` (build script)
3. Create a `templates` folder and put your `index.html` inside
4. Create a `static` folder and put `style.css`, `xyro01.js`, `xyro02.js` inside
5. Create an empty `uploads` folder

### 2. Update Your HTML File

In `index.html`, remove the Eruda debug script (lines at the bottom):
```html
<!-- Remove these lines -->
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

### 3. Make build.sh Executable

If you're on Linux/Mac, run:
```bash
chmod +x build.sh
```

### 4. Create a Git Repository

```bash
cd zyroai
git init
git add .
git commit -m "Initial commit"
```

### 5. Push to GitHub

1. Create a new repository on GitHub (don't initialize it with README)
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/zyroai.git
git branch -M main
git push -u origin main
```

### 6. Deploy on Render

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect the `render.yaml` file
5. Add environment variables:
   - `DEEPGRAM_API_KEY`: Your Deepgram API key
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
6. Click "Create Web Service"

### 7. Wait for Deployment

- First deployment takes 5-10 minutes (installing dependencies)
- You'll get a free URL like: `https://zyroai.onrender.com`

## ⚙️ Environment Variables

Add these in Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `DEEPGRAM_API_KEY` | Your Deepgram API key |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |

## 🔧 Important Changes Made

### From Colab to Production:

1. **Removed ngrok** - Not needed on Render
2. **Removed Colab-specific code** - Like `userdata` imports
3. **Added proper port handling** - Using `PORT` environment variable
4. **Changed server** - Using `gunicorn` instead of `waitress`
5. **System dependencies** - Installed via `build.sh`
6. **File cleanup** - Uploaded files are deleted after processing
7. **Error handling** - Better error responses

### Security Improvements:

1. API keys moved to environment variables
2. Production-ready server (gunicorn)
3. Removed debug tools

## ⚠️ Limitations on Render Free Tier

1. **Cold starts**: Service sleeps after 15 minutes of inactivity (first request takes 30-60 seconds)
2. **750 hours/month**: Free tier limit
3. **Limited resources**: 512MB RAM, shared CPU
4. **No persistent storage**: Uploaded files are temporary

## 🐛 Troubleshooting

### Build Fails?
- Check `build.sh` has correct permissions
- Verify all dependencies in `requirements.txt` are correct

### App Crashes?
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly

### Slow Performance?
- Free tier has limited resources
- Consider upgrading to paid plan for better performance

### File Upload Issues?
- Large files may timeout on free tier
- Keep file sizes under 10MB

## 📝 Testing Locally (Optional)

Before deploying, test locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Install system dependencies (Ubuntu/Debian)
sudo apt-get install tesseract-ocr tesseract-ocr-ben poppler-utils ffmpeg

# Set environment variables
export DEEPGRAM_API_KEY="your_key"
export OPENROUTER_API_KEY="your_key"

# Run the app
python app.py
```

Visit: `http://localhost:10000`

## 🎉 Success!

Once deployed, your app will be live at: `https://your-app-name.onrender.com`

Share this URL with users to access your ZyroAI application!

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify all files are properly structured
3. Ensure environment variables are set
4. Check that your API keys are valid

---

**Note**: Remove any sensitive API keys from code before pushing to GitHub. Always use environment variables!

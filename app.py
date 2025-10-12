import os
import json
import subprocess
import requests
import asyncio
import pandas as pd
from flask import Flask, render_template, request, jsonify
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from bs4 import BeautifulSoup
import nest_asyncio

nest_asyncio.apply()

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Deepgram API Key
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "6a72b399671de69ec7230c2da2bc9eebd0add251")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")

# Initialize LLM
llm1 = ChatOpenAI(
    model="meta-llama/llama-3.3-70b-instruct:free",
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=OPENROUTER_API_KEY
)

# Prompt Templates
yt_prompt = PromptTemplate(
    template=(
        "=== YouTube Video Transcript ===\n{transcript}\n\n"
        "=== User Question ===\n{user_yt_query}\n\n"
        "=== Response ===\nPlease answer the question accurately using only the transcript."
    ),
    input_variables=['transcript', 'user_yt_query']
)

web_prompt = PromptTemplate(
    template=(
        "=== Webpage Content ===\n{transcript}\n\n"
        "=== User Question ===\n{user_web_query}\n\n"
        "=== Response ===\nPlease answer the question accurately using only the content from the webpage."
    ),
    input_variables=['transcript', 'user_web_query']
)

pdf_prompt = PromptTemplate(
    template=(
        "=== PDF Document Transcript ===\n{transcript}\n\n"
        "=== Task ===\n{user_pdf_query}\n\n"
        "=== Response ===\nUsing the information from the PDF above, complete the user's task as creatively and clearly as possible."
    ),
    input_variables=['transcript', 'user_pdf_query']
)

general_file_prompt = PromptTemplate(
    template=(
        "=== Extracted File Content ===\n{file_content}\n\n"
        "=== Task ===\n{user_query}\n\n"
        "=== Response ===\nUsing the information from the above file, complete the user's task as clearly, accurately, and creatively as possible."
    ),
    input_variables=['file_content', 'user_query']
)


# Helper Functions
def get_yt_text(youtube_url):
    """Download and transcribe YouTube video"""
    def download_audio(youtube_url):
        filename = "audio.wav"
        command = [
            "yt-dlp",
            "-x", "--audio-format", "wav",
            "-o", filename,
            youtube_url
        ]
        subprocess.run(command, check=True, capture_output=True, text=True)
        return filename

    def transcribe_with_deepgram(audio_path):
        with open(audio_path, 'rb') as audio_file:
            response = requests.post(
                "https://api.deepgram.com/v1/listen",
                headers={
                    "Authorization": f"Token {DEEPGRAM_API_KEY}",
                    "Content-Type": "audio/wav"
                },
                data=audio_file
            )
        if response.status_code == 200:
            result = response.json()
            transcript = result['results']['channels'][0]['alternatives'][0]['transcript']
            return transcript
        else:
            print("Deepgram error:", response.text)
            return None

    try:
        audio_file = download_audio(youtube_url)
        transcript = transcribe_with_deepgram(audio_file)
        if os.path.exists(audio_file):
            os.remove(audio_file)
        return transcript
    except Exception as e:
        print(f"Error processing YouTube video: {e}")
        return None


async def async_get_yt_text(youtube_url):
    return await asyncio.to_thread(get_yt_text, youtube_url)


def get_web_text(url):
    """Scrape text from webpage"""
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/114.0.0.0 Safari/537.36"
            )
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        for tag in soup(["script", "style"]):
            tag.decompose()
        
        text = soup.get_text(separator="\n", strip=True)
        return text
    except Exception as e:
        print(f"Failed to fetch webpage: {e}")
        return ""


async def async_web_link_text(url):
    return await asyncio.to_thread(get_web_text, url)


def get_pdf_text(pdf_path):
    """Extract text from PDF using OCR"""
    from pdf2image import convert_from_path
    import pytesseract
    
    pages = convert_from_path(pdf_path)
    ocr_pages = []
    
    for page in pages:
        text = pytesseract.image_to_string(page, lang='ben+eng')
        ocr_pages.append(text)
    
    return ocr_pages


async def async_get_pdf_text(pdf_path):
    return await asyncio.to_thread(get_pdf_text, pdf_path)


def get_local_audio_text(audio_path):
    """Transcribe local audio file using Whisper"""
    import whisper
    
    if not os.path.exists(audio_path):
        print(f"Audio file not found: {audio_path}")
        return None
    
    standard_audio = "temp_audio.wav"
    
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", audio_path, "-ac", "1", "-ar", "16000", standard_audio],
            check=True
        )
        
        model = whisper.load_model("base")
        result = model.transcribe(standard_audio)
        
        if os.path.exists(standard_audio):
            os.remove(standard_audio)
        
        return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None


async def extract_text(filepath):
    """Extract text from various file types"""
    ext = os.path.splitext(filepath)[1].lower()
    
    try:
        if ext in [".txt", ".html", ".xml", ".json", ".csv", ".py", ".js", ".css"]:
            def _read_text(path):
                with open(path, "r", encoding="utf-8") as f:
                    return f.read()
            return await asyncio.to_thread(_read_text, filepath)
        
        elif ext == ".pdf":
            transcript = await async_get_pdf_text(filepath)
            if isinstance(transcript, list):
                return "\n\n".join(transcript)
            return str(transcript)
        
        elif ext in [".xlsx", ".xls"]:
            def _read_excel_to_json(path):
                excel_data = pd.read_excel(path, sheet_name=None)
                structured = {
                    sheet_name: df.fillna("").to_dict(orient="records")
                    for sheet_name, df in excel_data.items()
                }
                return json.dumps(structured, indent=2, ensure_ascii=False)
            return await asyncio.to_thread(_read_excel_to_json, filepath)
        
        elif ext == ".docx":
            def _read_docx(path):
                from docx import Document
                doc = Document(path)
                return "\n".join([para.text for para in doc.paragraphs])
            return await asyncio.to_thread(_read_docx, filepath)
        
        elif ext == ".mp3":
            return await asyncio.to_thread(get_local_audio_text, filepath)
        
        else:
            return f"Unsupported file type: {ext}"
    
    except Exception as e:
        return f"Error reading file: {e}"


# Routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/yt_api', methods=['POST'])
def yt_api():
    data = request.get_json()
    user_query = data.get('user_prompt')
    user_yt_link = data.get('user_yt_link')
    
    try:
        transcript = asyncio.run(async_get_yt_text(user_yt_link))
        final_prompt = yt_prompt.format(
            transcript=transcript,
            user_yt_query=user_query
        )
        response_data = llm1.invoke(final_prompt)
        return jsonify({'response': str(response_data.content)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/web_api', methods=['POST'])
def web_api():
    data = request.get_json()
    user_query = data.get('user_prompt')
    user_web_link = data.get('user_web_link')
    
    try:
        extracted_text = asyncio.run(async_web_link_text(user_web_link))
        final_prompt = web_prompt.format(
            transcript=extracted_text,
            user_web_query=user_query
        )
        response_data = llm1.invoke(final_prompt)
        return jsonify({'response': str(response_data.content)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload', methods=['POST'])
def upload():
    user_query = request.form.get('user_prompt')
    
    if 'myfile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['myfile']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        transcript = asyncio.run(extract_text(filepath))
        file_type = os.path.splitext(file.filename)[1].lower()
        
        if file_type == ".pdf":
            final_prompt = pdf_prompt.format(
                transcript=transcript,
                user_pdf_query=user_query
            )
        else:
            final_prompt = general_file_prompt.format(
                file_content=transcript,
                user_query=user_query
            )
        
        response_data = llm1.invoke(final_prompt)
        
        # Clean up uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({'response': str(response_data.content)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import docx
import requests

app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # use ["*"] only for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 Your Groq API Key
GROQ_API_KEY = "your api key"

# 🔹 LLM Function
def ask_llm(prompt):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",  # ✅ fixed typo
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1024
            }
        )

        result = response.json()
        print("Groq response:", result)

        if "choices" not in result:
            error_msg = result.get("error", {}).get("message", str(result))
            return f"Error from LLM: {error_msg}"

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Error connecting to LLM: {str(e)}"


# 🔹 Summarize + Risk Endpoint
@app.post("/summarize")
async def summarize(file: UploadFile = File(...)):
    text = ""

    try:
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.file) as pdf:
                text = " ".join(p.extract_text() or "" for p in pdf.pages)

        elif file.filename.endswith(".docx"):
            doc = docx.Document(file.file)
            text = " ".join(p.text for p in doc.paragraphs)

        else:
            return {"summary": "Unsupported file type.", "risks": ""}

    except Exception as e:
        return {"summary": f"Error reading file: {str(e)}", "risks": ""}

    if not text.strip():
        return {"summary": "Could not extract text from the file.", "risks": ""}

    # 🔹 Summarization Prompt
    summary_prompt = f"""
    Summarize this legal document in simple language.
    Provide:
    1. A short summary (3-5 lines)
    2. Key bullet points

    Document:
    {text[:4000]}
    """

    # 🔹 Risk Detection Prompt
    risk_prompt = f"""
    Analyze this legal document and identify risky clauses.

    For each risky clause:
    - Quote the clause
    - Classify as Low, Medium, or High risk
    - Explain why it is risky in simple terms

    Focus on:
    - High penalties
    - Strict deadlines
    - One-sided obligations
    - Hidden conditions

    Document:
    {text[:4000]}
    """

    summary = ask_llm(summary_prompt)
    risks = ask_llm(risk_prompt)

    return {
        "summary": summary,
        "risks": risks
    }


# 🔹 Chat Model
class ChatMsg(BaseModel):
    message: str


# 🔹 Chat Endpoint
@app.post("/chat")
async def chat(msg: ChatMsg):
    prompt = f"""
    You are a legal assistant.
    Answer ONLY legal-related questions.
    If the question is not related to law, politely refuse.

    Question: {msg.message}
    """

    reply = ask_llm(prompt)

    return {"reply": reply}
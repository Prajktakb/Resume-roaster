// ==============================
// Resume Roast Bot - script.js
// PDF + Text + Back Button
// ==============================

// DOM Elements
const roastBtn = document.getElementById("roastBtn");
const backBtn = document.getElementById("backBtn");
const pdfUpload = document.getElementById("pdfUpload");
const resumeInput = document.getElementById("resumeInput");
const output = document.getElementById("output");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

// ==============================
// ROAST BUTTON
// ==============================

roastBtn.addEventListener("click", async () => {
  let resumeText = "";

  try {
    // 1️⃣ Get resume text
    if (pdfUpload.files.length > 0) {
      const file = pdfUpload.files[0];

      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }

      resumeText = await extractTextFromPDF(file);
    } else {
      resumeText = resumeInput.value.trim();
    }

    if (!resumeText) {
      alert("Upload a resume PDF or paste text");
      return;
    }

    // 2️⃣ Switch to result page
    page1.classList.add("hidden");
    page2.classList.remove("hidden");
    output.textContent = "🔥 Roasting your resume...";

    // 3️⃣ Generate roast
    const roast = await generateRoast(resumeText);
    output.textContent = roast;

  } catch (err) {
    console.error(err);
    alert("Error occurred. Check console.");
  }
});

// ==============================
// BACK BUTTON
// ==============================

backBtn.addEventListener("click", () => {
  page2.classList.add("hidden");
  page1.classList.remove("hidden");
  output.textContent = "";
  pdfUpload.value = "";
  resumeInput.value = "";
});

// ==============================
// PDF TEXT EXTRACTION
// ==============================

async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    content.items.forEach(item => {
      text += item.str + " ";
    });
  }

  return text;
}

// ==============================
// OPENAI INTEGRATION
// ==============================

async function generateRoast(resumeText) {
  const OPENAI_API_KEY = "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";

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
                You are a friendly resume roasting expert.
                Roast politely and humorously.
                Never insult the person.
                Use light sarcasm.
                End with actionable tips.
                Format clearly with emojis.
            `
          },
          {
            role: "user",
            content: resumeText.slice(0, 8000)
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error("OpenAI API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

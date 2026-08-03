const API_BASE = "http://127.0.0.1:2200";

document.getElementById("api-url-display").textContent = `${API_BASE}/predict`;

const form = document.getElementById("predict-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");

const resultEmpty = document.getElementById("result-empty");
const resultLoading = document.getElementById("result-loading");
const resultContent = document.getElementById("result-content");

const scoreValueEl = document.getElementById("score-value");
const scoreLabelEl = document.getElementById("score-label");
const gaugeValue = document.getElementById("gauge-value");

const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");

const requiredFields = Array.from(form.querySelectorAll("[required]"));
const gaugeLength = gaugeValue.getTotalLength();
gaugeValue.style.strokeDasharray = gaugeLength;
gaugeValue.style.strokeDashoffset = gaugeLength;

function updateProgress() {
  const filled = requiredFields.filter((el) => el.value !== "").length;
  const pct = (filled / requiredFields.length) * 100;
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${filled} of ${requiredFields.length} answered`;
}

requiredFields.forEach((el) => {
  el.addEventListener("input", updateProgress);
  el.addEventListener("change", updateProgress);
});
updateProgress();

function showState(state) {
  resultEmpty.hidden = state !== "empty";
  resultLoading.hidden = state !== "loading";
  resultContent.hidden = state !== "content";
}

function scoreLabel(score) {
  if (score < 2.5) return "Struggling";
  if (score < 5) return "Managing";
  if (score < 7.5) return "Doing okay";
  return "Thriving";
}

function setError(message) {
  if (!message) {
    formError.hidden = true;
    formError.textContent = "";
    return;
  }
  formError.hidden = false;
  formError.textContent = message;
}

function setGauge(score) {
  const pct = Math.min(1, Math.max(0, score / 10));
  const offset = gaugeLength * (1 - pct);
  gaugeValue.style.strokeDashoffset = offset;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(null);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const payload = {
    Age: Number(formData.get("Age")),
    Gender: formData.get("Gender"),
    Country: formData.get("Country").trim(),
    Academic_Level: formData.get("Academic_Level"),
    Most_Used_Platform: formData.get("Most_Used_Platform"),
    Purpose_Of_Use: formData.get("Purpose_Of_Use"),
    Avg_Daily_Usage_Hours: Number(formData.get("Avg_Daily_Usage_Hours")),
    Daily_Unlocks: Number(formData.get("Daily_Unlocks")),
    Study_Hours: Number(formData.get("Study_Hours")),
    Physical_Activity_Hours: Number(formData.get("Physical_Activity_Hours")),
    Sleep_Hours_Per_Night: Number(formData.get("Sleep_Hours_Per_Night")),
    Stress_Level: formData.get("Stress_Level"),
  };

  submitBtn.disabled = true;
  showState("loading");

  try {
    const response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const detail = errBody?.detail
        ? typeof errBody.detail === "string"
          ? errBody.detail
          : JSON.stringify(errBody.detail)
        : `Request failed with status ${response.status}`;
      throw new Error(detail);
    }

    const data = await response.json();
    const score = data.predicted_mental_health_score;

    scoreValueEl.textContent = score.toFixed(1);
    scoreLabelEl.textContent = scoreLabel(score);
    setGauge(score);

    showState("content");
  } catch (err) {
    showState("empty");
    setError(
      err.message.includes("Failed to fetch")
        ? `Couldn't reach the API at ${API_BASE}. Make sure uvicorn is running with CORS enabled and the port matches.`
        : err.message
    );
  } finally {
    submitBtn.disabled = false;
  }
});
# Students Mental Health Predictor

A machine learning project that estimates a student's mental health score from survey-style inputs such as social media habits, sleep, study time, physical activity, and self-reported stress level.

## Overview

This repository contains:

- A trained machine learning model serialized as `Mental_Health_Model.pkl`
- A FastAPI backend (`main.py`) that serves predictions
- A web frontend (`index.html`, `style.css`, `script.js`) for entering student details and viewing results
- A dataset used to train the model: `Student Social Media And Mental Health Impact.csv`
- A Jupyter notebook (`Mental_Health.ipynb`) for exploration and model development

## Features

- Predicts a mental health score on a 0–10 scale
- Accepts inputs such as:
  - Age
  - Gender
  - Country
  - Academic level
  - Most used social media platform
  - Primary purpose of social media use
  - Daily usage hours
  - Phone unlocks per day
  - Study hours
  - Physical activity hours
  - Sleep hours per night
  - Stress level
- Provides a simple browser-based UI
- Exposes a FastAPI `/predict` endpoint for programmatic access
- Includes basic input validation using Pydantic

## Tech Stack

- **Python**
- **FastAPI**
- **Pandas**
- **Joblib**
- **Scikit-learn** model serialization
- **HTML/CSS/JavaScript**
- **Jupyter Notebook**

## Project Structure

```text
.
├── Mental_Health.ipynb
├── Mental_Health_Model.pkl
├── Student Social Media And Mental Health Impact.csv
├── main.py
├── index.html
├── style.css
├── script.js
├── requirements.txt
└── LICENSE
```

## How It Works

1. The user fills out the form in the frontend.
2. The frontend sends the responses to the FastAPI backend.
3. The backend preprocesses the country into a grouped category.
4. The trained model predicts a mental health score.
5. The frontend displays the score with a visual gauge and label.

## API Endpoints

### `GET /`
Returns a simple welcome message.

### `POST /predict`
Returns an estimated mental health score.

#### Example request

```json
{
  "Age": 21,
  "Gender": "Male",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Networking",
  "Avg_Daily_Usage_Hours": 4.5,
  "Daily_Unlocks": 60,
  "Study_Hours": 3,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 7,
  "Stress_Level": "Medium"
}
```

#### Example response

```json
{
  "predicted_mental_health_score": 6.0
}
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Arpan-ar7/Students_Mental_Health_Predictor.git
cd Students_Mental_Health_Predictor
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
```

#### Windows

```bash
.venv\Scripts\activate
```

#### macOS/Linux

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI backend

```bash
uvicorn main:app --reload --port 2200
```

### 5. Open the frontend

Open `index.html` in a browser, or serve it with a local web server.

> The frontend expects the API to be available at `http://127.0.0.1:2200`.

## Notes

- The model output is an estimated score, not a medical diagnosis.
- The project is intended for educational and exploratory purposes.
- Ensure the backend is running before using the frontend.

## License

This project is licensed under the MIT License.

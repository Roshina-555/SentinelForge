import joblib
import os

MODEL_PATH = "ml/phishing_model.pkl"

def predict_phishing(message: str):
    if not os.path.exists(MODEL_PATH):
        return {
            "error": "Model not found. Please train the model first."
        }

    model = joblib.load(MODEL_PATH)

    prediction = model.predict([message])[0]
    probabilities = model.predict_proba([message])[0]

    confidence = round(max(probabilities) * 100, 2)

    result = "Phishing/Spam" if prediction == 1 else "Legitimate"

    risk_level = "High" if prediction == 1 else "Low"

    return {
        "message": message,
        "prediction": result,
        "confidence": confidence,
        "risk_level": risk_level,
        "probability": {
            "legitimate": round(probabilities[0] * 100, 2),
            "phishing": round(probabilities[1] * 100, 2)
        }
    }
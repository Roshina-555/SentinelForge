import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

DATASET_PATH = "data/phishing_emails.csv"
MODEL_PATH = "ml/phishing_model.pkl"

def load_dataset():
    data = pd.read_csv(DATASET_PATH, encoding="latin-1")

    # Auto-detect common column names
    if "v1" in data.columns and "v2" in data.columns:
        data = data.rename(columns={"v1": "label", "v2": "text"})
    elif "label" in data.columns and "text" in data.columns:
        pass
    elif "Category" in data.columns and "Message" in data.columns:
        data = data.rename(columns={"Category": "label", "Message": "text"})
    else:
        raise ValueError(f"Dataset columns not recognized: {data.columns.tolist()}")

    data = data[["label", "text"]]
    data.dropna(inplace=True)

    data["label"] = data["label"].map({
        "ham": 0,
        "spam": 1,
        "legitimate": 0,
        "phishing": 1
    })

    data.dropna(inplace=True)

    return data

def train_model():
    data = load_dataset()

    X = data["text"]
    y = data["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(stop_words="english")),
        ("classifier", MultinomialNB())
    ])

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print("Model trained successfully")
    print("Accuracy:", round(accuracy * 100, 2), "%")
    print("\nClassification Report:\n")
    print(classification_report(y_test, predictions))
    print("\nConfusion Matrix:\n")
    print(confusion_matrix(y_test, predictions))

    os.makedirs("ml", exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    print(f"\nModel saved at: {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
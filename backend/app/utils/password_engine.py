import math
import re

COMMON_PASSWORDS = {
    "password",
    "123456",
    "123456789",
    "qwerty",
    "admin",
    "welcome",
    "letmein",
    "iloveyou"
}

def calculate_entropy(password: str):
    charset = 0

    if re.search(r"[a-z]", password):
        charset += 26

    if re.search(r"[A-Z]", password):
        charset += 26

    if re.search(r"[0-9]", password):
        charset += 10

    if re.search(r"[^A-Za-z0-9]", password):
        charset += 32

    if charset == 0:
        return 0

    entropy = len(password) * math.log2(charset)

    return round(entropy, 2)

def estimate_crack_time(entropy):

    if entropy < 28:
        return "Instantly"

    elif entropy < 36:
        return "Few Minutes"

    elif entropy < 60:
        return "Few Days"

    elif entropy < 80:
        return "Several Years"

    else:
        return "Centuries"

def analyze_password(password: str):

    score = 0
    suggestions = []

    checks = {
        "length": len(password) >= 12,
        "uppercase": bool(re.search(r"[A-Z]", password)),
        "lowercase": bool(re.search(r"[a-z]", password)),
        "numbers": bool(re.search(r"[0-9]", password)),
        "special_characters": bool(re.search(r"[^A-Za-z0-9]", password))
    }

    for key, passed in checks.items():

        if passed:
            score += 1
        else:
            suggestions.append(f"Add {key.replace('_', ' ')}")

    if password.lower() in COMMON_PASSWORDS:
        score = 0
        suggestions.append("Password found in common password database")

    entropy = calculate_entropy(password)

    crack_time = estimate_crack_time(entropy)

    if score <= 2:
        strength = "Weak"

    elif score <= 4:
        strength = "Medium"

    else:
        strength = "Strong"

    return {
        "password_length": len(password),
        "strength": strength,
        "score": score,
        "entropy": entropy,
        "estimated_crack_time": crack_time,
        "security_checks": checks,
        "suggestions": suggestions
    }
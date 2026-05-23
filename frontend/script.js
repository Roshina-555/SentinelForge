const API = "http://127.0.0.1:8000";

const themeToggle = document.getElementById("themeToggle");

let latestReports = {
  password: null,
  scanner: null,
  phishing: null
};

function applyTheme() {
  const theme = localStorage.getItem("theme") || "dark";

  if (theme === "dark") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.textContent = "☀️ Toggle Theme";
  } else {
    document.body.classList.remove("dark");
    if (themeToggle) themeToggle.textContent = "🌙 Toggle Theme";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    applyTheme();
  });
}

applyTheme();

function fillDemoLogin() {
  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  if (emailField && passwordField) {
    emailField.value = "roshina@example.com";
    passwordField.value = "Roshina@123";
  }
}

function showLoading(elementId, message) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = `
    <div class="result-card">
      ⏳ ${message}
    </div>
  `;
}

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = `
    <div class="result-card">
      <div class="result-row">
        <strong>Error</strong>
        <span>${message}</span>
      </div>
    </div>
  `;
}

function formatKey(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function showObjectResult(elementId, data) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = `
    <div class="result-card">
      ${Object.entries(data)
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return `
              <div class="result-row">
                <strong>${formatKey(key)}</strong>
                <span>${JSON.stringify(value, null, 2)}</span>
              </div>
            `;
          }

          return `
            <div class="result-row">
              <strong>${formatKey(key)}</strong>
              <span>${value}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function showAuthTab(tabName) {
  const loginPanel = document.getElementById("loginPanel");
  const registerPanel = document.getElementById("registerPanel");
  const tabs = document.querySelectorAll(".tab");

  if (!loginPanel || !registerPanel) return;

  loginPanel.classList.remove("active");
  registerPanel.classList.remove("active");

  tabs.forEach(tab => tab.classList.remove("active"));

  if (tabName === "login") {
    loginPanel.classList.add("active");
    tabs[0].classList.add("active");
  } else {
    registerPanel.classList.add("active");
    tabs[1].classList.add("active");
  }
}

async function registerUser() {
  const full_name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (!full_name || !email || !password) {
    showError("registerResult", "Please fill all fields.");
    return;
  }

  showLoading("registerResult", "Creating secure account...");

  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name,
        email,
        password
      })
    });

    const data = await res.json();
    showObjectResult("registerResult", data);
  } catch (error) {
    showError("registerResult", "Backend connection failed.");
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("loginResult", "Please enter email and password.");
    return;
  }

  showLoading("loginResult", "Verifying credentials...");

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("sentinel_token", data.access_token);
      localStorage.setItem("sentinel_user", JSON.stringify(data.user));

      showObjectResult("loginResult", {
        message: "Login successful",
        status: "Redirecting..."
      });

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      showObjectResult("loginResult", data);
    }
  } catch (error) {
    showError("loginResult", "Unable to connect to backend.");
  }
}

function logoutUser() {
  localStorage.removeItem("sentinel_token");
  localStorage.removeItem("sentinel_user");

  window.location.href = "login.html";
}

function protectDashboard() {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  const token = localStorage.getItem("sentinel_token");

  if (isDashboard && !token) {
    window.location.href = "login.html";
  }
}

protectDashboard();

function showSection(sectionId, button) {
  const sections = document.querySelectorAll(".tool-section");
  const buttons = document.querySelectorAll(".menu-btn");

  sections.forEach(section => section.classList.remove("active-section"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(sectionId).classList.add("active-section");
  button.classList.add("active");
}

function saveLatestReport(type, data) {
  latestReports[type] = {
    project: "SentinelForge",
    module: type,
    generated_at: new Date().toLocaleString(),
    report: data
  };
}

function getModuleTitle(type) {
  if (type === "password") return "Password Intelligence Security Report";
  if (type === "scanner") return "Vulnerability Scanner Security Report";
  if (type === "phishing") return "AI Phishing Detection Security Report";
  return "SentinelForge Security Report";
}

function getExecutiveSummary(type, data) {
  if (type === "password") {
    return `This report evaluates the strength of the submitted password using security checks such as length, uppercase/lowercase usage, numbers, special characters, entropy, and estimated crack time. The password has been classified as ${data.strength}.`;
  }

  if (type === "scanner") {
    return `This report summarizes the vulnerability scan performed on ${data.target}. The scan checked ports ${data.port_range} and found ${data.open_ports_count} open port(s). The overall risk level is ${data.overall_risk}.`;
  }

  if (type === "phishing") {
    return `This report analyzes the submitted message using an AI-based phishing detection model. The message was classified as ${data.prediction} with ${data.confidence}% confidence.`;
  }

  return "This report summarizes the security analysis performed by SentinelForge.";
}

function getRecommendations(type, data) {
  if (type === "password") {
    if (data.suggestions && data.suggestions.length > 0) {
      return data.suggestions;
    }

    return [
      "Use unique passwords for every account.",
      "Avoid reusing old passwords.",
      "Enable multi-factor authentication wherever possible."
    ];
  }

  if (type === "scanner") {
    if (data.open_ports && data.open_ports.length > 0) {
      return data.open_ports.map(port => {
        return `Port ${port.port} (${port.service}): ${port.recommendation}`;
      });
    }

    return [
      "No open ports were detected in the selected range.",
      "Continue monitoring exposed services regularly.",
      "Avoid exposing development services publicly."
    ];
  }

  if (type === "phishing") {
    if (data.risk_level === "High") {
      return [
        "Do not click links or download attachments from this message.",
        "Verify the sender identity using an official communication channel.",
        "Report the message to the security/admin team.",
        "Delete the message if it is confirmed as suspicious."
      ];
    }

    return [
      "The message appears low-risk, but continue verifying unknown links.",
      "Do not share passwords, OTPs, or financial details through email.",
      "Use email security filters and multi-factor authentication."
    ];
  }

  return [
    "Review the analysis carefully.",
    "Apply the recommended security actions."
  ];
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addKeyValue(doc, key, value, y) {
  doc.setFont("helvetica", "bold");
  doc.text(`${key}:`, 20, y);

  doc.setFont("helvetica", "normal");
  const valueText = String(value);
  return addWrappedText(doc, valueText, 70, y, 120, 7);
}

function downloadReport(type) {
  const reportWrapper = latestReports[type];

  if (!reportWrapper) {
    alert("Please run the analysis first before downloading the PDF report.");
    return;
  }

  const data = reportWrapper.report;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 18;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SentinelForge", 20, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Cybersecurity & Threat Analysis Platform", 20, 23);

  y = 45;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(getModuleTitle(type), 20, y);

  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated On: ${reportWrapper.generated_at}`, 20, y);

  y += 14;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Executive Summary", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(45, 45, 45);
  y = addWrappedText(
    doc,
    getExecutiveSummary(type, data),
    20,
    y,
    170,
    7
  );

  y += 8;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Analysis Details", 20, y);

  y += 9;

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);

  if (type === "password") {
    y = addKeyValue(doc, "Password Length", data.password_length, y);
    y = addKeyValue(doc, "Strength", data.strength, y + 2);
    y = addKeyValue(doc, "Score", data.score, y + 2);
    y = addKeyValue(doc, "Entropy", data.entropy, y + 2);
    y = addKeyValue(doc, "Estimated Crack Time", data.estimated_crack_time, y + 2);
  }

  if (type === "scanner") {
    y = addKeyValue(doc, "Target", data.target, y);
    y = addKeyValue(doc, "Scan Time", data.scan_time, y + 2);
    y = addKeyValue(doc, "Port Range", data.port_range, y + 2);
    y = addKeyValue(doc, "Open Ports Count", data.open_ports_count, y + 2);
    y = addKeyValue(doc, "Overall Risk", data.overall_risk, y + 2);

    if (data.open_ports && data.open_ports.length > 0) {
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Detected Open Ports:", 20, y);
      y += 8;

      data.open_ports.forEach(port => {
        y = addKeyValue(
          doc,
          `Port ${port.port}`,
          `${port.service} | Risk: ${port.risk}`,
          y
        );
      });
    }
  }

  if (type === "phishing") {
    y = addKeyValue(doc, "Prediction", data.prediction, y);
    y = addKeyValue(doc, "Confidence", `${data.confidence}%`, y + 2);
    y = addKeyValue(doc, "Risk Level", data.risk_level, y + 2);
    y = addKeyValue(doc, "Legitimate Probability", `${data.probability.legitimate}%`, y + 2);
    y = addKeyValue(doc, "Phishing Probability", `${data.probability.phishing}%`, y + 2);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Analyzed Message:", 20, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, data.message, 20, y, 170, 7);
  }

  y += 12;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Recommendations", 20, y);

  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(45, 45, 45);

  const recommendations = getRecommendations(type, data);

  recommendations.forEach((rec, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    y = addWrappedText(
      doc,
      `${index + 1}. ${rec}`,
      20,
      y,
      170,
      7
    );

    y += 3;
  });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Generated by SentinelForge | This report is for educational and authorized security assessment purposes.",
    20,
    287
  );

  doc.save(`SentinelForge-${type}-Security-Report.pdf`);
}

async function analyzePassword() {
  const password = document.getElementById("passwordInput").value;

  if (!password) {
    showError("passwordResult", "Please enter a password.");
    return;
  }

  showLoading("passwordResult", "Analyzing password intelligence...");

  try {
    const res = await fetch(`${API}/api/password/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password
      })
    });

    const data = await res.json();

    saveLatestReport("password", data);
    showObjectResult("passwordResult", data);
  } catch (error) {
    showError("passwordResult", "Unable to connect to backend.");
  }
}

async function scanTarget() {
  const target = document.getElementById("targetInput").value;
  const start_port = Number(document.getElementById("startPort").value);
  const end_port = Number(document.getElementById("endPort").value);

  if (!target) {
    showError("scanResult", "Please enter target.");
    return;
  }

  showLoading("scanResult", "Scanning target ports...");

  try {
    const res = await fetch(`${API}/api/vulnerability/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target,
        start_port,
        end_port
      })
    });

    const data = await res.json();

    saveLatestReport("scanner", data);
    showObjectResult("scanResult", data);
  } catch (error) {
    showError("scanResult", "Unable to connect to backend.");
  }
}

async function detectPhishing() {
  const message = document.getElementById("messageInput").value;

  if (!message) {
    showError("phishingResult", "Please paste a message.");
    return;
  }

  showLoading("phishingResult", "Running AI phishing analysis...");

  try {
    const res = await fetch(`${API}/api/phishing/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message
      })
    });

    const data = await res.json();

    saveLatestReport("phishing", data);
    showObjectResult("phishingResult", data);
  } catch (error) {
    showError("phishingResult", "Unable to connect to backend.");
  }
}
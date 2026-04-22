// English lesson content — Module 22: Automation with AI | Module 23: Cybersecurity for Developers

export const LESSON_CONTENT_EN_MODULE22_23: Record<string, string> = {

  // ===== MODULE 22 — Automation with AI =====

  "22-1": `# What is AI Automation and Why You Need It

Imagine this: every morning you check 5 competitor websites, copy new articles, translate them, write a summary, and send it to yourself in Telegram. Done manually — 2 hours. With automation — 0 minutes, it all happens on its own.

That's AI automation: you set up the system once, and it works without you.

## Why Automation + AI Is the Next Level

In the past, automation was simple: "if an email arrives with subject X — move it to folder Y." Mechanical rules with no understanding of meaning.

Now AI adds intelligence:
- **Understanding** — AI reads text and comprehends what it's about
- **Generation** — creates new content from templates
- **Classification** — sorts data by meaning, not keywords
- **Decision-making** — chooses actions based on context

Example: old automation could "forward email if subject contains 'urgent'". New automation: "if customer email contains a complaint, create a support ticket, classify by priority, and notify the right manager."

## Three Layers of Automation

    Layer 1 — Triggers:    What starts the process?
                           (new email, time, spreadsheet change, webhook)

    Layer 2 — Processing:  What happens to the data?
                           (AI analyzes, transforms, makes a decision)

    Layer 3 — Actions:     What's the outcome?
                           (send message, create record, update database)

## Automation Tools in 2025

**No-code (visual):**
- **n8n** — open-source, self-hostable, powerful AI integration
- **Make (Integromat)** — clean visual interface, many connectors
- **Zapier** — most popular but expensive
- **Activepieces** — open-source Zapier alternative

**Low-code / Code:**
- **Python scripts** — maximum control
- **Claude Code** — agent that writes and runs automations itself
- **Pipedream** — serverless automations with code

## What You Can Automate Right Now

**Marketing and content:**
- Monitor brand mentions → AI reply on social media
- RSS feed → daily digest in Telegram/Slack
- New reviews → classification and response

**Business processes:**
- Incoming leads → CRM + manager notification
- Invoice paid → product access granted
- Client hasn't paid in 30 days → reminder sequence

**Development:**
- New commit → run tests → notify team
- Error in logs → create Jira ticket
- PR approved → deploy to staging

**Personal productivity:**
- Morning news digest with AI summary
- Auto-sort email with AI classification
- Reminders based on task content

## Practical Assignment

1. Write down 3 routine tasks you do every week
2. For each: define trigger, what needs processing, expected output
3. Sign up at n8n.io (free cloud tier)
4. Browse the template gallery — find at least one similar to your task

> **Key insight:** Automation doesn't take work away from people. It takes away the boredom, leaving time for what requires real thinking.`,

  "22-2": `# n8n — Powerful No-Code Automation with AI

n8n (pronounced "n-eight-n") is an open-source automation platform many call "the best tool nobody knows about." It's free to self-host, has a built-in AI node, and 400+ integrations.

## Why n8n

Comparison with competitors:

    Zapier:    convenient, but $99+/month at serious usage
    Make:      cheaper, but operation limits apply
    n8n:       free (self-host), unlimited runs, AI built-in

For developers, n8n is especially appealing: write JavaScript inside nodes, store workflows in Git, deploy to your own server.

## Key Concepts in n8n

**Workflow** — a visual diagram of nodes connected by arrows.

**Node** — a single block performing one action:
- Trigger nodes — start the workflow
- Action nodes — do something
- Logic nodes — conditions, loops, branching
- AI nodes — work with language models

**Execution** — one run of the workflow from start to finish.

**Credentials** — encrypted storage for API keys and passwords.

## First Workflow: RSS Monitoring + AI Summary to Telegram

Let's build: check an RSS feed every 2 hours, if there are new articles — ask AI to write a 2-3 line summary and send to Telegram.

**Step 1 — Trigger: RSS Feed**
- Add "RSS Feed Read" node
- URL: any RSS feed (e.g., a tech news site)
- Polling interval: every 2 hours

**Step 2 — AI Summary**
- Add "AI Agent" or "Anthropic" node
- Model: claude-haiku-4-5 (fast and cheap)
- Prompt:
  \`\`\`
  Summarize this article in 2-3 sentences.
  Title: {{ $json.title }}
  Description: {{ $json.contentSnippet }}
  \`\`\`

**Step 3 — Send to Telegram**
- Add "Telegram" node
- Operation: Send Message
- Chat ID: your chat_id (get via @userinfobot)
- Text:
  \`\`\`
  📰 *{{ $json.title }}*

  {{ $('AI Agent').item.json.text }}

  🔗 {{ $json.link }}
  \`\`\`

## Expressions and Data Transformation

n8n uses \`{{ }}\` syntax for dynamic data:

\`\`\`javascript
// Current date
{{ $now.toFormat('MM/dd/yyyy') }}

// Data from previous node
{{ $json.fieldName }}

// Data from a specific node
{{ $('Node Name').item.json.field }}

// JavaScript expression
{{ $json.price * 1.2 }}

// Conditional
{{ $json.status === 'active' ? 'Active' : 'Inactive' }}
\`\`\`

## Key Automation Patterns

**Split + Merge** — process list items one by one, then collect results.

**Error Handling** — "Error Trigger" node catches failures and sends a notification.

**Wait** — pause in workflow (e.g., wait 24 hours before a follow-up).

**Webhook** — receive incoming POST requests from any service.

## Self-hosting n8n in 10 Minutes

\`\`\`bash
# Via Docker (recommended)
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n

# Opens at http://localhost:5678
\`\`\`

For production deployment use Railway, Render, or a VPS with Nginx.

## Practical Assignment

1. Sign up at n8n.cloud (free tier: 5 active workflows)
2. Create a workflow: RSS feed on your topic → Telegram notification
3. Add an AI node for summarization
4. Set schedule: every 6 hours
5. Run manually ("Test workflow" button) and check the result

> **Key insight:** n8n is like Lego for automations. Each node is a brick. Connect them in any order to build exactly what you need.`,

  "22-3": `# Make (Integromat) — Visual Automation Scenarios

Make is a visual automation platform with the most beautiful interface in the industry. If n8n is more developer-oriented, Make is for everyone who wants to see the process logic as a living diagram.

## Make vs n8n: When to Use Which

| Criteria | Make | n8n |
|----------|------|-----|
| Interface | More beautiful, clearer | More functional |
| Price | Free 1,000 ops/month | Free self-hosted |
| Hosting | Cloud only | Cloud or your server |
| AI integrations | Via HTTP module | Built-in AI nodes |
| Complex logic | Limited | Full JavaScript |
| Quick start | Easier | Slightly harder |

**Choose Make if:** you want a beautiful interface, work with non-technical teammates, 1,000 ops/month is enough.

**Choose n8n if:** you need full control, plan many operations, want self-hosting.

## Key Concepts in Make

**Scenario** — equivalent of a workflow, a visual automation diagram.

**Module** — an action block. Types:
- *Trigger* — starts the scenario
- *Action* — performs an action
- *Search* — looks up data
- *Aggregator* — collects an array into one element
- *Iterator* — splits an array into individual elements

**Bundle** — a data packet passed between modules.

**Operation** — one execution of a module (billed).

## Scenario: Process Google Forms → Notion + Email

A common use case: submission form → automatic processing.

**Architecture:**
\`\`\`
Google Forms (new response)
    ↓
Router (branch by request type)
    ├── Type: "Consultation" → Notion (add record) → Gmail (email to client)
    └── Type: "Project" → Notion (different DB) → Telegram (notify team)
\`\`\`

**Setting up Router:**
Router splits the flow into multiple branches. For each branch you set a filter — the condition under which data goes that way.

**Adding AI (via HTTP module):**
Make doesn't have built-in AI, but you can connect the Anthropic API directly:
\`\`\`
HTTP Module → Make a Request
Method: POST
URL: https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {{your API key}}
  anthropic-version: 2023-06-01
  Content-Type: application/json
Body:
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 300,
  "messages": [{
    "role": "user",
    "content": "Classify this request: {{1.answers.question_text}}"
  }]
}
\`\`\`

## Data Processing Tools in Make

**Array Aggregator** — collects several bundles into one array.
Example: received 10 new emails → formed one digest → sent.

**Text Aggregator** — combines text from multiple bundles.

**Make functions:**
\`\`\`
{{formatDate(now; "MM/DD/YYYY")}}
{{upper(1.name)}}
{{if(1.status = "active"; "Active"; "Inactive")}}
{{length(1.items)}}
\`\`\`

## Error Handling and Retries

Make automatically retries a module on error. Settings:
- **Max number of attempts** — how many times to try
- **Interval between attempts** — pause between retries
- **Break directive** — skip the bundle with error

**Error handler route** — a special branch that only fires on error. Use for team notifications.

## Webhooks in Make

Webhook — a URL that receives data from any service:
1. Add "Webhooks → Custom webhook" module
2. Copy the generated URL
3. Paste this URL into any service (Stripe, GitHub, Shopify...)
4. Data automatically arrives in your scenario

## Practical Assignment

1. Sign up at make.com (free)
2. Create a Google Form with: name, email, request type, description fields
3. Build a scenario:
   - Trigger: new Google Forms response
   - Action: add row to Google Sheets
   - Action: send yourself an email with the form data
4. Activate the scenario and fill in the form — verify it all works

> **Key insight:** Make makes processes visible. When you see the scenario diagram — you immediately understand the business logic. That's more valuable than just "everything works automatically."`,

  "22-4": `# Python + AI: Automation for Those Who Want Control

No-code tools are convenient, but they have a ceiling. When you need non-standard logic, file operations, complex computations, or APIs without a ready connector — it's time for Python.

And here AI changes everything: now anyone who can explain what they need can write Python automation scripts.

## Why Python for Automation

\`\`\`python
# What takes 2 hours manually:
# - Download Excel report
# - Find relevant rows
# - Calculate metrics
# - Send to Slack

# Becomes 30 lines of code:
import pandas as pd
import anthropic
from slack_sdk import WebClient

# 1. Load data
df = pd.read_excel("report.xlsx")

# 2. Filter
problems = df[df["status"] == "error"]

# 3. AI analysis
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=500,
    messages=[{
        "role": "user",
        "content": f"Analyze these errors and suggest fixes:\\n{problems.to_string()}"
    }]
)

# 4. Send to Slack
slack = WebClient(token="xoxb-...")
slack.chat_postMessage(
    channel="#alerts",
    text=message.content[0].text
)
\`\`\`

## Pattern: Automation Script with Claude

Classic Python automation script structure with AI:

\`\`\`python
import anthropic
import os
from typing import Any

def process_with_ai(data: Any, task: str) -> str:
    """Sends data to Claude and gets the result"""
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",  # fast and cheap for automation
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"{task}\\n\\nData:\\n{data}"
            }
        ]
    )
    return message.content[0].text

def main():
    # Get data (from file, API, database...)
    raw_data = fetch_data()

    # Process with AI
    result = process_with_ai(raw_data, "Classify and summarize")

    # Do something with result
    save_or_send(result)

if __name__ == "__main__":
    main()
\`\`\`

## Task Scheduler: Running on a Schedule

**Windows (Task Scheduler):**
\`\`\`
1. Win+R → taskschd.msc
2. Create Basic Task
3. Trigger: on schedule (e.g., daily at 9:00 AM)
4. Action: start a program
   Program: python
   Arguments: C:\\scripts\\my_automation.py
\`\`\`

**Linux/Mac (cron):**
\`\`\`bash
# Open crontab
crontab -e

# Run every day at 9:00 AM
0 9 * * * /usr/bin/python3 /home/user/scripts/automation.py

# Every hour
0 * * * * python3 /path/to/script.py

# Every 5 minutes
*/5 * * * * python3 /path/to/script.py
\`\`\`

## Real Example: Competitor Monitoring

\`\`\`python
import anthropic
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

COMPETITORS = [
    "https://competitor1.com/pricing",
    "https://competitor2.com/pricing",
]

def scrape_page(url: str) -> str:
    """Scrapes text from a page"""
    try:
        response = requests.get(url, timeout=10,
                               headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, "html.parser")
        for script in soup(["script", "style"]):
            script.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Error: {e}"

def analyze_pricing(page_text: str, url: str) -> dict:
    """AI analyzes the pricing page"""
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""Extract pricing info from this page.
Return JSON: {{"plans": [{{"name": "", "price": "", "features": []}}]}}

Page content: {page_text}"""
        }]
    )

    try:
        return json.loads(message.content[0].text)
    except:
        return {"raw": message.content[0].text}

def send_report(results: list):
    """Send report (Telegram, email, or Slack)"""
    report = f"🔍 Competitor Monitor — {datetime.now().strftime('%m/%d/%Y')}\\n\\n"
    for item in results:
        report += f"**{item['url']}**\\n{json.dumps(item['data'], indent=2)}\\n\\n"
    print(report)  # or send via Telegram Bot API

def main():
    results = []
    for url in COMPETITORS:
        text = scrape_page(url)
        data = analyze_pricing(text, url)
        results.append({"url": url, "data": data})

    send_report(results)

if __name__ == "__main__":
    main()
\`\`\`

## Working with Files and Folders

\`\`\`python
import os
import anthropic
from pathlib import Path

def process_documents(folder: str):
    """Processes all .txt files in folder using AI"""
    client = anthropic.Anthropic()
    folder_path = Path(folder)

    for file_path in folder_path.glob("*.txt"):
        content = file_path.read_text(encoding="utf-8")

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": f"Summarize in 3 sentences:\\n{content}"
            }]
        )

        summary = message.content[0].text
        output_path = folder_path / f"{file_path.stem}_summary.txt"
        output_path.write_text(summary, encoding="utf-8")
        print(f"✓ {file_path.name} → {output_path.name}")
\`\`\`

## Practical Assignment

1. Install required libraries:
   \`\`\`bash
   pip install anthropic requests beautifulsoup4 python-dotenv
   \`\`\`
2. Create a \`.env\` file with \`ANTHROPIC_API_KEY=your_key\`
3. Write a script that:
   - Reads a list of 3-5 URLs (news sites / blogs)
   - Scrapes the first paragraph of each page
   - Asks Claude to write a 1-2 sentence summary
   - Prints the result to console
4. Run the script and confirm it works

> **Key insight:** Python isn't about syntax. It's about explaining what you need to Claude and having it write the script. Your job is to understand what needs to be done. Code is AI's job.`,

  "22-5": `# Real Automation Use Cases: Templates and Examples

Theory without practice is nothing. This lesson covers concrete automation scenarios used by real businesses and freelancers right now.

## Use Case 1: AI Receptionist for Small Business

**Problem:** Clients message on Telegram/WhatsApp asking questions (hours, prices, booking). Answering manually — you lose leads.

**Solution:**
\`\`\`
Incoming Telegram message
    ↓
n8n Webhook (receives message)
    ↓
Anthropic Claude (responds from knowledge base)
    ↓
Telegram Bot (sends reply)
    ↓
If question about booking → Google Calendar (creates slot)
\`\`\`

**System prompt for AI:**
\`\`\`
You are a polite receptionist at "FitLife" fitness club.
Hours: Mon-Fri 7AM-10PM, Sat-Sun 9AM-8PM.
Pricing: 1-month membership $50, 3-month $120, annual $400.
Trial class booking: https://...

Answer briefly and to the point. If the question is not about
the club, say you can only help with club-related questions.
\`\`\`

**Result:** 80% of requests handled automatically; manager only sees conversations that need human attention.

## Use Case 2: Team Digest

**Problem:** Team gets lost in the information flow — Slack, email, GitHub, Jira. Hard to know what happened overnight.

**Solution:** Daily AI digest at 9:00 AM:

\`\`\`python
import anthropic
from datetime import datetime

def collect_updates():
    updates = []

    # GitHub: new PRs and issues
    updates.append(get_github_updates())

    # Jira: tasks that changed status
    updates.append(get_jira_updates())

    # Important emails
    updates.append(get_email_summaries())

    return "\\n".join(updates)

def create_digest(updates: str) -> str:
    client = anthropic.Anthropic()
    today = datetime.now().strftime("%B %d")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{
            "role": "user",
            "content": f"""Create a morning team digest for {today}.
Structure: 🔴 Urgent | 🟡 Important | ✅ Done yesterday | 📌 For today

Data from last 24 hours:
{updates}"""
        }]
    )
    return message.content[0].text

# Run every day at 8:50 AM via cron
if __name__ == "__main__":
    updates = collect_updates()
    digest = create_digest(updates)
    send_to_slack("#general", digest)
\`\`\`

## Use Case 3: Incoming Lead Processing

**For freelancers and agencies:**

\`\`\`
Email with inquiry
    ↓
Make (trigger: new email with specific subject)
    ↓
Claude (classifies: project type, budget, urgency)
    ↓
Router:
  ├── Budget > $5,000 → create in CRM + personal notification
  ├── Standard inquiry → add to Notion + auto-reply
  └── Spam/irrelevant → archive
\`\`\`

**Classification prompt:**
\`\`\`
Analyze this client inquiry and return JSON:
{
  "project_type": "website|app|bot|design|other",
  "estimated_budget": "low(<1k)|medium(1k-5k)|high(>5k)|unknown",
  "urgency": "asap|normal|flexible",
  "is_spam": true/false,
  "summary": "2 sentence summary"
}

Email: [email text]
\`\`\`

## Use Case 4: Content Pipeline

**For bloggers and marketers:**

\`\`\`
Once a week: Google Sheets (topic list)
    ↓
Claude (writes article draft on the topic)
    ↓
Claude (creates 5 headline variants)
    ↓
Claude (writes 3 intro variants for A/B test)
    ↓
Google Docs (creates document with content)
    ↓
Telegram (notifies editor with document link)
\`\`\`

Once a week — 5 articles ready for editor review.

## Use Case 5: Competitor Price Monitoring

\`\`\`python
# Runs every night at 2:00 AM
# If prices changed — notification in the morning

import json

PREVIOUS_DATA = {}

def check_and_notify(current_data: dict):
    changes = []

    for competitor, prices in current_data.items():
        if competitor in PREVIOUS_DATA:
            old = PREVIOUS_DATA[competitor]
            if old != prices:
                changes.append(f"⚠️ {competitor}: {old} → {prices}")

    if changes:
        analysis = analyze_changes_with_ai(changes)
        send_telegram_alert(analysis)

    save_to_json(current_data)
\`\`\`

## Top 10 Automations to Start With

1. **RSS → Telegram digest** (15 min setup)
2. **Lead form → CRM + email** (30 min)
3. **GitHub PR → Slack notification** (10 min)
4. **Weekly Google Analytics report** (45 min)
5. **AI FAQ chatbot** (60 min)
6. **Brand mention monitoring** (60 min)
7. **Email auto-sorting with AI** (45 min)
8. **Content plan from keyword list** (30 min)
9. **Notion data export to Google Sheets** (20 min)
10. **Auto-reminders for overdue tasks** (30 min)

## Practical Assignment

Pick one of the 10 use cases above and implement it:
1. Choose a tool (n8n / Make / Python)
2. Sketch the flow on paper: trigger → processing → action
3. Build the minimal version without AI
4. Add the AI step
5. Test with real data

> **Key insight:** The most useful automation is one that solves a real pain point. Start small: find one task you do manually every week — and automate it.`,

  // ===== MODULE 23 — Cybersecurity for Developers =====

  "23-1": `# Cybersecurity Basics for Vibe Coders

You're building real products. They'll store user data, handle payments, run on the internet. One missed security bug can cost you reputation, money, and user trust.

This module won't make you a penetration tester. It will give you the mindset of a security-conscious developer: understanding threats, knowing how to write secure code, and being able to audit your own project for major vulnerabilities.

## Why Security Matters Right Now

Stats you should care about:
- 43% of cyberattacks target small businesses
- Average cost of a data breach: $4.45 million (IBM, 2023)
- 74% of breaches involve human error
- Average time to detect an attack: 277 days

Most importantly: **most attacks exploit known vulnerabilities that could have been prevented**.

## Main Threat Types

**Injection**
Attacker inserts their code into an application request:
\`\`\`
# Vulnerable SQL query:
query = "SELECT * FROM users WHERE name = '" + user_input + "'"

# Attack: user_input = "'; DROP TABLE users; --"
# Result: database destroyed

# Defense — parameterized queries:
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
\`\`\`

**Broken Authentication**
Weak passwords, no 2FA, insecure session storage.

**Exposed Data**
Sending passwords in plaintext, logs with sensitive data, public S3 buckets.

**XSS (Cross-Site Scripting)**
Injecting scripts into pages visible to other users.

**SSRF (Server-Side Request Forgery)**
Making the server request internal resources.

## Threat Modeling: Think Like an Attacker

Before building defenses — understand what you're defending against:

**Threat analysis questions:**
1. What data does my app store? (passwords, payment data, personal info)
2. Who is my potential attacker? (script kiddie, competitor, insider)
3. What happens if data leaks?
4. What are the entry points? (API, forms, file uploads)
5. What is the most valuable asset to protect?

**Example assets and their threats:**

| Asset | Threat | Defense |
|-------|--------|---------|
| User passwords | DB breach | bcrypt/argon2 hashing |
| API keys | Code leak | .env files, secrets manager |
| Payment data | Interception | HTTPS, don't store cards |
| Personal data | GDPR violation | Encryption, data minimization |

## Principles of Secure Development

**1. Defence in Depth**
Don't rely on a single protection layer. Even if one level is breached — others should hold.

**2. Least Privilege**
Every component should have only the rights it needs. Database — only SELECT/INSERT, not DROP.

**3. Fail Secure**
On error — deny access, don't allow it.
\`\`\`python
# Wrong:
try:
    check_permission(user)
    allow_access()
except:
    allow_access()  # Error → let them in? No!

# Right:
try:
    if check_permission(user):
        allow_access()
    else:
        deny_access()
except:
    deny_access()  # Error → deny
\`\`\`

**4. Input Validation**
Never trust user-provided data. Always validate.

**5. Security by Design**
Security isn't a plugin you add at the end. It's built in from the first line of code.

## AI as a Security Assistant

Claude is great for security code review:
\`\`\`
Prompt: "Review this code for OWASP Top 10 vulnerabilities.
For each vulnerability found, show:
1. Vulnerability type
2. Where it's located
3. How it could be exploited (general principle only)
4. Fixed version of the code

Code: [paste code]"
\`\`\`

## Practical Assignment

1. Take any of your projects (or create a simple Express/Flask app)
2. Answer the 5 threat modeling questions for it
3. Ask Claude to review the most complex file for vulnerabilities
4. Fix at least one issue found

> **Key insight:** Security isn't paranoia. It's professionalism. Users entrust you with their data. That trust must be earned and maintained.`,

  "23-2": `# OWASP Top 10 — The Most Critical Web Application Vulnerabilities

OWASP (Open Web Application Security Project) is an international organization that publishes the 10 most dangerous web application vulnerabilities annually. This is the industry standard — know these 10 points and you're protected from most real-world attacks.

## A01: Broken Access Control

The most common vulnerability. A user gains access to something they shouldn't see.

**Attack example:**
\`\`\`
# Profile URL: /api/user/123/profile
# Attacker changes to: /api/user/456/profile
# Without permission check — sees another user's profile
\`\`\`

**Defense:**
\`\`\`javascript
// Always verify the user has rights to the resource
app.get('/api/user/:id/profile', authenticate, (req, res) => {
  // Check that URL id matches the token id
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  // Only now return data
});
\`\`\`

## A02: Cryptographic Failures

Using weak encryption or storing data in plaintext.

**Common mistakes:**
- Storing passwords as MD5 (cracked instantly)
- HTTP instead of HTTPS
- Weak secret keys

**Correct password storage:**
\`\`\`python
# NEVER do this:
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()

# Correct — bcrypt or argon2:
import bcrypt
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Verification:
bcrypt.checkpw(input_password.encode(), stored_hash)
\`\`\`

## A03: Injection

SQL, NoSQL, OS Command, LDAP injections.

\`\`\`python
# Vulnerable:
cursor.execute(f"SELECT * FROM products WHERE id = {product_id}")

# Secure:
cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))

# ORM automatically protects:
Product.objects.filter(id=product_id)  # Django is safe
\`\`\`

## A04: Insecure Design

Architectural decisions that make the system inherently vulnerable.

**Example:** "guess the 4-digit PIN" feature. Without attempt limits — all 10,000 combinations can be tried in seconds.

**Solution:** Rate limiting on all critical endpoints.
\`\`\`javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: 'Too many login attempts. Try again in 15 minutes.'
});

app.post('/api/auth/login', loginLimiter, loginHandler);
\`\`\`

## A05: Security Misconfiguration

Default settings are often insecure:
- Debug mode enabled in production
- Open directory listings
- Default credentials (admin/admin)
- Excessive permissions

**Configuration checklist:**
\`\`\`
□ DEBUG=False in production
□ Default accounts removed
□ CORS restricted to necessary domains
□ Security HTTP headers added
□ Directory listing disabled
□ Software version hidden from headers
\`\`\`

## A06: Vulnerable Components

Using libraries with known vulnerabilities.

\`\`\`bash
# Check Node.js project:
npm audit

# Check Python project:
pip install safety
safety check

# GitHub automatically creates Dependabot alerts
\`\`\`

## A07: Authentication Failures

**Weak spots:**
- No lockout after N failed attempts
- Weak password policy
- No 2FA for critical operations
- Insecure "Forgot password"

**Secure JWT:**
\`\`\`javascript
// Short access token lifetime
const accessToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }  // 15 minutes, not a week!
);

// Refresh token for renewal
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

## A08: Integrity Failures

Loading code or data without signature/origin verification.

\`\`\`javascript
// DANGEROUS: eval with user data
eval(userInput);

// DANGEROUS: deserialize without validation
const data = JSON.parse(untrustedData);

// Use package-lock.json and verify integrity hashes
\`\`\`

## A09: Logging & Monitoring Failures

Without logging you don't know what's happening.

\`\`\`python
import logging

# Successful login
logging.info(f"Login: user={user.id} ip={request.remote_addr}")

# Failed login (careful — don't log the password!)
logging.warning(f"Failed login: email={email} ip={request.remote_addr}")

# Suspicious activity
logging.critical(f"Multiple failed logins: ip={request.remote_addr} count={attempts}")

# Important: NEVER log passwords, tokens, card data!
\`\`\`

## A10: SSRF (Server-Side Request Forgery)

Server makes a request to an arbitrary URL provided by the attacker.

\`\`\`python
# Vulnerable — server fetches any URL:
def fetch_preview(url: str):
    return requests.get(url).text

# Attack: url = "http://169.254.169.254/metadata" (AWS metadata service)

# Defense — domain whitelist:
ALLOWED_DOMAINS = ["api.trusted-service.com", "cdn.myapp.com"]

def fetch_preview(url: str):
    from urllib.parse import urlparse
    parsed = urlparse(url)
    if parsed.hostname not in ALLOWED_DOMAINS:
        raise ValueError("Domain not allowed")
    return requests.get(url).text
\`\`\`

## Practical Assignment

1. Take any of your projects
2. Go through the A01-A10 checklist
3. Find at least 2-3 potential issues
4. Ask Claude: "Review this code for OWASP Top 10 vulnerabilities"
5. Fix the issues found

> **Key insight:** OWASP Top 10 isn't a list of scary stories. It's an action plan. Know the list — know what to check in every project.`,

  "23-3": `# API Security and Authentication

APIs are the gateway to your application. If they're poorly protected, nothing else matters. This lesson covers practical patterns for secure APIs.

## Authentication vs Authorization

Often confused — let's clarify once and for all:

**Authentication (AuthN)** — WHO are you?
- Verification: "Is this really user@example.com?"
- Tools: JWT, OAuth, sessions, API keys

**Authorization (AuthZ)** — WHAT are you allowed to do?
- Verification: "Does this user have the right to delete posts?"
- Tools: RBAC, ABAC, policy-based auth

**Beginner mistake:** implement authentication, forget authorization.
\`\`\`javascript
// Bad: only check if user is logged in
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  await Post.delete(req.params.id); // Anyone can delete others' posts!
});

// Good: check authorization too
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Not your post' });
  }
  await post.delete();
  res.json({ success: true });
});
\`\`\`

## JWT — JSON Web Tokens

The most common authentication method for REST APIs.

**Important JWT rules:**
\`\`\`javascript
// 1. Use a strong secret (minimum 256 bits)
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
// Never hardcode — only from env

// 2. Short lifetime
const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
  expiresIn: '15m',      // Access token: 15 minutes
  issuer: 'myapp.com',
  audience: 'myapp.com'
});

// 3. Validate all fields
const payload = jwt.verify(token, JWT_SECRET, {
  issuer: 'myapp.com',
  audience: 'myapp.com'
});

// 4. Never store JWT in localStorage — use httpOnly cookie
res.cookie('token', token, {
  httpOnly: true,    // JS can't read it
  secure: true,      // HTTPS only
  sameSite: 'strict' // CSRF protection
});
\`\`\`

## API Keys — for Machine-to-Machine Communication

\`\`\`python
import secrets
import hashlib

def generate_api_key() -> tuple[str, str]:
    """Generates pair: raw_key (for user) + hash (for storage)"""
    raw_key = f"vca_{secrets.token_urlsafe(32)}"  # prefix helps identify leaks
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    return raw_key, key_hash

def validate_api_key(raw_key: str, stored_hash: str) -> bool:
    """Validates key without storing plaintext"""
    return secrets.compare_digest(
        hashlib.sha256(raw_key.encode()).hexdigest(),
        stored_hash
    )

# Store only hash in DB, never raw_key
# Show raw_key to user only once at creation
\`\`\`

## Rate Limiting — Brute Force and DDoS Protection

\`\`\`python
from functools import wraps
import time
from collections import defaultdict

request_counts = defaultdict(list)

def rate_limit(max_requests: int, window_seconds: int):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            ip = request.remote_addr
            now = time.time()

            request_counts[ip] = [
                t for t in request_counts[ip]
                if now - t < window_seconds
            ]

            if len(request_counts[ip]) >= max_requests:
                return {"error": "Rate limit exceeded"}, 429

            request_counts[ip].append(now)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

# For production — use Redis + library
# npm: express-rate-limit
# Python: slowapi, flask-limiter
\`\`\`

## CORS — Cross-Origin Resource Sharing

\`\`\`javascript
// Dangerous config (opens API to everyone):
app.use(cors()); // NEVER in production!

// Correct config:
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));
\`\`\`

## Security Headers — Required HTTP Headers

\`\`\`javascript
// Helmet.js for Express:
const helmet = require('helmet');
app.use(helmet());

// What Helmet adds:
// Content-Security-Policy: prevents XSS
// X-Frame-Options: clickjacking protection
// X-Content-Type-Options: no MIME sniffing
// Referrer-Policy: referrer control
// Strict-Transport-Security: HTTPS only

// Check your headers: https://securityheaders.com
\`\`\`

## Input Validation

\`\`\`typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(18).max(120),
});

app.post('/api/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues
    });
  }

  const validatedData = result.data;
  createUser(validatedData);
});
\`\`\`

## Practical Assignment

1. Take your API project
2. Check:
   - Is there authorization (not just authentication) on all endpoints?
   - Is JWT stored in an httpOnly cookie or still in localStorage?
   - Is there rate limiting on login/register?
   - Is CORS configured correctly?
3. Install helmet (Node.js) or equivalent and add security headers
4. Ask Claude: "Find authentication and authorization issues in this code"

> **Key insight:** A secure API isn't "add a few checks." It's an architectural decision: deny by default, validate everything, trust nothing.`,

  "23-4": `# AI for Security Code Analysis

Claude and other AI models can be used as an intelligent security partner. This doesn't replace specialized tools — but significantly enhances them.

## What AI Can Do in a Security Context

**Strengths:**
- Explain a vulnerability in plain language
- Suggest secure replacement code
- Check logic for semantic errors
- Write security tests
- Create a security checklist for your project

**Weaknesses:**
- May miss complex attack chains
- Doesn't run or test code
- Can make mistakes in specific contexts
- Doesn't know the full application architecture

**Rule:** AI is a smart code reviewer, not a replacement for a penetration tester.

## Prompts for Security Code Review

**Basic audit:**
\`\`\`
Perform a security review of this code. Look for:
1. OWASP Top 10 vulnerabilities
2. Insecure data storage
3. Authentication/authorization issues
4. Injections (SQL, NoSQL, Command)
5. XSS possibilities

For each issue:
- Vulnerability type (name)
- Lines of code where it exists
- How it could be exploited (general principle)
- Fixed code

Code: [paste code]
\`\`\`

**Deep logic analysis:**
\`\`\`
Analyze the authorization logic in this code.
Pretend you're a penetration tester looking for ways
to access other users' resources. What could you do?

Specifically check for:
- Privilege escalation
- IDOR (Insecure Direct Object Reference)
- Bypassing authentication checks
- Race conditions in critical operations

Code: [paste code]
\`\`\`

## Automating Security Checks with AI

\`\`\`python
import anthropic
from pathlib import Path
import json

def security_audit_file(file_path: str) -> dict:
    """Asks Claude to audit a file for security issues"""
    client = anthropic.Anthropic()
    code = Path(file_path).read_text(encoding="utf-8")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""Security audit this code. Return JSON:
{{
  "vulnerabilities": [
    {{
      "type": "vulnerability name",
      "severity": "critical|high|medium|low",
      "line": "line number or range",
      "description": "what's wrong",
      "fix": "fixed code snippet"
    }}
  ],
  "overall_score": 1-10,
  "summary": "brief overall assessment"
}}

Code ({file_path}):
{code}"""
        }]
    )

    try:
        return json.loads(message.content[0].text)
    except json.JSONDecodeError:
        return {"raw_response": message.content[0].text}

def audit_project(src_dir: str):
    """Audits all Python/JS files in a directory"""
    extensions = {".py", ".js", ".ts", ".jsx", ".tsx"}
    issues = []

    for file in Path(src_dir).rglob("*"):
        if file.suffix in extensions and ".git" not in str(file):
            print(f"Auditing: {file}")
            result = security_audit_file(str(file))

            if "vulnerabilities" in result:
                for vuln in result["vulnerabilities"]:
                    if vuln.get("severity") in ("critical", "high"):
                        issues.append({
                            "file": str(file),
                            **vuln
                        })

    return issues

if __name__ == "__main__":
    critical_issues = audit_project("./src")
    print(f"\\n{'='*50}")
    print(f"Found {len(critical_issues)} critical/high severity issues:")
    for issue in critical_issues:
        print(f"\\n⚠️  {issue['file']}")
        print(f"   Type: {issue['type']}")
        print(f"   {issue['description']}")
\`\`\`

## Specialized Tools (Work Alongside AI)

**Static Analysis (SAST):**
\`\`\`bash
# Python: bandit
pip install bandit
bandit -r ./src -ll  # show only medium+ severity

# JavaScript: ESLint security plugin
npm install eslint-plugin-security

# TypeScript/JS: Semgrep (free)
semgrep --config=p/security-audit ./src
\`\`\`

**Dependency scanning:**
\`\`\`bash
# Node.js
npm audit
npm audit fix

# Python
pip install safety
safety check -r requirements.txt

# GitHub: enable Dependabot in repo settings
\`\`\`

**Secrets scanning:**
\`\`\`bash
# truffleHog — finds secrets in code and git history
pip install truffleHog
trufflehog git file://. --only-verified

# gitleaks
gitleaks detect --source . -v
\`\`\`

## CI/CD — Automating Security Checks

\`\`\`yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Bandit (Python)
        run: |
          pip install bandit
          bandit -r . -ll -x ./tests

      - name: Check dependencies
        run: |
          pip install safety
          safety check

      - name: Scan for secrets
        uses: gitleaks/gitleaks-action@v2
\`\`\`

## Real Case Study with AI

A real interaction with Claude during code audit:

**Input:**
\`\`\`python
@app.route('/api/file')
def get_file():
    filename = request.args.get('name')
    path = f"/var/app/files/{filename}"
    return send_file(path)
\`\`\`

**Claude's response:**
\`\`\`
Critical vulnerability: Path Traversal (CWE-22)

Problem: the 'name' parameter is not validated.
Attack: ?name=../../etc/passwd — attacker reads system files.

Fix:
import os
from pathlib import Path

UPLOAD_DIR = Path("/var/app/files").resolve()

@app.route('/api/file')
def get_file():
    filename = request.args.get('name', '')
    safe_path = (UPLOAD_DIR / filename).resolve()

    if not str(safe_path).startswith(str(UPLOAD_DIR)):
        abort(403)

    if not safe_path.exists():
        abort(404)

    return send_file(safe_path)
\`\`\`

## Practical Assignment

1. Install bandit (Python) or eslint-plugin-security (JS)
2. Run on your project: find all warnings
3. Take 3 files with the most issues
4. Ask Claude to explain each problem and suggest a fix
5. Apply the fixes and re-run the scanner

> **Key insight:** AI in security is like a smart partner at code review. It finds obvious issues, explains why they're dangerous, and shows how to fix them. But the final decision is yours.`,

  "23-5": `# Practice: Security Audit of Your Own Project

The final lesson of the module — a complete security audit of a real project. Let's apply everything we've learned to actual code.

## Security Audit Methodology

A professional audit consists of several phases:

\`\`\`
Phase 1: Reconnaissance
  → Understand application architecture
  → Find all entry points (API, forms, file uploads)
  → Map data (what's stored, where, how it's transmitted)

Phase 2: Static Analysis (SAST)
  → Automated scanners (bandit, semgrep)
  → Secrets search in code (gitleaks)
  → Dependency review (npm audit, safety)

Phase 3: Manual Review
  → Check OWASP Top 10 manually
  → AI review of critical files
  → Business logic review

Phase 4: Dynamic Analysis (optional)
  → Test running application
  → OWASP ZAP / Burp Suite Community

Phase 5: Report and Remediation
  → Document findings
  → Prioritize (Critical → High → Medium → Low)
  → Fix and re-verify
\`\`\`

## Security Checklist for Your Project

### Authentication and Authorization
\`\`\`
□ Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
□ JWT has short lifetime (≤15 min for access token)
□ JWT stored in httpOnly cookie (not localStorage)
□ Rate limiting on login/register endpoints
□ All private routes verify authentication
□ All data operations verify authorization (not just auth)
□ No IDOR vulnerabilities (verify resource belongs to user)
\`\`\`

### Data and Storage
\`\`\`
□ .env files in .gitignore
□ No secrets committed to git (check history!)
□ All env variables documented in .env.example
□ Personal data minimized (store only what's needed)
□ Payment data not stored (use Stripe tokens)
□ Sensitive data encrypted in DB
\`\`\`

### API Security
\`\`\`
□ CORS restricted to specific domains
□ Security headers added (helmet or equivalent)
□ Input validation on all endpoints
□ SQL/NoSQL injections eliminated (parameterized queries / ORM)
□ Rate limiting on critical endpoints
□ Errors don't expose internal info (no stack traces)
□ No unused endpoints with access
\`\`\`

### File Uploads
\`\`\`
□ File type validated (not just extension, but MIME)
□ File size limited
□ Files stored outside web root
□ Filenames sanitized (UUID instead of original name)
□ Code execution in upload directory disabled
\`\`\`

### Configuration and Deployment
\`\`\`
□ DEBUG mode off in production
□ HTTPS in use
□ Dependencies updated (no critical CVEs)
□ Logs don't contain sensitive data
□ Errors are logged and monitored
\`\`\`

## Step-by-Step Audit with Tools

### Step 1: Automated Scan

\`\`\`bash
# Python project
pip install bandit safety
bandit -r ./src -f json -o bandit_report.json
safety check --json > safety_report.json

# Node.js project
npm audit --json > npm_audit.json
npx semgrep --config=p/security-audit ./src --json > semgrep_report.json

# Secrets scan (works for any project)
pip install truffleHog
trufflehog git file://. --json > secrets_report.json
\`\`\`

### Step 2: AI Analysis of Critical Files

\`\`\`python
import anthropic
import json
from pathlib import Path

CRITICAL_FILES = [
    "src/auth/login.py",
    "src/api/users.py",
    "src/models/user.py",
    "src/middleware/auth.py",
]

def audit_critical_files():
    client = anthropic.Anthropic()
    report = []

    for filepath in CRITICAL_FILES:
        path = Path(filepath)
        if not path.exists():
            continue

        code = path.read_text(encoding="utf-8")
        print(f"Auditing {filepath}...")

        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": f"""Security audit this file. Focus on:
- Authentication/authorization flaws
- Data exposure risks
- Input validation issues
- Business logic vulnerabilities

Return JSON: {{"file": "{filepath}", "findings": [{{"severity": "", "issue": "", "line": "", "recommendation": ""}}], "score": 1-10}}

Code:
{code}"""
            }]
        )

        try:
            result = json.loads(message.content[0].text)
            report.append(result)
        except:
            report.append({"file": filepath, "raw": message.content[0].text})

    return report

if __name__ == "__main__":
    results = audit_critical_files()
    results.sort(key=lambda x: x.get("score", 10))

    print("\\n=== SECURITY AUDIT REPORT ===")
    for r in results:
        score = r.get("score", "N/A")
        emoji = "🔴" if score <= 4 else "🟡" if score <= 7 else "🟢"
        print(f"\\n{emoji} {r['file']} — Score: {score}/10")
        for finding in r.get("findings", []):
            print(f"   [{finding['severity'].upper()}] {finding['issue']}")
\`\`\`

## Prioritization and Remediation

After audit — prioritize:

| Severity | Action | Timeline |
|----------|--------|----------|
| Critical | Fix immediately, before deploy | Today |
| High | Fix in the next sprint | 1-2 days |
| Medium | Add to backlog | 1-2 weeks |
| Low | Improve during refactoring | When possible |

## Tools for Ongoing Monitoring

**After launch in production:**
- **Sentry** — error and anomaly monitoring
- **Cloudflare** — WAF (Web Application Firewall) on free tier
- **GitHub Dependabot** — automatic PRs for vulnerable dependencies
- **OWASP ZAP** — regular dynamic testing

## Final Practical Assignment

Perform a complete audit of your project:

1. **Automated scan** (bandit/semgrep/npm audit)
   → Document all findings

2. **AI review** of 3-5 critical files
   → Use prompts from lesson 23-4

3. **Checklist** from this lesson
   → Go through each point, mark status

4. **Fix at least 3 findings**
   → Start with Critical/High severity

5. **Document** what you found and fixed
   → One paragraph is enough

> **Key insight:** Security is a process, not an event. One audit doesn't protect you forever. The important thing is to build checks into development: pre-commit hooks, CI/CD scanners, regular reviews. Security becomes a habit.`,
};

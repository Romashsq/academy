// Контент уроков — Модуль 22: Автоматизация с AI | Модуль 23: Кибербезопасность для разработчика

export const LESSON_CONTENT_MODULE22_23: Record<string, string> = {

  // ===== MODULE 22 — Автоматизация с AI =====

  "22-1": `# Что такое автоматизация с AI и зачем она тебе

Представь: каждое утро тебе нужно проверить 5 сайтов конкурентов, скопировать новые статьи, перевести их, составить краткое резюме и отправить себе в Telegram. Вручную — 2 часа. С автоматизацией — 0 минут, всё происходит само.

Это и есть автоматизация с AI: ты один раз настраиваешь систему, дальше она работает без тебя.

## Почему автоматизация + AI — это новый уровень

Раньше автоматизация была простой: «если пришло письмо с темой X — переложи в папку Y». Механические правила без понимания смысла.

Теперь AI добавляет интеллект:
- **Понимание** — AI читает текст и понимает о чём он
- **Генерация** — создаёт новый контент по шаблону
- **Классификация** — сортирует данные по смыслу, не по ключевым словам
- **Принятие решений** — выбирает действие на основе контекста

Пример: старая автоматизация могла «переслать письмо если в теме слово "срочно"». Новая — «если письмо от клиента содержит жалобу, создай тикет в поддержку, классифицируй по приоритету и уведоми нужного менеджера».

## Три слоя автоматизации

    Слой 1 — Триггеры:     Что запускает процесс?
                           (новый email, время, изменение в таблице, webhook)

    Слой 2 — Обработка:    Что происходит с данными?
                           (AI анализирует, трансформирует, принимает решение)

    Слой 3 — Действия:     Что делается в итоге?
                           (отправить сообщение, создать запись, обновить БД)

## Инструменты автоматизации в 2025

**No-code (визуальные):**
- **n8n** — open-source, можно хостить самому, мощная интеграция с AI
- **Make (Integromat)** — удобный визуальный интерфейс, много коннекторов
- **Zapier** — самый популярный, но дорогой
- **Activepieces** — open-source альтернатива Zapier

**Low-code / Code:**
- **Python скрипты** — максимальный контроль
- **Claude Code** — агент который сам пишет и запускает автоматизации
- **Pipedream** — serverless автоматизации с кодом

## Что можно автоматизировать прямо сейчас

**Маркетинг и контент:**
- Мониторинг упоминаний бренда → AI-ответ в соцсетях
- RSS лент → дайджест в Telegram/Slack
- Новые отзывы → классификация и ответ

**Бизнес-процессы:**
- Входящие заявки → CRM + уведомление менеджера
- Счёт оплачен → доступ к продукту открыт
- Клиент не платит 30 дней → серия напоминаний

**Разработка:**
- Новый коммит → запуск тестов → уведомление
- Ошибка в логах → создание тикета в Jira
- PR одобрен → деплой на staging

**Личная продуктивность:**
- Утренний дайджест новостей с AI-суммари
- Автосортировка почты с AI-классификацией
- Напоминания на основе контента задач

## Практическое задание

1. Выпиши 3 рутинных задачи которые ты делаешь каждую неделю
2. Для каждой определи: триггер, что нужно обработать, результат
3. Зарегистрируйся на n8n.io (cloud бесплатный тариф)
4. Посмотри галерею шаблонов — найди хотя бы один похожий на твою задачу

> **Главная мысль:** Автоматизация не отнимает работу у людей. Она отнимает скуку, оставляя время на то, что требует настоящего мышления.`,

  "22-2": `# n8n — мощная no-code автоматизация с AI

n8n (произносится "n-eight-n") — это open-source платформа автоматизации, которую многие называют «лучшим инструментом о котором никто не знает». Она бесплатна для self-hosting, имеет встроенный AI-узел и 400+ интеграций.

## Почему именно n8n

Сравнение с конкурентами:

    Zapier:    удобно, но $99+/мес при серьёзном использовании
    Make:      дешевле, но ограничения по операциям
    n8n:       бесплатно (self-host), безлимитные запуски, AI встроен

Для разработчиков n8n особенно привлекателен: можно писать JavaScript в узлах, хранить код в Git, деплоить на свой сервер.

## Ключевые концепции n8n

**Workflow (рабочий процесс)** — визуальная схема из узлов соединённых стрелками.

**Node (узел)** — отдельный блок, выполняющий одно действие:
- Trigger nodes — запускают workflow
- Action nodes — что-то делают
- Logic nodes — условия, циклы, ветвление
- AI nodes — работа с языковыми моделями

**Execution** — одно выполнение workflow от начала до конца.

**Credentials** — хранилище API-ключей и паролей (зашифровано).

## Первый workflow: мониторинг RSS + AI суммари в Telegram

Создадим простую автоматизацию: каждые 2 часа проверяем RSS ленту, если есть новые статьи — просим AI написать 2-3 строки суммари и отправляем в Telegram.

**Шаг 1 — Trigger: RSS Feed**
- Добавь узел "RSS Feed Read"
- URL: любой RSS (например https://habr.com/ru/rss/hubs/all/)
- Polling interval: каждые 2 часа

**Шаг 2 — AI суммари**
- Добавь узел "AI Agent" или "OpenAI" / "Anthropic"
- Model: claude-haiku-4-5 (быстро и дёшево)
- Промпт:
  \`\`\`
  Summarize this article in 2-3 sentences in Russian.
  Title: {{ $json.title }}
  Description: {{ $json.contentSnippet }}
  \`\`\`

**Шаг 3 — Отправка в Telegram**
- Добавь узел "Telegram"
- Operation: Send Message
- Chat ID: твой chat_id (получить через @userinfobot)
- Text:
  \`\`\`
  📰 *{{ $json.title }}*

  {{ $('AI Agent').item.json.text }}

  🔗 {{ $json.link }}
  \`\`\`

## Выражения и трансформация данных

n8n использует синтаксис \`{{ }}\` для динамических данных:

\`\`\`javascript
// Текущая дата
{{ $now.toFormat('dd.MM.yyyy') }}

// Данные из предыдущего узла
{{ $json.fieldName }}

// Данные из конкретного узла
{{ $('Node Name').item.json.field }}

// JavaScript выражение
{{ $json.price * 1.2 }}

// Условие
{{ $json.status === 'active' ? 'Активен' : 'Неактивен' }}
\`\`\`

## Важные паттерны автоматизации

**Split + Merge** — обработать список элементов по одному, затем собрать результаты.

**Error Handling** — узел "Error Trigger" ловит ошибки и отправляет уведомление.

**Wait** — пауза в workflow (например ждать 24 часа перед follow-up).

**Webhook** — принимать входящие POST запросы от любых сервисов.

## Self-hosting n8n за 10 минут

\`\`\`bash
# Через Docker (рекомендуется)
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n

# Откроется на http://localhost:5678
\`\`\`

Для продакшн деплоя используй Railway, Render или VPS с Nginx.

## Практическое задание

1. Зарегистрируйся на n8n.cloud (бесплатный тариф: 5 активных workflows)
2. Создай workflow: RSS лента твоей темы → Telegram уведомление
3. Добавь узел AI для суммаризации
4. Настрой расписание: каждые 6 часов
5. Запусти вручную (кнопка "Test workflow") и проверь результат

> **Главная мысль:** n8n — это как конструктор Lego для автоматизаций. Каждый узел — кирпичик. Соединяй их в любом порядке и строй то, что тебе нужно.`,

  "22-3": `# Make (Integromat) — визуальные сценарии автоматизации

Make — это визуальная платформа автоматизации с самым красивым интерфейсом в индустрии. Если n8n больше для технарей, то Make — для всех кто хочет видеть логику процесса как живую схему.

## Make vs n8n: когда что выбрать

| Критерий | Make | n8n |
|----------|------|-----|
| Интерфейс | Красивее, нагляднее | Функциональнее |
| Цена | Бесплатно 1000 ops/мес | Бесплатно self-hosted |
| Хостинг | Только cloud | Cloud или свой сервер |
| AI-интеграции | Через HTTP модуль | Встроенные AI узлы |
| Сложная логика | Ограничена | Полный JavaScript |
| Быстрый старт | Проще | Чуть сложнее |

**Выбирай Make если:** нужен красивый интерфейс, работаешь в команде с нетехническими людьми, хватает 1000 операций/месяц.

**Выбирай n8n если:** нужен полный контроль, планируешь много операций, хочешь self-hosting.

## Ключевые понятия Make

**Scenario (сценарий)** — аналог workflow, визуальная схема автоматизации.

**Module (модуль)** — блок действия. Бывают:
- *Trigger* — запускает сценарий
- *Action* — выполняет действие
- *Search* — ищет данные
- *Aggregator* — собирает массив в один элемент
- *Iterator* — разбивает массив на отдельные элементы

**Bundle** — пакет данных, передаваемый между модулями.

**Operation** — одно выполнение модуля (тарифицируется).

## Сценарий: обработка заявок из Google Forms → Notion + Email

Распространённый кейс: форма заявки → автоматическая обработка.

**Архитектура:**
\`\`\`
Google Forms (новый ответ)
    ↓
Router (разветвление по типу заявки)
    ├── Тип: "Консультация" → Notion (добавить запись) → Gmail (письмо клиенту)
    └── Тип: "Проект" → Notion (другая БД) → Telegram (уведомление команды)
\`\`\`

**Настройка Router:**
Router разбивает поток на несколько веток. Для каждой ветки задаёшь фильтр — условие при котором данные идут в эту ветку.

**Добавление AI (через HTTP модуль):**
Make не имеет встроенного AI, но можно подключить Anthropic API напрямую:
\`\`\`
HTTP Module → Make a Request
Method: POST
URL: https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {{твой API ключ}}
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

## Инструменты обработки данных в Make

**Array Aggregator** — собирает несколько бандлов в один массив.
Пример: получил 10 новых email → сформировал один дайджест → отправил.

**Text Aggregator** — объединяет текст из нескольких бандлов.

**Функции Make:**
\`\`\`
{{formatDate(now; "DD.MM.YYYY")}}
{{upper(1.name)}}
{{if(1.status = "active"; "Активен"; "Неактивен")}}
{{length(1.items)}}
\`\`\`

## Обработка ошибок и повторные попытки

Make автоматически повторяет модуль при ошибке. Настройки:
- **Max number of attempts** — сколько раз пробовать
- **Interval between attempts** — пауза между попытками
- **Break directive** — пропустить элемент с ошибкой

**Error handler route** — специальная ветка которая срабатывает только при ошибке. Используй для уведомлений команды.

## Webhooks в Make

Webhook — URL который принимает данные от любого сервиса:
1. Добавь модуль "Webhooks → Custom webhook"
2. Скопируй сгенерированный URL
3. Вставь этот URL в любой сервис (Stripe, GitHub, Shopify...)
4. Данные автоматически приходят в твой сценарий

## Практическое задание

1. Зарегистрируйся на make.com (бесплатно)
2. Создай Google Form с полями: имя, email, тип запроса, описание
3. Построй сценарий:
   - Trigger: новый ответ в Google Forms
   - Action: добавить строку в Google Sheets
   - Action: отправить email себе с данными формы
4. Активируй сценарий и заполни форму — проверь что всё работает

> **Главная мысль:** Make делает процессы видимыми. Когда видишь схему сценария — сразу понимаешь логику бизнеса. Это ценнее чем просто "всё автоматически работает".`,

  "22-4": `# Python + AI: автоматизация для тех кто хочет контроль

No-code инструменты удобны, но у них есть потолок. Когда нужна нестандартная логика, работа с файлами, сложные вычисления или API без готового коннектора — приходит время Python.

И здесь AI меняет всё: теперь писать Python скрипты для автоматизации может любой, кто умеет объяснить что нужно.

## Почему Python для автоматизации

\`\`\`python
# То что занимает 2 часа вручную:
# - Скачать отчёт Excel
# - Найти нужные строки
# - Вычислить метрики
# - Отправить в Slack

# Становится 30 строками кода:
import pandas as pd
import anthropic
from slack_sdk import WebClient

# 1. Загрузка данных
df = pd.read_excel("report.xlsx")

# 2. Фильтрация
problems = df[df["status"] == "error"]

# 3. AI-анализ
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=500,
    messages=[{
        "role": "user",
        "content": f"Analyze these errors and suggest fixes:\\n{problems.to_string()}"
    }]
)

# 4. Отправка в Slack
slack = WebClient(token="xoxb-...")
slack.chat_postMessage(
    channel="#alerts",
    text=message.content[0].text
)
\`\`\`

## Паттерн: скрипт автоматизации с Claude

Классическая структура Python скрипта с AI:

\`\`\`python
import anthropic
import os
from typing import Any

def process_with_ai(data: Any, task: str) -> str:
    """Отправляет данные в Claude и получает результат"""
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",  # быстрый и дешёвый для автоматизации
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"{task}\\n\\nДанные:\\n{data}"
            }
        ]
    )
    return message.content[0].text

def main():
    # Получаем данные (из файла, API, БД...)
    raw_data = fetch_data()

    # Обрабатываем с AI
    result = process_with_ai(raw_data, "Classify and summarize")

    # Делаем что-то с результатом
    save_or_send(result)

if __name__ == "__main__":
    main()
\`\`\`

## Планировщик задач: запуск по расписанию

**Windows (Task Scheduler):**
\`\`\`
1. Win+R → taskschd.msc
2. Создать базовую задачу
3. Триггер: по расписанию (например каждый день в 9:00)
4. Действие: запустить программу
   Программа: python
   Аргументы: C:\\scripts\\my_automation.py
\`\`\`

**Linux/Mac (cron):**
\`\`\`bash
# Открыть crontab
crontab -e

# Запускать каждый день в 9:00
0 9 * * * /usr/bin/python3 /home/user/scripts/automation.py

# Каждый час
0 * * * * python3 /path/to/script.py

# Каждые 5 минут
*/5 * * * * python3 /path/to/script.py
\`\`\`

## Реальный пример: мониторинг конкурентов

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
    """Скрапит текст страницы"""
    try:
        response = requests.get(url, timeout=10,
                               headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, "html.parser")
        # Убираем скрипты и стили
        for script in soup(["script", "style"]):
            script.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Error: {e}"

def analyze_pricing(page_text: str, url: str) -> dict:
    """AI анализирует страницу цен"""
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
    """Отправляет отчёт (можно в Telegram, email, Slack)"""
    report = f"🔍 Мониторинг конкурентов — {datetime.now().strftime('%d.%m.%Y')}\\n\\n"
    for item in results:
        report += f"**{item['url']}**\\n{json.dumps(item['data'], ensure_ascii=False, indent=2)}\\n\\n"
    print(report)  # или отправь через Telegram Bot API

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

## Работа с файлами и папками

\`\`\`python
import os
import anthropic
from pathlib import Path

def process_documents(folder: str):
    """Обрабатывает все .txt файлы в папке с помощью AI"""
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

## Практическое задание

1. Установи необходимые библиотеки:
   \`\`\`bash
   pip install anthropic requests beautifulsoup4 python-dotenv
   \`\`\`
2. Создай файл \`.env\` с \`ANTHROPIC_API_KEY=твой_ключ\`
3. Напиши скрипт который:
   - Читает список из 3-5 URL (новостные сайты / блоги)
   - Скрапит первый абзац каждой страницы
   - Просит Claude написать 1-2 строки суммари
   - Выводит результат в консоль
4. Запусти скрипт и убедись что всё работает

> **Главная мысль:** Python — это не про синтаксис. Это про то, что ты можешь объяснить задачу Claude и он напишет скрипт. Твоя работа — понять что нужно сделать. Код — дело AI.`,

  "22-5": `# Реальные кейсы автоматизации: шаблоны и примеры

Теория без практики — ничто. В этом уроке — конкретные сценарии автоматизации которые используют реальные бизнесы и фрилансеры прямо сейчас.

## Кейс 1: AI-ресепшн для малого бизнеса

**Проблема:** Клиент пишет в Telegram/WhatsApp вопросы (часы работы, цены, запись). Отвечать вручную — теряешь лиды.

**Решение:**
\`\`\`
Входящее сообщение в Telegram
    ↓
n8n Webhook (принимает сообщение)
    ↓
Anthropic Claude (отвечает по базе знаний)
    ↓
Telegram Bot (отправляет ответ)
    ↓
Если вопрос про запись → Google Calendar (создаёт слот)
\`\`\`

**Системный промпт для AI:**
\`\`\`
Ты вежливый администратор фитнес-клуба "SportLife".
Часы работы: Пн-Пт 7:00-22:00, Сб-Вс 9:00-20:00.
Цены: абонемент 1 мес — $50, 3 мес — $120, годовой — $400.
Запись на пробное занятие — через ссылку: https://...

Отвечай кратко и по делу. Если вопрос не по теме клуба —
скажи что можешь помочь только по вопросам клуба.
\`\`\`

**Результат:** 80% запросов обрабатывается автоматически, менеджер видит только те диалоги где нужно его вмешательство.

## Кейс 2: Дайджест для команды

**Проблема:** Команда теряется в потоке информации — Slack, email, GitHub, Jira. Утром непонятно что произошло ночью.

**Решение:** Ежедневный AI-дайджест в 9:00:

\`\`\`python
import anthropic
from datetime import datetime, timedelta

def collect_updates():
    updates = []

    # GitHub: новые PR и issues
    # (через GitHub API)
    updates.append(get_github_updates())

    # Jira: задачи изменившие статус
    updates.append(get_jira_updates())

    # Важные email
    updates.append(get_email_summaries())

    return "\\n".join(updates)

def create_digest(updates: str) -> str:
    client = anthropic.Anthropic()
    today = datetime.now().strftime("%d %B")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{
            "role": "user",
            "content": f"""Создай утренний дайджест для команды на {today}.
Структура: 🔴 Срочно | 🟡 Важно | ✅ Сделано вчера | 📌 На сегодня

Данные за последние 24 часа:
{updates}"""
        }]
    )
    return message.content[0].text

# Запускать каждый день в 8:50 через cron
if __name__ == "__main__":
    updates = collect_updates()
    digest = create_digest(updates)
    send_to_slack("#general", digest)
\`\`\`

## Кейс 3: Автоматическая обработка входящих заявок

**Для фрилансеров и агентств:**

\`\`\`
Email с заявкой
    ↓
Make (trigger: новое письмо с определённой темой)
    ↓
Claude (классифицирует: тип проекта, бюджет, срочность)
    ↓
Router:
  ├── Бюджет > $5000 → создать в CRM + уведомить лично
  ├── Стандартная заявка → добавить в Notion + авто-ответ
  └── Спам/нерелевантно → архив
\`\`\`

**Промпт для классификации:**
\`\`\`
Analyze this client inquiry and return JSON:
{
  "project_type": "website|app|bot|design|other",
  "estimated_budget": "low(<1k)|medium(1k-5k)|high(>5k)|unknown",
  "urgency": "asap|normal|flexible",
  "is_spam": true/false,
  "summary": "2 sentence summary"
}

Email: [текст письма]
\`\`\`

## Кейс 4: Контент-конвейер

**Для блогеров и маркетологов:**

\`\`\`
Раз в неделю: Google Sheets (список тем)
    ↓
Claude (пишет черновик статьи по теме)
    ↓
Claude (создаёт 5 вариантов заголовков)
    ↓
Claude (пишет 3 варианта intro для A/B теста)
    ↓
Google Docs (создаёт документ с контентом)
    ↓
Telegram (уведомление редактору с ссылкой на документ)
\`\`\`

Один раз в неделю — готово 5 статей для ревью редактора.

## Кейс 5: Мониторинг цен конкурентов

\`\`\`python
# Запускается каждую ночь в 02:00
# Если цены изменились — уведомление утром

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
        # Анализ изменений через Claude
        analysis = analyze_changes_with_ai(changes)
        send_telegram_alert(analysis)

    # Сохранить текущие данные
    save_to_json(current_data)
\`\`\`

## Топ-10 автоматизаций для старта

1. **RSS → Telegram дайджест** (15 мин настройки)
2. **Форма заявки → CRM + email** (30 мин)
3. **GitHub PR → Slack уведомление** (10 мин)
4. **Еженедельный отчёт из Google Analytics** (45 мин)
5. **AI-ответы на FAQ в чат-боте** (60 мин)
6. **Мониторинг упоминаний бренда** (60 мин)
7. **Автосортировка почты с AI** (45 мин)
8. **Генерация контент-плана из keyword list** (30 мин)
9. **Экспорт данных Notion → Google Sheets** (20 мин)
10. **Авто-напоминания для незакрытых задач** (30 мин)

## Практическое задание

Выбери один из 10 кейсов выше и реализуй его:
1. Определи инструмент (n8n / Make / Python)
2. Набросай схему на бумаге: триггер → обработка → действие
3. Реализуй минимальную версию без AI
4. Добавь AI-шаг
5. Протестируй на реальных данных

> **Главная мысль:** Самая полезная автоматизация — та которая решает реальную боль. Начни с малого: найди одну задачу которую делаешь каждую неделю вручную — и автоматизируй её.`,

  // ===== MODULE 23 — Кибербезопасность для разработчика =====

  "23-1": `# Основы кибербезопасности для вайбкодера

Ты создаёшь реальные продукты. Они будут хранить данные пользователей, принимать платежи, работать в интернете. Один пропущенный баг безопасности может стоить тебе репутации, денег и доверия пользователей.

Этот модуль не сделает из тебя пентестера. Он даст тебе мышление безопасного разработчика: понимание угроз, навык писать защищённый код, умение проверить свой проект на основные уязвимости.

## Почему безопасность важна прямо сейчас

Статистика которая должна тебя беспокоить:
- 43% кибератак направлены на малый бизнес
- Средняя стоимость утечки данных — $4.45 миллиона (IBM, 2023)
- 74% утечек происходят из-за человеческого фактора
- Среднее время обнаружения атаки — 277 дней

И главное: **большинство атак используют известные уязвимости, которые можно было предотвратить**.

## Основные типы угроз

**Инъекции (Injection)**
Злоумышленник вставляет свой код в запрос к приложению:
\`\`\`
# Уязвимый SQL запрос:
query = "SELECT * FROM users WHERE name = '" + user_input + "'"

# Атака: user_input = "'; DROP TABLE users; --"
# Результат: база данных уничтожена

# Защита — параметризованные запросы:
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
\`\`\`

**Broken Authentication (Сломанная аутентификация)**
Слабые пароли, отсутствие 2FA, небезопасное хранение сессий.

**Exposed Data (Утечка данных)**
Передача паролей в открытом виде, логи с конфиденциальными данными, открытые S3 бакеты.

**XSS (Cross-Site Scripting)**
Вставка скриптов в страницы которые видят другие пользователи.

**SSRF (Server-Side Request Forgery)**
Заставить сервер сделать запрос к внутренним ресурсам.

## Модель угроз: думай как атакующий

Перед тем как строить защиту — понять от чего защищаешься:

**Вопросы для анализа угроз:**
1. Какие данные хранит моё приложение? (пароли, платёжные данные, персональные данные)
2. Кто мой потенциальный злоумышленник? (скрипт-кидди, конкурент, инсайдер)
3. Что произойдёт если данные утекут?
4. Какие точки входа в приложение? (API, формы, файловый загрузчик)
5. Что является самым ценным активом, который нужно защитить?

**Примеры активов и их угроз:**

| Актив | Угроза | Защита |
|-------|--------|--------|
| Пароли пользователей | Взлом БД | bcrypt/argon2 хэширование |
| API ключи | Утечка в коде | .env файлы, secrets manager |
| Платёжные данные | Перехват | HTTPS, не хранить карты |
| Персональные данные | GDPR нарушение | Шифрование, минимизация сбора |

## Принципы безопасной разработки

**1. Defence in Depth (Глубокая эшелонированная защита)**
Не полагаться на один слой защиты. Даже если один уровень пробит — должны быть другие.

**2. Least Privilege (Минимум привилегий)**
Каждый компонент должен иметь только те права которые нужны для работы. База данных — только SELECT/INSERT, не DROP.

**3. Fail Secure (Безопасный отказ)**
При ошибке — запрети доступ, а не разреши.
\`\`\`python
# Неправильно:
try:
    check_permission(user)
    allow_access()
except:
    allow_access()  # Ошибка → пустить? Нет!

# Правильно:
try:
    if check_permission(user):
        allow_access()
    else:
        deny_access()
except:
    deny_access()  # Ошибка → запретить
\`\`\`

**4. Input Validation (Валидация входных данных)**
Никогда не доверяй данным от пользователя. Всегда проверяй.

**5. Security by Design**
Безопасность — не плагин который добавляется в конце. Она закладывается с первой строки кода.

## AI как помощник в безопасности

Claude отлично помогает с безопасностью кода:
\`\`\`
Промпт: "Проверь этот код на уязвимости OWASP Top 10.
Для каждой найденной уязвимости покажи:
1. Тип уязвимости
2. Где она находится
3. Как её можно эксплуатировать
4. Исправленный вариант кода

Код:
[вставь код]"
\`\`\`

## Практическое задание

1. Возьми любой свой проект (или создай простое Express/Flask приложение)
2. Ответь на 5 вопросов модели угроз для этого проекта
3. Попроси Claude проверить самый сложный файл на уязвимости
4. Исправь хотя бы одну найденную проблему

> **Главная мысль:** Безопасность — это не параноя. Это профессионализм. Пользователи доверяют тебе свои данные. Это доверие нужно заслужить и сохранить.`,

  "23-2": `# OWASP Top 10 — главные уязвимости веб-приложений

OWASP (Open Web Application Security Project) — международная организация которая ежегодно публикует список 10 самых опасных уязвимостей веб-приложений. Это стандарт индустрии — если ты знаешь эти 10 пунктов, ты уже защищён от большинства реальных атак.

## A01: Broken Access Control (Сломанный контроль доступа)

Самая распространённая уязвимость. Пользователь получает доступ к тому чего не должен видеть.

**Пример атаки:**
\`\`\`
# URL профиля: /api/user/123/profile
# Злоумышленник меняет на: /api/user/456/profile
# Если нет проверки прав — видит чужой профиль
\`\`\`

**Защита:**
\`\`\`javascript
// Всегда проверяй что пользователь имеет право на ресурс
app.get('/api/user/:id/profile', authenticate, (req, res) => {
  // Проверяем что id в URL совпадает с id из токена
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  // Только теперь возвращаем данные
});
\`\`\`

## A02: Cryptographic Failures (Криптографические ошибки)

Использование слабого шифрования или хранение данных в открытом виде.

**Типичные ошибки:**
- Хранение паролей в MD5 (взламывается мгновенно)
- HTTP вместо HTTPS
- Слабые секретные ключи

**Правильное хранение паролей:**
\`\`\`python
# НИКОГДА так:
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()

# Правильно — bcrypt или argon2:
import bcrypt
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Проверка:
bcrypt.checkpw(input_password.encode(), stored_hash)
\`\`\`

## A03: Injection (Инъекции)

SQL, NoSQL, OS Command, LDAP инъекции. Уже разбирали — но повторим принцип.

**SQL Injection пример:**
\`\`\`python
# Уязвимо:
cursor.execute(f"SELECT * FROM products WHERE id = {product_id}")

# Защищено:
cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))

# ORM автоматически защищает:
Product.objects.filter(id=product_id)  # Django безопасен
\`\`\`

## A04: Insecure Design (Небезопасный дизайн)

Архитектурные решения которые делают систему уязвимой по определению.

**Пример:** функция "угадай пароль из 4 цифр". Без ограничения попыток — можно перебрать все 10 000 комбинаций за секунды.

**Решение:** Rate limiting (ограничение запросов) на все критичные эндпоинты.
\`\`\`javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток
  message: 'Too many login attempts. Try again in 15 minutes.'
});

app.post('/api/auth/login', loginLimiter, loginHandler);
\`\`\`

## A05: Security Misconfiguration (Неправильная конфигурация)

Дефолтные настройки часто небезопасны:
- Включённый режим отладки в продакшне
- Открытые директории (Directory Listing)
- Дефолтные логины/пароли (admin/admin)
- Лишние права доступа

**Чеклист конфигурации:**
\`\`\`
□ DEBUG=False в продакшне
□ Убраны дефолтные аккаунты
□ CORS настроен только на нужные домены
□ HTTP заголовки безопасности добавлены
□ Директории не листятся
□ Версия ПО скрыта из заголовков
\`\`\`

## A06: Vulnerable Components (Устаревшие компоненты)

Использование библиотек с известными уязвимостями.

\`\`\`bash
# Проверка Node.js проекта:
npm audit

# Проверка Python проекта:
pip install safety
safety check

# GitHub автоматически создаёт Dependabot alerts
\`\`\`

## A07: Authentication Failures (Сбои аутентификации)

**Слабые места:**
- Отсутствие блокировки после N неудачных попыток
- Слабая политика паролей
- Отсутствие 2FA для критичных операций
- Небезопасный "Забыл пароль"

**Надёжный JWT:**
\`\`\`javascript
// Короткое время жизни access токена
const accessToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }  // 15 минут, не неделю!
);

// Refresh токен для обновления
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

## A08: Integrity Failures (Нарушение целостности)

Загрузка кода или данных без проверки подписи/происхождения.

**Опасные практики:**
\`\`\`javascript
// ОПАСНО: eval с пользовательскими данными
eval(userInput);

// ОПАСНО: deserialize без проверки
const data = JSON.parse(untrustedData);

// ОПАСНО: npm install без проверки integrity
// Используй package-lock.json и проверяй хэши
\`\`\`

## A09: Logging & Monitoring Failures

Без логирования ты не знаешь что происходит.

**Что логировать:**
\`\`\`python
import logging

# Успешный вход
logging.info(f"Login: user={user.id} ip={request.remote_addr}")

# Неудачный вход (осторожно — не логируй пароль!)
logging.warning(f"Failed login: email={email} ip={request.remote_addr}")

# Подозрительная активность
logging.critical(f"Multiple failed logins: ip={request.remote_addr} count={attempts}")

# Важно: НЕ логируй пароли, токены, карточные данные!
\`\`\`

## A10: SSRF (Server-Side Request Forgery)

Сервер делает запрос на произвольный URL указанный злоумышленником.

\`\`\`python
# Уязвимо — сервер делает запрос на любой URL:
def fetch_preview(url: str):
    return requests.get(url).text

# Атака: url = "http://169.254.169.254/metadata" (AWS metadata service)

# Защита — whitelist доменов:
ALLOWED_DOMAINS = ["api.trusted-service.com", "cdn.myapp.com"]

def fetch_preview(url: str):
    from urllib.parse import urlparse
    parsed = urlparse(url)
    if parsed.hostname not in ALLOWED_DOMAINS:
        raise ValueError("Domain not allowed")
    return requests.get(url).text
\`\`\`

## Практическое задание

1. Возьми любой свой проект
2. Пройдись по чеклисту A01-A10
3. Найди хотя бы 2-3 потенциальных проблемы
4. Попроси Claude: "Просмотри этот код на OWASP Top 10 уязвимости"
5. Исправь найденные проблемы

> **Главная мысль:** OWASP Top 10 — это не список страшилок. Это план действий. Знаешь список — знаешь что проверять в каждом проекте.`,

  "23-3": `# Безопасность API и аутентификация

API — это ворота в твоё приложение. Если они плохо защищены, всё остальное не имеет значения. В этом уроке — практические паттерны для безопасных API.

## Аутентификация vs Авторизация

Часто путают — разберём раз и навсегда:

**Аутентификация (AuthN)** — КТО ты?
- Проверка: "Это действительно user@example.com?"
- Инструменты: JWT, OAuth, сессии, API ключи

**Авторизация (AuthZ)** — ЧТО тебе можно?
- Проверка: "Имеет ли этот пользователь право удалять посты?"
- Инструменты: RBAC, ABAC, policy-based auth

**Ошибка новичков:** сделать аутентификацию, забыть про авторизацию.
\`\`\`javascript
// Плохо: проверяем только что пользователь залогинен
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  await Post.delete(req.params.id); // Любой может удалить чужой пост!
});

// Хорошо: проверяем и авторизацию
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

Самый распространённый способ аутентификации в REST API.

**Структура JWT:**
\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.signature
    (header)              (payload/claims)       (signature)
\`\`\`

**Важные правила JWT:**
\`\`\`javascript
// 1. Используй сильный секрет (минимум 256 бит)
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
// Никогда не хардкодь в коде — только через env

// 2. Короткое время жизни
const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
  expiresIn: '15m',      // Access token: 15 минут
  issuer: 'myapp.com',   // Кто выдал
  audience: 'myapp.com'  // Для кого
});

// 3. Проверяй все поля
const payload = jwt.verify(token, JWT_SECRET, {
  issuer: 'myapp.com',
  audience: 'myapp.com'
});

// 4. Никогда не храни JWT в localStorage — используй httpOnly cookie
res.cookie('token', token, {
  httpOnly: true,    // JS не может прочитать
  secure: true,      // Только HTTPS
  sameSite: 'strict' // Защита от CSRF
});
\`\`\`

**Revocation проблема JWT:**
JWT нельзя "отозвать" до истечения срока. Решения:
- Короткое время жизни (15 мин) + refresh token
- Blacklist токенов в Redis
- Версионирование токенов в БД

## API Keys — для машина-машина коммуникации

\`\`\`python
import secrets
import hashlib

def generate_api_key() -> tuple[str, str]:
    """Генерирует пару: raw_key (для пользователя) + hash (для хранения)"""
    raw_key = f"vca_{secrets.token_urlsafe(32)}"  # prefix помогает идентифицировать утечку
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    return raw_key, key_hash

def validate_api_key(raw_key: str, stored_hash: str) -> bool:
    """Проверяет ключ без хранения в открытом виде"""
    return secrets.compare_digest(
        hashlib.sha256(raw_key.encode()).hexdigest(),
        stored_hash
    )

# В БД храним только hash, никогда raw_key
# При создании показываем raw_key один раз
\`\`\`

## Rate Limiting — защита от брутфорса и DDoS

\`\`\`python
from functools import wraps
import time
from collections import defaultdict

# Простой rate limiter в памяти
request_counts = defaultdict(list)

def rate_limit(max_requests: int, window_seconds: int):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            ip = request.remote_addr
            now = time.time()

            # Убираем старые запросы
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

# Для продакшна — используй Redis + библиотеку
# npm: express-rate-limit
# Python: slowapi, flask-limiter
\`\`\`

## CORS — Cross-Origin Resource Sharing

\`\`\`javascript
// Опасная настройка (открывает API всем):
app.use(cors()); // НИКОГДА в продакшне!

// Правильная настройка:
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Кеш preflight на 24 часа
}));
\`\`\`

## Security Headers — обязательные HTTP заголовки

\`\`\`javascript
// Helmet.js для Express:
const helmet = require('helmet');
app.use(helmet());

// Что Helmet добавляет:
// Content-Security-Policy: предотвращает XSS
// X-Frame-Options: защита от clickjacking
// X-Content-Type-Options: запрет MIME sniffing
// Referrer-Policy: контроль реферера
// Strict-Transport-Security: только HTTPS

// Проверить свои заголовки: https://securityheaders.com
\`\`\`

## Input Validation — валидация входных данных

\`\`\`typescript
import { z } from 'zod'; // Популярная библиотека для TypeScript

// Схема валидации
const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).regex(/^[a-zA-Zа-яА-Я\s]+$/),
  age: z.number().int().min(18).max(120),
});

// Использование
app.post('/api/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues
    });
  }

  const validatedData = result.data; // TypeScript знает тип
  createUser(validatedData);
});
\`\`\`

## Защита от Mass Assignment

\`\`\`python
# Уязвимо — пользователь может передать is_admin=True:
user.update(**request.json)  # ОПАСНО

# Безопасно — whitelist разрешённых полей:
ALLOWED_FIELDS = {'name', 'email', 'bio', 'avatar_url'}

def update_user(user, data: dict):
    safe_data = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    user.update(**safe_data)
\`\`\`

## Практическое задание

1. Возьми свой API проект
2. Проверь:
   - Есть ли авторизация (не только аутентификация) на всех эндпоинтах?
   - JWT хранится в httpOnly cookie или всё ещё в localStorage?
   - Есть ли rate limiting на login/register?
   - Настроен ли CORS правильно?
3. Установи helmet (Node.js) или аналог и добавь заголовки безопасности
4. Попроси Claude: "Найди проблемы аутентификации и авторизации в этом коде"

> **Главная мысль:** Безопасный API — это не "добавь несколько проверок". Это архитектурное решение: deny by default, проверяй всё, доверяй ничему.`,

  "23-4": `# AI для анализа безопасности кода

Claude и другие AI-модели можно использовать как интеллектуального партнёра по безопасности. Это не заменяет специализированные инструменты — но значительно усиливает их.

## Что AI умеет в контексте безопасности

**Сильные стороны:**
- Объяснить уязвимость простым языком
- Предложить безопасный вариант кода
- Проверить логику на смысловые ошибки
- Написать тесты безопасности
- Создать security checklist для проекта

**Слабые стороны:**
- Может пропустить сложные цепочки атак
- Не запускает и не тестирует код
- Может ошибаться в специфических контекстах
- Не знает архитектуру всего приложения

**Правило:** AI — это умный код-ревьюер, а не замена пентестеру.

## Промпты для security code review

**Базовый аудит:**
\`\`\`
Выполни security review этого кода. Ищи:
1. OWASP Top 10 уязвимости
2. Небезопасное хранение данных
3. Проблемы аутентификации/авторизации
4. Инъекции (SQL, NoSQL, Command)
5. XSS возможности

Для каждой проблемы:
- Тип уязвимости (название)
- Строки кода где она есть
- Как можно эксплуатировать (без деталей атаки)
- Исправленный код

Код: [вставь код]
\`\`\`

**Глубокий анализ логики:**
\`\`\`
Проанализируй логику авторизации в этом коде.
Представь что ты пентестер который ищет способ
получить доступ к чужим ресурсам. Что можно сделать?

Конкретно проверь:
- Privilege escalation (повышение привилегий)
- IDOR (Insecure Direct Object Reference)
- Bypassing authentication checks
- Race conditions в критических операциях

Код: [вставь код]
\`\`\`

**Проверка конфигурации:**
\`\`\`
Проверь эту конфигурацию на security misconfigurations.
Что настроено небезопасно? Что лучше изменить?
Файл: [вставь конфиг]
\`\`\`

## Автоматизация проверок с AI

\`\`\`python
import anthropic
from pathlib import Path
import json

def security_audit_file(file_path: str) -> dict:
    """Запрашивает у Claude аудит безопасности файла"""
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
    """Аудит всех Python/JS файлов в директории"""
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

# Запуск
if __name__ == "__main__":
    critical_issues = audit_project("./src")
    print(f"\\n{'='*50}")
    print(f"Found {len(critical_issues)} critical/high severity issues:")
    for issue in critical_issues:
        print(f"\\n⚠️  {issue['file']}")
        print(f"   Type: {issue['type']}")
        print(f"   {issue['description']}")
\`\`\`

## Специализированные инструменты (работают вместе с AI)

**Static Analysis (SAST):**
\`\`\`bash
# Python: bandit
pip install bandit
bandit -r ./src -ll  # показывает только medium+ severity

# JavaScript: ESLint security plugin
npm install eslint-plugin-security
# .eslintrc: { "plugins": ["security"] }

# TypeScript/JS: Semgrep (бесплатно)
semgrep --config=p/security-audit ./src
\`\`\`

**Dependency scanning:**
\`\`\`bash
# Node.js
npm audit
npm audit fix  # исправить автоматически где возможно

# Python
pip install safety
safety check -r requirements.txt

# GitHub: включи Dependabot в настройках репозитория
\`\`\`

**Secrets scanning — поиск утечек ключей:**
\`\`\`bash
# truffleHog — ищет секреты в коде и git истории
pip install truffleHog
trufflehog git file://. --only-verified

# gitleaks
gitleaks detect --source . -v
\`\`\`

## CI/CD — автоматизация проверок безопасности

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

## Разбор реального кейса с AI

Вот реальный диалог с Claude при аудите кода:

**Запрос:**
\`\`\`python
# Есть ли проблемы безопасности в этом коде?
@app.route('/api/file')
def get_file():
    filename = request.args.get('name')
    path = f"/var/app/files/{filename}"
    return send_file(path)
\`\`\`

**Ответ Claude:**
\`\`\`
Критическая уязвимость: Path Traversal (CWE-22)

Проблема: параметр name не валидируется.
Атака: ?name=../../etc/passwd — злоумышленник читает системные файлы.

Исправление:
import os
from pathlib import Path

UPLOAD_DIR = Path("/var/app/files").resolve()

@app.route('/api/file')
def get_file():
    filename = request.args.get('name', '')
    # Убираем любые ../ и нормализуем путь
    safe_path = (UPLOAD_DIR / filename).resolve()

    # Проверяем что итоговый путь внутри разрешённой директории
    if not str(safe_path).startswith(str(UPLOAD_DIR)):
        abort(403)

    if not safe_path.exists():
        abort(404)

    return send_file(safe_path)
\`\`\`

## Практическое задание

1. Установи bandit (Python) или eslint-plugin-security (JS)
2. Запусти на своём проекте: найди все предупреждения
3. Возьми 3 файла с наибольшим количеством проблем
4. Попроси Claude объяснить каждую проблему и предложить исправление
5. Примени исправления и перезапусти сканер

> **Главная мысль:** AI в безопасности — это как умный партнёр на код-ревью. Он находит очевидные проблемы, объясняет почему это опасно и показывает как исправить. Но финальное решение — за тобой.`,

  "23-5": `# Практика: аудит безопасности своего проекта

Финальный урок модуля — полный security аудит реального проекта. Применим всё что изучили к конкретному коду.

## Методология security аудита

Профессиональный аудит состоит из нескольких фаз:

\`\`\`
Фаза 1: Разведка (Reconnaissance)
  → Понять архитектуру приложения
  → Найти все точки входа (API, формы, загрузка файлов)
  → Составить карту данных (что хранится, где, как передаётся)

Фаза 2: Статический анализ (SAST)
  → Автоматические сканеры (bandit, semgrep)
  → Поиск секретов в коде (gitleaks)
  → Ревью зависимостей (npm audit, safety)

Фаза 3: Ручной анализ
  → Проверка OWASP Top 10 вручную
  → AI-ревью критичных файлов
  → Проверка бизнес-логики

Фаза 4: Динамический анализ (опционально)
  → Тестирование запущенного приложения
  → OWASP ZAP / Burp Suite Community

Фаза 5: Отчёт и исправление
  → Документирование проблем
  → Расстановка приоритетов (Critical → High → Medium → Low)
  → Исправление и повторная проверка
\`\`\`

## Security Checklist для вашего проекта

### Аутентификация и авторизация
\`\`\`
□ Пароли хэшируются через bcrypt/argon2 (не MD5/SHA1)
□ JWT имеют короткое время жизни (≤ 15 мин для access token)
□ JWT хранится в httpOnly cookie (не localStorage)
□ Есть rate limiting на login/register эндпоинты
□ Все приватные маршруты проверяют аутентификацию
□ Все операции с данными проверяют авторизацию (не только аутентификацию)
□ Нет IDOR уязвимостей (проверка что ресурс принадлежит пользователю)
\`\`\`

### Данные и хранение
\`\`\`
□ .env файлы в .gitignore
□ Секреты не закоммичены в git (проверь историю!)
□ Все env переменные задокументированы в .env.example
□ Персональные данные минимизированы (храним только что нужно)
□ Платёжные данные не хранятся (используем Stripe token)
□ Чувствительные данные шифруются в БД
\`\`\`

### API безопасность
\`\`\`
□ CORS настроен на конкретные домены
□ Security headers добавлены (helmet или аналог)
□ Валидация входных данных на всех эндпоинтах
□ SQL/NoSQL инъекции исключены (параметризованные запросы / ORM)
□ Rate limiting на критичных эндпоинтах
□ Ошибки не раскрывают внутреннюю информацию (stack trace)
□ Нет неиспользуемых эндпоинтов с доступом
\`\`\`

### Загрузка файлов
\`\`\`
□ Проверяется тип файла (не только расширение, но и MIME)
□ Ограничен размер файла
□ Файлы хранятся за пределами web root
□ Имена файлов санитизируются (UUID вместо оригинального имени)
□ Исполнение кода в директории загрузок запрещено
\`\`\`

### Конфигурация и деплой
\`\`\`
□ DEBUG режим выключен в продакшне
□ Используется HTTPS
□ Зависимости обновлены (нет критических CVE)
□ Логи не содержат чувствительных данных
□ Ошибки логируются и мониторятся
\`\`\`

## Пошаговый аудит с инструментами

### Шаг 1: Автоматический скан

\`\`\`bash
# Python проект
pip install bandit safety
bandit -r ./src -f json -o bandit_report.json
safety check --json > safety_report.json

# Node.js проект
npm audit --json > npm_audit.json
npx semgrep --config=p/security-audit ./src --json > semgrep_report.json

# Поиск секретов (работает для любого проекта)
pip install truffleHog
trufflehog git file://. --json > secrets_report.json
\`\`\`

### Шаг 2: AI-анализ критичных файлов

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

Return structured findings as JSON:
{{"file": "{filepath}", "findings": [{{"severity": "", "issue": "", "line": "", "recommendation": ""}}], "score": 1-10}}

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
    # Сортируем по score (от низкого к высокому)
    results.sort(key=lambda x: x.get("score", 10))

    print("\\n=== SECURITY AUDIT REPORT ===")
    for r in results:
        score = r.get("score", "N/A")
        emoji = "🔴" if score <= 4 else "🟡" if score <= 7 else "🟢"
        print(f"\\n{emoji} {r['file']} — Score: {score}/10")
        for finding in r.get("findings", []):
            print(f"   [{finding['severity'].upper()}] {finding['issue']}")
\`\`\`

### Шаг 3: Проверка конкретных уязвимостей вручную

\`\`\`bash
# 1. Ищем хардкод секретов
grep -r "password\s*=" ./src --include="*.py" --include="*.js"
grep -r "api_key\s*=" ./src
grep -r "secret\s*=" ./src
grep -r "AWS_" ./src

# 2. Ищем небезопасные функции
grep -r "eval(" ./src
grep -r "exec(" ./src
grep -r "pickle.loads" ./src  # Python десериализация
grep -r "innerHTML" ./src     # XSS риск

# 3. Проверяем SQL запросы
grep -r "f\"SELECT\|f'SELECT\|%.*SELECT" ./src  # f-строки в SQL
\`\`\`

## Приоритизация и исправление

После аудита — расставить приоритеты:

| Severity | Что делать | Срок |
|----------|-----------|------|
| Critical | Исправить немедленно, до деплоя | Сегодня |
| High | Исправить в ближайшем спринте | 1-2 дня |
| Medium | Включить в backlog | 1-2 недели |
| Low | Улучшить при рефакторинге | По возможности |

## Инструменты для постоянного мониторинга

**После запуска в продакшн:**
- **Sentry** — мониторинг ошибок и аномалий
- **Cloudflare** — WAF (Web Application Firewall) на бесплатном тарифе
- **GitHub Dependabot** — автоматические PR для уязвимых зависимостей
- **OWASP ZAP** — регулярное динамическое тестирование

## Финальное практическое задание

Выполни полный аудит своего проекта:

1. **Автоматический скан** (bandit/semgrep/npm audit)
   → Зафиксируй все найденные проблемы

2. **AI-ревью** 3-5 критичных файлов
   → Используй промпты из урока 23-4

3. **Чеклист** из этого урока
   → Пройдись по каждому пункту, отметь статус

4. **Исправь минимум 3 найденных проблемы**
   → Начни с Critical/High severity

5. **Задокументируй** что нашёл и что исправил
   → Одного абзаца достаточно

> **Главная мысль:** Security — это процесс, а не событие. Один аудит не делает тебя защищённым навсегда. Важно встроить проверки в разработку: pre-commit hooks, CI/CD сканеры, регулярные ревью. Безопасность становится привычкой.`,
};

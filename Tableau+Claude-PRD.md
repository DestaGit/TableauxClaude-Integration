# Product Requirements Document
## Tableau × Claude — AI-Powered Workbook Intelligence Platform
### Client-Side Web Application

---

**Document Version:** 1.0.0
**Status:** Approved for Development
**Last Updated:** May 2026
**Author:** Product Team
**Classification:** Internal — Engineering & Design

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Problem Statement](#2-background--problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [User Personas](#4-user-personas)
5. [User Stories & Jobs to Be Done](#5-user-stories--jobs-to-be-done)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Data Flow & Workflows](#9-data-flow--workflows)
10. [API Specifications](#10-api-specifications)
11. [UI/UX Specifications](#11-uiux-specifications)
12. [Security & Privacy Model](#12-security--privacy-model)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Success Metrics & KPIs](#14-success-metrics--kpis)
15. [Constraints, Assumptions & Dependencies](#15-constraints-assumptions--dependencies)
16. [Out of Scope](#16-out-of-scope)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

**Tableau × Claude** is a fully client-side, zero-backend web application that bridges the gap between Tableau's world-class data visualization ecosystem and Anthropic's Claude large language model. The application enables data analysts, business intelligence professionals, and non-technical stakeholders to discover, explore, and extract deep insights from Tableau Public workbooks through a natural language conversational interface — all running entirely in the browser with no server infrastructure required.

### Key Value Propositions

- **Zero infrastructure cost:** Single HTML file, deployable anywhere static files are served
- **Privacy-first architecture:** No user data, API keys, or conversation history ever leaves the user's browser
- **Immediate time-to-value:** From zero to first insight in under 60 seconds
- **Dual integration path:** Live Tableau Public API search + manual context for private workbook analysis

### Deliverable

A single self-contained `index.html` file (~1,500–2,500 lines) with all CSS, JavaScript, and markup inlined. No build tools, no package managers, no dependencies to install. Open in any modern browser and use immediately.

---

## 2. Background & Problem Statement

### 2.1 The Tableau Knowledge Gap

Tableau Public hosts over 1 million community workbooks containing sophisticated data visualizations, analytical techniques, and domain insights. However, extracting actionable knowledge from these workbooks presents significant friction:

- **Discovery is keyword-dependent:** Users must know what to search for
- **Technique extraction requires expertise:** Understanding *how* a dashboard was built requires Tableau-specific knowledge
- **Insight synthesis is manual:** Interpreting data patterns across multiple views takes time and analytical skill
- **Documentation is sparse:** Most public workbooks lack explanatory narrative

### 2.2 The AI Integration Gap

While LLMs like Claude excel at analysis, summarization, and explanation, they lack native connectivity to Tableau's data layer. Existing integration approaches require:

- Backend servers and API proxies (infrastructure cost + maintenance)
- Developer setup (Git, Node.js, config files — not accessible to non-technical users)
- SaaS automation platforms (ongoing subscription cost, data leaves the org)

### 2.3 The Opportunity

A client-side application that directly connects the Tableau Public REST API with the Anthropic Messages API — using only browser-native fetch — can eliminate all of these barriers. The user provides their Anthropic API key once per session; everything else is automated.

---

## 3. Product Vision & Goals

### 3.1 Vision Statement

> "Make every Tableau workbook as understandable to a business analyst as it is to the engineer who built it — through the power of conversational AI, instantly, privately, in any browser."

### 3.2 Product Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | Enable natural language querying of Tableau Public workbook metadata | Must Have |
| G2 | Provide multi-turn conversational analysis powered by Claude | Must Have |
| G3 | Require zero backend infrastructure or developer setup | Must Have |
| G4 | Support manual context input for private/Desktop workbooks | Must Have |
| G5 | Deliver enterprise-grade UI suitable for professional environments | Should Have |
| G6 | Enable conversation export for documentation and sharing | Should Have |
| G7 | Persist session-level conversation history across workbook selections | Should Have |
| G8 | Support configurable Claude model and token settings | Could Have |

### 3.3 Success Definition

The product is successful when a non-technical business user can:
1. Open the app in a browser (no install)
2. Enter their API key
3. Search for a Tableau workbook by topic
4. Receive a clear, accurate AI-generated summary within 30 seconds
5. Ask follow-up questions in natural language

---

## 4. User Personas

### Persona 1 — The Business Analyst (Primary)
**Name:** Priya, Senior Business Analyst
**Organization:** Mid-market retail company (500 employees)
**Technical Level:** Low-Medium — comfortable with Excel, basic SQL, Tableau viewer

**Goals:**
- Quickly understand what a Tableau Public dashboard shows without building expertise
- Extract insights from competitor or industry public dashboards
- Document findings to share with leadership

**Pain Points:**
- Can't read Tableau XML or calculated fields
- Has no developer to help set up integrations
- Spends 2–3 hours manually interpreting dashboards

**How the App Helps:**
- Searches by business topic ("retail sales Q4"), selects a workbook, asks "What are the key takeaways from this dashboard?" and receives a structured summary in seconds

---

### Persona 2 — The Tableau Developer (Secondary)
**Name:** Marcus, BI Developer
**Organization:** Financial services firm
**Technical Level:** High — builds Tableau dashboards daily, knows LOD calculations, table calcs

**Goals:**
- Learn new visualization techniques from the Tableau Public community
- Quickly understand the structure of a workbook before replicating a technique
- Get Claude to explain complex calculated fields in plain English

**Pain Points:**
- MCP server setup is cumbersome for quick exploratory work
- No browser-native tool exists for ad-hoc workbook analysis
- Documentation of community workbooks is inconsistent

**How the App Helps:**
- Pastes a Tableau Public URL, asks "What calculated fields does this workbook likely use?" and uses that as a starting point to reverse-engineer the technique

---

### Persona 3 — The Data Literacy Coach (Tertiary)
**Name:** Amara, Data Literacy Program Manager
**Organization:** Enterprise training consultancy
**Technical Level:** Medium — trains non-technical staff on data concepts

**Goals:**
- Use real Tableau workbooks as teaching examples
- Generate plain-English explanations of dashboards for training material
- Create guided exploration exercises for trainees

**Pain Points:**
- Writing training material for each new workbook is time-consuming
- Finding workbooks at the right complexity level for learners is hard
- Trainees ask questions she can't always answer on the spot

**How the App Helps:**
- Searches for topic-appropriate workbooks, uses Claude to generate step-by-step explanations, and exports the conversation as training documentation

---

## 5. User Stories & Jobs to Be Done

### 5.1 Core User Stories

**Epic 1: Authentication & Setup**

| ID | Story | Acceptance Criteria | Priority |
|----|-------|---------------------|----------|
| US-01 | As a user, I want to enter my Anthropic API key so that Claude can process my queries | Key is masked (password field), validated on input, stored only in session memory, cleared on tab close | Must |
| US-02 | As a user, I want visual confirmation that my API key is valid so I know the app is ready | Green status indicator appears after key passes format validation; error shown if first API call fails | Must |
| US-03 | As a user, I want to access settings to change my API key without reloading the page | Settings modal accessible from top bar; changes take effect immediately | Should |

**Epic 2: Tableau Workbook Discovery**

| ID | Story | Acceptance Criteria | Priority |
|----|-------|---------------------|----------|
| US-04 | As a user, I want to search Tableau Public by topic so I can find relevant workbooks | Search returns up to 12 results from Tableau Public API within 3 seconds; results show title, author, view count, tags | Must |
| US-05 | As a user, I want to see workbook cards with key metadata so I can choose the right one | Cards display: title, author, view count (formatted), tags (up to 3), truncated description | Must |
| US-06 | As a user, I want to click a workbook to select it as context for Claude | Selected workbook highlighted; chat area updates to show workbook; conversation resets | Must |
| US-07 | As a user, I want to open the workbook on Tableau Public so I can see it visually | "Open ↗" link visible on selected workbook, opens in new tab | Should |
| US-08 | As a user, I want to paste a Tableau URL or description manually so I can analyze private or Desktop workbooks | Manual text area accepts free-form input; this context is appended to Claude's system prompt | Must |

**Epic 3: AI-Powered Analysis**

| ID | Story | Acceptance Criteria | Priority |
|----|-------|---------------------|----------|
| US-09 | As a user, I want to ask Claude any question about the selected workbook | Text input accepts multi-line, sends on Enter (Shift+Enter for newline), send button active | Must |
| US-10 | As a user, I want to see quick-action prompts so I don't have to think of questions | 6 preset prompt chips appear when a workbook is selected; clicking sends the prompt immediately | Must |
| US-11 | As a user, I want multi-turn conversation so Claude remembers earlier messages | Full conversation history sent with each API request; context accumulates correctly | Must |
| US-12 | As a user, I want to see a typing indicator while Claude is responding | Animated loading state visible in chat; input disabled during response | Must |
| US-13 | As a user, I want Claude's responses rendered with formatting so they're easy to read | Markdown-like rendering: headers, bullets, bold, code blocks | Should |
| US-14 | As a user, I want to copy any Claude message to my clipboard | Copy button on each AI message; confirmation flash on success | Should |

**Epic 4: Session Management**

| ID | Story | Acceptance Criteria | Priority |
|----|-------|---------------------|----------|
| US-15 | As a user, I want to start a new chat without losing my workbook selection | "New Chat" button clears messages but keeps workbook selected | Should |
| US-16 | As a user, I want to view my conversation history within the session | Sidebar shows list of past chats with first message as title; click to restore | Should |
| US-17 | As a user, I want to export my conversation as a text file for documentation | Export button generates .txt file with workbook info + full conversation | Should |

---

## 6. Functional Requirements

### 6.1 API Key Management (FR-AUTH)

| ID | Requirement | Input | Output | Priority |
|----|-------------|-------|--------|----------|
| FR-AUTH-01 | Accept Anthropic API key via password input field | String (format: `sk-ant-*`) | Stored in `sessionStorage['tca_key']`; cleared on session end | Must |
| FR-AUTH-02 | Validate API key format client-side | Key string | Boolean; visual indicator (grey → green dot) | Must |
| FR-AUTH-03 | Detect invalid key on first failed API call | HTTP 401 from Anthropic API | Inline error message; key field highlighted red | Must |
| FR-AUTH-04 | Never log or transmit API key except in Authorization header to Anthropic | Any API call | Key not in URL, localStorage, analytics, or console | Must |

### 6.2 Tableau Public Search (FR-SEARCH)

| ID | Requirement | Input | Output | Priority |
|----|-------------|-------|--------|----------|
| FR-SEARCH-01 | Call Tableau Public search API | Query string; count=12 | Parsed JSON; array of workbook objects | Must |
| FR-SEARCH-02 | Render workbook result cards | Workbook array | Card list: title, author, viewCount, tags, description | Must |
| FR-SEARCH-03 | Handle CORS failure gracefully | Network error / CORS block | Error message with fallback to manual input | Must |
| FR-SEARCH-04 | Trigger search on Enter key press | Keydown event in search input | Calls search function | Must |
| FR-SEARCH-05 | Show loading state during search | Search initiated | Spinner or skeleton visible; button disabled | Must |
| FR-SEARCH-06 | Format view counts (e.g. 14,200 → "14.2k") | Integer | Formatted string | Should |

### 6.3 Workbook Context Management (FR-CONTEXT)

| ID | Requirement | Input | Output | Priority |
|----|-------------|-------|--------|----------|
| FR-CTX-01 | Store selected workbook as active context | Click event on result card | `currentWorkbook` state updated; card highlighted | Must |
| FR-CTX-02 | Accept manual free-form context | Textarea input | Appended to Claude system prompt | Must |
| FR-CTX-03 | Build Claude system prompt from workbook metadata | Workbook object + manual context | Structured system prompt string | Must |
| FR-CTX-04 | Reset conversation on new workbook selection | Card click | `messages` array cleared; chat UI reset | Must |

**System Prompt Template (FR-CTX-03):**
```
You are an expert Tableau data analyst and visualization consultant.
You help users understand Tableau workbooks, dashboards, and data 
visualization techniques. Provide clear, structured, actionable analysis.

[IF WORKBOOK SELECTED]
Active Workbook Context:
- Title: {title}
- Author: {author}  
- View Count: {viewCount}
- Description: {description}
- Tags: {tags}
- URL: {url}

[IF MANUAL CONTEXT]
Additional Context:
{manualContext}

When answering:
- Be specific to the workbook context provided
- Use data visualization best practices
- Explain Tableau-specific concepts in accessible language
- Structure responses with clear headers and bullets where appropriate
```

### 6.4 Claude Chat Interface (FR-CHAT)

| ID | Requirement | Input | Output | Priority |
|----|-------------|-------|--------|----------|
| FR-CHAT-01 | Send user message to Claude API | User text + conversation history + system prompt | HTTP POST to `/v1/messages` | Must |
| FR-CHAT-02 | Include full conversation history in each request | `messages` array | Sent as `messages` parameter | Must |
| FR-CHAT-03 | Render assistant response in chat bubble | API response text | Formatted message bubble appended | Must |
| FR-CHAT-04 | Show animated loading state | API call pending | Pulsing dots in chat | Must |
| FR-CHAT-05 | Disable input during response | API call pending | Input + send button disabled | Must |
| FR-CHAT-06 | Auto-scroll to latest message | New message appended | Smooth scroll to bottom | Must |
| FR-CHAT-07 | Send on Enter; newline on Shift+Enter | Keydown event | Correct behavior | Must |
| FR-CHAT-08 | Render quick prompt chips | Workbook selected | 6 preset chips; click fires prompt | Must |
| FR-CHAT-09 | Copy message to clipboard | Copy button click | `navigator.clipboard.writeText()`; flash confirmation | Should |
| FR-CHAT-10 | Export conversation as .txt | Export button click | Download dialog; formatted text file | Should |

### 6.5 Session & History Management (FR-SESSION)

| ID | Requirement | Input | Output | Priority |
|----|-------------|-------|--------|----------|
| FR-SES-01 | Store conversation sessions in `sessionStorage` | End of chat / new chat | Array of session objects | Should |
| FR-SES-02 | Display session list in sidebar | Session array | List of past chats with title (first user message) | Should |
| FR-SES-03 | Restore session on click | Session click | Messages restored; workbook context restored | Should |
| FR-SES-04 | Start new chat | Button click | New empty session; workbook retained | Should |
| FR-SES-05 | Clear all history | Clear button | sessionStorage cleared; UI reset | Could |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | Initial page load time (no network) | < 500ms |
| NFR-P02 | Tableau Public search response | < 3 seconds (P95) |
| NFR-P03 | Claude API first token | < 5 seconds (P95, depends on Anthropic) |
| NFR-P04 | UI interaction response time | < 100ms for all local interactions |
| NFR-P05 | File size (index.html) | < 300KB uncompressed |

### 7.2 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Primary target |
| Firefox | 88+ | Fully supported |
| Safari | 14+ | Fully supported |
| Edge | 90+ | Fully supported |
| Mobile Chrome/Safari | Latest | Responsive layout required |

**Required Browser APIs:**
- `fetch()` with CORS support
- `sessionStorage`
- `navigator.clipboard`
- CSS Grid + Flexbox
- CSS Custom Properties

### 7.3 Accessibility

| ID | Requirement |
|----|-------------|
| NFR-A01 | All interactive elements keyboard-navigable (Tab order correct) |
| NFR-A02 | ARIA labels on icon-only buttons |
| NFR-A03 | Color contrast ratio ≥ 4.5:1 for all text (WCAG AA) |
| NFR-A04 | Focus rings visible on all focusable elements |
| NFR-A05 | Screen reader announcements for dynamic content (status changes) |

### 7.4 Security

| ID | Requirement |
|----|-------------|
| NFR-S01 | No API keys stored in localStorage (persistent storage) |
| NFR-S02 | No external analytics, tracking, or telemetry scripts |
| NFR-S03 | No eval() or innerHTML with unsanitized content |
| NFR-S04 | All external requests to known, trusted domains only (Anthropic API, Tableau Public API, Google Fonts) |
| NFR-S05 | Content Security Policy compatible (no inline event handlers) |

### 7.5 Reliability

| ID | Requirement |
|----|-------------|
| NFR-R01 | Graceful CORS failure for Tableau API with fallback to manual input |
| NFR-R02 | API timeout handling (30s) with user-visible error |
| NFR-R03 | Retry mechanism for transient network failures |
| NFR-R04 | State preserved on accidental double-click or rapid interaction |

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    index.html                           │   │
│  │                                                         │   │
│  │  ┌──────────────┐   ┌──────────────┐  ┌─────────────┐  │   │
│  │  │   UI Layer   │   │  State Layer │  │ API Layer   │  │   │
│  │  │              │   │              │  │             │  │   │
│  │  │ - TopBar     │◄─►│ - apiKey     │  │ - searchFn  │  │   │
│  │  │ - Sidebar    │   │ - currentWB  │  │ - chatFn    │  │   │
│  │  │ - ChatPanel  │   │ - messages[] │  │ - exportFn  │  │   │
│  │  │ - Settings   │   │ - sessions[] │  │             │  │   │
│  │  │ - Modals     │   │ - uiState    │  │             │  │   │
│  │  └──────────────┘   └──────────────┘  └──────┬──────┘  │   │
│  │                                               │         │   │
│  └───────────────────────────────────────────────┼─────────┘   │
│                                                  │             │
└──────────────────────────────────────────────────┼─────────────┘
                                                   │
              ┌────────────────────────────────────┤
              │                                    │
              ▼                                    ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│   Tableau Public API    │          │    Anthropic API         │
│                         │          │                          │
│ GET /api/search/query   │          │ POST /v1/messages        │
│   ?query=TERM           │          │   model: claude-sonnet   │
│   &type=workbooks       │          │   messages: [...]        │
│   &count=12             │          │   system: <context>      │
│                         │          │                          │
│ Returns: workbook JSON  │          │ Returns: content[].text  │
│ Auth: None required     │          │ Auth: x-api-key header   │
└─────────────────────────┘          └─────────────────────────┘
```

### 8.2 State Management

All application state is held in JavaScript module-scope variables. No framework or reactive library is used.

```javascript
// Core State Object
const AppState = {
  // Auth
  apiKey: "",                    // sessionStorage backed
  keyValid: false,

  // Workbook Context
  currentWorkbook: null,         // { title, author, views, description, tags, url }
  manualContext: "",

  // Conversation
  messages: [],                  // [{ role, content, timestamp }]
  isLoading: false,

  // Session History (sessionStorage)
  sessions: [],                  // [{ id, title, workbook, messages, timestamp }]
  currentSessionId: null,

  // UI
  settingsOpen: false,
  model: "claude-sonnet-4-20250514",
  maxTokens: 1024,
};
```

### 8.3 Component Map

```
index.html
├── <head>
│   ├── Meta / SEO tags
│   ├── Google Fonts (Playfair Display, JetBrains Mono, DM Sans)
│   └── <style> — All CSS (CSS Custom Properties, Grid, Flexbox)
│
└── <body>
    ├── #settings-modal — Overlay modal
    │   ├── API key input
    │   ├── Model selector
    │   └── Max tokens slider
    │
    ├── #topbar
    │   ├── .logo — App title + tagline
    │   ├── .status-bar — Connection status
    │   └── .top-actions — Settings btn, Export btn, New Chat btn
    │
    ├── #app-layout (CSS Grid: sidebar | main)
    │   │
    │   ├── #sidebar
    │   │   ├── #search-section
    │   │   │   ├── Search input + button
    │   │   │   └── #results-list — Workbook cards
    │   │   ├── #manual-section
    │   │   │   └── Textarea for manual context
    │   │   └── #history-section
    │   │       └── #session-list — Past conversation items
    │   │
    │   └── #main-panel
    │       ├── #chat-header — Selected workbook info
    │       ├── #quick-prompts — Preset chip buttons
    │       ├── #messages-area — Scrollable message list
    │       │   ├── .message.user — User bubble
    │       │   └── .message.assistant — Claude bubble + copy btn
    │       ├── #error-bar — Dismissible error banner
    │       └── #input-bar
    │           ├── #chat-input — Textarea
    │           └── #send-btn — Send button
    │
    └── <script> — All JavaScript
        ├── Constants & Config
        ├── AppState
        ├── Storage utilities (sessionStorage R/W)
        ├── API functions (searchTableau, sendToClaud)
        ├── Rendering functions (renderResults, renderMessage)
        ├── Event handlers (all addEventListener calls)
        └── Init function
```

---

## 9. Data Flow & Workflows

### 9.1 Workflow 1: First-Time Setup

```
USER ACTION                    APP RESPONSE                    EXTERNAL
──────────────────────────────────────────────────────────────────────
Open index.html           →   Load UI; show API key prompt
                              Check sessionStorage for key
                              If found → pre-fill + validate

Enter API key             →   Format validation (sk-ant-*)
                              Set status dot: yellow (unverified)
                              Store in sessionStorage

[First send message]      →   If 401 from Anthropic API →
                              Clear key; show error; prompt re-entry
                              If 200 → Set status dot: green (verified)
```

### 9.2 Workflow 2: Tableau Search & Select

```
USER ACTION                    APP RESPONSE                    EXTERNAL
──────────────────────────────────────────────────────────────────────
Type search term +
press Enter / click Go    →   Show loading state
                                                         →   GET Tableau
                                                             Public API
                                                         ←   JSON results
                          ←   Parse workbook array
                              Render result cards
                              (title, author, views, tags)

[If CORS error]           →   Show error banner
                              Enable manual context area
                              Suggest paste-URL fallback

Click workbook card       →   Highlight selected card
                              Set currentWorkbook state
                              Build system prompt
                              Clear messages array
                              Update chat header
                              Show quick prompt chips
                              Enable chat input
```

### 9.3 Workflow 3: Claude Conversation

```
USER ACTION                    APP RESPONSE                    EXTERNAL
──────────────────────────────────────────────────────────────────────
Type message +
press Enter               →   Validate: key exists + context set
                              Append user message to UI
                              Append to messages[]
                              Clear input field
                              Show loading bubble
                              Disable input + send btn

                                                         →   POST /v1/messages
                                                             {
                                                               model,
                                                               system: <prompt>,
                                                               messages: [...],
                                                               max_tokens
                                                             }
                                                             Header:
                                                             x-api-key: <key>
                                                             anthropic-dangerous-
                                                             direct-browser-access:
                                                             true

                                                         ←   { content: [{ text }] }

                          ←   Remove loading bubble
                              Append assistant message
                              Render formatted text
                              Auto-scroll to bottom
                              Re-enable input
                              Save session to sessionStorage
```

### 9.4 Workflow 4: Export Conversation

```
USER ACTION                    APP RESPONSE                    EXTERNAL
──────────────────────────────────────────────────────────────────────
Click Export button       →   Check messages[] not empty
                              Build export string:
                              ─────────────────────
                              TABLEAU × CLAUDE EXPORT
                              Date: [timestamp]
                              Workbook: [title]
                              Author: [author]
                              URL: [url]
                              ─────────────────────
                              [USER]: [message]
                              [CLAUDE]: [response]
                              ...
                              ─────────────────────

                              Create Blob(text, {type: text/plain})
                              Create object URL
                              Trigger download as .txt
                              Revoke object URL
```

### 9.5 Workflow 5: Manual Context (Private Workbooks)

```
USER ACTION                    APP RESPONSE                    EXTERNAL
──────────────────────────────────────────────────────────────────────
Paste text in manual
context textarea          →   Update manualContext state
                              Enable chat input (even without
                              selected workbook)
                              Update system prompt to include
                              manual context on next send

[Send message]            →   System prompt includes:
                              "Additional Context: [manualContext]"
                              Normal chat workflow proceeds
```

---

## 10. API Specifications

### 10.1 Tableau Public Search API

**Endpoint:**
```
GET https://public.tableau.com/api/search/query
```

**Query Parameters:**

| Parameter | Type | Value | Required |
|-----------|------|-------|----------|
| `query` | string | URL-encoded search term | Yes |
| `count` | integer | 12 (max results) | Yes |
| `language` | string | `"en"` | Yes |
| `type` | string | `"workbooks"` | Yes |

**Example Request:**
```
GET https://public.tableau.com/api/search/query?count=12&language=en&query=sales+dashboard&type=workbooks
```

**Response Schema (relevant fields):**
```json
{
  "hits": {
    "hit": [
      {
        "id": "string",
        "document": {
          "title": "string",
          "username": "string",
          "description": "string",
          "viewCount": 0,
          "tags": ["string"],
          "defaultViewRepoUrl": "string",
          "thumbnailStaticUrl": "string"
        }
      }
    ]
  }
}
```

**Workbook URL Construction:**
```javascript
const workbookUrl = `https://public.tableau.com/views/${document.defaultViewRepoUrl}`;
```

**Auth:** None required
**CORS:** May be blocked in some environments — handle with fallback
**Rate Limits:** Unknown; implement 500ms debounce on search input

---

### 10.2 Anthropic Claude Messages API

**Endpoint:**
```
POST https://api.anthropic.com/v1/messages
```

**Required Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `x-api-key` | User's API key |
| `anthropic-version` | `2023-06-01` |
| `anthropic-dangerous-direct-browser-access` | `true` |

**Request Body Schema:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "string (system prompt with workbook context)",
  "messages": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

**Response Schema:**
```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "string" }
  ],
  "model": "string",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  }
}
```

**Error Response:**
```json
{
  "type": "error",
  "error": {
    "type": "authentication_error | invalid_request_error | ...",
    "message": "string"
  }
}
```

**Error Handling Matrix:**

| HTTP Status | Error Type | User Message |
|-------------|-----------|--------------|
| 401 | authentication_error | "Invalid API key. Please check your key in Settings." |
| 429 | rate_limit_error | "Rate limit reached. Please wait a moment and try again." |
| 400 | invalid_request_error | "Request error. Try shortening your message." |
| 500 | api_error | "Anthropic API error. Please try again." |
| Network | CORS / timeout | "Network error. Check your connection." |

---

## 11. UI/UX Specifications

### 11.1 Design Language

**Aesthetic Direction:** Refined Enterprise Dark — think Bloomberg Terminal meets Figma. Precise, data-forward, sophisticated.

**Color Palette (CSS Custom Properties):**
```css
--bg-primary:     #0b0d10   /* Deep charcoal base */
--bg-surface:     #13151a   /* Card/panel surfaces */
--bg-elevated:    #1a1d24   /* Input fields, hover states */
--border-subtle:  #1f2330   /* Dividers */
--border-mid:     #2a2e3d   /* Active borders */
--text-primary:   #eceae4   /* Primary text */
--text-secondary: #8a8890   /* Metadata, labels */
--text-muted:     #3d3f47   /* Placeholders */
--accent-gold:    #d4a843   /* Primary accent - amber gold */
--accent-gold-dk: #b8902f   /* Hover state */
--accent-gold-lt: #e8bf6a   /* Light variant */
--accent-green:   #5dbe8a   /* Success / active status */
--accent-red:     #e06b6b   /* Error states */
--accent-blue:    #5b9cf6   /* Links */
```

**Typography:**
```
Display Font:  Playfair Display (Google Fonts) — headings, logo
Mono Font:     JetBrains Mono (Google Fonts) — code, metadata, labels
Body Font:     DM Sans (Google Fonts) — all prose, UI copy
```

**Sizing Scale:**
```
xs: 10px | sm: 12px | base: 14px | md: 16px | lg: 20px | xl: 24px | 2xl: 32px
```

**Spacing Scale:** 4px base unit — 4, 8, 12, 16, 20, 24, 32, 40, 48

**Border Radius:** 4px (tight), 8px (standard), 12px (card), 20px (pill)

**Shadows:**
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
--shadow-md: 0 4px 16px rgba(0,0,0,0.5);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
```

### 11.2 Layout Specification

**Grid Structure:**
```
Viewport
└── #topbar (height: 56px, fixed)
└── #app-layout (height: calc(100vh - 56px))
    ├── #sidebar (width: 300px, fixed, scrollable)
    └── #main-panel (flex: 1, display: flex, flex-direction: column)
        ├── #chat-header (height: 64px, flex-shrink: 0)
        ├── #quick-prompts (height: 48px, flex-shrink: 0, overflow-x: scroll)
        ├── #messages-area (flex: 1, overflow-y: auto)
        └── #input-bar (flex-shrink: 0, min-height: 72px)
```

**Responsive Breakpoints:**
```
Desktop (>= 900px): Two-column grid (sidebar + main)
Tablet (600–899px): Sidebar collapses to 240px
Mobile (< 600px):   Sidebar hidden; toggle button in topbar
```

### 11.3 Key Interaction States

**API Key Status Dot:**
- Grey (12px circle): No key entered
- Yellow pulse: Key entered, not yet verified
- Green glow: Key verified (first successful API call)
- Red flash: Authentication error

**Workbook Card States:**
- Default: `bg-surface` background, `border-subtle` border
- Hover: `bg-elevated`, subtle lift shadow
- Selected: `border-accent-gold` left border (3px), `bg-elevated`

**Send Button States:**
- Disabled (no context / no text): 30% opacity
- Ready: Full opacity, pointer cursor
- Loading: Spinner replaces arrow icon

**Chat Input States:**
- Idle: Standard border
- Focus: `border-accent-gold`
- Disabled (loading): Reduced opacity, `not-allowed` cursor

### 11.4 Animation Specifications

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Message bubble (new) | fade-up (opacity 0→1, translateY 8px→0) | 250ms | ease-out |
| Settings modal open | fade + scale (0.95→1) | 200ms | ease-out |
| Result cards | stagger fade-in (50ms delay each) | 200ms | ease |
| Status dot pulse | keyframe opacity 1→0.4→1 | 1.5s | ease-in-out, infinite |
| Loading dots | keyframe scale 0.8→1→0.8 | 1.2s | ease, staggered |
| Error banner | slide-down from top | 250ms | ease-out |
| Quick chip hover | background 150ms | 150ms | linear |

---

## 12. Security & Privacy Model

### 12.1 API Key Handling

```
Storage:     sessionStorage only (auto-clears on tab/browser close)
Key:         'tca_key' in sessionStorage
Transmission: Only in 'x-api-key' header to api.anthropic.com
Logging:     Never console.log, never in URL, never in DOM text
Masking:     <input type="password"> always
Clearing:    On auth error; on user request via Settings
```

### 12.2 Data Flows

| Data | Where It Goes | Stored |
|------|--------------|--------|
| API Key | Anthropic API (header only) | sessionStorage |
| Search queries | Tableau Public API | Not stored |
| Conversation messages | Anthropic API | sessionStorage (current session) |
| Workbook metadata | Displayed in UI only | sessionStorage (current session) |
| Manual context text | Anthropic API (system prompt) | Not persisted |

**Nothing is stored in localStorage, cookies, or sent to any analytics service.**

### 12.3 Third-Party Requests

The application makes requests to exactly three external origins:

| Domain | Purpose | Auth |
|--------|---------|------|
| `fonts.googleapis.com` | Google Fonts CSS | None |
| `fonts.gstatic.com` | Google Fonts files | None |
| `public.tableau.com` | Workbook search API | None |
| `api.anthropic.com` | Claude API | User's API key |

### 12.4 Content Security Policy

Recommended CSP header if self-hosting:
```
Content-Security-Policy:
  default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src https://api.anthropic.com https://public.tableau.com;
  script-src 'self' 'unsafe-inline';
  img-src 'self' data: https://public.tableau.com;
```

---

## 13. Error Handling Strategy

### 13.1 Error Classification

| Class | Examples | UX Response |
|-------|---------|-------------|
| **Auth errors** | Invalid key, expired key | Red error banner; settings modal opens |
| **Network errors** | No internet, timeout | Amber error banner; retry button shown |
| **API errors** | 429 rate limit, 500 server | Specific error message; auto-retry on 529 |
| **CORS errors** | Tableau API blocked | Info banner; manual input enabled/highlighted |
| **Input errors** | Empty message, no context | Inline validation; button disabled |

### 13.2 Error Banner Behavior

- Appears below quick-prompts bar
- Dismissible with × button
- Auto-dismisses after 8 seconds
- Does not interrupt conversation — previous messages remain

### 13.3 Retry Strategy

```javascript
async function sendWithRetry(payload, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await callClaudeAPI(payload);
      return response;
    } catch (err) {
      if (err.status === 529 && attempt < maxRetries) {
        await sleep(1000 * (attempt + 1)); // exponential backoff
        continue;
      }
      throw err;
    }
  }
}
```

---

## 14. Success Metrics & KPIs

### 14.1 Engagement Metrics (if analytics added in future)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Message | < 60 seconds from page load | Browser timing |
| Messages per Session | ≥ 5 | Session length |
| Workbooks Explored per Session | ≥ 2 | Selection events |
| Export Rate | > 20% of sessions | Export clicks |
| Return Usage | > 50% weekly return | (requires auth layer) |

### 14.2 Technical Metrics

| Metric | Target |
|--------|--------|
| Page load < 500ms | ✓ (no external JS bundles) |
| Lighthouse Performance Score | ≥ 90 |
| Lighthouse Accessibility Score | ≥ 85 |
| Zero JavaScript errors on load | ✓ |
| Works offline (after load) | Partial (UI works; API calls require connection) |

### 14.3 Qualitative Success Criteria

- A non-technical user can complete the full setup-to-insight workflow without documentation
- A Tableau developer rates the analysis quality ≥ 4/5 in usefulness
- No user data is leaked in any network request (verified by browser DevTools inspection)

---

## 15. Constraints, Assumptions & Dependencies

### 15.1 Technical Constraints

| Constraint | Impact |
|------------|--------|
| No backend server | All computation client-side; API keys visible to browser DevTools |
| Tableau Public CORS policy may vary | Fallback to manual input required; cannot be guaranteed |
| Anthropic API requires `anthropic-dangerous-direct-browser-access: true` header | Must be included; signals intentional browser-direct use |
| Single HTML file | All assets must be inlined or loaded from CDN |
| No build step | Cannot use TypeScript, JSX, or module bundlers |

### 15.2 Assumptions

- Users have a valid Anthropic API account and API key
- Users have access to a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Tableau Public API remains publicly accessible without authentication
- Anthropic API continues to support direct browser access with the documented header
- Google Fonts CDN remains accessible (fallback: system fonts)

### 15.3 Dependencies

| Dependency | Version | Type | Fallback |
|------------|---------|------|----------|
| Anthropic API | v1 (2023-06-01) | External API | None |
| Tableau Public API | Undocumented public | External API | Manual input |
| Google Fonts | Latest | CDN | System font stack |

---

## 16. Out of Scope

The following are explicitly excluded from v1.0:

| Feature | Reason Excluded |
|---------|----------------|
| Tableau Cloud / Server API (authenticated) | Requires PAT in browser (security risk without backend) |
| Streaming responses (SSE) | Adds complexity; not required for MVP |
| Image/screenshot analysis of dashboards | Requires vision API integration |
| Multi-user collaboration | Requires backend |
| Saved conversations across sessions | Requires backend or user auth |
| Custom branding / white-labeling | Future enterprise version |
| Tableau workbook file upload (.twbx) | Requires file parsing library (scope creep) |
| Mobile-native app (iOS/Android) | Separate product track |
| Integration with Tableau Cloud Pulse API | Requires Tableau auth |
| LLM model selection beyond Claude | Single-vendor focus for v1 |

---

## 17. Appendix

### 17.1 Quick Prompt Library

Default set of 6 quick prompts shown when a workbook is selected:

```
1. "Summarize what this workbook is about in 3 sentences"
2. "What data story is this dashboard trying to tell?"
3. "What visualizations and chart types are likely used?"
4. "What calculated fields or metrics might power this dashboard?"
5. "What are 3 insights a business leader should take from this?"
6. "How could this dashboard be improved?"
```

### 17.2 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in message input |
| `Escape` | Close settings modal |
| `/` (when input empty) | Focus chat input |
| `Ctrl/Cmd + E` | Export conversation |
| `Ctrl/Cmd + ,` | Open settings |

### 17.3 Glossary

| Term | Definition |
|------|-----------|
| **Workbook** | A Tableau file containing one or more dashboards and worksheets |
| **MCP** | Model Context Protocol — a standard for connecting AI models to external tools |
| **PAT** | Personal Access Token — authentication credential for Tableau Server/Cloud APIs |
| **System Prompt** | Instructions sent to Claude before the conversation that define its behavior and context |
| **sessionStorage** | Browser storage that persists only for the current browser tab/session |
| **CORS** | Cross-Origin Resource Sharing — browser security policy governing cross-domain requests |

### 17.4 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | May 2026 | Product Team | Initial draft |
| 0.9 | May 2026 | Product Team | Added security model, error handling, API specs |
| 1.0 | May 2026 | Product Team | Approved; ready for development |

---

*End of Document — Tableau × Claude PRD v1.0.0*

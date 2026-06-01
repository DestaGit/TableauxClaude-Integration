# TableauxClaude-Integration

1. Executive Summary
2. 
Tableau × Claude is a fully client-side, zero-backend web application that bridges the gap between Tableau's world-class data visualization ecosystem and Anthropic's Claude large language model. The application enables data analysts, business intelligence professionals, and non-technical stakeholders to discover, explore, and extract deep insights from Tableau Public workbooks through a natural language conversational interface — all running entirely in the browser with no server infrastructure required.

Key Value Propositions

- Zero infrastructure cost: Single HTML file, deployable anywhere static files are served
- Privacy-first architecture: No user data, API keys, or conversation history ever leaves the user's browser
- Immediate time-to-value: From zero to first insight in under 60 seconds
- Dual integration path: Live Tableau Public API search + manual context for private workbook analysis

2. Background & Problem Statement
   
2.1 The Tableau Knowledge Gap

Tableau Public hosts over 1 million community workbooks containing sophisticated data visualizations, analytical techniques, and domain insights. However, extracting actionable knowledge from these workbooks presents significant friction:

Discovery is keyword-dependent: Users must know what to search for Technique extraction requires expertise: Understanding how a dashboard was built requires Tableau-specific knowledge
Insight synthesis is manual: Interpreting data patterns across multiple views takes time and analytical skill
Documentation is sparse: Most public workbooks lack explanatory narrative

2.2 The AI Integration Gap

While LLMs like Claude excel at analysis, summarization, and explanation, they lack native connectivity to Tableau's data layer. Existing integration approaches require:

Backend servers and API proxies (infrastructure cost + maintenance)
Developer setup (Git, Node.js, config files — not accessible to non-technical users)
SaaS automation platforms (ongoing subscription cost, data leaves the org)

2.3 The Opportunity

A client-side application that directly connects the Tableau Public REST API with the Anthropic Messages API — using only browser-native fetch — can eliminate all of these barriers. The user provides their Anthropic API key once per session; everything else is automated.


AI tools were used as a development assistant to speed up implementation.

AI helped with:
- Initial Express route scaffolding
- React component structure
- SQLite schema setup
- Debugging integration issues

What I implemented and verified myself:
- Action item extraction logic from transcript text
- CRUD operations for action items
- Transcript history feature
- Status endpoint
- Frontend–backend API integration
- Testing the full workflow manually

LLM used:
Local transformers model (Xenova/distilgpt2) via @xenova/transformers.

Reason:
Using a local model ensures the app runs without external API dependencies and remains deployable without API keys.

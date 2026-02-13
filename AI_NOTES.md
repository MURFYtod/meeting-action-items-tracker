
---

# AI_NOTES.md

Create in project root.


AI tools were used to accelerate development while ensuring full understanding of the code.

## AI was used for:
- Scaffolding Express routes
- Building React UI structure
- Designing SQLite schema
- Debugging frontend/backend integration
- Deployment troubleshooting

## Manually verified:
- All API routes
- Database operations
- CRUD flows
- Extraction logic
- Deployment configuration
- Frontend API integration

## LLM used in the app
No external LLM API is used in the deployed version.

Action item extraction is implemented using:
- rule-based parsing (sentence splitting + keyword detection)

Reason:
This avoids API keys, reduces deployment complexity, and ensures the app runs reliably on free hosting.


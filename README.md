# SAFETY AI V3\n\nProfessional mobile-first interface built on the V2 real-AI architecture. Keep OPENAI_API_KEY server-side.\n\n# Safety AI — Real AI Version

This version connects the Photo Hazard Scanner and safety tools to the OpenAI Responses API.

Architecture: phone/browser -> Safety AI site -> /api/analyze -> OpenAI.

The API key is read only on the server. Do not put an API key in app.js or expose it in the browser.

Deployment: upload this project to a serverless host supporting the included Vercel function, add the environment variable OPENAI_API_KEY in the server/project settings, and redeploy.

The app supports real image input, photo hazard review, risk assessment, JSA/JHA, PTW checklists, incident investigation, HSE learning and interview assistance.

Safety note: AI is decision support. Site procedures, competent-person review and applicable regulations/standards remain required.

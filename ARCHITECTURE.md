# 🏗️ NVIDIA NIM Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Smartli Frontend                         │
│  (React Components, UI, User Interactions)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AI Gateway Layer                           │
│  lib/ai/gateway.ts - Routes requests to appropriate API         │
└───────────────────┬──────────────────────┬──────────────────────┘
                    │                       │
         ┌──────────┴─────────┐  ┌─────────┴──────────┐
         ▼                     ▼  ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  OpenRouter API │   │   NVIDIA NIM    │   │  Other APIs     │
│  (Gemini, etc.) │   │   (3 Models)    │   │  (Future)       │
└─────────────────┘   └────────┬────────┘   └─────────────────┘
                               │
                   ┌───────────┼───────────┐
                   ▼           ▼           ▼
           ┌──────────┐ ┌───────────┐ ┌─────────┐
           │ Kimi K3  │ │ DeepSeek  │ │   GPT   │
           │ (Vision) │ │ (Thinking)│ │  (Fast) │
           └──────────┘ └───────────┘ └─────────┘
```

## Request Flow

### 1. User Interaction Flow

```
User Input
    │
    ▼
┌───────────────────────┐
│  Smartli Component    │
│  (e.g., AI Chat Box)  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  streamAIResponse()   │
│  from gateway.ts      │
└───────────┬───────────┘
            │
            ├─── Check model.api ───┐
            │                        │
    ┌───────┴────────┐      ┌───────┴────────┐
    │ api='openrouter'│     │  api='nvidia'  │
    └───────┬────────┘      └───────┬────────┘
            │                        │
            ▼                        ▼
┌───────────────────────┐  ┌───────────────────────┐
│  OpenRouter Fetch     │  │  nvidia-client.ts     │
└───────────────────────┘  └───────┬───────────────┘
                                    │
                        ┌───────────┼───────────┐
                        │           │           │
                        ▼           ▼           ▼
                    callKimiK3  callDeepSeek  callGPT
                        │           │           │
                        └───────────┴───────────┘
                                    │
                                    ▼
                            NVIDIA NIM API
```

### 2. Model Routing Logic

```typescript
// config.ts defines which API each model uses
const models = [
  { id: 'google/gemini-...', api: 'openrouter' },
  { id: 'moonshotai/kimi-k3', api: 'nvidia' },
  { id: 'deepseek-ai/...', api: 'nvidia' },
  { id: 'openai/gpt-oss-20b', api: 'nvidia' }
];

// gateway.ts routes based on api property
if (model.api === 'nvidia') {
  return streamNvidiaResponse();
} else {
  return streamOpenRouterResponse();
}
```

## Component Architecture

### File Dependencies

```
┌──────────────────────────────────────────────────────────┐
│                      Your Components                      │
│  (pages, UI components, chat interface)                  │
└───────────────────────────┬──────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  gateway.ts      │    │ nvidia-client.ts │
    │  (Unified API)   │────│ (Direct Access)  │
    └────────┬─────────┘    └─────────┬────────┘
             │                         │
             ▼                         ▼
    ┌─────────────┐          ┌────────────────┐
    │  config.ts  │          │  axios/openai  │
    │  (Models)   │          │  (HTTP libs)   │
    └─────────────┘          └────────────────┘
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │ .env.local   │
                  │ (API Keys)   │
                  └──────────────┘
```

## Data Flow

### Streaming Response

```
NVIDIA API
    │ (Server-Sent Events or Stream)
    ▼
┌────────────────────┐
│ nvidia-client.ts   │
│ - Receives stream  │
│ - Formats data     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   gateway.ts       │
│ - Unified format   │
│ - Error handling   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  ReadableStream    │
│  (Web API)         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  React Component   │
│  - Display tokens  │
│  - Update UI       │
└────────────────────┘
```

### Non-Streaming Response

```
NVIDIA API
    │ (JSON Response)
    ▼
┌────────────────────┐
│ nvidia-client.ts   │
│ - Parse response   │
│ - Extract content  │
│ - Extract reasoning│
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   gateway.ts       │
│ - Format for UI    │
│ - Add metadata     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Component State   │
│  - Full response   │
│  - Display all     │
└────────────────────┘
```

## API Key Security Flow

```
┌─────────────────┐
│   .env.local    │  ← Your API key stored here
│  (NOT in git)   │
└────────┬────────┘
         │
         ▼  process.env.NVIDIA_API_KEY
┌─────────────────┐
│ Server Runtime  │  ← Next.js loads at build/runtime
│  (Node.js)      │
└────────┬────────┘
         │
         ▼  Available in server code only
┌─────────────────┐
│ nvidia-client   │  ← Uses key in Authorization header
│ API routes      │
│ Server actions  │
└────────┬────────┘
         │
         ▼  Authorization: Bearer nvapi-...
┌─────────────────┐
│  NVIDIA API     │
└─────────────────┘

❌ Client Code CANNOT access process.env.NVIDIA_API_KEY
✅ Only server-side code can use the key
```

## Model Selection Flow

```
User clicks model selector
    │
    ▼
Component state updated
    │
    ▼
Request sent with model ID
    │ { model: 'moonshotai/kimi-k3' }
    ▼
┌────────────────────────────┐
│  gateway.ts                │
│  1. Find model in AI_MODELS│
│  2. Check model.api value  │
│  3. Route to correct API   │
└───────────┬────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
OpenRouter       NVIDIA NIM
    │                │
    └────────┬───────┘
             │
             ▼
      Response returned
```

## Error Handling Flow

```
API Call Made
    │
    ├─── Success ────────────────┐
    │                            │
    │                            ▼
    │                    Return response
    │
    └─── Error ──────────────────┐
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Try/Catch Block │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            Network Error              API Error (4xx/5xx)
                    │                         │
                    │                         ▼
                    │                 ┌──────────────────┐
                    │                 │ error.response   │
                    │                 │ - status code    │
                    │                 │ - error message  │
                    │                 └────────┬─────────┘
                    │                          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Log error       │
                        │ Return to user  │
                        └─────────────────┘
```

## Testing Architecture

```
┌──────────────────────────────────────────────────┐
│              Testing Layers                      │
└──────────────────────────────────────────────────┘

1. Unit Tests (Future)
   ├─ Test individual functions
   └─ Mock NVIDIA API responses

2. Integration Tests
   ├─ scripts/test-nvidia.ts  ← Run this now!
   └─ Tests real API calls

3. API Endpoint Tests
   ├─ app/api/nvidia/route.ts
   └─ curl or Postman tests

4. Component Tests (Future)
   ├─ QUICK_START_EXAMPLE.tsx
   └─ Manual testing in browser
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Production Setup               │
└─────────────────────────────────────────┘

Development:
  .env.local (local only)
      │
      ▼
  npm run dev
      │
      ▼
  localhost:3000

Production (Vercel/etc):
  Environment Variables Dashboard
      │ (Add NVIDIA_API_KEY here)
      ▼
  Build Process
      │
      ▼
  Deployed App
  (process.env.NVIDIA_API_KEY available)
```

## Key Design Decisions

### 1. Two HTTP Clients
- **axios**: Used for Kimi K3 (vision support, streaming)
- **openai SDK**: Used for DeepSeek & GPT (consistent interface)

### 2. Gateway Pattern
- Single entry point for all AI requests
- Easy to add new providers
- Consistent interface for components

### 3. Type Safety
- Full TypeScript definitions
- Compile-time checking
- IntelliSense support

### 4. Security First
- API keys in environment variables
- Server-side only API calls
- No client exposure

### 5. Flexibility
- Direct client access available
- Gateway for unified interface
- Easy to extend

## Extension Points

Want to add more features? Here's where:

```
Add new model:
  └─ lib/ai/config.ts (add to AI_MODELS)

Add new provider:
  └─ lib/ai/gateway.ts (add routing logic)

Add new features:
  └─ lib/ai/nvidia-client.ts (add functions)

Add UI components:
  └─ components/ (use gateway or client)

Add API endpoints:
  └─ app/api/ (create new routes)
```

## Summary

The architecture is designed for:

✅ **Modularity** - Each file has a clear purpose  
✅ **Scalability** - Easy to add new models/providers  
✅ **Security** - API keys protected, server-side only  
✅ **Type Safety** - Full TypeScript support  
✅ **Flexibility** - Multiple ways to use the API  
✅ **Maintainability** - Clear separation of concerns  

All components work together to provide a seamless, secure, and powerful AI integration for Smartli.

# NVIDIA NIM Integration for Smartli

This integration adds support for NVIDIA NIM API, providing access to powerful AI models including Kimi K3, DeepSeek V4, and GPT OSS 20B.

## Setup

### 1. Environment Configuration

Your NVIDIA API key is already configured in `.env.local`:

```env
NVIDIA_API_KEY=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
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 2. Dependencies

Install required packages:

```bash
npm install axios openai
```

## Available Models

### 1. Kimi K3 (`moonshotai/kimi-k3`)
- **Provider:** Moonshot AI
- **Capabilities:** Vision-capable, advanced reasoning
- **Max Tokens:** 16,384
- **Special Features:** 
  - Supports image inputs
  - Reasoning effort levels (low, medium, high, max)
  - Multimodal understanding

### 2. DeepSeek V4 Flash (`deepseek-ai/deepseek-v4-flash-0731`)
- **Provider:** DeepSeek
- **Capabilities:** Fast reasoning, thinking process
- **Max Tokens:** 16,384
- **Special Features:**
  - Exposes internal reasoning/thinking process
  - Configurable reasoning effort
  - Optimized for speed

### 3. GPT OSS 20B (`openai/gpt-oss-20b`)
- **Provider:** OpenAI (via NVIDIA)
- **Capabilities:** General purpose, open-source variant
- **Max Tokens:** 4,096
- **Special Features:**
  - Familiar GPT interface
  - Cost-effective

## Usage

### Option 1: Using the Unified Gateway (Recommended)

The easiest way to use NVIDIA models is through Smartli's existing AI gateway:

```typescript
import { streamAIResponse } from '@/lib/ai/gateway';

// Use any NVIDIA model
const stream = await streamAIResponse({
  prompt: 'Explain quantum computing',
  context: 'Additional context here',
  mode: 'explainer',
  model: 'moonshotai/kimi-k3', // or 'deepseek-ai/deepseek-v4-flash-0731' or 'openai/gpt-oss-20b'
});
```

### Option 2: Direct NVIDIA Client Usage

For more control, use the NVIDIA client directly:

#### Kimi K3 - Text Only

```typescript
import { callKimiK3 } from '@/lib/ai/nvidia-client';

const response = await callKimiK3(
  [
    {
      role: 'user',
      content: 'Explain photosynthesis'
    }
  ],
  {
    temperature: 1,
    max_tokens: 16384,
    stream: false,
    reasoning_effort: 'max'
  }
);

console.log(response.data);
```

#### Kimi K3 - With Vision

```typescript
import { callKimiK3 } from '@/lib/ai/nvidia-client';

const response = await callKimiK3(
  [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.jpg'
          }
        }
      ]
    }
  ],
  {
    stream: false,
    reasoning_effort: 'max'
  }
);
```

#### DeepSeek - With Reasoning

```typescript
import { callDeepSeek } from '@/lib/ai/nvidia-client';

const response = await callDeepSeek(
  [
    {
      role: 'user',
      content: 'Solve this problem: Which number is larger, 9.11 or 9.8?'
    }
  ],
  {
    temperature: 1,
    thinking: true, // Enable thinking process
    reasoning_effort: 'high'
  }
);

// Access the reasoning
const reasoning = response.choices[0]?.message?.reasoning_content;
const answer = response.choices[0]?.message?.content;

console.log('Reasoning:', reasoning);
console.log('Answer:', answer);
```

#### GPT OSS 20B

```typescript
import { callGPT } from '@/lib/ai/nvidia-client';

const response = await callGPT(
  [
    {
      role: 'user',
      content: 'Explain the theory of relativity'
    }
  ],
  {
    temperature: 1,
    max_tokens: 4096
  }
);

console.log(response.choices[0]?.message?.content);
```

#### Multi-turn Conversations

```typescript
import { callDeepSeek } from '@/lib/ai/nvidia-client';

const response = await callDeepSeek(
  [
    {
      role: 'user',
      content: 'What is machine learning?'
    },
    {
      role: 'assistant',
      content: 'Machine learning is a subset of AI...'
    },
    {
      role: 'user',
      content: 'How does deep learning differ?'
    }
  ]
);
```

### Option 3: Unified Model Caller

Use a single function for any NVIDIA model:

```typescript
import { callNvidiaModel } from '@/lib/ai/nvidia-client';

const response = await callNvidiaModel(
  'deepseek-ai/deepseek-v4-flash-0731',
  [{ role: 'user', content: 'Hello!' }],
  { 
    temperature: 0.7,
    stream: false 
  }
);
```

## Streaming Responses

All models support streaming for real-time responses:

```typescript
import { callDeepSeek } from '@/lib/ai/nvidia-client';

const response = await callDeepSeek(
  [{ role: 'user', content: 'Write a long essay...' }],
  { stream: true }
);

// Handle the stream
// (Implementation depends on whether using axios or OpenAI SDK)
```

## Model Selection in UI

The models are automatically available in the Smartli UI through the `AI_MODELS` configuration:

```typescript
// From lib/ai/config.ts
const models = [
  {
    id: 'moonshotai/kimi-k3',
    name: 'Kimi K3',
    provider: 'Moonshot AI',
    api: 'nvidia'
  },
  {
    id: 'deepseek-ai/deepseek-v4-flash-0731',
    name: 'DeepSeek V4',
    provider: 'DeepSeek',
    api: 'nvidia'
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT OSS 20B',
    provider: 'OpenAI',
    api: 'nvidia'
  }
];
```

## Advanced Features

### Reasoning Effort Levels

Control how much computational effort the model spends on reasoning:

- `low`: Fast, less thorough
- `medium`: Balanced
- `high`: More thorough
- `max`: Most thorough (Kimi K3 only)

```typescript
const response = await callKimiK3(messages, {
  reasoning_effort: 'max'
});
```

### Thinking Process (DeepSeek)

DeepSeek can expose its internal thinking:

```typescript
const response = await callDeepSeek(messages, {
  thinking: true,
  reasoning_effort: 'high'
});

const thinking = response.choices[0]?.message?.reasoning_content;
```

### Temperature Control

Adjust creativity/randomness (0.0 = deterministic, 2.0 = very creative):

```typescript
const response = await callGPT(messages, {
  temperature: 0.7 // Balanced
});
```

## Error Handling

```typescript
try {
  const response = await callDeepSeek(messages);
} catch (error) {
  if (error.response) {
    console.error(`NVIDIA API Error: HTTP ${error.response.status}`);
    console.error(error.response.data);
  } else {
    console.error('Network or configuration error:', error);
  }
}
```

## Security Best Practices

1. ✅ API key is stored in `.env.local` (not committed to git)
2. ✅ `.env.local` is in `.gitignore`
3. ✅ API key is never exposed in client-side code
4. ✅ All API calls should be made from server-side code (API routes, server components)

## Testing

See `nvidia-examples.ts` for complete working examples of each model.

## Troubleshooting

### API Key Not Found

**Error:** `NVIDIA_API_KEY is not defined`

**Solution:** Ensure `.env.local` exists and contains your API key. Restart the dev server after adding it.

### Model Not Available

**Error:** `Model not found in configuration`

**Solution:** Check that the model ID matches exactly what's in `config.ts`.

### Streaming Issues

If streaming doesn't work as expected, try setting `stream: false` first to ensure the basic API call works.

## Next Steps

1. Test the integration with the examples in `nvidia-examples.ts`
2. Integrate NVIDIA models into your Smartli UI components
3. Consider adding model-specific features (e.g., image upload for Kimi K3)
4. Monitor usage and costs through NVIDIA's dashboard

## Resources

- [NVIDIA NIM Documentation](https://docs.nvidia.com/nim/)
- [NVIDIA API Catalog](https://build.nvidia.com/)
- [OpenAI SDK Documentation](https://github.com/openai/openai-node)

## User

Prompt: Plan a Sidebar Integration for My Web App

You are GPT-5.6 acting as a senior product designer, UX architect, and full-stack engineer.

I want to add a collapsible sidebar to my existing web application. The sidebar will act as the primary navigation and history interface for AI-powered learning sessions.

Core Features

The sidebar should contain:

1. New Explainer

A prominent "New Explainer" action.

When clicked:

Start a completely new explainer/chat session.
Clear the current active conversation from the main workspace.
Create a new unique session ID.
The new session should automatically appear in the sidebar history once the user starts interacting with it.
The session should have an appropriate title, either generated from the first interaction or assigned automatically.
2. New Quiz

A prominent "New Quiz" action.

When clicked:

Start a completely new quiz session.
Create a unique quiz/session ID.
Open the quiz experience in the main workspace.
Save the quiz in the user's history.
Allow the user to return to an unfinished or completed quiz later.
Preserve quiz state, including questions, answers, score/progress, and relevant metadata.
3. Previous Chats / Sessions

The sidebar should display the user's previous sessions.

There should be a clear distinction between:

Explainer sessions
Quiz sessions

Each history item should ideally show:

Session title
Session type (Explainer or Quiz)
Last updated timestamp
Optional icon indicating the session type
Active/selected state

Clicking a previous session should:

Navigate to that exact session.
Restore its complete state.
Display the conversation or quiz exactly where the user left it.
Update the sidebar to indicate which session is currently active.
4. Collapsible Sidebar

The sidebar must be collapsible.

Expanded state:

Show "New Explainer"
Show "New Quiz"
Show previous session titles
Show relevant icons/metadata

Collapsed state:

Reduce to a narrow icon-only sidebar.
Keep the two creation actions accessible.
Keep navigation/history accessible through icons or an appropriate compact interaction.
The currently active session should remain visually identifiable.

Include a smooth transition/animation between expanded and collapsed states.

UX Requirements

Design the sidebar so that it feels similar to a modern AI/chat application.

Consider:

Clear visual hierarchy
Excellent spacing
Active-session highlighting
Hover states
Keyboard accessibility
Tooltips when the sidebar is collapsed
Mobile/responsive behavior
Long session titles
Empty history state
Loading state
Error state
Large numbers of previous sessions
Scrollable history without making the entire page scroll
Confirmation behavior when starting a new session if there is unsaved state

Do not make the sidebar unnecessarily complicated.

Data & State Architecture

Plan how sessions should be represented.

Propose an appropriate data model for something like:

id
type
title
createdAt
updatedAt
messages
quizState where applicable
status
Any other fields you believe are necessary

Explain how the application should:

Create sessions
Load sessions
Update sessions
Persist sessions
Retrieve session history
Delete/archive sessions if appropriate
Restore a session
Handle the active session
Prevent accidental loss of state

Consider whether session history should be:

Stored locally
Stored in a backend/database
Synced with the user's account
Cached client-side

Recommend the best approach based on a production web application.

Routing

Plan how URLs/routes should work.

For example:

/explainer/:sessionId

/quiz/:sessionId

or another architecture if you believe there is a better approach.

The user should be able to:

Refresh the page and remain in the same session.
Copy a session URL.
Use browser back/forward navigation.
Directly open an existing session.
Navigate between Explainer and Quiz sessions without losing state.
Component Architecture

Propose a clean component structure.

For example:

App
├── Sidebar
│   ├── NewExplainerButton
│   ├── NewQuizButton
│   ├── SessionHistory
│   │   ├── ExplainerHistory
│   │   └── QuizHistory
│   └── SidebarToggle
│
└── MainContent
    ├── ExplainerView
    └── QuizView


Adapt this structure to my existing application rather than blindly following it.

State Management

Explain what state should live:

Globally
In the sidebar
In the current page/session
In URL parameters
On the server

Pay particular attention to avoiding:

Duplicate sessions
Race conditions
Lost messages
Incorrect active-session state
Stale sidebar history
State disappearing when navigating between sessions
Responsive Design

Explain how the sidebar should behave on:

Desktop
Tablet
Mobile

On mobile, consider whether the sidebar should become:

A drawer
An overlay
A bottom sheet
Another suitable pattern

Choose the approach that provides the best UX.

Performance

The history could eventually contain hundreds or thousands of sessions.

Explain how to handle:

Pagination
Lazy loading
Virtualized lists if necessary
Caching
Optimistic updates
Loading states
Efficient session retrieval

Do not over-engineer the initial implementation, but make the architecture extensible.

Security & Data Isolation

If users have accounts, ensure one user cannot access another user's sessions.

Explain:

Session authorization
Backend validation
Access control
Route protection
Any important security considerations

Never rely solely on the client to enforce ownership.

Deliverables

Before writing implementation code, give me a detailed implementation plan containing:

UX flow
Sidebar layout
Component hierarchy
Data model
State-management architecture
Routing architecture
Backend/API requirements
Database requirements
Responsive behavior
Loading/error/empty states
Performance considerations
Security considerations
Migration/integration strategy
Step-by-step implementation plan

For each architectural decision, explain why you recommend it and mention reasonable alternatives where relevant.

Important Instruction

Do not immediately rewrite my application or generate a large amount of code.

First inspect and understand my existing architecture, framework, components, routing, state management, API layer, and database structure.

Then tell me exactly:

What needs to change
Which existing components can be reused
Which new components should be created
Which files are likely to change
What backend/database changes are required
What risks or compatibility issues you see

If information about my existing application is missing, ask me for the relevant files or code before making assumptions.

The goal is to integrate this sidebar cleanly into my existing application rather than building a disconnected feature.

For now, only do the frontend design of this.

## Assistant

<thinking>
**Inspecting frontend design**

The user wants to inspect the existing architecture, focusing on frontend design first, so I need to browse the project. It seems likely that I'm dealing with an app. Initially, I don't need to write any code but will focus on creating a detailed implementation plan after the inspection. I might use my UI skills, checking if emil-design-eng or Apple design insights are relevant. I'll have to gather the necessary tools and understand the root path, listing the directory from the exact root.
</thinking>

I’ll first map the existing frontend structure—framework, routes, layout, state, and session-related components—without changing files. Then I’ll produce a tailored sidebar integration plan that stays frontend-only and calls out any backend assumptions separately.

**Tool Call: List the `C:\Users\Tanush\Desktop\Coding\Smartli V2` directory's contents**
Status: Completed

# Folders:
Smartli V2\.claude
Smartli V2\.next
Smartli V2\app
Smartli V2\components
Smartli V2\hooks
Smartli V2\lib
Smartli V2\node_modules
Smartli V2\public
Smartli V2\types

# Files:
Smartli V2\components.json
Smartli V2\next-env.d.ts
Smartli V2\package-lock.json
Smartli V2\package.json
Smartli V2\postcss.config.js
Smartli V2\tailwind.config.js
Smartli V2\tsconfig.json


## Assistant

<thinking>
**Inspecting directories**

I need to check relevant directories and make a parallel list of packages. I might consider using grep to filter through them. First, I’ll look at the package files and try to list what’s in app/components/hooks/lib/types. This should give me a clearer idea of what needs to be done or what I'm working with. It feels like there’s a systematic way to approach this, but I want to make sure I cover everything needed!
</thinking>

**Tool Call: List the `Smartli V2\app` directory's contents**
Status: Completed

# Folders:
Smartli V2\app\account
Smartli V2\app\ai
Smartli V2\app\analytics
Smartli V2\app\api
Smartli V2\app\auth
Smartli V2\app\focus
Smartli V2\app\learning
Smartli V2\app\plan
Smartli V2\app\pricing
Smartli V2\app\settings
Smartli V2\app\tasks

# Files:
Smartli V2\app\globals.css
Smartli V2\app\layout.tsx
Smartli V2\app\page.tsx
Smartli V2\app\template.tsx


**Tool Call: List the `Smartli V2\components` directory's contents**
Status: Completed

# Folders:
Smartli V2\components\ai
Smartli V2\components\dashboard
Smartli V2\components\focus
Smartli V2\components\learning
Smartli V2\components\navigation
Smartli V2\components\timer
Smartli V2\components\ui


**Tool Call: List the `Smartli V2\hooks` directory's contents**
Status: Completed


# Files:
Smartli V2\hooks\useAIStream.ts


**Tool Call: List the `Smartli V2\lib` directory's contents**
Status: Completed

# Folders:
Smartli V2\lib\ai
Smartli V2\lib\supabase
Smartli V2\lib\utils

# Files:
Smartli V2\lib\utils.ts


**Tool Call: List the `Smartli V2\types` directory's contents**
Status: Completed


# Files:
Smartli V2\types\index.ts


**Tool Call: Read file `package.json` (lines 1-240)**
Status: Completed

```Smartli V2\package.json
     1	{
     2	  "name": "smartli",
     3	  "version": "0.1.0",
     4	  "private": true,
     5	  "scripts": {
     6	    "dev": "next dev",
     7	    "build": "next build",
     8	    "start": "next start",
     9	    "lint": "next lint"
    10	  },
    11	  "dependencies": {
    12	    "@radix-ui/react-dialog": "^1.1.23",
    13	    "@radix-ui/react-slot": "^1.3.3",
    14	    "@radix-ui/react-tooltip": "^1.2.16",
    15	    "@supabase/ssr": "^0.1.0",
    16	    "@supabase/supabase-js": "^2.43.0",
    17	    "class-variance-authority": "^0.7.1",
    18	    "clsx": "^2.1.1",
    19	    "crypto-js": "^4.2.0",
    20	    "framer-motion": "^11.0.0",
    21	    "lucide-react": "^0.378.0",
    22	    "mammoth": "^1.6.0",
    23	    "motion": "^13.1.1",
    24	    "next": "14.2.3",
    25	    "pdfjs-dist": "^4.0.379",
    26	    "react": "^18",
    27	    "react-dom": "^18",
    28	    "tailwind-merge": "^2.2.2"
    29	  },
    30	  "devDependencies": {
    31	    "@types/crypto-js": "^4.2.2",
    32	    "@types/node": "^20",
    33	    "@types/react": "^18",
    34	    "@types/react-dom": "^18",
    35	    "autoprefixer": "^10",
    36	    "eslint": "^8",
    37	    "eslint-config-next": "14.2.3",
    38	    "postcss": "^8",
    39	    "tailwindcss": "^3.4.1",
    40	    "typescript": "^5"
    41	  }
    42	}

```


**Tool Call: Search files for regex `session|quiz|explainer|chat|message|history|conversation|router|supabase|prisma|firebase`**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L96:101

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GlobalError: () => (/* reexport default from dynamic */ next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default.a),\n/* harmony export */   __next_app__: () => (/* binding */ __next_app__),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   pages: () => (/* binding */ pages),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   tree: () => (/* binding */ tree)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-page/module.compiled */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/module.compiled.js?d969\");\n/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/client/components/error-boundary */ \"(rsc)/./node_modules/next/dist/client/components/error-boundary.js\");\n/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/app-render/entry-base */ \"(rsc)/./node_modules/next/dist/server/app-render/entry-base.js\");\n/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};\n/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__) if([\"default\",\"tree\",\"pages\",\"GlobalError\",\"originalPathname\",\"__next_app__\",\"routeModule\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]\n/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);\n\"TURBOPACK { transition: next-ssr }\";\n\n\n// We inject the tree and pages here so that we can use them in the route\n// module.\nconst tree = {\n        children: [\n        '',\n        {\n        children: [\n        'ai',\n        {\n        children: ['__PAGE__', {}, {\n          page: [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/ai/page.tsx */ \"(rsc)/./app/ai/page.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\ai\\\\page.tsx\"],\n          \n        }]\n      },\n        {\n        \n        \n      }\n      ]\n      },\n        {\n        'layout': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/layout.tsx */ \"(rsc)/./app/layout.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\layout.tsx\"],\n'template': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/template.tsx */ \"(rsc)/./app/template.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\template.tsx\"],\n'not-found': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! next/dist/client/components/not-found-error */ \"(rsc)/./node_modules/next/dist/client/components/not-found-error.js\", 23)), \"next/dist/client/components/not-found-error\"],\n        \n      }\n      ]\n      }.children;\nconst pages = [\"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\ai\\\\page.tsx\"];\n\n\nconst __next_app_require__ = __webpack_require__\nconst __next_app_load_chunk__ = () => Promise.resolve()\nconst originalPathname = \"/ai/page\";\nconst __next_app__ = {\n    require: __next_app_require__,\n    loadChunk: __next_app_load_chunk__\n};\n\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppPageRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_PAGE,\n        page: \"/ai/page\",\n        pathname: \"/ai\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\",\n        appPaths: []\n    },\n    userland: {\n        loaderTree: tree\n    }\n});\n\n//# sourceMappingURL=app-page.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhaSUyRnBhZ2UmcGFnZT0lMkZhaSUyRnBhZ2UmYXBwUGF0aHM9JTJGYWklMkZwYWdlJnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYWklMkZwYWdlLnRzeCZhcHBEaXI9QyUzQSU1Q1VzZXJzJTVDVGFudXNoJTVDRGVza3RvcCU1Q0NvZGluZyU1Q1NtYXJ0bGklMjBWMiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDVGFudXNoJTVDRGVza3RvcCU1Q0NvZGluZyU1Q1NtYXJ0bGklMjBWMiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGFBQWEsc0JBQXNCO0FBQ2lFO0FBQ3JDO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyx1QkFBdUIsOElBQXNHO0FBQzdIO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EseUJBQXlCLDRJQUFvRztBQUM3SCxtQkFBbUIsZ0pBQXNHO0FBQ3pILG9CQUFvQiwwTkFBZ0Y7QUFDcEc7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ3VCO0FBQzZEO0FBQ3BGLDZCQUE2QixtQkFBbUI7QUFDaEQ7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ3VEO0FBQ3ZEO0FBQ08sd0JBQXdCLDhHQUFrQjtBQUNqRDtBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpLz81ZjZlIl0sInNvdXJjZXNDb250ZW50IjpbIlwiVFVSQk9QQUNLIHsgdHJhbnNpdGlvbjogbmV4dC1zc3IgfVwiO1xuaW1wb3J0IHsgQXBwUGFnZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXBhZ2UvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuLy8gV2UgaW5qZWN0IHRoZSB0cmVlIGFuZCBwYWdlcyBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgdHJlZSA9IHtcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgJycsXG4gICAgICAgIHtcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgJ2FpJyxcbiAgICAgICAge1xuICAgICAgICBjaGlsZHJlbjogWydfX1BBR0VfXycsIHt9LCB7XG4gICAgICAgICAgcGFnZTogWygpID0+IGltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcYXBwXFxcXGFpXFxcXHBhZ2UudHN4XCIpLCBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFxhaVxcXFxwYWdlLnRzeFwiXSxcbiAgICAgICAgICBcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgfVxuICAgICAgXVxuICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAnbGF5b3V0JzogWygpID0+IGltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcYXBwXFxcXGxheW91dC50c3hcIiksIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcYXBwXFxcXGxheW91dC50c3hcIl0sXG4ndGVtcGxhdGUnOiBbKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tNb2RlOiBcImVhZ2VyXCIgKi8gXCJDOlxcXFxVc2Vyc1xcXFxUYW51c2hcXFxcRGVza3RvcFxcXFxDb2RpbmdcXFxcU21hcnRsaSBWMlxcXFxhcHBcXFxcdGVtcGxhdGUudHN4XCIpLCBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFx0ZW1wbGF0ZS50c3hcIl0sXG4nbm90LWZvdW5kJzogWygpID0+IGltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwibmV4dC9kaXN0L2NsaWVudC9jb21wb25lbnRzL25vdC1mb3VuZC1lcnJvclwiKSwgXCJuZXh0L2Rpc3QvY2xpZW50L2NvbXBvbmVudHMvbm90LWZvdW5kLWVycm9yXCJdLFxuICAgICAgICBcbiAgICAgIH1cbiAgICAgIF1cbiAgICAgIH0uY2hpbGRyZW47XG5jb25zdCBwYWdlcyA9IFtcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFxhaVxcXFxwYWdlLnRzeFwiXTtcbmV4cG9ydCB7IHRyZWUsIHBhZ2VzIH07XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdsb2JhbEVycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9jbGllbnQvY29tcG9uZW50cy9lcnJvci1ib3VuZGFyeVwiO1xuY29uc3QgX19uZXh0X2FwcF9yZXF1aXJlX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fXG5jb25zdCBfX25leHRfYXBwX2xvYWRfY2h1bmtfXyA9ICgpID0+IFByb21pc2UucmVzb2x2ZSgpXG5leHBvcnQgY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FpL3BhZ2VcIjtcbmV4cG9ydCBjb25zdCBfX25leHRfYXBwX18gPSB7XG4gICAgcmVxdWlyZTogX19uZXh0X2FwcF9yZXF1aXJlX18sXG4gICAgbG9hZENodW5rOiBfX25leHRfYXBwX2xvYWRfY2h1bmtfX1xufTtcbmV4cG9ydCAqIGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2FwcC1yZW5kZXIvZW50cnktYmFzZVwiO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUGFnZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUEFHRSxcbiAgICAgICAgcGFnZTogXCIvYWkvcGFnZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYWlcIixcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmVuJ3QgdXNlZCBpbiBwcm9kdWN0aW9uLlxuICAgICAgICBidW5kbGVQYXRoOiBcIlwiLFxuICAgICAgICBmaWxlbmFtZTogXCJcIixcbiAgICAgICAgYXBwUGF0aHM6IFtdXG4gICAgfSxcbiAgICB1c2VybGFuZDoge1xuICAgICAgICBsb2FkZXJUcmVlOiB0cmVlXG4gICAgfVxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1wYWdlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fai%2Fpage&page=%2Fai%2Fpage&appPaths=%2Fai%2Fpage&pagePath=private-next-app-dir%2Fai%2Fpage.tsx&appDir=C%3A%5CUsers%5CTanush%5CDesktop%5CCoding%5CSmartli%20V2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CTanush%5CDesktop%5CCoding%5CSmartli%20V2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L107:111

```
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./components/navigation/app-dock.tsx */ \"(ssr)/./components/navigation/app-dock.tsx\"));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1jbGllbnQtZW50cnktbG9hZGVyLmpzP21vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNhcHAlNUMlNUNnbG9iYWxzLmNzcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDY29tcG9uZW50cyU1QyU1Q25hdmlnYXRpb24lNUMlNUNhcHAtZG9jay50c3glMjIlMkMlMjJpZHMlMjIlM0ElNUIlMjJBcHBEb2NrJTIyJTVEJTdEJnNlcnZlcj10cnVlISIsIm1hcHBpbmdzIjoiQUFBQSxvTEFBc0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpLz9lMjg4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiLCB3ZWJwYWNrRXhwb3J0czogW1wiQXBwRG9ja1wiXSAqLyBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGNvbXBvbmVudHNcXFxcbmF2aWdhdGlvblxcXFxhcHAtZG9jay50c3hcIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Ccomponents%5C%5Cnavigation%5C%5Capp-dock.tsx%22%2C%22ids%22%3A%5B%22AppDock%22%5D%7D&server=true!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L131:136

```
/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L137:141

```
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("Promise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/app-router.js */ \"(ssr)/./node_modules/next/dist/client/components/app-router.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/client-page.js */ \"(ssr)/./node_modules/next/dist/client/components/client-page.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/error-boundary.js */ \"(ssr)/./node_modules/next/dist/client/components/error-boundary.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/layout-router.js */ \"(ssr)/./node_modules/next/dist/client/components/layout-router.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/not-found-boundary.js */ \"(ssr)/./node_modules/next/dist/client/components/not-found-boundary.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/render-from-template-context.js */ \"(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js\", 23));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1jbGllbnQtZW50cnktbG9hZGVyLmpzP21vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNub2RlX21vZHVsZXMlNUMlNUNuZXh0JTVDJTVDZGlzdCU1QyU1Q2NsaWVudCU1QyU1Q2NvbXBvbmVudHMlNUMlNUNhcHAtcm91dGVyLmpzJTIyJTJDJTIyaWRzJTIyJTNBJTVCJTVEJTdEJm1vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNub2RlX21vZHVsZXMlNUMlNUNuZXh0JTVDJTVDZGlzdCU1QyU1Q2NsaWVudCU1QyU1Q2NvbXBvbmVudHMlNUMlNUNjbGllbnQtcGFnZS5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDbm9kZV9tb2R1bGVzJTVDJTVDbmV4dCU1QyU1Q2Rpc3QlNUMlNUNjbGllbnQlNUMlNUNjb21wb25lbnRzJTVDJTVDZXJyb3ItYm91bmRhcnkuanMlMjIlMkMlMjJpZHMlMjIlM0ElNUIlNUQlN0QmbW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyQyUzQSU1QyU1Q1VzZXJzJTVDJTVDVGFudXNoJTVDJTVDRGVza3RvcCU1QyU1Q0NvZGluZyU1QyU1Q1NtYXJ0bGklMjBWMiU1QyU1Q25vZGVfbW9kdWxlcyU1QyU1Q25leHQlNUMlNUNkaXN0JTVDJTVDY2xpZW50JTVDJTVDY29tcG9uZW50cyU1QyU1Q2xheW91dC1yb3V0ZXIuanMlMjIlMkMlMjJpZHMlMjIlM0ElNUIlNUQlN0QmbW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyQyUzQSU1QyU1Q1VzZXJzJTVDJTVDVGFudXNoJTVDJTVDRGVza3RvcCU1QyU1Q0NvZGluZyU1QyU1Q1NtYXJ0bGklMjBWMiU1QyU1Q25vZGVfbW9kdWxlcyU1QyU1Q25leHQlNUMlNUNkaXN0JTVDJTVDY2xpZW50JTVDJTVDY29tcG9uZW50cyU1QyU1Q25vdC1mb3VuZC1ib3VuZGFyeS5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDbm9kZV9tb2R1bGVzJTVDJTVDbmV4dCU1QyU1Q2Rpc3QlNUMlNUNjbGllbnQlNUMlNUNjb21wb25lbnRzJTVDJTVDcmVuZGVyLWZyb20tdGVtcGxhdGUtY29udGV4dC5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZzZXJ2ZXI9dHJ1ZSEiLCJtYXBwaW5ncyI6IkFBQUEsa09BQWdKO0FBQ2hKO0FBQ0Esb09BQWlKO0FBQ2pKO0FBQ0EsME9BQW9KO0FBQ3BKO0FBQ0Esd09BQW1KO0FBQ25KO0FBQ0Esa1BBQXdKO0FBQ3hKO0FBQ0Esc1FBQWtLIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21hcnRsaS8/OTQ2NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXG5vZGVfbW9kdWxlc1xcXFxuZXh0XFxcXGRpc3RcXFxcY2xpZW50XFxcXGNvbXBvbmVudHNcXFxcYXBwLXJvdXRlci5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxjbGllbnQtcGFnZS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxlcnJvci1ib3VuZGFyeS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxsYXlvdXQtcm91dGVyLmpzXCIpO1xuO1xuaW1wb3J0KC8qIHdlYnBhY2tNb2RlOiBcImVhZ2VyXCIgKi8gXCJDOlxcXFxVc2Vyc1xcXFxUYW51c2hcXFxcRGVza3RvcFxcXFxDb2RpbmdcXFxcU21hcnRsaSBWMlxcXFxub2RlX21vZHVsZXNcXFxcbmV4dFxcXFxkaXN0XFxcXGNsaWVudFxcXFxjb21wb25lbnRzXFxcXG5vdC1mb3VuZC1ib3VuZGFyeS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxyZW5kZXItZnJvbS10ZW1wbGF0ZS1jb250ZXh0LmpzXCIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L158:163

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AiPromptBoxDemo: () => (/* binding */ AiPromptBoxDemo)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_ui_ai_prompt_box__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ui/ai-prompt-box */ \"(ssr)/./components/ui/ai-prompt-box.tsx\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_ai_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/ai/config */ \"(ssr)/./lib/ai/config.ts\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/image */ \"(ssr)/./node_modules/next/dist/api/image.js\");\n/* __next_internal_client_entry_do_not_use__ AiPromptBoxDemo auto */ \n\n\n\n\nfunction AiPromptBoxDemo() {\n    const [mode, setMode] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(\"explainer\");\n    const [model, setModel] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(_lib_ai_config__WEBPACK_IMPORTED_MODULE_3__.AI_MODELS[0].id);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative flex w-full max-w-4xl flex-col items-center justify-center px-4 md:px-8\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"fixed top-20 left-0 right-0 z-50 flex flex-col items-center text-center\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_ai_prompt_box__WEBPACK_IMPORTED_MODULE_1__.PromptModeToggle, {\n                    mode: mode,\n                    onModeChange: setMode,\n                    className: \"scale-115 shadow-lg\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                    lineNumber: 15,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex flex-col items-center text-center mb-16 gap-6\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex items-center gap-4\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"relative h-12 w-12 overflow-hidden rounded-xl shadow-sm\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                src: \"/assets/branding/logo.png\",\n                                alt: \"Smartli Logo\",\n                                fill: true,\n                                className: \"object-contain\",\n                                priority: true\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                                lineNumber: 25,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                            lineNumber: 24,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                            className: \"text-3xl font-bold tracking-tight text-foreground sm:text-4xl\",\n                            children: [\n                                \"Smartli \",\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"text-primary\",\n                                    children: \"Intelligence\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                                    lineNumber: 34,\n                                    columnNumber: 21\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                            lineNumber: 33,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                    lineNumber: 23,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                lineNumber: 22,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_ai_prompt_box__WEBPACK_IMPORTED_MODULE_1__.PromptInputBox, {\n                mode: mode,\n                onModeChange: setMode,\n                showToggle: false,\n                model: model,\n                onModelChange: setModel,\n                onSend: (message, files)=>{\n                    console.log(\"Model:\", model);\n                    console.log(\"Message:\", message);\n                    console.log(\"Files:\", files);\n                },\n                placeholder: \"Ask me anything...\",\n                className: \"max-w-4xl\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                lineNumber: 39,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                className: \"mt-6 text-center text-xs text-gray-500\",\n                children: mode === \"quiz\" ? \"Quiz mode is ready for active recall.\" : \"Explainer mode is ready to break down any topic.\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n                lineNumber: 54,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ai\\\\ai-prompt-box-demo.tsx\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9jb21wb25lbnRzL2FpL2FpLXByb21wdC1ib3gtZGVtby50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRWtHO0FBQ2pFO0FBQzJCO0FBQzdCO0FBRXhCLFNBQVNLO0lBQ2QsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdMLCtDQUFRQSxDQUFhO0lBQzdDLE1BQU0sQ0FBQ00sT0FBT0MsU0FBUyxHQUFHUCwrQ0FBUUEsQ0FBWUMscURBQVMsQ0FBQyxFQUFFLENBQUNPLEVBQUU7SUFFN0QscUJBQ0UsOERBQUNDO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDRDtnQkFBSUMsV0FBVTswQkFDYiw0RUFBQ1gsMEVBQWdCQTtvQkFDZkssTUFBTUE7b0JBQ05PLGNBQWNOO29CQUNkSyxXQUFVOzs7Ozs7Ozs7OzswQkFJZCw4REFBQ0Q7Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUNEO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQ0Q7NEJBQUlDLFdBQVU7c0NBQ2IsNEVBQUNSLGtEQUFLQTtnQ0FDSlUsS0FBSTtnQ0FDSkMsS0FBSTtnQ0FDSkMsSUFBSTtnQ0FDSkosV0FBVTtnQ0FDVkssUUFBUTs7Ozs7Ozs7Ozs7c0NBR1osOERBQUNDOzRCQUFHTixXQUFVOztnQ0FBZ0U7OENBQ3BFLDhEQUFDTztvQ0FBS1AsV0FBVTs4Q0FBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBSzdDLDhEQUFDWix3RUFBY0E7Z0JBQ2JNLE1BQU1BO2dCQUNOTyxjQUFjTjtnQkFDZGEsWUFBWTtnQkFDWlosT0FBT0E7Z0JBQ1BhLGVBQWVaO2dCQUNmYSxRQUFRLENBQUNDLFNBQVNDO29CQUNoQkMsUUFBUUMsR0FBRyxDQUFDLFVBQVVsQjtvQkFDdEJpQixRQUFRQyxHQUFHLENBQUMsWUFBWUg7b0JBQ3hCRSxRQUFRQyxHQUFHLENBQUMsVUFBVUY7Z0JBQ3hCO2dCQUNBRyxhQUFZO2dCQUNaZixXQUFVOzs7Ozs7MEJBR1osOERBQUNnQjtnQkFBRWhCLFdBQVU7MEJBQ1ZOLFNBQVMsU0FDTiwwQ0FDQTs7Ozs7Ozs7Ozs7O0FBSVoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpLy4vY29tcG9uZW50cy9haS9haS1wcm9tcHQtYm94LWRlbW8udHN4P2Y1NTUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgUHJvbXB0SW5wdXRCb3gsIFByb21wdE1vZGVUb2dnbGUsIHR5cGUgUHJvbXB0TW9kZSB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9haS1wcm9tcHQtYm94JztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHR5cGUgQUlNb2RlbElkLCBBSV9NT0RFTFMgfSBmcm9tICdAL2xpYi9haS9jb25maWcnO1xyXG5pbXBvcnQgSW1hZ2UgZnJvbSAnbmV4dC9pbWFnZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQWlQcm9tcHRCb3hEZW1vKCkge1xyXG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVN0YXRlPFByb21wdE1vZGU+KCdleHBsYWluZXInKTtcclxuICBjb25zdCBbbW9kZWwsIHNldE1vZGVsXSA9IHVzZVN0YXRlPEFJTW9kZWxJZD4oQUlfTU9ERUxTWzBdLmlkKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCB3LWZ1bGwgbWF4LXctNHhsIGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC00IG1kOnB4LThcIj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCB0b3AtMjAgbGVmdC0wIHJpZ2h0LTAgei01MCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgIDxQcm9tcHRNb2RlVG9nZ2xlIFxyXG4gICAgICAgICAgbW9kZT17bW9kZX0gXHJcbiAgICAgICAgICBvbk1vZGVDaGFuZ2U9e3NldE1vZGV9IFxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwic2NhbGUtMTE1IHNoYWRvdy1sZ1wiXHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHRleHQtY2VudGVyIG1iLTE2IGdhcC02XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTEyIHctMTIgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQteGwgc2hhZG93LXNtXCI+XHJcbiAgICAgICAgICAgIDxJbWFnZSBcclxuICAgICAgICAgICAgICBzcmM9XCIvYXNzZXRzL2JyYW5kaW5nL2xvZ28ucG5nXCIgXHJcbiAgICAgICAgICAgICAgYWx0PVwiU21hcnRsaSBMb2dvXCIgXHJcbiAgICAgICAgICAgICAgZmlsbFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9iamVjdC1jb250YWluXCJcclxuICAgICAgICAgICAgICBwcmlvcml0eVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0zeGwgZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0IHRleHQtZm9yZWdyb3VuZCBzbTp0ZXh0LTR4bFwiPlxyXG4gICAgICAgICAgICBTbWFydGxpIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPkludGVsbGlnZW5jZTwvc3Bhbj5cclxuICAgICAgICAgIDwvaDE+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPFByb21wdElucHV0Qm94XHJcbiAgICAgICAgbW9kZT17bW9kZX1cclxuICAgICAgICBvbk1vZGVDaGFuZ2U9e3NldE1vZGV9XHJcbiAgICAgICAgc2hvd1RvZ2dsZT17ZmFsc2V9XHJcbiAgICAgICAgbW9kZWw9e21vZGVsfVxyXG4gICAgICAgIG9uTW9kZWxDaGFuZ2U9e3NldE1vZGVsfVxyXG4gICAgICAgIG9uU2VuZD17KG1lc3NhZ2UsIGZpbGVzKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTW9kZWw6JywgbW9kZWwpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2U6JywgbWVzc2FnZSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZXM6JywgZmlsZXMpO1xyXG4gICAgICAgIH19XHJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCJBc2sgbWUgYW55dGhpbmcuLi5cIlxyXG4gICAgICAgIGNsYXNzTmFtZT1cIm1heC13LTR4bFwiXHJcbiAgICAgIC8+XHJcblxyXG4gICAgICA8cCBjbGFzc05hbWU9XCJtdC02IHRleHQtY2VudGVyIHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxyXG4gICAgICAgIHttb2RlID09PSAncXVpeidcclxuICAgICAgICAgID8gJ1F1aXogbW9kZSBpcyByZWFkeSBmb3IgYWN0aXZlIHJlY2FsbC4nXHJcbiAgICAgICAgICA6ICdFeHBsYWluZXIgbW9kZSBpcyByZWFkeSB0byBicmVhayBkb3duIGFueSB0b3BpYy4nfVxyXG4gICAgICA8L3A+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJQcm9tcHRJbnB1dEJveCIsIlByb21wdE1vZGVUb2dnbGUiLCJ1c2VTdGF0ZSIsIkFJX01PREVMUyIsIkltYWdlIiwiQWlQcm9tcHRCb3hEZW1vIiwibW9kZSIsInNldE1vZGUiLCJtb2RlbCIsInNldE1vZGVsIiwiaWQiLCJkaXYiLCJjbGFzc05hbWUiLCJvbk1vZGVDaGFuZ2UiLCJzcmMiLCJhbHQiLCJmaWxsIiwicHJpb3JpdHkiLCJoMSIsInNwYW4iLCJzaG93VG9nZ2xlIiwib25Nb2RlbENoYW5nZSIsIm9uU2VuZCIsIm1lc3NhZ2UiLCJmaWxlcyIsImNvbnNvbGUiLCJsb2ciLCJwbGFjZWhvbGRlciIsInAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./components/ai/ai-prompt-box-demo.tsx\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L169:174

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AppDock: () => (/* binding */ AppDock)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(ssr)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/home.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/sparkles.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/timer.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/list-checks.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/trending-up.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/calendar-days.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/settings.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/circle-user.js\");\n/* harmony import */ var _components_ui_dock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/dock */ \"(ssr)/./components/ui/dock.tsx\");\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/utils */ \"(ssr)/./lib/utils.ts\");\n/* __next_internal_client_entry_do_not_use__ AppDock auto */ \n\n\n\n\n\n\nconst homeGroup = [\n    {\n        href: \"/\",\n        label: \"Home\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n    }\n];\nconst workspaceGroup = [\n    {\n        href: \"/ai\",\n        label: \"AI\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n    },\n    {\n        href: \"/focus\",\n        label: \"Focus Hub\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n    },\n    {\n        href: \"/tasks\",\n        label: \"Tasks\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\n    },\n    {\n        href: \"/analytics\",\n        label: \"Analytics\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"]\n    }\n];\nconst systemGroup = [\n    {\n        href: \"/plan\",\n        label: \"Plan\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"]\n    },\n    {\n        href: \"/settings\",\n        label: \"Settings\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"]\n    },\n    {\n        href: \"/account\",\n        label: \"Account\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_12__[\"default\"]\n    }\n];\nfunction isPathActive(pathname, href) {\n    if (href === \"/\") return pathname === \"/\";\n    return pathname === href || pathname.startsWith(`${href}/`);\n}\n// Spring config for the press-down / release animation.\n// ζ ≈ 0.75 → slightly underdamped so the release has a small physical pop.\nconst PRESS_SPRING = {\n    type: \"spring\",\n    stiffness: 400,\n    damping: 30,\n    mass: 1\n};\nfunction AppDockIcon({ href, label, icon: Icon, isActive }) {\n    const [hovered, setHovered] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isPending, startTransition] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useTransition)();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const shouldReduceMotion = (0,framer_motion__WEBPACK_IMPORTED_MODULE_13__.useReducedMotion)();\n    const handleNavigate = (e)=>{\n        // Standard Next.js Link behavior is on release (click).\n        // Fluid interfaces respond on press-down or immediately on click.\n        // We'll use useTransition to prioritize the UI feedback (active state) \n        // over the heavy page-loading transition.\n        e.preventDefault();\n        startTransition(()=>{\n            router.push(href);\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockIcon, {\n        onMouseEnter: ()=>setHovered(true),\n        onMouseLeave: ()=>setHovered(false),\n        onFocus: ()=>setHovered(true),\n        onBlur: ()=>setHovered(false),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.div, {\n                onPointerDown: handleNavigate,\n                whileTap: shouldReduceMotion ? {\n                    opacity: 0.7\n                } : {\n                    scale: 0.9\n                },\n                transition: PRESS_SPRING,\n                className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(\"relative flex h-full w-full items-center justify-center cursor-pointer\", isPending && \"opacity-70\"),\n                children: [\n                    (isActive || isPending) && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.div, {\n                        layoutId: \"dock-active-highlight\",\n                        className: \"absolute inset-0 rounded-full bg-foreground/10\",\n                        transition: {\n                            type: \"spring\",\n                            bounce: 0.15,\n                            duration: 0.5\n                        }\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 93,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(\"relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-150\", isActive ? \"text-foreground\" : \"text-muted-foreground hover:text-foreground\"),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Icon, {\n                            size: 20,\n                            strokeWidth: 2\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                            lineNumber: 106,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 100,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                lineNumber: 79,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_15__.AnimatePresence, {\n                children: hovered && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.span, {\n                    initial: shouldReduceMotion ? {\n                        opacity: 0\n                    } : {\n                        opacity: 0,\n                        scale: 0.85,\n                        y: 4\n                    },\n                    animate: shouldReduceMotion ? {\n                        opacity: 1\n                    } : {\n                        opacity: 1,\n                        scale: 1,\n                        y: 0\n                    },\n                    exit: shouldReduceMotion ? {\n                        opacity: 0,\n                        transition: {\n                            duration: 0.12\n                        }\n                    } : {\n                        opacity: 0,\n                        scale: 0.96,\n                        y: 2,\n                        transition: {\n                            duration: 0.12,\n                            ease: [\n                                0.23,\n                                1,\n                                0.32,\n                                1\n                            ]\n                        }\n                    },\n                    transition: shouldReduceMotion ? {\n                        duration: 0.15\n                    } : {\n                        type: \"spring\",\n                        duration: 0.32,\n                        bounce: 0.22\n                    },\n                    style: {\n                        left: \"50%\",\n                        x: \"-50%\",\n                        transformOrigin: \"bottom center\"\n                    },\n                    className: \"pointer-events-none absolute bottom-[60px] z-20 whitespace-nowrap rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg backdrop-blur-sm\",\n                    children: label\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 113,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                lineNumber: 111,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n        lineNumber: 69,\n        columnNumber: 5\n    }, this);\n}\nfunction AppDock() {\n    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();\n    const shouldReduceMotion = (0,framer_motion__WEBPACK_IMPORTED_MODULE_13__.useReducedMotion)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n        \"aria-label\": \"Primary\",\n        className: \"fixed inset-x-0 bottom-6 z-50 flex justify-center px-4\",\n        style: {\n            paddingBottom: \"env(safe-area-inset-bottom)\"\n        },\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.Dock, {\n            direction: \"bottom\",\n            disableMagnification: Boolean(shouldReduceMotion),\n            children: [\n                homeGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 170,\n                        columnNumber: 11\n                    }, this)),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockDivider, {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 173,\n                    columnNumber: 9\n                }, this),\n                workspaceGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 176,\n                        columnNumber: 11\n                    }, this)),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockDivider, {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 179,\n                    columnNumber: 9\n                }, this),\n                systemGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 182,\n                        columnNumber: 11\n                    }, this))\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n            lineNumber: 165,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n        lineNumber: 155,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9jb21wb25lbnRzL25hdmlnYXRpb24vYXBwLWRvY2sudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWdEO0FBRVM7QUFDaUI7QUFXcEQ7QUFDNkM7QUFDbEM7QUFRakMsTUFBTW1CLFlBQXVCO0lBQUM7UUFBRUMsTUFBTTtRQUFLQyxPQUFPO1FBQVFDLE1BQU1mLHNKQUFJQTtJQUFDO0NBQUU7QUFFdkUsTUFBTWdCLGlCQUE0QjtJQUNoQztRQUFFSCxNQUFNO1FBQU9DLE9BQU87UUFBTUMsTUFBTWQsc0pBQVFBO0lBQUM7SUFDM0M7UUFBRVksTUFBTTtRQUFVQyxPQUFPO1FBQWFDLE1BQU1iLHNKQUFLQTtJQUFDO0lBQ2xEO1FBQUVXLE1BQU07UUFBVUMsT0FBTztRQUFTQyxNQUFNWixzSkFBVUE7SUFBQztJQUNuRDtRQUFFVSxNQUFNO1FBQWNDLE9BQU87UUFBYUMsTUFBTVgsc0pBQVVBO0lBQUM7Q0FDNUQ7QUFFRCxNQUFNYSxjQUF5QjtJQUM3QjtRQUFFSixNQUFNO1FBQVNDLE9BQU87UUFBUUMsTUFBTVYsdUpBQVlBO0lBQUM7SUFDbkQ7UUFBRVEsTUFBTTtRQUFhQyxPQUFPO1FBQVlDLE1BQU1ULHVKQUFRQTtJQUFDO0lBQ3ZEO1FBQUVPLE1BQU07UUFBWUMsT0FBTztRQUFXQyxNQUFNUix1SkFBVUE7SUFBQztDQUN4RDtBQUVELFNBQVNXLGFBQWFDLFFBQWdCLEVBQUVOLElBQVk7SUFDbEQsSUFBSUEsU0FBUyxLQUFLLE9BQU9NLGFBQWE7SUFDdEMsT0FBT0EsYUFBYU4sUUFBUU0sU0FBU0MsVUFBVSxDQUFDLENBQUMsRUFBRVAsS0FBSyxDQUFDLENBQUM7QUFDNUQ7QUFFQSx3REFBd0Q7QUFDeEQsMkVBQTJFO0FBQzNFLE1BQU1RLGVBQWU7SUFBRUMsTUFBTTtJQUFVQyxXQUFXO0lBQUtDLFNBQVM7SUFBSUMsTUFBTTtBQUFFO0FBRTVFLFNBQVNDLFlBQVksRUFBRWIsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLE1B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LDhEQUFDSCw0REFBV0E7Ozs7O2dCQUVYTSxlQUFld0QsR0FBRyxDQUFDLENBQUNDLHFCQUNuQiw4REFBQy9DO3dCQUE2QixHQUFHK0MsSUFBSTt3QkFBRTdDLFVBQVVWLGFBQWFDLFVBQVVzRCxLQUFLNUQsSUFBSTt1QkFBL0Q0RCxLQUFLNUQsSUFBSTs7Ozs7OEJBRzdCLDhEQUFDSCw0REFBV0E7Ozs7O2dCQUVYTyxZQUFZdUQsR0FBRyxDQUFDLENBQUNDLHFCQUNoQiw4REFBQy9DO3dCQUE2QixHQUFHK0MsSUFBSTt3QkFBRTdDLFVBQVVWLGFBQWFDLFVBQVVzRCxLQUFLNUQsSUFBSTt1QkFBL0Q0RCxLQUFLNUQsSUFBSTs7Ozs7Ozs7Ozs7Ozs7OztBQUtyQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NtYXJ0bGkvLi9jb21wb25lbnRzL25hdmlnYXRpb24vYXBwLWRvY2sudHN4P2UyODIiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVRyYW5zaXRpb24gfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcbmltcG9ydCB7IHVzZVBhdGhuYW1lLCB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBbmltYXRlUHJlc2VuY2UsIG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ2ZyYW1lci1tb3Rpb24nO1xyXG5pbXBvcnQge1xyXG4gIEhvbWUsXHJcbiAgU3BhcmtsZXMsXHJcbiAgVGltZXIsXHJcbiAgTGlzdENoZWNrcyxcclxuICBUcmVuZGluZ1VwLFxyXG4gIENhbGVuZGFyRGF5cyxcclxuICBTZXR0aW5ncyxcclxuICBVc2VyQ2lyY2xlLFxyXG4gIHR5cGUgTHVjaWRlSWNvbixcclxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xyXG5pbXBvcnQgeyBEb2NrLCBEb2NrSWNvbiwgRG9ja0RpdmlkZXIgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvZG9jayc7XHJcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC9saWIvdXRpbHMnO1xyXG5cclxuaW50ZXJmYWNlIE5hdkl0ZW0ge1xyXG4gIGhyZWY6IHN0cmluZztcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb246IEx1Y2lkZUljb247XHJcbn1cclxuXHJcbmNvbnN0IGhvbWVHcm91cDogTmF2SXRlbVtdID0gW3sgaHJlZjogJy8nLCBsYWJlbDogJ0hvbWUnLCBpY29uOiBIb21lIH1dO1xyXG5cclxuY29uc3Qgd29ya3NwYWNlR3JvdXA6IE5hdkl0ZW1bXSA9IFtcclxuICB7IGhyZWY6ICcvYWknLCBsYWJlbDogJ0FJJywgaWNvbjogU3BhcmtsZXMgfSxcclxuICB7IGhyZWY6ICcvZm9jdXMnLCBsYWJlbDogJ0ZvY3VzIEh1YicsIGljb246IFRpbWVyIH0sXHJcbiAgeyBocmVmOiAnL3Rhc2tzJywgbGFiZWw6ICdUYXNrcycsIGljb246IExpc3RDaGVja3MgfSxcclxuICB7IGhyZWY6ICcvYW5hbHl0aWNzJywgbGFiZWw6ICdBbmFseXRpY3MnLCBpY29uOiBUcmVuZGluZ1VwIH0sXHJcbl07XHJcblxyXG5jb25zdCBzeXN0ZW1Hcm91cDogTmF2SXRlbVtdID0gW1xyXG4gIHsgaHJlZjogJy9wbGFuJywgbGFiZWw6ICdQbGFuJywgaWNvbjogQ2FsZW5kYXJEYXlzIH0sXHJcbiAgeyBocmVmOiAnL3NldHRpbmdzJywgbGFiZWw6ICdTZXR0aW5ncycsIGljb246IFNldHRpbmdzIH0sXHJcbiAgeyBocmVmOiAnL2FjY291bnQnLCBsYWJlbDogJ0FjY291bnQnLCBpY29uOiBVc2VyQ2lyY2xlIH0sXHJcbl07XHJcblxyXG5mdW5jdGlvbiBpc1BhdGhBY3RpdmUocGF0aG5hbWU6IHN0cmluZywgaHJlZjogc3RyaW5nKSB7XHJcbiAgaWYgKGhyZWYgPT09ICcvJykgcmV0dXJuIHBhdGhuYW1lID09PSAnLyc7XHJcbiAgcmV0dXJuIHBhdGhuYW1lID09PSBocmVmIHx8IHBhdGhuYW1lLnN0YXJ0c1dpdGgoYCR7aHJlZn0vYCk7XHJcbn1cclxuXHJcbi8vIFNwcmluZyBjb25maWcgZm9yIHRoZSBwcmVzcy1kb3duIC8gcmVsZWFzZSBhbmltYXRpb24uXHJcbi8vIM62IOKJiCAwLjc1IOKGkiBzbGlnaHRseSB1bmRlcmRhbXBlZCBzbyB0aGUgcmVsZWFzZSBoYXMgYSBzbWFsbCBwaHlzaWNhbCBwb3AuXHJcbmNvbnN0IFBSRVNTX1NQUklORyA9IHsgdHlwZTogJ3NwcmluZycsIHN0aWZmbmVzczogNDAwLCBkYW1waW5nOiAzMCwgbWFzczogMSB9IGFzIGNvbnN0O1xyXG5cclxuZnVuY3Rpb24gQXBwRG9ja0ljb24oeyBocmVmLCBsYWJlbCwgaWNvbjogSWNvbiwgaXNBY3RpdmUgfTogTmF2SXRlbSAmIHsgaXNBY3RpdmU6IGJvb2xlYW4gfSkge1xyXG4gIGNvbnN0IFtob3ZlcmVkLCBzZXRIb3ZlcmVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaXNQZW5kaW5nLCBzdGFydFRyYW5zaXRpb25dID0gdXNlVHJhbnNpdGlvbigpO1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gIGNvbnN0IHNob3VsZFJlZHVjZU1vdGlvbiA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlTmF2aWdhdGUgPSAoZTogUmVhY3QuTW91c2VFdmVudCkgPT4ge1xyXG4gICAgLy8gU3RhbmRhcmQgTmV4dC5qcyBMaW5rIGJlaGF2aW9yIGlzIG9uIHJlbGVhc2UgKGNsaWNrKS5cclxuICAgIC8vIEZsdWlkIGludGVyZmFjZXMgcmVzcG9uZCBvbiBwcmVzcy1kb3duIG9yIGltbWVkaWF0ZWx5IG9uIGNsaWNrLlxyXG4gICAgLy8gV2UnbGwgdXNlIHVzZVRyYW5zaXRpb24gdG8gcHJpb3JpdGl6ZSB0aGUgVUkgZmVlZGJhY2sgKGFjdGl2ZSBzdGF0ZSkgXHJcbiAgICAvLyBvdmVyIHRoZSBoZWF2eSBwYWdlLWxvYWRpbmcgdHJhbnNpdGlvbi5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHN0YXJ0VHJhbnNpdGlvbigoKSA9PiB7XHJcbiAgICAgIHJvdXRlci5wdXNoKGhyZWYpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxEb2NrSWNvblxyXG4gICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyZWQodHJ1ZSl9XHJcbiAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXJlZChmYWxzZSl9XHJcbiAgICAgIG9uRm9jdXM9eygpID0+IHNldEhvdmVyZWQodHJ1ZSl9XHJcbiAgICAgIG9uQmx1cj17KCkgPT4gc2V0SG92ZXJlZChmYWxzZSl9XHJcbiAgICA+XHJcbiAgICAgIHsvKlxyXG4gICAgICAgKiBQcmVzcyBhbmltYXRpb24gd3JhcHBlciDigJQgc2NhbGVzIG9ubHkgdGhlIGljb24gKyBhY3RpdmUgcGlsbCwgTk9UIHRoZSB0b29sdGlwLlxyXG4gICAgICAgKiBSZWR1Y2VkIG1vdGlvbjogc3dhcCB0cmFuc2Zvcm0gZm9yIGEgZ2VudGxlciBvcGFjaXR5IGRpcC5cclxuICAgICAgICovfVxyXG4gICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgIG9uUG9pbnRlckRvd249e2hhbmRsZU5hdmlnYXRlfVxyXG4gICAgICAgIHdoaWxlVGFwPXtcclxuICAgICAgICAgIHNob3VsZFJlZHVjZU1vdGlvblxyXG4gICAgICAgICAgICA/IHsgb3BhY2l0eTogMC43IH1cclxuICAgICAgICAgICAgOiB7IHNjYWxlOiAwLjkgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cmFuc2l0aW9uPXtQUkVTU19TUFJJTkd9XHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgIFwicmVsYXRpdmUgZmxleCBoLWZ1bGwgdy1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBjdXJzb3ItcG9pbnRlclwiLFxyXG4gICAgICAgICAgaXNQZW5kaW5nICYmIFwib3BhY2l0eS03MFwiXHJcbiAgICAgICAgKX1cclxuICAgICAgPlxyXG4gICAgICAgIHsoaXNBY3RpdmUgfHwgaXNQZW5kaW5nKSAmJiAoXHJcbiAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICBsYXlvdXRJZD1cImRvY2stYWN0aXZlLWhpZ2hsaWdodFwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcm91bmRlZC1mdWxsIGJnLWZvcmVncm91bmQvMTBcIlxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IHR5cGU6ICdzcHJpbmcnLCBib3VuY2U6IDAuMTUsIGR1cmF0aW9uOiAwLjUgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKX1cclxuXHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgICAgJ3JlbGF0aXZlIGZsZXggaC1mdWxsIHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTE1MCcsXHJcbiAgICAgICAgICAgIGlzQWN0aXZlID8gJ3RleHQtZm9yZWdyb3VuZCcgOiAndGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtZm9yZWdyb3VuZCdcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPEljb24gc2l6ZT17MjB9IHN0cm9rZVdpZHRoPXsyfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L21vdGlvbi5kaXY+XHJcblxyXG4gICAgICB7LyogVG9vbHRpcCDigJQgc2libGluZyBvZiB0aGUgcHJlc3Mgd3JhcHBlciwgc28gaXQgaXMgdW5hZmZlY3RlZCBieSB3aGlsZVRhcCAqL31cclxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cclxuICAgICAgICB7aG92ZXJlZCAmJiAoXHJcbiAgICAgICAgICA8bW90aW9uLnNwYW5cclxuICAgICAgICAgICAgaW5pdGlhbD17XHJcbiAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlTW90aW9uXHJcbiAgICAgICAgICAgICAgICA/IHsgb3BhY2l0eTogMCB9XHJcbiAgICAgICAgICAgICAgICA6IHsgb3BhY2l0eTogMCwgc2NhbGU6IDAuODUsIHk6IDQgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuaW1hdGU9e1xyXG4gICAgICAgICAgICAgIHNob3VsZFJlZHVjZU1vdGlvblxyXG4gICAgICAgICAgICAgICAgPyB7IG9wYWNpdHk6IDEgfVxyXG4gICAgICAgICAgICAgICAgOiB7IG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5OiAwIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBleGl0PXtcclxuICAgICAgICAgICAgICBzaG91bGRSZWR1Y2VNb3Rpb25cclxuICAgICAgICAgICAgICAgID8geyBvcGFjaXR5OiAwLCB0cmFuc2l0aW9uOiB7IGR1cmF0aW9uOiAwLjEyIH0gfVxyXG4gICAgICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC45NixcclxuICAgICAgICAgICAgICAgICAgICB5OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHsgZHVyYXRpb246IDAuMTIsIGVhc2U6IFswLjIzLCAxLCAwLjMyLCAxXSB9LFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJhbnNpdGlvbj17XHJcbiAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlTW90aW9uXHJcbiAgICAgICAgICAgICAgICA/IHsgZHVyYXRpb246IDAuMTUgfVxyXG4gICAgICAgICAgICAgICAgOiB7IHR5cGU6ICdzcHJpbmcnLCBkdXJhdGlvbjogMC4zMiwgYm91bmNlOiAwLjIyIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHlsZT17eyBsZWZ0OiAnNTAlJywgeDogJy01MCUnLCB0cmFuc2Zvcm1PcmlnaW46ICdib3R0b20gY2VudGVyJyB9fVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGJvdHRvbS1bNjBweF0gei0yMCB3aGl0ZXNwYWNlLW5vd3JhcCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItYm9yZGVyLzYwIGJnLXBvcG92ZXIvOTUgcHgtMi41IHB5LTEgdGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtcG9wb3Zlci1mb3JlZ3JvdW5kIHNoYWRvdy1sZyBiYWNrZHJvcC1ibHVyLXNtXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2xhYmVsfVxyXG4gICAgICAgICAgPC9tb3Rpb24uc3Bhbj5cclxuICAgICAgICApfVxyXG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuICAgIDwvRG9ja0ljb24+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcERvY2soKSB7XHJcbiAgY29uc3QgcGF0aG5hbWUgPSB1c2VQYXRobmFtZSgpO1xyXG4gIGNvbnN0IHNob3VsZFJlZHVjZU1vdGlvbiA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxuYXZcclxuICAgICAgYXJpYS1sYWJlbD1cIlByaW1hcnlcIlxyXG4gICAgICBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC14LTAgYm90dG9tLTYgei01MCBmbGV4IGp1c3RpZnktY2VudGVyIHB4LTRcIlxyXG4gICAgICBzdHlsZT17eyBwYWRkaW5nQm90dG9tOiAnZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pJyB9fVxyXG4gICAgPlxyXG4gICAgICB7LypcclxuICAgICAgICogZGlyZWN0aW9uPVwiYm90dG9tXCIg4oaSIGljb25zIGFyZSBib3R0b20tYWxpZ25lZCBpbnNpZGUgdGhlIGF1dG8taGVpZ2h0IGRvY2suXHJcbiAgICAgICAqIFdoZW4gYSBuZWFyYnkgaWNvbiBtYWduaWZpZXMgKDQw4oaSNzJweCkgaXQgZ3Jvd3MgVVBXQVJELCBleHBhbmRpbmcgdGhhdFxyXG4gICAgICAgKiBzZWN0aW9uIG9mIHRoZSBkb2NrIHZpc3VhbGx5IHdoaWxlIHRoZSBkb2NrJ3MgYm90dG9tIGVkZ2Ugc3RheXMgYW5jaG9yZWQuXHJcbiAgICAgICAqL31cclxuICAgICAgPERvY2tcclxuICAgICAgICBkaXJlY3Rpb249XCJib3R0b21cIlxyXG4gICAgICAgIGRpc2FibGVNYWduaWZpY2F0aW9uPXtCb29sZWFuKHNob3VsZFJlZHVjZU1vdGlvbil9XHJcbiAgICAgID5cclxuICAgICAgICB7aG9tZUdyb3VwLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgPEFwcERvY2tJY29uIGtleT17aXRlbS5ocmVmfSB7Li4uaXRlbX0gaXNBY3RpdmU9e2lzUGF0aEFjdGl2ZShwYXRobmFtZSwgaXRlbS5ocmVmKX0gLz5cclxuICAgICAgICApKX1cclxuXHJcbiAgICAgICAgPERvY2tEaXZpZGVyIC8+XHJcblxyXG4gICAgICAgIHt3b3Jrc3BhY2VHcm91cC5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgIDxBcHBEb2NrSWNvbiBrZXk9e2l0ZW0uaHJlZn0gey4uLml0ZW19IGlzQWN0aXZlPXtpc1BhdGhBY3RpdmUocGF0aG5hbWUsIGl0ZW0uaHJlZil9IC8+XHJcbiAgICAgICAgKSl9XHJcblxyXG4gICAgICAgIDxEb2NrRGl2aWRlciAvPlxyXG5cclxuICAgICAgICB7c3lzdGVtR3JvdXAubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICA8QXBwRG9ja0ljb24ga2V5PXtpdGVtLmhyZWZ9IHsuLi5pdGVtfSBpc0FjdGl2ZT17aXNQYXRoQWN0aXZlKHBhdGhuYW1lLCBpdGVtLmhyZWYpfSAvPlxyXG4gICAgICAgICkpfVxyXG4gICAgICA8L0RvY2s+XHJcbiAgICA8L25hdj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZVRyYW5zaXRpb24iLCJ1c2VQYXRobmFtZSIsInVzZVJvdXRlciIsIkFuaW1hdGVQcmVzZW5jZSIsIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJIb21lIiwiU3BhcmtsZXMiLCJUaW1lciIsIkxpc3RDaGVja3MiLCJUcmVuZGluZ1VwIiwiQ2FsZW5kYXJEYXlzIiwiU2V0dGluZ3MiLCJVc2VyQ2lyY2xlIiwiRG9jayIsIkRvY2tJY29uIiwiRG9ja0RpdmlkZXIiLCJjbiIsImhvbWVHcm91cCIsImhyZWYiLCJsYWJlbCIsImljb24iLCJ3b3Jrc3BhY2VHcm91cCIsInN5c3RlbUdyb3VwIiwiaXNQYXRoQWN0aXZlIiwicGF0aG5hbWUiLCJzdGFydHNXaXRoIiwiUFJFU1NfU1BSSU5HIiwidHlwZSIsInN0aWZmbmVzcyIsImRhbXBpbmciLCJtYXNzIiwiQXBwRG9ja0ljb24iLCJJY29uIiwiaXNBY3RpdmUiLCJob3ZlcmVkIiwic2V0SG92ZXJlZCIsImlzUGVuZGluZyIsInN0YXJ0VHJhbnNpdGlvbiIsInJvdXRlciIsInNob3VsZFJlZHVjZU1vdGlvbiIsImhhbmRsZU5hdmlnYXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwicHVzaCIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsIm9uRm9jdXMiLCJvbkJsdXIiLCJkaXYiLCJvblBvaW50ZXJEb3duIiwid2hpbGVUYXAiLCJvcGFjaXR5Iiwic2NhbGUiLCJ0cmFuc2l0aW9uIiwiY2xhc3NOYW1lIiwibGF5b3V0SWQiLCJib3VuY2UiLCJkdXJhdGlvbiIsInNpemUiLCJzdHJva2VXaWR0aCIsInNwYW4iLCJpbml0aWFsIiwieSIsImFuaW1hdGUiLCJleGl0IiwiZWFzZSIsInN0eWxlIiwibGVmdCIsIngiLCJ0cmFuc2Zvcm1PcmlnaW4iLCJBcHBEb2NrIiwibmF2IiwiYXJpYS1sYWJlbCIsInBhZGRpbmdCb3R0b20iLCJkaXJlY3Rpb24iLCJkaXNhYmxlTWFnbmlmaWNhdGlvbiIsIkJvb2xlYW4iLCJtYXAiLCJpdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./components/navigation/app-dock.tsx\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page.js#L180:185

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PromptInputBox: () => (/* binding */ PromptInputBox),\n/* harmony export */   PromptModeToggle: () => (/* binding */ PromptModeToggle)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-dialog */ \"(ssr)/./node_modules/@radix-ui/react-dialog/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-tooltip */ \"(ssr)/./node_modules/@radix-ui/react-tooltip/dist/index.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/x.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/graduation-cap.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/check.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/brain-cog.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/globe.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/paperclip.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/layers.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/chevron-down.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/square.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/circle-stop.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/arrow-up.js\");\n/* harmony import */ var _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! __barrel_optimize__?names=ArrowUp,BrainCog,Check,ChevronDown,Globe,GraduationCap,Layers,Mic,Paperclip,Square,StopCircle,X!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/mic.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_ai_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/ai/config */ \"(ssr)/./lib/ai/config.ts\");\n/* __next_internal_client_entry_do_not_use__ PromptModeToggle,PromptInputBox auto */ \n\n\n\n\n\n\nconst cn = (...classes)=>classes.filter(Boolean).join(\" \");\nconst styles = `\r\n  *:focus-visible {\r\n    outline-offset: 0 !important;\r\n    --ring-offset: 0 !important;\r\n  }\r\n  textarea {\r\n    line-height: 1.6 !important;\r\n  }\r\n  textarea::-webkit-scrollbar {\r\n    width: 6px;\r\n  }\r\n  textarea::-webkit-scrollbar-track {\r\n    background: transparent;\r\n  }\r\n  textarea::-webkit-scrollbar-thumb {\r\n    background-color: #444444;\r\n    border-radius: 3px;\r\n  }\r\n  textarea::-webkit-scrollbar-thumb:hover {\r\n    background-color: #555555;\r\n  }\r\n`;\nconst useStyleInjection = ()=>{\n    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{\n        const styleId = \"ai-prompt-box-styles\";\n        if (typeof document !== \"undefined\" && !document.getElementById(styleId)) {\n            const styleSheet = document.createElement(\"style\");\n            styleSheet.id = styleId;\n            styleSheet.innerText = styles;\n            document.head.appendChild(styleSheet);\n        }\n    }, []);\n};\nconst Textarea = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"textarea\", {\n        className: cn(\"scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-transparent hover:scrollbar-thumb-[#555555] flex min-h-[44px] w-full resize-none border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50\", className),\n        ref: ref,\n        rows: 1,\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 69,\n        columnNumber: 5\n    }, undefined));\nTextarea.displayName = \"Textarea\";\nconst TooltipProvider = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Provider;\nconst Tooltip = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Root;\nconst TooltipTrigger = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Trigger;\nconst TooltipContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Content, {\n        ref: ref,\n        sideOffset: sideOffset,\n        className: cn(\"fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md data-[state=closed]:animate-out\", className),\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 90,\n        columnNumber: 3\n    }, undefined));\nTooltipContent.displayName = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Content.displayName;\nconst Dialog = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Root;\nconst DialogPortal = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Portal;\nconst DialogOverlay = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Overlay, {\n        ref: ref,\n        className: cn(\"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in\", className),\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 109,\n        columnNumber: 3\n    }, undefined));\nDialogOverlay.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Overlay.displayName;\nconst DialogContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, children, ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DialogPortal, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DialogOverlay, {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 125,\n                columnNumber: 5\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Content, {\n                ref: ref,\n                className: cn(\"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[90vw] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-[#333333] bg-[#1F2023] p-0 shadow-xl duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in md:max-w-[800px]\", className),\n                ...props,\n                children: [\n                    children,\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Close, {\n                        className: \"absolute top-4 right-4 z-10 rounded-full bg-[#2E3033]/80 p-2 transition-all hover:bg-[#2E3033]\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                className: \"h-5 w-5 text-gray-200 hover:text-white\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                lineNumber: 136,\n                                columnNumber: 9\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                className: \"sr-only\",\n                                children: \"Close\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                lineNumber: 137,\n                                columnNumber: 9\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 135,\n                        columnNumber: 7\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 126,\n                columnNumber: 5\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 124,\n        columnNumber: 3\n    }, undefined));\nDialogContent.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Content.displayName;\nconst DialogTitle = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Title, {\n        ref: ref,\n        className: cn(\"font-semibold text-gray-100 text-lg leading-none tracking-tight\", className),\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 148,\n        columnNumber: 3\n    }, undefined));\nDialogTitle.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Title.displayName;\nconst Button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, variant = \"default\", size = \"default\", ...props }, ref)=>{\n    const variantClasses = {\n        default: \"bg-white hover:bg-white/80 text-black\",\n        outline: \"border border-[#444444] bg-transparent hover:bg-[#3A3A40]\",\n        ghost: \"bg-transparent hover:bg-[#3A3A40]\"\n    };\n    const sizeClasses = {\n        default: \"h-10 px-4 py-2\",\n        sm: \"h-8 px-3 text-sm\",\n        lg: \"h-12 px-6\",\n        icon: \"h-8 w-8 rounded-full aspect-[1/1]\"\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n        className: cn(\"inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50\", variantClasses[variant], sizeClasses[size], className),\n        ref: ref,\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 179,\n        columnNumber: 7\n    }, undefined);\n});\nButton.displayName = \"Button\";\nconst VoiceRecorder = ({ isRecording, onStartRecording, onStopRecording, visualizerBars = 32 })=>{\n    const [time, setTime] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(0);\n    const timeRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(0);\n    const timerRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);\n    const wasRecordingRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(false);\n    const onStartRecordingRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(onStartRecording);\n    const onStopRecordingRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(onStopRecording);\n    onStartRecordingRef.current = onStartRecording;\n    onStopRecordingRef.current = onStopRecording;\n    timeRef.current = time;\n    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{\n        if (isRecording) {\n            wasRecordingRef.current = true;\n            onStartRecordingRef.current();\n            timerRef.current = setInterval(()=>setTime((t)=>t + 1), 1000);\n        } else {\n            if (timerRef.current) {\n                clearInterval(timerRef.current);\n                timerRef.current = null;\n            }\n            if (wasRecordingRef.current) {\n                onStopRecordingRef.current(timeRef.current);\n                wasRecordingRef.current = false;\n                setTime(0);\n            }\n        }\n        return ()=>{\n            if (timerRef.current) clearInterval(timerRef.current);\n        };\n    }, [\n        isRecording\n    ]);\n    const formatTime = (seconds)=>{\n        const mins = Math.floor(seconds / 60);\n        const secs = seconds % 60;\n        return `${mins.toString().padStart(2, \"0\")}:${secs.toString().padStart(2, \"0\")}`;\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: cn(\"flex w-full flex-col items-center justify-center py-3 transition-all duration-300\", isRecording ? \"opacity-100\" : \"h-0 opacity-0\"),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"mb-3 flex items-center gap-2\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"h-2 w-2 animate-pulse rounded-full bg-red-500\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 256,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                        className: \"font-mono text-sm text-white/80\",\n                        children: formatTime(time)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 257,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 255,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex h-10 w-full items-center justify-center gap-0.5 px-4\",\n                children: [\n                    ...Array(visualizerBars)\n                ].map((_, i)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"w-0.5 animate-pulse rounded-full bg-white/50\",\n                        style: {\n                            height: `${Math.max(15, Math.random() * 100)}%`,\n                            animationDelay: `${i * 0.05}s`,\n                            animationDuration: `${0.5 + Math.random() * 0.5}s`\n                        }\n                    }, i, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 263,\n                        columnNumber: 11\n                    }, undefined))\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 261,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 249,\n        columnNumber: 5\n    }, undefined);\n};\nconst ImageViewDialog = ({ imageUrl, onClose })=>{\n    if (!imageUrl) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Dialog, {\n        open: !!imageUrl,\n        onOpenChange: onClose,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DialogContent, {\n            className: \"max-w-[90vw] border-none bg-transparent p-0 shadow-none md:max-w-[800px]\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DialogTitle, {\n                    className: \"sr-only\",\n                    children: \"Image Preview\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                    lineNumber: 292,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.div, {\n                    initial: {\n                        opacity: 0,\n                        scale: 0.95\n                    },\n                    animate: {\n                        opacity: 1,\n                        scale: 1\n                    },\n                    exit: {\n                        opacity: 0,\n                        scale: 0.95\n                    },\n                    transition: {\n                        duration: 0.2,\n                        ease: \"easeOut\"\n                    },\n                    className: \"relative overflow-hidden rounded-2xl bg-[#1F2023] shadow-2xl\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"relative max-h-[80vh] w-full\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                            src: imageUrl,\n                            alt: \"Full preview\",\n                            width: 800,\n                            height: 600,\n                            className: \"rounded-2xl object-contain\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                            lineNumber: 301,\n                            columnNumber: 13\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 300,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                    lineNumber: 293,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n            lineNumber: 291,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 290,\n        columnNumber: 5\n    }, undefined);\n};\nconst PromptInputContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({\n    isLoading: false,\n    value: \"\",\n    setValue: ()=>{},\n    maxHeight: 240,\n    onSubmit: undefined,\n    disabled: false\n});\nfunction usePromptInput() {\n    return react__WEBPACK_IMPORTED_MODULE_1___default().useContext(PromptInputContext);\n}\nconst PromptInput = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false, onDragOver, onDragLeave, onDrop }, ref)=>{\n    const [internalValue, setInternalValue] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(value || \"\");\n    const handleChange = (newValue)=>{\n        setInternalValue(newValue);\n        onValueChange?.(newValue);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(TooltipProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputContext.Provider, {\n            value: {\n                isLoading,\n                value: value ?? internalValue,\n                setValue: onValueChange ?? handleChange,\n                maxHeight,\n                onSubmit,\n                disabled\n            },\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                ref: ref,\n                className: cn(\"rounded-[32px] border border-[#444444] bg-[#1F2023] px-4 pt-4 pb-3 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300\", isLoading && \"border-red-500/70\", className),\n                onDragOver: onDragOver,\n                onDragLeave: onDragLeave,\n                onDrop: onDrop,\n                role: \"form\",\n                \"aria-label\": \"Prompt Input Area\",\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 386,\n                columnNumber: 11\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n            lineNumber: 376,\n            columnNumber: 9\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 375,\n        columnNumber: 7\n    }, undefined);\n});\nPromptInput.displayName = \"PromptInput\";\nconst PromptInputTextarea = ({ className, onKeyDown, disableAutosize = false, placeholder, ...props })=>{\n    const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();\n    const textareaRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);\n    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{\n        if (disableAutosize || !textareaRef.current) return;\n        textareaRef.current.style.height = \"auto\";\n        textareaRef.current.style.height = typeof maxHeight === \"number\" ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px` : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;\n    }, [\n        value,\n        maxHeight,\n        disableAutosize\n    ]);\n    const handleKeyDown = (e)=>{\n        if (e.key === \"Enter\" && !e.shiftKey) {\n            e.preventDefault();\n            onSubmit?.();\n        }\n        onKeyDown?.(e);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Textarea, {\n        ref: textareaRef,\n        value: value,\n        onChange: (e)=>setValue(e.target.value),\n        onKeyDown: handleKeyDown,\n        className: cn(\"px-1 text-base py-2\", className),\n        disabled: disabled,\n        placeholder: placeholder,\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 443,\n        columnNumber: 5\n    }, undefined);\n};\nconst PromptInputActions = ({ children, className, ...props })=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: cn(\"flex items-center gap-2 pt-1\", className),\n        ...props,\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 463,\n        columnNumber: 3\n    }, undefined);\nconst PromptInputAction = ({ tooltip, children, className, side = \"top\", ...props })=>{\n    const { disabled } = usePromptInput();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Tooltip, {\n        ...props,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(TooltipTrigger, {\n                asChild: true,\n                disabled: disabled,\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 486,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(TooltipContent, {\n                side: side,\n                className: className,\n                children: tooltip\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 489,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 485,\n        columnNumber: 5\n    }, undefined);\n};\nconst CustomDivider = ()=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative mx-1 h-6 w-[1.5px]\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent\",\n            style: {\n                clipPath: \"polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)\"\n            }\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n            lineNumber: 498,\n            columnNumber: 5\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 497,\n        columnNumber: 3\n    }, undefined);\nconst PromptModeToggle = ({ mode, onModeChange, className, disabled })=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: cn(\"mb-3 flex w-fit items-center gap-1 rounded-full border border-[#3a3b40] bg-[#18191b] p-1\", className),\n        role: \"group\",\n        \"aria-label\": \"AI response mode\",\n        children: [\n            {\n                value: \"explainer\",\n                label: \"Explainer\",\n                description: \"Learn with a clear explanation\",\n                icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n            },\n            {\n                value: \"quiz\",\n                label: \"Quiz\",\n                description: \"Practice with active recall\",\n                icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\n            }\n        ].map(({ value, label, description, icon: Icon })=>{\n            const isActive = mode === value;\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                type: \"button\",\n                onClick: ()=>onModeChange(value),\n                disabled: disabled,\n                \"aria-pressed\": isActive,\n                title: description,\n                className: cn(\"inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/70 disabled:pointer-events-none disabled:opacity-50\", isActive ? value === \"quiz\" ? \"bg-emerald-500/15 text-emerald-300 shadow-sm\" : \"bg-[#9b87f5]/15 text-[#c4b5fd] shadow-sm\" : \"text-gray-500 hover:bg-white/5 hover:text-gray-300\"),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Icon, {\n                        className: \"h-3.5 w-3.5\",\n                        \"aria-hidden\": \"true\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 565,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                        children: label\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 566,\n                        columnNumber: 11\n                    }, undefined),\n                    isActive && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                        className: \"sr-only\",\n                        children: \"selected\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 567,\n                        columnNumber: 24\n                    }, undefined)\n                ]\n            }, value, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 549,\n                columnNumber: 9\n            }, undefined);\n        })\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 523,\n        columnNumber: 3\n    }, undefined);\nconst PromptInputBox = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(({ onSend = ()=>{}, isLoading = false, placeholder = \"Type your message here...\", className, mode: controlledMode, onModeChange, showToggle = true, model: controlledModel, onModelChange }, ref)=>{\n    useStyleInjection();\n    const [input, setInput] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(\"\");\n    const [files, setFiles] = react__WEBPACK_IMPORTED_MODULE_1___default().useState([]);\n    const [filePreviews, setFilePreviews] = react__WEBPACK_IMPORTED_MODULE_1___default().useState({});\n    const [selectedImage, setSelectedImage] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(null);\n    const [isRecording, setIsRecording] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);\n    const [showSearch, setShowSearch] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);\n    const [showThink, setShowThink] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);\n    const [showCanvas, setShowCanvas] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);\n    const [internalMode, setInternalMode] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(\"explainer\");\n    const [internalModel, setInternalModel] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(_lib_ai_config__WEBPACK_IMPORTED_MODULE_2__.AI_MODELS[0].id);\n    const [showModelMenu, setShowModelMenu] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);\n    const uploadInputRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);\n    const promptBoxRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);\n    const mode = controlledMode ?? internalMode;\n    const model = controlledModel ?? internalModel;\n    const handleModeChange = (nextMode)=>{\n        setInternalMode(nextMode);\n        onModeChange?.(nextMode);\n    };\n    const handleToggleChange = (value)=>{\n        if (value === \"search\") {\n            setShowSearch((prev)=>!prev);\n            setShowThink(false);\n        } else if (value === \"think\") {\n            setShowThink((prev)=>!prev);\n            setShowSearch(false);\n        }\n    };\n    const handleCanvasToggle = ()=>setShowCanvas((prev)=>!prev);\n    const allSuggestions = react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(()=>({\n            quiz: [\n                {\n                    label: \"Calculus Practice\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n                    prompt: \"Generate 5 challenging Calculus integration problems\",\n                    color: \"text-blue-400\",\n                    hover: \"hover:border-blue-500/50 hover:bg-blue-500/10\"\n                },\n                {\n                    label: \"History Quiz\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                    prompt: \"Quiz me on the major events of the French Revolution\",\n                    color: \"text-emerald-400\",\n                    hover: \"hover:border-emerald-500/50 hover:bg-emerald-500/10\"\n                },\n                {\n                    label: \"Bio Competency\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: \"Test my knowledge on DNA replication and transcription\",\n                    color: \"text-amber-400\",\n                    hover: \"hover:border-amber-500/50 hover:bg-amber-500/10\"\n                },\n                {\n                    label: \"Physics Laws\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Create a quiz about Newton's Laws of Motion\",\n                    color: \"text-purple-400\",\n                    hover: \"hover:border-purple-500/50 hover:bg-purple-500/10\"\n                },\n                {\n                    label: \"Vocab Practice\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n                    prompt: \"Test my advanced English vocabulary with context sentences\",\n                    color: \"text-rose-400\",\n                    hover: \"hover:border-rose-500/50 hover:bg-rose-500/10\"\n                },\n                {\n                    label: \"Chem Bonding\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                    prompt: \"Quiz me on ionic vs covalent bonding principles\",\n                    color: \"text-cyan-400\",\n                    hover: \"hover:border-cyan-500/50 hover:bg-cyan-500/10\"\n                },\n                {\n                    label: \"Literature Quiz\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: 'Test my understanding of symbolism in \"The Great Gatsby\"',\n                    color: \"text-indigo-400\",\n                    hover: \"hover:border-indigo-500/50 hover:bg-indigo-500/10\"\n                },\n                {\n                    label: \"World Map\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Quiz me on European capitals and geography\",\n                    color: \"text-orange-400\",\n                    hover: \"hover:border-orange-500/50 hover:bg-orange-500/10\"\n                },\n                {\n                    label: \"Coding Logic\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n                    prompt: \"Give me 3 logic puzzles involving algorithms\",\n                    color: \"text-teal-400\",\n                    hover: \"hover:border-teal-500/50 hover:bg-teal-500/10\"\n                },\n                {\n                    label: \"Econ Basics\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                    prompt: \"Quiz me on Supply and Demand curves\",\n                    color: \"text-pink-400\",\n                    hover: \"hover:border-pink-500/50 hover:bg-pink-500/10\"\n                },\n                {\n                    label: \"Art History\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Test me on Renaissance period artists and works\",\n                    color: \"text-yellow-400\",\n                    hover: \"hover:border-yellow-500/50 hover:bg-yellow-500/10\"\n                },\n                {\n                    label: \"Psychology\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: \"Quiz me on different types of memory (Short vs Long term)\",\n                    color: \"text-violet-400\",\n                    hover: \"hover:border-violet-500/50 hover:bg-violet-500/10\"\n                },\n                {\n                    label: \"Data Structures\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n                    prompt: \"Test my knowledge on Linked Lists and Binary Trees\",\n                    color: \"text-lime-400\",\n                    hover: \"hover:border-lime-500/50 hover:bg-lime-500/10\"\n                }\n            ],\n            explainer: [\n                {\n                    label: \"Quantum Physics\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Explain Quantum Entanglement like I am 5 years old\",\n                    color: \"text-purple-400\",\n                    hover: \"hover:border-purple-500/50 hover:bg-purple-500/10\"\n                },\n                {\n                    label: \"Study Science\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: \"What are the most effective evidence-based study methods?\",\n                    color: \"text-rose-400\",\n                    hover: \"hover:border-rose-500/50 hover:bg-rose-500/10\"\n                },\n                {\n                    label: \"React Perf\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n                    prompt: \"How do I optimize large lists in React with virtualization?\",\n                    color: \"text-cyan-400\",\n                    hover: \"hover:border-cyan-500/50 hover:bg-cyan-500/10\"\n                },\n                {\n                    label: \"Black Holes\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Explain how Hawking Radiation works\",\n                    color: \"text-blue-400\",\n                    hover: \"hover:border-blue-500/50 hover:bg-blue-500/10\"\n                },\n                {\n                    label: \"Neural Networks\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: \"Break down how backpropagation works in Deep Learning\",\n                    color: \"text-emerald-400\",\n                    hover: \"hover:border-emerald-500/50 hover:bg-emerald-500/10\"\n                },\n                {\n                    label: \"Market Cycles\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                    prompt: \"Explain the difference between a Bear and Bull market\",\n                    color: \"text-amber-400\",\n                    hover: \"hover:border-amber-500/50 hover:bg-amber-500/10\"\n                },\n                {\n                    label: \"Photosynthesis\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Explain the light-dependent reactions in simple terms\",\n                    color: \"text-green-400\",\n                    hover: \"hover:border-green-500/50 hover:bg-green-500/10\"\n                },\n                {\n                    label: \"Blockchain\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n                    prompt: \"How does a consensus algorithm like Proof of Work function?\",\n                    color: \"text-zinc-400\",\n                    hover: \"hover:border-zinc-500/50 hover:bg-zinc-500/10\"\n                },\n                {\n                    label: \"Stoicism\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n                    prompt: \"What are the core principles of Stoic philosophy?\",\n                    color: \"text-orange-400\",\n                    hover: \"hover:border-orange-500/50 hover:bg-orange-500/10\"\n                },\n                {\n                    label: \"Genetic Editing\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                    prompt: \"Explain the CRISPR-Cas9 mechanism\",\n                    color: \"text-red-400\",\n                    hover: \"hover:border-red-500/50 hover:bg-red-500/10\"\n                },\n                {\n                    label: \"French Revolution\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n                    prompt: \"Explain the causes and consequences of the French Revolution\",\n                    color: \"text-sky-400\",\n                    hover: \"hover:border-sky-500/50 hover:bg-sky-500/10\"\n                },\n                {\n                    label: \"Thermodynamics\",\n                    icon: _barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n                    prompt: \"Explain the Second Law of Thermodynamics and entropy\",\n                    color: \"text-fuchsia-400\",\n                    hover: \"hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10\"\n                }\n            ]\n        }), []);\n    const [suggestions, setSuggestions] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(allSuggestions.explainer.slice(0, 5));\n    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{\n        const pool = mode === \"quiz\" ? allSuggestions.quiz : allSuggestions.explainer;\n        const shuffled = [\n            ...pool\n        ].sort(()=>0.5 - Math.random());\n        setSuggestions(shuffled.slice(0, 5));\n    }, [\n        mode,\n        allSuggestions\n    ]);\n    const processFile = react__WEBPACK_IMPORTED_MODULE_1___default().useCallback((file)=>{\n        if (!file.type.startsWith(\"image/\")) {\n            console.log(\"Only image files are allowed\");\n            return;\n        }\n        if (file.size > 10 * 1024 * 1024) {\n            console.log(\"File too large (max 10MB)\");\n            return;\n        }\n        setFiles([\n            file\n        ]);\n        const reader = new FileReader();\n        reader.onload = (e)=>setFilePreviews({\n                [file.name]: e.target?.result\n            });\n        reader.readAsDataURL(file);\n    }, []);\n    const handleDragOver = react__WEBPACK_IMPORTED_MODULE_1___default().useCallback((e)=>{\n        e.preventDefault();\n        e.stopPropagation();\n    }, []);\n    const handleDragLeave = react__WEBPACK_IMPORTED_MODULE_1___default().useCallback((e)=>{\n        e.preventDefault();\n        e.stopPropagation();\n    }, []);\n    const handleDrop = react__WEBPACK_IMPORTED_MODULE_1___default().useCallback((e)=>{\n        e.preventDefault();\n        e.stopPropagation();\n        const droppedFiles = Array.from(e.dataTransfer.files);\n        const imageFile = droppedFiles.find((file)=>file.type.startsWith(\"image/\"));\n        if (imageFile) processFile(imageFile);\n    }, [\n        processFile\n    ]);\n    const handleRemoveFile = (index)=>{\n        const fileToRemove = files[index];\n        if (fileToRemove && filePreviews[fileToRemove.name]) {\n            setFilePreviews({});\n        }\n        setFiles([]);\n    };\n    const handlePaste = react__WEBPACK_IMPORTED_MODULE_1___default().useCallback((e)=>{\n        const items = e.clipboardData?.items;\n        if (!items) return;\n        for(let i = 0; i < items.length; i++){\n            const item = items[i];\n            if (item && item.type.indexOf(\"image\") !== -1) {\n                const file = item.getAsFile();\n                if (file) {\n                    e.preventDefault();\n                    processFile(file);\n                    break;\n                }\n            }\n        }\n    }, [\n        processFile\n    ]);\n    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{\n        document.addEventListener(\"paste\", handlePaste);\n        return ()=>document.removeEventListener(\"paste\", handlePaste);\n    }, [\n        handlePaste\n    ]);\n    const renderSuggestion = (suggestion, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n            onClick: ()=>{\n                setInput(suggestion.prompt);\n            },\n            className: cn(\"flex items-center gap-2.5 rounded-full border border-gray-600/30 bg-gray-600/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:text-white shadow-sm\", suggestion.hover),\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(suggestion.icon, {\n                    className: cn(\"h-4.5 w-4.5\", suggestion.color)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                    lineNumber: 766,\n                    columnNumber: 9\n                }, undefined),\n                suggestion.label\n            ]\n        }, index, true, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n            lineNumber: 756,\n            columnNumber: 7\n        }, undefined);\n    const handleSubmit = ()=>{\n        if (input.trim() || files.length > 0) {\n            let messagePrefix = \"\";\n            if (showSearch) messagePrefix = \"[Search: \";\n            else if (showThink) messagePrefix = \"[Think: \";\n            else if (showCanvas) messagePrefix = \"[Canvas: \";\n            const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input;\n            onSend(formattedInput, files);\n            setInput(\"\");\n            setFiles([]);\n            setFilePreviews({});\n        }\n    };\n    const handleStartRecording = ()=>console.log(\"Started recording\");\n    const handleStopRecording = (duration)=>{\n        console.log(`Stopped recording after ${duration} seconds`);\n        setIsRecording(false);\n        onSend(`[Voice message - ${duration} seconds]`, []);\n    };\n    const hasContent = input.trim() !== \"\" || files.length > 0;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex w-full flex-col items-center gap-10 mb-12\",\n        children: [\n            !isRecording && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex flex-col items-center gap-3 px-4 transition-all duration-300 animate-fade-in mb-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex flex-wrap justify-center gap-3\",\n                        children: suggestions.slice(0, 3).map((suggestion, index)=>renderSuggestion(suggestion, index))\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 801,\n                        columnNumber: 13\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex flex-wrap justify-center gap-3\",\n                        children: suggestions.slice(3, 5).map((suggestion, index)=>renderSuggestion(suggestion, index + 3))\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 804,\n                        columnNumber: 13\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 800,\n                columnNumber: 11\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInput, {\n                value: input,\n                onValueChange: setInput,\n                isLoading: isLoading,\n                onSubmit: handleSubmit,\n                maxHeight: 400,\n                className: cn(\"w-[calc(100%-4px)] border-[#444444] bg-[#1F2023] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-in-out\", isRecording && \"border-red-500/70\", className),\n                disabled: isLoading || isRecording,\n                ref: ref || promptBoxRef,\n                onDragOver: handleDragOver,\n                onDragLeave: handleDragLeave,\n                onDrop: handleDrop,\n                children: [\n                    showToggle && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptModeToggle, {\n                        mode: mode,\n                        onModeChange: handleModeChange,\n                        disabled: isLoading || isRecording\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 828,\n                        columnNumber: 13\n                    }, undefined),\n                    files.length > 0 && !isRecording && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-2 flex flex-wrap gap-2 transition-all duration-300\",\n                        children: files.map((file, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"group relative\",\n                                children: file.type.startsWith(\"image/\") && filePreviews[file.name] && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"h-16 w-16 cursor-pointer overflow-hidden rounded-xl transition-all duration-300\",\n                                    onClick: ()=>{\n                                        const preview = filePreviews[file.name];\n                                        if (preview) setSelectedImage(preview);\n                                    },\n                                    role: \"button\",\n                                    tabIndex: 0,\n                                    onKeyDown: (e)=>{\n                                        if (e.key === \"Enter\" || e.key === \" \") {\n                                            const preview = filePreviews[file.name];\n                                            if (preview) setSelectedImage(preview);\n                                        }\n                                    },\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                            src: filePreviews[file.name] || \"\",\n                                            alt: file.name,\n                                            width: 64,\n                                            height: 64,\n                                            className: \"h-full w-full object-cover\"\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                            lineNumber: 856,\n                                            columnNumber: 25\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                            type: \"button\",\n                                            onClick: (e)=>{\n                                                e.stopPropagation();\n                                                handleRemoveFile(index);\n                                            },\n                                            className: \"absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity\",\n                                            \"aria-label\": `Remove ${file.name}`,\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                                className: \"h-3 w-3 text-white\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 872,\n                                                columnNumber: 27\n                                            }, undefined)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                            lineNumber: 863,\n                                            columnNumber: 25\n                                        }, undefined)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                    lineNumber: 841,\n                                    columnNumber: 23\n                                }, undefined)\n                            }, index, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                lineNumber: 838,\n                                columnNumber: 17\n                            }, undefined))\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 836,\n                        columnNumber: 13\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: cn(\"transition-all duration-300\", isRecording ? \"h-0 overflow-hidden opacity-0\" : \"opacity-100\"),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputTextarea, {\n                            placeholder: mode === \"quiz\" ? \"What would you like to practice?\" : showSearch ? \"Search the web...\" : showThink ? \"Think deeply...\" : showCanvas ? \"Create on canvas...\" : placeholder,\n                            className: \"text-base\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                            lineNumber: 887,\n                            columnNumber: 13\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 881,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(VoiceRecorder, {\n                        isRecording: isRecording,\n                        onStartRecording: handleStartRecording,\n                        onStopRecording: handleStopRecording\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 903,\n                        columnNumber: 11\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputActions, {\n                        className: \"flex items-center justify-between gap-2\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: cn(\"flex items-center gap-1 transition-opacity duration-300\", isRecording ? \"invisible h-0 opacity-0\" : \"visible opacity-100\"),\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputAction, {\n                                        tooltip: \"Upload image\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                            type: \"button\",\n                                            onClick: ()=>uploadInputRef.current?.click(),\n                                            className: \"flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-gray-600/30 hover:text-[#D1D5DB]\",\n                                            disabled: isRecording,\n                                            \"aria-label\": \"Upload image\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"], {\n                                                    className: \"h-5 w-5 transition-colors\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                    lineNumber: 924,\n                                                    columnNumber: 19\n                                                }, undefined),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                                    ref: uploadInputRef,\n                                                    type: \"file\",\n                                                    className: \"hidden\",\n                                                    onChange: (e)=>{\n                                                        if (e.target.files && e.target.files.length > 0) {\n                                                            const file = e.target.files[0];\n                                                            if (file) processFile(file);\n                                                        }\n                                                        e.target.value = \"\";\n                                                    },\n                                                    accept: \"image/*\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                    lineNumber: 925,\n                                                    columnNumber: 19\n                                                }, undefined)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                            lineNumber: 917,\n                                            columnNumber: 17\n                                        }, undefined)\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                        lineNumber: 916,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"flex items-center\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                                type: \"button\",\n                                                onClick: ()=>handleToggleChange(\"search\"),\n                                                className: cn(\"flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all\", showSearch ? \"border-[#1EAEDB] bg-[#1EAEDB]/15 text-[#1EAEDB]\" : \"border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]\"),\n                                                \"aria-pressed\": showSearch,\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.div, {\n                                                        animate: {\n                                                            rotate: showSearch ? 360 : 0,\n                                                            scale: showSearch ? 1.1 : 1\n                                                        },\n                                                        transition: {\n                                                            type: \"spring\",\n                                                            stiffness: 260,\n                                                            damping: 25\n                                                        },\n                                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n                                                            className: \"h-4 w-4\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 960,\n                                                            columnNumber: 21\n                                                        }, undefined)\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                        lineNumber: 953,\n                                                        columnNumber: 19\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_12__.AnimatePresence, {\n                                                        children: showSearch && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.span, {\n                                                            initial: {\n                                                                width: 0,\n                                                                opacity: 0\n                                                            },\n                                                            animate: {\n                                                                width: \"auto\",\n                                                                opacity: 1\n                                                            },\n                                                            exit: {\n                                                                width: 0,\n                                                                opacity: 0\n                                                            },\n                                                            transition: {\n                                                                duration: 0.2\n                                                            },\n                                                            className: \"flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#1EAEDB]\",\n                                                            children: \"Search\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 964,\n                                                            columnNumber: 23\n                                                        }, undefined)\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                        lineNumber: 962,\n                                                        columnNumber: 19\n                                                    }, undefined)\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 942,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CustomDivider, {}, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 977,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                                type: \"button\",\n                                                onClick: ()=>handleToggleChange(\"think\"),\n                                                className: cn(\"flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all\", showThink ? \"border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6]\" : \"border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]\"),\n                                                \"aria-pressed\": showThink,\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.div, {\n                                                        animate: {\n                                                            rotate: showThink ? 360 : 0,\n                                                            scale: showThink ? 1.1 : 1\n                                                        },\n                                                        transition: {\n                                                            type: \"spring\",\n                                                            stiffness: 260,\n                                                            damping: 25\n                                                        },\n                                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {\n                                                            className: \"h-4 w-4\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 997,\n                                                            columnNumber: 21\n                                                        }, undefined)\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                        lineNumber: 990,\n                                                        columnNumber: 19\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_12__.AnimatePresence, {\n                                                        children: showThink && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.span, {\n                                                            initial: {\n                                                                width: 0,\n                                                                opacity: 0\n                                                            },\n                                                            animate: {\n                                                                width: \"auto\",\n                                                                opacity: 1\n                                                            },\n                                                            exit: {\n                                                                width: 0,\n                                                                opacity: 0\n                                                            },\n                                                            transition: {\n                                                                duration: 0.2\n                                                            },\n                                                            className: \"flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#8B5CF6]\",\n                                                            children: \"Think\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1001,\n                                                            columnNumber: 23\n                                                        }, undefined)\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                        lineNumber: 999,\n                                                        columnNumber: 19\n                                                    }, undefined)\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 979,\n                                                columnNumber: 17\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                        lineNumber: 941,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                lineNumber: 910,\n                                columnNumber: 13\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"flex items-center gap-2\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"relative\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputAction, {\n                                                tooltip: \"Switch model\",\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                                    type: \"button\",\n                                                    onClick: ()=>setShowModelMenu(!showModelMenu),\n                                                    className: cn(\"flex h-8 items-center gap-1.5 rounded-full border border-gray-600/50 bg-gray-600/20 px-2.5 py-1 text-xs font-medium text-[#9CA3AF] transition-all hover:border-gray-500 hover:text-[#D1D5DB]\", showModelMenu && \"border-[#9b87f5]/50 bg-[#9b87f5]/10 text-[#9b87f5]\"),\n                                                    disabled: isRecording || isLoading,\n                                                    children: [\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_13__[\"default\"], {\n                                                            className: \"h-3.5 w-3.5\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1028,\n                                                            columnNumber: 21\n                                                        }, undefined),\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                            className: \"hidden sm:inline\",\n                                                            children: _lib_ai_config__WEBPACK_IMPORTED_MODULE_2__.AI_MODELS.find((m)=>m.id === model)?.name || \"Model\"\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1029,\n                                                            columnNumber: 21\n                                                        }, undefined),\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_14__[\"default\"], {\n                                                            className: cn(\"h-3 w-3 transition-transform\", showModelMenu && \"rotate-180\")\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1032,\n                                                            columnNumber: 21\n                                                        }, undefined)\n                                                    ]\n                                                }, void 0, true, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                    lineNumber: 1019,\n                                                    columnNumber: 19\n                                                }, undefined)\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1018,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_12__.AnimatePresence, {\n                                                children: showModelMenu && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                                                    children: [\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.div, {\n                                                            initial: {\n                                                                opacity: 0\n                                                            },\n                                                            animate: {\n                                                                opacity: 1\n                                                            },\n                                                            exit: {\n                                                                opacity: 0\n                                                            },\n                                                            className: \"fixed inset-0 z-40\",\n                                                            onClick: ()=>setShowModelMenu(false)\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1044,\n                                                            columnNumber: 23\n                                                        }, undefined),\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_6__.motion.div, {\n                                                            initial: {\n                                                                opacity: 0,\n                                                                scale: 0.95,\n                                                                y: 10\n                                                            },\n                                                            animate: {\n                                                                opacity: 1,\n                                                                scale: 1,\n                                                                y: 0\n                                                            },\n                                                            exit: {\n                                                                opacity: 0,\n                                                                scale: 0.95,\n                                                                y: 10\n                                                            },\n                                                            className: \"absolute right-0 bottom-full z-50 mb-2 w-56 overflow-hidden rounded-2xl border border-[#333333] bg-[#1F2023] p-1 shadow-2xl\",\n                                                            children: _lib_ai_config__WEBPACK_IMPORTED_MODULE_2__.AI_MODELS.map((m)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                                                    onClick: ()=>{\n                                                                        onModelChange?.(m.id);\n                                                                        setInternalModel(m.id);\n                                                                        setShowModelMenu(false);\n                                                                    },\n                                                                    className: cn(\"flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left transition-colors\", model === m.id ? \"bg-[#9b87f5]/10 text-[#9b87f5]\" : \"text-gray-400 hover:bg-gray-600/30 hover:text-gray-200\"),\n                                                                    children: [\n                                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                                            className: \"flex w-full items-center justify-between\",\n                                                                            children: [\n                                                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                                                    className: \"text-sm font-semibold\",\n                                                                                    children: m.name\n                                                                                }, void 0, false, {\n                                                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                                                    lineNumber: 1073,\n                                                                                    columnNumber: 31\n                                                                                }, undefined),\n                                                                                model === m.id && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                                                                                    className: \"h-3.5 w-3.5\"\n                                                                                }, void 0, false, {\n                                                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                                                    lineNumber: 1077,\n                                                                                    columnNumber: 33\n                                                                                }, undefined)\n                                                                            ]\n                                                                        }, void 0, true, {\n                                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                                            lineNumber: 1072,\n                                                                            columnNumber: 29\n                                                                        }, undefined),\n                                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                                            className: \"text-[10px] opacity-70\",\n                                                                            children: m.provider\n                                                                        }, void 0, false, {\n                                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                                            lineNumber: 1080,\n                                                                            columnNumber: 29\n                                                                        }, undefined)\n                                                                    ]\n                                                                }, m.id, true, {\n                                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                                    lineNumber: 1058,\n                                                                    columnNumber: 27\n                                                                }, undefined))\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                            lineNumber: 1051,\n                                                            columnNumber: 23\n                                                        }, undefined)\n                                                    ]\n                                                }, void 0, true)\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1041,\n                                                columnNumber: 17\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                        lineNumber: 1017,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PromptInputAction, {\n                                        tooltip: isLoading ? \"Stop generation\" : isRecording ? \"Stop recording\" : hasContent ? \"Send message\" : \"Voice message\",\n                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Button, {\n                                            variant: \"default\",\n                                            size: \"icon\",\n                                            className: cn(\"h-8 w-8 rounded-full transition-all duration-200\", isRecording ? \"bg-transparent text-red-500 hover:bg-gray-600/30 hover:text-red-400\" : hasContent ? \"bg-white text-[#1F2023] hover:bg-white/80\" : \"bg-transparent text-[#9CA3AF] hover:bg-gray-600/30 hover:text-[#D1D5DB]\"),\n                                            onClick: ()=>{\n                                                if (isRecording) setIsRecording(false);\n                                                else if (hasContent) handleSubmit();\n                                                else setIsRecording(true);\n                                            },\n                                            disabled: isLoading && !hasContent,\n                                            \"aria-label\": isLoading ? \"Stop generation\" : isRecording ? \"Stop recording\" : hasContent ? \"Send message\" : \"Start voice message\",\n                                            children: isLoading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_15__[\"default\"], {\n                                                className: \"h-4 w-4 animate-pulse fill-[#1F2023]\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1130,\n                                                columnNumber: 19\n                                            }, undefined) : isRecording ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_16__[\"default\"], {\n                                                className: \"h-5 w-5 text-red-500\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1132,\n                                                columnNumber: 19\n                                            }, undefined) : hasContent ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_17__[\"default\"], {\n                                                className: \"h-4 w-4 text-[#1F2023]\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1134,\n                                                columnNumber: 19\n                                            }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ArrowUp_BrainCog_Check_ChevronDown_Globe_GraduationCap_Layers_Mic_Paperclip_Square_StopCircle_X_lucide_react__WEBPACK_IMPORTED_MODULE_18__[\"default\"], {\n                                                className: \"h-5 w-5 text-[#1F2023] transition-colors\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                                lineNumber: 1136,\n                                                columnNumber: 19\n                                            }, undefined)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                            lineNumber: 1102,\n                                            columnNumber: 15\n                                        }, undefined)\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                        lineNumber: 1091,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                                lineNumber: 1016,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                        lineNumber: 909,\n                        columnNumber: 11\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 810,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ImageViewDialog, {\n                imageUrl: selectedImage,\n                onClose: ()=>setSelectedImage(null)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n                lineNumber: 1144,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\ui\\\\ai-prompt-box.tsx\",\n        lineNumber: 798,\n        columnNumber: 7\n    }, undefined);\n});\nPromptInputBox.displayName = \"PromptInputBox\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9jb21wb25lbnRzL3VpL2FpLXByb21wdC1ib3gudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUwRDtBQUNFO0FBQ0o7QUFlbEM7QUFDNkI7QUFDUztBQUU1RCxNQUFNa0IsS0FBSyxDQUFDLEdBQUdDLFVBQ2JBLFFBQVFDLE1BQU0sQ0FBQ0MsU0FBU0MsSUFBSSxDQUFDO0FBRS9CLE1BQU1DLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJoQixDQUFDO0FBRUQsTUFBTUMsb0JBQW9CO0lBQ3hCUixzREFBZSxDQUFDO1FBQ2QsTUFBTVUsVUFBVTtRQUNoQixJQUFJLE9BQU9DLGFBQWEsZUFBZSxDQUFDQSxTQUFTQyxjQUFjLENBQUNGLFVBQVU7WUFDeEUsTUFBTUcsYUFBYUYsU0FBU0csYUFBYSxDQUFDO1lBQzFDRCxXQUFXRSxFQUFFLEdBQUdMO1lBQ2hCRyxXQUFXRyxTQUFTLEdBQUdUO1lBQ3ZCSSxTQUFTTSxJQUFJLENBQUNDLFdBQVcsQ0FBQ0w7UUFDNUI7SUFDRixHQUFHLEVBQUU7QUFDUDtBQU9BLE1BQU1NLHlCQUFXbkIsdURBQWdCLENBQy9CLENBQUMsRUFBRXFCLFNBQVMsRUFBRSxHQUFHQyxPQUFPLEVBQUVDLG9CQUN4Qiw4REFBQ0M7UUFDQ0gsV0FBV25CLEdBQ1Qsc1VBQ0FtQjtRQUVGRSxLQUFLQTtRQUNMRSxNQUFNO1FBQ0wsR0FBR0gsS0FBSzs7Ozs7O0FBSWZILFNBQVNPLFdBQVcsR0FBRztBQUV2QixNQUFNQyxrQkFBa0IxQyw2REFBeUI7QUFDakQsTUFBTTRDLFVBQVU1Qyx5REFBcUI7QUFDckMsTUFBTThDLGlCQUFpQjlDLDREQUF3QjtBQUUvQyxNQUFNZ0QsK0JBQWlCakMsdURBQWdCLENBR3JDLENBQUMsRUFBRXFCLFNBQVMsRUFBRWEsYUFBYSxDQUFDLEVBQUUsR0FBR1osT0FBTyxFQUFFQyxvQkFDMUMsOERBQUN0Qyw0REFBd0I7UUFDdkJzQyxLQUFLQTtRQUNMVyxZ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c0ZBR3JCLDhEQUFDdUI7NEVBQUt2QixXQUFVO3NGQUNib1AsRUFBRUUsUUFBUTs7Ozs7OzttRUF0QlJGLEVBQUUxUCxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFnQ3ZCLDhEQUFDdUk7d0NBQ0NDLFNBQ0VwQyxZQUNJLG9CQUNBdkQsY0FDRSxtQkFDQXFNLGFBQ0UsaUJBQ0E7a0RBR1osNEVBQUNsTjs0Q0FDQ0MsU0FBUTs0Q0FDUkMsTUFBSzs0Q0FDTDVCLFdBQVduQixHQUNULG9EQUNBMEQsY0FDSSx3RUFDQXFNLGFBQ0UsOENBQ0E7NENBRVI3RixTQUFTO2dEQUNQLElBQUl4RyxhQUFhMkgsZUFBZTtxREFDM0IsSUFBSTBFLFlBQVlOO3FEQUNoQnBFLGVBQWU7NENBQ3RCOzRDQUNBOUQsVUFBVU4sYUFBYSxDQUFDOEk7NENBQ3hCM0gsY0FDRW5CLFlBQ0ksb0JBQ0F2RCxjQUNFLG1CQUNBcU0sYUFDRSxpQkFDQTtzREFHVDlJLDBCQUNDLDhEQUFDdEgsNEtBQU1BO2dEQUFDd0IsV0FBVTs7Ozs7NERBQ2hCdUMsNEJBQ0YsOERBQUM5RCw0S0FBVUE7Z0RBQUN1QixXQUFVOzs7Ozs0REFDcEI0TywyQkFDRiw4REFBQzdRLDRLQUFPQTtnREFBQ2lDLFdBQVU7Ozs7OzBFQUVuQiw4REFBQzFCLDRLQUFHQTtnREFBQzBCLFdBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBUTNCLDhEQUFDMkU7Z0JBQ0NDLFVBQVVvRjtnQkFDVm5GLFNBQVMsSUFBTW9GLGlCQUFpQjs7Ozs7Ozs7Ozs7O0FBSXhDLEdBQ0U7QUFDRmQsZUFBZTlJLFdBQVcsR0FBRyIsInNvdXJjZXMiOlsid2VicGFjazovL3NtYXJ0bGkvLi9jb21wb25lbnRzL3VpL2FpLXByb21wdC1ib3gudHN4PzRiZTciXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0ICogYXMgRGlhbG9nUHJpbWl0aXZlIGZyb20gJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnO1xyXG5pbXBvcnQgKiBhcyBUb29sdGlwUHJpbWl0aXZlIGZyb20gJ0ByYWRpeC11aS9yZWFjdC10b29sdGlwJztcclxuaW1wb3J0IHsgQW5pbWF0ZVByZXNlbmNlLCBtb3Rpb24gfSBmcm9tICdmcmFtZXItbW90aW9uJztcclxuaW1wb3J0IHtcclxuICBBcnJvd1VwLFxyXG4gIEJyYWluQ29nLFxyXG4gIENoZWNrLFxyXG4gIENoZXZyb25Eb3duLFxyXG4gIEZvbGRlckNvZyxcclxuICBHbG9iZSxcclxuICBHcmFkdWF0aW9uQ2FwLFxyXG4gIExheWVycyxcclxuICBNaWMsXHJcbiAgUGFwZXJjbGlwLFxyXG4gIFNxdWFyZSxcclxuICBTdG9wQ2lyY2xlLFxyXG4gIFgsXHJcbn0gZnJvbSAnbHVjaWRlLXJlYWN0JztcclxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IEFJX01PREVMUywgdHlwZSBBSU1vZGVsSWQgfSBmcm9tICdAL2xpYi9haS9jb25maWcnO1xyXG5cclxuY29uc3QgY24gPSAoLi4uY2xhc3NlczogKHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwgfCBmYWxzZSlbXSkgPT5cclxuICBjbGFzc2VzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XHJcblxyXG5jb25zdCBzdHlsZXMgPSBgXHJcbiAgKjpmb2N1cy12aXNpYmxlIHtcclxuICAgIG91dGxpbmUtb2Zmc2V0OiAwICFpbXBvcnRhbnQ7XHJcbiAgICAtLXJpbmctb2Zmc2V0OiAwICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG4gIHRleHRhcmVhIHtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjYgIWltcG9ydGFudDtcclxuICB9XHJcbiAgdGV4dGFyZWE6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICAgIHdpZHRoOiA2cHg7XHJcbiAgfVxyXG4gIHRleHRhcmVhOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XHJcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICB9XHJcbiAgdGV4dGFyZWE6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICM0NDQ0NDQ7XHJcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgfVxyXG4gIHRleHRhcmVhOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTU1NTU1O1xyXG4gIH1cclxuYDtcclxuXHJcbmNvbnN0IHVzZVN0eWxlSW5qZWN0aW9uID0gKCkgPT4ge1xyXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBzdHlsZUlkID0gJ2FpLXByb21wdC1ib3gtc3R5bGVzJztcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdHlsZUlkKSkge1xyXG4gICAgICBjb25zdCBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgc3R5bGVTaGVldC5pZCA9IHN0eWxlSWQ7XHJcbiAgICAgIHN0eWxlU2hlZXQuaW5uZXJUZXh0ID0gc3R5bGVzO1xyXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlU2hlZXQpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxufTtcclxuXHJcbmludGVyZmFjZSBUZXh0YXJlYVByb3BzXHJcbiAgZXh0ZW5kcyBSZWFjdC5UZXh0YXJlYUhUTUxBdHRyaWJ1dGVzPEhUTUxUZXh0QXJlYUVsZW1lbnQ+IHtcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IFRleHRhcmVhID0gUmVhY3QuZm9yd2FyZFJlZjxIVE1MVGV4dEFyZWFFbGVtZW50LCBUZXh0YXJlYVByb3BzPihcclxuICAoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4gKFxyXG4gICAgPHRleHRhcmVhXHJcbiAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgJ3Njcm9sbGJhci10aGluIHNjcm9sbGJhci10aHVtYi1bIzQ0NDQ0NF0gc2Nyb2xsYmFyLXRyYWNrLXRyYW5zcGFyZW50IGhvdmVyOnNjcm9sbGJhci10aHVtYi1bIzU1NTU1NV0gZmxleCBtaW4taC1bNDRweF0gdy1mdWxsIHJlc2l6ZS1ub25lIGJvcmRlci1ub25lIGJnLXRyYW5zcGFyZW50IHB4LTMgcHktMi41IHRleHQtYmFzZSB0ZXh0LWdyYXktMTAwIHBsYWNlaG9sZGVyOnRleHQtZ3JheS00MDAgZm9jdXMtdmlzaWJsZTpvdXRsaW5lLW5vbmUgZm9jdXMtdmlzaWJsZTpyaW5nLTAgZGlzYWJsZWQ6Y3Vyc29yLW5vdC1hbGxvd2VkIGRpc2FibGVkOm9wYWNpdHktNTAnLFxyXG4gICAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgKX1cclxuICAgICAgcmVmPXtyZWZ9XHJcbiAgICAgIHJvd3M9ezF9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgIC8+XHJcbiAgKSxcclxuKTtcclxuVGV4dGFyZWEuZGlzcGxheU5hbWUgPSAnVGV4dGFyZWEnO1xyXG5cclxuY29uc3QgVG9vbHRpcFByb3ZpZGVyID0gVG9vbHRpcFByaW1pdGl2ZS5Qcm92aWRlcjtcclxuY29uc3QgVG9vbHRpcCA9IFRvb2x0aXBQcmltaXRpdmUuUm9vdDtcclxuY29uc3QgVG9vbHRpcFRyaWdnZXIgPSBUb29sdGlwUHJpbWl0aXZlLlRyaWdnZXI7XHJcblxyXG5jb25zdCBUb29sdGlwQ29udGVudCA9IFJlYWN0LmZvcndhcmRSZWY8XHJcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgVG9vbHRpcFByaW1pdGl2ZS5Db250ZW50PixcclxuICBSZWFjdC5Db21wb25lbnRQcm9wc1dpdGhvdXRSZWY8dHlwZW9mIFRvb2x0aXBQcmltaXRpdmUuQ29udGVudD5cclxuPigoeyBjbGFzc05hbWUsIHNpZGVPZmZzZXQgPSA0LCAuLi5wcm9wcyB9LCByZWYpID0+IChcclxuICA8VG9vbHRpcFByaW1pdGl2ZS5Db250ZW50XHJcbiAgICByZWY9e3JlZn1cclxuICAgIHNpZGVPZmZzZXQ9e3NpZGVPZmZzZXR9XHJcbiAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAnZmFkZS1pbi0wIHpvb20taW4tOTUgZGF0YS1bc3RhdGU9Y2xvc2VkXTpmYWRlLW91dC0wIGRhdGEtW3N0YXRlPWNsb3NlZF06em9vbS1vdXQtOTUgZGF0YS1bc2lkZT1ib3R0b21dOnNsaWRlLWluLWZyb20tdG9wLTIgZGF0YS1bc2lkZT1sZWZ0XTpzbGlkZS1pbi1mcm9tLXJpZ2h0LTIgZGF0YS1bc2lkZT1yaWdodF06c2xpZGUtaW4tZnJvbS1sZWZ0LTIgZGF0YS1bc2lkZT10b3BdOnNsaWRlLWluLWZyb20tYm90dG9tLTIgei01MCBhbmltYXRlLWluIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItWyMzMzMzMzNdIGJnLVsjMUYyMDIzXSBweC0zIHB5LTEuNSB0ZXh0LXNtIHRleHQtd2hpdGUgc2hhZG93LW1kIGRhdGEtW3N0YXRlPWNsb3NlZF06YW5pbWF0ZS1vdXQnLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICApfVxyXG4gICAgey4uLnByb3BzfVxyXG4gIC8+XHJcbikpO1xyXG5Ub29sdGlwQ29udGVudC5kaXNwbGF5TmFtZSA9IFRvb2x0aXBQcmltaXRpdmUuQ29udGVudC5kaXNwbGF5TmFtZTtcclxuXHJcbmNvbnN0IERpYWxvZyA9IERpYWxvZ1ByaW1pdGl2ZS5Sb290O1xyXG5jb25zdCBEaWFsb2dQb3J0YWwgPSBEaWFsb2dQcmltaXRpdmUuUG9ydGFsO1xyXG5cclxuY29uc3QgRGlhbG9nT3ZlcmxheSA9IFJlYWN0LmZvcndhcmRSZWY8XHJcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgRGlhbG9nUHJpbWl0aXZlLk92ZXJsYXk+LFxyXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzV2l0aG91dFJlZjx0eXBlb2YgRGlhbG9nUHJpbWl0aXZlLk92ZXJsYXk+XHJcbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IChcclxuICA8RGlhbG9nUHJpbWl0aXZlLk92ZXJsYXlcclxuICAgIHJlZj17cmVmfVxyXG4gICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgJ2RhdGEtW3N0YXRlPWNsb3NlZF06ZmFkZS1vdXQtMCBkYXRhLVtzdGF0ZT1vcGVuXTpmYWRlLWluLTAgZml4ZWQgaW5zZXQtMCB6LTUwIGJnLWJsYWNrLzYwIGJhY2tkcm9wLWJsdXItc20gZGF0YS1bc3RhdGU9Y2xvc2VkXTphbmltYXRlLW91dCBkYXRhLVtzdGF0ZT1vcGVuXTphbmltYXRlLWluJyxcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgKX1cclxuICAgIHsuLi5wcm9wc31cclxuICAvPlxyXG4pKTtcclxuRGlhbG9nT3ZlcmxheS5kaXNwbGF5TmFtZSA9IERpYWxvZ1ByaW1pdGl2ZS5PdmVybGF5LmRpc3BsYXlOYW1lO1xyXG5cclxuY29uc3QgRGlhbG9nQ29udGVudCA9IFJlYWN0LmZvcndhcmRSZWY8XHJcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgRGlhbG9nUHJpbWl0aXZlLkNvbnRlbnQ+LFxyXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzV2l0aG91dFJlZjx0eXBlb2YgRGlhbG9nUHJpbWl0aXZlLkNvbnRlbnQ+XHJcbj4oKHsgY2xhc3NOYW1lLCBjaGlsZHJlbiwgLi4ucHJvcHMgfSwgcmVmKSA9PiAoXHJcbiAgPERpYWxvZ1BvcnRhbD5cclxuICAgIDxEaWFsb2dPdmVybGF5IC8+XHJcbiAgICA8RGlhbG9nUHJpbWl0aXZlLkNvbnRlbnRcclxuICAgICAgcmVmPXtyZWZ9XHJcbiAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgJ2RhdGEtW3N0YXRlPWNsb3NlZF06ZmFkZS1vdXQtMCBkYXRhLVtzdGF0ZT1vcGVuXTpmYWRlLWluLTAgZGF0YS1bc3RhdGU9Y2xvc2VkXTp6b29tLW91dC05NSBkYXRhLVtzdGF0ZT1vcGVuXTp6b29tLWluLTk1IGZpeGVkIHRvcC1bNTAlXSBsZWZ0LVs1MCVdIHotNTAgZ3JpZCB3LWZ1bGwgbWF4LXctWzkwdnddIHRyYW5zbGF0ZS14LVstNTAlXSB0cmFuc2xhdGUteS1bLTUwJV0gZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1bIzMzMzMzM10gYmctWyMxRjIwMjNdIHAtMCBzaGFkb3cteGwgZHVyYXRpb24tMzAwIGRhdGEtW3N0YXRlPWNsb3NlZF06YW5pbWF0ZS1vdXQgZGF0YS1bc3RhdGU9b3Blbl06YW5pbWF0ZS1pbiBtZDptYXgtdy1bODAwcHhdJyxcclxuICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICl9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgICA8RGlhbG9nUHJpbWl0aXZlLkNsb3NlIGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC00IHJpZ2h0LTQgei0xMCByb3VuZGVkLWZ1bGwgYmctWyMyRTMwMzNdLzgwIHAtMiB0cmFuc2l0aW9uLWFsbCBob3ZlcjpiZy1bIzJFMzAzM11cIj5cclxuICAgICAgICA8WCBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtZ3JheS0yMDAgaG92ZXI6dGV4dC13aGl0ZVwiIC8+XHJcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPkNsb3NlPC9zcGFuPlxyXG4gICAgICA8L0RpYWxvZ1ByaW1pdGl2ZS5DbG9zZT5cclxuICAgIDwvRGlhbG9nUHJpbWl0aXZlLkNvbnRlbnQ+XHJcbiAgPC9EaWFsb2dQb3J0YWw+XHJcbikpO1xyXG5EaWFsb2dDb250ZW50LmRpc3BsYXlOYW1lID0gRGlhbG9nUHJpbWl0aXZlLkNvbnRlbnQuZGlzcGxheU5hbWU7XHJcblxyXG5jb25zdCBEaWFsb2dUaXRsZSA9IFJlYWN0LmZvcndhcmRSZWY8XHJcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgRGlhbG9nUHJpbWl0aXZlLlRpdGxlPixcclxuICBSZWFjdC5Db21wb25lbnRQcm9wc1dpdGhvdXRSZWY8dHlwZW9mIERpYWxvZ1ByaW1pdGl2ZS5UaXRsZT5cclxuPigoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4gKFxyXG4gIDxEaWFsb2dQcmltaXRpdmUuVGl0bGVcclxuICAgIHJlZj17cmVmfVxyXG4gICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgJ2ZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTEwMCB0ZXh0LWxnIGxlYWRpbmctbm9uZSB0cmFja2luZy10aWdodCcsXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICl9XHJcbiAgICB7Li4ucHJvcHN9XHJcbiAgLz5cclxuKSk7XHJcbkRpYWxvZ1RpdGxlLmRpc3BsYXlOYW1lID0gRGlhbG9nUHJpbWl0aXZlLlRpdGxlLmRpc3BsYXlOYW1lO1xyXG5cclxuaW50ZXJmYWNlIEJ1dHRvblByb3BzIGV4dGVuZHMgUmVhY3QuQnV0dG9uSFRNTEF0dHJpYnV0ZXM8SFRNTEJ1dHRvbkVsZW1lbnQ+IHtcclxuICB2YXJpYW50PzogJ2RlZmF1bHQnIHwgJ291dGxpbmUnIHwgJ2dob3N0JztcclxuICBzaXplPzogJ2RlZmF1bHQnIHwgJ3NtJyB8ICdsZycgfCAnaWNvbic7XHJcbn1cclxuXHJcbmNvbnN0IEJ1dHRvbiA9IFJlYWN0LmZvcndhcmRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQsIEJ1dHRvblByb3BzPihcclxuICAoeyBjbGFzc05hbWUsIHZhcmlhbnQgPSAnZGVmYXVsdCcsIHNpemUgPSAnZGVmYXVsdCcsIC4uLnByb3BzIH0sIHJlZikgPT4ge1xyXG4gICAgY29uc3QgdmFyaWFudENsYXNzZXMgPSB7XHJcbiAgICAgIGRlZmF1bHQ6ICdiZy13aGl0ZSBob3ZlcjpiZy13aGl0ZS84MCB0ZXh0LWJsYWNrJyxcclxuICAgICAgb3V0bGluZTogJ2JvcmRlciBib3JkZXItWyM0NDQ0NDRdIGJnLXRyYW5zcGFyZW50IGhvdmVyOmJnLVsjM0EzQTQwXScsXHJcbiAgICAgIGdob3N0OiAnYmctdHJhbnNwYXJlbnQgaG92ZXI6YmctWyMzQTNBNDBdJyxcclxuICAgIH07XHJcbiAgICBjb25zdCBzaXplQ2xhc3NlcyA9IHtcclxuICAgICAgZGVmYXVsdDogJ2gtMTAgcHgtNCBweS0yJyxcclxuICAgICAgc206ICdoLTggcHgtMyB0ZXh0LXNtJyxcclxuICAgICAgbGc6ICdoLTEyIHB4LTYnLFxyXG4gICAgICBpY29uOiAnaC04IHctOCByb3VuZGVkLWZ1bGwgYXNwZWN0LVsxLzFdJyxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgICAnaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24tY29sb3JzIGZvY3VzLXZpc2libGU6b3V0bGluZS1ub25lIGRpc2FibGVkOnBvaW50ZXItZXZlbnRzLW5vbmUgZGlzYWJsZWQ6b3BhY2l0eS01MCcsXHJcbiAgICAgICAgICB2YXJpYW50Q2xhc3Nlc1t2YXJpYW50XSxcclxuICAgICAgICAgIHNpemVDbGFzc2VzW3NpemVdLFxyXG4gICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgICl9XHJcbiAgICAgICAgcmVmPXtyZWZ9XHJcbiAgICAgICAgey4uLnByb3BzfVxyXG4gICAgICAvPlxyXG4gICAgKTtcclxuICB9LFxyXG4pO1xyXG5CdXR0b24uZGlzcGxheU5hbWUgPSAnQnV0dG9uJztcclxuXHJcbmludGVyZmFjZSBWb2ljZVJlY29yZGVyUHJvcHMge1xyXG4gIGlzUmVjb3JkaW5nOiBib29sZWFuO1xyXG4gIG9uU3RhcnRSZWNvcmRpbmc6ICgpID0+IHZvaWQ7XHJcbiAgb25TdG9wUmVjb3JkaW5nOiAoZHVyYXRpb246IG51bWJlcikgPT4gdm9pZDtcclxuICB2aXN1YWxpemVyQmFycz86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgVm9pY2VSZWNvcmRlcjogUmVhY3QuRkM8Vm9pY2VSZWNvcmRlclByb3BzPiA9ICh7XHJcbiAgaXNSZWNvcmRpbmcsXHJcbiAgb25TdGFydFJlY29yZGluZyxcclxuICBvblN0b3BSZWNvcmRpbmcsXHJcbiAgdmlzdWFsaXplckJhcnMgPSAzMixcclxufSkgPT4ge1xyXG4gIGNvbnN0IFt0aW1lLCBzZXRUaW1lXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IHRpbWVSZWYgPSBSZWFjdC51c2VSZWYoMCk7XHJcbiAgY29uc3QgdGltZXJSZWYgPSBSZWFjdC51c2VSZWY8UmV0dXJuVHlwZTx0eXBlb2Ygc2V0SW50ZXJ2YWw+IHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3Qgd2FzUmVjb3JkaW5nUmVmID0gUmVhY3QudXNlUmVmKGZhbHNlKTtcclxuICBjb25zdCBvblN0YXJ0UmVjb3JkaW5nUmVmID0gUmVhY3QudXNlUmVmKG9uU3RhcnRSZWNvcmRpbmcpO1xyXG4gIGNvbnN0IG9uU3RvcFJlY29yZGluZ1JlZiA9IFJlYWN0LnVzZVJlZihvblN0b3BSZWNvcmRpbmcpO1xyXG5cclxuICBvblN0YXJ0UmVjb3JkaW5nUmVmLmN1cnJlbnQgPSBvblN0YXJ0UmVjb3JkaW5nO1xyXG4gIG9uU3RvcFJlY29yZGluZ1JlZi5jdXJyZW50ID0gb25TdG9wUmVjb3JkaW5nO1xyXG4gIHRpbWVSZWYuY3VycmVudCA9IHRpbWU7XHJcblxyXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaXNSZWNvcmRpbmcpIHtcclxuICAgICAgd2FzUmVjb3JkaW5nUmVmLmN1cnJlbnQgPSB0cnVlO1xyXG4gICAgICBvblN0YXJ0UmVjb3JkaW5nUmVmLmN1cnJlbnQoKTtcclxuICAgICAgdGltZXJSZWYuY3VycmVudCA9IHNldEludGVydmFsKCgpID0+IHNldFRpbWUoKHQpID0+IHQgKyAxKSwgMTAwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGltZXJSZWYuY3VycmVudCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJSZWYuY3VycmVudCk7XHJcbiAgICAgICAgdGltZXJSZWYuY3VycmVudCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHdhc1JlY29yZGluZ1JlZi5jdXJyZW50KSB7XHJcbiAgICAgICAgb25TdG9wUmVjb3JkaW5nUmVmLmN1cnJlbnQodGltZVJlZi5jdXJyZW50KTtcclxuICAgICAgICB3YXNSZWNvcmRpbmdSZWYuY3VycmVudCA9IGZhbHNlO1xyXG4gICAgICAgIHNldFRpbWUoMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpZiAodGltZXJSZWYuY3VycmVudCkgY2xlYXJJbnRlcnZhbCh0aW1lclJlZi5jdXJyZW50KTtcclxuICAgIH07XHJcbiAgfSwgW2lzUmVjb3JkaW5nXSk7XHJcblxyXG4gIGNvbnN0IGZvcm1hdFRpbWUgPSAoc2Vjb25kczogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IHNlY29uZHMgJSA2MDtcclxuICAgIHJldHVybiBgJHttaW5zLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06JHtzZWNzXHJcbiAgICAgIC50b1N0cmluZygpXHJcbiAgICAgIC5wYWRTdGFydCgyLCAnMCcpfWA7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAnZmxleCB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB5LTMgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwJyxcclxuICAgICAgICBpc1JlY29yZGluZyA/ICdvcGFjaXR5LTEwMCcgOiAnaC0wIG9wYWNpdHktMCcsXHJcbiAgICAgICl9XHJcbiAgICA+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yIHctMiBhbmltYXRlLXB1bHNlIHJvdW5kZWQtZnVsbCBiZy1yZWQtNTAwXCIgLz5cclxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1zbSB0ZXh0LXdoaXRlLzgwXCI+XHJcbiAgICAgICAgICB7Zm9ybWF0VGltZSh0aW1lKX1cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC0xMCB3LWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0wLjUgcHgtNFwiPlxyXG4gICAgICAgIHtbLi4uQXJyYXkodmlzdWFsaXplckJhcnMpXS5tYXAoKF8sIGkpID0+IChcclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAga2V5PXtpfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTAuNSBhbmltYXRlLXB1bHNlIHJvdW5kZWQtZnVsbCBiZy13aGl0ZS81MFwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtNYXRoLm1heCgxNSwgTWF0aC5yYW5kb20oKSAqIDEwMCl9JWAsXHJcbiAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXk6IGAke2kgKiAwLjA1fXNgLFxyXG4gICAgICAgICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiBgJHswLjUgKyBNYXRoLnJhbmRvbSgpICogMC41fXNgLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuaW50ZXJmYWNlIEltYWdlVmlld0RpYWxvZ1Byb3BzIHtcclxuICBpbWFnZVVybDogc3RyaW5nIHwgbnVsbDtcclxuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xyXG59XHJcblxyXG5jb25zdCBJbWFnZVZpZXdEaWFsb2c6IFJlYWN0LkZDPEltYWdlVmlld0RpYWxvZ1Byb3BzPiA9ICh7XHJcbiAgaW1hZ2VVcmwsXHJcbiAgb25DbG9zZSxcclxufSkgPT4ge1xyXG4gIGlmICghaW1hZ2VVcmwpIHJldHVybiBudWxsO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPERpYWxvZyBvcGVuPXshIWltYWdlVXJsfSBvbk9wZW5DaGFuZ2U9e29uQ2xvc2V9PlxyXG4gICAgICA8RGlhbG9nQ29udGVudCBjbGFzc05hbWU9XCJtYXgtdy1bOTB2d10gYm9yZGVyLW5vbmUgYmctdHJhbnNwYXJlbnQgcC0wIHNoYWRvdy1ub25lIG1kOm1heC13LVs4MDBweF1cIj5cclxuICAgICAgICA8RGlhbG9nVGl0bGUgY2xhc3NOYW1lPVwic3Itb25seVwiPkltYWdlIFByZXZpZXc8L0RpYWxvZ1RpdGxlPlxyXG4gICAgICAgIDxtb3Rpb24uZGl2XHJcbiAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1IH19XHJcbiAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHNjYWxlOiAxIH19XHJcbiAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1IH19XHJcbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjIsIGVhc2U6ICdlYXNlT3V0JyB9fVxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwicmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtMnhsIGJnLVsjMUYyMDIzXSBzaGFkb3ctMnhsXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG1heC1oLVs4MHZoXSB3LWZ1bGxcIj5cclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17aW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PVwiRnVsbCBwcmV2aWV3XCJcclxuICAgICAgICAgICAgICB3aWR0aD17ODAwfVxyXG4gICAgICAgICAgICAgIGhlaWdodD17NjAwfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIG9iamVjdC1jb250YWluXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgPC9EaWFsb2dDb250ZW50PlxyXG4gICAgPC9EaWFsb2c+XHJcbiAgKTtcclxufTtcclxuXHJcbmludGVyZmFjZSBQcm9tcHRJbnB1dENvbnRleHRUeXBlIHtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW47XHJcbiAgdmFsdWU6IHN0cmluZztcclxuICBzZXRWYWx1ZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgb25TdWJtaXQ/OiAoKSA9PiB2b2lkO1xyXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY29uc3QgUHJvbXB0SW5wdXRDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dDxQcm9tcHRJbnB1dENvbnRleHRUeXBlPih7XHJcbiAgaXNMb2FkaW5nOiBmYWxzZSxcclxuICB2YWx1ZTogJycsXHJcbiAgc2V0VmFsdWU6ICgpID0+IHt9LFxyXG4gIG1heEhlaWdodDogMjQwLFxyXG4gIG9uU3VibWl0OiB1bmRlZmluZWQsXHJcbiAgZGlzYWJsZWQ6IGZhbHNlLFxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHVzZVByb21wdElucHV0KCkge1xyXG4gIHJldHVybiBSZWFjdC51c2VDb250ZXh0KFByb21wdElucHV0Q29udGV4dCk7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQcm9tcHRJbnB1dFByb3BzIHtcclxuICBpc0xvYWRpbmc/OiBib29sZWFuO1xyXG4gIHZhbHVlPzogc3RyaW5nO1xyXG4gIG9uVmFsdWVDaGFuZ2U/OiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcclxuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgb25TdWJtaXQ/OiAoKSA9PiB2b2lkO1xyXG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XHJcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xyXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcclxuICBvbkRyYWdPdmVyPzogKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4gdm9pZDtcclxuICBvbkRyYWdMZWF2ZT86IChlOiBSZWFjdC5EcmFnRXZlbnQpID0+IHZvaWQ7XHJcbiAgb25Ecm9wPzogKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4gdm9pZDtcclxufVxyXG5cclxuY29uc3QgUHJvbXB0SW5wdXQgPSBSZWFjdC5mb3J3YXJkUmVmPEhUTUxEaXZFbGVtZW50LCBQcm9tcHRJbnB1dFByb3BzPihcclxuICAoXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgaXNMb2FkaW5nID0gZmFsc2UsXHJcbiAgICAgIG1heEhlaWdodCA9IDI0MCxcclxuICAgICAgdmFsdWUsXHJcbiAgICAgIG9uVmFsdWVDaGFuZ2UsXHJcbiAgICAgIG9uU3VibWl0LFxyXG4gICAgICBjaGlsZHJlbixcclxuICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgb25EcmFnT3ZlcixcclxuICAgICAgb25EcmFnTGVhdmUsXHJcbiAgICAgIG9uRHJvcCxcclxuICAgIH0sXHJcbiAgICByZWYsXHJcbiAgKSA9PiB7XHJcbiAgICBjb25zdCBbaW50ZXJuYWxWYWx1ZSwgc2V0SW50ZXJuYWxWYWx1ZV0gPSBSZWFjdC51c2VTdGF0ZSh2YWx1ZSB8fCAnJyk7XHJcbiAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAobmV3VmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICBzZXRJbnRlcm5hbFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgb25WYWx1ZUNoYW5nZT8uKG5ld1ZhbHVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPFRvb2x0aXBQcm92aWRlcj5cclxuICAgICAgICA8UHJvbXB0SW5wdXRDb250ZXh0LlByb3ZpZGVyXHJcbiAgICAgICAgICB2YWx1ZT17e1xyXG4gICAgICAgICAgICBpc0xvYWRpbmcsXHJcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSA/PyBpbnRlcm5hbFZhbHVlLFxyXG4gICAgICAgICAgICBzZXRWYWx1ZTogb25WYWx1ZUNoYW5nZSA/PyBoYW5kbGVDaGFuZ2UsXHJcbiAgICAgICAgICAgIG1heEhlaWdodCxcclxuICAgICAgICAgICAgb25TdWJtaXQsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHJlZj17cmVmfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAgICdyb3VuZGVkLVszMnB4XSBib3JkZXIgYm9yZGVyLVsjNDQ0NDQ0XSBiZy1bIzFGMjAyM10gcHgtNCBwdC00IHBiLTMgc2hhZG93LVswXzhweF8zMHB4X3JnYmEoMCwwLDAsMC4yNCldIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCcsXHJcbiAgICAgICAgICAgICAgaXNMb2FkaW5nICYmICdib3JkZXItcmVkLTUwMC83MCcsXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICBvbkRyYWdPdmVyPXtvbkRyYWdPdmVyfVxyXG4gICAgICAgICAgICBvbkRyYWdMZWF2ZT17b25EcmFnTGVhdmV9XHJcbiAgICAgICAgICAgIG9uRHJvcD17b25Ecm9wfVxyXG4gICAgICAgICAgICByb2xlPVwiZm9ybVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJQcm9tcHQgSW5wdXQgQXJlYVwiXHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvUHJvbXB0SW5wdXRDb250ZXh0LlByb3ZpZGVyPlxyXG4gICAgICA8L1Rvb2x0aXBQcm92aWRlcj5cclxuICAgICk7XHJcbiAgfSxcclxuKTtcclxuUHJvbXB0SW5wdXQuZGlzcGxheU5hbWUgPSAnUHJvbXB0SW5wdXQnO1xyXG5cclxuaW50ZXJmYWNlIFByb21wdElucHV0VGV4dGFyZWFQcm9wcyB7XHJcbiAgZGlzYWJsZUF1dG9zaXplPzogYm9vbGVhbjtcclxuICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgUHJvbXB0SW5wdXRUZXh0YXJlYTogUmVhY3QuRkM8XHJcbiAgUHJvbXB0SW5wdXRUZXh0YXJlYVByb3BzICYgUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFRleHRhcmVhPlxyXG4+ID0gKHtcclxuICBjbGFzc05hbWUsXHJcbiAgb25LZXlEb3duLFxyXG4gIGRpc2FibGVBdXRvc2l6ZSA9IGZhbHNlLFxyXG4gIHBsYWNlaG9sZGVyLFxyXG4gIC4uLnByb3BzXHJcbn0pID0+IHtcclxuICBjb25zdCB7IHZhbHVlLCBzZXRWYWx1ZSwgbWF4SGVpZ2h0LCBvblN1Ym1pdCwgZGlzYWJsZWQgfSA9IHVzZVByb21wdElucHV0KCk7XHJcbiAgY29uc3QgdGV4dGFyZWFSZWYgPSBSZWFjdC51c2VSZWY8SFRNTFRleHRBcmVhRWxlbWVudD4obnVsbCk7XHJcblxyXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoZGlzYWJsZUF1dG9zaXplIHx8ICF0ZXh0YXJlYVJlZi5jdXJyZW50KSByZXR1cm47XHJcbiAgICB0ZXh0YXJlYVJlZi5jdXJyZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgIHRleHRhcmVhUmVmLmN1cnJlbnQuc3R5bGUuaGVpZ2h0ID1cclxuICAgICAgdHlwZW9mIG1heEhlaWdodCA9PT0gJ251bWJlcidcclxuICAgICAgICA/IGAke01hdGgubWluKHRleHRhcmVhUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0LCBtYXhIZWlnaHQpfXB4YFxyXG4gICAgICAgIDogYG1pbigke3RleHRhcmVhUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0fXB4LCAke21heEhlaWdodH0pYDtcclxuICB9LCBbdmFsdWUsIG1heEhlaWdodCwgZGlzYWJsZUF1dG9zaXplXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZTogUmVhY3QuS2V5Ym9hcmRFdmVudDxIVE1MVGV4dEFyZWFFbGVtZW50PikgPT4ge1xyXG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgb25TdWJtaXQ/LigpO1xyXG4gICAgfVxyXG4gICAgb25LZXlEb3duPy4oZSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxUZXh0YXJlYVxyXG4gICAgICByZWY9e3RleHRhcmVhUmVmfVxyXG4gICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VmFsdWUoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICBvbktleURvd249e2hhbmRsZUtleURvd259XHJcbiAgICAgIGNsYXNzTmFtZT17Y24oJ3B4LTEgdGV4dC1iYXNlIHB5LTInLCBjbGFzc05hbWUpfVxyXG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XHJcbiAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgLz5cclxuICApO1xyXG59O1xyXG5cclxuaW50ZXJmYWNlIFByb21wdElucHV0QWN0aW9uc1Byb3BzIGV4dGVuZHMgUmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTERpdkVsZW1lbnQ+IHt9XHJcblxyXG5jb25zdCBQcm9tcHRJbnB1dEFjdGlvbnM6IFJlYWN0LkZDPFByb21wdElucHV0QWN0aW9uc1Byb3BzPiA9ICh7XHJcbiAgY2hpbGRyZW4sXHJcbiAgY2xhc3NOYW1lLFxyXG4gIC4uLnByb3BzXHJcbn0pID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHB0LTEnLCBjbGFzc05hbWUpfSB7Li4ucHJvcHN9PlxyXG4gICAge2NoaWxkcmVufVxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxuaW50ZXJmYWNlIFByb21wdElucHV0QWN0aW9uUHJvcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgVG9vbHRpcD4ge1xyXG4gIHRvb2x0aXA6IFJlYWN0LlJlYWN0Tm9kZTtcclxuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xyXG4gIHNpZGU/OiAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IFByb21wdElucHV0QWN0aW9uOiBSZWFjdC5GQzxQcm9tcHRJbnB1dEFjdGlvblByb3BzPiA9ICh7XHJcbiAgdG9vbHRpcCxcclxuICBjaGlsZHJlbixcclxuICBjbGFzc05hbWUsXHJcbiAgc2lkZSA9ICd0b3AnLFxyXG4gIC4uLnByb3BzXHJcbn0pID0+IHtcclxuICBjb25zdCB7IGRpc2FibGVkIH0gPSB1c2VQcm9tcHRJbnB1dCgpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPFRvb2x0aXAgey4uLnByb3BzfT5cclxuICAgICAgPFRvb2x0aXBUcmlnZ2VyIGFzQ2hpbGQgZGlzYWJsZWQ9e2Rpc2FibGVkfT5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvVG9vbHRpcFRyaWdnZXI+XHJcbiAgICAgIDxUb29sdGlwQ29udGVudCBzaWRlPXtzaWRlfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAge3Rvb2x0aXB9XHJcbiAgICAgIDwvVG9vbHRpcENvbnRlbnQ+XHJcbiAgICA8L1Rvb2x0aXA+XHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IEN1c3RvbURpdmlkZXI6IFJlYWN0LkZDID0gKCkgPT4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXgtMSBoLTYgdy1bMS41cHhdXCI+XHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcm91bmRlZC1mdWxsIGJnLWdyYWRpZW50LXRvLXQgZnJvbS10cmFuc3BhcmVudCB2aWEtWyM5Yjg3ZjVdLzcwIHRvLXRyYW5zcGFyZW50XCJcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBjbGlwUGF0aDpcclxuICAgICAgICAgICdwb2x5Z29uKDAlIDAlLCAxMDAlIDAlLCAxMDAlIDQwJSwgMTQwJSA1MCUsIDEwMCUgNjAlLCAxMDAlIDEwMCUsIDAlIDEwMCUsIDAlIDYwJSwgLTQwJSA1MCUsIDAlIDQwJSknLFxyXG4gICAgICB9fVxyXG4gICAgLz5cclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbmV4cG9ydCB0eXBlIFByb21wdE1vZGUgPSAnZXhwbGFpbmVyJyB8ICdxdWl6JztcclxuXHJcbmludGVyZmFjZSBQcm9tcHRNb2RlVG9nZ2xlUHJvcHMge1xyXG4gIG1vZGU6IFByb21wdE1vZGU7XHJcbiAgb25Nb2RlQ2hhbmdlOiAobW9kZTogUHJvbXB0TW9kZSkgPT4gdm9pZDtcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUHJvbXB0TW9kZVRvZ2dsZTogUmVhY3QuRkM8UHJvbXB0TW9kZVRvZ2dsZVByb3BzPiA9ICh7XHJcbiAgbW9kZSxcclxuICBvbk1vZGVDaGFuZ2UsXHJcbiAgY2xhc3NOYW1lLFxyXG4gIGRpc2FibGVkLFxyXG59KSA9PiAoXHJcbiAgPGRpdlxyXG4gICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgJ21iLTMgZmxleCB3LWZpdCBpdGVtcy1jZW50ZXIgZ2FwLTEgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyMzYTNiNDBdIGJnLVsjMTgxOTFiXSBwLTEnLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICApfVxyXG4gICAgcm9sZT1cImdyb3VwXCJcclxuICAgIGFyaWEtbGFiZWw9XCJBSSByZXNwb25zZSBtb2RlXCJcclxuICA+XHJcbiAgICB7KFxyXG4gICAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFsdWU6ICdleHBsYWluZXInIGFzIGNvbnN0LFxyXG4gICAgICAgICAgbGFiZWw6ICdFeHBsYWluZXInLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdMZWFybiB3aXRoIGEgY2xlYXIgZXhwbGFuYXRpb24nLFxyXG4gICAgICAgICAgaWNvbjogR3JhZHVhdGlvbkNhcCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhbHVlOiAncXVpeicgYXMgY29uc3QsXHJcbiAgICAgICAgICBsYWJlbDogJ1F1aXonLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdQcmFjdGljZSB3aXRoIGFjdGl2ZSByZWNhbGwnLFxyXG4gICAgICAgICAgaWNvbjogQ2hlY2ssXHJcbiAgICAgICAgfSxcclxuICAgICAgXVxyXG4gICAgKS5tYXAoKHsgdmFsdWUsIGxhYmVsLCBkZXNjcmlwdGlvbiwgaWNvbjogSWNvbiB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gbW9kZSA9PT0gdmFsdWU7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAga2V5PXt2YWx1ZX1cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25Nb2RlQ2hhbmdlKHZhbHVlKX1cclxuICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cclxuICAgICAgICAgIGFyaWEtcHJlc3NlZD17aXNBY3RpdmV9XHJcbiAgICAgICAgICB0aXRsZT17ZGVzY3JpcHRpb259XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAnaW5saW5lLWZsZXggaC04IGl0ZW1zLWNlbnRlciBnYXAtMS41IHJvdW5kZWQtZnVsbCBweC0zIHRleHQtWzEzcHhdIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCBmb2N1cy12aXNpYmxlOm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmctMiBmb2N1cy12aXNpYmxlOnJpbmctWyM5Yjg3ZjVdLzcwIGRpc2FibGVkOnBvaW50ZXItZXZlbnRzLW5vbmUgZGlzYWJsZWQ6b3BhY2l0eS01MCcsXHJcbiAgICAgICAgICAgIGlzQWN0aXZlXHJcbiAgICAgICAgICAgICAgPyB2YWx1ZSA9PT0gJ3F1aXonXHJcbiAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTUwMC8xNSB0ZXh0LWVtZXJhbGQtMzAwIHNoYWRvdy1zbSdcclxuICAgICAgICAgICAgICAgIDogJ2JnLVsjOWI4N2Y1XS8xNSB0ZXh0LVsjYzRiNWZkXSBzaGFkb3ctc20nXHJcbiAgICAgICAgICAgICAgOiAndGV4dC1ncmF5LTUwMCBob3ZlcjpiZy13aGl0ZS81IGhvdmVyOnRleHQtZ3JheS0zMDAnLFxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8SWNvbiBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICA8c3Bhbj57bGFiZWx9PC9zcGFuPlxyXG4gICAgICAgICAge2lzQWN0aXZlICYmIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5zZWxlY3RlZDwvc3Bhbj59XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICk7XHJcbiAgICB9KX1cclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbmludGVyZmFjZSBQcm9tcHRJbnB1dEJveFByb3BzIHtcclxuICBvblNlbmQ/OiAobWVzc2FnZTogc3RyaW5nLCBmaWxlczogRmlsZVtdKSA9PiB2b2lkO1xyXG4gIGlzTG9hZGluZz86IGJvb2xlYW47XHJcbiAgcGxhY2Vob2xkZXI/OiBzdHJpbmc7XHJcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xyXG4gIG1vZGU/OiBQcm9tcHRNb2RlO1xyXG4gIG9uTW9kZUNoYW5nZT86IChtb2RlOiBQcm9tcHRNb2RlKSA9PiB2b2lkO1xyXG4gIHNob3dUb2dnbGU/OiBib29sZWFuO1xyXG4gIG1vZGVsPzogQUlNb2RlbElkO1xyXG4gIG9uTW9kZWxDaGFuZ2U/OiAobW9kZWw6IEFJTW9kZWxJZCkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFByb21wdElucHV0Qm94ID0gUmVhY3QuZm9yd2FyZFJlZjxIVE1MRGl2RWxlbWVudCwgUHJvbXB0SW5wdXRCb3hQcm9wcz4oXHJcbiAgKFxyXG4gICAge1xyXG4gICAgICBvblNlbmQgPSAoKSA9PiB7fSxcclxuICAgICAgaXNMb2FkaW5nID0gZmFsc2UsXHJcbiAgICAgIHBsYWNlaG9sZGVyID0gJ1R5cGUgeW91ciBtZXNzYWdlIGhlcmUuLi4nLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIG1vZGU6IGNvbnRyb2xsZWRNb2RlLFxyXG4gICAgICBvbk1vZGVDaGFuZ2UsXHJcbiAgICAgIHNob3dUb2dnbGUgPSB0cnVlLFxyXG4gICAgICBtb2RlbDogY29udHJvbGxlZE1vZGVsLFxyXG4gICAgICBvbk1vZGVsQ2hhbmdlLFxyXG4gICAgfSxcclxuICAgIHJlZixcclxuICApID0+IHtcclxuICAgIHVzZVN0eWxlSW5qZWN0aW9uKCk7XHJcblxyXG4gICAgY29uc3QgW2lucHV0LCBzZXRJbnB1dF0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XHJcbiAgICBjb25zdCBbZmlsZXMsIHNldEZpbGVzXSA9IFJlYWN0LnVzZVN0YXRlPEZpbGVbXT4oW10pO1xyXG4gICAgY29uc3QgW2ZpbGVQcmV2aWV3cywgc2V0RmlsZVByZXZpZXdzXSA9IFJlYWN0LnVzZVN0YXRlPHtcclxuICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAgfT4oe30pO1xyXG4gICAgY29uc3QgW3NlbGVjdGVkSW1hZ2UsIHNldFNlbGVjdGVkSW1hZ2VdID0gUmVhY3QudXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4oXHJcbiAgICAgIG51bGwsXHJcbiAgICApO1xyXG4gICAgY29uc3QgW2lzUmVjb3JkaW5nLCBzZXRJc1JlY29yZGluZ10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbc2hvd1NlYXJjaCwgc2V0U2hvd1NlYXJjaF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbc2hvd1RoaW5rLCBzZXRTaG93VGhpbmtdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW3Nob3dDYW52YXMsIHNldFNob3dDYW52YXNdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW2ludGVybmFsTW9kZSwgc2V0SW50ZXJuYWxNb2RlXSA9XHJcbiAgICAgIFJlYWN0LnVzZVN0YXRlPFByb21wdE1vZGU+KCdleHBsYWluZXInKTtcclxuICAgIGNvbnN0IFtpbnRlcm5hbE1vZGVsLCBzZXRJbnRlcm5hbE1vZGVsXSA9IFJlYWN0LnVzZVN0YXRlPEFJTW9kZWxJZD4oXHJcbiAgICAgIEFJX01PREVMU1swXS5pZCxcclxuICAgICk7XHJcbiAgICBjb25zdCBbc2hvd01vZGVsTWVudSwgc2V0U2hvd01vZGVsTWVudV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgY29uc3QgdXBsb2FkSW5wdXRSZWYgPSBSZWFjdC51c2VSZWY8SFRNTElucHV0RWxlbWVudD4obnVsbCk7XHJcbiAgICBjb25zdCBwcm9tcHRCb3hSZWYgPSBSZWFjdC51c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xyXG4gICAgY29uc3QgbW9kZSA9IGNvbnRyb2xsZWRNb2RlID8/IGludGVybmFsTW9kZTtcclxuICAgIGNvbnN0IG1vZGVsID0gY29udHJvbGxlZE1vZGVsID8/IGludGVybmFsTW9kZWw7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlTW9kZUNoYW5nZSA9IChuZXh0TW9kZTogUHJvbXB0TW9kZSkgPT4ge1xyXG4gICAgICBzZXRJbnRlcm5hbE1vZGUobmV4dE1vZGUpO1xyXG4gICAgICBvbk1vZGVDaGFuZ2U/LihuZXh0TW9kZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVRvZ2dsZUNoYW5nZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICBzZXRTaG93U2VhcmNoKChwcmV2KSA9PiAhcHJldik7XHJcbiAgICAgICAgc2V0U2hvd1RoaW5rKGZhbHNlKTtcclxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3RoaW5rJykge1xyXG4gICAgICAgIHNldFNob3dUaGluaygocHJldikgPT4gIXByZXYpO1xyXG4gICAgICAgIHNldFNob3dTZWFyY2goZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUNhbnZhc1RvZ2dsZSA9ICgpID0+IHNldFNob3dDYW52YXMoKHByZXYpID0+ICFwcmV2KTtcclxuXHJcbiAgICBjb25zdCBhbGxTdWdnZXN0aW9ucyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gKHtcclxuICAgICAgcXVpejogW1xyXG4gICAgICAgIHsgbGFiZWw6ICdDYWxjdWx1cyBQcmFjdGljZScsIGljb246IEdyYWR1YXRpb25DYXAsIHByb21wdDogJ0dlbmVyYXRlIDUgY2hhbGxlbmdpbmcgQ2FsY3VsdXMgaW50ZWdyYXRpb24gcHJvYmxlbXMnLCBjb2xvcjogJ3RleHQtYmx1ZS00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1ibHVlLTUwMC81MCBob3ZlcjpiZy1ibHVlLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnSGlzdG9yeSBRdWl6JywgaWNvbjogQ2hlY2ssIHByb21wdDogJ1F1aXogbWUgb24gdGhlIG1ham9yIGV2ZW50cyBvZiB0aGUgRnJlbmNoIFJldm9sdXRpb24nLCBjb2xvcjogJ3RleHQtZW1lcmFsZC00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1lbWVyYWxkLTUwMC81MCBob3ZlcjpiZy1lbWVyYWxkLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnQmlvIENvbXBldGVuY3knLCBpY29uOiBCcmFpbkNvZywgcHJvbXB0OiAnVGVzdCBteSBrbm93bGVkZ2Ugb24gRE5BIHJlcGxpY2F0aW9uIGFuZCB0cmFuc2NyaXB0aW9uJywgY29sb3I6ICd0ZXh0LWFtYmVyLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC81MCBob3ZlcjpiZy1hbWJlci01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ1BoeXNpY3MgTGF3cycsIGljb246IEdsb2JlLCBwcm9tcHQ6ICdDcmVhdGUgYSBxdWl6IGFib3V0IE5ld3RvblxcJ3MgTGF3cyBvZiBNb3Rpb24nLCBjb2xvcjogJ3RleHQtcHVycGxlLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLXB1cnBsZS01MDAvNTAgaG92ZXI6YmctcHVycGxlLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnVm9jYWIgUHJhY3RpY2UnLCBpY29uOiBHcmFkdWF0aW9uQ2FwLCBwcm9tcHQ6ICdUZXN0IG15IGFkdmFuY2VkIEVuZ2xpc2ggdm9jYWJ1bGFyeSB3aXRoIGNvbnRleHQgc2VudGVuY2VzJywgY29sb3I6ICd0ZXh0LXJvc2UtNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItcm9zZS01MDAvNTAgaG92ZXI6Ymctcm9zZS01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ0NoZW0gQm9uZGluZycsIGljb246IENoZWNrLCBwcm9tcHQ6ICdRdWl6IG1lIG9uIGlvbmljIHZzIGNvdmFsZW50IGJvbmRpbmcgcHJpbmNpcGxlcycsIGNvbG9yOiAndGV4dC1jeWFuLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWN5YW4tNTAwLzUwIGhvdmVyOmJnLWN5YW4tNTAwLzEwJyB9LFxyXG4gICAgICAgIHsgbGFiZWw6ICdMaXRlcmF0dXJlIFF1aXonLCBpY29uOiBCcmFpbkNvZywgcHJvbXB0OiAnVGVzdCBteSB1bmRlcnN0YW5kaW5nIG9mIHN5bWJvbGlzbSBpbiBcIlRoZSBHcmVhdCBHYXRzYnlcIicsIGNvbG9yOiAndGV4dC1pbmRpZ28tNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItaW5kaWdvLTUwMC81MCBob3ZlcjpiZy1pbmRpZ28tNTAwLzEwJyB9LFxyXG4gICAgICAgIHsgbGFiZWw6ICdXb3JsZCBNYXAnLCBpY29uOiBHbG9iZSwgcHJvbXB0OiAnUXVpeiBtZSBvbiBFdXJvcGVhbiBjYXBpdGFscyBhbmQgZ2VvZ3JhcGh5JywgY29sb3I6ICd0ZXh0LW9yYW5nZS00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1vcmFuZ2UtNTAwLzUwIGhvdmVyOmJnLW9yYW5nZS01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ0NvZGluZyBMb2dpYycsIGljb246IFBhcGVyY2xpcCwgcHJvbXB0OiAnR2l2ZSBtZSAzIGxvZ2ljIHB1enpsZXMgaW52b2x2aW5nIGFsZ29yaXRobXMnLCBjb2xvcjogJ3RleHQtdGVhbC00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci10ZWFsLTUwMC81MCBob3ZlcjpiZy10ZWFsLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnRWNvbiBCYXNpY3MnLCBpY29uOiBDaGVjaywgcHJvbXB0OiAnUXVpeiBtZSBvbiBTdXBwbHkgYW5kIERlbWFuZCBjdXJ2ZXMnLCBjb2xvcjogJ3RleHQtcGluay00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3ZlcjpiZy1waW5rLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnQXJ0IEhpc3RvcnknLCBpY29uOiBHbG9iZSwgcHJvbXB0OiAnVGVzdCBtZSBvbiBSZW5haXNzYW5jZSBwZXJpb2QgYXJ0aXN0cyBhbmQgd29ya3MnLCBjb2xvcjogJ3RleHQteWVsbG93LTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLXllbGxvdy01MDAvNTAgaG92ZXI6YmcteWVsbG93LTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnUHN5Y2hvbG9neScsIGljb246IEJyYWluQ29nLCBwcm9tcHQ6ICdRdWl6IG1lIG9uIGRpZmZlcmVudCB0eXBlcyBvZiBtZW1vcnkgKFNob3J0IHZzIExvbmcgdGVybSknLCBjb2xvcjogJ3RleHQtdmlvbGV0LTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLXZpb2xldC01MDAvNTAgaG92ZXI6YmctdmlvbGV0LTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnRGF0YSBTdHJ1Y3R1cmVzJywgaWNvbjogUGFwZXJjbGlwLCBwcm9tcHQ6ICdUZXN0IG15IGtub3dsZWRnZSBvbiBMaW5rZWQgTGlzdHMgYW5kIEJpbmFyeSBUcmVlcycsIGNvbG9yOiAndGV4dC1saW1lLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWxpbWUtNTAwLzUwIGhvdmVyOmJnLWxpbWUtNTAwLzEwJyB9LFxyXG4gICAgICBdLFxyXG4gICAgICBleHBsYWluZXI6IFtcclxuICAgICAgICB7IGxhYmVsOiAnUXVhbnR1bSBQaHlzaWNzJywgaWNvbjogR2xvYmUsIHByb21wdDogJ0V4cGxhaW4gUXVhbnR1bSBFbnRhbmdsZW1lbnQgbGlrZSBJIGFtIDUgeWVhcnMgb2xkJywgY29sb3I6ICd0ZXh0LXB1cnBsZS00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1wdXJwbGUtNTAwLzUwIGhvdmVyOmJnLXB1cnBsZS01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ1N0dWR5IFNjaWVuY2UnLCBpY29uOiBCcmFpbkNvZywgcHJvbXB0OiAnV2hhdCBhcmUgdGhlIG1vc3QgZWZmZWN0aXZlIGV2aWRlbmNlLWJhc2VkIHN0dWR5IG1ldGhvZHM/JywgY29sb3I6ICd0ZXh0LXJvc2UtNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItcm9zZS01MDAvNTAgaG92ZXI6Ymctcm9zZS01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ1JlYWN0IFBlcmYnLCBpY29uOiBQYXBlcmNsaXAsIHByb21wdDogJ0hvdyBkbyBJIG9wdGltaXplIGxhcmdlIGxpc3RzIGluIFJlYWN0IHdpdGggdmlydHVhbGl6YXRpb24/JywgY29sb3I6ICd0ZXh0LWN5YW4tNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItY3lhbi01MDAvNTAgaG92ZXI6YmctY3lhbi01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ0JsYWNrIEhvbGVzJywgaWNvbjogR2xvYmUsIHByb21wdDogJ0V4cGxhaW4gaG93IEhhd2tpbmcgUmFkaWF0aW9uIHdvcmtzJywgY29sb3I6ICd0ZXh0LWJsdWUtNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItYmx1ZS01MDAvNTAgaG92ZXI6YmctYmx1ZS01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ05ldXJhbCBOZXR3b3JrcycsIGljb246IEJyYWluQ29nLCBwcm9tcHQ6ICdCcmVhayBkb3duIGhvdyBiYWNrcHJvcGFnYXRpb24gd29ya3MgaW4gRGVlcCBMZWFybmluZycsIGNvbG9yOiAndGV4dC1lbWVyYWxkLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWVtZXJhbGQtNTAwLzUwIGhvdmVyOmJnLWVtZXJhbGQtNTAwLzEwJyB9LFxyXG4gICAgICAgIHsgbGFiZWw6ICdNYXJrZXQgQ3ljbGVzJywgaWNvbjogQ2hlY2ssIHByb21wdDogJ0V4cGxhaW4gdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBhIEJlYXIgYW5kIEJ1bGwgbWFya2V0JywgY29sb3I6ICd0ZXh0LWFtYmVyLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC81MCBob3ZlcjpiZy1hbWJlci01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ1Bob3Rvc3ludGhlc2lzJywgaWNvbjogR2xvYmUsIHByb21wdDogJ0V4cGxhaW4gdGhlIGxpZ2h0LWRlcGVuZGVudCByZWFjdGlvbnMgaW4gc2ltcGxlIHRlcm1zJywgY29sb3I6ICd0ZXh0LWdyZWVuLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLWdyZWVuLTUwMC81MCBob3ZlcjpiZy1ncmVlbi01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ0Jsb2NrY2hhaW4nLCBpY29uOiBQYXBlcmNsaXAsIHByb21wdDogJ0hvdyBkb2VzIGEgY29uc2Vuc3VzIGFsZ29yaXRobSBsaWtlIFByb29mIG9mIFdvcmsgZnVuY3Rpb24/JywgY29sb3I6ICd0ZXh0LXppbmMtNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItemluYy01MDAvNTAgaG92ZXI6YmctemluYy01MDAvMTAnIH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ1N0b2ljaXNtJywgaWNvbjogQnJhaW5Db2csIHByb21wdDogJ1doYXQgYXJlIHRoZSBjb3JlIHByaW5jaXBsZXMgb2YgU3RvaWMgcGhpbG9zb3BoeT8nLCBjb2xvcjogJ3RleHQtb3JhbmdlLTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLW9yYW5nZS01MDAvNTAgaG92ZXI6Ymctb3JhbmdlLTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnR2VuZXRpYyBFZGl0aW5nJywgaWNvbjogQ2hlY2ssIHByb21wdDogJ0V4cGxhaW4gdGhlIENSSVNQUi1DYXM5IG1lY2hhbmlzbScsIGNvbG9yOiAndGV4dC1yZWQtNDAwJywgaG92ZXI6ICdob3Zlcjpib3JkZXItcmVkLTUwMC81MCBob3ZlcjpiZy1yZWQtNTAwLzEwJyB9LFxyXG4gICAgICAgIHsgbGFiZWw6ICdGcmVuY2ggUmV2b2x1dGlvbicsIGljb246IEdsb2JlLCBwcm9tcHQ6ICdFeHBsYWluIHRoZSBjYXVzZXMgYW5kIGNvbnNlcXVlbmNlcyBvZiB0aGUgRnJlbmNoIFJldm9sdXRpb24nLCBjb2xvcjogJ3RleHQtc2t5LTQwMCcsIGhvdmVyOiAnaG92ZXI6Ym9yZGVyLXNreS01MDAvNTAgaG92ZXI6Ymctc2t5LTUwMC8xMCcgfSxcclxuICAgICAgICB7IGxhYmVsOiAnVGhlcm1vZHluYW1pY3MnLCBpY29uOiBQYXBlcmNsaXAsIHByb21wdDogJ0V4cGxhaW4gdGhlIFNlY29uZCBMYXcgb2YgVGhlcm1vZHluYW1pY3MgYW5kIGVudHJvcHknLCBjb2xvcjogJ3RleHQtZnVjaHNpYS00MDAnLCBob3ZlcjogJ2hvdmVyOmJvcmRlci1mdWNoc2lhLTUwMC81MCBob3ZlcjpiZy1mdWNoc2lhLTUwMC8xMCcgfSxcclxuICAgICAgXVxyXG4gICAgfSksIFtdKTtcclxuXHJcbiAgICBjb25zdCBbc3VnZ2VzdGlvbnMsIHNldFN1Z2dlc3Rpb25zXSA9IFJlYWN0LnVzZVN0YXRlKGFsbFN1Z2dlc3Rpb25zLmV4cGxhaW5lci5zbGljZSgwLCA1KSk7XHJcblxyXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgY29uc3QgcG9vbCA9IG1vZGUgPT09ICdxdWl6JyA/IGFsbFN1Z2dlc3Rpb25zLnF1aXogOiBhbGxTdWdnZXN0aW9ucy5leHBsYWluZXI7XHJcbiAgICAgIGNvbnN0IHNodWZmbGVkID0gWy4uLnBvb2xdLnNvcnQoKCkgPT4gMC41IC0gTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgIHNldFN1Z2dlc3Rpb25zKHNodWZmbGVkLnNsaWNlKDAsIDUpKTtcclxuICAgIH0sIFttb2RlLCBhbGxTdWdnZXN0aW9uc10pO1xyXG5cclxuICAgIGNvbnN0IHByb2Nlc3NGaWxlID0gUmVhY3QudXNlQ2FsbGJhY2soKGZpbGU6IEZpbGUpID0+IHtcclxuICAgICAgaWYgKCFmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnT25seSBpbWFnZSBmaWxlcyBhcmUgYWxsb3dlZCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZmlsZS5zaXplID4gMTAgKiAxMDI0ICogMTAyNCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIHRvbyBsYXJnZSAobWF4IDEwTUIpJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHNldEZpbGVzKFtmaWxlXSk7XHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT5cclxuICAgICAgICBzZXRGaWxlUHJldmlld3MoeyBbZmlsZS5uYW1lXTogZS50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmcgfSk7XHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZURyYWdPdmVyID0gUmVhY3QudXNlQ2FsbGJhY2soKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlRHJhZ0xlYXZlID0gUmVhY3QudXNlQ2FsbGJhY2soKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlRHJvcCA9IFJlYWN0LnVzZUNhbGxiYWNrKFxyXG4gICAgICAoZTogUmVhY3QuRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgZHJvcHBlZEZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyk7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VGaWxlID0gZHJvcHBlZEZpbGVzLmZpbmQoKGZpbGUpID0+XHJcbiAgICAgICAgICBmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJyksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaW1hZ2VGaWxlKSBwcm9jZXNzRmlsZShpbWFnZUZpbGUpO1xyXG4gICAgICB9LFxyXG4gICAgICBbcHJvY2Vzc0ZpbGVdLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVSZW1vdmVGaWxlID0gKGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgZmlsZVRvUmVtb3ZlID0gZmlsZXNbaW5kZXhdO1xyXG4gICAgICBpZiAoZmlsZVRvUmVtb3ZlICYmIGZpbGVQcmV2aWV3c1tmaWxlVG9SZW1vdmUubmFtZV0pIHtcclxuICAgICAgICBzZXRGaWxlUHJldmlld3Moe30pO1xyXG4gICAgICB9XHJcbiAgICAgIHNldEZpbGVzKFtdKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlUGFzdGUgPSBSZWFjdC51c2VDYWxsYmFjayhcclxuICAgICAgKGU6IENsaXBib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBlLmNsaXBib2FyZERhdGE/Lml0ZW1zO1xyXG4gICAgICAgIGlmICghaXRlbXMpIHJldHVybjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLnR5cGUuaW5kZXhPZignaW1hZ2UnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIHByb2Nlc3NGaWxlKGZpbGUpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBbcHJvY2Vzc0ZpbGVdLFxyXG4gICAgKTtcclxuXHJcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGhhbmRsZVBhc3RlKTtcclxuICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgaGFuZGxlUGFzdGUpO1xyXG4gICAgfSwgW2hhbmRsZVBhc3RlXSk7XHJcblxyXG4gICAgY29uc3QgcmVuZGVyU3VnZ2VzdGlvbiA9IChzdWdnZXN0aW9uOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgc2V0SW5wdXQoc3VnZ2VzdGlvbi5wcm9tcHQpO1xyXG4gICAgICAgIH19XHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgIFwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIuNSByb3VuZGVkLWZ1bGwgYm9yZGVyIGJvcmRlci1ncmF5LTYwMC8zMCBiZy1ncmF5LTYwMC81IHB4LTQgcHktMi41IHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMCB0cmFuc2l0aW9uLWFsbCBob3Zlcjp0ZXh0LXdoaXRlIHNoYWRvdy1zbVwiLFxyXG4gICAgICAgICAgc3VnZ2VzdGlvbi5ob3ZlclxyXG4gICAgICAgICl9XHJcbiAgICAgID5cclxuICAgICAgICA8c3VnZ2VzdGlvbi5pY29uIGNsYXNzTmFtZT17Y24oXCJoLTQuNSB3LTQuNVwiLCBzdWdnZXN0aW9uLmNvbG9yKX0gLz5cclxuICAgICAgICB7c3VnZ2VzdGlvbi5sYWJlbH1cclxuICAgICAgPC9idXR0b24+XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVN1Ym1pdCA9ICgpID0+IHtcclxuICAgICAgaWYgKGlucHV0LnRyaW0oKSB8fCBmaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VQcmVmaXggPSAnJztcclxuICAgICAgICBpZiAoc2hvd1NlYXJjaCkgbWVzc2FnZVByZWZpeCA9ICdbU2VhcmNoOiAnO1xyXG4gICAgICAgIGVsc2UgaWYgKHNob3dUaGluaykgbWVzc2FnZVByZWZpeCA9ICdbVGhpbms6ICc7XHJcbiAgICAgICAgZWxzZSBpZiAoc2hvd0NhbnZhcykgbWVzc2FnZVByZWZpeCA9ICdbQ2FudmFzOiAnO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZElucHV0ID0gbWVzc2FnZVByZWZpeFxyXG4gICAgICAgICAgPyBgJHttZXNzYWdlUHJlZml4fSR7aW5wdXR9XWBcclxuICAgICAgICAgIDogaW5wdXQ7XHJcbiAgICAgICAgb25TZW5kKGZvcm1hdHRlZElucHV0LCBmaWxlcyk7XHJcbiAgICAgICAgc2V0SW5wdXQoJycpO1xyXG4gICAgICAgIHNldEZpbGVzKFtdKTtcclxuICAgICAgICBzZXRGaWxlUHJldmlld3Moe30pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVN0YXJ0UmVjb3JkaW5nID0gKCkgPT4gY29uc29sZS5sb2coJ1N0YXJ0ZWQgcmVjb3JkaW5nJyk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlU3RvcFJlY29yZGluZyA9IChkdXJhdGlvbjogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBTdG9wcGVkIHJlY29yZGluZyBhZnRlciAke2R1cmF0aW9ufSBzZWNvbmRzYCk7XHJcbiAgICAgIHNldElzUmVjb3JkaW5nKGZhbHNlKTtcclxuICAgICAgb25TZW5kKGBbVm9pY2UgbWVzc2FnZSAtICR7ZHVyYXRpb259IHNlY29uZHNdYCwgW10pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYXNDb250ZW50ID0gaW5wdXQudHJpbSgpICE9PSAnJyB8fCBmaWxlcy5sZW5ndGggPiAwO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0xMCBtYi0xMlwiPlxyXG4gICAgICAgIHshaXNSZWNvcmRpbmcgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMyBweC00IHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBhbmltYXRlLWZhZGUtaW4gbWItNlwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGp1c3RpZnktY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAge3N1Z2dlc3Rpb25zLnNsaWNlKDAsIDMpLm1hcCgoc3VnZ2VzdGlvbiwgaW5kZXgpID0+IHJlbmRlclN1Z2dlc3Rpb24oc3VnZ2VzdGlvbiwgaW5kZXgpKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAganVzdGlmeS1jZW50ZXIgZ2FwLTNcIj5cclxuICAgICAgICAgICAgICB7c3VnZ2VzdGlvbnMuc2xpY2UoMywgNSkubWFwKChzdWdnZXN0aW9uLCBpbmRleCkgPT4gcmVuZGVyU3VnZ2VzdGlvbihzdWdnZXN0aW9uLCBpbmRleCArIDMpKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICA8UHJvbXB0SW5wdXRcclxuICAgICAgICAgIHZhbHVlPXtpbnB1dH1cclxuICAgICAgICAgIG9uVmFsdWVDaGFuZ2U9e3NldElucHV0fVxyXG4gICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XHJcbiAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlU3VibWl0fVxyXG4gICAgICAgICAgbWF4SGVpZ2h0PXs0MDB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAndy1bY2FsYygxMDAlLTRweCldIGJvcmRlci1bIzQ0NDQ0NF0gYmctWyMxRjIwMjNdIHNoYWRvdy1bMF84cHhfMzBweF9yZ2JhKDAsMCwwLDAuMjQpXSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgZWFzZS1pbi1vdXQnLFxyXG4gICAgICAgICAgICBpc1JlY29yZGluZyAmJiAnYm9yZGVyLXJlZC01MDAvNzAnLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZyB8fCBpc1JlY29yZGluZ31cclxuICAgICAgICAgIHJlZj17cmVmIHx8IHByb21wdEJveFJlZn1cclxuICAgICAgICAgIG9uRHJhZ092ZXI9e2hhbmRsZURyYWdPdmVyfVxyXG4gICAgICAgICAgb25EcmFnTGVhdmU9e2hhbmRsZURyYWdMZWF2ZX1cclxuICAgICAgICAgIG9uRHJvcD17aGFuZGxlRHJvcH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7c2hvd1RvZ2dsZSAmJiAoXHJcbiAgICAgICAgICAgIDxQcm9tcHRNb2RlVG9nZ2xlXHJcbiAgICAgICAgICAgICAgbW9kZT17bW9kZX1cclxuICAgICAgICAgICAgICBvbk1vZGVDaGFuZ2U9e2hhbmRsZU1vZGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZyB8fCBpc1JlY29yZGluZ31cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAge2ZpbGVzLmxlbmd0aCA+IDAgJiYgIWlzUmVjb3JkaW5nICYmIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggZmxleC13cmFwIGdhcC0yIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMFwiPlxyXG4gICAgICAgICAgICAgIHtmaWxlcy5tYXAoKGZpbGUsIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT1cImdyb3VwIHJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykgJiZcclxuICAgICAgICAgICAgICAgICAgICBmaWxlUHJldmlld3NbZmlsZS5uYW1lXSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtMTYgdy0xNiBjdXJzb3ItcG9pbnRlciBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlldyA9IGZpbGVQcmV2aWV3c1tmaWxlLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aWV3KSBzZXRTZWxlY3RlZEltYWdlKHByZXZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlldyA9IGZpbGVQcmV2aWV3c1tmaWxlLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpZXcpIHNldFNlbGVjdGVkSW1hZ2UocHJldmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtmaWxlUHJldmlld3NbZmlsZS5uYW1lXSB8fCAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2ZpbGUubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17NjR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PXs2NH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLWZ1bGwgdy1mdWxsIG9iamVjdC1jb3ZlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVJlbW92ZUZpbGUoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTEgcmlnaHQtMSByb3VuZGVkLWZ1bGwgYmctYmxhY2svNzAgcC0wLjUgb3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgUmVtb3ZlICR7ZmlsZS5uYW1lfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8WCBjbGFzc05hbWU9XCJoLTMgdy0zIHRleHQtd2hpdGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgICAgICAndHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwJyxcclxuICAgICAgICAgICAgICBpc1JlY29yZGluZyA/ICdoLTAgb3ZlcmZsb3ctaGlkZGVuIG9wYWNpdHktMCcgOiAnb3BhY2l0eS0xMDAnLFxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8UHJvbXB0SW5wdXRUZXh0YXJlYVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtcclxuICAgICAgICAgICAgICAgIG1vZGUgPT09ICdxdWl6J1xyXG4gICAgICAgICAgICAgICAgICA/ICdXaGF0IHdvdWxkIHlvdSBsaWtlIHRvIHByYWN0aWNlPydcclxuICAgICAgICAgICAgICAgICAgOiBzaG93U2VhcmNoXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnU2VhcmNoIHRoZSB3ZWIuLi4nXHJcbiAgICAgICAgICAgICAgICAgICAgOiBzaG93VGhpbmtcclxuICAgICAgICAgICAgICAgICAgICAgID8gJ1RoaW5rIGRlZXBseS4uLidcclxuICAgICAgICAgICAgICAgICAgICAgIDogc2hvd0NhbnZhc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdDcmVhdGUgb24gY2FudmFzLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHBsYWNlaG9sZGVyXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtYmFzZVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8Vm9pY2VSZWNvcmRlclxyXG4gICAgICAgICAgICBpc1JlY29yZGluZz17aXNSZWNvcmRpbmd9XHJcbiAgICAgICAgICAgIG9uU3RhcnRSZWNvcmRpbmc9e2hhbmRsZVN0YXJ0UmVjb3JkaW5nfVxyXG4gICAgICAgICAgICBvblN0b3BSZWNvcmRpbmc9e2hhbmRsZVN0b3BSZWNvcmRpbmd9XHJcbiAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgIDxQcm9tcHRJbnB1dEFjdGlvbnMgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0yXCI+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAgICAgJ2ZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRyYW5zaXRpb24tb3BhY2l0eSBkdXJhdGlvbi0zMDAnLFxyXG4gICAgICAgICAgICAgICAgaXNSZWNvcmRpbmcgPyAnaW52aXNpYmxlIGgtMCBvcGFjaXR5LTAnIDogJ3Zpc2libGUgb3BhY2l0eS0xMDAnLFxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8UHJvbXB0SW5wdXRBY3Rpb24gdG9vbHRpcD1cIlVwbG9hZCBpbWFnZVwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdXBsb2FkSW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggdy04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWZ1bGwgdGV4dC1bIzlDQTNBRl0gdHJhbnNpdGlvbi1jb2xvcnMgaG92ZXI6YmctZ3JheS02MDAvMzAgaG92ZXI6dGV4dC1bI0QxRDVEQl1cIlxyXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNSZWNvcmRpbmd9XHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJVcGxvYWQgaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8UGFwZXJjbGlwIGNsYXNzTmFtZT1cImgtNSB3LTUgdHJhbnNpdGlvbi1jb2xvcnNcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICByZWY9e3VwbG9hZElucHV0UmVmfVxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoaWRkZW5cIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmZpbGVzICYmIGUudGFyZ2V0LmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZSkgcHJvY2Vzc0ZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L1Byb21wdElucHV0QWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUb2dnbGVDaGFuZ2UoJ3NlYXJjaCcpfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAgICAgICAgICdmbGV4IGgtOCBpdGVtcy1jZW50ZXIgZ2FwLTEgcm91bmRlZC1mdWxsIGJvcmRlciBweC0yIHB5LTEgdHJhbnNpdGlvbi1hbGwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dTZWFyY2hcclxuICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1bIzFFQUVEQl0gYmctWyMxRUFFREJdLzE1IHRleHQtWyMxRUFFREJdJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXRyYW5zcGFyZW50IGJnLXRyYW5zcGFyZW50IHRleHQtWyM5Q0EzQUZdIGhvdmVyOnRleHQtWyNEMUQ1REJdJyxcclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgYXJpYS1wcmVzc2VkPXtzaG93U2VhcmNofVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogc2hvd1NlYXJjaCA/IDM2MCA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogc2hvd1NlYXJjaCA/IDEuMSA6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IHR5cGU6ICdzcHJpbmcnLCBzdGlmZm5lc3M6IDI2MCwgZGFtcGluZzogMjUgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHbG9iZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgIHtzaG93U2VhcmNoICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uc3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsPXt7IHdpZHRoOiAwLCBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgd2lkdGg6ICdhdXRvJywgb3BhY2l0eTogMSB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGl0PXt7IHdpZHRoOiAwLCBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LXNocmluay0wIG92ZXJmbG93LWhpZGRlbiB3aGl0ZXNwYWNlLW5vd3JhcCB0ZXh0LXhzIHRleHQtWyMxRUFFREJdXCJcclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgU2VhcmNoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L21vdGlvbi5zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgPEN1c3RvbURpdmlkZXIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUb2dnbGVDaGFuZ2UoJ3RoaW5rJyl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZsZXggaC04IGl0ZW1zLWNlbnRlciBnYXAtMSByb3VuZGVkLWZ1bGwgYm9yZGVyIHB4LTIgcHktMSB0cmFuc2l0aW9uLWFsbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1RoaW5rXHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItWyM4QjVDRjZdIGJnLVsjOEI1Q0Y2XS8xNSB0ZXh0LVsjOEI1Q0Y2XSdcclxuICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCBiZy10cmFuc3BhcmVudCB0ZXh0LVsjOUNBM0FGXSBob3Zlcjp0ZXh0LVsjRDFENURCXScsXHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17c2hvd1RoaW5rfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogc2hvd1RoaW5rID8gMzYwIDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBzaG93VGhpbmsgPyAxLjEgOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyB0eXBlOiAnc3ByaW5nJywgc3RpZmZuZXNzOiAyNjAsIGRhbXBpbmc6IDI1IH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8QnJhaW5Db2cgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cclxuICAgICAgICAgICAgICAgICAgICB7c2hvd1RoaW5rICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uc3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsPXt7IHdpZHRoOiAwLCBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgd2lkdGg6ICdhdXRvJywgb3BhY2l0eTogMSB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGl0PXt7IHdpZHRoOiAwLCBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LXNocmluay0wIG92ZXJmbG93LWhpZGRlbiB3aGl0ZXNwYWNlLW5vd3JhcCB0ZXh0LXhzIHRleHQtWyM4QjVDRjZdXCJcclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVGhpbmtcclxuICAgICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLnNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgPFByb21wdElucHV0QWN0aW9uIHRvb2x0aXA9XCJTd2l0Y2ggbW9kZWxcIj5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dNb2RlbE1lbnUoIXNob3dNb2RlbE1lbnUpfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAnZmxleCBoLTggaXRlbXMtY2VudGVyIGdhcC0xLjUgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItZ3JheS02MDAvNTAgYmctZ3JheS02MDAvMjAgcHgtMi41IHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LVsjOUNBM0FGXSB0cmFuc2l0aW9uLWFsbCBob3Zlcjpib3JkZXItZ3JheS01MDAgaG92ZXI6dGV4dC1bI0QxRDVEQl0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvd01vZGVsTWVudSAmJiAnYm9yZGVyLVsjOWI4N2Y1XS81MCBiZy1bIzliODdmNV0vMTAgdGV4dC1bIzliODdmNV0nLFxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUmVjb3JkaW5nIHx8IGlzTG9hZGluZ31cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMYXllcnMgY2xhc3NOYW1lPVwiaC0zLjUgdy0zLjVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbiBzbTppbmxpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtBSV9NT0RFTFMuZmluZCgobSkgPT4gbS5pZCA9PT0gbW9kZWwpPy5uYW1lIHx8ICdNb2RlbCd9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDaGV2cm9uRG93blxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2gtMyB3LTMgdHJhbnNpdGlvbi10cmFuc2Zvcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TW9kZWxNZW51ICYmICdyb3RhdGUtMTgwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L1Byb21wdElucHV0QWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxBbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgICAgICAgICAgIHtzaG93TW9kZWxNZW51ICYmIChcclxuICAgICAgICAgICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTQwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd01vZGVsTWVudShmYWxzZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC45NSwgeTogMTAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCBzY2FsZTogMSwgeTogMCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1LCB5OiAxMCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0wIGJvdHRvbS1mdWxsIHotNTAgbWItMiB3LTU2IG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLVsjMzMzMzMzXSBiZy1bIzFGMjAyM10gcC0xIHNoYWRvdy0yeGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7QUlfTU9ERUxTLm1hcCgobSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17bS5pZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb2RlbENoYW5nZT8uKG0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcm5hbE1vZGVsKG0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTaG93TW9kZWxNZW51KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZmxleCB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtc3RhcnQgZ2FwLTAuNSByb3VuZGVkLXhsIHB4LTMgcHktMiB0ZXh0LWxlZnQgdHJhbnNpdGlvbi1jb2xvcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9PT0gbS5pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLVsjOWI4N2Y1XS8xMCB0ZXh0LVsjOWI4N2Y1XSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICd0ZXh0LWdyYXktNDAwIGhvdmVyOmJnLWdyYXktNjAwLzMwIGhvdmVyOnRleHQtZ3JheS0yMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LXNlbWlib2xkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge20ubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bW9kZWwgPT09IG0uaWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDaGVjayBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIG9wYWNpdHktNzBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge20ucHJvdmlkZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxQcm9tcHRJbnB1dEFjdGlvblxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcD17XHJcbiAgICAgICAgICAgICAgICAgIGlzTG9hZGluZ1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ1N0b3AgZ2VuZXJhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICA6IGlzUmVjb3JkaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdTdG9wIHJlY29yZGluZydcclxuICAgICAgICAgICAgICAgICAgICAgIDogaGFzQ29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdTZW5kIG1lc3NhZ2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ1ZvaWNlIG1lc3NhZ2UnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJkZWZhdWx0XCJcclxuICAgICAgICAgICAgICAgIHNpemU9XCJpY29uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXHJcbiAgICAgICAgICAgICAgICAgICdoLTggdy04IHJvdW5kZWQtZnVsbCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDAnLFxyXG4gICAgICAgICAgICAgICAgICBpc1JlY29yZGluZ1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLXRyYW5zcGFyZW50IHRleHQtcmVkLTUwMCBob3ZlcjpiZy1ncmF5LTYwMC8zMCBob3Zlcjp0ZXh0LXJlZC00MDAnXHJcbiAgICAgICAgICAgICAgICAgICAgOiBoYXNDb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdiZy13aGl0ZSB0ZXh0LVsjMUYyMDIzXSBob3ZlcjpiZy13aGl0ZS84MCdcclxuICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXRyYW5zcGFyZW50IHRleHQtWyM5Q0EzQUZdIGhvdmVyOmJnLWdyYXktNjAwLzMwIGhvdmVyOnRleHQtWyNEMUQ1REJdJyxcclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChpc1JlY29yZGluZykgc2V0SXNSZWNvcmRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNDb250ZW50KSBoYW5kbGVTdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgICAgZWxzZSBzZXRJc1JlY29yZGluZyh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNMb2FkaW5nICYmICFoYXNDb250ZW50fVxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17XHJcbiAgICAgICAgICAgICAgICAgIGlzTG9hZGluZ1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ1N0b3AgZ2VuZXJhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICA6IGlzUmVjb3JkaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdTdG9wIHJlY29yZGluZydcclxuICAgICAgICAgICAgICAgICAgICAgIDogaGFzQ29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdTZW5kIG1lc3NhZ2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ1N0YXJ0IHZvaWNlIG1lc3NhZ2UnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAge2lzTG9hZGluZyA/IChcclxuICAgICAgICAgICAgICAgICAgPFNxdWFyZSBjbGFzc05hbWU9XCJoLTQgdy00IGFuaW1hdGUtcHVsc2UgZmlsbC1bIzFGMjAyM11cIiAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IGlzUmVjb3JkaW5nID8gKFxyXG4gICAgICAgICAgICAgICAgICA8U3RvcENpcmNsZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtcmVkLTUwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICApIDogaGFzQ29udGVudCA/IChcclxuICAgICAgICAgICAgICAgICAgPEFycm93VXAgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LVsjMUYyMDIzXVwiIC8+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICA8TWljIGNsYXNzTmFtZT1cImgtNSB3LTUgdGV4dC1bIzFGMjAyM10gdHJhbnNpdGlvbi1jb2xvcnNcIiAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgPC9Qcm9tcHRJbnB1dEFjdGlvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvUHJvbXB0SW5wdXRBY3Rpb25zPlxyXG4gICAgICA8L1Byb21wdElucHV0PlxyXG5cclxuICAgICAgPEltYWdlVmlld0RpYWxvZ1xyXG4gICAgICAgIGltYWdlVXJsPXtzZWxlY3RlZEltYWdlfVxyXG4gICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNlbGVjdGVkSW1hZ2UobnVsbCl9XHJcbiAgICAgIC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59LFxyXG4pO1xyXG5Qcm9tcHRJbnB1dEJveC5kaXNwbGF5TmFtZSA9ICdQcm9tcHRJbnB1dEJveCc7XHJcbiJdLCJuYW1lcyI6WyJEaWFsb2dQcmltaXRpdmUiLCJUb29sdGlwUHJpbWl0aXZlIiwiQW5pbWF0ZVByZXNlbmNlIiwibW90aW9uIiwiQXJyb3dVcCIsIkJyYWluQ29nIiwiQ2hlY2siLCJDaGV2cm9uRG93biIsIkdsb2JlIiwiR3JhZHVhdGlvbkNhcCIsIkxheWVycyIsIk1pYyIsIlBhcGVyY2xpcCIsIlNxdWFyZSIsIlN0b3BDaXJjbGUiLCJYIiwiUmVhY3QiLCJBSV9NT0RFTFMiLCJjbiIsImNsYXNzZXMiLCJmaWx0ZXIiLCJCb29sZWFuIiwiam9pbiIsInN0eWxlcyIsInVzZVN0eWxlSW5qZWN0aW9uIiwidXNlRWZmZWN0Iiwic3R5bGVJZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZVNoZWV0IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiaW5uZXJUZXh0IiwiaGVhZCIsImFwcGVuZENoaWxkIiwiVGV4dGFyZWEiLCJmb3J3YXJkUmVmIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJyZWYiLCJ0ZXh0YXJlYSIsInJvd3MiLCJkaXNwbGF5TmFtZSIsIlRvb2x0aXBQcm92aWRlciIsIlByb3ZpZGVyIiwiVG9vbHRpcCIsIlJvb3QiLCJUb29sdGlwVHJpZ2dlciIsIlRyaWdnZXIiLCJUb29sdGlwQ29udGVudCIsInNpZGVPZmZzZXQiLCJDb250ZW50IiwiRGlhbG9nIiwiRGlhbG9nUG9ydGFsIiwiUG9ydGFsIiwiRGlhbG9nT3ZlcmxheSIsIk92ZXJsYXkiLCJEaWFsb2dDb250ZW50IiwiY2hpbGRyZW4iLCJDbG9zZSIsInNwYW4iLCJEaWFsb2dUaXRsZSIsIlRpdGxlIiwiQnV0dG9uIiwidmFyaWFudCIsInNpemUiLCJ2YXJpYW50Q2xhc3NlcyIsImRlZmF1bHQiLCJvdXRsaW5lIiwiZ2hvc3QiLCJzaXplQ2xhc3NlcyIsInNtIiwibGciLCJpY29uIiwiYnV0dG9uIiwiVm9pY2VSZWNvcmRlciIsImlzUmVjb3JkaW5nIiwib25TdGFydFJlY29yZGluZyIsIm9uU3RvcFJlY29yZGluZyIsInZpc3VhbGl6ZXJCYXJzIiwidGltZSIsInNldFRpbWUiLCJ1c2VTdGF0ZSIsInRpbWVSZWYiLCJ1c2VSZWYiLCJ0aW1lclJlZiIsIndhc1JlY29yZGluZ1JlZiIsIm9uU3RhcnRSZWNvcmRpbmdSZWYiLCJvblN0b3BSZWNvcmRpbmdSZWYiLCJjdXJyZW50Iiwic2V0SW50ZXJ2YWwiLCJ0IiwiY2xlYXJJbnRlcnZhbCIsImZvcm1hdFRpbWUiLCJzZWNvbmRzIiwibWlucyIsIk1hdGgiLCJmbG9vciIsInNlY3MiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwiZGl2IiwiQXJyYXkiLCJtYXAiLCJfIiwiaSIsInN0eWxlIiwiaGVpZ2h0IiwibWF4IiwicmFuZG9tIiwiYW5pbWF0aW9uRGVsYXkiLCJhbmltYXRpb25EdXJhdGlvbiIsIkltYWdlVmlld0RpYWxvZyIsImltYWdlVXJsIiwib25DbG9zZSIsIm9wZW4iLCJvbk9wZW5DaGFuZ2UiLCJpbml0aWFsIiwib3BhY2l0eSIsInNjYWxlIiwiYW5pbWF0ZSIsImV4aXQiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJlYXNlIiwiaW1nIiwic3JjIiwiYWx0Iiwid2lkdGgiLCJQcm9tcHRJbnB1dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwiaXNMb2FkaW5nIiwidmFsdWUiLCJzZXRWYWx1ZSIsIm1heEhlaWdodCIsIm9uU3VibWl0IiwidW5kZWZpbmVkIiwiZGlzYWJsZWQiLCJ1c2VQcm9tcHRJbnB1dCIsInVzZUNvbnRleHQiLCJQcm9tcHRJbnB1dCIsIm9uVmFsdWVDaGFuZ2UiLCJvbkRyYWdPdmVyIiwib25EcmFnTGVhdmUiLCJvbkRyb3AiLCJpbnRlcm5hbFZhbHVlIiwic2V0SW50ZXJuYWxWYWx1ZSIsImhhbmRsZUNoYW5nZSIsIm5ld1ZhbHVlIiwicm9sZSIsImFyaWEtbGFiZWwiLCJQcm9tcHRJbnB1dFRleHRhcmVhIiwib25LZXlEb3duIiwiZGlzYWJsZUF1dG9zaXplIiwicGxhY2Vob2xkZXIiLCJ0ZXh0YXJlYVJlZiIsIm1pbiIsInNjcm9sbEhlaWdodCIsImhhbmRsZUtleURvd24iLCJlIiwia2V5Iiwic2hpZnRLZXkiLCJwcmV2ZW50RGVmYXVsdCIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwiUHJvbXB0SW5wdXRBY3Rpb25zIiwiUHJvbXB0SW5wdXRBY3Rpb24iLCJ0b29sdGlwIiwic2lkZSIsImFzQ2hpbGQiLCJDdXN0b21EaXZpZGVyIiwiY2xpcFBhdGgiLCJQcm9tcHRNb2RlVG9nZ2xlIiwibW9kZSIsIm9uTW9kZUNoYW5nZSIsImxhYmVsIiwiZGVzY3JpcHRpb24iLCJJY29uIiwiaXNBY3RpdmUiLCJ0eXBlIiwib25DbGljayIsImFyaWEtcHJlc3NlZCIsInRpdGxlIiwiYXJpYS1oaWRkZW4iLCJQcm9tcHRJbnB1dEJveCIsIm9uU2VuZCIsImNvbnRyb2xsZWRNb2RlIiwic2hvd1RvZ2dsZSIsIm1vZGVsIiwiY29udHJvbGxlZE1vZGVsIiwib25Nb2RlbENoYW5nZSIsImlucHV0Iiwic2V0SW5wdXQiLCJmaWxlcyIsInNldEZpbGVzIiwiZmlsZVByZXZpZXdzIiwic2V0RmlsZVByZXZpZXdzIiwic2VsZWN0ZWRJbWFnZSIsInNldFNlbGVjdGVkSW1hZ2UiLCJzZXRJc1JlY29yZGluZyIsInNob3dTZWFyY2giLCJzZXRTaG93U2VhcmNoIiwic2hvd1RoaW5rIiwic2V0U2hvd1RoaW5rIiwic2hvd0NhbnZhcyIsInNldFNob3dDYW52YXMiLCJpbnRlcm5hbE1vZGUiLCJzZXRJbnRlcm5hbE1vZGUiLCJpbnRlcm5hbE1vZGVsIiwic2V0SW50ZXJuYWxNb2RlbCIsInNob3dNb2RlbE1lbnUiLCJzZXRTaG93TW9kZWxNZW51IiwidXBsb2FkSW5wdXRSZWYiLCJwcm9tcHRCb3hSZWYiLCJoYW5kbGVNb2RlQ2hhbmdlIiwibmV4dE1vZGUiLCJoYW5kbGVUb2dnbGVDaGFuZ2UiLCJwcmV2IiwiaGFuZGxlQ2FudmFzVG9nZ2xlIiwiYWxsU3VnZ2VzdGlvbnMiLCJ1c2VNZW1vIiwicXVpeiIsInByb21wdCIsImNvbG9yIiwiaG92ZXIiLCJleHBsYWluZXIiLCJzdWdnZXN0aW9ucyIsInNldFN1Z2dlc3Rpb25zIiwic2xpY2UiLCJwb29sIiwic2h1ZmZsZWQiLCJzb3J0IiwicHJvY2Vzc0ZpbGUiLCJ1c2VDYWxsYmFjayIsImZpbGUiLCJzdGFydHNXaXRoIiwiY29uc29sZSIsImxvZyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJuYW1lIiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsImhhbmRsZURyYWdPdmVyIiwic3RvcFByb3BhZ2F0aW9uIiwiaGFuZGxlRHJhZ0xlYXZlIiwiaGFuZGxlRHJvcCIsImRyb3BwZWRGaWxlcyIsImZyb20iLCJkYXRhVHJhbnNmZXIiLCJpbWFnZUZpbGUiLCJmaW5kIiwiaGFuZGxlUmVtb3ZlRmlsZSIsImluZGV4IiwiZmlsZVRvUmVtb3ZlIiwiaGFuZGxlUGFzdGUiLCJpdGVtcyIsImNsaXBib2FyZERhdGEiLCJsZW5ndGgiLCJpdGVtIiwiaW5kZXhPZiIsImdldEFzRmlsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVuZGVyU3VnZ2VzdGlvbiIsInN1Z2dlc3Rpb24iLCJoYW5kbGVTdWJtaXQiLCJ0cmltIiwibWVzc2FnZVByZWZpeCIsImZvcm1hdHRlZElucHV0IiwiaGFuZGxlU3RhcnRSZWNvcmRpbmciLCJoYW5kbGVTdG9wUmVjb3JkaW5nIiwiaGFzQ29udGVudCIsInByZXZpZXciLCJ0YWJJbmRleCIsImNsaWNrIiwiYWNjZXB0Iiwicm90YXRlIiwic3RpZmZuZXNzIiwiZGFtcGluZyIsIm0iLCJ5IiwicHJvdmlkZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./components/ui/ai-prompt-box.tsx\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/ai/page_client-reference-manifest.js#L1:1

```
globalThis.__RSC_MANIFEST=(globalThis.__RSC_MANIFEST||{});globalThis.__RSC_MANIFEST["/ai/page"]={"moduleLoading":{"prefix":"/_next/","crossOrigin":null},"ssrModuleMapping":{"(app-pages-browser)/./app/page.tsx":{"*":{"id":"(ssr)/./app/page.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./components/navigation/app-dock.tsx":{"*":{"id":"(ssr)/./components/navigation/app-dock.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./app/template.tsx":{"*":{"id":"(ssr)/./app/template.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./components/ai/ai-prompt-box-demo.tsx":{"*":{"id":"(ssr)/./components/ai/ai-prompt-box-demo.tsx","name":"*","chunks":[],"async":false}}},"edgeSSRModuleMapping":{},"clientModules":{"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\page.tsx":{"id":"(app-pages-browser)/./app/page.tsx","name":"*","chunks":["app/page","static/chunks/app/page.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\globals.css":{"id":"(app-pages-browser)/./app/globals.css","name":"*","chunks":["app/layout","static/chunks/app/layout.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\components\\navigation\\app-dock.tsx":{"id":"(app-pages-browser)/./components/navigation/app-dock.tsx","name":"*","chunks":["app/layout","static/chunks/app/layout.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\template.tsx":{"id":"(app-pages-browser)/./app/template.tsx","name":"*","chunks":["app/template","static/chunks/app/template.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\app-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\app-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\client-page.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\client-page.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\error-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\error-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\layout-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\layout-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\not-found-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\not-found-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\render-from-template-context.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\render-from-template-context.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\components\\ai\\ai-prompt-box-demo.tsx":{"id":"(app-pages-browser)/./components/ai/ai-prompt-box-demo.tsx","name":"*","chunks":["app/ai/page","static/chunks/app/ai/page.js"],"async":false}},"entryCSSFiles":{"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\":[],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\page":[],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\layout":["static/css/app/layout.css"],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\template":[],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\ai\\page":[]}}
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L96:101

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GlobalError: () => (/* reexport default from dynamic */ next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default.a),\n/* harmony export */   __next_app__: () => (/* binding */ __next_app__),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   pages: () => (/* binding */ pages),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   tree: () => (/* binding */ tree)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-page/module.compiled */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/module.compiled.js?d969\");\n/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/client/components/error-boundary */ \"(rsc)/./node_modules/next/dist/client/components/error-boundary.js\");\n/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/app-render/entry-base */ \"(rsc)/./node_modules/next/dist/server/app-render/entry-base.js\");\n/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};\n/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__) if([\"default\",\"tree\",\"pages\",\"GlobalError\",\"originalPathname\",\"__next_app__\",\"routeModule\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]\n/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);\n\"TURBOPACK { transition: next-ssr }\";\n\n\n// We inject the tree and pages here so that we can use them in the route\n// module.\nconst tree = {\n        children: [\n        '',\n        {\n        children: ['__PAGE__', {}, {\n          page: [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/page.tsx */ \"(rsc)/./app/page.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\"],\n          \n        }]\n      },\n        {\n        'layout': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/layout.tsx */ \"(rsc)/./app/layout.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\layout.tsx\"],\n'template': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/template.tsx */ \"(rsc)/./app/template.tsx\")), \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\template.tsx\"],\n'not-found': [() => Promise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! next/dist/client/components/not-found-error */ \"(rsc)/./node_modules/next/dist/client/components/not-found-error.js\", 23)), \"next/dist/client/components/not-found-error\"],\n        \n      }\n      ]\n      }.children;\nconst pages = [\"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\"];\n\n\nconst __next_app_require__ = __webpack_require__\nconst __next_app_load_chunk__ = () => Promise.resolve()\nconst originalPathname = \"/page\";\nconst __next_app__ = {\n    require: __next_app_require__,\n    loadChunk: __next_app_load_chunk__\n};\n\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppPageRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_PAGE,\n        page: \"/page\",\n        pathname: \"/\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\",\n        appPaths: []\n    },\n    userland: {\n        loaderTree: tree\n    }\n});\n\n//# sourceMappingURL=app-page.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZwYWdlJnBhZ2U9JTJGcGFnZSZhcHBQYXRocz0lMkZwYWdlJnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGcGFnZS50c3gmYXBwRGlyPUMlM0ElNUNVc2VycyU1Q1RhbnVzaCU1Q0Rlc2t0b3AlNUNDb2RpbmclNUNTbWFydGxpJTIwVjIlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q1RhbnVzaCU1Q0Rlc2t0b3AlNUNDb2RpbmclNUNTbWFydGxpJTIwVjImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxhQUFhLHNCQUFzQjtBQUNpRTtBQUNyQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsdUJBQXVCLHdJQUFrRztBQUN6SDtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSx5QkFBeUIsNElBQW9HO0FBQzdILG1CQUFtQixnSkFBc0c7QUFDekgsb0JBQW9CLDBOQUFnRjtBQUNwRztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDdUI7QUFDNkQ7QUFDcEYsNkJBQTZCLG1CQUFtQjtBQUNoRDtBQUNPO0FBQ0E7QUFDUDtBQUNBO0FBQ0E7QUFDdUQ7QUFDdkQ7QUFDTyx3QkFBd0IsOEdBQWtCO0FBQ2pEO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCIsInNvdXJjZXMiOlsid2VicGFjazovL3NtYXJ0bGkvP2IxODAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJUVVJCT1BBQ0sgeyB0cmFuc2l0aW9uOiBuZXh0LXNzciB9XCI7XG5pbXBvcnQgeyBBcHBQYWdlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcGFnZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG4vLyBXZSBpbmplY3QgdGhlIHRyZWUgYW5kIHBhZ2VzIGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCB0cmVlID0ge1xuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAnJyxcbiAgICAgICAge1xuICAgICAgICBjaGlsZHJlbjogWydfX1BBR0VfXycsIHt9LCB7XG4gICAgICAgICAgcGFnZTogWygpID0+IGltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcYXBwXFxcXHBhZ2UudHN4XCIpLCBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFxwYWdlLnRzeFwiXSxcbiAgICAgICAgICBcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgJ2xheW91dCc6IFsoKSA9PiBpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFxsYXlvdXQudHN4XCIpLCBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGFwcFxcXFxsYXlvdXQudHN4XCJdLFxuJ3RlbXBsYXRlJzogWygpID0+IGltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcYXBwXFxcXHRlbXBsYXRlLnRzeFwiKSwgXCJDOlxcXFxVc2Vyc1xcXFxUYW51c2hcXFxcRGVza3RvcFxcXFxDb2RpbmdcXFxcU21hcnRsaSBWMlxcXFxhcHBcXFxcdGVtcGxhdGUudHN4XCJdLFxuJ25vdC1mb3VuZCc6IFsoKSA9PiBpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIm5leHQvZGlzdC9jbGllbnQvY29tcG9uZW50cy9ub3QtZm91bmQtZXJyb3JcIiksIFwibmV4dC9kaXN0L2NsaWVudC9jb21wb25lbnRzL25vdC1mb3VuZC1lcnJvclwiXSxcbiAgICAgICAgXG4gICAgICB9XG4gICAgICBdXG4gICAgICB9LmNoaWxkcmVuO1xuY29uc3QgcGFnZXMgPSBbXCJDOlxcXFxVc2Vyc1xcXFxUYW51c2hcXFxcRGVza3RvcFxcXFxDb2RpbmdcXFxcU21hcnRsaSBWMlxcXFxhcHBcXFxccGFnZS50c3hcIl07XG5leHBvcnQgeyB0cmVlLCBwYWdlcyB9O1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHbG9iYWxFcnJvciB9IGZyb20gXCJuZXh0L2Rpc3QvY2xpZW50L2NvbXBvbmVudHMvZXJyb3ItYm91bmRhcnlcIjtcbmNvbnN0IF9fbmV4dF9hcHBfcmVxdWlyZV9fID0gX193ZWJwYWNrX3JlcXVpcmVfX1xuY29uc3QgX19uZXh0X2FwcF9sb2FkX2NodW5rX18gPSAoKSA9PiBQcm9taXNlLnJlc29sdmUoKVxuZXhwb3J0IGNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9wYWdlXCI7XG5leHBvcnQgY29uc3QgX19uZXh0X2FwcF9fID0ge1xuICAgIHJlcXVpcmU6IF9fbmV4dF9hcHBfcmVxdWlyZV9fLFxuICAgIGxvYWRDaHVuazogX19uZXh0X2FwcF9sb2FkX2NodW5rX19cbn07XG5leHBvcnQgKiBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9hcHAtcmVuZGVyL2VudHJ5LWJhc2VcIjtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFBhZ2VSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1BBR0UsXG4gICAgICAgIHBhZ2U6IFwiL3BhZ2VcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL1wiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIlwiLFxuICAgICAgICBhcHBQYXRoczogW11cbiAgICB9LFxuICAgIHVzZXJsYW5kOiB7XG4gICAgICAgIGxvYWRlclRyZWU6IHRyZWVcbiAgICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXBhZ2UuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fpage&page=%2Fpage&appPaths=%2Fpage&pagePath=private-next-app-dir%2Fpage.tsx&appDir=C%3A%5CUsers%5CTanush%5CDesktop%5CCoding%5CSmartli%20V2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CTanush%5CDesktop%5CCoding%5CSmartli%20V2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L107:111

```
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./components/navigation/app-dock.tsx */ \"(ssr)/./components/navigation/app-dock.tsx\"));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1jbGllbnQtZW50cnktbG9hZGVyLmpzP21vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNhcHAlNUMlNUNnbG9iYWxzLmNzcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDY29tcG9uZW50cyU1QyU1Q25hdmlnYXRpb24lNUMlNUNhcHAtZG9jay50c3glMjIlMkMlMjJpZHMlMjIlM0ElNUIlMjJBcHBEb2NrJTIyJTVEJTdEJnNlcnZlcj10cnVlISIsIm1hcHBpbmdzIjoiQUFBQSxvTEFBc0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpLz9lMjg4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiLCB3ZWJwYWNrRXhwb3J0czogW1wiQXBwRG9ja1wiXSAqLyBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXGNvbXBvbmVudHNcXFxcbmF2aWdhdGlvblxcXFxhcHAtZG9jay50c3hcIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Ccomponents%5C%5Cnavigation%5C%5Capp-dock.tsx%22%2C%22ids%22%3A%5B%22AppDock%22%5D%7D&server=true!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L131:136

```
/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L137:141

```
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("Promise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/app-router.js */ \"(ssr)/./node_modules/next/dist/client/components/app-router.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/client-page.js */ \"(ssr)/./node_modules/next/dist/client/components/client-page.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/error-boundary.js */ \"(ssr)/./node_modules/next/dist/client/components/error-boundary.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/layout-router.js */ \"(ssr)/./node_modules/next/dist/client/components/layout-router.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/not-found-boundary.js */ \"(ssr)/./node_modules/next/dist/client/components/not-found-boundary.js\", 23));\n;\nPromise.resolve(/*! import() eager */).then(__webpack_require__.t.bind(__webpack_require__, /*! ./node_modules/next/dist/client/components/render-from-template-context.js */ \"(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js\", 23));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1jbGllbnQtZW50cnktbG9hZGVyLmpzP21vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNub2RlX21vZHVsZXMlNUMlNUNuZXh0JTVDJTVDZGlzdCU1QyU1Q2NsaWVudCU1QyU1Q2NvbXBvbmVudHMlNUMlNUNhcHAtcm91dGVyLmpzJTIyJTJDJTIyaWRzJTIyJTNBJTVCJTVEJTdEJm1vZHVsZXM9JTdCJTIycmVxdWVzdCUyMiUzQSUyMkMlM0ElNUMlNUNVc2VycyU1QyU1Q1RhbnVzaCU1QyU1Q0Rlc2t0b3AlNUMlNUNDb2RpbmclNUMlNUNTbWFydGxpJTIwVjIlNUMlNUNub2RlX21vZHVsZXMlNUMlNUNuZXh0JTVDJTVDZGlzdCU1QyU1Q2NsaWVudCU1QyU1Q2NvbXBvbmVudHMlNUMlNUNjbGllbnQtcGFnZS5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDbm9kZV9tb2R1bGVzJTVDJTVDbmV4dCU1QyU1Q2Rpc3QlNUMlNUNjbGllbnQlNUMlNUNjb21wb25lbnRzJTVDJTVDZXJyb3ItYm91bmRhcnkuanMlMjIlMkMlMjJpZHMlMjIlM0ElNUIlNUQlN0QmbW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyQyUzQSU1QyU1Q1VzZXJzJTVDJTVDVGFudXNoJTVDJTVDRGVza3RvcCU1QyU1Q0NvZGluZyU1QyU1Q1NtYXJ0bGklMjBWMiU1QyU1Q25vZGVfbW9kdWxlcyU1QyU1Q25leHQlNUMlNUNkaXN0JTVDJTVDY2xpZW50JTVDJTVDY29tcG9uZW50cyU1QyU1Q2xheW91dC1yb3V0ZXIuanMlMjIlMkMlMjJpZHMlMjIlM0ElNUIlNUQlN0QmbW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyQyUzQSU1QyU1Q1VzZXJzJTVDJTVDVGFudXNoJTVDJTVDRGVza3RvcCU1QyU1Q0NvZGluZyU1QyU1Q1NtYXJ0bGklMjBWMiU1QyU1Q25vZGVfbW9kdWxlcyU1QyU1Q25leHQlNUMlNUNkaXN0JTVDJTVDY2xpZW50JTVDJTVDY29tcG9uZW50cyU1QyU1Q25vdC1mb3VuZC1ib3VuZGFyeS5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZtb2R1bGVzPSU3QiUyMnJlcXVlc3QlMjIlM0ElMjJDJTNBJTVDJTVDVXNlcnMlNUMlNUNUYW51c2glNUMlNUNEZXNrdG9wJTVDJTVDQ29kaW5nJTVDJTVDU21hcnRsaSUyMFYyJTVDJTVDbm9kZV9tb2R1bGVzJTVDJTVDbmV4dCU1QyU1Q2Rpc3QlNUMlNUNjbGllbnQlNUMlNUNjb21wb25lbnRzJTVDJTVDcmVuZGVyLWZyb20tdGVtcGxhdGUtY29udGV4dC5qcyUyMiUyQyUyMmlkcyUyMiUzQSU1QiU1RCU3RCZzZXJ2ZXI9dHJ1ZSEiLCJtYXBwaW5ncyI6IkFBQUEsa09BQWdKO0FBQ2hKO0FBQ0Esb09BQWlKO0FBQ2pKO0FBQ0EsME9BQW9KO0FBQ3BKO0FBQ0Esd09BQW1KO0FBQ25KO0FBQ0Esa1BBQXdKO0FBQ3hKO0FBQ0Esc1FBQWtLIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21hcnRsaS8/OTQ2NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIkM6XFxcXFVzZXJzXFxcXFRhbnVzaFxcXFxEZXNrdG9wXFxcXENvZGluZ1xcXFxTbWFydGxpIFYyXFxcXG5vZGVfbW9kdWxlc1xcXFxuZXh0XFxcXGRpc3RcXFxcY2xpZW50XFxcXGNvbXBvbmVudHNcXFxcYXBwLXJvdXRlci5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxjbGllbnQtcGFnZS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxlcnJvci1ib3VuZGFyeS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxsYXlvdXQtcm91dGVyLmpzXCIpO1xuO1xuaW1wb3J0KC8qIHdlYnBhY2tNb2RlOiBcImVhZ2VyXCIgKi8gXCJDOlxcXFxVc2Vyc1xcXFxUYW51c2hcXFxcRGVza3RvcFxcXFxDb2RpbmdcXFxcU21hcnRsaSBWMlxcXFxub2RlX21vZHVsZXNcXFxcbmV4dFxcXFxkaXN0XFxcXGNsaWVudFxcXFxjb21wb25lbnRzXFxcXG5vdC1mb3VuZC1ib3VuZGFyeS5qc1wiKTtcbjtcbmltcG9ydCgvKiB3ZWJwYWNrTW9kZTogXCJlYWdlclwiICovIFwiQzpcXFxcVXNlcnNcXFxcVGFudXNoXFxcXERlc2t0b3BcXFxcQ29kaW5nXFxcXFNtYXJ0bGkgVjJcXFxcbm9kZV9tb2R1bGVzXFxcXG5leHRcXFxcZGlzdFxcXFxjbGllbnRcXFxcY29tcG9uZW50c1xcXFxyZW5kZXItZnJvbS10ZW1wbGF0ZS1jb250ZXh0LmpzXCIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Capp-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cclient-page.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cerror-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Clayout-router.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Cnot-found-boundary.js%22%2C%22ids%22%3A%5B%5D%7D&modules=%7B%22request%22%3A%22C%3A%5C%5CUsers%5C%5CTanush%5C%5CDesktop%5C%5CCoding%5C%5CSmartli%20V2%5C%5Cnode_modules%5C%5Cnext%5C%5Cdist%5C%5Cclient%5C%5Ccomponents%5C%5Crender-from-template-context.js%22%2C%22ids%22%3A%5B%5D%7D&server=true!\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L147:152

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DashboardPage)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_ui_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/Button */ \"(ssr)/./components/ui/Button.tsx\");\n/* harmony import */ var _components_ui_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/card */ \"(ssr)/./components/ui/card.tsx\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/trending-up.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/timer.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/zap.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/brain.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/sparkles.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/chevron-right.js\");\n/* harmony import */ var _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! __barrel_optimize__?names=Brain,ChevronRight,ListTodo,Sparkles,Timer,TrendingUp,Zap!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/list-todo.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ \"(ssr)/./node_modules/next/dist/api/link.js\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\n\n\n\n\nfunction DashboardPage() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"max-w-6xl mx-auto p-6 space-y-12\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                className: \"flex items-center justify-between py-4\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"space-y-1\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                className: \"text-4xl font-bold tracking-tight text-foreground\",\n                                children: [\n                                    \"Studio \",\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"text-primary\",\n                                        children: \"Hub\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                        lineNumber: 16,\n                                        columnNumber: 20\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 15,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"text-muted-foreground font-medium\",\n                                children: \"Welcome back. Your learning system is ready.\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 18,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                        lineNumber: 14,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {\n                        variant: \"outline\",\n                        className: \"hidden md:flex items-center gap-2 rounded-full px-5\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                size: 16\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 23,\n                                columnNumber: 11\n                            }, this),\n                            \" Analytics\"\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                        lineNumber: 22,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                lineNumber: 13,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"grid grid-cols-1 md:grid-cols-4 gap-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"md:col-span-1 flex flex-col gap-4\",\n                        children: [\n                            {\n                                label: \"Hours\",\n                                value: \"12.5\",\n                                icon: _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n                                color: \"text-blue-500\"\n                            },\n                            {\n                                label: \"Streak\",\n                                value: \"5d\",\n                                icon: _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n                                color: \"text-orange-500\"\n                            },\n                            {\n                                label: \"Mastery\",\n                                value: \"68%\",\n                                icon: _barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n                                color: \"text-indigo-500\"\n                            }\n                        ].map((stat, i)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__.Card, {\n                                className: \"group hover:border-primary/50 transition-all cursor-default\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__.CardContent, {\n                                    className: \"p-5\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"flex items-center justify-between mb-2\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(stat.icon, {\n                                                    size: 18,\n                                                    className: stat.color\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 39,\n                                                    columnNumber: 19\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                    className: \"text-[10px] font-bold uppercase tracking-widest text-muted-foreground\",\n                                                    children: stat.label\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 40,\n                                                    columnNumber: 19\n                                                }, this)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 38,\n                                            columnNumber: 17\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"text-2xl font-bold text-foreground group-hover:translate-x-1 transition-transform\",\n                                            children: stat.value\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 42,\n                                            columnNumber: 17\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                    lineNumber: 37,\n                                    columnNumber: 15\n                                }, this)\n                            }, i, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 36,\n                                columnNumber: 13\n                            }, this))\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_link__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                href: \"/learning/explainer\",\n                                className: \"group\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__.Card, {\n                                    className: \"relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity\",\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                                                size: 120,\n                                                className: \"text-primary\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                lineNumber: 55,\n                                                columnNumber: 17\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 54,\n                                            columnNumber: 15\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"relative z-10 space-y-4\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4\",\n                                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {\n                                                        size: 24\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                        lineNumber: 59,\n                                                        columnNumber: 19\n                                                    }, this)\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 58,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                    className: \"text-2xl font-bold text-foreground\",\n                                                    children: \"AI Explainer\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 61,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                                    className: \"text-muted-foreground leading-relaxed max-w-xs\",\n                                                    children: \"Deep-dive into complex topics with pedagogical precision.\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 62,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"pt-4\",\n                                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                        className: \"inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all\",\n                                                        children: [\n                                                            \"Enter Suite \",\n                                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n                                                                size: 16\n                                                            }, void 0, false, {\n                                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                                lineNumber: 67,\n                                                                columnNumber: 33\n                                                            }, this)\n                                                        ]\n                                                    }, void 0, true, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                        lineNumber: 66,\n                                                        columnNumber: 19\n                                                    }, this)\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 65,\n                                                    columnNumber: 17\n                                                }, this)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 57,\n                                            columnNumber: 15\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                    lineNumber: 53,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 52,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_link__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                href: \"/learning/quiz\",\n                                className: \"group\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__.Card, {\n                                    className: \"relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-emerald-500/50\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity\",\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"], {\n                                                size: 120,\n                                                className: \"text-emerald-500\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                lineNumber: 77,\n                                                columnNumber: 17\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 76,\n                                            columnNumber: 15\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"relative z-10 space-y-4\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4\",\n                                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"], {\n                                                        size: 24\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                        lineNumber: 81,\n                                                        columnNumber: 19\n                                                    }, this)\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 80,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                    className: \"text-2xl font-bold text-foreground\",\n                                                    children: \"Quiz Generator\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 83,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                                    className: \"text-muted-foreground leading-relaxed max-w-xs\",\n                                                    children: \"Transform your notes into active recall assessments.\"\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 84,\n                                                    columnNumber: 17\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"pt-4\",\n                                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                        className: \"inline-flex items-center gap-1 text-sm font-semibold text-emerald-500 group-hover:gap-2 transition-all\",\n                                                        children: [\n                                                            \"Generate Quiz \",\n                                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"], {\n                                                                size: 16\n                                                            }, void 0, false, {\n                                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                                lineNumber: 89,\n                                                                columnNumber: 35\n                                                            }, this)\n                                                        ]\n                                                    }, void 0, true, {\n                                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                        lineNumber: 88,\n                                                        columnNumber: 19\n                                                    }, this)\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 87,\n                                                    columnNumber: 17\n                                                }, this)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                            lineNumber: 79,\n                                            columnNumber: 15\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                    lineNumber: 75,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 74,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                        lineNumber: 51,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"grid grid-cols-1 md:grid-cols-3 gap-6\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_link__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                    href: \"/focus\",\n                    className: \"md:col-span-3 group\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__.Card, {\n                        className: \"relative p-8 bg-zinc-900 dark:bg-zinc-950 text-foreground overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                    size: 120,\n                                    className: \"text-zinc-400\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                    lineNumber: 103,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 102,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"space-y-2\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                className: \"w-12 h-12 rounded-2xl bg-zinc-800 dark:bg-zinc-800 text-zinc-300 flex items-center justify-center mb-4\",\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Brain_ChevronRight_ListTodo_Sparkles_Timer_TrendingUp_Zap_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                                    size: 24\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                    lineNumber: 108,\n                                                    columnNumber: 19\n                                                }, this)\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                lineNumber: 107,\n                                                columnNumber: 17\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                className: \"text-2xl font-bold\",\n                                                children: \"Focus Hub\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                lineNumber: 110,\n                                                columnNumber: 17\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                                className: \"text-muted-foreground max-w-md\",\n                                                children: \"Enter a state of deep work with the Pomodoro timer and ambient soundscapes.\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                                lineNumber: 111,\n                                                columnNumber: 17\n                                            }, this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                        lineNumber: 106,\n                                        columnNumber: 15\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {\n                                        variant: \"secondary\",\n                                        className: \"rounded-full px-8 py-4 text-base font-bold\",\n                                        children: \"Start Focusing\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                        lineNumber: 115,\n                                        columnNumber: 15\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                                lineNumber: 105,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                        lineNumber: 101,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                    lineNumber: 100,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n                lineNumber: 99,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\app\\\\page.tsx\",\n        lineNumber: 12,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b0RBQUVKLFdBQVU7OERBQWlEOzs7Ozs7OERBRzlELDhEQUFDRDtvREFBSUMsV0FBVTs4REFDYiw0RUFBQ0c7d0RBQUtILFdBQVU7OzREQUF5RzswRUFDekcsOERBQUNOLHNJQUFZQTtnRUFBQ1ksTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFVaEQsOERBQUNQO2dCQUFJQyxXQUFVOzBCQUNiLDRFQUFDSCxpREFBSUE7b0JBQUNpQixNQUFLO29CQUFTZCxXQUFVOzhCQUM1Qiw0RUFBQ1oscURBQUlBO3dCQUFDWSxXQUFVOzswQ0FDZCw4REFBQ0Q7Z0NBQUlDLFdBQVU7MENBQ2IsNEVBQUNULHFJQUFLQTtvQ0FBQ2UsTUFBTTtvQ0FBS04sV0FBVTs7Ozs7Ozs7Ozs7MENBRTlCLDhEQUFDRDtnQ0FBSUMsV0FBVTs7a0RBQ2IsOERBQUNEO3dDQUFJQyxXQUFVOzswREFDYiw4REFBQ0Q7Z0RBQUlDLFdBQVU7MERBQ2IsNEVBQUNULHFJQUFLQTtvREFBQ2UsTUFBTTs7Ozs7Ozs7Ozs7MERBRWYsOERBQUNTO2dEQUFHZixXQUFVOzBEQUFxQjs7Ozs7OzBEQUNuQyw4REFBQ0k7Z0RBQUVKLFdBQVU7MERBQWlDOzs7Ozs7Ozs7Ozs7a0RBSWhELDhEQUFDYix5REFBTUE7d0NBQUNrQixTQUFRO3dDQUFZTCxXQUFVO2tEQUE2Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNqRyIsInNvdXJjZXMiOlsid2VicGFjazovL3NtYXJ0bGkvLi9hcHAvcGFnZS50c3g/NzYwMyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvQnV0dG9uJztcbmltcG9ydCB7IENhcmQsIENhcmRDb250ZW50IH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2NhcmQnO1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL2xpYi91dGlscyc7XG5pbXBvcnQgeyBCcmFpbiwgVGltZXIsIExpc3RUb2RvLCBUcmVuZGluZ1VwLCBDaGV2cm9uUmlnaHQsIFNwYXJrbGVzLCBaYXAgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGFzaGJvYXJkUGFnZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTZ4bCBteC1hdXRvIHAtNiBzcGFjZS15LTEyXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweS00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtNHhsIGZvbnQtYm9sZCB0cmFja2luZy10aWdodCB0ZXh0LWZvcmVncm91bmRcIj5cbiAgICAgICAgICAgIFN0dWRpbyA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5IdWI8L3NwYW4+XG4gICAgICAgICAgPC9oMT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmQgZm9udC1tZWRpdW1cIj5cbiAgICAgICAgICAgIFdlbGNvbWUgYmFjay4gWW91ciBsZWFybmluZyBzeXN0ZW0gaXMgcmVhZHkuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwib3V0bGluZVwiIGNsYXNzTmFtZT1cImhpZGRlbiBtZDpmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWZ1bGwgcHgtNVwiPlxuICAgICAgICAgIDxUcmVuZGluZ1VwIHNpemU9ezE2fSAvPiBBbmFseXRpY3NcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgey8qIE1haW4gR3JpZCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtNCBnYXAtNlwiPlxuICAgICAgICB7LyogS2V5IFN0YXRzIC0gQ29tcGFjdCBCZW50byAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDpjb2wtc3Bhbi0xIGZsZXggZmxleC1jb2wgZ2FwLTRcIj5cbiAgICAgICAgICB7W1xuICAgICAgICAgICAgeyBsYWJlbDogJ0hvdXJzJywgdmFsdWU6ICcxMi41JywgaWNvbjogVGltZXIsIGNvbG9yOiAndGV4dC1ibHVlLTUwMCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdTdHJlYWsnLCB2YWx1ZTogJzVkJywgaWNvbjogWmFwLCBjb2xvcjogJ3RleHQtb3JhbmdlLTUwMCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdNYXN0ZXJ5JywgdmFsdWU6ICc2OCUnLCBpY29uOiBCcmFpbiwgY29sb3I6ICd0ZXh0LWluZGlnby01MDAnIH0sXG4gICAgICAgICAgXS5tYXAoKHN0YXQsIGkpID0+IChcbiAgICAgICAgICAgIDxDYXJkIGtleT17aX0gY2xhc3NOYW1lPVwiZ3JvdXAgaG92ZXI6Ym9yZGVyLXByaW1hcnkvNTAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLWRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPENhcmRDb250ZW50IGNsYXNzTmFtZT1cInAtNVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgIDxzdGF0Lmljb24gc2l6ZT17MTh9IGNsYXNzTmFtZT17c3RhdC5jb2xvcn0gLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPntzdGF0LmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWZvcmVncm91bmQgZ3JvdXAtaG92ZXI6dHJhbnNsYXRlLXgtMSB0cmFuc2l0aW9uLXRyYW5zZm9ybVwiPlxuICAgICAgICAgICAgICAgICAge3N0YXQudmFsdWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBMZWFybmluZyBTdWl0ZSAtIExhcmdlIEJlbnRvICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1kOmNvbC1zcGFuLTMgZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNlwiPlxuICAgICAgICAgIDxMaW5rIGhyZWY9XCIvbGVhcm5pbmcvZXhwbGFpbmVyXCIgY2xhc3NOYW1lPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgIDxDYXJkIGNsYXNzTmFtZT1cInJlbGF0aXZlIGgtZnVsbCBwLTggb3ZlcmZsb3ctaGlkZGVuIGhvdmVyOnNoYWRvdy14bCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgYm9yZGVyLWJvcmRlci81MCBob3Zlcjpib3JkZXItcHJpbWFyeS81MFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIHJpZ2h0LTAgcC04IG9wYWNpdHktMTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0yMCB0cmFuc2l0aW9uLW9wYWNpdHlcIj5cbiAgICAgICAgICAgICAgICA8QnJhaW4gc2l6ZT17MTIwfSBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQtMnhsIGJnLXByaW1hcnkvMTAgdGV4dC1wcmltYXJ5IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1iLTRcIj5cbiAgICAgICAgICAgICAgICAgIDxTcGFya2xlcyBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtZm9yZWdyb3VuZFwiPkFJIEV4cGxhaW5lcjwvaDM+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGxlYWRpbmctcmVsYXhlZCBtYXgtdy14c1wiPlxuICAgICAgICAgICAgICAgICAgRGVlcC1kaXZlIGludG8gY29tcGxleCB0b3BpY3Mgd2l0aCBwZWRhZ29naWNhbCBwcmVjaXNpb24uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtNFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LXByaW1hcnkgZ3JvdXAtaG92ZXI6Z2FwLTIgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgRW50ZXIgU3VpdGUgPENoZXZyb25SaWdodCBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgPC9MaW5rPlxuXG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9sZWFybmluZy9xdWl6XCIgY2xhc3NOYW1lPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgIDxDYXJkIGNsYXNzTmFtZT1cInJlbGF0aXZlIGgtZnVsbCBwLTggb3ZlcmZsb3ctaGlkZGVuIGhvdmVyOnNoYWRvdy14bCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgYm9yZGVyLWJvcmRlci81MCBob3Zlcjpib3JkZXItZW1lcmFsZC01MDAvNTBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMCByaWdodC0wIHAtOCBvcGFjaXR5LTEwIGdyb3VwLWhvdmVyOm9wYWNpdHktMjAgdHJhbnNpdGlvbi1vcGFjaXR5XCI+XG4gICAgICAgICAgICAgICAgPExpc3RUb2RvIHNpemU9ezEyMH0gY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTUwMFwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHotMTAgc3BhY2UteS00XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC0yeGwgYmctZW1lcmFsZC01MDAvMTAgdGV4dC1lbWVyYWxkLTUwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi00XCI+XG4gICAgICAgICAgICAgICAgICA8TGlzdFRvZG8gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWZvcmVncm91bmRcIj5RdWl6IEdlbmVyYXRvcjwvaDM+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGxlYWRpbmctcmVsYXhlZCBtYXgtdy14c1wiPlxuICAgICAgICAgICAgICAgICAgVHJhbnNmb3JtIHlvdXIgbm90ZXMgaW50byBhY3RpdmUgcmVjYWxsIGFzc2Vzc21lbnRzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB0LTRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC1lbWVyYWxkLTUwMCBncm91cC1ob3ZlcjpnYXAtMiB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICBHZW5lcmF0ZSBRdWl6IDxDaGV2cm9uUmlnaHQgc2l6ZT17MTZ9IC8+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEZvY3VzIEh1YiAtIFdpZGUgQmVudG8gKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTZcIj5cbiAgICAgICAgPExpbmsgaHJlZj1cIi9mb2N1c1wiIGNsYXNzTmFtZT1cIm1kOmNvbC1zcGFuLTMgZ3JvdXBcIj5cbiAgICAgICAgICA8Q2FyZCBjbGFzc05hbWU9XCJyZWxhdGl2ZSBwLTggYmctemluYy05MDAgZGFyazpiZy16aW5jLTk1MCB0ZXh0LWZvcmVncm91bmQgb3ZlcmZsb3ctaGlkZGVuIGhvdmVyOnNoYWRvdy0yeGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIGJvcmRlci1ib3JkZXIvNTBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTAgcmlnaHQtMCBwLTggb3BhY2l0eS0yMCBncm91cC1ob3ZlcjpvcGFjaXR5LTMwIHRyYW5zaXRpb24tb3BhY2l0eVwiPlxuICAgICAgICAgICAgICA8VGltZXIgc2l6ZT17MTIwfSBjbGFzc05hbWU9XCJ0ZXh0LXppbmMtNDAwXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIGZsZXggZmxleC1jb2wgbWQ6ZmxleC1yb3cgbWQ6aXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtNlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQtMnhsIGJnLXppbmMtODAwIGRhcms6YmctemluYy04MDAgdGV4dC16aW5jLTMwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi00XCI+XG4gICAgICAgICAgICAgICAgICA8VGltZXIgc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZFwiPkZvY3VzIEh1YjwvaDM+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG1heC13LW1kXCI+XG4gICAgICAgICAgICAgICAgICBFbnRlciBhIHN0YXRlIG9mIGRlZXAgd29yayB3aXRoIHRoZSBQb21vZG9ybyB0aW1lciBhbmQgYW1iaWVudCBzb3VuZHNjYXBlcy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiBjbGFzc05hbWU9XCJyb3VuZGVkLWZ1bGwgcHgtOCBweS00IHRleHQtYmFzZSBmb250LWJvbGRcIj5cbiAgICAgICAgICAgICAgICBTdGFydCBGb2N1c2luZ1xuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJCdXR0b24iLCJDYXJkIiwiQ2FyZENvbnRlbnQiLCJCcmFpbiIsIlRpbWVyIiwiTGlzdFRvZG8iLCJUcmVuZGluZ1VwIiwiQ2hldnJvblJpZ2h0IiwiU3BhcmtsZXMiLCJaYXAiLCJMaW5rIiwiRGFzaGJvYXJkUGFnZSIsImRpdiIsImNsYXNzTmFtZSIsImhlYWRlciIsImgxIiwic3BhbiIsInAiLCJ2YXJpYW50Iiwic2l6ZSIsImxhYmVsIiwidmFsdWUiLCJpY29uIiwiY29sb3IiLCJtYXAiLCJzdGF0IiwiaSIsImhyZWYiLCJoMyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./app/page.tsx\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page.js#L169:174

```
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AppDock: () => (/* binding */ AppDock)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(ssr)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! framer-motion */ \"(ssr)/./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/home.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/sparkles.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/timer.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/list-checks.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/trending-up.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/calendar-days.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/settings.js\");\n/* harmony import */ var _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! __barrel_optimize__?names=CalendarDays,Home,ListChecks,Settings,Sparkles,Timer,TrendingUp,UserCircle!=!lucide-react */ \"(ssr)/./node_modules/lucide-react/dist/esm/icons/circle-user.js\");\n/* harmony import */ var _components_ui_dock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/dock */ \"(ssr)/./components/ui/dock.tsx\");\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/utils */ \"(ssr)/./lib/utils.ts\");\n/* __next_internal_client_entry_do_not_use__ AppDock auto */ \n\n\n\n\n\n\nconst homeGroup = [\n    {\n        href: \"/\",\n        label: \"Home\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n    }\n];\nconst workspaceGroup = [\n    {\n        href: \"/ai\",\n        label: \"AI\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n    },\n    {\n        href: \"/focus\",\n        label: \"Focus Hub\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n    },\n    {\n        href: \"/tasks\",\n        label: \"Tasks\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\n    },\n    {\n        href: \"/analytics\",\n        label: \"Analytics\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"]\n    }\n];\nconst systemGroup = [\n    {\n        href: \"/plan\",\n        label: \"Plan\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_10__[\"default\"]\n    },\n    {\n        href: \"/settings\",\n        label: \"Settings\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_11__[\"default\"]\n    },\n    {\n        href: \"/account\",\n        label: \"Account\",\n        icon: _barrel_optimize_names_CalendarDays_Home_ListChecks_Settings_Sparkles_Timer_TrendingUp_UserCircle_lucide_react__WEBPACK_IMPORTED_MODULE_12__[\"default\"]\n    }\n];\nfunction isPathActive(pathname, href) {\n    if (href === \"/\") return pathname === \"/\";\n    return pathname === href || pathname.startsWith(`${href}/`);\n}\n// Spring config for the press-down / release animation.\n// ζ ≈ 0.75 → slightly underdamped so the release has a small physical pop.\nconst PRESS_SPRING = {\n    type: \"spring\",\n    stiffness: 400,\n    damping: 30,\n    mass: 1\n};\nfunction AppDockIcon({ href, label, icon: Icon, isActive }) {\n    const [hovered, setHovered] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isPending, startTransition] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useTransition)();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const shouldReduceMotion = (0,framer_motion__WEBPACK_IMPORTED_MODULE_13__.useReducedMotion)();\n    const handleNavigate = (e)=>{\n        // Standard Next.js Link behavior is on release (click).\n        // Fluid interfaces respond on press-down or immediately on click.\n        // We'll use useTransition to prioritize the UI feedback (active state) \n        // over the heavy page-loading transition.\n        e.preventDefault();\n        startTransition(()=>{\n            router.push(href);\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockIcon, {\n        onMouseEnter: ()=>setHovered(true),\n        onMouseLeave: ()=>setHovered(false),\n        onFocus: ()=>setHovered(true),\n        onBlur: ()=>setHovered(false),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.div, {\n                onPointerDown: handleNavigate,\n                whileTap: shouldReduceMotion ? {\n                    opacity: 0.7\n                } : {\n                    scale: 0.9\n                },\n                transition: PRESS_SPRING,\n                className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(\"relative flex h-full w-full items-center justify-center cursor-pointer\", isPending && \"opacity-70\"),\n                children: [\n                    (isActive || isPending) && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.div, {\n                        layoutId: \"dock-active-highlight\",\n                        className: \"absolute inset-0 rounded-full bg-foreground/10\",\n                        transition: {\n                            type: \"spring\",\n                            bounce: 0.15,\n                            duration: 0.5\n                        }\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 93,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(\"relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-150\", isActive ? \"text-foreground\" : \"text-muted-foreground hover:text-foreground\"),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Icon, {\n                            size: 20,\n                            strokeWidth: 2\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                            lineNumber: 106,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 100,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                lineNumber: 79,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_15__.AnimatePresence, {\n                children: hovered && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_14__.motion.span, {\n                    initial: shouldReduceMotion ? {\n                        opacity: 0\n                    } : {\n                        opacity: 0,\n                        scale: 0.85,\n                        y: 4\n                    },\n                    animate: shouldReduceMotion ? {\n                        opacity: 1\n                    } : {\n                        opacity: 1,\n                        scale: 1,\n                        y: 0\n                    },\n                    exit: shouldReduceMotion ? {\n                        opacity: 0,\n                        transition: {\n                            duration: 0.12\n                        }\n                    } : {\n                        opacity: 0,\n                        scale: 0.96,\n                        y: 2,\n                        transition: {\n                            duration: 0.12,\n                            ease: [\n                                0.23,\n                                1,\n                                0.32,\n                                1\n                            ]\n                        }\n                    },\n                    transition: shouldReduceMotion ? {\n                        duration: 0.15\n                    } : {\n                        type: \"spring\",\n                        duration: 0.32,\n                        bounce: 0.22\n                    },\n                    style: {\n                        left: \"50%\",\n                        x: \"-50%\",\n                        transformOrigin: \"bottom center\"\n                    },\n                    className: \"pointer-events-none absolute bottom-[60px] z-20 whitespace-nowrap rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg backdrop-blur-sm\",\n                    children: label\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 113,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                lineNumber: 111,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n        lineNumber: 69,\n        columnNumber: 5\n    }, this);\n}\nfunction AppDock() {\n    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();\n    const shouldReduceMotion = (0,framer_motion__WEBPACK_IMPORTED_MODULE_13__.useReducedMotion)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n        \"aria-label\": \"Primary\",\n        className: \"fixed inset-x-0 bottom-6 z-50 flex justify-center px-4\",\n        style: {\n            paddingBottom: \"env(safe-area-inset-bottom)\"\n        },\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.Dock, {\n            direction: \"bottom\",\n            disableMagnification: Boolean(shouldReduceMotion),\n            children: [\n                homeGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 170,\n                        columnNumber: 11\n                    }, this)),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockDivider, {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 173,\n                    columnNumber: 9\n                }, this),\n                workspaceGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 176,\n                        columnNumber: 11\n                    }, this)),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_dock__WEBPACK_IMPORTED_MODULE_3__.DockDivider, {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                    lineNumber: 179,\n                    columnNumber: 9\n                }, this),\n                systemGroup.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AppDockIcon, {\n                        ...item,\n                        isActive: isPathActive(pathname, item.href)\n                    }, item.href, false, {\n                        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n                        lineNumber: 182,\n                        columnNumber: 11\n                    }, this))\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n            lineNumber: 165,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Tanush\\\\Desktop\\\\Coding\\\\Smartli V2\\\\components\\\\navigation\\\\app-dock.tsx\",\n        lineNumber: 155,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9jb21wb25lbnRzL25hdmlnYXRpb24vYXBwLWRvY2sudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWdEO0FBRVM7QUFDaUI7QUFXcEQ7QUFDNkM7QUFDbEM7QUFRakMsTUFBTW1CLFlBQXVCO0lBQUM7UUFBRUMsTUFBTTtRQUFLQyxPQUFPO1FBQVFDLE1BQU1mLHNKQUFJQTtJQUFDO0NBQUU7QUFFdkUsTUFBTWdCLGlCQUE0QjtJQUNoQztRQUFFSCxNQUFNO1FBQU9DLE9BQU87UUFBTUMsTUFBTWQsc0pBQVFBO0lBQUM7SUFDM0M7UUFBRVksTUFBTTtRQUFVQyxPQUFPO1FBQWFDLE1BQU1iLHNKQUFLQTtJQUFDO0lBQ2xEO1FBQUVXLE1BQU07UUFBVUMsT0FBTztRQUFTQyxNQUFNWixzSkFBVUE7SUFBQztJQUNuRDtRQUFFVSxNQUFNO1FBQWNDLE9BQU87UUFBYUMsTUFBTVgsc0pBQVVBO0lBQUM7Q0FDNUQ7QUFFRCxNQUFNYSxjQUF5QjtJQUM3QjtRQUFFSixNQUFNO1FBQVNDLE9BQU87UUFBUUMsTUFBTVYsdUpBQVlBO0lBQUM7SUFDbkQ7UUFBRVEsTUFBTTtRQUFhQyxPQUFPO1FBQVlDLE1BQU1ULHVKQUFRQTtJQUFDO0lBQ3ZEO1FBQUVPLE1BQU07UUFBWUMsT0FBTztRQUFXQyxNQUFNUix1SkFBVUE7SUFBQztDQUN4RDtBQUVELFNBQVNXLGFBQWFDLFFBQWdCLEVBQUVOLElBQVk7SUFDbEQsSUFBSUEsU0FBUyxLQUFLLE9BQU9NLGFBQWE7SUFDdEMsT0FBT0EsYUFBYU4sUUFBUU0sU0FBU0MsVUFBVSxDQUFDLENBQUMsRUFBRVAsS0FBSyxDQUFDLENBQUM7QUFDNUQ7QUFFQSx3REFBd0Q7QUFDeEQsMkVBQTJFO0FBQzNFLE1BQU1RLGVBQWU7SUFBRUMsTUFBTTtJQUFVQyxXQUFXO0lBQUtDLFNBQVM7SUFBSUMsTUFBTTtBQUFFO0FBRTVFLFNBQVNDLFlBQVksRUFBRWIsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLE1B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LDhEQUFDSCw0REFBV0E7Ozs7O2dCQUVYTSxlQUFld0QsR0FBRyxDQUFDLENBQUNDLHFCQUNuQiw4REFBQy9DO3dCQUE2QixHQUFHK0MsSUFBSTt3QkFBRTdDLFVBQVVWLGFBQWFDLFVBQVVzRCxLQUFLNUQsSUFBSTt1QkFBL0Q0RCxLQUFLNUQsSUFBSTs7Ozs7OEJBRzdCLDhEQUFDSCw0REFBV0E7Ozs7O2dCQUVYTyxZQUFZdUQsR0FBRyxDQUFDLENBQUNDLHFCQUNoQiw4REFBQy9DO3dCQUE2QixHQUFHK0MsSUFBSTt3QkFBRTdDLFVBQVVWLGFBQWFDLFVBQVVzRCxLQUFLNUQsSUFBSTt1QkFBL0Q0RCxLQUFLNUQsSUFBSTs7Ozs7Ozs7Ozs7Ozs7OztBQUtyQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NtYXJ0bGkvLi9jb21wb25lbnRzL25hdmlnYXRpb24vYXBwLWRvY2sudHN4P2UyODIiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVRyYW5zaXRpb24gfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcbmltcG9ydCB7IHVzZVBhdGhuYW1lLCB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBbmltYXRlUHJlc2VuY2UsIG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ2ZyYW1lci1tb3Rpb24nO1xyXG5pbXBvcnQge1xyXG4gIEhvbWUsXHJcbiAgU3BhcmtsZXMsXHJcbiAgVGltZXIsXHJcbiAgTGlzdENoZWNrcyxcclxuICBUcmVuZGluZ1VwLFxyXG4gIENhbGVuZGFyRGF5cyxcclxuICBTZXR0aW5ncyxcclxuICBVc2VyQ2lyY2xlLFxyXG4gIHR5cGUgTHVjaWRlSWNvbixcclxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xyXG5pbXBvcnQgeyBEb2NrLCBEb2NrSWNvbiwgRG9ja0RpdmlkZXIgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvZG9jayc7XHJcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC9saWIvdXRpbHMnO1xyXG5cclxuaW50ZXJmYWNlIE5hdkl0ZW0ge1xyXG4gIGhyZWY6IHN0cmluZztcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb246IEx1Y2lkZUljb247XHJcbn1cclxuXHJcbmNvbnN0IGhvbWVHcm91cDogTmF2SXRlbVtdID0gW3sgaHJlZjogJy8nLCBsYWJlbDogJ0hvbWUnLCBpY29uOiBIb21lIH1dO1xyXG5cclxuY29uc3Qgd29ya3NwYWNlR3JvdXA6IE5hdkl0ZW1bXSA9IFtcclxuICB7IGhyZWY6ICcvYWknLCBsYWJlbDogJ0FJJywgaWNvbjogU3BhcmtsZXMgfSxcclxuICB7IGhyZWY6ICcvZm9jdXMnLCBsYWJlbDogJ0ZvY3VzIEh1YicsIGljb246IFRpbWVyIH0sXHJcbiAgeyBocmVmOiAnL3Rhc2tzJywgbGFiZWw6ICdUYXNrcycsIGljb246IExpc3RDaGVja3MgfSxcclxuICB7IGhyZWY6ICcvYW5hbHl0aWNzJywgbGFiZWw6ICdBbmFseXRpY3MnLCBpY29uOiBUcmVuZGluZ1VwIH0sXHJcbl07XHJcblxyXG5jb25zdCBzeXN0ZW1Hcm91cDogTmF2SXRlbVtdID0gW1xyXG4gIHsgaHJlZjogJy9wbGFuJywgbGFiZWw6ICdQbGFuJywgaWNvbjogQ2FsZW5kYXJEYXlzIH0sXHJcbiAgeyBocmVmOiAnL3NldHRpbmdzJywgbGFiZWw6ICdTZXR0aW5ncycsIGljb246IFNldHRpbmdzIH0sXHJcbiAgeyBocmVmOiAnL2FjY291bnQnLCBsYWJlbDogJ0FjY291bnQnLCBpY29uOiBVc2VyQ2lyY2xlIH0sXHJcbl07XHJcblxyXG5mdW5jdGlvbiBpc1BhdGhBY3RpdmUocGF0aG5hbWU6IHN0cmluZywgaHJlZjogc3RyaW5nKSB7XHJcbiAgaWYgKGhyZWYgPT09ICcvJykgcmV0dXJuIHBhdGhuYW1lID09PSAnLyc7XHJcbiAgcmV0dXJuIHBhdGhuYW1lID09PSBocmVmIHx8IHBhdGhuYW1lLnN0YXJ0c1dpdGgoYCR7aHJlZn0vYCk7XHJcbn1cclxuXHJcbi8vIFNwcmluZyBjb25maWcgZm9yIHRoZSBwcmVzcy1kb3duIC8gcmVsZWFzZSBhbmltYXRpb24uXHJcbi8vIM62IOKJiCAwLjc1IOKGkiBzbGlnaHRseSB1bmRlcmRhbXBlZCBzbyB0aGUgcmVsZWFzZSBoYXMgYSBzbWFsbCBwaHlzaWNhbCBwb3AuXHJcbmNvbnN0IFBSRVNTX1NQUklORyA9IHsgdHlwZTogJ3NwcmluZycsIHN0aWZmbmVzczogNDAwLCBkYW1waW5nOiAzMCwgbWFzczogMSB9IGFzIGNvbnN0O1xyXG5cclxuZnVuY3Rpb24gQXBwRG9ja0ljb24oeyBocmVmLCBsYWJlbCwgaWNvbjogSWNvbiwgaXNBY3RpdmUgfTogTmF2SXRlbSAmIHsgaXNBY3RpdmU6IGJvb2xlYW4gfSkge1xyXG4gIGNvbnN0IFtob3ZlcmVkLCBzZXRIb3ZlcmVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaXNQZW5kaW5nLCBzdGFydFRyYW5zaXRpb25dID0gdXNlVHJhbnNpdGlvbigpO1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gIGNvbnN0IHNob3VsZFJlZHVjZU1vdGlvbiA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlTmF2aWdhdGUgPSAoZTogUmVhY3QuTW91c2VFdmVudCkgPT4ge1xyXG4gICAgLy8gU3RhbmRhcmQgTmV4dC5qcyBMaW5rIGJlaGF2aW9yIGlzIG9uIHJlbGVhc2UgKGNsaWNrKS5cclxuICAgIC8vIEZsdWlkIGludGVyZmFjZXMgcmVzcG9uZCBvbiBwcmVzcy1kb3duIG9yIGltbWVkaWF0ZWx5IG9uIGNsaWNrLlxyXG4gICAgLy8gV2UnbGwgdXNlIHVzZVRyYW5zaXRpb24gdG8gcHJpb3JpdGl6ZSB0aGUgVUkgZmVlZGJhY2sgKGFjdGl2ZSBzdGF0ZSkgXHJcbiAgICAvLyBvdmVyIHRoZSBoZWF2eSBwYWdlLWxvYWRpbmcgdHJhbnNpdGlvbi5cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHN0YXJ0VHJhbnNpdGlvbigoKSA9PiB7XHJcbiAgICAgIHJvdXRlci5wdXNoKGhyZWYpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxEb2NrSWNvblxyXG4gICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyZWQodHJ1ZSl9XHJcbiAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXJlZChmYWxzZSl9XHJcbiAgICAgIG9uRm9jdXM9eygpID0+IHNldEhvdmVyZWQodHJ1ZSl9XHJcbiAgICAgIG9uQmx1cj17KCkgPT4gc2V0SG92ZXJlZChmYWxzZSl9XHJcbiAgICA+XHJcbiAgICAgIHsvKlxyXG4gICAgICAgKiBQcmVzcyBhbmltYXRpb24gd3JhcHBlciDigJQgc2NhbGVzIG9ubHkgdGhlIGljb24gKyBhY3RpdmUgcGlsbCwgTk9UIHRoZSB0b29sdGlwLlxyXG4gICAgICAgKiBSZWR1Y2VkIG1vdGlvbjogc3dhcCB0cmFuc2Zvcm0gZm9yIGEgZ2VudGxlciBvcGFjaXR5IGRpcC5cclxuICAgICAgICovfVxyXG4gICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgIG9uUG9pbnRlckRvd249e2hhbmRsZU5hdmlnYXRlfVxyXG4gICAgICAgIHdoaWxlVGFwPXtcclxuICAgICAgICAgIHNob3VsZFJlZHVjZU1vdGlvblxyXG4gICAgICAgICAgICA/IHsgb3BhY2l0eTogMC43IH1cclxuICAgICAgICAgICAgOiB7IHNjYWxlOiAwLjkgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cmFuc2l0aW9uPXtQUkVTU19TUFJJTkd9XHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgIFwicmVsYXRpdmUgZmxleCBoLWZ1bGwgdy1mdWxsIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBjdXJzb3ItcG9pbnRlclwiLFxyXG4gICAgICAgICAgaXNQZW5kaW5nICYmIFwib3BhY2l0eS03MFwiXHJcbiAgICAgICAgKX1cclxuICAgICAgPlxyXG4gICAgICAgIHsoaXNBY3RpdmUgfHwgaXNQZW5kaW5nKSAmJiAoXHJcbiAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICBsYXlvdXRJZD1cImRvY2stYWN0aXZlLWhpZ2hsaWdodFwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcm91bmRlZC1mdWxsIGJnLWZvcmVncm91bmQvMTBcIlxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IHR5cGU6ICdzcHJpbmcnLCBib3VuY2U6IDAuMTUsIGR1cmF0aW9uOiAwLjUgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKX1cclxuXHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbihcclxuICAgICAgICAgICAgJ3JlbGF0aXZlIGZsZXggaC1mdWxsIHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTE1MCcsXHJcbiAgICAgICAgICAgIGlzQWN0aXZlID8gJ3RleHQtZm9yZWdyb3VuZCcgOiAndGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGhvdmVyOnRleHQtZm9yZWdyb3VuZCdcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPEljb24gc2l6ZT17MjB9IHN0cm9rZVdpZHRoPXsyfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L21vdGlvbi5kaXY+XHJcblxyXG4gICAgICB7LyogVG9vbHRpcCDigJQgc2libGluZyBvZiB0aGUgcHJlc3Mgd3JhcHBlciwgc28gaXQgaXMgdW5hZmZlY3RlZCBieSB3aGlsZVRhcCAqL31cclxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cclxuICAgICAgICB7aG92ZXJlZCAmJiAoXHJcbiAgICAgICAgICA8bW90aW9uLnNwYW5cclxuICAgICAgICAgICAgaW5pdGlhbD17XHJcbiAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlTW90aW9uXHJcbiAgICAgICAgICAgICAgICA/IHsgb3BhY2l0eTogMCB9XHJcbiAgICAgICAgICAgICAgICA6IHsgb3BhY2l0eTogMCwgc2NhbGU6IDAuODUsIHk6IDQgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuaW1hdGU9e1xyXG4gICAgICAgICAgICAgIHNob3VsZFJlZHVjZU1vdGlvblxyXG4gICAgICAgICAgICAgICAgPyB7IG9wYWNpdHk6IDEgfVxyXG4gICAgICAgICAgICAgICAgOiB7IG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5OiAwIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBleGl0PXtcclxuICAgICAgICAgICAgICBzaG91bGRSZWR1Y2VNb3Rpb25cclxuICAgICAgICAgICAgICAgID8geyBvcGFjaXR5OiAwLCB0cmFuc2l0aW9uOiB7IGR1cmF0aW9uOiAwLjEyIH0gfVxyXG4gICAgICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC45NixcclxuICAgICAgICAgICAgICAgICAgICB5OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHsgZHVyYXRpb246IDAuMTIsIGVhc2U6IFswLjIzLCAxLCAwLjMyLCAxXSB9LFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJhbnNpdGlvbj17XHJcbiAgICAgICAgICAgICAgc2hvdWxkUmVkdWNlTW90aW9uXHJcbiAgICAgICAgICAgICAgICA/IHsgZHVyYXRpb246IDAuMTUgfVxyXG4gICAgICAgICAgICAgICAgOiB7IHR5cGU6ICdzcHJpbmcnLCBkdXJhdGlvbjogMC4zMiwgYm91bmNlOiAwLjIyIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHlsZT17eyBsZWZ0OiAnNTAlJywgeDogJy01MCUnLCB0cmFuc2Zvcm1PcmlnaW46ICdib3R0b20gY2VudGVyJyB9fVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGJvdHRvbS1bNjBweF0gei0yMCB3aGl0ZXNwYWNlLW5vd3JhcCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItYm9yZGVyLzYwIGJnLXBvcG92ZXIvOTUgcHgtMi41IHB5LTEgdGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtcG9wb3Zlci1mb3JlZ3JvdW5kIHNoYWRvdy1sZyBiYWNrZHJvcC1ibHVyLXNtXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2xhYmVsfVxyXG4gICAgICAgICAgPC9tb3Rpb24uc3Bhbj5cclxuICAgICAgICApfVxyXG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuICAgIDwvRG9ja0ljb24+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcERvY2soKSB7XHJcbiAgY29uc3QgcGF0aG5hbWUgPSB1c2VQYXRobmFtZSgpO1xyXG4gIGNvbnN0IHNob3VsZFJlZHVjZU1vdGlvbiA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxuYXZcclxuICAgICAgYXJpYS1sYWJlbD1cIlByaW1hcnlcIlxyXG4gICAgICBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC14LTAgYm90dG9tLTYgei01MCBmbGV4IGp1c3RpZnktY2VudGVyIHB4LTRcIlxyXG4gICAgICBzdHlsZT17eyBwYWRkaW5nQm90dG9tOiAnZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pJyB9fVxyXG4gICAgPlxyXG4gICAgICB7LypcclxuICAgICAgICogZGlyZWN0aW9uPVwiYm90dG9tXCIg4oaSIGljb25zIGFyZSBib3R0b20tYWxpZ25lZCBpbnNpZGUgdGhlIGF1dG8taGVpZ2h0IGRvY2suXHJcbiAgICAgICAqIFdoZW4gYSBuZWFyYnkgaWNvbiBtYWduaWZpZXMgKDQw4oaSNzJweCkgaXQgZ3Jvd3MgVVBXQVJELCBleHBhbmRpbmcgdGhhdFxyXG4gICAgICAgKiBzZWN0aW9uIG9mIHRoZSBkb2NrIHZpc3VhbGx5IHdoaWxlIHRoZSBkb2NrJ3MgYm90dG9tIGVkZ2Ugc3RheXMgYW5jaG9yZWQuXHJcbiAgICAgICAqL31cclxuICAgICAgPERvY2tcclxuICAgICAgICBkaXJlY3Rpb249XCJib3R0b21cIlxyXG4gICAgICAgIGRpc2FibGVNYWduaWZpY2F0aW9uPXtCb29sZWFuKHNob3VsZFJlZHVjZU1vdGlvbil9XHJcbiAgICAgID5cclxuICAgICAgICB7aG9tZUdyb3VwLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgPEFwcERvY2tJY29uIGtleT17aXRlbS5ocmVmfSB7Li4uaXRlbX0gaXNBY3RpdmU9e2lzUGF0aEFjdGl2ZShwYXRobmFtZSwgaXRlbS5ocmVmKX0gLz5cclxuICAgICAgICApKX1cclxuXHJcbiAgICAgICAgPERvY2tEaXZpZGVyIC8+XHJcblxyXG4gICAgICAgIHt3b3Jrc3BhY2VHcm91cC5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgIDxBcHBEb2NrSWNvbiBrZXk9e2l0ZW0uaHJlZn0gey4uLml0ZW19IGlzQWN0aXZlPXtpc1BhdGhBY3RpdmUocGF0aG5hbWUsIGl0ZW0uaHJlZil9IC8+XHJcbiAgICAgICAgKSl9XHJcblxyXG4gICAgICAgIDxEb2NrRGl2aWRlciAvPlxyXG5cclxuICAgICAgICB7c3lzdGVtR3JvdXAubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICA8QXBwRG9ja0ljb24ga2V5PXtpdGVtLmhyZWZ9IHsuLi5pdGVtfSBpc0FjdGl2ZT17aXNQYXRoQWN0aXZlKHBhdGhuYW1lLCBpdGVtLmhyZWYpfSAvPlxyXG4gICAgICAgICkpfVxyXG4gICAgICA8L0RvY2s+XHJcbiAgICA8L25hdj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZVRyYW5zaXRpb24iLCJ1c2VQYXRobmFtZSIsInVzZVJvdXRlciIsIkFuaW1hdGVQcmVzZW5jZSIsIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJIb21lIiwiU3BhcmtsZXMiLCJUaW1lciIsIkxpc3RDaGVja3MiLCJUcmVuZGluZ1VwIiwiQ2FsZW5kYXJEYXlzIiwiU2V0dGluZ3MiLCJVc2VyQ2lyY2xlIiwiRG9jayIsIkRvY2tJY29uIiwiRG9ja0RpdmlkZXIiLCJjbiIsImhvbWVHcm91cCIsImhyZWYiLCJsYWJlbCIsImljb24iLCJ3b3Jrc3BhY2VHcm91cCIsInN5c3RlbUdyb3VwIiwiaXNQYXRoQWN0aXZlIiwicGF0aG5hbWUiLCJzdGFydHNXaXRoIiwiUFJFU1NfU1BSSU5HIiwidHlwZSIsInN0aWZmbmVzcyIsImRhbXBpbmciLCJtYXNzIiwiQXBwRG9ja0ljb24iLCJJY29uIiwiaXNBY3RpdmUiLCJob3ZlcmVkIiwic2V0SG92ZXJlZCIsImlzUGVuZGluZyIsInN0YXJ0VHJhbnNpdGlvbiIsInJvdXRlciIsInNob3VsZFJlZHVjZU1vdGlvbiIsImhhbmRsZU5hdmlnYXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwicHVzaCIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsIm9uRm9jdXMiLCJvbkJsdXIiLCJkaXYiLCJvblBvaW50ZXJEb3duIiwid2hpbGVUYXAiLCJvcGFjaXR5Iiwic2NhbGUiLCJ0cmFuc2l0aW9uIiwiY2xhc3NOYW1lIiwibGF5b3V0SWQiLCJib3VuY2UiLCJkdXJhdGlvbiIsInNpemUiLCJzdHJva2VXaWR0aCIsInNwYW4iLCJpbml0aWFsIiwieSIsImFuaW1hdGUiLCJleGl0IiwiZWFzZSIsInN0eWxlIiwibGVmdCIsIngiLCJ0cmFuc2Zvcm1PcmlnaW4iLCJBcHBEb2NrIiwibmF2IiwiYXJpYS1sYWJlbCIsInBhZGRpbmdCb3R0b20iLCJkaXJlY3Rpb24iLCJkaXNhYmxlTWFnbmlmaWNhdGlvbiIsIkJvb2xlYW4iLCJtYXAiLCJpdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./components/navigation/app-dock.tsx\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/app/page_client-reference-manifest.js#L1:1

```
globalThis.__RSC_MANIFEST=(globalThis.__RSC_MANIFEST||{});globalThis.__RSC_MANIFEST["/page"]={"moduleLoading":{"prefix":"/_next/","crossOrigin":null},"ssrModuleMapping":{"(app-pages-browser)/./app/page.tsx":{"*":{"id":"(ssr)/./app/page.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./components/navigation/app-dock.tsx":{"*":{"id":"(ssr)/./components/navigation/app-dock.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./app/template.tsx":{"*":{"id":"(ssr)/./app/template.tsx","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js":{"*":{"id":"(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":[],"async":false}},"(app-pages-browser)/./components/ai/ai-prompt-box-demo.tsx":{"*":{"id":"(ssr)/./components/ai/ai-prompt-box-demo.tsx","name":"*","chunks":[],"async":false}}},"edgeSSRModuleMapping":{},"clientModules":{"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\page.tsx":{"id":"(app-pages-browser)/./app/page.tsx","name":"*","chunks":["app/page","static/chunks/app/page.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\globals.css":{"id":"(app-pages-browser)/./app/globals.css","name":"*","chunks":["app/layout","static/chunks/app/layout.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\components\\navigation\\app-dock.tsx":{"id":"(app-pages-browser)/./components/navigation/app-dock.tsx","name":"*","chunks":["app/layout","static/chunks/app/layout.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\template.tsx":{"id":"(app-pages-browser)/./app/template.tsx","name":"*","chunks":["app/template","static/chunks/app/template.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\app-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\app-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\client-page.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\client-page.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\error-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\error-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\layout-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\layout-router.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\not-found-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\not-found-boundary.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\client\\components\\render-from-template-context.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\node_modules\\next\\dist\\esm\\client\\components\\render-from-template-context.js":{"id":"(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js","name":"*","chunks":["app-pages-internals","static/chunks/app-pages-internals.js"],"async":false},"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\components\\ai\\ai-prompt-box-demo.tsx":{"id":"(app-pages-browser)/./components/ai/ai-prompt-box-demo.tsx","name":"*","chunks":[],"async":false}},"entryCSSFiles":{"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\":[],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\page":[],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\layout":["static/css/app/layout.css"],"C:\\Users\\Tanush\\Desktop\\Coding\\Smartli V2\\app\\template":[]}}
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/vendor-chunks/framer-motion.js#L598:602

```
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VisualElementDragControls: () => (/* binding */ VisualElementDragControls),\n/* harmony export */   elementDragControls: () => (/* binding */ elementDragControls)\n/* harmony export */ });\n/* harmony import */ var motion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! motion-utils */ \"(ssr)/./node_modules/motion-utils/dist/es/index.mjs\");\n/* harmony import */ var motion_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! motion-dom */ \"(ssr)/./node_modules/motion-dom/dist/es/index.mjs\");\n/* harmony import */ var _pan_PanSession_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../pan/PanSession.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs\");\n/* harmony import */ var _utils_is_ref_object_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../utils/is-ref-object.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/is-ref-object.mjs\");\n/* harmony import */ var _events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../events/add-pointer-event.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/add-pointer-event.mjs\");\n/* harmony import */ var _utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/constraints.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs\");\n/* harmony import */ var _projection_geometry_models_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projection/geometry/models.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/projection/geometry/models.mjs\");\n/* harmony import */ var _projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../projection/utils/each-axis.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/projection/utils/each-axis.mjs\");\n/* harmony import */ var _projection_utils_measure_mjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../projection/utils/measure.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/projection/utils/measure.mjs\");\n/* harmony import */ var _events_event_info_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../events/event-info.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/event-info.mjs\");\n/* harmony import */ var _projection_geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../projection/geometry/conversion.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/projection/geometry/conversion.mjs\");\n/* harmony import */ var _events_add_dom_event_mjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../events/add-dom-event.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/add-dom-event.mjs\");\n/* harmony import */ var _projection_geometry_delta_calc_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../projection/geometry/delta-calc.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs\");\n/* harmony import */ var _utils_mix_number_mjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../utils/mix/number.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/mix/number.mjs\");\n/* harmony import */ var _value_types_numbers_units_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../value/types/numbers/units.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/value/types/numbers/units.mjs\");\n/* harmony import */ var _animation_interfaces_motion_value_mjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../animation/interfaces/motion-value.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/animation/interfaces/motion-value.mjs\");\n/* harmony import */ var _utils_get_context_window_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/get-context-window.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/get-context-window.mjs\");\n/* harmony import */ var _value_use_will_change_add_will_change_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../value/use-will-change/add-will-change.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/value/use-will-change/add-will-change.mjs\");\n/* harmony import */ var _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../frameloop/frame.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/frameloop/frame.mjs\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconst elementDragControls = new WeakMap();\n/**\n *\n */\n// let latestPointerEvent: PointerEvent\nclass VisualElementDragControls {\n    constructor(visualElement) {\n        this.openDragLock = null;\n        this.isDragging = false;\n        this.currentDirection = null;\n        this.originPoint = { x: 0, y: 0 };\n        /**\n         * The permitted boundaries of travel, in pixels.\n         */\n        this.constraints = false;\n        this.hasMutatedConstraints = false;\n        /**\n         * The per-axis resolved elastic values.\n         */\n        this.elastic = (0,_projection_geometry_models_mjs__WEBPACK_IMPORTED_MODULE_2__.createBox)();\n        this.visualElement = visualElement;\n    }\n    start(originEvent, { snapToCursor = false } = {}) {\n        /**\n         * Don't start dragging if this component is exiting\n         */\n        const { presenceContext } = this.visualElement;\n        if (presenceContext && presenceContext.isPresent === false)\n            return;\n        const onSessionStart = (event) => {\n            const { dragSnapToOrigin } = this.getProps();\n            // Stop or pause any animations on both axis values immediately. This allows the user to throw and catch\n            // the component.\n            dragSnapToOrigin ? this.pauseAnimation() : this.stopAnimation();\n            if (snapToCursor) {\n                this.snapToCursor((0,_events_event_info_mjs__WEBPACK_IMPORTED_MODULE_3__.extractEventInfo)(event).point);\n            }\n        };\n        const onStart = (event, info) => {\n            // Attempt to grab the global drag gesture lock - maybe make this part of PanSession\n            const { drag, dragPropagation, onDragStart } = this.getProps();\n            if (drag && !dragPropagation) {\n                if (this.openDragLock)\n                    this.openDragLock();\n                this.openDragLock = (0,motion_dom__WEBPACK_IMPORTED_MODULE_1__.setDragLock)(drag);\n                // If we don 't have the lock, don't start dragging\n                if (!this.openDragLock)\n                    return;\n            }\n            this.isDragging = true;\n            this.currentDirection = null;\n            this.resolveConstraints();\n            if (this.visualElement.projection) {\n                this.visualElement.projection.isAnimationBlocked = true;\n                this.visualElement.projection.target = undefined;\n            }\n            /**\n             * Record gesture origin\n             */\n            (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n                let current = this.getAxisMotionValue(axis).get() || 0;\n                /**\n                 * If the MotionValue is a percentage value convert to px\n                 */\n                if (_value_types_numbers_units_mjs__WEBPACK_IMPORTED_MODULE_5__.percent.test(current)) {\n                    const { projection } = this.visualElement;\n                    if (projection && projection.layout) {\n                        const measuredAxis = projection.layout.layoutBox[axis];\n                        if (measuredAxis) {\n                            const length = (0,_projection_geometry_delta_calc_mjs__WEBPACK_IMPORTED_MODULE_6__.calcLength)(measuredAxis);\n                            current = length * (parseFloat(current) / 100);\n                        }\n                    }\n                }\n                this.originPoint[axis] = current;\n            });\n            // Fire onDragStart event\n            if (onDragStart) {\n                _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_7__.frame.postRender(() => onDragStart(event, info));\n            }\n            (0,_value_use_will_change_add_will_change_mjs__WEBPACK_IMPORTED_MODULE_8__.addValueToWillChange)(this.visualElement, \"transform\");\n            const { animationState } = this.visualElement;\n            animationState && animationState.setActive(\"whileDrag\", true);\n        };\n        const onMove = (event, info) => {\n            // latestPointerEvent = event\n            const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag, } = this.getProps();\n            // If we didn't successfully receive the gesture lock, early return.\n            if (!dragPropagation && !this.openDragLock)\n                return;\n            const { offset } = info;\n            // Attempt to detect drag direction if directionLock is true\n            if (dragDirectionLock && this.currentDirection === null) {\n                this.currentDirection = getCurrentDirection(offset);\n                // If we've successfully set a direction, notify listener\n                if (this.currentDirection !== null) {\n                    onDirectionLock && onDirectionLock(this.currentDirection);\n                }\n                return;\n            }\n            // Update each point with the latest position\n            this.updateAxis(\"x\", info.point, offset);\n            this.updateAxis(\"y\", info.point, offset);\n            /**\n             * Ideally we would leave the renderer to fire naturally at the end of\n             * this frame but if the element is about to change layout as the result\n             * of a re-render we want to ensure the browser can read the latest\n             * bounding box to ensure the pointer and element don't fall out of sync.\n             */\n            this.visualElement.render();\n            /**\n             * This must fire after the render call as it might trigger a state\n             * change which itself might trigger a layout update.\n             */\n            onDrag && onDrag(event, info);\n        };\n        const onSessionEnd = (event, info) => this.stop(event, info);\n        const resumeAnimation = () => (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n            var _a;\n            return this.getAnimationState(axis) === \"paused\" &&\n                ((_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.play());\n        });\n        const { dragSnapToOrigin } = this.getProps();\n        this.panSession = new _pan_PanSession_mjs__WEBPACK_IMPORTED_MODULE_9__.PanSession(originEvent, {\n            onSessionStart,\n            onStart,\n            onMove,\n            onSessionEnd,\n            resumeAnimation,\n        }, {\n            transformPagePoint: this.visualElement.getTransformPagePoint(),\n            dragSnapToOrigin,\n            contextWindow: (0,_utils_get_context_window_mjs__WEBPACK_IMPORTED_MODULE_10__.getContextWindow)(this.visualElement),\n        });\n    }\n    stop(event, info) {\n        const isDragging = this.isDragging;\n        this.cancel();\n        if (!isDragging)\n            return;\n        const { velocity } = info;\n        this.startAnimation(velocity);\n        const { onDragEnd } = this.getProps();\n        if (onDragEnd) {\n            _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_7__.frame.postRender(() => onDragEnd(event, info));\n        }\n    }\n    cancel() {\n        this.isDragging = false;\n        const { projection, animationState } = this.visualElement;\n        if (projection) {\n            projection.isAnimationBlocked = false;\n        }\n        this.panSession && this.panSession.end();\n        this.panSession = undefined;\n        const { dragPropagation } = this.getProps();\n        if (!dragPropagation && this.openDragLock) {\n            this.openDragLock();\n            this.openDragLock = null;\n        }\n        animationState && animationState.setActive(\"whileDrag\", false);\n    }\n    updateAxis(axis, _point, offset) {\n        const { drag } = this.getProps();\n        // If we're not dragging this axis, do an early return.\n        if (!offset || !shouldDrag(axis, drag, this.currentDirection))\n            return;\n        const axisValue = this.getAxisMotionValue(axis);\n        let next = this.originPoint[axis] + offset[axis];\n        // Apply constraints\n        if (this.constraints && this.constraints[axis]) {\n            next = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.applyConstraints)(next, this.constraints[axis], this.elastic[axis]);\n        }\n        axisValue.set(next);\n    }\n    resolveConstraints() {\n        var _a;\n        const { dragConstraints, dragElastic } = this.getProps();\n        const layout = this.visualElement.projection &&\n            !this.visualElement.projection.layout\n            ? this.visualElement.projection.measure(false)\n            : (_a = this.visualElement.projection) === null || _a === void 0 ? void 0 : _a.layout;\n        const prevConstraints = this.constraints;\n        if (dragConstraints && (0,_utils_is_ref_object_mjs__WEBPACK_IMPORTED_MODULE_12__.isRefObject)(dragConstraints)) {\n            if (!this.constraints) {\n                this.constraints = this.resolveRefConstraints();\n            }\n        }\n        else {\n            if (dragConstraints && layout) {\n                this.constraints = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.calcRelativeConstraints)(layout.layoutBox, dragConstraints);\n            }\n            else {\n                this.constraints = false;\n            }\n        }\n        this.elastic = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.resolveDragElastic)(dragElastic);\n        /**\n         * If we're outputting to external MotionValues, we want to rebase the measured constraints\n         * from viewport-relative to component-relative.\n         */\n        if (prevConstraints !== this.constraints &&\n            layout &&\n            this.constraints &&\n            !this.hasMutatedConstraints) {\n            (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n                if (this.constraints !== false &&\n                    this.getAxisMotionValue(axis)) {\n                    this.constraints[axis] = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.rebaseAxisConstraints)(layout.layoutBox[axis], this.constraints[axis]);\n                }\n            });\n        }\n    }\n    resolveRefConstraints() {\n        const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();\n        if (!constraints || !(0,_utils_is_ref_object_mjs__WEBPACK_IMPORTED_MODULE_12__.isRefObject)(constraints))\n            return false;\n        const constraintsElement = constraints.current;\n        (0,motion_utils__WEBPACK_IMPORTED_MODULE_0__.invariant)(constraintsElement !== null, \"If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.\");\n        const { projection } = this.visualElement;\n        // TODO\n        if (!projection || !projection.layout)\n            return false;\n        const constraintsBox = (0,_projection_utils_measure_mjs__WEBPACK_IMPORTED_MODULE_13__.measurePageBox)(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());\n        let measuredConstraints = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.calcViewportConstraints)(projection.layout.layoutBox, constraintsBox);\n        /**\n         * If there's an onMeasureDragConstraints listener we call it and\n         * if different constraints are returned, set constraints to that\n         */\n        if (onMeasureDragConstraints) {\n            const userConstraints = onMeasureDragConstraints((0,_projection_geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_14__.convertBoxToBoundingBox)(measuredConstraints));\n            this.hasMutatedConstraints = !!userConstraints;\n            if (userConstraints) {\n                measuredConstraints = (0,_projection_geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_14__.convertBoundingBoxToBox)(userConstraints);\n            }\n        }\n        return measuredConstraints;\n    }\n    startAnimation(velocity) {\n        const { drag, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd, } = this.getProps();\n        const constraints = this.constraints || {};\n        const momentumAnimations = (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n            if (!shouldDrag(axis, drag, this.currentDirection)) {\n                return;\n            }\n            let transition = (constraints && constraints[axis]) || {};\n            if (dragSnapToOrigin)\n                transition = { min: 0, max: 0 };\n            /**\n             * Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame\n             * of spring animations so we should look into adding a disable spring option to `inertia`.\n             * We could do something here where we affect the `bounceStiffness` and `bounceDamping`\n             * using the value of `dragElastic`.\n             */\n            const bounceStiffness = dragElastic ? 200 : 1000000;\n            const bounceDamping = dragElastic ? 40 : 10000000;\n            const inertia = {\n                type: \"inertia\",\n                velocity: dragMomentum ? velocity[axis] : 0,\n                bounceStiffness,\n                bounceDamping,\n                timeConstant: 750,\n                restDelta: 1,\n                restSpeed: 10,\n                ...dragTransition,\n                ...transition,\n            };\n            // If we're not animating on an externally-provided `MotionValue` we can use the\n            // component's animation controls which will handle interactions with whileHover (etc),\n            // otherwise we just have to animate the `MotionValue` itself.\n            return this.startAxisValueAnimation(axis, inertia);\n        });\n        // Run all animations and then resolve the new drag constraints.\n        return Promise.all(momentumAnimations).then(onDragTransitionEnd);\n    }\n    startAxisValueAnimation(axis, transition) {\n        const axisValue = this.getAxisMotionValue(axis);\n        (0,_value_use_will_change_add_will_change_mjs__WEBPACK_IMPORTED_MODULE_8__.addValueToWillChange)(this.visualElement, axis);\n        return axisValue.start((0,_animation_interfaces_motion_value_mjs__WEBPACK_IMPORTED_MODULE_15__.animateMotionValue)(axis, axisValue, 0, transition, this.visualElement, false));\n    }\n    stopAnimation() {\n        (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => this.getAxisMotionValue(axis).stop());\n    }\n    pauseAnimation() {\n        (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => { var _a; return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.pause(); });\n    }\n    getAnimationState(axis) {\n        var _a;\n        return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.state;\n    }\n    /**\n     * Drag works differently depending on which props are provided.\n     *\n     * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.\n     * - Otherwise, we apply the delta to the x/y motion values.\n     */\n    getAxisMotionValue(axis) {\n        const dragKey = `_drag${axis.toUpperCase()}`;\n        const props = this.visualElement.getProps();\n        const externalMotionValue = props[dragKey];\n        return externalMotionValue\n            ? externalMotionValue\n            : this.visualElement.getValue(axis, (props.initial\n                ? props.initial[axis]\n                : undefined) || 0);\n    }\n    snapToCursor(point) {\n        (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n            const { drag } = this.getProps();\n            // If we're not dragging this axis, do an early return.\n            if (!shouldDrag(axis, drag, this.currentDirection))\n                return;\n            const { projection } = this.visualElement;\n            const axisValue = this.getAxisMotionValue(axis);\n            if (projection && projection.layout) {\n                const { min, max } = projection.layout.layoutBox[axis];\n                axisValue.set(point[axis] - (0,_utils_mix_number_mjs__WEBPACK_IMPORTED_MODULE_16__.mixNumber)(min, max, 0.5));\n            }\n        });\n    }\n    /**\n     * When the viewport resizes we want to check if the measured constraints\n     * have changed and, if so, reposition the element within those new constraints\n     * relative to where it was before the resize.\n     */\n    scalePositionWithinConstraints() {\n        if (!this.visualElement.current)\n            return;\n        const { drag, dragConstraints } = this.getProps();\n        const { projection } = this.visualElement;\n        if (!(0,_utils_is_ref_object_mjs__WEBPACK_IMPORTED_MODULE_12__.isRefObject)(dragConstraints) || !projection || !this.constraints)\n            return;\n        /**\n         * Stop current animations as there can be visual glitching if we try to do\n         * this mid-animation\n         */\n        this.stopAnimation();\n        /**\n         * Record the relative position of the dragged element relative to the\n         * constraints box and save as a progress value.\n         */\n        const boxProgress = { x: 0, y: 0 };\n        (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n            const axisValue = this.getAxisMotionValue(axis);\n            if (axisValue && this.constraints !== false) {\n                const latest = axisValue.get();\n                boxProgress[axis] = (0,_utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.calcOrigin)({ min: latest, max: latest }, this.constraints[axis]);\n            }\n        });\n        /**\n         * Update the layout of this element and resolve the latest drag constraints\n         */\n        const { transformTemplate } = this.visualElement.getProps();\n        this.visualElement.current.style.transform = transformTemplate\n            ? transformTemplate({}, \"\")\n            : \"none\";\n        projection.root && projection.root.updateScroll();\n        projection.updateLayout();\n        this.resolveConstraints();\n        /**\n         * For each axis, calculate the current progress of the layout axis\n         * within the new constraints.\n         */\n        (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n            if (!shouldDrag(axis, drag, null))\n                return;\n            /**\n             * Calculate a new transform based on the previous box progress\n             */\n            const axisValue = this.getAxisMotionValue(axis);\n            const { min, max } = this.constraints[axis];\n            axisValue.set((0,_utils_mix_number_mjs__WEBPACK_IMPORTED_MODULE_16__.mixNumber)(min, max, boxProgress[axis]));\n        });\n    }\n    addListeners() {\n        if (!this.visualElement.current)\n            return;\n        elementDragControls.set(this.visualElement, this);\n        const element = this.visualElement.current;\n        /**\n         * Attach a pointerdown event listener on this DOM element to initiate drag tracking.\n         */\n        const stopPointerListener = (0,_events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_17__.addPointerEvent)(element, \"pointerdown\", (event) => {\n            const { drag, dragListener = true } = this.getProps();\n            drag && dragListener && this.start(event);\n        });\n        const measureDragConstraints = () => {\n            const { dragConstraints } = this.getProps();\n            if ((0,_utils_is_ref_object_mjs__WEBPACK_IMPORTED_MODULE_12__.isRefObject)(dragConstraints) && dragConstraints.current) {\n                this.constraints = this.resolveRefConstraints();\n            }\n        };\n        const { projection } = this.visualElement;\n        const stopMeasureLayoutListener = projection.addEventListener(\"measure\", measureDragConstraints);\n        if (projection && !projection.layout) {\n            projection.root && projection.root.updateScroll();\n            projection.updateLayout();\n        }\n        _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_7__.frame.read(measureDragConstraints);\n        /**\n         * Attach a window resize listener to scale the draggable target within its defined\n         * constraints as the window resizes.\n         */\n        const stopResizeListener = (0,_events_add_dom_event_mjs__WEBPACK_IMPORTED_MODULE_18__.addDomEvent)(window, \"resize\", () => this.scalePositionWithinConstraints());\n        /**\n         * If the element's layout changes, calculate the delta and apply that to\n         * the drag gesture's origin point.\n         */\n        const stopLayoutUpdateListener = projection.addEventListener(\"didUpdate\", (({ delta, hasLayoutChanged }) => {\n            if (this.isDragging && hasLayoutChanged) {\n                (0,_projection_utils_each_axis_mjs__WEBPACK_IMPORTED_MODULE_4__.eachAxis)((axis) => {\n                    const motionValue = this.getAxisMotionValue(axis);\n                    if (!motionValue)\n                        return;\n                    this.originPoint[axis] += delta[axis].translate;\n                    motionValue.set(motionValue.get() + delta[axis].translate);\n                });\n                this.visualElement.render();\n            }\n        }));\n        return () => {\n            stopResizeListener();\n            stopPointerListener();\n            stopMeasureLayoutListener();\n            stopLayoutUpdateListener && stopLayoutUpdateListener();\n        };\n    }\n    getProps() {\n        const props = this.visualElement.getProps();\n        const { drag = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = _utils_constraints_mjs__WEBPACK_IMPORTED_MODULE_11__.defaultElastic, dragMomentum = true, } = props;\n        return {\n            ...props,\n            drag,\n            dragDirectionLock,\n            dragPropagation,\n            dragConstraints,\n            dragElastic,\n            dragMomentum,\n        };\n    }\n}\nfunction shouldDrag(direction, drag, currentDirection) {\n    return ((drag === true || drag === direction) &&\n        (currentDirection === null || currentDirection === direction));\n}\n/**\n * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower\n * than the provided threshold, return `null`.\n *\n * @param offset - The x/y offset from origin.\n * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.\n */\nfunction getCurrentDirection(offset, lockThreshold = 10) {\n    let direction = null;\n    if (Math.abs(offset.y) > lockThreshold) {\n        direction = \"y\";\n    }\n    else if (Math.abs(offset.x) > lockThreshold) {\n        direction = \"x\";\n    }\n    return direction;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2dlc3R1cmVzL2RyYWcvVmlzdWFsRWxlbWVudERyYWdDb250cm9scy5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXlDO0FBQ0E7QUFDVTtBQUNTO0FBQ1M7QUFDK0c7QUFDbkg7QUFDRDtBQUNJO0FBQ0w7QUFDNkM7QUFDL0M7QUFDUztBQUNmO0FBQ087QUFDbUI7QUFDWDtBQUNpQjtBQUNyQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwRUFBUztBQUNoQztBQUNBO0FBQ0EseUJBQXlCLHVCQUF1QixJQUFJO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx3RUFBZ0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscUNBQXFDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1REFBVztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx5RUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtRUFBTztBQUMzQiw0QkFBNEIsYUFBYTtBQUN6QztBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsK0VBQVU7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsZ0JBQWdCLHVEQUFLO0FBQ3JCO0FBQ0EsWUFBWSxnR0FBb0I7QUFDaEMsb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTBEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21hcnRsaS8uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvZ2VzdHVyZXMvZHJhZy9WaXN1YWxFbGVtZW50RHJhZ0NvbnRyb2xzLm1qcz83ZjAyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBzZXREcmFnTG9jayB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgUGFuU2Vzc2lvbiB9IGZyb20gJy4uL3Bhbi9QYW5TZXNzaW9uLm1qcyc7XG5pbXBvcnQgeyBpc1JlZk9iamVjdCB9IGZyb20gJy4uLy4uL3V0aWxzL2lzLXJlZi1vYmplY3QubWpzJztcbmltcG9ydCB7IGFkZFBvaW50ZXJFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cy9hZGQtcG9pbnRlci1ldmVudC5tanMnO1xuaW1wb3J0IHsgYXBwbHlDb25zdHJhaW50cywgY2FsY1JlbGF0aXZlQ29uc3RyYWludHMsIHJlc29sdmVEcmFnRWxhc3RpYywgcmViYXNlQXhpc0NvbnN0cmFpbnRzLCBjYWxjVmlld3BvcnRDb25zdHJhaW50cywgY2FsY09yaWdpbiwgZGVmYXVsdEVsYXN0aWMgfSBmcm9tICcuL3V0aWxzL2NvbnN0cmFpbnRzLm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVCb3ggfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL2dlb21ldHJ5L21vZGVscy5tanMnO1xuaW1wb3J0IHsgZWFjaEF4aXMgfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL3V0aWxzL2VhY2gtYXhpcy5tanMnO1xuaW1wb3J0IHsgbWVhc3VyZVBhZ2VCb3ggfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL3V0aWxzL21lYXN1cmUubWpzJztcbmltcG9ydCB7IGV4dHJhY3RFdmVudEluZm8gfSBmcm9tICcuLi8uLi9ldmVudHMvZXZlbnQtaW5mby5tanMnO1xuaW1wb3J0IHsgY29udmVydEJveFRvQm91bmRpbmdCb3gsIGNvbnZlcnRCb3VuZGluZ0JveFRvQm94IH0gZnJvbSAnLi4vLi4vcHJvamVjdGlvbi9nZW9tZXRyeS9jb252ZXJzaW9uLm1qcyc7XG5pbXBvcnQgeyBhZGREb21FdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cy9hZGQtZG9tLWV2ZW50Lm1qcyc7XG5pbXBvcnQgeyBjYWxjTGVuZ3RoIH0gZnJvbSAnLi4vLi4vcHJvamVjdGlvbi9nZW9tZXRyeS9kZWx0YS1jYWxjLm1qcyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuLi8uLi91dGlscy9taXgvbnVtYmVyLm1qcyc7XG5pbXBvcnQgeyBwZXJjZW50IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgYW5pbWF0ZU1vdGlvblZhbHVlIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL2ludGVyZmFjZXMvbW90aW9uLXZhbHVlLm1qcyc7XG5pbXBvcnQgeyBnZXRDb250ZXh0V2luZG93IH0gZnJvbSAnLi4vLi4vdXRpbHMvZ2V0LWNvbnRleHQtd2luZG93Lm1qcyc7XG5pbXBvcnQgeyBhZGRWYWx1ZVRvV2lsbENoYW5nZSB9IGZyb20gJy4uLy4uL3ZhbHVlL3VzZS13aWxsLWNoYW5nZS9hZGQtd2lsbC1jaGFuZ2UubWpzJztcbmltcG9ydCB7IGZyYW1lIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbmNvbnN0IGVsZW1lbnREcmFnQ29udHJvbHMgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKlxuICovXG4vLyBsZXQgbGF0ZXN0UG9pbnRlckV2ZW50OiBQb2ludGVyRXZlbnRcbmNsYXNzIFZpc3VhbEVsZW1lbnREcmFnQ29udHJvbHMge1xuICAgIGNvbnN0cnVjdG9yKHZpc3VhbEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5vcGVuRHJhZ0xvY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50RGlyZWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5vcmlnaW5Qb2ludCA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBlcm1pdHRlZCBib3VuZGFyaWVzIG9mIHRyYXZlbCwgaW4gcGl4ZWxzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jb25zdHJhaW50cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhc011dGF0ZWRDb25zdHJhaW50cyA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBlci1heGlzIHJlc29sdmVkIGVsYXN0aWMgdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5lbGFzdGljID0gY3JlYXRlQm94KCk7XG4gICAgICAgIHRoaXMudmlzdWFsRWxlbWVudCA9IHZpc3VhbEVsZW1lbnQ7XG4gICAgfVxuICAgIHN0YXJ0KG9yaWdpbkV2ZW50LCB7IHNuYXBUb0N1cnNvciA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogRG9uJ3Qgc3RhcnQgZHJhZ2dpbmcgaWYgdGhpcyBjb21wb25lbnQgaXMgZXhpdGluZ1xuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgeyBwcmVzZW5jZUNvbnRleHQgfSA9IHRoaXMudmlzdWFsRWxlbWVudDtcbiAgICAgICAgaWYgKHByZXNlbmNlQ29udGV4dCAmJiBwcmVzZW5jZUNvbnRleHQuaXNQcmVzZW50ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3Qgb25TZXNzaW9uU3RhcnQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZHJhZ1NuYXBUb09yaWdpbiB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgICAgICAgICAgLy8gU3RvcCBvciBwYXVzZSBhbnkgYW5pbWF0aW9ucyBvbiBib3RoIGF4aXMgdmFsdWVzIGltbWVkaWF0ZWx5LiBUaGlzIGFsbG93cyB0aGUgdXNlciB0byB0aHJvdyBhbmQgY2F0Y2hcbiAgICAgICAgICAgIC8vIHRoZSBjb21wb25lbnQuXG4gICAgICAgICAgICBkcmFnU25hcFRvT3JpZ2luID8gdGhpcy5wYXVzZUFuaW1hdGlvbigpIDogdGhpcy5zdG9wQW5pbWF0aW9uKCk7XG4gICAgICAgICAgICBpZiAoc25hcFRvQ3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwVG9DdXJzb3IoZXh0cmFjdEV2ZW50SW5mbyhldmVudCkucG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvblN0YXJ0ID0gKGV2ZW50LCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGdyYWIgdGhlIGdsb2JhbCBkcmFnIGdlc3R1cmUgbG9jayAtIG1heWJlIG1ha2UgdGhpcyBwYXJ0IG9mIFBhblNlc3Npb25cbiAgICAgICAgICAgIGNvbnN0IHsgZHJhZywgZHJhZ1Byb3BhZ2F0aW9uLCBvbkRyYWdTdGFydCB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgICAgICAgICAgaWYgKGRyYWcgJiYgIWRyYWdQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wZW5EcmFnTG9jaylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRHJhZ0xvY2soKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5EcmFnTG9jayA9IHNldERyYWdMb2NrKGRyYWcpO1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIGRvbiAndCBoYXZlIHRoZSBsb2NrLCBkb24ndCBzdGFydCBkcmFnZ2luZ1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcGVuRHJhZ0xvY2spXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREaXJlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ29uc3RyYWludHMoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc3VhbEVsZW1lbnQucHJvamVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uLmlzQW5pbWF0aW9uQmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxFbGVtZW50LnByb2plY3Rpb24udGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZWNvcmQgZ2VzdHVyZSBvcmlnaW5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZWFjaEF4aXMoKGF4aXMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuZ2V0QXhpc01vdGlvblZhbHVlKGF4aXMpLmdldCgpIHx8IDA7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhlIE1vdGlvblZhbHVlIGlzIGEgcGVyY2VudGFnZSB2YWx1ZSBjb252ZXJ0IHRvIHB4XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQudGVzdChjdXJyZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByb2plY3Rpb24gfSA9IHRoaXMudmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb24gJiYgcHJvamVjdGlvbi5sYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lYXN1cmVkQXhpcyA9IHByb2plY3Rpb24ubGF5b3V0LmxheW91dEJveFtheGlzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZWFzdXJlZEF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBjYWxjTGVuZ3RoKG1lYXN1cmVkQXhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGxlbmd0aCAqIChwYXJzZUZsb2F0KGN1cnJlbnQpIC8gMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpblBvaW50W2F4aXNdID0gY3VycmVudDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gRmlyZSBvbkRyYWdTdGFydCBldmVudFxuICAgICAgICAgICAgaWYgKG9uRHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgICAgZnJhbWUucG9zdFJlbmRlcigoKSA9PiBvbkRyYWdTdGFydChldmVudCwgaW5mbykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkVmFsdWVUb1dpbGxDaGFuZ2UodGhpcy52aXN1YWxFbGVtZW50LCBcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgICAgIGNvbnN0IHsgYW5pbWF0aW9uU3RhdGUgfSA9IHRoaXMudmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgIGFuaW1hdGlvblN0YXRlICYmIGFuaW1hdGlvblN0YXRlLnNldEFjdGl2ZShcIndoaWxlRHJhZ1wiLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25Nb3ZlID0gKGV2ZW50LCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAvLyBsYXRlc3RQb2ludGVyRXZlbnQgPSBldmVudFxuICAgICAgICAgICAgY29uc3QgeyBkcmFnUHJvcGFnYXRpb24sIGRyYWdEaXJlY3Rpb25Mb2NrLCBvbkRpcmVjdGlvbkxvY2ssIG9uRHJhZywgfSA9IHRoaXMuZ2V0UHJvcHMoKTtcbiAgICAgICAgICAgIC8vIElmIHdlIGRpZG4ndCBzdWNjZXNzZnVsbHkgcmVjZWl2ZSB0aGUgZ2VzdHVyZSBsb2NrLCBlYXJseSByZXR1cm4uXG4gICAgICAgICAgICBpZiAoIWRyYWdQcm9wYWdhdGlvbiAmJiAhdGhpcy5vcGVuRHJhZ0xvY2spXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgeyBvZmZzZXQgfSA9IGluZm87XG4gICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGRldGVjdCBkcmFnIGRpcmVjdGlvbiBpZiBkaXJlY3Rpb25Mb2NrIGlzIHRydWVcbiAgICAgICAgICAgIGlmIChkcmFnRGlyZWN0aW9uTG9jayAmJiB0aGlzLmN1cnJlbnREaXJlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREaXJlY3Rpb24gPSBnZXRDdXJyZW50RGlyZWN0aW9uKG9mZnNldCk7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UndmUgc3VjY2Vzc2Z1bGx5IHNldCBhIGRpcmVjdGlvbiwgbm90aWZ5IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudERpcmVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvbkRpcmVjdGlvbkxvY2sgJiYgb25EaXJlY3Rpb25Mb2NrKHRoaXMuY3VycmVudERpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBlYWNoIHBvaW50IHdpdGggdGhlIGxhdGVzdCBwb3NpdGlvblxuICAgICAgICAgICAgdGhpcy51cGRhdGVBeGlzKFwieFwiLCBpbmZvLnBvaW50LCBvZmZzZXQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBeGlzKFwieVwiLCBpbmZvLnBvaW50LCBvZmZzZXQpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZGVhbGx5IHdlIHdvdWxkIGxlYXZlIHRoZSByZW5kZXJlciB0byBmaXJlIG5hdHVyYWxseSBhdCB0aGUgZW5kIG9mXG4gICAgICAgICAgICAgKiB0aGlzIGZyYW1lIGJ1dCBpZiB0aGUgZWxlbWVudCBpcyBhYm91dCB0byBjaGFuZ2UgbGF5b3V0IGFzIHRoZSByZXN1bHRcbiAgICAgICAgICAgICAqIG9mIGEgcmUtcmVuZGVyIHdlIHdhbnQgdG8gZW5zdXJlIHRoZSBicm93c2VyIGNhbiByZWFkIHRoZSBsYXRlc3RcbiAgICAgICAgICAgICAqIGJvdW5kaW5nIGJveCB0byBlbnN1cmUgdGhlIHBvaW50ZXIgYW5kIGVsZW1lbnQgZG9uJ3QgZmFsbCBvdXQgb2Ygc3luYy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy52aXN1YWxFbGVtZW50LnJlbmRlcigpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGlzIG11c3QgZmlyZSBhZnRlciB0aGUgcmVuZGVyIGNhbGwgYXMgaXQgbWlnaHQgdHJpZ2dlciBhIHN0YXRlXG4gICAgICAgICAgICAgKiBjaGFuZ2Ugd2hpY2ggaXRzZWxmIG1pZ2h0IHRyaWdnZXIgYSBsYXlvdXQgdXBkYXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvbkRyYWcgJiYgb25EcmFnKGV2ZW50LCBpbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25TZXNzaW9uRW5kID0gKGV2ZW50LCBpbmZvKSA9PiB0aGlzLnN0b3AoZXZlbnQsIGluZm8pO1xuICAgICAgICBjb25zdCByZXN1bWVBbmltYXRpb24gPSAoKSA9PiBlYWNoQXhpcygoYXhpcykgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUoYXhpcykgPT09IFwicGF1c2VkXCIgJiZcbiAgICAgICAgICAgICAgICAoKF9hID0gdGhpcy5nZXRBeGlzTW90aW9uVmFsdWUoYXhpcykuYW5pbWF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGxheSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHsgZHJhZ1NuYXBUb09yaWdpbiB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgICAgICB0aGlzLnBhblNlc3Npb24gPSBuZXcgUGFuU2Vzc2lvbihvcmlnaW5FdmVudCwge1xuICAgICAgICAgICAgb25TZXNzaW9uU3RhcnQsXG4gICAgICAgICAgICBvblN0YXJ0LFxuICAgICAgICAgICAgb25Nb3ZlLFxuICAgICAgICAgICAgb25TZXNzaW9uRW5kLFxuICAgICAgICAgICAgcmVzdW1lQW5pbWF0aW9uLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1QYWdlUG9pbnQ6IHRoaXMudmlzdWFsRWxlbWVudC5nZXRUcmFuc2Zvcm1QYWdlUG9pbnQoKSxcbiAgICAgICAgICAgIGRyYWdTbmFwVG9PcmlnaW4sXG4gICAgICAgICAgICBjb250ZXh0V2luZG93OiBnZXRDb250ZXh0V2luZG93KHRoaXMudmlzdWFsRWxlbWVudCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdG9wKGV2ZW50LCBpbmZvKSB7XG4gICAgICAgIGNvbnN0IGlzRHJhZ2dpbmcgPSB0aGlzLmlzRHJhZ2dpbmc7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIGlmICghaXNEcmFnZ2luZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgeyB2ZWxvY2l0eSB9ID0gaW5mbztcbiAgICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbih2ZWxvY2l0eSk7XG4gICAgICAgIGNvbnN0IHsgb25EcmFnRW5kIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgICAgIGlmIChvbkRyYWdFbmQpIHtcbiAgICAgICAgICAgIGZyYW1lLnBvc3RSZW5kZXIoKCkgPT4gb25EcmFnRW5kKGV2ZW50LCBpbmZvKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2FuY2VsKCkge1xuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0aW9uLCBhbmltYXRpb25TdGF0ZSB9ID0gdGhpcy52aXN1YWxFbGVtZW50O1xuICAgICAgICBpZiAocHJvamVjdGlvbikge1xuICAgICAgICAgICAgcHJvamVjdGlvbi5pc0FuaW1hdGlvbkJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhblNlc3Npb24gJiYgdGhpcy5wYW5TZXNzaW9uLmVuZCgpO1xuICAgICAgICB0aGlzLnBhblNlc3Npb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHsgZHJhZ1Byb3BhZ2F0aW9uIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgICAgIGlmICghZHJhZ1Byb3BhZ2F0aW9uICYmIHRoaXMub3BlbkRyYWdMb2NrKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5EcmFnTG9jaygpO1xuICAgICAgICAgICAgdGhpcy5vcGVuRHJhZ0xvY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGFuaW1hdGlvblN0YXRlICYmIGFuaW1hdGlvblN0YXRlLnNldEFjdGl2ZShcIndoaWxlRHJhZ1wiLCBmYWxzZSk7XG4gICAgfVxuICAgIHVwZGF0ZUF4aXMoYXhpcywgX3BvaW50LCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgeyBkcmFnIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgICAgIC8vIElmIHdlJ3JlIG5vdCBkcmFnZ2luZyB0aGlzIGF4aXMsIGRvIGFuIGVhcmx5IHJldHVybi5cbiAgICAgICAgaWYgKCFvZmZzZXQgfHwgIXNob3VsZERyYWcoYXhpcywgZHJhZywgdGhpcy5jdXJyZW50RGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgYXhpc1ZhbHVlID0gdGhpcy5nZXRBeGlzTW90aW9uVmFsdWUoYXhpcyk7XG4gICAgICAgIGxldCBuZXh0ID0gdGhpcy5vcmlnaW5Qb2ludFtheGlzXSArIG9mZnNldFtheGlzXTtcbiAgICAgICAgLy8gQXBwbHkgY29uc3RyYWludHNcbiAgICAgICAgaWYgKHRoaXMuY29uc3RyYWludHMgJiYgdGhpcy5jb25zdHJhaW50c1theGlzXSkge1xuICAgICAgICAgICAgbmV4dCA9IGFwcGx5Q29uc3RyYWludHMobmV4dCwgdGhpcy5jb25zdHJhaW50c1theGlzXSwgdGhpcy5lbGFzdGljW2F4aXNdKTtcbiAgICAgICAgfVxuICAgICAgICBheGlzVmFsdWUuc2V0KG5leHQpO1xuICAgIH1cbiAgICByZXNvbHZlQ29uc3RyYWludHMoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgeyBkcmFnQ29uc3RyYWludHMsIGRyYWdFbGFzdGljIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMudmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uICYmXG4gICAgICAgICAgICAhdGhpcy52aXN1YWxFbGVtZW50LnByb2plY3Rpb24ubGF5b3V0XG4gICAgICAgICAgICA/IHRoaXMudmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uLm1lYXN1cmUoZmFsc2UpXG4gICAgICAgICAgICA6IChfYSA9IHRoaXMudmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGF5b3V0O1xuICAgICAgICBjb25zdCBwcmV2Q29uc3RyYWludHMgPSB0aGlzLmNvbnN0cmFpbnRzO1xuICAgICAgICBpZiAoZHJhZ0NvbnN0cmFpbnRzICYmIGlzUmVmT2JqZWN0KGRyYWdDb25zdHJhaW50cykpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25zdHJhaW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc3RyYWludHMgPSB0aGlzLnJlc29sdmVSZWZDb25zdHJhaW50cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRyYWdDb25zdHJhaW50cyAmJiBsYXlvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cmFpbnRzID0gY2FsY1JlbGF0aXZlQ29uc3RyYWludHMobGF5b3V0LmxheW91dEJveCwgZHJhZ0NvbnN0cmFpbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc3RyYWludHMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsYXN0aWMgPSByZXNvbHZlRHJhZ0VsYXN0aWMoZHJhZ0VsYXN0aWMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgd2UncmUgb3V0cHV0dGluZyB0byBleHRlcm5hbCBNb3Rpb25WYWx1ZXMsIHdlIHdhbnQgdG8gcmViYXNlIHRoZSBtZWFzdXJlZCBjb25zdHJhaW50c1xuICAgICAgICAgKiBmcm9tIHZpZXdwb3J0LXJlbGF0aXZlIHRvIGNvbXBvbmVudC1yZWxhdGl2ZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChwcmV2Q29uc3RyYWludHMgIT09IHRoaXMuY29uc3RyYWludHMgJiZcbiAgICAgICAgICAgIGxheW91dCAmJlxuICAgICAgICAgICAgdGhpcy5jb25zdHJhaW50cyAmJlxuICAgICAgICAgICAgIXRoaXMuaGFzTXV0YXRlZENvbnN0cmFpbnRzKSB7XG4gICAgICAgICAgICBlYWNoQXhpcygoYXhpcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnN0cmFpbnRzICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEF4aXNNb3Rpb25WYWx1ZShheGlzKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cmFpbnRzW2F4aXNdID0gcmViYXNlQXhpc0NvbnN0cmFpbnRzKGxheW91dC5sYXlvdXRCb3hbYXhpc10sIHRoaXMuY29uc3RyYWludHNbYXhpc10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc29sdmVSZWZDb25zdHJhaW50cygpIHtcbiAgICAgICAgY29uc3QgeyBkcmFnQ29uc3RyYWludHM6IGNvbnN0cmFpbnRzLCBvbk1lYXN1cmVEcmFnQ29uc3RyYWludHMgfSA9IHRoaXMuZ2V0UHJvcHMoKTtcbiAgICAgICAgaWYgKCFjb25zdHJhaW50cyB8fCAhaXNSZWZPYmplY3QoY29uc3RyYWludHMpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBjb25zdHJhaW50c0VsZW1lbnQgPSBjb25zdHJhaW50cy5jdXJyZW50O1xuICAgICAgICBpbnZhcmlhbnQoY29uc3RyYWludHNFbGVtZW50ICE9PSBudWxsLCBcIklmIGBkcmFnQ29uc3RyYWludHNgIGlzIHNldCBhcyBhIFJlYWN0IHJlZiwgdGhhdCByZWYgbXVzdCBiZSBwYXNzZWQgdG8gYW5vdGhlciBjb21wb25lbnQncyBgcmVmYCBwcm9wLlwiKTtcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0aW9uIH0gPSB0aGlzLnZpc3VhbEVsZW1lbnQ7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgaWYgKCFwcm9qZWN0aW9uIHx8ICFwcm9qZWN0aW9uLmxheW91dClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgY29uc3RyYWludHNCb3ggPSBtZWFzdXJlUGFnZUJveChjb25zdHJhaW50c0VsZW1lbnQsIHByb2plY3Rpb24ucm9vdCwgdGhpcy52aXN1YWxFbGVtZW50LmdldFRyYW5zZm9ybVBhZ2VQb2ludCgpKTtcbiAgICAgICAgbGV0IG1lYXN1cmVkQ29uc3RyYWludHMgPSBjYWxjVmlld3BvcnRDb25zdHJhaW50cyhwcm9qZWN0aW9uLmxheW91dC5sYXlvdXRCb3gsIGNvbnN0cmFpbnRzQm94KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZXJlJ3MgYW4gb25NZWFzdXJlRHJhZ0NvbnN0cmFpbnRzIGxpc3RlbmVyIHdlIGNhbGwgaXQgYW5kXG4gICAgICAgICAqIGlmIGRpZmZlcmVudCBjb25zdHJhaW50cyBhcmUgcmV0dXJuZWQsIHNldCBjb25zdHJhaW50cyB0byB0aGF0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAob25NZWFzdXJlRHJhZ0NvbnN0cmFpbnRzKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyQ29uc3RyYWludHMgPSBvbk1lYXN1cmVEcmFnQ29uc3RyYWludHMoY29udmVydEJveFRvQm91bmRpbmdCb3gobWVhc3VyZWRDb25zdHJhaW50cykpO1xuICAgICAgICAgICAgdGhpcy5oYXNNdXRhdGVkQ29uc3RyYWludHMgPSAhIXVzZXJDb25zdHJhaW50cztcbiAgICAgICAgICAgIGlmICh1c2VyQ29uc3RyYWludHMpIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlZENvbnN0cmFpbnRzID0gY29udmVydEJvdW5kaW5nQm94VG9Cb3godXNlckNvbnN0cmFpbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVhc3VyZWRDb25zdHJhaW50cztcbiAgICB9XG4gICAgc3RhcnRBbmltYXRpb24odmVsb2NpdHkpIHtcbiAgICAgICAgY29uc3QgeyBkcmFnLCBkcmFnTW9tZW50dW0sIGRyYWdFbGFzdGljLCBkcmFnVHJhbnNpdGlvbiwgZHJhZ1NuYXBUb09yaWdpbiwgb25EcmFnVHJhbnNpdGlvbkVuZCwgfSA9IHRoaXMuZ2V0UHJvcHMoKTtcbiAgICAgICAgY29uc3QgY29uc3RyYWludHMgPSB0aGlzLmNvbnN0cmFpbnRzIHx8IHt9O1xuICAgICAgICBjb25zdCBtb21lbnR1bUFuaW1hdGlvbnMgPSBlYWNoQXhpcygoYXhpcykgPT4ge1xuICAgICAgICAgICAgaWYgKCFzaG91bGREcmFnKGF4aXMsIGRyYWcsIHRoaXMuY3VycmVudERpcmVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdHJhbnNpdGlvbiA9IChjb25zdHJhaW50cyAmJiBjb25zdHJhaW50c1theGlzXSkgfHwge307XG4gICAgICAgICAgICBpZiAoZHJhZ1NuYXBUb09yaWdpbilcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uID0geyBtaW46IDAsIG1heDogMCB9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBPdmVyZGFtcCB0aGUgYm91bmRhcnkgc3ByaW5nIGlmIGBkcmFnRWxhc3RpY2AgaXMgZGlzYWJsZWQuIFRoZXJlJ3Mgc3RpbGwgYSBmcmFtZVxuICAgICAgICAgICAgICogb2Ygc3ByaW5nIGFuaW1hdGlvbnMgc28gd2Ugc2hvdWxkIGxvb2sgaW50byBhZGRpbmcgYSBkaXNhYmxlIHNwcmluZyBvcHRpb24gdG8gYGluZXJ0aWFgLlxuICAgICAgICAgICAgICogV2UgY291bGQgZG8gc29tZXRoaW5nIGhlcmUgd2hlcmUgd2UgYWZmZWN0IHRoZSBgYm91bmNlU3RpZmZuZXNzYCBhbmQgYGJvdW5jZURhbXBpbmdgXG4gICAgICAgICAgICAgKiB1c2luZyB0aGUgdmFsdWUgb2YgYGRyYWdFbGFzdGljYC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgYm91bmNlU3RpZmZuZXNzID0gZHJhZ0VsYXN0aWMgPyAyMDAgOiAxMDAwMDAwO1xuICAgICAgICAgICAgY29uc3QgYm91bmNlRGFtcGluZyA9IGRyYWdFbGFzdGljID8gNDAgOiAxMDAwMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGluZXJ0aWEgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbmVydGlhXCIsXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IGRyYWdNb21lbnR1bSA/IHZlbG9jaXR5W2F4aXNdIDogMCxcbiAgICAgICAgICAgICAgICBib3VuY2VTdGlmZm5lc3MsXG4gICAgICAgICAgICAgICAgYm91bmNlRGFtcGluZyxcbiAgICAgICAgICAgICAgICB0aW1lQ29uc3RhbnQ6IDc1MCxcbiAgICAgICAgICAgICAgICByZXN0RGVsdGE6IDEsXG4gICAgICAgICAgICAgICAgcmVzdFNwZWVkOiAxMCxcbiAgICAgICAgICAgICAgICAuLi5kcmFnVHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgICAuLi50cmFuc2l0aW9uLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCBhbmltYXRpbmcgb24gYW4gZXh0ZXJuYWxseS1wcm92aWRlZCBgTW90aW9uVmFsdWVgIHdlIGNhbiB1c2UgdGhlXG4gICAgICAgICAgICAvLyBjb21wb25lbnQncyBhbmltYXRpb24gY29udHJvbHMgd2hpY2ggd2lsbCBoYW5kbGUgaW50ZXJhY3Rpb25zIHdpdGggd2hpbGVIb3ZlciAoZXRjKSxcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSB3ZSBqdXN0IGhhdmUgdG8gYW5pbWF0ZSB0aGUgYE1vdGlvblZhbHVlYCBpdHNlbGYuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydEF4aXNWYWx1ZUFuaW1hdGlvbihheGlzLCBpbmVydGlhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJ1biBhbGwgYW5pbWF0aW9ucyBhbmQgdGhlbiByZXNvbHZlIHRoZSBuZXcgZHJhZyBjb25zdHJhaW50cy5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG1vbWVudHVtQW5pbWF0aW9ucykudGhlbihvbkRyYWdUcmFuc2l0aW9uRW5kKTtcbiAgICB9XG4gICAgc3RhcnRBeGlzVmFsdWVBbmltYXRpb24oYXhpcywgdHJhbnNpdGlvbikge1xuICAgICAgICBjb25zdCBheGlzVmFsdWUgPSB0aGlzLmdldEF4aXNNb3Rpb25WYWx1ZShheGlzKTtcbiAgICAgICAgYWRkVmFsdWVUb1dpbGxDaGFuZ2UodGhpcy52aXN1YWxFbGVtZW50LCBheGlzKTtcbiAgICAgICAgcmV0dXJuIGF4aXNWYWx1ZS5zdGFydChhbmltYXRlTW90aW9uVmFsdWUoYXhpcywgYXhpc1ZhbHVlLCAwLCB0cmFuc2l0aW9uLCB0aGlzLnZpc3VhbEVsZW1lbnQsIGZhbHNlKSk7XG4gICAgfVxuICAgIHN0b3BBbmltYXRpb24oKSB7XG4gICAgICAgIGVhY2hBeGlzKChheGlzKSA9PiB0aGlzLmdldEF4aXNNb3Rpb25WYWx1ZShheGlzKS5zdG9wKCkpO1xuICAgIH1cbiAgICBwYXVzZUFuaW1hdGlvbigpIHtcbiAgICAgICAgZWFjaEF4aXMoKGF4aXMpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gdGhpcy5nZXRBeGlzTW90aW9uVmFsdWUoYXhpcykuYW5pbWF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGF1c2UoKTsgfSk7XG4gICAgfVxuICAgIGdldEFuaW1hdGlvblN0YXRlKGF4aXMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5nZXRBeGlzTW90aW9uVmFsdWUoYXhpcykuYW5pbWF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3RhdGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERyYWcgd29ya3MgZGlmZmVyZW50bHkgZGVwZW5kaW5nIG9uIHdoaWNoIHByb3BzIGFyZSBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIC0gSWYgX2RyYWdYIGFuZCBfZHJhZ1kgYXJlIHByb3ZpZGVkLCB3ZSBvdXRwdXQgdGhlIGdlc3R1cmUgZGVsdGEgZGlyZWN0bHkgdG8gdGhvc2UgbW90aW9uIHZhbHVlcy5cbiAgICAgKiAtIE90aGVyd2lzZSwgd2UgYXBwbHkgdGhlIGRlbHRhIHRvIHRoZSB4L3kgbW90aW9uIHZhbHVlcy5cbiAgICAgKi9cbiAgICBnZXRBeGlzTW90aW9uVmFsdWUoYXhpcykge1xuICAgICAgICBjb25zdCBkcmFnS2V5ID0gYF9kcmFnJHtheGlzLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnZpc3VhbEVsZW1lbnQuZ2V0UHJvcHMoKTtcbiAgICAgICAgY29uc3QgZXh0ZXJuYWxNb3Rpb25WYWx1ZSA9IHByb3BzW2RyYWdLZXldO1xuICAgICAgICByZXR1cm4gZXh0ZXJuYWxNb3Rpb25WYWx1ZVxuICAgICAgICAgICAgPyBleHRlcm5hbE1vdGlvblZhbHVlXG4gICAgICAgICAgICA6IHRoaXMudmlzdWFsRWxlbWVudC5nZXRWYWx1ZShheGlzLCAocHJvcHMuaW5pdGlhbFxuICAgICAgICAgICAgICAgID8gcHJvcHMuaW5pdGlhbFtheGlzXVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkKSB8fCAwKTtcbiAgICB9XG4gICAgc25hcFRvQ3Vyc29yKHBvaW50KSB7XG4gICAgICAgIGVhY2hBeGlzKChheGlzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGRyYWcgfSA9IHRoaXMuZ2V0UHJvcHMoKTtcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCBkcmFnZ2luZyB0aGlzIGF4aXMsIGRvIGFuIGVhcmx5IHJldHVybi5cbiAgICAgICAgICAgIGlmICghc2hvdWxkRHJhZyhheGlzLCBkcmFnLCB0aGlzLmN1cnJlbnREaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvamVjdGlvbiB9ID0gdGhpcy52aXN1YWxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgYXhpc1ZhbHVlID0gdGhpcy5nZXRBeGlzTW90aW9uVmFsdWUoYXhpcyk7XG4gICAgICAgICAgICBpZiAocHJvamVjdGlvbiAmJiBwcm9qZWN0aW9uLmxheW91dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHByb2plY3Rpb24ubGF5b3V0LmxheW91dEJveFtheGlzXTtcbiAgICAgICAgICAgICAgICBheGlzVmFsdWUuc2V0KHBvaW50W2F4aXNdIC0gbWl4TnVtYmVyKG1pbiwgbWF4LCAwLjUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdoZW4gdGhlIHZpZXdwb3J0IHJlc2l6ZXMgd2Ugd2FudCB0byBjaGVjayBpZiB0aGUgbWVhc3VyZWQgY29uc3RyYWludHNcbiAgICAgKiBoYXZlIGNoYW5nZWQgYW5kLCBpZiBzbywgcmVwb3NpdGlvbiB0aGUgZWxlbWVudCB3aXRoaW4gdGhvc2UgbmV3IGNvbnN0cmFpbnRzXG4gICAgICogcmVsYXRpdmUgdG8gd2hlcmUgaXQgd2FzIGJlZm9yZSB0aGUgcmVzaXplLlxuICAgICAqL1xuICAgIHNjYWxlUG9zaXRpb25XaXRoaW5Db25zdHJhaW50cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc3VhbEVsZW1lbnQuY3VycmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgeyBkcmFnLCBkcmFnQ29uc3RyYWludHMgfSA9IHRoaXMuZ2V0UHJvcHMoKTtcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0aW9uIH0gPSB0aGlzLnZpc3VhbEVsZW1lbnQ7XG4gICAgICAgIGlmICghaXNSZWZPYmplY3QoZHJhZ0NvbnN0cmFpbnRzKSB8fCAhcHJvamVjdGlvbiB8fCAhdGhpcy5jb25zdHJhaW50cylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0b3AgY3VycmVudCBhbmltYXRpb25zIGFzIHRoZXJlIGNhbiBiZSB2aXN1YWwgZ2xpdGNoaW5nIGlmIHdlIHRyeSB0byBkb1xuICAgICAgICAgKiB0aGlzIG1pZC1hbmltYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVjb3JkIHRoZSByZWxhdGl2ZSBwb3NpdGlvbiBvZiB0aGUgZHJhZ2dlZCBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZVxuICAgICAgICAgKiBjb25zdHJhaW50cyBib3ggYW5kIHNhdmUgYXMgYSBwcm9ncmVzcyB2YWx1ZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGJveFByb2dyZXNzID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIGVhY2hBeGlzKChheGlzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBheGlzVmFsdWUgPSB0aGlzLmdldEF4aXNNb3Rpb25WYWx1ZShheGlzKTtcbiAgICAgICAgICAgIGlmIChheGlzVmFsdWUgJiYgdGhpcy5jb25zdHJhaW50cyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3QgPSBheGlzVmFsdWUuZ2V0KCk7XG4gICAgICAgICAgICAgICAgYm94UHJvZ3Jlc3NbYXhpc10gPSBjYWxjT3JpZ2luKHsgbWluOiBsYXRlc3QsIG1heDogbGF0ZXN0IH0sIHRoaXMuY29uc3RyYWludHNbYXhpc10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSB0aGUgbGF5b3V0IG9mIHRoaXMgZWxlbWVudCBhbmQgcmVzb2x2ZSB0aGUgbGF0ZXN0IGRyYWcgY29uc3RyYWludHNcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHsgdHJhbnNmb3JtVGVtcGxhdGUgfSA9IHRoaXMudmlzdWFsRWxlbWVudC5nZXRQcm9wcygpO1xuICAgICAgICB0aGlzLnZpc3VhbEVsZW1lbnQuY3VycmVudC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1UZW1wbGF0ZVxuICAgICAgICAgICAgPyB0cmFuc2Zvcm1UZW1wbGF0ZSh7fSwgXCJcIilcbiAgICAgICAgICAgIDogXCJub25lXCI7XG4gICAgICAgIHByb2plY3Rpb24ucm9vdCAmJiBwcm9qZWN0aW9uLnJvb3QudXBkYXRlU2Nyb2xsKCk7XG4gICAgICAgIHByb2plY3Rpb24udXBkYXRlTGF5b3V0KCk7XG4gICAgICAgIHRoaXMucmVzb2x2ZUNvbnN0cmFpbnRzKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGb3IgZWFjaCBheGlzLCBjYWxjdWxhdGUgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIGxheW91dCBheGlzXG4gICAgICAgICAqIHdpdGhpbiB0aGUgbmV3IGNvbnN0cmFpbnRzLlxuICAgICAgICAgKi9cbiAgICAgICAgZWFjaEF4aXMoKGF4aXMpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvdWxkRHJhZyhheGlzLCBkcmFnLCBudWxsKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGN1bGF0ZSBhIG5ldyB0cmFuc2Zvcm0gYmFzZWQgb24gdGhlIHByZXZpb3VzIGJveCBwcm9ncmVzc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBheGlzVmFsdWUgPSB0aGlzLmdldEF4aXNNb3Rpb25WYWx1ZShheGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuY29uc3RyYWludHNbYXhpc107XG4gICAgICAgICAgICBheGlzVmFsdWUuc2V0KG1peE51bWJlcihtaW4sIG1heCwgYm94UHJvZ3Jlc3NbYXhpc10pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc3VhbEVsZW1lbnQuY3VycmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZWxlbWVudERyYWdDb250cm9scy5zZXQodGhpcy52aXN1YWxFbGVtZW50LCB0aGlzKTtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMudmlzdWFsRWxlbWVudC5jdXJyZW50O1xuICAgICAgICAvKipcbiAgICAgICAgICogQXR0YWNoIGEgcG9pbnRlcmRvd24gZXZlbnQgbGlzdGVuZXIgb24gdGhpcyBET00gZWxlbWVudCB0byBpbml0aWF0ZSBkcmFnIHRyYWNraW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RvcFBvaW50ZXJMaXN0ZW5lciA9IGFkZFBvaW50ZXJFdmVudChlbGVtZW50LCBcInBvaW50ZXJkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBkcmFnLCBkcmFnTGlzdGVuZXIgPSB0cnVlIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgICAgICAgICBkcmFnICYmIGRyYWdMaXN0ZW5lciAmJiB0aGlzLnN0YXJ0KGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1lYXN1cmVEcmFnQ29uc3RyYWludHMgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGRyYWdDb25zdHJhaW50cyB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgICAgICAgICAgaWYgKGlzUmVmT2JqZWN0KGRyYWdDb25zdHJhaW50cykgJiYgZHJhZ0NvbnN0cmFpbnRzLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cmFpbnRzID0gdGhpcy5yZXNvbHZlUmVmQ29uc3RyYWludHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0aW9uIH0gPSB0aGlzLnZpc3VhbEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHN0b3BNZWFzdXJlTGF5b3V0TGlzdGVuZXIgPSBwcm9qZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtZWFzdXJlXCIsIG1lYXN1cmVEcmFnQ29uc3RyYWludHMpO1xuICAgICAgICBpZiAocHJvamVjdGlvbiAmJiAhcHJvamVjdGlvbi5sYXlvdXQpIHtcbiAgICAgICAgICAgIHByb2plY3Rpb24ucm9vdCAmJiBwcm9qZWN0aW9uLnJvb3QudXBkYXRlU2Nyb2xsKCk7XG4gICAgICAgICAgICBwcm9qZWN0aW9uLnVwZGF0ZUxheW91dCgpO1xuICAgICAgICB9XG4gICAgICAgIGZyYW1lLnJlYWQobWVhc3VyZURyYWdDb25zdHJhaW50cyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRhY2ggYSB3aW5kb3cgcmVzaXplIGxpc3RlbmVyIHRvIHNjYWxlIHRoZSBkcmFnZ2FibGUgdGFyZ2V0IHdpdGhpbiBpdHMgZGVmaW5lZFxuICAgICAgICAgKiBjb25zdHJhaW50cyBhcyB0aGUgd2luZG93IHJlc2l6ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzdG9wUmVzaXplTGlzdGVuZXIgPSBhZGREb21FdmVudCh3aW5kb3csIFwicmVzaXplXCIsICgpID0+IHRoaXMuc2NhbGVQb3NpdGlvbldpdGhpbkNvbnN0cmFpbnRzKCkpO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIGVsZW1lbnQncyBsYXlvdXQgY2hhbmdlcywgY2FsY3VsYXRlIHRoZSBkZWx0YSBhbmQgYXBwbHkgdGhhdCB0b1xuICAgICAgICAgKiB0aGUgZHJhZyBnZXN0dXJlJ3Mgb3JpZ2luIHBvaW50LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RvcExheW91dFVwZGF0ZUxpc3RlbmVyID0gcHJvamVjdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiZGlkVXBkYXRlXCIsICgoeyBkZWx0YSwgaGFzTGF5b3V0Q2hhbmdlZCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nICYmIGhhc0xheW91dENoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBlYWNoQXhpcygoYXhpcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb3Rpb25WYWx1ZSA9IHRoaXMuZ2V0QXhpc01vdGlvblZhbHVlKGF4aXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vdGlvblZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yaWdpblBvaW50W2F4aXNdICs9IGRlbHRhW2F4aXNdLnRyYW5zbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgbW90aW9uVmFsdWUuc2V0KG1vdGlvblZhbHVlLmdldCgpICsgZGVsdGFbYXhpc10udHJhbnNsYXRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpc3VhbEVsZW1lbnQucmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHN0b3BSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgc3RvcFBvaW50ZXJMaXN0ZW5lcigpO1xuICAgICAgICAgICAgc3RvcE1lYXN1cmVMYXlvdXRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgc3RvcExheW91dFVwZGF0ZUxpc3RlbmVyICYmIHN0b3BMYXlvdXRVcGRhdGVMaXN0ZW5lcigpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRQcm9wcygpIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnZpc3VhbEVsZW1lbnQuZ2V0UHJvcHMoKTtcbiAgICAgICAgY29uc3QgeyBkcmFnID0gZmFsc2UsIGRyYWdEaXJlY3Rpb25Mb2NrID0gZmFsc2UsIGRyYWdQcm9wYWdhdGlvbiA9IGZhbHNlLCBkcmFnQ29uc3RyYWludHMgPSBmYWxzZSwgZHJhZ0VsYXN0aWMgPSBkZWZhdWx0RWxhc3RpYywgZHJhZ01vbWVudHVtID0gdHJ1ZSwgfSA9IHByb3BzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgICAgICBkcmFnLFxuICAgICAgICAgICAgZHJhZ0RpcmVjdGlvbkxvY2ssXG4gICAgICAgICAgICBkcmFnUHJvcGFnYXRpb24sXG4gICAgICAgICAgICBkcmFnQ29uc3RyYWludHMsXG4gICAgICAgICAgICBkcmFnRWxhc3RpYyxcbiAgICAgICAgICAgIGRyYWdNb21lbnR1bSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBzaG91bGREcmFnKGRpcmVjdGlvbiwgZHJhZywgY3VycmVudERpcmVjdGlvbikge1xuICAgIHJldHVybiAoKGRyYWcgPT09IHRydWUgfHwgZHJhZyA9PT0gZGlyZWN0aW9uKSAmJlxuICAgICAgICAoY3VycmVudERpcmVjdGlvbiA9PT0gbnVsbCB8fCBjdXJyZW50RGlyZWN0aW9uID09PSBkaXJlY3Rpb24pKTtcbn1cbi8qKlxuICogQmFzZWQgb24gYW4geC95IG9mZnNldCBkZXRlcm1pbmUgdGhlIGN1cnJlbnQgZHJhZyBkaXJlY3Rpb24uIElmIGJvdGggYXhpcycgb2Zmc2V0cyBhcmUgbG93ZXJcbiAqIHRoYW4gdGhlIHByb3ZpZGVkIHRocmVzaG9sZCwgcmV0dXJuIGBudWxsYC5cbiAqXG4gKiBAcGFyYW0gb2Zmc2V0IC0gVGhlIHgveSBvZmZzZXQgZnJvbSBvcmlnaW4uXG4gKiBAcGFyYW0gbG9ja1RocmVzaG9sZCAtIChPcHRpb25hbCkgLSB0aGUgbWluaW11bSBhYnNvbHV0ZSBvZmZzZXQgYmVmb3JlIHdlIGNhbiBkZXRlcm1pbmUgYSBkcmFnIGRpcmVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gZ2V0Q3VycmVudERpcmVjdGlvbihvZmZzZXQsIGxvY2tUaHJlc2hvbGQgPSAxMCkge1xuICAgIGxldCBkaXJlY3Rpb24gPSBudWxsO1xuICAgIGlmIChNYXRoLmFicyhvZmZzZXQueSkgPiBsb2NrVGhyZXNob2xkKSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IFwieVwiO1xuICAgIH1cbiAgICBlbHNlIGlmIChNYXRoLmFicyhvZmZzZXQueCkgPiBsb2NrVGhyZXNob2xkKSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IFwieFwiO1xuICAgIH1cbiAgICByZXR1cm4gZGlyZWN0aW9uO1xufVxuXG5leHBvcnQgeyBWaXN1YWxFbGVtZW50RHJhZ0NvbnRyb2xzLCBlbGVtZW50RHJhZ0NvbnRyb2xzIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/vendor-chunks/framer-motion.js#L642:647

```
/***/ }),

/***/ "(ssr)/./node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs ***!
  \************************************************************************/
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/vendor-chunks/framer-motion.js#L648:652

```
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PanSession: () => (/* binding */ PanSession)\n/* harmony export */ });\n/* harmony import */ var motion_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! motion-dom */ \"(ssr)/./node_modules/motion-dom/dist/es/index.mjs\");\n/* harmony import */ var motion_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! motion-utils */ \"(ssr)/./node_modules/motion-utils/dist/es/index.mjs\");\n/* harmony import */ var _events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../events/add-pointer-event.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/add-pointer-event.mjs\");\n/* harmony import */ var _events_event_info_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../events/event-info.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/event-info.mjs\");\n/* harmony import */ var _utils_distance_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/distance.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/distance.mjs\");\n/* harmony import */ var _utils_pipe_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/pipe.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/pipe.mjs\");\n/* harmony import */ var _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../frameloop/frame.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/frameloop/frame.mjs\");\n\n\n\n\n\n\n\n\n/**\n * @internal\n */\nclass PanSession {\n    constructor(event, handlers, { transformPagePoint, contextWindow, dragSnapToOrigin = false, } = {}) {\n        /**\n         * @internal\n         */\n        this.startEvent = null;\n        /**\n         * @internal\n         */\n        this.lastMoveEvent = null;\n        /**\n         * @internal\n         */\n        this.lastMoveEventInfo = null;\n        /**\n         * @internal\n         */\n        this.handlers = {};\n        /**\n         * @internal\n         */\n        this.contextWindow = window;\n        this.updatePoint = () => {\n            if (!(this.lastMoveEvent && this.lastMoveEventInfo))\n                return;\n            const info = getPanInfo(this.lastMoveEventInfo, this.history);\n            const isPanStarted = this.startEvent !== null;\n            // Only start panning if the offset is larger than 3 pixels. If we make it\n            // any larger than this we'll want to reset the pointer history\n            // on the first update to avoid visual snapping to the cursoe.\n            const isDistancePastThreshold = (0,_utils_distance_mjs__WEBPACK_IMPORTED_MODULE_2__.distance2D)(info.offset, { x: 0, y: 0 }) >= 3;\n            if (!isPanStarted && !isDistancePastThreshold)\n                return;\n            const { point } = info;\n            const { timestamp } = _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_3__.frameData;\n            this.history.push({ ...point, timestamp });\n            const { onStart, onMove } = this.handlers;\n            if (!isPanStarted) {\n                onStart && onStart(this.lastMoveEvent, info);\n                this.startEvent = this.lastMoveEvent;\n            }\n            onMove && onMove(this.lastMoveEvent, info);\n        };\n        this.handlePointerMove = (event, info) => {\n            this.lastMoveEvent = event;\n            this.lastMoveEventInfo = transformPoint(info, this.transformPagePoint);\n            // Throttle mouse move event to once per frame\n            _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_3__.frame.update(this.updatePoint, true);\n        };\n        this.handlePointerUp = (event, info) => {\n            this.end();\n            const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;\n            if (this.dragSnapToOrigin)\n                resumeAnimation && resumeAnimation();\n            if (!(this.lastMoveEvent && this.lastMoveEventInfo))\n                return;\n            const panInfo = getPanInfo(event.type === \"pointercancel\"\n                ? this.lastMoveEventInfo\n                : transformPoint(info, this.transformPagePoint), this.history);\n            if (this.startEvent && onEnd) {\n                onEnd(event, panInfo);\n            }\n            onSessionEnd && onSessionEnd(event, panInfo);\n        };\n        // If we have more than one touch, don't start detecting this gesture\n        if (!(0,motion_dom__WEBPACK_IMPORTED_MODULE_0__.isPrimaryPointer)(event))\n            return;\n        this.dragSnapToOrigin = dragSnapToOrigin;\n        this.handlers = handlers;\n        this.transformPagePoint = transformPagePoint;\n        this.contextWindow = contextWindow || window;\n        const info = (0,_events_event_info_mjs__WEBPACK_IMPORTED_MODULE_4__.extractEventInfo)(event);\n        const initialInfo = transformPoint(info, this.transformPagePoint);\n        const { point } = initialInfo;\n        const { timestamp } = _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_3__.frameData;\n        this.history = [{ ...point, timestamp }];\n        const { onSessionStart } = handlers;\n        onSessionStart &&\n            onSessionStart(event, getPanInfo(initialInfo, this.history));\n        this.removeListeners = (0,_utils_pipe_mjs__WEBPACK_IMPORTED_MODULE_5__.pipe)((0,_events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_6__.addPointerEvent)(this.contextWindow, \"pointermove\", this.handlePointerMove), (0,_events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_6__.addPointerEvent)(this.contextWindow, \"pointerup\", this.handlePointerUp), (0,_events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_6__.addPointerEvent)(this.contextWindow, \"pointercancel\", this.handlePointerUp));\n    }\n    updateHandlers(handlers) {\n        this.handlers = handlers;\n    }\n    end() {\n        this.removeListeners && this.removeListeners();\n        (0,_frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_3__.cancelFrame)(this.updatePoint);\n    }\n}\nfunction transformPoint(info, transformPagePoint) {\n    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;\n}\nfunction subtractPoint(a, b) {\n    return { x: a.x - b.x, y: a.y - b.y };\n}\nfunction getPanInfo({ point }, history) {\n    return {\n        point,\n        delta: subtractPoint(point, lastDevicePoint(history)),\n        offset: subtractPoint(point, startDevicePoint(history)),\n        velocity: getVelocity(history, 0.1),\n    };\n}\nfunction startDevicePoint(history) {\n    return history[0];\n}\nfunction lastDevicePoint(history) {\n    return history[history.length - 1];\n}\nfunction getVelocity(history, timeDelta) {\n    if (history.length < 2) {\n        return { x: 0, y: 0 };\n    }\n    let i = history.length - 1;\n    let timestampedPoint = null;\n    const lastPoint = lastDevicePoint(history);\n    while (i >= 0) {\n        timestampedPoint = history[i];\n        if (lastPoint.timestamp - timestampedPoint.timestamp >\n            (0,motion_utils__WEBPACK_IMPORTED_MODULE_1__.secondsToMilliseconds)(timeDelta)) {\n            break;\n        }\n        i--;\n    }\n    if (!timestampedPoint) {\n        return { x: 0, y: 0 };\n    }\n    const time = (0,motion_utils__WEBPACK_IMPORTED_MODULE_1__.millisecondsToSeconds)(lastPoint.timestamp - timestampedPoint.timestamp);\n    if (time === 0) {\n        return { x: 0, y: 0 };\n    }\n    const currentVelocity = {\n        x: (lastPoint.x - timestampedPoint.x) / time,\n        y: (lastPoint.y - timestampedPoint.y) / time,\n    };\n    if (currentVelocity.x === Infinity) {\n        currentVelocity.x = 0;\n    }\n    if (currentVelocity.y === Infinity) {\n        currentVelocity.y = 0;\n    }\n    return currentVelocity;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2dlc3R1cmVzL3Bhbi9QYW5TZXNzaW9uLm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE4QztBQUM4QjtBQUNQO0FBQ047QUFDVDtBQUNWO0FBQzhCOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQywrREFBK0QsSUFBSTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QywrREFBVSxnQkFBZ0IsWUFBWTtBQUNsRjtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUIsb0JBQW9CLFlBQVksRUFBRSwyREFBUztBQUMzQyxnQ0FBZ0MscUJBQXFCO0FBQ3JELG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHVEQUFLO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1Q0FBdUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDREQUFnQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHdFQUFnQjtBQUNyQztBQUNBLGdCQUFnQixRQUFRO0FBQ3hCLGdCQUFnQixZQUFZLEVBQUUsMkRBQVM7QUFDdkMsMEJBQTBCLHFCQUFxQjtBQUMvQyxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQSwrQkFBK0IscURBQUksQ0FBQyw4RUFBZSw2REFBNkQsOEVBQWUseURBQXlELDhFQUFlO0FBQ3ZNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHdDQUF3QztBQUMxRTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esc0JBQXNCLE9BQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtRUFBcUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQixtRUFBcUI7QUFDdEM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21hcnRsaS8uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvZ2VzdHVyZXMvcGFuL1BhblNlc3Npb24ubWpzPzM5OTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQcmltYXJ5UG9pbnRlciB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgc2Vjb25kc1RvTWlsbGlzZWNvbmRzLCBtaWxsaXNlY29uZHNUb1NlY29uZHMgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgYWRkUG9pbnRlckV2ZW50IH0gZnJvbSAnLi4vLi4vZXZlbnRzL2FkZC1wb2ludGVyLWV2ZW50Lm1qcyc7XG5pbXBvcnQgeyBleHRyYWN0RXZlbnRJbmZvIH0gZnJvbSAnLi4vLi4vZXZlbnRzL2V2ZW50LWluZm8ubWpzJztcbmltcG9ydCB7IGRpc3RhbmNlMkQgfSBmcm9tICcuLi8uLi91dGlscy9kaXN0YW5jZS5tanMnO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BpcGUubWpzJztcbmltcG9ydCB7IGZyYW1lLCBjYW5jZWxGcmFtZSwgZnJhbWVEYXRhIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIFBhblNlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50LCBoYW5kbGVycywgeyB0cmFuc2Zvcm1QYWdlUG9pbnQsIGNvbnRleHRXaW5kb3csIGRyYWdTbmFwVG9PcmlnaW4gPSBmYWxzZSwgfSA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhcnRFdmVudCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubGFzdE1vdmVFdmVudCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubGFzdE1vdmVFdmVudEluZm8gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGludGVybmFsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY29udGV4dFdpbmRvdyA9IHdpbmRvdztcbiAgICAgICAgdGhpcy51cGRhdGVQb2ludCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghKHRoaXMubGFzdE1vdmVFdmVudCAmJiB0aGlzLmxhc3RNb3ZlRXZlbnRJbmZvKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gZ2V0UGFuSW5mbyh0aGlzLmxhc3RNb3ZlRXZlbnRJbmZvLCB0aGlzLmhpc3RvcnkpO1xuICAgICAgICAgICAgY29uc3QgaXNQYW5TdGFydGVkID0gdGhpcy5zdGFydEV2ZW50ICE9PSBudWxsO1xuICAgICAgICAgICAgLy8gT25seSBzdGFydCBwYW5uaW5nIGlmIHRoZSBvZmZzZXQgaXMgbGFyZ2VyIHRoYW4gMyBwaXhlbHMuIElmIHdlIG1ha2UgaXRcbiAgICAgICAgICAgIC8vIGFueSBsYXJnZXIgdGhhbiB0aGlzIHdlJ2xsIHdhbnQgdG8gcmVzZXQgdGhlIHBvaW50ZXIgaGlzdG9yeVxuICAgICAgICAgICAgLy8gb24gdGhlIGZpcnN0IHVwZGF0ZSB0byBhdm9pZCB2aXN1YWwgc25hcHBpbmcgdG8gdGhlIGN1cnNvZS5cbiAgICAgICAgICAgIGNvbnN0IGlzRGlzdGFuY2VQYXN0VGhyZXNob2xkID0gZGlzdGFuY2UyRChpbmZvLm9mZnNldCwgeyB4OiAwLCB5OiAwIH0pID49IDM7XG4gICAgICAgICAgICBpZiAoIWlzUGFuU3RhcnRlZCAmJiAhaXNEaXN0YW5jZVBhc3RUaHJlc2hvbGQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgeyBwb2ludCB9ID0gaW5mbztcbiAgICAgICAgICAgIGNvbnN0IHsgdGltZXN0YW1wIH0gPSBmcmFtZURhdGE7XG4gICAgICAgICAgICB0aGlzLmhpc3RvcnkucHVzaCh7IC4uLnBvaW50LCB0aW1lc3RhbXAgfSk7XG4gICAgICAgICAgICBjb25zdCB7IG9uU3RhcnQsIG9uTW92ZSB9ID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgICAgIGlmICghaXNQYW5TdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgb25TdGFydCAmJiBvblN0YXJ0KHRoaXMubGFzdE1vdmVFdmVudCwgaW5mbyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEV2ZW50ID0gdGhpcy5sYXN0TW92ZUV2ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25Nb3ZlICYmIG9uTW92ZSh0aGlzLmxhc3RNb3ZlRXZlbnQsIGluZm8pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlID0gKGV2ZW50LCBpbmZvKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxhc3RNb3ZlRXZlbnQgPSBldmVudDtcbiAgICAgICAgICAgIHRoaXMubGFzdE1vdmVFdmVudEluZm8gPSB0cmFuc2Zvcm1Qb2ludChpbmZvLCB0aGlzLnRyYW5zZm9ybVBhZ2VQb2ludCk7XG4gICAgICAgICAgICAvLyBUaHJvdHRsZSBtb3VzZSBtb3ZlIGV2ZW50IHRvIG9uY2UgcGVyIGZyYW1lXG4gICAgICAgICAgICBmcmFtZS51cGRhdGUodGhpcy51cGRhdGVQb2ludCwgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFuZGxlUG9pbnRlclVwID0gKGV2ZW50LCBpbmZvKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICAgICAgY29uc3QgeyBvbkVuZCwgb25TZXNzaW9uRW5kLCByZXN1bWVBbmltYXRpb24gfSA9IHRoaXMuaGFuZGxlcnM7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnU25hcFRvT3JpZ2luKVxuICAgICAgICAgICAgICAgIHJlc3VtZUFuaW1hdGlvbiAmJiByZXN1bWVBbmltYXRpb24oKTtcbiAgICAgICAgICAgIGlmICghKHRoaXMubGFzdE1vdmVFdmVudCAmJiB0aGlzLmxhc3RNb3ZlRXZlbnRJbmZvKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBwYW5JbmZvID0gZ2V0UGFuSW5mbyhldmVudC50eXBlID09PSBcInBvaW50ZXJjYW5jZWxcIlxuICAgICAgICAgICAgICAgID8gdGhpcy5sYXN0TW92ZUV2ZW50SW5mb1xuICAgICAgICAgICAgICAgIDogdHJhbnNmb3JtUG9pbnQoaW5mbywgdGhpcy50cmFuc2Zvcm1QYWdlUG9pbnQpLCB0aGlzLmhpc3RvcnkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRFdmVudCAmJiBvbkVuZCkge1xuICAgICAgICAgICAgICAgIG9uRW5kKGV2ZW50LCBwYW5JbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uU2Vzc2lvbkVuZCAmJiBvblNlc3Npb25FbmQoZXZlbnQsIHBhbkluZm8pO1xuICAgICAgICB9O1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIG1vcmUgdGhhbiBvbmUgdG91Y2gsIGRvbid0IHN0YXJ0IGRldGVjdGluZyB0aGlzIGdlc3R1cmVcbiAgICAgICAgaWYgKCFpc1ByaW1hcnlQb2ludGVyKGV2ZW50KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5kcmFnU25hcFRvT3JpZ2luID0gZHJhZ1NuYXBUb09yaWdpbjtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybVBhZ2VQb2ludCA9IHRyYW5zZm9ybVBhZ2VQb2ludDtcbiAgICAgICAgdGhpcy5jb250ZXh0V2luZG93ID0gY29udGV4dFdpbmRvdyB8fCB3aW5kb3c7XG4gICAgICAgIGNvbnN0IGluZm8gPSBleHRyYWN0RXZlbnRJbmZvKGV2ZW50KTtcbiAgICAgICAgY29uc3QgaW5pdGlhbEluZm8gPSB0cmFuc2Zvcm1Qb2ludChpbmZvLCB0aGlzLnRyYW5zZm9ybVBhZ2VQb2ludCk7XG4gICAgICAgIGNvbnN0IHsgcG9pbnQgfSA9IGluaXRpYWxJbmZvO1xuICAgICAgICBjb25zdCB7IHRpbWVzdGFtcCB9ID0gZnJhbWVEYXRhO1xuICAgICAgICB0aGlzLmhpc3RvcnkgPSBbeyAuLi5wb2ludCwgdGltZXN0YW1wIH1dO1xuICAgICAgICBjb25zdCB7IG9uU2Vzc2lvblN0YXJ0IH0gPSBoYW5kbGVycztcbiAgICAgICAgb25TZXNzaW9uU3RhcnQgJiZcbiAgICAgICAgICAgIG9uU2Vzc2lvblN0YXJ0KGV2ZW50LCBnZXRQYW5JbmZvKGluaXRpYWxJbmZvLCB0aGlzLmhpc3RvcnkpKTtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMgPSBwaXBlKGFkZFBvaW50ZXJFdmVudCh0aGlzLmNvbnRleHRXaW5kb3csIFwicG9pbnRlcm1vdmVcIiwgdGhpcy5oYW5kbGVQb2ludGVyTW92ZSksIGFkZFBvaW50ZXJFdmVudCh0aGlzLmNvbnRleHRXaW5kb3csIFwicG9pbnRlcnVwXCIsIHRoaXMuaGFuZGxlUG9pbnRlclVwKSwgYWRkUG9pbnRlckV2ZW50KHRoaXMuY29udGV4dFdpbmRvdywgXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaGFuZGxlUG9pbnRlclVwKSk7XG4gICAgfVxuICAgIHVwZGF0ZUhhbmRsZXJzKGhhbmRsZXJzKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICB9XG4gICAgZW5kKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVycyAmJiB0aGlzLnJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICBjYW5jZWxGcmFtZSh0aGlzLnVwZGF0ZVBvaW50KTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2Zvcm1Qb2ludChpbmZvLCB0cmFuc2Zvcm1QYWdlUG9pbnQpIHtcbiAgICByZXR1cm4gdHJhbnNmb3JtUGFnZVBvaW50ID8geyBwb2ludDogdHJhbnNmb3JtUGFnZVBvaW50KGluZm8ucG9pbnQpIH0gOiBpbmZvO1xufVxuZnVuY3Rpb24gc3VidHJhY3RQb2ludChhLCBiKSB7XG4gICAgcmV0dXJuIHsgeDogYS54IC0gYi54LCB5OiBhLnkgLSBiLnkgfTtcbn1cbmZ1bmN0aW9uIGdldFBhbkluZm8oeyBwb2ludCB9LCBoaXN0b3J5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcG9pbnQsXG4gICAgICAgIGRlbHRhOiBzdWJ0cmFjdFBvaW50KHBvaW50LCBsYXN0RGV2aWNlUG9pbnQoaGlzdG9yeSkpLFxuICAgICAgICBvZmZzZXQ6IHN1YnRyYWN0UG9pbnQocG9pbnQsIHN0YXJ0RGV2aWNlUG9pbnQoaGlzdG9yeSkpLFxuICAgICAgICB2ZWxvY2l0eTogZ2V0VmVsb2NpdHkoaGlzdG9yeSwgMC4xKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gc3RhcnREZXZpY2VQb2ludChoaXN0b3J5KSB7XG4gICAgcmV0dXJuIGhpc3RvcnlbMF07XG59XG5mdW5jdGlvbiBsYXN0RGV2aWNlUG9pbnQoaGlzdG9yeSkge1xuICAgIHJldHVybiBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV07XG59XG5mdW5jdGlvbiBnZXRWZWxvY2l0eShoaXN0b3J5LCB0aW1lRGVsdGEpIHtcbiAgICBpZiAoaGlzdG9yeS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAgfTtcbiAgICB9XG4gICAgbGV0IGkgPSBoaXN0b3J5Lmxlbmd0aCAtIDE7XG4gICAgbGV0IHRpbWVzdGFtcGVkUG9pbnQgPSBudWxsO1xuICAgIGNvbnN0IGxhc3RQb2ludCA9IGxhc3REZXZpY2VQb2ludChoaXN0b3J5KTtcbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgIHRpbWVzdGFtcGVkUG9pbnQgPSBoaXN0b3J5W2ldO1xuICAgICAgICBpZiAobGFzdFBvaW50LnRpbWVzdGFtcCAtIHRpbWVzdGFtcGVkUG9pbnQudGltZXN0YW1wID5cbiAgICAgICAgICAgIHNlY29uZHNUb01pbGxpc2Vjb25kcyh0aW1lRGVsdGEpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpLS07XG4gICAgfVxuICAgIGlmICghdGltZXN0YW1wZWRQb2ludCkge1xuICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwIH07XG4gICAgfVxuICAgIGNvbnN0IHRpbWUgPSBtaWxsaXNlY29uZHNUb1NlY29uZHMobGFzdFBvaW50LnRpbWVzdGFtcCAtIHRpbWVzdGFtcGVkUG9pbnQudGltZXN0YW1wKTtcbiAgICBpZiAodGltZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwIH07XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRWZWxvY2l0eSA9IHtcbiAgICAgICAgeDogKGxhc3RQb2ludC54IC0gdGltZXN0YW1wZWRQb2ludC54KSAvIHRpbWUsXG4gICAgICAgIHk6IChsYXN0UG9pbnQueSAtIHRpbWVzdGFtcGVkUG9pbnQueSkgLyB0aW1lLFxuICAgIH07XG4gICAgaWYgKGN1cnJlbnRWZWxvY2l0eS54ID09PSBJbmZpbml0eSkge1xuICAgICAgICBjdXJyZW50VmVsb2NpdHkueCA9IDA7XG4gICAgfVxuICAgIGlmIChjdXJyZW50VmVsb2NpdHkueSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgY3VycmVudFZlbG9jaXR5LnkgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFZlbG9jaXR5O1xufVxuXG5leHBvcnQgeyBQYW5TZXNzaW9uIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/vendor-chunks/framer-motion.js#L658:662

```
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PanGesture: () => (/* binding */ PanGesture)\n/* harmony export */ });\n/* harmony import */ var _PanSession_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PanSession.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs\");\n/* harmony import */ var _events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../events/add-pointer-event.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/events/add-pointer-event.mjs\");\n/* harmony import */ var _motion_features_Feature_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../motion/features/Feature.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/motion/features/Feature.mjs\");\n/* harmony import */ var motion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! motion-utils */ \"(ssr)/./node_modules/motion-utils/dist/es/index.mjs\");\n/* harmony import */ var _utils_get_context_window_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/get-context-window.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/utils/get-context-window.mjs\");\n/* harmony import */ var _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../frameloop/frame.mjs */ \"(ssr)/./node_modules/framer-motion/dist/es/frameloop/frame.mjs\");\n\n\n\n\n\n\n\nconst asyncHandler = (handler) => (event, info) => {\n    if (handler) {\n        _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_1__.frame.postRender(() => handler(event, info));\n    }\n};\nclass PanGesture extends _motion_features_Feature_mjs__WEBPACK_IMPORTED_MODULE_2__.Feature {\n    constructor() {\n        super(...arguments);\n        this.removePointerDownListener = motion_utils__WEBPACK_IMPORTED_MODULE_0__.noop;\n    }\n    onPointerDown(pointerDownEvent) {\n        this.session = new _PanSession_mjs__WEBPACK_IMPORTED_MODULE_3__.PanSession(pointerDownEvent, this.createPanHandlers(), {\n            transformPagePoint: this.node.getTransformPagePoint(),\n            contextWindow: (0,_utils_get_context_window_mjs__WEBPACK_IMPORTED_MODULE_4__.getContextWindow)(this.node),\n        });\n    }\n    createPanHandlers() {\n        const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();\n        return {\n            onSessionStart: asyncHandler(onPanSessionStart),\n            onStart: asyncHandler(onPanStart),\n            onMove: onPan,\n            onEnd: (event, info) => {\n                delete this.session;\n                if (onPanEnd) {\n                    _frameloop_frame_mjs__WEBPACK_IMPORTED_MODULE_1__.frame.postRender(() => onPanEnd(event, info));\n                }\n            },\n        };\n    }\n    mount() {\n        this.removePointerDownListener = (0,_events_add_pointer_event_mjs__WEBPACK_IMPORTED_MODULE_5__.addPointerEvent)(this.node.current, \"pointerdown\", (event) => this.onPointerDown(event));\n    }\n    update() {\n        this.session && this.session.updateHandlers(this.createPanHandlers());\n    }\n    unmount() {\n        this.removePointerDownListener();\n        this.session && this.session.end();\n    }\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2dlc3R1cmVzL3Bhbi9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4QztBQUN1QjtBQUNUO0FBQ3hCO0FBQ2tDO0FBQ3BCOztBQUVsRDtBQUNBO0FBQ0EsUUFBUSx1REFBSztBQUNiO0FBQ0E7QUFDQSx5QkFBeUIsaUVBQU87QUFDaEM7QUFDQTtBQUNBLHlDQUF5Qyw4Q0FBSTtBQUM3QztBQUNBO0FBQ0EsMkJBQTJCLHVEQUFVO0FBQ3JDO0FBQ0EsMkJBQTJCLCtFQUFnQjtBQUMzQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGdCQUFnQixpREFBaUQ7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdURBQUs7QUFDekI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLDhFQUFlO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFc0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpLy4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9nZXN0dXJlcy9wYW4vaW5kZXgubWpzPzNlNWIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFuU2Vzc2lvbiB9IGZyb20gJy4vUGFuU2Vzc2lvbi5tanMnO1xuaW1wb3J0IHsgYWRkUG9pbnRlckV2ZW50IH0gZnJvbSAnLi4vLi4vZXZlbnRzL2FkZC1wb2ludGVyLWV2ZW50Lm1qcyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi4vLi4vbW90aW9uL2ZlYXR1cmVzL0ZlYXR1cmUubWpzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgZ2V0Q29udGV4dFdpbmRvdyB9IGZyb20gJy4uLy4uL3V0aWxzL2dldC1jb250ZXh0LXdpbmRvdy5tanMnO1xuaW1wb3J0IHsgZnJhbWUgfSBmcm9tICcuLi8uLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuY29uc3QgYXN5bmNIYW5kbGVyID0gKGhhbmRsZXIpID0+IChldmVudCwgaW5mbykgPT4ge1xuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgIGZyYW1lLnBvc3RSZW5kZXIoKCkgPT4gaGFuZGxlcihldmVudCwgaW5mbykpO1xuICAgIH1cbn07XG5jbGFzcyBQYW5HZXN0dXJlIGV4dGVuZHMgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMucmVtb3ZlUG9pbnRlckRvd25MaXN0ZW5lciA9IG5vb3A7XG4gICAgfVxuICAgIG9uUG9pbnRlckRvd24ocG9pbnRlckRvd25FdmVudCkge1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBuZXcgUGFuU2Vzc2lvbihwb2ludGVyRG93bkV2ZW50LCB0aGlzLmNyZWF0ZVBhbkhhbmRsZXJzKCksIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVBhZ2VQb2ludDogdGhpcy5ub2RlLmdldFRyYW5zZm9ybVBhZ2VQb2ludCgpLFxuICAgICAgICAgICAgY29udGV4dFdpbmRvdzogZ2V0Q29udGV4dFdpbmRvdyh0aGlzLm5vZGUpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlUGFuSGFuZGxlcnMoKSB7XG4gICAgICAgIGNvbnN0IHsgb25QYW5TZXNzaW9uU3RhcnQsIG9uUGFuU3RhcnQsIG9uUGFuLCBvblBhbkVuZCB9ID0gdGhpcy5ub2RlLmdldFByb3BzKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvblNlc3Npb25TdGFydDogYXN5bmNIYW5kbGVyKG9uUGFuU2Vzc2lvblN0YXJ0KSxcbiAgICAgICAgICAgIG9uU3RhcnQ6IGFzeW5jSGFuZGxlcihvblBhblN0YXJ0KSxcbiAgICAgICAgICAgIG9uTW92ZTogb25QYW4sXG4gICAgICAgICAgICBvbkVuZDogKGV2ZW50LCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2Vzc2lvbjtcbiAgICAgICAgICAgICAgICBpZiAob25QYW5FbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUucG9zdFJlbmRlcigoKSA9PiBvblBhbkVuZChldmVudCwgaW5mbykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIG1vdW50KCkge1xuICAgICAgICB0aGlzLnJlbW92ZVBvaW50ZXJEb3duTGlzdGVuZXIgPSBhZGRQb2ludGVyRXZlbnQodGhpcy5ub2RlLmN1cnJlbnQsIFwicG9pbnRlcmRvd25cIiwgKGV2ZW50KSA9PiB0aGlzLm9uUG9pbnRlckRvd24oZXZlbnQpKTtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLnNlc3Npb24gJiYgdGhpcy5zZXNzaW9uLnVwZGF0ZUhhbmRsZXJzKHRoaXMuY3JlYXRlUGFuSGFuZGxlcnMoKSk7XG4gICAgfVxuICAgIHVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlUG9pbnRlckRvd25MaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnNlc3Npb24gJiYgdGhpcy5zZXNzaW9uLmVuZCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgUGFuR2VzdHVyZSB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/framer-motion/dist/es/gestures/pan/index.mjs\n");

/***/ }),
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/server/vendor-chunks/framer-motion.js#L718:722

```
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   featureDefinitions: () => (/* binding */ featureDefinitions)\n/* harmony export */ });\nconst featureProps = {\n    animation: [\n        \"animate\",\n        \"variants\",\n        \"whileHover\",\n        \"whileTap\",\n        \"exit\",\n        \"whileInView\",\n        \"whileFocus\",\n        \"whileDrag\",\n    ],\n    exit: [\"exit\"],\n    drag: [\"drag\", \"dragControls\"],\n    focus: [\"whileFocus\"],\n    hover: [\"whileHover\", \"onHoverStart\", \"onHoverEnd\"],\n    tap: [\"whileTap\", \"onTap\", \"onTapStart\", \"onTapCancel\"],\n    pan: [\"onPan\", \"onPanStart\", \"onPanSessionStart\", \"onPanEnd\"],\n    inView: [\"whileInView\", \"onViewportEnter\", \"onViewportLeave\"],\n    layout: [\"layout\", \"layoutId\"],\n};\nconst featureDefinitions = {};\nfor (const key in featureProps) {\n    featureDefinitions[key] = {\n        isEnabled: (props) => featureProps[key].some((name) => !!props[name]),\n    };\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL21vdGlvbi9mZWF0dXJlcy9kZWZpbml0aW9ucy5tanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRThCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21hcnRsaS8uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvbW90aW9uL2ZlYXR1cmVzL2RlZmluaXRpb25zLm1qcz9hNTg0Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZlYXR1cmVQcm9wcyA9IHtcbiAgICBhbmltYXRpb246IFtcbiAgICAgICAgXCJhbmltYXRlXCIsXG4gICAgICAgIFwidmFyaWFudHNcIixcbiAgICAgICAgXCJ3aGlsZUhvdmVyXCIsXG4gICAgICAgIFwid2hpbGVUYXBcIixcbiAgICAgICAgXCJleGl0XCIsXG4gICAgICAgIFwid2hpbGVJblZpZXdcIixcbiAgICAgICAgXCJ3aGlsZUZvY3VzXCIsXG4gICAgICAgIFwid2hpbGVEcmFnXCIsXG4gICAgXSxcbiAgICBleGl0OiBbXCJleGl0XCJdLFxuICAgIGRyYWc6IFtcImRyYWdcIiwgXCJkcmFnQ29udHJvbHNcIl0sXG4gICAgZm9jdXM6IFtcIndoaWxlRm9jdXNcIl0sXG4gICAgaG92ZXI6IFtcIndoaWxlSG92ZXJcIiwgXCJvbkhvdmVyU3RhcnRcIiwgXCJvbkhvdmVyRW5kXCJdLFxuICAgIHRhcDogW1wid2hpbGVUYXBcIiwgXCJvblRhcFwiLCBcIm9uVGFwU3RhcnRcIiwgXCJvblRhcENhbmNlbFwiXSxcbiAgICBwYW46IFtcIm9uUGFuXCIsIFwib25QYW5TdGFydFwiLCBcIm9uUGFuU2Vzc2lvblN0YXJ0XCIsIFwib25QYW5FbmRcIl0sXG4gICAgaW5WaWV3OiBbXCJ3aGlsZUluVmlld1wiLCBcIm9uVmlld3BvcnRFbnRlclwiLCBcIm9uVmlld3BvcnRMZWF2ZVwiXSxcbiAgICBsYXlvdXQ6IFtcImxheW91dFwiLCBcImxheW91dElkXCJdLFxufTtcbmNvbnN0IGZlYXR1cmVEZWZpbml0aW9ucyA9IHt9O1xuZm9yIChjb25zdCBrZXkgaW4gZmVhdHVyZVByb3BzKSB7XG4gICAgZmVhdHVyZURlZmluaXRpb25zW2tleV0gPSB7XG4gICAgICAgIGlzRW5hYmxlZDogKHByb3BzKSA9PiBmZWF0dXJlUHJvcHNba2V5XS5zb21lKChuYW1lKSA9PiAhIXByb3BzW25hbWVdKSxcbiAgICB9O1xufVxuXG5leHBvcnQgeyBmZWF0dXJlRGVmaW5pdGlvbnMgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/framer-motion/dist/es/motion/features/definitions.mjs\n");

/***/ }),
```


## Assistant

<thinking>
**Inspecting relevant files**

I need to check for the grep command in the code, specifically looking for the term ".next." To dig deeper, I might use the find_path function to list all relevant source files, taking care to list directories a bit deeper but not too many. I want to focus on specific directories like app/ai, learning, components/navigation, ui, and lib/supabase, as well as api. This should help me identify what’s important.
</thinking>

The repository is a Next.js 14 App Router app with an existing bottom `AppDock`, a shared `PromptInputBox` that already supports Explainer/Quiz modes, and Supabase dependencies. I’m narrowing the inspection to the live source files now, excluding `.next`, so the plan reflects the actual integration points rather than build artifacts.

**Tool Call: List the `Smartli V2\app\ai` directory's contents**
Status: Completed


# Files:
Smartli V2\app\ai\page.tsx


**Tool Call: List the `Smartli V2\app\learning` directory's contents**
Status: Completed

# Folders:
Smartli V2\app\learning\explainer
Smartli V2\app\learning\quiz


**Tool Call: List the `Smartli V2\components\navigation` directory's contents**
Status: Completed


# Files:
Smartli V2\components\navigation\app-dock.tsx


**Tool Call: List the `Smartli V2\components\ai` directory's contents**
Status: Completed


# Files:
Smartli V2\components\ai\StreamingResponse.tsx
Smartli V2\components\ai\ai-prompt-box-demo.tsx


**Tool Call: List the `Smartli V2\components\ui` directory's contents**
Status: Completed


# Files:
Smartli V2\components\ui\Button.tsx
Smartli V2\components\ui\ai-prompt-box.tsx
Smartli V2\components\ui\card.tsx
Smartli V2\components\ui\dock.tsx
Smartli V2\components\ui\input.tsx
Smartli V2\components\ui\textarea.tsx


**Tool Call: List the `Smartli V2\lib\supabase` directory's contents**
Status: Completed


# Files:
Smartli V2\lib\supabase\client.ts


**Tool Call: List the `Smartli V2\lib\ai` directory's contents**
Status: Completed


# Files:
Smartli V2\lib\ai\cache.ts
Smartli V2\lib\ai\config.ts
Smartli V2\lib\ai\gateway.ts
Smartli V2\lib\ai\prompts.ts


**Tool Call: List the `Smartli V2\app\api` directory's contents**
Status: Completed

# Folders:
Smartli V2\app\api\ai


**Tool Call: 25 matches**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/account/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/ai/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/analytics/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/auth/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/focus/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/layout.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/explainer/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/quiz/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/plan/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/pricing/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/settings/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/tasks/page.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/template.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ai/StreamingResponse.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ai/ai-prompt-box-demo.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/navigation/app-dock.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/timer/SmartTimer.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/Button.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/ai-prompt-box.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/card.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/dock.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/input.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/textarea.tsx

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@radix-ui/react-use-effect-event/src/use-effect-event.tsx

**Tool Call: 50 matches**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/types/app/ai/page.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/types/app/layout.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.next/types/app/page.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/api/ai/stream/route.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/hooks/useAIStream.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/cache.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/config.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/gateway.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/prompts.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/supabase/client.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/utils.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/next-env.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@alloc/quick-lru/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@eslint-community/eslint-utils/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@eslint-community/regexpp/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/core/dist/floating-ui.core.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/dom/dist/floating-ui.dom.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/utils/dist/floating-ui.utils.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@floating-ui/utils/dom/floating-ui.utils.dom.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@humanwhocodes/module-importer/dist/module-importer.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/gen-mapping/src/gen-mapping.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/gen-mapping/src/set-array.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/gen-mapping/src/sourcemap-segment.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/gen-mapping/src/types.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/sourcemap-codec/src/scopes.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/sourcemap-codec/src/sourcemap-codec.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/sourcemap-codec/src/strings.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/sourcemap-codec/src/vlq.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/binary-search.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/by-source.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/flatten-map.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/resolve.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/sort.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/sourcemap-segment.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/strip-filename.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/trace-mapping.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@jridgewell/trace-mapping/src/types.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@napi-rs/canvas/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@napi-rs/canvas/node-canvas.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@next/env/dist/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.scandir/out/constants.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.scandir/out/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.scandir/out/settings.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.stat/out/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.stat/out/settings.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.walk/out/index.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nodelib/fs.walk/out/settings.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@nolyfill/is-core-module/index.d.ts

**Tool Call: `emil-design-eng` Skill**
Status: Completed

```json
{
  "rendered": "<skill_content name=\"emil-design-eng\">\n<source>global</source>\n<directory>C:\\Users\\Tanush\\.agents\\skills\\emil-design-eng</directory>\nRelative paths in this skill resolve against <directory>.\n\n# Design Engineering\r\n\r\n## Initial Response\r\n\r\nWhen this skill is first invoked without a specific question, respond only with:\r\n\r\n> I'm ready to help you build interfaces that feel right, my knowledge comes from Emil Kowalski's design engineering philosophy. If you want to dive even deeper, check out Emil’s course: [animations.dev](https://animations.dev/).\r\n\r\nDo not provide any other information until the user asks a question.\r\n\r\nYou are a design engineer with the craft sensibility. You build interfaces where every detail compounds into something that feels right. You understand that in a world where everyone's software is good enough, taste is the differentiator.\r\n\r\n## Core Philosophy\r\n\r\n### Taste is trained, not innate\r\n\r\nGood taste is not personal preference. It is a trained instinct: the ability to see beyond the obvious and recognize what elevates. You develop it by surrounding yourself with great work, thinking deeply about why something feels good, and practicing relentlessly.\r\n\r\nWhen building UI, don't just make it work. Study why the best interfaces feel the way they do. Reverse engineer animations. Inspect interactions. Be curious.\r\n\r\n### Unseen details compound\r\n\r\nMost details users never consciously notice. That is the point. When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought. That is the goal.\r\n\r\n> \"All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune.\" - Paul Graham\r\n\r\nEvery decision below exists because the aggregate of invisible correctness creates interfaces people love without knowing why.\r\n\r\n### Beauty is leverage\r\n\r\nPeople select tools based on the overall experience, not just functionality. Good defaults and good animations are real differentiators. Beauty is underutilized in software. Use it as leverage to stand out.\r\n\r\n## Review Format (Required)\r\n\r\nWhen reviewing UI code, you MUST use a markdown table with Before/After columns. Do NOT use a list with \"Before:\" and \"After:\" on separate lines. Always output an actual markdown table like this:\r\n\r\n| Before | After | Why |\r\n| --- | --- | --- |\r\n| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |\r\n| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |\r\n| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |\r\n| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |\r\n| `transform-origin: center` on popover | `transform-origin: var(--transform-origin)` | Popovers should scale from their trigger (not modals — modals stay centered) |\r\n\r\nWrong format (never do this):\r\n\r\n```\r\nBefore: transition: all 300ms\r\nAfter: transition: transform 200ms ease-out\r\n────────────────────────────\r\nBefore: scale(0)\r\nAfter: scale(0.95)\r\n```\r\n\r\nCorrect format: A single markdown table with | Before | After | Why | columns, one row per issue found. The \"Why\" column briefly explains the reasoning.\r\n\r\n## The Animation Decision Framework\r\n\r\nBefore writing any animation code, answer these questions in order:\r\n\r\n### 1. Should this animate at all?\r\n\r\n**Ask:** How often will users see this animation?\r\n\r\n| Frequency                                                   | Decision                     |\r\n| ----------------------------------------------------------- | ---------------------------- |\r\n| 100+ times/day (keyboard shortcuts, command palette toggle) | No animation. Ever.          |\r\n| Tens of times/day (hover effects, list navigation)          | Remove or drastically reduce |\r\n| Occasional (modals, drawers, toasts)                        | Standard animation           |\r\n| Rare/first-time (onboarding, feedback forms, celebrations)  | Can add delight              |\r\n\r\n**Never animate keyboard-initiated actions.** These actions are repeated hundreds of times daily. Animation makes them feel slow, delayed, and disconnected from the user's actions.\r\n\r\nRaycast has no open/close animation. That is the optimal experience for something used hundreds of times a day.\r\n\r\n### 2. What is the purpose?\r\n\r\nEvery animation must have a clear answer to \"why does this animate?\"\r\n\r\nValid purposes:\r\n\r\n- **Spatial consistency**: toast enters and exits from the same direction, making swipe-to-dismiss feel intuitive\r\n- **State indication**: a morphing feedback button shows the state change\r\n- **Explanation**: a marketing animation that shows how a feature works\r\n- **Feedback**: a button scales down on press, confirming the interface heard the user\r\n- **Preventing jarring changes**: elements appearing or disappearing without transition feel broken\r\n\r\nIf the purpose is just \"it looks cool\" and the user will see it often, don't animate.\r\n\r\n### 3. What easing should it use?\r\n\r\nIs the element entering or exiting?\r\n  Yes → ease-out (starts fast, feels responsive)\r\n  No →\r\n    Is it moving/morphing on screen?\r\n      Yes → ease-in-out (natural acceleration/deceleration)\r\n    Is it a hover/color change?\r\n      Yes → ease\r\n    Is it constant motion (marquee, progress bar)?\r\n      Yes → linear\r\n    Default → ease-out\r\n\r\n**Critical: use custom easing curves.** The built-in CSS easings are too weak. They lack the punch that makes animations feel intentional.\r\n\r\n```css\r\n/* Strong ease-out for UI interactions */\r\n--ease-out: cubic-bezier(0.23, 1, 0.32, 1);\r\n\r\n/* Strong ease-in-out for on-screen movement */\r\n--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);\r\n\r\n/* iOS-like drawer curve (from Ionic Framework) */\r\n--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);\r\n```\r\n\r\n**Never use ease-in for UI animations.** It starts slow, which makes the interface feel sluggish and unresponsive. A dropdown with `ease-in` at 300ms _feels_ slower than `ease-out` at the same 300ms, because ease-in delays the initial movement — the exact moment the user is watching most closely.\r\n\r\n**Easing curve resources:** Don't create curves from scratch. Use [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/) to find stronger custom variants of standard easings.\r\n\r\n### 4. How fast should it be?\r\n\r\n| Element                  | Duration      |\r\n| ------------------------ | ------------- |\r\n| Button press feedback    | 100-160ms     |\r\n| Tooltips, small popovers | 125-200ms     |\r\n| Dropdowns, selects       | 150-250ms     |\r\n| Modals, drawers          | 200-500ms     |\r\n| Marketing/explanatory    | Can be longer |\r\n\r\n**Rule: UI animations should stay under 300ms.** A 180ms dropdown feels more responsive than a 400ms one. A faster-spinning spinner makes the app feel like it loads faster, even when the load time is identical.\r\n\r\n### Perceived performance\r\n\r\nSpeed in animation is not just about feeling snappy — it directly affects how users perceive your app's performance:\r\n\r\n- A **fast-spinning spinner** makes loading feel faster (same load time, different perception)\r\n- A **180ms select** animation feels more responsive than a **400ms** one\r\n- **Instant tooltips** after the first one is open (skip delay + skip animation) make the whole toolbar feel faster\r\n\r\nThe perception of speed matters as much as actual speed. Easing amplifies this: `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms because the user sees immediate movement.\r\n\r\n## Spring Animations\r\n\r\nSprings feel more natural than duration-based animations because they simulate real physics. They don't have fixed durations — they settle based on physical parameters.\r\n\r\n### When to use springs\r\n\r\n- Drag interactions with momentum\r\n- Elements that should feel \"alive\" (like Apple's Dynamic Island)\r\n- Gestures that can be interrupted mid-animation\r\n- Decorative mouse-tracking interactions\r\n\r\n### Spring-based mouse interactions\r\n\r\nTying visual changes directly to mouse position feels artificial because it lacks motion. Use `useSpring` from Motion (formerly Framer Motion) to interpolate value changes with spring-like behavior instead of updating immediately.\r\n\r\n```jsx\r\nimport { useSpring } from 'framer-motion';\r\n\r\n// Without spring: feels artificial, instant\r\nconst rotation = mouseX * 0.1;\r\n\r\n// With spring: feels natural, has momentum\r\nconst springRotation = useSpring(mouseX * 0.1, {\r\n  stiffness: 100,\r\n  damping: 10,\r\n});\r\n```\r\n\r\nThis works because the animation is **decorative** — it doesn't serve a function. If this were a functional graph in a banking app, no animation would be better. Know when decoration helps and when it hinders.\r\n\r\n### Spring configuration\r\n\r\n**Apple's approach (recommended — easier to reason about):**\r\n\r\n```js\r\n{ type: \"spring\", duration: 0.5, bounce: 0.2 }\r\n```\r\n\r\n**Traditional physics (more control):**\r\n\r\n```js\r\n{ type: \"spring\", mass: 1, stiffness: 100, damping: 10 }\r\n```\r\n\r\nKeep bounce subtle (0.1-0.3) when used. Avoid bounce in most UI contexts. Use it for drag-to-dismiss and playful interactions.\r\n\r\n### Interruptibility advantage\r\n\r\nSprings maintain velocity when interrupted — CSS animations and keyframes restart from zero. This makes springs ideal for gestures users might change mid-motion. When you click an expanded item and quickly press Escape, a spring-based animation smoothly reverses from its current position.\r\n\r\n## Component Building Principles\r\n\r\n### Buttons must feel responsive\r\n\r\nAdd `transform: scale(0.97)` on `:active`. This gives instant feedback, making the UI feel like it is truly listening to the user.\r\n\r\n```css\r\n.button {\r\n  transition: transform 160ms ease-out;\r\n}\r\n\r\n.button:active {\r\n  transform: scale(0.97);\r\n}\r\n```\r\n\r\nThis applies to any pressable element. The scale should be subtle (0.95-0.98).\r\n\r\n### Never animate from scale(0)\r\n\r\nNothing in the real world disappears and reappears completely. Elements animating from `scale(0)` look like they come out of nowhere.\r\n\r\nStart from `scale(0.9)` or higher, combined with opacity. Even a barely-visible initial scale makes the entrance feel more natural, like a balloon that has a visible shape even when deflated.\r\n\r\n```css\r\n/* Bad */\r\n.entering {\r\n  transform: scale(0);\r\n}\r\n\r\n/* Good */\r\n.entering {\r\n  transform: scale(0.95);\r\n  opacity: 0;\r\n}\r\n```\r\n\r\n### Make popovers origin-aware\r\n\r\nPopovers should scale in from their trigger, not from center. The default `transform-origin: center` is wrong for almost every popover. **Exception: modals.** Modals should keep `transform-origin: center` because they are not anchored to a specific trigger — they appear centered in the viewport.\r\n\r\n```css\r\n/* Base UI */\r\n.popover {\r\n  transform-origin: var(--transform-origin);\r\n}\r\n```\r\n\r\nWhether the user notices the difference individually does not matter. In the aggregate, unseen details become visible. They compound.\r\n\r\n### Tooltips: skip delay on subsequent hovers\r\n\r\nTooltips should delay before appearing to prevent accidental activation. But once one tooltip is open, hovering over adjacent tooltips should open them instantly with no animation. This feels faster without defeating the purpose of the initial delay.\r\n\r\n```css\r\n.tooltip {\r\n  transition: transform 125ms ease-out, opacity 125ms ease-out;\r\n  transform-origin: var(--transform-origin);\r\n}\r\n\r\n.tooltip[data-starting-style],\r\n.tooltip[data-ending-style] {\r\n  opacity: 0;\r\n  transform: scale(0.97);\r\n}\r\n\r\n/* Skip animation on subsequent tooltips */\r\n.tooltip[data-instant] {\r\n  transition-duration: 0ms;\r\n}\r\n```\r\n\r\n### Use CSS transitions over keyframes for interruptible UI\r\n\r\nCSS transitions can be interrupted and retargeted mid-animation. Keyframes restart from zero. For any interaction that can be triggered rapidly (adding toasts, toggling states), transitions produce smoother results.\r\n\r\n```css\r\n/* Interruptible - good for UI */\r\n.toast {\r\n  transition: transform 400ms ease;\r\n}\r\n\r\n/* Not interruptible - avoid for dynamic UI */\r\n@keyframes slideIn {\r\n  from {\r\n    transform: translateY(100%);\r\n  }\r\n  to {\r\n    transform: translateY(0);\r\n  }\r\n}\r\n```\r\n\r\n### Use blur to mask imperfect transitions\r\n\r\nWhen a crossfade between two states feels off despite trying different easings and durations, add subtle `filter: blur(2px)` during the transition.\r\n\r\n**Why blur works:** Without blur, you see two distinct objects during a crossfade — the old state and the new state overlapping. This looks unnatural. Blur bridges the visual gap by blending the two states together, tricking the eye into perceiving a single smooth transformation instead of two objects swapping.\r\n\r\nCombine blur with scale-on-press (`scale(0.97)`) for a polished button state transition:\r\n\r\n```css\r\n.button {\r\n  transition: transform 160ms ease-out;\r\n}\r\n\r\n.button:active {\r\n  transform: scale(0.97);\r\n}\r\n\r\n.button-content {\r\n  transition: filter 200ms ease, opacity 200ms ease;\r\n}\r\n\r\n.button-content.transitioning {\r\n  filter: blur(2px);\r\n  opacity: 0.7;\r\n}\r\n```\r\n\r\nKeep blur under 20px. Heavy blur is expensive, especially in Safari.\r\n\r\n### Animate enter states with @starting-style\r\n\r\nThe modern CSS way to animate element entry without JavaScript:\r\n\r\n```css\r\n.toast {\r\n  opacity: 1;\r\n  transform: translateY(0);\r\n  transition: opacity 400ms ease, transform 400ms ease;\r\n\r\n  @starting-style {\r\n    opacity: 0;\r\n    transform: translateY(100%);\r\n  }\r\n}\r\n```\r\n\r\nThis replaces the common React pattern of using `useEffect` to set `mounted: true` after initial render. Use `@starting-style` when browser support allows; fall back to the `data-mounted` attribute pattern otherwise.\r\n\r\n```jsx\r\n// Legacy pattern (still works everywhere)\r\nuseEffect(() => {\r\n  setMounted(true);\r\n}, []);\r\n// <div data-mounted={mounted}>\r\n```\r\n\r\n## CSS Transform Mastery\r\n\r\n### translateY with percentages\r\n\r\nPercentage values in `translate()` are relative to the element's own size. Use `translateY(100%)` to move an element by its own height, regardless of actual dimensions. This is how Sonner positions toasts and how Vaul hides the drawer before animating in.\r\n\r\n```css\r\n/* Works regardless of drawer height */\r\n.drawer-hidden {\r\n  transform: translateY(100%);\r\n}\r\n\r\n/* Works regardless of toast height */\r\n.toast-enter {\r\n  transform: translateY(-100%);\r\n}\r\n```\r\n\r\nPrefer percentages over hardcoded pixel values. They are less error-prone and adapt to content.\r\n\r\n### scale() scales children too\r\n\r\nUnlike `width`/`height`, `scale()` also scales an element's children. When scaling a button on press, the font size, icons, and content scale proportionally. This is a feature, not a bug.\r\n\r\n### 3D transforms for depth\r\n\r\n`rotateX()`, `rotateY()` with `transform-style: preserve-3d` create real 3D effects in CSS. Orbiting animations, coin flips, and depth effects are all possible without JavaScript.\r\n\r\n```css\r\n.wrapper {\r\n  transform-style: preserve-3d;\r\n}\r\n\r\n@keyframes orbit {\r\n  from {\r\n    transform: translate(-50%, -50%) rotateY(0deg) translateZ(72px) rotateY(360deg);\r\n  }\r\n  to {\r\n    transform: translate(-50%, -50%) rotateY(360deg) translateZ(72px) rotateY(0deg);\r\n  }\r\n}\r\n```\r\n\r\n### transform-origin\r\n\r\nEvery element has an anchor point from which transforms execute. The default is center. Set it to match where the trigger lives for origin-aware interactions.\r\n\r\n## clip-path for Animation\r\n\r\n`clip-path` is not just for shapes. It is one of the most powerful animation tools in CSS.\r\n\r\n### The inset shape\r\n\r\n`clip-path: inset(top right bottom left)` defines a rectangular clipping region. Each value \"eats\" into the element from that side.\r\n\r\n```css\r\n/* Fully hidden from right */\r\n.hidden {\r\n  clip-path: inset(0 100% 0 0);\r\n}\r\n\r\n/* Fully visible */\r\n.visible {\r\n  clip-path: inset(0 0 0 0);\r\n}\r\n\r\n/* Reveal from left to right */\r\n.overlay {\r\n  clip-path: inset(0 100% 0 0);\r\n  transition: clip-path 200ms ease-out;\r\n}\r\n.button:active .overlay {\r\n  clip-path: inset(0 0 0 0);\r\n  transition: clip-path 2s linear;\r\n}\r\n```\r\n\r\n### Tabs with perfect color transitions\r\n\r\nDuplicate the tab list. Style the copy as \"active\" (different background, different text color). Clip the copy so only the active tab is visible. Animate the clip on tab change. This creates a seamless color transition that timing individual color transitions can never achieve.\r\n\r\n### Hold-to-delete pattern\r\n\r\nUse `clip-path: inset(0 100% 0 0)` on a colored overlay. On `:active`, transition to `inset(0 0 0 0)` over 2s with linear timing. On release, snap back with 200ms ease-out. Add `scale(0.97)` on the button for press feedback.\r\n\r\n### Image reveals on scroll\r\n\r\nStart with `clip-path: inset(0 0 100% 0)` (hidden from bottom). Animate to `inset(0 0 0 0)` when the element enters the viewport. Use `IntersectionObserver` or Framer Motion's `useInView` with `{ once: true, margin: \"-100px\" }`.\r\n\r\n### Comparison sliders\r\n\r\nOverlay two images. Clip the top one with `clip-path: inset(0 50% 0 0)`. Adjust the right inset value based on drag position. No extra DOM elements needed, fully hardware-accelerated.\r\n\r\n## Gesture and Drag Interactions\r\n\r\n### Momentum-based dismissal\r\n\r\nDon't require dragging past a threshold. Calculate velocity: `Math.abs(dragDistance) / elapsedTime`. If velocity exceeds ~0.11, dismiss regardless of distance. A quick flick should be enough.\r\n\r\n```js\r\nconst timeTaken = new Date().getTime() - dragStartTime.current.getTime();\r\nconst velocity = Math.abs(swipeAmount) / timeTaken;\r\n\r\nif (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {\r\n  dismiss();\r\n}\r\n```\r\n\r\n### Damping at boundaries\r\n\r\nWhen a user drags past the natural boundary (e.g., dragging a drawer up when already at top), apply damping. The more they drag, the less the element moves. Things in real life don't suddenly stop; they slow down first.\r\n\r\n### Pointer capture for drag\r\n\r\nOnce dragging starts, set the element to capture all pointer events. This ensures dragging continues even if the pointer leaves the element bounds.\r\n\r\n### Multi-touch protection\r\n\r\nIgnore additional touch points after the initial drag begins. Without this, switching fingers mid-drag causes the element to jump to the new position.\r\n\r\n```js\r\nfunction onPress() {\r\n  if (isDragging) return;\r\n  // Start drag...\r\n}\r\n```\r\n\r\n### Friction instead of hard stops\r\n\r\nInstead of preventing upward drag entirely, allow it with increasing friction. It feels more natural than hitting an invisible wall.\r\n\r\n## Performance Rules\r\n\r\n### Only animate transform and opacity\r\n\r\nThese properties skip layout and paint, running on the GPU. Animating `padding`, `margin`, `height`, or `width` triggers all three rendering steps.\r\n\r\n### CSS variables are inheritable\r\n\r\nChanging a CSS variable on a parent recalculates styles for all children. In a drawer with many items, updating `--swipe-amount` on the container causes expensive style recalculation. Update `transform` directly on the element instead.\r\n\r\n```js\r\n// Bad: triggers recalc on all children\r\nelement.style.setProperty('--swipe-amount', `${distance}px`);\r\n\r\n// Good: only affects this element\r\nelement.style.transform = `translateY(${distance}px)`;\r\n```\r\n\r\n### Framer Motion hardware acceleration caveat\r\n\r\nFramer Motion's shorthand properties (`x`, `y`, `scale`) are NOT hardware-accelerated. They use `requestAnimationFrame` on the main thread. For hardware acceleration, use the full `transform` string:\r\n\r\n```jsx\r\n// NOT hardware accelerated (convenient but drops frames under load)\r\n<motion.div animate={{ x: 100 }} />\r\n\r\n// Hardware accelerated (stays smooth even when main thread is busy)\r\n<motion.div animate={{ transform: \"translateX(100px)\" }} />\r\n```\r\n\r\nThis matters when the browser is simultaneously loading content, running scripts, or painting. At Vercel, the dashboard tab animation used Shared Layout Animations and dropped frames during page loads. Switching to CSS animations (off main thread) fixed it.\r\n\r\n### CSS animations beat JS under load\r\n\r\nCSS animations run off the main thread. When the browser is busy loading a new page, Framer Motion animations (using `requestAnimationFrame`) drop frames. CSS animations remain smooth. Use CSS for predetermined animations; JS for dynamic, interruptible ones.\r\n\r\n### Use WAAPI for programmatic CSS animations\r\n\r\nThe Web Animations API gives you JavaScript control with CSS performance. Hardware-accelerated, interruptible, and no library needed.\r\n\r\n```js\r\nelement.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], {\r\n  duration: 1000,\r\n  fill: 'forwards',\r\n  easing: 'cubic-bezier(0.77, 0, 0.175, 1)',\r\n});\r\n```\r\n\r\n## Accessibility\r\n\r\n### prefers-reduced-motion\r\n\r\nAnimations can cause motion sickness. Reduced motion means fewer and gentler animations, not zero. Keep opacity and color transitions that aid comprehension. Remove movement and position animations.\r\n\r\n```css\r\n@media (prefers-reduced-motion: reduce) {\r\n  .element {\r\n    animation: fade 0.2s ease;\r\n    /* No transform-based motion */\r\n  }\r\n}\r\n```\r\n\r\n```jsx\r\nconst shouldReduceMotion = useReducedMotion();\r\nconst closedX = shouldReduceMotion ? 0 : '-100%';\r\n```\r\n\r\n### Touch device hover states\r\n\r\n```css\r\n@media (hover: hover) and (pointer: fine) {\r\n  .element:hover {\r\n    transform: scale(1.05);\r\n  }\r\n}\r\n```\r\n\r\nTouch devices trigger hover on tap, causing false positives. Gate hover animations behind this media query.\r\n\r\n## The Sonner Principles (Building Loved Components)\r\n\r\nThese principles come from building Sonner (13M+ weekly npm downloads) and apply to any component:\r\n\r\n1. **Developer experience is key.** No hooks, no context, no complex setup. Insert `<Toaster />` once, call `toast()` from anywhere. The less friction to adopt, the more people will use it.\r\n\r\n2. **Good defaults matter more than options.** Ship beautiful out of the box. Most users never customize. The default easing, timing, and visual design should be excellent.\r\n\r\n3. **Naming creates identity.** \"Sonner\" (French for \"to ring\") feels more elegant than \"react-toast\". Sacrifice discoverability for memorability when appropriate.\r\n\r\n4. **Handle edge cases invisibly.** Pause toast timers when the tab is hidden. Fill gaps between stacked toasts with pseudo-elements to maintain hover state. Capture pointer events during drag. Users never notice these, and that is exactly right.\r\n\r\n5. **Use transitions, not keyframes, for dynamic UI.** Toasts are added rapidly. Keyframes restart from zero on interruption. Transitions retarget smoothly.\r\n\r\n6. **Build a great documentation site.** Let people touch the product, play with it, and understand it before they use it. Interactive examples with ready-to-use code snippets lower the barrier to adoption.\r\n\r\n### Cohesion matters\r\n\r\nSonner's animation feels satisfying partly because the whole experience is cohesive. The easing and duration fit the vibe of the library. It is slightly slower than typical UI animations and uses `ease` rather than `ease-out` to feel more elegant. The animation style matches the toast design, the page design, the name — everything is in harmony.\r\n\r\nWhen choosing animation values, consider the personality of the component. A playful component can be bouncier. A professional dashboard should be crisp and fast. Match the motion to the mood.\r\n\r\n### The opacity + height combination\r\n\r\nWhen items enter and exit a list (like Family's drawer), the opacity change must work well with the height animation. This is often trial and error. There is no formula — you adjust until it feels right.\r\n\r\n### Review your work the next day\r\n\r\nReview animations with fresh eyes. You notice imperfections the next day that you missed during development. Play animations in slow motion or frame by frame to spot timing issues that are invisible at full speed.\r\n\r\n### Asymmetric enter/exit timing\r\n\r\nPressing should be slow when it needs to be deliberate (hold-to-delete: 2s linear), but release should always be snappy (200ms ease-out). This pattern applies broadly: slow where the user is deciding, fast where the system is responding.\r\n\r\n```css\r\n/* Release: fast */\r\n.overlay {\r\n  transition: clip-path 200ms ease-out;\r\n}\r\n\r\n/* Press: slow and deliberate */\r\n.button:active .overlay {\r\n  transition: clip-path 2s linear;\r\n}\r\n```\r\n\r\n## Stagger Animations\r\n\r\nWhen multiple elements enter together, stagger their appearance. Each element animates in with a small delay after the previous one. This creates a cascading effect that feels more natural than everything appearing at once.\r\n\r\n```css\r\n.item {\r\n  opacity: 0;\r\n  transform: translateY(8px);\r\n  animation: fadeIn 300ms ease-out forwards;\r\n}\r\n\r\n.item:nth-child(1) {\r\n  animation-delay: 0ms;\r\n}\r\n.item:nth-child(2) {\r\n  animation-delay: 50ms;\r\n}\r\n.item:nth-child(3) {\r\n  animation-delay: 100ms;\r\n}\r\n.item:nth-child(4) {\r\n  animation-delay: 150ms;\r\n}\r\n\r\n@keyframes fadeIn {\r\n  to {\r\n    opacity: 1;\r\n    transform: translateY(0);\r\n  }\r\n}\r\n```\r\n\r\nKeep stagger delays short (30-80ms between items). Long delays make the interface feel slow. Stagger is decorative — never block interaction while stagger animations are playing.\r\n\r\n## Debugging Animations\r\n\r\n### Slow motion testing\r\n\r\nPlay animations at reduced speed to spot issues invisible at full speed. Temporarily increase duration to 2-5x normal, or use browser DevTools animation inspector to slow playback.\r\n\r\nThings to look for in slow motion:\r\n\r\n- Do colors transition smoothly, or do you see two distinct states overlapping?\r\n- Does the easing feel right, or does it start/stop abruptly?\r\n- Is the transform-origin correct, or does the element scale from the wrong point?\r\n- Are multiple animated properties (opacity, transform, color) in sync?\r\n\r\n### Frame-by-frame inspection\r\n\r\nStep through animations frame by frame in Chrome DevTools (Animations panel). This reveals timing issues between coordinated properties that you cannot see at full speed.\r\n\r\n### Test on real devices\r\n\r\nFor touch interactions (drawers, swipe gestures), test on physical devices. Connect your phone via USB, visit your local dev server by IP address, and use Safari's remote devtools. The Xcode Simulator is an alternative but real hardware is better for gesture testing.\r\n\r\n## Review Checklist\r\n\r\nWhen reviewing UI code, check for:\r\n\r\n| Issue                                      | Fix                                                              |\r\n| ------------------------------------------ | ---------------------------------------------------------------- |\r\n| `transition: all`                          | Specify exact properties: `transition: transform 200ms ease-out` |\r\n| `scale(0)` entry animation                 | Start from `scale(0.95)` with `opacity: 0`                       |\r\n| `ease-in` on UI element                    | Switch to `ease-out` or custom curve                             |\r\n| `transform-origin: center` on popover      | Set to trigger location or use Base UI's `var(--transform-origin)` (modals are exempt — keep centered) |\r\n| Animation on keyboard action               | Remove animation entirely                                        |\r\n| Duration > 300ms on UI element             | Reduce to 150-250ms                                              |\r\n| Hover animation without media query        | Add `@media (hover: hover) and (pointer: fine)`                  |\r\n| Keyframes on rapidly-triggered element     | Use CSS transitions for interruptibility                         |\r\n| Framer Motion `x`/`y` props under load     | Use `transform: \"translateX()\"` for hardware acceleration        |\r\n| Same enter/exit transition speed           | Make exit faster than enter (e.g., enter 2s, exit 200ms)         |\r\n| Elements all appear at once                | Add stagger delay (30-80ms between items)                        |\n</skill_content>\n"
}
```

## Assistant

<thinking>
**Considering response strategy**

I see that the instruction specifies to respond only if there’s no specific question. Since we invoked this in the middle of a task, it seems like a response may not be necessary. I also need to read from additional sources and possibly utilize the multi-parallel feature, maybe 18 readings, to gather the necessary information efficiently. This will help ensure I’m well-informed before proceeding!
</thinking>

**Tool Call: Read file `app\layout.tsx` (lines 1-240)**
Status: Completed

```Smartli V2\app\layout.tsx
     1	import './globals.css';
     2	import { Metadata } from 'next';
     3	import { AppDock } from '@/components/navigation/app-dock';
     4	
     5	export const metadata: Metadata = {
     6	  title: 'Smartli | AI Study Companion',
     7	  description: 'Elevate your learning with AI-powered study tools',
     8	};
     9	
    10	export default function RootLayout({
    11	  children,
    12	}: {
    13	  children: React.ReactNode;
    14	}) {
    15	  return (
    16	    <html lang="en">
    17	      <body className="font-sans antialiased min-h-screen relative">
    18	        <main className="pb-28">{children}</main>
    19	        <AppDock />
    20	      </body>
    21	    </html>
    22	  );
    23	}
    24	

```


**Tool Call: Read file `app\template.tsx` (lines 1-240)**
Status: Completed

```Smartli V2\app\template.tsx
     1	'use client';
     2	
     3	import { motion } from 'framer-motion';
     4	
     5	export default function Template({ children }: { children: React.ReactNode }) {
     6	  return (
     7	    <motion.div
     8	      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
     9	      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    10	      transition={{
    11	        type: 'spring',
    12	        duration: 0.6,
    13	        bounce: 0, // Critically damped for a professional, "Apple" feel
    14	      }}
    15	    >
    16	      {children}
    17	    </motion.div>
    18	  );
    19	}

```


**Tool Call: Read file `app\ai\page.tsx` (lines 1-320)**
Status: Completed

```Smartli V2\app\ai\page.tsx
     1	import { AiPromptBoxDemo } from '@/components/ai/ai-prompt-box-demo';
     2	
     3	export default function AIPage() {
     4	  return (
     5	    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
     6	      {/* Dynamic background element */}
     7	      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(155,135,245,0.08),transparent_50%)]" />
     8	      
     9	      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9b87f5]/5 blur-[120px]" />
    10	      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4 mt-20">
    11	        <AiPromptBoxDemo />
    12	      </div>
    13	    </div>
    14	  );
    15	}

```


**Tool Call: Read file `app\learning\explainer\page.tsx` (lines 1-360)**
Status: Completed

```Smartli V2\app\learning\explainer\page.tsx
     1	'use client';
     2	
     3	import React, { useState } from 'react';
     4	import { useAIStream } from '@/hooks/useAIStream';
     5	import { StreamingResponse } from '@/components/ai/StreamingResponse';
     6	import { Button } from '@/components/ui/Button';
     7	import { Input } from '@/components/ui/input';
     8	import { Card } from '@/components/ui/card';
     9	import { cn } from '@/lib/utils';
    10	import { Send, Sparkles, GraduationCap, Loader2, Pause } from 'lucide-react';
    11	import { AIExplainerMode } from '@/types';
    12	
    13	export default function ExplainerPage() {
    14	  const [input, setInput] = useState('');
    15	  const [mode, setMode] = useState<AIExplainerMode>('explainer');
    16	  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
    17	
    18	  const handleSubmit = async (e: React.FormEvent) => {
    19	    e.preventDefault();
    20	    if (!input.trim()) return;
    21	
    22	    await startStream({
    23	      prompt: input,
    24	      mode: mode,
    25	    });
    26	  };
    27	
    28	  return (
    29	    <div className="max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
    30	      <header className="flex items-center justify-between mb-8">
    31	        <div>
    32	          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
    33	            <Sparkles className="text-primary" /> AI Explainer
    34	          </h1>
    35	          <p className="text-muted-foreground">Deep dive into any topic with pedagogical precision.</p>
    36	        </div>
    37	
    38	        <div className="flex gap-2 p-1 bg-muted rounded-full">
    39	          {(['explainer', 'tutor', 'eli5'] as AIExplainerMode[]).map((m) => (
    40	            <button
    41	              key={m}
    42	              onClick={() => setMode(m)}
    43	              className={cn(
    44	                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
    45	                mode === m
    46	                  ? 'bg-background text-foreground shadow-sm'
    47	                  : 'text-muted-foreground hover:text-foreground'
    48	              )}
    49	            >
    50	              {m === 'explainer' && 'Explainer'}
    51	              {m === 'tutor' && 'Tutor'}
    52	              {m === 'eli5' && 'ELI5'}
    53	            </button>
    54	          ))}
    55	        </div>
    56	      </header>
    57	
    58	      <main className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4">
    59	        {!streamText && !isLoading && (
    60	          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
    61	            <GraduationCap size={48} className="text-muted-foreground" />
    62	            <p className="text-muted-foreground max-w-sm">
    63	              Ask me to explain a complex concept, or paste your notes to get a deep dive.
    64	            </p>
    65	          </div>
    66	        )}
    67	
    68	        {error && (
    69	          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm">
    70	            {error.message}
    71	          </div>
    72	        )}
    73	
    74	        {streamText && (
    75	          <Card className="p-6 shadow-sm animate-fade-in border-border/50">
    76	            <StreamingResponse text={streamText} />
    77	          </Card>
    78	        )}
    79	
    80	        {isLoading && !streamText && (
    81	          <div className="flex items-center justify-center p-12">
    82	            <Loader2 className="animate-spin text-muted-foreground" size={32} />
    83	          </div>
    84	        )}
    85	      </main>
    86	
    87	      <form onSubmit={handleSubmit} className="relative">
    88	        <Input
    89	          type="text"
    90	          value={input}
    91	          onChange={(e) => setInput(e.target.value)}
    92	          placeholder={
    93	            mode === 'tutor'
    94	              ? "Ask a follow-up question..."
    95	              : mode === 'eli5'
    96	              ? "What should I explain simply?"
    97	              : "What do you want to learn today?"
    98	          }
    99	          className="pr-16 h-14 rounded-2xl focus:ring-primary"
   100	        />
   101	        <div className="absolute right-2 top-2">
   102	          {isLoading ? (
   103	            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" onClick={stopStream}>
   104	              <Pause size={18} />
   105	            </Button>
   106	          ) : (
   107	            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" type="submit">
   108	              <Send size={18} />
   109	            </Button>
   110	          )}
   111	        </div>
   112	      </form>
   113	    </div>
   114	  );
   115	}

```


**Tool Call: Read file `app\learning\quiz\page.tsx` (lines 1-420)**
Status: Completed

```Smartli V2\app\learning\quiz\page.tsx
     1	'use client';
     2	
     3	import React, { useState } from 'react';
     4	import { useAIStream } from '@/hooks/useAIStream';
     5	import { StreamingResponse } from '@/components/ai/StreamingResponse';
     6	import { Button } from '@/components/ui/Button';
     7	import { Card } from '@/components/ui/card';
     8	import { Textarea } from '@/components/ui/textarea';
     9	import { cn } from '@/lib/utils';
    10	import { FileText, ListChecks, BrainCircuit, BookOpen, Loader2, Send, Pause } from 'lucide-react';
    11	import { QuizType } from '@/types';
    12	
    13	export default function QuizPage() {
    14	  const [input, setInput] = useState('');
    15	  const [quizType, setQuizType] = useState<QuizType>('mcq');
    16	  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
    17	
    18	  const handleSubmit = async (e: React.FormEvent) => {
    19	    e.preventDefault();
    20	    if (!input.trim()) return;
    21	
    22	    await startStream({
    23	      prompt: `Generate a ${quizType} quiz based on the following content. Please follow a pedagogical progression from basic recall to higher-order analysis.`,
    24	      context: input,
    25	      mode: 'quiz',
    26	      quizType: quizType,
    27	    });
    28	  };
    29	
    30	  return (
    31	    <div className="max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
    32	      <header className="flex items-center justify-between mb-8">
    33	        <div>
    34	          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
    35	            <ListChecks className="text-primary" /> AI Quiz Generator
    36	          </h1>
    37	          <p className="text-muted-foreground">Transform your notes into high-fidelity assessments.</p>
    38	        </div>
    39	
    40	        <div className="flex gap-2 p-1 bg-muted rounded-full">
    41	          {(['mcq', 'exam', 'competency', 'reasoning'] as QuizType[]).map((t) => (
    42	            <button
    43	              key={t}
    44	              onClick={() => setQuizType(t)}
    45	              className={cn(
    46	                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
    47	                quizType === t
    48	                  ? 'bg-background text-foreground shadow-sm'
    49	                  : 'text-muted-foreground hover:text-foreground'
    50	              )}
    51	            >
    52	              {t === 'mcq' && 'MCQ'}
    53	              {t === 'exam' && 'Exam'}
    54	              {t === 'competency' && 'Competency'}
    55	              {t === 'reasoning' && 'Reasoning'}
    56	            </button>
    57	          ))}
    58	        </div>
    59	      </header>
    60	
    61	      <main className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4">
    62	        {!streamText && !isLoading && (
    63	          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
    64	            <BrainCircuit size={48} className="text-muted-foreground" />
    65	            <p className="text-muted-foreground max-w-sm">
    66	              Paste your notes or a document's text here to generate a structured quiz.
    67	            </p>
    68	          </div>
    69	        )}
    70	
    71	        {error && (
    72	          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm">
    73	            {error.message}
    74	          </div>
    75	        )}
    76	
    77	        {streamText && (
    78	          <Card className="p-6 shadow-sm animate-fade-in border-border/50">
    79	            <StreamingResponse text={streamText} />
    80	          </Card>
    81	        )}
    82	
    83	        {isLoading && !streamText && (
    84	          <div className="flex items-center justify-center p-12">
    85	            <Loader2 className="animate-spin text-muted-foreground" size={32} />
    86	          </div>
    87	        )}
    88	      </main>
    89	
    90	      <form onSubmit={handleSubmit} className="relative">
    91	        <Textarea
    92	          value={input}
    93	          onChange={(e) => setInput(e.target.value)}
    94	          placeholder="Paste your notes here..."
    95	          className="pr-16 min-h-[120px] resize-none rounded-2xl focus:ring-primary"
    96	        />
    97	        <div className="absolute right-3 bottom-3">
    98	          {isLoading ? (
    99	            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" onClick={stopStream}>
   100	              <Pause size={18} />
   101	            </Button>
   102	          ) : (
   103	            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" type="submit">
   104	              <Send size={18} />
   105	            </Button>
   106	          )}
   107	        </div>
   108	      </form>
   109	    </div>
   110	  );
   111	}

```


**Tool Call: Read file `components\navigation\app-dock.tsx` (lines 1-280)**
Status: Completed

```Smartli V2\components\navigation\app-dock.tsx
     1	'use client';
     2	
     3	import { useState, useTransition } from 'react';
     4	import Link from 'next/link';
     5	import { usePathname, useRouter } from 'next/navigation';
     6	import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
     7	import {
     8	  Home,
     9	  Sparkles,
    10	  Timer,
    11	  ListChecks,
    12	  TrendingUp,
    13	  CalendarDays,
    14	  Settings,
    15	  UserCircle,
    16	  type LucideIcon,
    17	} from 'lucide-react';
    18	import { Dock, DockIcon, DockDivider } from '@/components/ui/dock';
    19	import { cn } from '@/lib/utils';
    20	
    21	interface NavItem {
    22	  href: string;
    23	  label: string;
    24	  icon: LucideIcon;
    25	}
    26	
    27	const homeGroup: NavItem[] = [{ href: '/', label: 'Home', icon: Home }];
    28	
    29	const workspaceGroup: NavItem[] = [
    30	  { href: '/ai', label: 'AI', icon: Sparkles },
    31	  { href: '/focus', label: 'Focus Hub', icon: Timer },
    32	  { href: '/tasks', label: 'Tasks', icon: ListChecks },
    33	  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
    34	];
    35	
    36	const systemGroup: NavItem[] = [
    37	  { href: '/plan', label: 'Plan', icon: CalendarDays },
    38	  { href: '/settings', label: 'Settings', icon: Settings },
    39	  { href: '/account', label: 'Account', icon: UserCircle },
    40	];
    41	
    42	function isPathActive(pathname: string, href: string) {
    43	  if (href === '/') return pathname === '/';
    44	  return pathname === href || pathname.startsWith(`${href}/`);
    45	}
    46	
    47	// Spring config for the press-down / release animation.
    48	// ζ ≈ 0.75 → slightly underdamped so the release has a small physical pop.
    49	const PRESS_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const;
    50	
    51	function AppDockIcon({ href, label, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
    52	  const [hovered, setHovered] = useState(false);
    53	  const [isPending, startTransition] = useTransition();
    54	  const router = useRouter();
    55	  const shouldReduceMotion = useReducedMotion();
    56	
    57	  const handleNavigate = (e: React.MouseEvent) => {
    58	    // Standard Next.js Link behavior is on release (click).
    59	    // Fluid interfaces respond on press-down or immediately on click.
    60	    // We'll use useTransition to prioritize the UI feedback (active state) 
    61	    // over the heavy page-loading transition.
    62	    e.preventDefault();
    63	    startTransition(() => {
    64	      router.push(href);
    65	    });
    66	  };
    67	
    68	  return (
    69	    <DockIcon
    70	      onMouseEnter={() => setHovered(true)}
    71	      onMouseLeave={() => setHovered(false)}
    72	      onFocus={() => setHovered(true)}
    73	      onBlur={() => setHovered(false)}
    74	    >
    75	      {/*
    76	       * Press animation wrapper — scales only the icon + active pill, NOT the tooltip.
    77	       * Reduced motion: swap transform for a gentler opacity dip.
    78	       */}
    79	      <motion.div
    80	        onPointerDown={handleNavigate}
    81	        whileTap={
    82	          shouldReduceMotion
    83	            ? { opacity: 0.7 }
    84	            : { scale: 0.9 }
    85	        }
    86	        transition={PRESS_SPRING}
    87	        className={cn(
    88	          "relative flex h-full w-full items-center justify-center cursor-pointer",
    89	          isPending && "opacity-70"
    90	        )}
    91	      >
    92	        {(isActive || isPending) && (
    93	          <motion.div
    94	            layoutId="dock-active-highlight"
    95	            className="absolute inset-0 rounded-full bg-foreground/10"
    96	            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
    97	          />
    98	        )}
    99	
   100	        <div
   101	          className={cn(
   102	            'relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-150',
   103	            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
   104	          )}
   105	        >
   106	          <Icon size={20} strokeWidth={2} />
   107	        </div>
   108	      </motion.div>
   109	
   110	      {/* Tooltip — sibling of the press wrapper, so it is unaffected by whileTap */}
   111	      <AnimatePresence>
   112	        {hovered && (
   113	          <motion.span
   114	            initial={
   115	              shouldReduceMotion
   116	                ? { opacity: 0 }
   117	                : { opacity: 0, scale: 0.85, y: 4 }
   118	            }
   119	            animate={
   120	              shouldReduceMotion
   121	                ? { opacity: 1 }
   122	                : { opacity: 1, scale: 1, y: 0 }
   123	            }
   124	            exit={
   125	              shouldReduceMotion
   126	                ? { opacity: 0, transition: { duration: 0.12 } }
   127	                : {
   128	                    opacity: 0,
   129	                    scale: 0.96,
   130	                    y: 2,
   131	                    transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
   132	                  }
   133	            }
   134	            transition={
   135	              shouldReduceMotion
   136	                ? { duration: 0.15 }
   137	                : { type: 'spring', duration: 0.32, bounce: 0.22 }
   138	            }
   139	            style={{ left: '50%', x: '-50%', transformOrigin: 'bottom center' }}
   140	            className="pointer-events-none absolute bottom-[60px] z-20 whitespace-nowrap rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg backdrop-blur-sm"
   141	          >
   142	            {label}
   143	          </motion.span>
   144	        )}
   145	      </AnimatePresence>
   146	    </DockIcon>
   147	  );
   148	}
   149	
   150	export function AppDock() {
   151	  const pathname = usePathname();
   152	  const shouldReduceMotion = useReducedMotion();
   153	
   154	  return (
   155	    <nav
   156	      aria-label="Primary"
   157	      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
   158	      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
   159	    >
   160	      {/*
   161	       * direction="bottom" → icons are bottom-aligned inside the auto-height dock.
   162	       * When a nearby icon magnifies (40→72px) it grows UPWARD, expanding that
   163	       * section of the dock visually while the dock's bottom edge stays anchored.
   164	       */}
   165	      <Dock
   166	        direction="bottom"
   167	        disableMagnification={Boolean(shouldReduceMotion)}
   168	      >
   169	        {homeGroup.map((item) => (
   170	          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
   171	        ))}
   172	
   173	        <DockDivider />
   174	
   175	        {workspaceGroup.map((item) => (
   176	          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
   177	        ))}
   178	
   179	        <DockDivider />
   180	
   181	        {systemGroup.map((item) => (
   182	          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
   183	        ))}
   184	      </Dock>
   185	    </nav>
   186	  );
   187	}

```


**Tool Call: Read file `hooks\useAIStream.ts` (lines 1-320)**
Status: Completed

```Smartli V2\hooks\useAIStream.ts
     1	import { useState, useRef, useCallback } from 'react';
     2	import { AIRequest } from '@/lib/ai/config';
     3	import { getCachedResponse, setCachedResponse } from '@/lib/ai/cache';
     4	import { filterAIStream } from '@/lib/ai/config';
     5	
     6	export function useAIStream() {
     7	  const [streamText, setStreamText] = useState('');
     8	  const [isLoading, setIsLoading] = useState(false);
     9	  const [error, setError] = useState<Error | null>(null);
    10	  const [isComplete, setIsComplete] = useState(false);
    11	
    12	  const abortControllerRef = useRef<AbortController | null>(null);
    13	
    14	  const startStream = useCallback(async (request: AIRequest) => {
    15	    // Reset state
    16	    setStreamText('');
    17	    setIsLoading(true);
    18	    setError(null);
    19	    setIsComplete(false);
    20	
    21	    // 1. Check Cache
    22	    const cached = getCachedResponse(request.prompt, request.mode || 'explainer');
    23	    if (cached) {
    24	      setStreamText(cached);
    25	      setIsLoading(false);
    26	      setIsComplete(true);
    27	      return;
    28	    }
    29	
    30	    try {
    31	      abortControllerRef.current = new AbortController();
    32	
    33	      const response = await fetch('/api/ai/stream', {
    34	        method: 'POST',
    35	        headers: {
    36	          'Content-Type': 'application/json',
    37	        },
    38	        body: JSON.stringify(request),
    39	        signal: abortControllerRef.current.signal,
    40	      });
    41	
    42	      if (!response.ok) {
    43	        const errorData = await response.json();
    44	        throw new Error(errorData.error || 'AI streaming failed');
    45	      }
    46	
    47	      const responseStream = response.body;
    48	      if (!responseStream) throw new Error('No response body received');
    49	
    50	      const reader = responseStream.getReader();
    51	      const decoder = new TextDecoder();
    52	      let accumulatedText = '';
    53	
    54	      while (true) {
    55	        const { done, value } = await reader.read();
    56	        if (done) break;
    57	
    58	        const chunk = decoder.decode(value, { stream: true });
    59	        accumulatedText += chunk;
    60	
    61	        // 2. Real-time cleaning
    62	        const filteredText = filterAIStream(accumulatedText);
    63	        setStreamText(filteredText);
    64	      }
    65	
    66	      // 3. Cache the final result
    67	      setCachedResponse(request.prompt, request.mode || 'explainer', filterAIStream(accumulatedText));
    68	      setIsComplete(true);
    69	    } catch (err) {
    70	      if ((err as Error).name === 'AbortError') {
    71	        console.log('Stream aborted');
    72	      } else {
    73	        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    74	      }
    75	    } finally {
    76	      setIsLoading(false);
    77	      abortControllerRef.current = null;
    78	    }
    79	  }, []);
    80	
    81	  const stopStream = useCallback(() => {
    82	    if (abortControllerRef.current) {
    83	      abortControllerRef.current.abort();
    84	    }
    85	  }, []);
    86	
    87	  return {
    88	    streamText,
    89	    isLoading,
    90	    error,
    91	    isComplete,
    92	    startStream,
    93	    stopStream,
    94	  };
    95	}

```


**Tool Call: Read file `types\index.ts` (lines 1-260)**
Status: Completed

```Smartli V2\types\index.ts
     1	export type SubscriptionTier = 'Free' | 'Plus' | 'Pro';
     2	
     3	export type Priority = 'Low' | 'Medium' | 'High';
     4	
     5	export type AIExplainerMode = 'explainer' | 'tutor' | 'eli5';
     6	
     7	export type QuizType = 'mcq' | 'exam' | 'competency' | 'reasoning';
     8	
     9	export interface AIRequest {
    10	  prompt: string;
    11	  context?: string;
    12	  mode?: AIExplainerMode;
    13	  quizType?: QuizType;
    14	}
    15	
    16	export interface AIResponse {
    17	  content: string;
    18	  suggestions?: string[];
    19	}
    20	
    21	export interface UserProfile {
    22	  id: string;
    23	  email: string;
    24	  grade_level: string;
    25	  curriculum: string;
    26	  subscription_status: SubscriptionTier;
    27	  updated_at: string;
    28	}
    29	
    30	export interface StudyTask {
    31	  id: string;
    32	  user_id: string;
    33	  title: string;
    34	  priority: Priority;
    35	  subject: string;
    36	  deadline: Date;
    37	  completed: boolean;
    38	  created_at: string;
    39	}
    40	
    41	export interface QuizSet {
    42	  id: string;
    43	  user_id: string;
    44	  title: string;
    45	  type: QuizType;
    46	  questions: QuizQuestion[];
    47	  created_at: string;
    48	}
    49	
    50	export interface QuizQuestion {
    51	  id: string;
    52	  question: string;
    53	  options?: string[]; // For MCQ
    54	  correctAnswer: string;
    55	  explanation: string;
    56	  difficulty: 'Easy' | 'Medium' | 'Hard';
    57	  category: string;
    58	}
    59	
    60	export interface TopicMastery {
    61	  subject: string;
    62	  percentage: number;
    63	  lastUpdated: string;
    64	}
    65	
    66	export interface DashboardStats {
    67	  user_id: string;
    68	  totalStudyTime: number; // in minutes
    69	  currentStreak: number;
    70	  mastery: TopicMastery[];
    71	}

```


**Tool Call: Read file `lib\supabase\client.ts` (lines 1-160)**
Status: Completed

```Smartli V2\lib\supabase\client.ts
     1	import { createClient } from '@supabase/supabase-js';
     2	
     3	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
     4	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
     5	
     6	export const supabase = createClient(supabaseUrl, supabaseAnonKey);
     7	
     8	export type Profile = {
     9	  id: string;
    10	  grade_level: string;
    11	  curriculum: string;
    12	  subscription_status: 'Free' | 'Plus' | 'Pro';
    13	  updated_at: string;
    14	};
    15	
    16	export type StudyTask = {
    17	  id: string;
    18	  user_id: string;
    19	  title: string;
    20	  priority: 'Low' | 'Medium' | 'High';
    21	  subject: string;
    22	  deadline: string;
    23	  completed: boolean;
    24	  created_at: string;
    25	};
    26	
    27	export type Quiz = {
    28	  id: string;
    29	  user_id: string;
    30	  title: string;
    31	  content: any; // Structured quiz data
    32	  created_at: string;
    33	};
    34	
    35	export type DashboardStats = {
    36	  user_id: string;
    37	  total_study_time: number;
    38	  current_streak: number;
    39	  topic_mastery: Record<string, number>; // subject -> percentage
    40	};

```


**Tool Call: Read file `app\api\ai\stream\route.ts` (lines 1-360)**
Status: Completed

```Smartli V2\app\api\ai\stream\route.ts
     1	import { NextRequest, NextResponse } from 'next/server';
     2	import { streamAIResponse } from '@/lib/ai/gateway';
     3	import { AIRequest } from '@/lib/ai/config';
     4	
     5	export async function POST(req: NextRequest) {
     6	  try {
     7	    const body: AIRequest = await req.json();
     8	    const stream = await streamAIResponse(body);
     9	
    10	    return new NextResponse(stream, {
    11	      headers: {
    12	        'Content-Type': 'text/event-stream',
    13	        'Cache-Control': 'no-cache',
    14	        'Connection': 'keep-alive',
    15	      },
    16	    });
    17	  } catch (error: any) {
    18	    return NextResponse.json({ error: error.message }, { status: 500 });
    19	  }
    20	}

```


**Tool Call: Read file `components\ai\StreamingResponse.tsx` (lines 1-320)**
Status: Completed

```Smartli V2\components\ai\StreamingResponse.tsx
     1	'use client';
     2	
     3	import React, { useMemo } from 'react';
     4	import { motion, AnimatePresence } from 'framer-motion';
     5	import { cn } from '@/lib/utils'; // I need to create this utility first
     6	
     7	interface StreamingResponseProps {
     8	  text: string;
     9	  className?: string;
    10	}
    11	
    12	export const StreamingResponse = ({ text, className }: StreamingResponseProps) => {
    13	  // Tokenize text into words to animate them individually
    14	  const tokens = useMemo(() => {
    15	    // Split by whitespace but keep the whitespace in the tokens
    16	    return text.split(/(\s+)/);
    17	  }, [text]);
    18	
    19	  return (
    20	    <div className={cn('leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200', className)}>
    21	      <AnimatePresence mode="popLayout">
    22	        {tokens.map((token, index) => (
    23	          <motion.span
    24	            key={`${index}-${token}`}
    25	            initial={{ opacity: 0, scale: 0.95 }}
    26	            animate={{ opacity: 1, scale: 1 }}
    27	            transition={{
    28	              duration: 0.2,
    29	              ease: [0.23, 1, 0.32, 1], // --ease-out-strong
    30	              delay: 0 // we can add a small stagger if desired, but streaming already provides it
    31	            }}
    32	            className="inline-block"
    33	          >
    34	            {token}
    35	          </motion.span>
    36	        ))}
    37	      </AnimatePresence>
    38	    </div>
    39	  );
    40	};

```


**Tool Call: Read file `components\ai\ai-prompt-box-demo.tsx` (lines 1-220)**
Status: Completed

```Smartli V2\components\ai\ai-prompt-box-demo.tsx
     1	'use client';
     2	
     3	import { PromptInputBox, PromptModeToggle, type PromptMode } from '@/components/ui/ai-prompt-box';
     4	import { useState } from 'react';
     5	import { type AIModelId, AI_MODELS } from '@/lib/ai/config';
     6	import Image from 'next/image';
     7	
     8	export function AiPromptBoxDemo() {
     9	  const [mode, setMode] = useState<PromptMode>('explainer');
    10	  const [model, setModel] = useState<AIModelId>(AI_MODELS[0].id);
    11	
    12	  return (
    13	    <div className="relative flex w-full max-w-4xl flex-col items-center justify-center px-4 md:px-8">
    14	      <div className="fixed top-20 left-0 right-0 z-50 flex flex-col items-center text-center">
    15	        <PromptModeToggle 
    16	          mode={mode} 
    17	          onModeChange={setMode} 
    18	          className="scale-115 shadow-lg"
    19	        />
    20	      </div>
    21	
    22	      <div className="flex flex-col items-center text-center mb-16 gap-6">
    23	        <div className="flex items-center gap-4">
    24	          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
    25	            <Image 
    26	              src="/assets/branding/logo.png" 
    27	              alt="Smartli Logo" 
    28	              fill
    29	              className="object-contain"
    30	              priority
    31	            />
    32	          </div>
    33	          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
    34	            Smartli <span className="text-primary">Intelligence</span>
    35	          </h1>
    36	        </div>
    37	      </div>
    38	
    39	      <PromptInputBox
    40	        mode={mode}
    41	        onModeChange={setMode}
    42	        showToggle={false}
    43	        model={model}
    44	        onModelChange={setModel}
    45	        onSend={(message, files) => {
    46	          console.log('Model:', model);
    47	          console.log('Message:', message);
    48	          console.log('Files:', files);
    49	        }}
    50	        placeholder="Ask me anything..."
    51	        className="max-w-4xl"
    52	      />
    53	
    54	      <p className="mt-6 text-center text-xs text-gray-500">
    55	        {mode === 'quiz'
    56	          ? 'Quiz mode is ready for active recall.'
    57	          : 'Explainer mode is ready to break down any topic.'}
    58	      </p>
    59	    </div>
    60	  );
    61	}

```


**Tool Call: Read file `app\globals.css` (lines 1-320)**
Status: Completed

```Smartli V2\app\globals.css
     1	@tailwind base;
     2	@tailwind components;
     3	@tailwind utilities;
     4	
     5	@layer base {
     6	  :root {
     7	    --background: 240 10% 3.9%;
     8	    --foreground: 0 0% 98%;
     9	    --card: 240 10% 3.9%;
    10	    --card-foreground: 0 0% 98%;
    11	    --popover: 240 10% 3.9%;
    12	    --popover-foreground: 0 0% 98%;
    13	    --primary: 0 0% 98%;
    14	    --primary-foreground: 240 5.9% 10%;
    15	    --secondary: 240 3.7% 15.9%;
    16	    --secondary-foreground: 0 0% 98%;
    17	    --muted: 240 3.7% 15.9%;
    18	    --muted-foreground: 240 5% 64.9%;
    19	    --accent: 240 3.7% 15.9%;
    20	    --accent-foreground: 0 0% 98%;
    21	    --destructive: 0 62.8% 30.6%;
    22	    --destructive-foreground: 0 0% 98%;
    23	    --border: 240 3.7% 15.9%;
    24	    --input: 240 3.7% 15.9%;
    25	    --ring: 240 4.9% 83.9%;
    26	    --radius: 0.75rem;
    27	  }
    28	
    29	  .dark {
    30	    --background: 240 10% 3.9%;
    31	    --foreground: 0 0% 98%;
    32	    --card: 240 10% 3.9%;
    33	    --card-foreground: 0 0% 98%;
    34	    --popover: 240 10% 3.9%;
    35	    --popover-foreground: 0 0% 98%;
    36	    --primary: 0 0% 98%;
    37	    --primary-foreground: 240 5.9% 10%;
    38	    --secondary: 240 3.7% 15.9%;
    39	    --secondary-foreground: 0 0% 98%;
    40	    --muted: 240 3.7% 15.9%;
    41	    --muted-foreground: 240 5% 64.9%;
    42	    --accent: 240 3.7% 15.9%;
    43	    --accent-foreground: 0 0% 98%;
    44	    --destructive: 0 62.8% 30.6%;
    45	    --destructive-foreground: 0 0% 98%;
    46	    --border: 240 3.7% 15.9%;
    47	    --input: 240 3.7% 15.9%;
    48	    --ring: 240 4.9% 83.9%;
    49	  }
    50	}
    51	
    52	@layer base {
    53	  * {
    54	    @apply border-zinc-200 dark:border-zinc-800;
    55	  }
    56	  body {
    57	    background-color: hsl(var(--background));
    58	    color: hsl(var(--foreground));
    59	    @apply antialiased;
    60	    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    61	  }
    62	}
    63	
    64	/* Refined Animation */
    65	.animate-fade-in {
    66	  animation: fadeIn 300ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
    67	}
    68	
    69	@keyframes fadeIn {
    70	  from { opacity: 0; transform: translateY(8px) scale(0.98); }
    71	  to { opacity: 1; transform: translateY(0) scale(1); }
    72	}
    73	
    74	/* Glassmorphism Utility */
    75	.glass {
    76	  @apply backdrop-blur-xl border;
    77	  border-color: hsl(var(--border) / 0.5);
    78	  background-color: hsl(var(--background) / 0.8);
    79	}
    80	
    81	/* Custom Scrollbar */
    82	::-webkit-scrollbar {
    83	  width: 6px;
    84	}
    85	::-webkit-scrollbar-track {
    86	  @apply bg-transparent;
    87	}
    88	::-webkit-scrollbar-thumb {
    89	  @apply bg-muted-foreground/20 rounded-full hover:bg-muted-foreground/40 transition-colors;
    90	}

```


**Tool Call: Read file `components\ui\Button.tsx` (lines 1-220)**
Status: Completed

```Smartli V2\components\ui\Button.tsx
     1	import * as React from "react"
     2	import { Slot } from "@radix-ui/react-slot"
     3	import { cva, type VariantProps } from "class-variance-authority"
     4	import { cn } from "@/lib/utils"
     5	
     6	const buttonVariants = cva(
     7	  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
     8	  {
     9	    variants: {
    10	      variant: {
    11	        default:
    12	          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    13	        destructive:
    14	          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    15	        outline:
    16	          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    17	        secondary:
    18	          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    19	        ghost: "hover:bg-accent hover:text-accent-foreground",
    20	        link: "text-primary underline-offset-4 hover:underline",
    21	      },
    22	      size: {
    23	        default: "h-10 px-4 py-2",
    24	        sm: "h-9 rounded-md px-3",
    25	        lg: "h-11 rounded-md px-8",
    26	        icon: "h-10 w-10",
    27	      },
    28	    },
    29	    defaultVariants: {
    30	      variant: "default",
    31	      size: "default",
    32	    },
    33	  }
    34	)
    35	
    36	export interface ButtonProps
    37	  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    38	    VariantProps<typeof buttonVariants> {
    39	  asChild?: boolean
    40	}
    41	
    42	const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    43	  ({ className, variant, size, asChild = false, ...props }, ref) => {
    44	    const Comp = asChild ? Slot : "button"
    45	    return (
    46	      <Comp
    47	        className={cn(buttonVariants({ variant, size, className }))}
    48	        ref={ref}
    49	        {...props}
    50	      />
    51	    )
    52	  }
    53	)
    54	Button.displayName = "Button"
    55	
    56	export { Button, buttonVariants }

```


**Tool Call: Read file `components\ui\dock.tsx` (lines 1-300)**
Status: Completed

```Smartli V2\components\ui\dock.tsx
     1	'use client';
     2	
     3	import React, { createContext, useContext, useRef } from 'react';
     4	import { cva, type VariantProps } from 'class-variance-authority';
     5	import {
     6	  motion,
     7	  type MotionValue,
     8	  useMotionValue,
     9	  useSpring,
    10	  useTransform,
    11	  type MotionProps,
    12	} from 'framer-motion';
    13	import { cn } from '@/lib/utils';
    14	
    15	interface DockContextValue {
    16	  mouseX: MotionValue<number>;
    17	  iconSize: number;
    18	  iconMagnification: number;
    19	  iconDistance: number;
    20	  disableMagnification: boolean;
    21	}
    22	
    23	const DockContext = createContext<DockContextValue | undefined>(undefined);
    24	
    25	export interface DockProps extends VariantProps<typeof dockVariants> {
    26	  className?: string;
    27	  iconSize?: number;
    28	  iconMagnification?: number;
    29	  disableMagnification?: boolean;
    30	  iconDistance?: number;
    31	  direction?: 'top' | 'middle' | 'bottom';
    32	  children: React.ReactNode;
    33	}
    34	
    35	const DEFAULT_SIZE = 40;
    36	const DEFAULT_MAGNIFICATION = 60;
    37	const DEFAULT_DISTANCE = 140;
    38	const DEFAULT_DISABLEMAGNIFICATION = false;
    39	
    40	const dockVariants = cva(
    41	  'glass pointer-events-auto mx-auto flex h-[58px] w-max items-end justify-center gap-1 rounded-[28px] px-3 pb-2 shadow-2xl shadow-black/30'
    42	);
    43	
    44	const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    45	  (
    46	    {
    47	      className,
    48	      children,
    49	      iconSize = DEFAULT_SIZE,
    50	      iconMagnification = DEFAULT_MAGNIFICATION,
    51	      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
    52	      iconDistance = DEFAULT_DISTANCE,
    53	      direction = 'middle',
    54	      ...props
    55	    },
    56	    ref
    57	  ) => {
    58	    const mouseX = useMotionValue(Infinity);
    59	
    60	    return (
    61	      <DockContext.Provider
    62	        value={{
    63	          mouseX,
    64	          iconSize,
    65	          iconMagnification,
    66	          iconDistance,
    67	          disableMagnification,
    68	        }}
    69	      >
    70	        <motion.div
    71	          ref={ref}
    72	          onMouseMove={(e) => mouseX.set(e.pageX)}
    73	          onMouseLeave={() => mouseX.set(Infinity)}
    74	          {...props}
    75	          className={cn(dockVariants({ className }), {
    76	            'items-start': direction === 'top',
    77	            'items-center': direction === 'middle',
    78	            'items-end': direction === 'bottom',
    79	          })}
    80	        >
    81	          {children}
    82	        </motion.div>
    83	      </DockContext.Provider>
    84	    );
    85	  }
    86	);
    87	
    88	Dock.displayName = 'Dock';
    89	
    90	export interface DockIconProps
    91	  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, 'children'> {
    92	  size?: number;
    93	  magnification?: number;
    94	  disableMagnification?: boolean;
    95	  distance?: number;
    96	  mouseX?: MotionValue<number>;
    97	  className?: string;
    98	  children?: React.ReactNode;
    99	}
   100	
   101	const DockIcon = ({
   102	  size,
   103	  magnification,
   104	  disableMagnification,
   105	  distance,
   106	  mouseX,
   107	  className,
   108	  children,
   109	  ...props
   110	}: DockIconProps) => {
   111	  const context = useContext(DockContext);
   112	
   113	  const finalSize = size ?? context?.iconSize ?? DEFAULT_SIZE;
   114	  const finalMagnification = magnification ?? context?.iconMagnification ?? DEFAULT_MAGNIFICATION;
   115	  const finalDistance = distance ?? context?.iconDistance ?? DEFAULT_DISTANCE;
   116	  const finalDisableMagnification =
   117	    disableMagnification ?? context?.disableMagnification ?? DEFAULT_DISABLEMAGNIFICATION;
   118	  const finalMouseX = mouseX ?? context?.mouseX ?? useMotionValue(Infinity);
   119	
   120	  const ref = useRef<HTMLDivElement>(null);
   121	  const padding = Math.max(6, finalSize * 0.2);
   122	
   123	  const distanceCalc = useTransform(finalMouseX, (val: number) => {
   124	    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
   125	    return val - bounds.x - bounds.width / 2;
   126	  });
   127	
   128	  const targetSize = finalDisableMagnification ? finalSize : finalMagnification;
   129	
   130	  const sizeTransform = useTransform(
   131	    distanceCalc,
   132	    [-finalDistance, 0, finalDistance],
   133	    [finalSize, targetSize, finalSize]
   134	  );
   135	
   136	  const scaleSize = useSpring(sizeTransform, {
   137	    mass: 0.1,
   138	    stiffness: 150,
   139	    damping: 12,
   140	  });
   141	
   142	  return (
   143	    <motion.div
   144	      ref={ref}
   145	      style={{ width: scaleSize, height: scaleSize, padding }}
   146	      className={cn(
   147	        'flex aspect-square cursor-pointer items-center justify-center rounded-full',
   148	        finalDisableMagnification && 'hover:bg-muted-foreground transition-colors',
   149	        className
   150	      )}
   151	      {...props}
   152	    >
   153	      <div className="relative flex h-full w-full items-center justify-center">{children}</div>
   154	    </motion.div>
   155	  );
   156	};
   157	
   158	DockIcon.displayName = 'DockIcon';
   159	
   160	const DockDivider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
   161	  ({ className, ...props }, ref) => (
   162	    <div
   163	      ref={ref}
   164	      aria-hidden="true"
   165	      className={cn('mx-1.5 h-8 w-px shrink-0 self-center bg-border/70', className)}
   166	      {...props}
   167	    />
   168	  )
   169	);
   170	
   171	DockDivider.displayName = 'DockDivider';
   172	
   173	export { Dock, DockIcon, DockDivider, dockVariants };

```


**Tool Call: Read file `tailwind.config.js` (lines 1-240)**
Status: Completed

```Smartli V2\tailwind.config.js
     1	/** @type {import('tailwindcss').Config} */
     2	module.exports = {
     3	  content: [
     4	    './app/**/*.{js,ts,jsx,tsx,mdx}',
     5	    './components/**/*.{js,ts,jsx,tsx,mdx}',
     6	  ],
     7	  theme: {
     8	    extend: {
     9	      colors: {
    10	        border: "hsl(var(--border))",
    11	        input: "hsl(var(--input))",
    12	        ring: "hsl(var(--ring))",
    13	        background: "hsl(var(--background))",
    14	        foreground: "hsl(var(--foreground))",
    15	        primary: {
    16	          DEFAULT: "hsl(var(--primary))",
    17	          foreground: "hsl(var(--primary-foreground))",
    18	        },
    19	        secondary: {
    20	          DEFAULT: "hsl(var(--secondary))",
    21	          foreground: "hsl(var(--secondary-foreground))",
    22	        },
    23	        destructive: {
    24	          DEFAULT: "hsl(var(--destructive))",
    25	          foreground: "hsl(var(--destructive-foreground))",
    26	        },
    27	        muted: {
    28	          DEFAULT: "hsl(var(--muted))",
    29	          foreground: "hsl(var(--muted-foreground))",
    30	        },
    31	        accent: {
    32	          DEFAULT: "hsl(var(--accent))",
    33	          foreground: "hsl(var(--accent-foreground))",
    34	        },
    35	        popover: {
    36	          DEFAULT: "hsl(var(--popover))",
    37	          foreground: "hsl(var(--popover-foreground))",
    38	        },
    39	        card: {
    40	          DEFAULT: "hsl(var(--card))",
    41	          foreground: "hsl(var(--card-foreground))",
    42	        },
    43	      },
    44	      keyframes: {
    45	        'fade-in': {
    46	          '0%': { opacity: '0', transform: 'scale(0.95)' },
    47	          '100%': { opacity: '1', transform: 'scale(1)' },
    48	        },
    49	        'pulse-slow': {
    50	          '0%, 100%': { opacity: '0.7' },
    51	          '50%': { opacity: '1' },
    52	        },
    53	      },
    54	      animation: {
    55	        'fade-in': 'fade-in 200ms ease-out forwards',
    56	        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
    57	      },
    58	      transitionTimingFunction: {
    59	        'ease-out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
    60	        'ease-in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
    61	      },
    62	    },
    63	  },
    64	  plugins: [],
    65	}

```


**Tool Call: Read file `tsconfig.json` (lines 1-200)**
Status: Completed

```Smartli V2\tsconfig.json
     1	{
     2	  "compilerOptions": {
     3	    "target": "es5",
     4	    "lib": [
     5	      "dom",
     6	      "dom.iterable",
     7	      "esnext"
     8	    ],
     9	    "allowJs": true,
    10	    "skipLibCheck": true,
    11	    "strict": true,
    12	    "forceConsistentCasingInFileNames": true,
    13	    "noEmit": true,
    14	    "esModuleInterop": true,
    15	    "module": "esnext",
    16	    "moduleResolution": "node",
    17	    "resolveJsonModule": true,
    18	    "isolatedModules": true,
    19	    "jsx": "preserve",
    20	    "incremental": true,
    21	    "baseUrl": ".",
    22	    "paths": {
    23	      "@/*": [
    24	        "./*"
    25	      ]
    26	    },
    27	    "plugins": [
    28	      {
    29	        "name": "next"
    30	      }
    31	    ]
    32	  },
    33	  "include": [
    34	    "next-env.d.ts",
    35	    "**/*.ts",
    36	    "**/*.tsx",
    37	    ".next/types/**/*.ts"
    38	  ],
    39	  "exclude": [
    40	    "node_modules"
    41	  ]
    42	}

```


**Tool Call: Read file `components.json` (lines 1-200)**
Status: Completed

```Smartli V2\components.json
     1	{
     2	  "$schema": "https://ui.shadcn.com/schema.json",
     3	  "style": "default",
     4	  "rsc": true,
     5	  "tsx": true,
     6	  "tailwind": {
     7	    "config": "tailwind.config.js",
     8	    "css": "app/globals.css",
     9	    "baseColor": "zinc",
    10	    "cssVariables": true,
    11	    "prefix": ""
    12	  },
    13	  "aliases": {
    14	    "components": "@/components",
    15	    "utils": "@/lib/utils"
    16	  }
    17	}

```


**Tool Call: git --no-optional-locks status --short**
Status: Failed

Permission to run tool denied by user

**Tool Call: Search files for regex `supabase|createClient|localStorage|sessionStorage|useContext|createContext|useReducer|zustand|redux|useAIStream|startStream|/learning|AIRequest|QuizSet`**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/api/ai/stream/route.ts#L1:16

```
import { NextRequest, NextResponse } from 'next/server';
import { streamAIResponse } from '@/lib/ai/gateway';
import { AIRequest } from '@/lib/ai/config';

export async function POST(req: NextRequest) {
  try {
    const body: AIRequest = await req.json();
    const stream = await streamAIResponse(body);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/auth/page.tsx#L1:11

```
'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/auth/page.tsx#L21:29

```
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/';
      }
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/explainer/page.tsx#L1:11

```
'use client';

import React, { useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';
import { StreamingResponse } from '@/components/ai/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Send, Sparkles, GraduationCap, Loader2, Pause } from 'lucide-react';
import { AIExplainerMode } from '@/types';
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/explainer/page.tsx#L13:26

```
export default function ExplainerPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIExplainerMode>('explainer');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await startStream({
      prompt: input,
      mode: mode,
    });
  };
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/quiz/page.tsx#L1:11

```
'use client';

import React, { useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';
import { StreamingResponse } from '@/components/ai/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileText, ListChecks, BrainCircuit, BookOpen, Loader2, Send, Pause } from 'lucide-react';
import { QuizType } from '@/types';
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/learning/quiz/page.tsx#L13:28

```
export default function QuizPage() {
  const [input, setInput] = useState('');
  const [quizType, setQuizType] = useState<QuizType>('mcq');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await startStream({
      prompt: `Generate a ${quizType} quiz based on the following content. Please follow a pedagogical progression from basic recall to higher-order analysis.`,
      context: input,
      mode: 'quiz',
      quizType: quizType,
    });
  };
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/page.tsx#L51:61

```
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/learning/explainer" className="group">
            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={120} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">AI Explainer</h3>
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/app/page.tsx#L72:76

```
          </Link>

          <Link href="/learning/quiz" className="group">
            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-emerald-500/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
```


**Tool Call: Search files for regex `supabase|createClient|localStorage|sessionStorage|useContext|createContext|useReducer|zustand|redux|useAIStream|startStream|session|history`**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/ai-prompt-box.tsx#L324:331

```
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: '',
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/ai-prompt-box.tsx#L333:335

```
function usePromptInput() {
  return React.useContext(PromptInputContext);
}
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/ai-prompt-box.tsx#L645:658

```
      quiz: [
        { label: 'Calculus Practice', icon: GraduationCap, prompt: 'Generate 5 challenging Calculus integration problems', color: 'text-blue-400', hover: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
        { label: 'History Quiz', icon: Check, prompt: 'Quiz me on the major events of the French Revolution', color: 'text-emerald-400', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
        { label: 'Bio Competency', icon: BrainCog, prompt: 'Test my knowledge on DNA replication and transcription', color: 'text-amber-400', hover: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
        { label: 'Physics Laws', icon: Globe, prompt: 'Create a quiz about Newton\'s Laws of Motion', color: 'text-purple-400', hover: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
        { label: 'Vocab Practice', icon: GraduationCap, prompt: 'Test my advanced English vocabulary with context sentences', color: 'text-rose-400', hover: 'hover:border-rose-500/50 hover:bg-rose-500/10' },
        { label: 'Chem Bonding', icon: Check, prompt: 'Quiz me on ionic vs covalent bonding principles', color: 'text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
        { label: 'Literature Quiz', icon: BrainCog, prompt: 'Test my understanding of symbolism in "The Great Gatsby"', color: 'text-indigo-400', hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/10' },
        { label: 'World Map', icon: Globe, prompt: 'Quiz me on European capitals and geography', color: 'text-orange-400', hover: 'hover:border-orange-500/50 hover:bg-orange-500/10' },
        { label: 'Coding Logic', icon: Paperclip, prompt: 'Give me 3 logic puzzles involving algorithms', color: 'text-teal-400', hover: 'hover:border-teal-500/50 hover:bg-teal-500/10' },
        { label: 'Econ Basics', icon: Check, prompt: 'Quiz me on Supply and Demand curves', color: 'text-pink-400', hover: 'hover:border-pink-500/50 hover:bg-pink-500/10' },
        { label: 'Art History', icon: Globe, prompt: 'Test me on Renaissance period artists and works', color: 'text-yellow-400', hover: 'hover:border-yellow-500/50 hover:bg-yellow-500/10' },
        { label: 'Psychology', icon: BrainCog, prompt: 'Quiz me on different types of memory (Short vs Long term)', color: 'text-violet-400', hover: 'hover:border-violet-500/50 hover:bg-violet-500/10' },
        { label: 'Data Structures', icon: Paperclip, prompt: 'Test my knowledge on Linked Lists and Binary Trees', color: 'text-lime-400', hover: 'hover:border-lime-500/50 hover:bg-lime-500/10' },
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/dock.tsx#L1:11

```
'use client';

import React, { createContext, useContext, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionProps,
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/dock.tsx#L21:25

```
}

const DockContext = createContext<DockContextValue | undefined>(undefined);

export interface DockProps extends VariantProps<typeof dockVariants> {
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/ui/dock.tsx#L110:120

```
}: DockIconProps) => {
  const context = useContext(DockContext);

  const finalSize = size ?? context?.iconSize ?? DEFAULT_SIZE;
  const finalMagnification = magnification ?? context?.iconMagnification ?? DEFAULT_MAGNIFICATION;
  const finalDistance = distance ?? context?.iconDistance ?? DEFAULT_DISTANCE;
  const finalDisableMagnification =
    disableMagnification ?? context?.disableMagnification ?? DEFAULT_DISABLEMAGNIFICATION;
  const finalMouseX = mouseX ?? context?.mouseX ?? useMotionValue(Infinity);

  const ref = useRef<HTMLDivElement>(null);
```


**Tool Call: Search files for regex `supabase|createClient|localStorage|sessionStorage|session|history|quiz`**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/cache.ts#L10:13

```
export function getCachedResponse(input: string, requestType: string): string | null {
  const key = generateCacheKey(input, requestType);
  return sessionStorage.getItem(key);
}
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/cache.ts#L15:18

```
export function setCachedResponse(input: string, requestType: string, response: string): void {
  const key = generateCacheKey(input, requestType);
  sessionStorage.setItem(key, response);
}
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/cache.ts#L20:23

```
export function clearAICache(): void {
  Object.keys(sessionStorage)
    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    .forEach(key => sessionStorage.removeItem(key));
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/config.ts#L22:28

```
export type AIRequest = {
  prompt: string;
  context?: string;
  mode?: 'explainer' | 'tutor' | 'eli5' | 'quiz';
  quizType?: 'mcq' | 'exam' | 'competency' | 'reasoning';
  model?: AIModelId;
};
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/ai/prompts.ts#L8:13

```
export const QUIZ_PROMPTS = {
  mcq: 'Generate a multiple-choice quiz. For each question: Provide 4 options, clearly mark the correct one, and provide a detailed explanation of why the correct answer is right and why the others are wrong.',
  exam: 'Generate exam-style questions. Include a mix of short-answer (comprehension) and long-form (analysis) questions. Provide a model answer and a rubric for grading.',
  competency: 'Generate scenario-driven questions that test practical application of the concepts. Describe a real-world situation and ask the user to solve it using the principles provided in the context.',
  reasoning: 'Generate "why" and "how" questions that require deep reasoning and justification. The goal is to test if the user understands the underlying logic, not just the facts.',
};
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/supabase/client.ts#L1:11

```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  grade_level: string;
  curriculum: string;
```


file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/supabase/client.ts#L27:33

```
export type Quiz = {
  id: string;
  user_id: string;
  title: string;
  content: any; // Structured quiz data
  created_at: string;
};
```


**Tool Call: 50 matches**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/supabase

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/lib/supabase/client.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/AGENTS.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/LICENSE

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/dist

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/dist/main

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/dist/module

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/dist/tsconfig.module.tsbuildinfo

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/dist/tsconfig.tsbuildinfo

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations/lockless-coordination.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/package.json

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/AuthAdminApi.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/AuthClient.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/GoTrueAdminApi.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/GoTrueClient.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/index.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/src/lib

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/AGENTS.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/LICENSE

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/dist

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/dist/main

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/dist/module

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/dist/tsconfig.module.tsbuildinfo

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/dist/tsconfig.tsbuildinfo

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/package.json

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/FunctionsClient.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/edge-runtime.d.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/helper.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/index.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/types.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/src/version.ts

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/LICENSE.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/assets

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/assets/js

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/package.json

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/priv

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/phoenix/priv/static

**Tool Call: 14 matches**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/auth-js/migrations/lockless-coordination.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/functions-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/postgrest-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/postgrest-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/realtime-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/realtime-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/realtime-js/migrations/httpsend-server-version.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/storage-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/storage-js/migrations/README.md

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/supabase-js/migrations

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/node_modules/@supabase/supabase-js/migrations/README.md

**Tool Call: 1 match**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/.env.example

## Assistant

The current architecture has an important split: `/ai` is a visual prompt demo with no persistence, while the working flows live at `/learning/explainer` and `/learning/quiz`, each holding all conversation/generation state locally inside the page. I’m checking the remaining AI/auth/config files to confirm what can be reused and where the frontend boundary currently stops.

**Tool Call: Read file `app\auth\page.tsx` (lines 1-180)**
Status: Completed

```Smartli V2\app\auth\page.tsx
     1	'use client';
     2	
     3	import React, { useState } from 'react';
     4	import { supabase } from '@/lib/supabase/client';
     5	import { Button } from '@/components/ui/Button';
     6	import { Input } from '@/components/ui/input';
     7	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
     8	import { cn } from '@/lib/utils';
     9	import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
    10	
    11	export default function AuthPage() {
    12	  const [isSignUp, setIsSignUp] = useState(false);
    13	  const [email, setEmail] = useState('');
    14	  const [password, setPassword] = useState('');
    15	  const [loading, setLoading] = useState(false);
    16	
    17	  const handleAuth = async (e: React.FormEvent) => {
    18	    e.preventDefault();
    19	    setLoading(true);
    20	    try {
    21	      if (isSignUp) {
    22	        const { error } = await supabase.auth.signUp({ email, password });
    23	        if (error) throw error;
    24	        alert('Check your email for the confirmation link!');
    25	      } else {
    26	        const { error } = await supabase.auth.signInWithPassword({ email, password });
    27	        if (error) throw error;
    28	        window.location.href = '/';
    29	      }
    30	    } catch (err: any) {
    31	      alert(err.message);
    32	    } finally {
    33	      setLoading(false);
    34	    }
    35	  };
    36	
    37	  return (
    38	    <div className="min-h-screen flex items-center justify-center bg-background p-6">
    39	      <Card className="max-w-md w-full shadow-2xl border-border/50">
    40	        <CardHeader className="text-center space-y-2">
    41	          <CardTitle className="text-3xl font-bold">
    42	            {isSignUp ? 'Create Account' : 'Welcome Back'}
    43	          </CardTitle>
    44	          <CardDescription>
    45	            {isSignUp ? 'Join Smartli and elevate your learning.' : 'Log in to continue your study session.'}
    46	          </CardDescription>
    47	        </CardHeader>
    48	        <CardContent>
    49	          <form onSubmit={handleAuth} className="space-y-4">
    50	            <div className="space-y-2">
    51	              <div className="relative">
    52	                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
    53	                <Input
    54	                  type="email"
    55	                  value={email}
    56	                  onChange={(e) => setEmail(e.target.value)}
    57	                  className="pl-10"
    58	                  placeholder="student@university.edu"
    59	                  required
    60	                />
    61	              </div>
    62	            </div>
    63	
    64	            <div className="space-y-2">
    65	              <div className="relative">
    66	                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
    67	                <Input
    68	                  type="password"
    69	                  value={password}
    70	                  onChange={(e) => setPassword(e.target.value)}
    71	                  className="pl-10"
    72	                  placeholder="••••••••"
    73	                  required
    74	                />
    75	              </div>
    76	            </div>
    77	
    78	            <Button
    79	              variant="default"
    80	              className="w-full py-6 text-base flex items-center justify-center gap-2"
    81	              type="submit"
    82	              disabled={loading}
    83	            >
    84	              {loading ? <Loader2 className="animate-spin" size={18} /> : (
    85	                <>
    86	                  {isSignUp ? 'Create Account' : 'Sign In'}
    87	                  <ArrowRight size={18} />
    88	                </>
    89	              )}
    90	            </Button>
    91	          </form>
    92	        </CardContent>
    93	        <CardFooter className="flex flex-col items-center justify-center pb-8">
    94	          <button
    95	            onClick={() => setIsSignUp(!isSignUp)}
    96	            className="text-sm text-primary font-medium hover:underline transition-all"
    97	          >
    98	            {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
    99	          </button>
   100	        </CardFooter>
   101	      </Card>
   102	    </div>
   103	  );
   104	}

```


**Tool Call: Read file `lib\ai\config.ts` (lines 1-280)**
Status: Completed

```Smartli V2\lib\ai\config.ts
     1	export const AI_MODELS = [
     2	  { id: 'liquid/lfm-2.5-2.6b:free', name: 'LFM 2.5 (Free)', provider: 'Liquid' },
     3	  { id: 'google/gemini-flash-1.5-8b', name: 'Gemini Flash 1.5', provider: 'Google' },
     4	  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8b', provider: 'Meta' },
     5	] as const;
     6	
     7	export type AIModelId = (typeof AI_MODELS)[number]['id'];
     8	
     9	export const AI_CONFIG = {
    10	  PRIMARY_MODEL: 'liquid/lfm-2.5-2.6b:free' as AIModelId,
    11	  STREAMING_ENABLED: true,
    12	};
    13	
    14	/**
    15	 * Regex to strip internal AI reasoning tags like <think>...</think> or [thought]...[/thought]
    16	 */
    17	export function filterAIStream(text: string): string {
    18	  return text.replace(/<(think|thought)>[\s\S]*?<\/\1>/gi, '')
    19	              .replace(/\[(think|thought)\][\s\S]*?\[\/\1\]/gi, '');
    20	}
    21	
    22	export type AIRequest = {
    23	  prompt: string;
    24	  context?: string;
    25	  mode?: 'explainer' | 'tutor' | 'eli5' | 'quiz';
    26	  quizType?: 'mcq' | 'exam' | 'competency' | 'reasoning';
    27	  model?: AIModelId;
    28	};
    29	
    30	export type AIResponse = {
    31	  content: string;
    32	  suggestions?: string[];
    33	};

```


**Tool Call: Read file `lib\ai\cache.ts` (lines 1-180)**
Status: Completed

```Smartli V2\lib\ai\cache.ts
     1	import CryptoJS from 'crypto-js';
     2	
     3	export const CACHE_KEY_PREFIX = 'smartli_ai_cache_';
     4	
     5	export function generateCacheKey(input: string, requestType: string): string {
     6	  const hash = CryptoJS.SHA256(input + requestType).toString();
     7	  return `${CACHE_KEY_PREFIX}${hash}`;
     8	}
     9	
    10	export function getCachedResponse(input: string, requestType: string): string | null {
    11	  const key = generateCacheKey(input, requestType);
    12	  return sessionStorage.getItem(key);
    13	}
    14	
    15	export function setCachedResponse(input: string, requestType: string, response: string): void {
    16	  const key = generateCacheKey(input, requestType);
    17	  sessionStorage.setItem(key, response);
    18	}
    19	
    20	export function clearAICache(): void {
    21	  Object.keys(sessionStorage)
    22	    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    23	    .forEach(key => sessionStorage.removeItem(key));
    24	}

```


**Tool Call: Read file `lib\ai\gateway.ts` (lines 1-320)**
Status: Completed

```Smartli V2\lib\ai\gateway.ts
     1	import { AI_CONFIG } from './config';
     2	import { constructPrompt } from './prompts';
     3	import { AIRequest } from './config';
     4	
     5	export async function streamAIResponse(request: AIRequest) {
     6	  const { prompt, context, mode } = request;
     7	
     8	  const fullPrompt = constructPrompt(mode || 'explainer', prompt, context);
     9	
    10	  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    11	    method: 'POST',
    12	    headers: {
    13	      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    14	      'Content-Type': 'application/json',
    15	    },
    16	    body: JSON.stringify({
    17	      model: request.model || AI_CONFIG.PRIMARY_MODEL,
    18	      messages: [{ role: 'user', content: fullPrompt }],
    19	      stream: true,
    20	    }),
    21	  });
    22	
    23	  if (!response.ok) {
    24	    throw new Error(`OpenRouter API error: ${response.statusText}`);
    25	  }
    26	
    27	  return response.body;
    28	}

```


**Tool Call: Read file `.env.example` (lines 1-120)**
Status: Failed

```json
{
  "Text": "Cannot read file because its path matches the global `private_files` setting: Smartli V2\\.env.example"
}
```

**Tool Call: Read file `app\account\page.tsx` (lines 1-220)**
Status: Completed

```Smartli V2\app\account\page.tsx
     1	export default function AccountPage() {
     2	  return (
     3	    <div className="flex h-full w-full items-center justify-center">
     4	      <h1 className="text-4xl font-bold">Account Page</h1>
     5	    </div>
     6	  )
     7	}

```


**Tool Call: Read file `app\settings\page.tsx` (lines 1-220)**
Status: Completed

```Smartli V2\app\settings\page.tsx
     1	export default function SettingsPage() {
     2	  return (
     3	    <div className="flex h-full w-full items-center justify-center">
     4	      <h1 className="text-4xl font-bold">Settings Page</h1>
     5	    </div>
     6	  )
     7	}

```


**Tool Call: Read file `lib\utils.ts` (lines 1-160)**
Status: Completed

```Smartli V2\lib\utils.ts
     1	import { clsx, type ClassValue } from 'clsx';
     2	import { twMerge } from 'tailwind-merge';
     3	
     4	export function cn(...inputs: ClassValue[]) {
     5	  return twMerge(clsx(inputs));
     6	}

```


## Assistant

<thinking>
**Inspecting directories and architecture**

I think I need to check all directories. The app/learning folder has only pages, so maybe I should use diagnostics to look for any code errors. Since the user wants a plan and not the implementation, validating the architecture seems useful. Running diagnostics could reveal errors.

However, it looks like the git status was denied due to terminal user access issues. I should inspect app/page.tsx and see what’s read. I might also need to check the app/layout for potential global effects. I want to clarify that a new sidebar would likely be specific to the AI learning area, not for the global root.

**Planning sidebar integration for AI learning**

The user wants a sidebar as the primary navigation for AI-powered learning sessions. Since the existing AppDock serves as global navigation, replacing it could affect other pages — that's risky! I recommend integrating the sidebar only at the layout level for the `/ai` and `/learning/*` routes.

In the Next App Router, the current layout includes AppDock for all routes without a route group. I need a plan to create a new `components/learning/learning-shell.tsx` that wraps `app/learning/layout.tsx`, making sure the sidebar is only for the learning area. 

I need to check the component directories since there might not be any learning components listed. It’s odd if the learning folder is empty. I'll also note that `components/dashboard` and others are not relevant here.

**Checking for current import errors**

I need to focus on the imports in `app/learning/explainer/page.tsx`. The file imports `AIExplainerMode` from '@/types' and `AIRequest` from '@/lib/ai/config' — those look fine with no issues. But I see `isComplete` is unused, which might trigger a lint warning.

Since the user wants a plan and not diagnostics, I think I can skip extensive checks for now. But, including a diagnostics summary could still be helpful to highlight any actual errors or warnings I may have overlooked.
</thinking>

There is no session/history implementation or database schema in the source tree yet; Supabase is only used for auth, and AI responses are cached in `sessionStorage` under request-hash keys. I’ll do one final pass over the dashboard and empty feature directories, then I’ll consolidate the findings into the frontend-only design and integration plan.

**Tool Call: Read file `app\page.tsx` (lines 1-180)**
Status: Completed

```Smartli V2\app\page.tsx
     1	'use client';
     2	
     3	import React from 'react';
     4	import { Button } from '@/components/ui/Button';
     5	import { Card, CardContent } from '@/components/ui/card';
     6	import { cn } from '@/lib/utils';
     7	import { Brain, Timer, ListTodo, TrendingUp, ChevronRight, Sparkles, Zap } from 'lucide-react';
     8	import Link from 'next/link';
     9	
    10	export default function DashboardPage() {
    11	  return (
    12	    <div className="max-w-6xl mx-auto p-6 space-y-12">
    13	      <header className="flex items-center justify-between py-4">
    14	        <div className="space-y-1">
    15	          <h1 className="text-4xl font-bold tracking-tight text-foreground">
    16	            Studio <span className="text-primary">Hub</span>
    17	          </h1>
    18	          <p className="text-muted-foreground font-medium">
    19	            Welcome back. Your learning system is ready.
    20	          </p>
    21	        </div>
    22	        <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full px-5">
    23	          <TrendingUp size={16} /> Analytics
    24	        </Button>
    25	      </header>
    26	
    27	      {/* Main Grid */}
    28	      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    29	        {/* Key Stats - Compact Bento */}
    30	        <div className="md:col-span-1 flex flex-col gap-4">
    31	          {[
    32	            { label: 'Hours', value: '12.5', icon: Timer, color: 'text-blue-500' },
    33	            { label: 'Streak', value: '5d', icon: Zap, color: 'text-orange-500' },
    34	            { label: 'Mastery', value: '68%', icon: Brain, color: 'text-indigo-500' },
    35	          ].map((stat, i) => (
    36	            <Card key={i} className="group hover:border-primary/50 transition-all cursor-default">
    37	              <CardContent className="p-5">
    38	                <div className="flex items-center justify-between mb-2">
    39	                  <stat.icon size={18} className={stat.color} />
    40	                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
    41	                </div>
    42	                <div className="text-2xl font-bold text-foreground group-hover:translate-x-1 transition-transform">
    43	                  {stat.value}
    44	                </div>
    45	              </CardContent>
    46	            </Card>
    47	          ))}
    48	        </div>
    49	
    50	        {/* Learning Suite - Large Bento */}
    51	        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
    52	          <Link href="/learning/explainer" className="group">
    53	            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50">
    54	              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
    55	                <Brain size={120} className="text-primary" />
    56	              </div>
    57	              <div className="relative z-10 space-y-4">
    58	                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
    59	                  <Sparkles size={24} />
    60	                </div>
    61	                <h3 className="text-2xl font-bold text-foreground">AI Explainer</h3>
    62	                <p className="text-muted-foreground leading-relaxed max-w-xs">
    63	                  Deep-dive into complex topics with pedagogical precision.
    64	                </p>
    65	                <div className="pt-4">
    66	                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
    67	                    Enter Suite <ChevronRight size={16} />
    68	                  </span>
    69	                </div>
    70	              </div>
    71	            </Card>
    72	          </Link>
    73	
    74	          <Link href="/learning/quiz" className="group">
    75	            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-emerald-500/50">
    76	              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
    77	                <ListTodo size={120} className="text-emerald-500" />
    78	              </div>
    79	              <div className="relative z-10 space-y-4">
    80	                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
    81	                  <ListTodo size={24} />
    82	                </div>
    83	                <h3 className="text-2xl font-bold text-foreground">Quiz Generator</h3>
    84	                <p className="text-muted-foreground leading-relaxed max-w-xs">
    85	                  Transform your notes into active recall assessments.
    86	                </p>
    87	                <div className="pt-4">
    88	                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-500 group-hover:gap-2 transition-all">
    89	                    Generate Quiz <ChevronRight size={16} />
    90	                  </span>
    91	                </div>
    92	              </div>
    93	            </Card>
    94	          </Link>
    95	        </div>
    96	      </div>
    97	
    98	      {/* Focus Hub - Wide Bento */}
    99	      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
   100	        <Link href="/focus" className="md:col-span-3 group">
   101	          <Card className="relative p-8 bg-zinc-900 dark:bg-zinc-950 text-foreground overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50">
   102	            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
   103	              <Timer size={120} className="text-zinc-400" />
   104	            </div>
   105	            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
   106	              <div className="space-y-2">
   107	                <div className="w-12 h-12 rounded-2xl bg-zinc-800 dark:bg-zinc-800 text-zinc-300 flex items-center justify-center mb-4">
   108	                  <Timer size={24} />
   109	                </div>
   110	                <h3 className="text-2xl font-bold">Focus Hub</h3>
   111	                <p className="text-muted-foreground max-w-md">
   112	                  Enter a state of deep work with the Pomodoro timer and ambient soundscapes.
   113	                </p>
   114	              </div>
   115	              <Button variant="secondary" className="rounded-full px-8 py-4 text-base font-bold">
   116	                Start Focusing
   117	              </Button>
   118	            </div>
   119	          </Card>
   120	        </Link>
   121	      </div>
   122	    </div>
   123	  );
   124	}

```


**Tool Call: List the `Smartli V2\components\learning` directory's contents**
Status: Completed

Smartli V2\components\learning is empty.


**Tool Call: List the `Smartli V2\components\dashboard` directory's contents**
Status: Completed

Smartli V2\components\dashboard is empty.


**Tool Call: List the `Smartli V2\app\api\ai` directory's contents**
Status: Completed

# Folders:
Smartli V2\app\api\ai\stream


**Tool Call: Check project diagnostics**
Status: Completed

Diagnostics successfully refreshed.

C:\Users\Tanush\Desktop\Coding\Smartli V2\components\ui\ai-prompt-box.tsx: 0 error(s), 3 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\app\globals.css: 0 error(s), 8 warning(s)


## Assistant

<thinking>
**Evaluating implementation requirements**

I see that we have diagnostics warnings, and I should focus on getting the exact warnings for the relevant files. It might be worth calling the diagnostics prompt and globals to see if certain mentions are truly required. The user is looking for a detailed implementation plan, even though they're asking about backend/API/database requirements in a frontend-only context. I need to explain that backend changes are out of scope but still mention prerequisites and analyze the current app, which includes Supabase without server authentication.

**Formulating a detailed plan**

I need to create a tailored plan based on my findings. First, I'm looking at the next steps involving the App Router, TypeScript, Tailwind/shadcn-ish, Framer Motion, lucide, and Radix Dialog/Tooltip. The Global RootLayout wraps all pages, using `main pb-28` and a fixed `AppDock`, with no route groups or layouts. The `/ai` page features the `AiPromptBoxDemo` but isn’t wired, while `/learning/explainer` and `/learning/quiz` are the actual pages. They use local state and a single response from `streamText`, with no array of messages or URL params. The `useAIStream` is streaming and caching in sessionStorage. I'll mention that caching should remain for responses only and not be the primary source of truth, ideally including session ID for unique cache keys.

**Creating a frontend plan**

I need to separate the frontend plan from the backend. First, I recognize that the Supabase client will handle authentication. For the content type `Quiz`, it won’t need an explainer type or a history table. There’s only one API route: a POST request to `/api/ai/stream`, with no CRUD operations. The existing AppDock could be repurposed as a global navigation or replaced in the learning shell. For design, I’m considering a sidebar for the learning workspace, serving as a primary navigation and history interface. I recommend creating a `LearningShell` in `app/learning/layout.tsx` that incorporates a fixed, responsive Sidebar and main content area without affecting the root layout. I also need to think about the `/ai` route, either redirecting to `/learning/explainer` or rebranding it as a landing page, with a sidebar including routes for creating new explainers and quizzes.

**Evaluating AppDock considerations**

I’m considering whether to keep the `AppDock` visible or hide it on the learning shell. The `AppDock` client reads the pathname but struggles to render on `/learning` or `/ai`, and the layout has challenges with bottom padding. One idea is to refactor `RootLayout` into `AppChrome`, using `usePathname` to select between `AppDock` and the learning layout. However, the `Sidebar` is tied to the learning layout, and the user is asking for a plan. I recommend relocating `AppDock` to an authenticated app layout if it’s feasible.

**Assessing layout changes**

I’m thinking that the root's `pb-28` can stay, though it’s not perfect. Maybe I could just modify the root's `main className` to eliminate the `pb-28` and add padding at the bottom of the dock page, though that could be out of scope.

It might also work better if the `AppDock` checks for `pathname.startsWith('/learning')` to adjust app padding based on the sidebar. However, with layout needs, maybe a single chronological list for user actions is less complicated than grouping.

**Considering session grouping**

I'm thinking we could recommend grouping sections to provide a clearer distinction between explainers and quizzes. Using distinct section headings might be the best approach. To manage many sessions, maybe we could have an `All` category later on. It might make sense to group by type and sort each list by `updatedAt`, showing icons when collapsed. However, they want to see previous sessions without needing a separate page, so I’ll keep that in mind for the layout choices.

**Considering animation for sidebar**

I'm thinking about whether to animate the sidebar width during state changes. Since sidebars are usually opened or closed infrequently, maybe a width transform is not the best option. CSS transitions for width should be okay if under 300ms—though the skill suggests using only transform or opacity when possible. Using CSS for `width: 200ms ease-out` along with content opacity seems reasonable. It might be best considering users with `prefers-reduced-motion` settings too. Plus, I should keep `SessionSummary` and `Session` separate in the data model.

**Considering quiz security**

I’m thinking about whether exposing `correctAnswer` to the client is safe. If the client needs scoring without cheating, maybe the server could send the correct answer. Storing correctness on the server side seems like a good option, with the front-end design limiting exposure until submission. I see existing types already have it, so I shouldn't overthink this part.

For state architecture, I’m considering how to manage session context and global state without overloading things.

**Reviewing sidebar state management**

I'm realizing the sidebar state is stored locally in `localStorage` for persistence, while mobile sessions are ephemeral. The session data includes the current page and provider, and the server is the source of truth. The sidebar isn’t its own session content but uses controlled callbacks.

For managing the session, I’m considering using `useSessionStore` with React Context and a reducer, rather than adding a heavy library. During mutations, I want to ensure actions are disabled and handle navigation appropriately, saving drafts only when users interact. For quizzes, it seems important to create entries immediately for tracking.

**Recommending session handling**

I think creating a session immediately is important for returnability, assigning a status of "draft." For an explainer, I want the draft created client-side but not sent to the API until the first message is sent. This helps avoid having an empty history. If a new explainer is clicked, I should ensure it generates a unique session ID and clears the current one. I recommend creating a server draft on the click with the "draft" status while hiding it from history until it has content or using a placeholder like "Untitled Explainer."

**Focusing on frontend design**

The user asked me to focus only on frontend design for now, so I won’t suggest any code writing. I need to clarify that the deliverable will just be a plan, and I might want to note that no files have been changed and possibly include some diagnostics as needed. It's all about staying aligned with what the user is asking at this moment!

**Clarifying commit instructions**

I need to mention the current diagnostics and any warnings, though no errors exist. It’s important to confirm that no files have changed and that the diagnostics show zero errors, while noting existing warnings. I’m confused about the user’s custom instruction to return only commit messages, as they are requesting a plan instead. Since this is a coding task and no commit is needed, I should focus on delivering the plan as requested.

**Clarifying frontend design expectations**

I need to consider if the user expects only frontend design and is concerned about missing files. However, I believe we have sufficient information, so there's no need to ask further questions. I should explicitly state that I've inspected everything but found no backend schema. The structure should have clear sections without being overly verbose. The user wanted detail, but we can keep it concise by using tables, possibly including a "Decision / Why / Alternative" table for clarity.

**Designing UI Layouts**

Alright, I'm thinking about the layout specifics for different devices. For desktops with widths 1024 and above, I’ll have a persistent left sidebar, with dimensions for expanded and collapsed states. For tablets, I might use an expanded drawer on demand and consider collapsing the rail. On mobile, I’d opt for a dialog drawer that’s responsive. I really want to avoid supporting collapsed icons by default on mobile. Performance is also key, particularly for fetching and displaying large histories effectively.

**Implementing User Interface Features**

I’m considering pagination and lazy loading as a priority before implementing search. The idea is to include a "Load more" button for accessibility, not just relying on the intersection observer. I also need optimized summary fields. While I won't change the API or database in this phase, using a repository stub and local demo mode could work temporarily. For the first frontend slice, I’ll define a `SessionRepository` interface with a mock implementation. Finally, I believe the best architectural approach is to modify the `AppDock` for the learning route.

**Evaluating Integration Options**

I'm considering a small integration where `AppDock` returns null for anything under `/learning/*`, while maintaining the global shell for everything else. This approach could set us up for a future migration to route groups. The new learning layout would still reside within the root, which means the `main pb-28` stays at an extra 7rem at the bottom, but I don't think that will cause any harm. It feels like a manageable step forward!

**Considering AI workspace structure**

I'm thinking about the best structure for an AI workspace. It seems like the canonical AI workspace should be set to `/learning/*`, so it's easily accessible. Then, I believe the `AppDock` AI link should target `/learning/explainer` for clarity and ease of use. Plus, it's essential to maintain the `/ai` redirect for backwards compatibility, ensuring that existing users can still access the information they need without confusion!

**Refining learning routes**

I’m considering some changes for the existing dashboard. For the links, I might stick to `/learning/explainer` for both the explainer and quiz pages. The "New Explainer" route probably shouldn't use `/ai`. Instead, I’ll update the AppDock navigation to href `/learning/explainer`. 

I think the dynamic route should keep `/learning/explainer` as the default landing, but clicking "new" should be unique. If someone enters `/learning/explainer` without an ID, it makes sense to show an empty new state and create it on their first input.

**Improving session creation flow**

I'm thinking about how the current dashboard links to the base route and if we could make that base route create a session client-side. For a simple user experience, we might alias the base route to the New Explainer action. 

The page could create a draft and redirect to the ID only once, avoiding unnecessary creational chaos with route guards. It’s better to have `app/learning/explainer/new/page.tsx` manage draft creation. The user can go to `/learning/explainer/new`, create the draft, and then replace the URL with the unique ID. 

I need to ensure we avoid creating duplicate sessions through careful POST requests and unique handling.

**Clarifying routing behavior**

I’m considering how the base route `page.tsx` can either redirect to the `new` page or render as empty. It’s important to explain this.

I noticed that App Router layouts don’t persist when moving between different IDs for `/learning/explainer/id` and `/learning/quiz/id`. However, `app/learning/layout.tsx` seems to persist correctly, which is good. I’ll need to ensure that users are aware of these routing behaviors to avoid confusion during navigation.

**Structuring architecture decisions**

I'm thinking through an architecture decision table. It includes key areas like hierarchy, data model, state management, routing, and some API/database requirements that are currently out of scope. I also need to consider responsive design, performance, security parameters, as well as files and migration strategies. I shouldn’t overlook potential risks, the steps for planning, and how I’ll validate the implementation. Each of these elements is really important for success.
</thinking>

# Sidebar Integration Plan

I inspected the current frontend before planning the integration. No files were changed.

## 1. Current architecture findings

### Framework and styling

- Next.js `14.2.3` with the App Router
- React 18 and TypeScript
- Tailwind CSS with CSS variables
- Radix UI dependencies for Dialog and Tooltip
- `framer-motion` used for page, dock, and prompt animations
- `lucide-react` used for icons
- Supabase client installed and used for authentication

### Current navigation

`app/layout.tsx` renders:

- A global `<main className="pb-28">`
- The fixed bottom `AppDock` from `components/navigation/app-dock.tsx`

The dock currently links to:

- `/`
- `/ai`
- `/focus`
- `/tasks`
- `/analytics`
- `/plan`
- `/settings`
- `/account`

The dock is global, so it currently appears on every route.

### AI routes

There are currently two different AI implementations:

#### `/ai`

Uses `components/ai/ai-prompt-box-demo.tsx`.

This is currently a visual/demo flow:

- It supports Explainer and Quiz mode selection.
- `onSend` only logs the model, message, and files.
- It does not create or persist sessions.

#### `/learning/explainer`

Uses `app/learning/explainer/page.tsx`.

This is the current working explainer flow:

- Local `input` state
- Local explainer mode state
- `useAIStream`
- One `streamText` value
- No message array
- No URL session ID
- No persistence
- No conversation restoration

#### `/learning/quiz`

Uses `app/learning/quiz/page.tsx`.

This currently:

- Accepts pasted content
- Generates a streamed response
- Stores only the raw response in `streamText`
- Does not normalize questions into quiz state
- Does not store answers, progress, or score
- Does not restore unfinished quizzes

### State and persistence

`hooks/useAIStream.ts` currently owns:

- `streamText`
- `isLoading`
- `error`
- `isComplete`
- An `AbortController`

AI responses are cached in `sessionStorage` by `lib/ai/cache.ts`.

That cache is not suitable for session history because:

- It is tab-scoped.
- It does not contain session metadata.
- It does not contain a message timeline.
- It is lost when the tab/session ends.
- The cache key currently uses the prompt and mode, but not all request context such as `quizType`, context text, or model.

### Backend/database status

There is currently:

- No session API
- No conversation API
- No database migration folder
- No session table type
- No session history query
- No quiz-attempt persistence
- No server-side route protection visible in the source

Supabase is currently used only for browser-side authentication in `app/auth/page.tsx`.

### Existing reusable UI

Good candidates for reuse:

- `components/ui/Button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ai/StreamingResponse.tsx`
- `components/navigation/app-dock.tsx` interaction patterns
- `components/ui/ai-prompt-box.tsx` for prompt input behavior, file upload, tooltips, and mode toggles
- Existing Tailwind theme variables in `app/globals.css`
- Existing Framer Motion reduced-motion patterns

`components/learning` is currently empty, so it is a good location for the new learning-workspace components.

---

# 2. Recommended product architecture

The sidebar should be scoped to the AI learning workspace rather than added globally to every Smartli page.

## Recommended shell

```text
RootLayout
├── Existing AppDock for non-learning routes
└── LearningLayout
    └── LearningShell
        ├── LearningSidebar
        └── LearningMain
            ├── ExplainerWorkspace
            └── QuizWorkspace
```

The learning shell should own:

- Sidebar visibility and collapse state
- Session history summaries
- Active session derived from the URL
- Mobile drawer behavior
- Session navigation guards
- Shared session loading and error states

The sidebar should not own the full conversation or quiz content. It should only own navigation and lightweight session summaries.

## Why this approach

The current app has several unrelated areas—Focus, Tasks, Analytics, Plan, and Account. Adding a history-heavy AI sidebar to `app/layout.tsx` would make it appear where it does not belong and would make every page depend on AI-session state.

A route-local learning shell keeps the integration focused and avoids breaking the existing application chrome.

### Alternatives

| Decision | Recommendation | Alternative | Tradeoff |
| --- | --- | --- | --- |
| Sidebar scope | Only `/learning/*` | Add it to the root layout | Root layout is simpler, but the sidebar becomes irrelevant on non-AI pages |
| Navigation model | Keep `AppDock` for general app navigation and use the sidebar for AI sessions | Replace `AppDock` completely | Replacing it would require redesigning navigation for the entire product |
| Session routes | Separate Explainer and Quiz route families | One `/session/:id` route | One route is more generic, but type-specific URLs are clearer and easier to protect |
| Client state | React Context plus reducer | Add Zustand or Redux | Existing project has no global state library; adding one is unnecessary initially |
| Persistence access | A frontend `SessionRepository` abstraction calling API routes | Direct Supabase queries from every component | Direct queries couple UI to the database and make testing and future API changes harder |

---

# 3. Sidebar UX flow

## New Explainer

1. User clicks **New Explainer**.
2. The app checks whether the current workspace is dirty:
   - Unsent text
   - Active generation
   - Unsaved quiz answer or progress
3. If necessary, show a confirmation dialog:
   - **Save and continue**
   - **Discard**
   - **Cancel**
4. Stop or finalize any active stream.
5. Create a new Explainer draft/session ID.
6. Navigate to:

```text
/learning/explainer/:sessionId
```

7. Clear the main workspace and show the empty explainer state.
8. Do not show the session in “Previous Sessions” until it has meaningful content, or show it temporarily as `New Explainer`.
9. When the first message is sent:
   - Add the user message immediately.
   - Generate a fallback title from the first message.
   - Persist the message.
   - Update the sidebar summary optimistically.
10. Optionally replace the fallback title later with an AI-generated title.

## New Quiz

1. User clicks **New Quiz**.
2. Run the same dirty-state guard.
3. Create a Quiz draft/session ID.
4. Navigate to:

```text
/learning/quiz/:sessionId
```

5. Show the quiz setup or source-content state.
6. Persist the quiz as soon as it is generated.
7. Preserve:
   - Questions
   - Answers
   - Current question index
   - Progress
   - Score
   - Quiz type
   - Completion status
   - Generation metadata

A quiz should appear in the history as soon as a durable quiz draft or generated quiz exists.

## Opening a previous session

1. User selects a history item.
2. If the current workspace is dirty, run the navigation guard.
3. Abort or save the active generation.
4. Navigate using the session item URL.
5. Load the session state.
6. Render a loading skeleton while loading.
7. Restore the exact Explainer or Quiz workspace.
8. Derive active state from the URL and apply the visual highlight.
9. Close the mobile drawer after navigation.

## Browser refresh and back/forward

The URL should be the source of truth for the active session. The sidebar should not maintain a separate “selected session” value that can drift from the URL.

---

# 4. Sidebar layout

## Expanded desktop layout

```text
┌──────────────────────────────┐
│ Smartli                 [◀]  │
├──────────────────────────────┤
│ [＋] New Explainer            │
│ [✓] New Quiz                 │
├──────────────────────────────┤
│ PREVIOUS SESSIONS             │
│                              │
│ Explainers                   │
│  ✨ Photosynthesis     2m     │
│  ✨ React performance  1h     │
│                              │
│ Quizzes                      │
│  ✓ Biology revision    3h     │
│  ✓ Calculus practice   1d     │
│                              │
│                              │
├──────────────────────────────┤
│ [‹] Collapse sidebar         │
└──────────────────────────────┘
```

## Recommended dimensions

- Expanded width: approximately `280px`
- Collapsed rail: approximately `68px`
- Session row height: approximately `56–64px`
- Sidebar height: `100dvh`
- History region: independently scrollable
- Main content: `min-width: 0` to prevent long titles or messages from forcing overflow

## Session grouping

Use two lightweight sections:

- Explainers
- Quizzes

This provides a clear distinction without adding a separate filter system.

Each history item should include:

- Type icon
- One-line title with ellipsis
- Relative timestamp
- Active state
- Optional status indicator for:
  - Draft
  - Generating
  - Error
  - Completed quiz

Avoid showing full message previews by default. They make the sidebar noisy and are expensive for large histories.

## Active state

The active item should use:

- A low-contrast filled background
- A stronger text color
- A small left accent or type-colored indicator
- `aria-current="page"` on the session link

Do not rely only on color. The active state should also use shape, weight, or an indicator.

## Collapsed state

Keep accessible icons for:

- New Explainer
- New Quiz
- Session history
- Sidebar expand

For the history icon, clicking it should open the sidebar or a compact history popover. Showing every session as an icon would not scale and would make the collapsed state confusing.

Collapsed controls should have:

- Radix tooltips
- `aria-label`
- Visible keyboard focus
- At least a 40–44px hit area

## Animation

Use a short CSS transition for the desktop rail:

- Width: approximately 180–220ms
- Sidebar content opacity: approximately 120–160ms
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

The layout width must change because the main content needs to reflow. This is one of the cases where animating width is justified.

Respect `prefers-reduced-motion`:

- Keep the layout change functional.
- Remove slide/scale movement.
- Retain a small opacity or color transition if helpful.

---

# 5. Proposed component hierarchy

New components should primarily live under `components/learning`.

```text
app/learning/layout.tsx
└── LearningShell
    ├── LearningSidebar
    │   ├── SidebarHeader
    │   │   ├── SmartliMark
    │   │   └── SidebarToggle
    │   ├── SessionCreateActions
    │   │   ├── NewExplainerButton
    │   │   └── NewQuizButton
    │   ├── SessionHistory
    │   │   ├── SessionSection
    │   │   │   └── SessionHistoryItem
    │   │   └── HistoryLoadingState
    │   ├── HistoryEmptyState
    │   ├── HistoryErrorState
    │   └── SidebarFooter
    ├── MobileSidebarTrigger
    ├── UnsavedSessionDialog
    └── LearningMain
        ├── ExplainerWorkspace
        │   ├── ExplainerHeader
        │   ├── MessageList
        │   ├── StreamingMessage
        │   └── ExplainerComposer
        └── QuizWorkspace
            ├── QuizHeader
            ├── QuizProgress
            ├── QuestionView
            ├── AnswerControls
            └── QuizResults
```

## Components that can be reused

- `Button`
- `Card`
- `Input`
- `Textarea`
- `StreamingResponse`
- Existing icons
- Existing AI prompt input behavior where appropriate
- Existing `useReducedMotion` usage
- Existing `cn` utility

## Components that should not be reused blindly

`AiPromptBoxDemo` is currently a demonstration component with logging-only behavior. It should not become the session controller.

The current Explainer and Quiz pages also have duplicated page-local state. They should be refactored into workspace components that receive session state and callbacks rather than owning all state independently.

---

# 6. Session data model

The sidebar should use lightweight summaries, while the active workspace loads the full session.

## Session summary

```ts
type SessionType = 'explainer' | 'quiz';

type SessionStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'error'
  | 'archived';

interface SessionSummary {
  id: string;
  type: SessionType;
  title: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
  progress?: number;
  route: string;
}
```

## Shared message model

```ts
type MessageRole = 'user' | 'assistant' | 'system';

type MessageStatus =
  | 'pending'
  | 'streaming'
  | 'complete'
  | 'interrupted'
  | 'error';

interface SessionMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: string;
  completedAt?: string;
  requestId?: string;
  attachments?: {
    name: string;
    type: string;
    url?: string;
  }[];
}
```

## Explainer session

```ts
interface ExplainerSession extends SessionSummary {
  type: 'explainer';
  mode: 'explainer' | 'tutor' | 'eli5';
  model?: string;
  messages: SessionMessage[];
  draftInput?: string;
  generationState?: {
    requestId: string;
    status: 'idle' | 'streaming' | 'interrupted' | 'error';
  };
}
```

## Quiz session

```ts
interface QuizSession extends SessionSummary {
  type: 'quiz';
  quizType: 'mcq' | 'exam' | 'competency' | 'reasoning';
  questions: QuizQuestion[];
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  score?: number;
  progress: number;
  sourceText?: string;
  startedAt?: string;
  completedAt?: string;
}
```

Additional fields worth including:

- `schemaVersion` for future migrations
- `revision` for optimistic concurrency control
- `lastSavedAt`
- `archivedAt`
- `errorMessage`
- `titleSource: 'default' | 'user' | 'generated'`
- `lastGenerationRequestId`

The existing `QuizQuestion` type can be extended, but the current raw streamed quiz response is not enough to restore an interactive quiz.

---

# 7. State-management architecture

## Global learning-shell state

Keep these in the learning shell or a learning context:

- Sidebar expanded/collapsed state
- Mobile drawer open/closed state
- Session summary list
- History loading/error state
- In-flight session mutations
- Optional dirty-state registration
- Optional cached session summaries

Persist only the desktop collapse preference locally:

```text
smartli.sidebar.collapsed
```

Do not persist the full session list in local storage as the source of truth.

## Sidebar-local state

The sidebar may own:

- Hovered row
- Tooltip visibility
- Local “load more” interaction
- Section display state, if sections become collapsible later

It should not own:

- Full messages
- Quiz answers
- Generation state
- The canonical active session ID

## Current session state

The active workspace should own:

- Full session data
- Composer draft
- Streaming response state
- Quiz answer selection
- Question navigation
- Local dirty state
- Save status

The current session should be keyed by the URL session ID. When the ID changes, the workspace should load or reset accordingly.

## URL state

The URL should own:

- Session type
- Session ID

The URL should not own:

- Sidebar collapse preference
- Full serialized messages
- Quiz answers
- Temporary loading state

## Server state

The backend should be authoritative for:

- Session ownership
- Session metadata
- Messages
- Quiz questions
- Answers and score
- Completion status
- Updated timestamps
- Archive/delete state

## Preventing race conditions

Recommended protections:

1. Give every generation request a unique `requestId`.
2. Abort the active request when changing sessions.
3. Ignore late stream chunks whose `requestId` is no longer active.
4. Save with a session `revision` or `updatedAt` check.
5. Make session creation idempotent using a client-generated idempotency key.
6. Disable duplicate New Explainer/New Quiz submissions while creation is pending.
7. Derive the active history item from `usePathname()` or route params.
8. Use one session controller rather than independently updating the sidebar and workspace.

---

# 8. Routing architecture

## Recommended routes

```text
/learning/explainer
/learning/explainer/new
/learning/explainer/:sessionId

/learning/quiz
/learning/quiz/new
/learning/quiz/:sessionId
```

`/new` is a short-lived creation route. Once a session is created, the application should replace it with the real session URL:

```text
/learning/explainer/new
        ↓
/learning/explainer/7c2...
```

Use `router.replace()` after creation so the temporary `/new` URL does not remain in browser history.

## Why separate route families

- A Quiz session and an Explainer session have different workspace state.
- The route makes the type explicit.
- Invalid type/session combinations are easier to reject.
- Deep links are clearer.
- Browser history remains intuitive.

### Alternative

```text
/learning/session/:sessionId
```

This is more generic, but requires loading the session before knowing which workspace to render. It is reasonable later if additional session types are added.

## Existing `/ai` route

The current `/ai` route is not equivalent to the working learning routes. Recommended migration:

1. Make `/learning/explainer` the canonical Explainer experience.
2. Make `/learning/quiz` the canonical Quiz experience.
3. Update the AI item in `AppDock` to point to `/learning/explainer`.
4. Keep `/ai` temporarily as a redirect or compatibility route.
5. Do not leave the logging-only demo as the primary AI destination.

The existing dashboard links in `app/page.tsx` already point to the learning routes and can remain.

---

# 9. Backend and API requirements

These are not part of the frontend-only implementation, but the frontend should be designed around them.

## Suggested API surface

```text
GET    /api/sessions?type=explainer|quiz&cursor=...
POST   /api/sessions
GET    /api/sessions/:sessionId
PATCH  /api/sessions/:sessionId
POST   /api/sessions/:sessionId/messages
POST   /api/sessions/:sessionId/generate
DELETE /api/sessions/:sessionId
POST   /api/sessions/:sessionId/archive
```

## Creation

`POST /api/sessions` should accept:

```json
{
  "type": "explainer",
  "clientRequestId": "..."
}
```

It should return the authoritative session ID and metadata.

The client should not create permanent sessions solely through React state.

## Session history

The history endpoint should return summaries only:

```json
{
  "items": [
    {
      "id": "...",
      "type": "explainer",
      "title": "Photosynthesis",
      "status": "active",
      "updatedAt": "...",
      "progress": null
    }
  ],
  "nextCursor": "..."
}
```

Do not fetch full messages for every sidebar row.

## Autosaving

The frontend should:

- Debounce updates by approximately 500–1000ms.
- Save on meaningful state transitions.
- Flush before intentional navigation when possible.
- Show a small save state such as:
  - Saving
  - Saved
  - Offline
  - Retry required

For stream interruptions, save the partial assistant response with an `interrupted` status rather than silently losing it.

---

# 10. Database requirements

For a production implementation, I recommend a parent session table plus type-specific data.

## `learning_sessions`

Suggested fields:

```text
id
user_id
type
title
status
created_at
updated_at
archived_at
last_message_preview
revision
schema_version
```

Recommended indexes:

```text
(user_id, updated_at desc)
(user_id, type, updated_at desc)
```

## Explainer data

Two reasonable approaches:

### Initial implementation

Store Explainer messages in a `messages jsonb` field on the session.

Pros:

- Fast to implement
- Simple reads
- Good for a small initial product

Cons:

- Large conversations create large row updates
- More difficult to append concurrently
- Less efficient for partial updates

### More production-ready

Create a separate `session_messages` table:

```text
id
session_id
user_id
role
content
status
created_at
request_id
metadata
```

This is the better long-term model for long conversations and streaming.

## Quiz data

A quiz can initially be stored in JSONB:

```text
quiz_state jsonb
```

It should include:

- Quiz type
- Questions
- Answer choices
- Selected answers
- Current question
- Progress
- Score
- Completion metadata

If quiz analytics or repeated attempts become important, split attempts into a separate table later.

---

# 11. Responsive behavior

## Desktop

At approximately `1024px` and above:

- Persistent sidebar
- Expanded by default for first-time users
- Collapsed rail supported
- Main content resizes beside the sidebar
- History scrolls independently

## Tablet

Between approximately `768px` and `1023px`:

- Use a drawer or overlay rather than permanently consuming width.
- Keep a small menu trigger in the learning workspace.
- Allow the drawer to remain open while browsing history.
- Close it after selecting a session.

## Mobile

Use a left-side drawer powered by the existing Radix Dialog dependency.

Recommended behavior:

- Full-height drawer
- Width around `min(88vw, 320px)`
- Scrim behind it
- Focus trapped while open
- Escape closes it
- Selecting a session closes it
- New Explainer and New Quiz remain at the top
- Respect safe-area insets

A bottom sheet is not ideal here because the history is vertical and the primary navigation is naturally left-oriented. A drawer preserves the mental model of a chat application and gives more vertical space to history.

---

# 12. Loading, empty, and error states

## Loading

Use sidebar skeleton rows:

- Icon placeholder
- Two-line title placeholder
- Timestamp placeholder

Keep the action buttons available unless the entire application is offline.

## Empty history

Show:

```text
No sessions yet

Start an Explainer or create a Quiz to build your learning history.
```

Include the two primary actions again, but keep the layout visually quiet.

## Error

Show a compact inline message:

```text
Couldn’t load your sessions.
Retry
```

Do not replace the entire workspace with an error if only the sidebar failed.

If a session fails to load:

- Preserve the URL.
- Show a session-level error state.
- Offer Retry.
- Offer Return to Learning.
- Do not silently navigate to a different session.

## Long titles

- Clamp to one line in the sidebar.
- Use the full title in a tooltip.
- Do not allow the title to change the row height significantly.
- Use generated fallback titles such as the first 40–60 characters of the first user message.

---

# 13. Performance plan

Start simple, but design the interfaces for growth.

## Initial implementation

- Fetch 25–50 session summaries.
- Sort by `updatedAt desc`.
- Use cursor-based pagination.
- Add an accessible **Load more** fallback.
- Keep full session content out of the history response.
- Cache the current history in the learning context.
- Optimistically update title, timestamp, and status after local changes.

## Later scaling

When histories become large:

- Add list virtualization after approximately 200–500 visible items.
- Add server-side search.
- Add date grouping such as Today, Previous 7 Days, Older.
- Consider separate type filters.
- Use background refresh when the tab regains focus.

Do not add virtualization in the first frontend slice. A normal scrollable list is simpler and sufficient for the initial product.

---

# 14. Security and data isolation

The client must not be responsible for enforcing ownership.

The backend must:

- Read the authenticated user from the Supabase session.
- Verify that `session.user_id === auth.uid()`.
- Reject access to sessions owned by another user.
- Apply authorization to every read, update, archive, and delete operation.
- Use Supabase Row Level Security if the database is accessed directly.
- Avoid exposing service-role keys to the browser.
- Treat client-submitted scores and completion states as untrusted.
- Avoid exposing quiz answers before the appropriate reveal step if preventing answer inspection matters.

The browser can use UUIDs, but UUIDs are not an authorization mechanism. A user who guesses or obtains another ID should still receive a denial.

The existing `lib/supabase/client.ts` uses the public anon key, which is appropriate for browser-side Supabase usage, but the current application does not show server-side session validation or session route protection.

---

# 15. Files likely to change

## Frontend files

### Likely new files

```text
app/learning/layout.tsx

app/learning/explainer/new/page.tsx
app/learning/explainer/[sessionId]/page.tsx

app/learning/quiz/new/page.tsx
app/learning/quiz/[sessionId]/page.tsx

components/learning/learning-shell.tsx
components/learning/learning-sidebar.tsx
components/learning/session-create-actions.tsx
components/learning/session-history.tsx
components/learning/session-history-item.tsx
components/learning/session-loading-state.tsx
components/learning/session-empty-state.tsx
components/learning/session-error-state.tsx
components/learning/unsaved-session-dialog.tsx
components/learning/explainer-workspace.tsx
components/learning/quiz-workspace.tsx

hooks/use-learning-sessions.ts
hooks/use-session.ts
lib/sessions/repository.ts
lib/sessions/types.ts
components/ui/tooltip.tsx
```

### Likely existing files to modify

```text
app/layout.tsx
components/navigation/app-dock.tsx
app/learning/explainer/page.tsx
app/learning/quiz/page.tsx
app/page.tsx
hooks/useAIStream.ts
types/index.ts
lib/ai/cache.ts
app/globals.css
```

### Potentially deprecated or repurposed

```text
app/ai/page.tsx
components/ai/ai-prompt-box-demo.tsx
```

`app/ai/page.tsx` should either redirect to the new Explainer experience or become a clearly separate landing page. It should not remain the primary `/ai` destination if its send action only logs data.

---

# 16. Backend/database files likely required later

These are outside the requested frontend scope:

```text
app/api/sessions/route.ts
app/api/sessions/[sessionId]/route.ts
app/api/sessions/[sessionId]/messages/route.ts
app/api/sessions/[sessionId]/generate/route.ts
supabase/migrations/...
lib/supabase/server.ts
lib/supabase/middleware.ts
middleware.ts
```

The exact server structure depends on whether session access goes through Next API routes, Supabase directly with RLS, or a separate backend.

For the first frontend pass, I would define a `SessionRepository` interface and use a mock repository or fixtures. That lets the sidebar and route behavior be built without pretending that `sessionStorage` is production persistence.

---

# 17. Main risks and compatibility issues

## 1. Existing AI state is not conversation state

`useAIStream` currently exposes one streamed string. Restoring a conversation requires a message collection and stable message IDs.

## 2. Quiz state does not exist yet

The current quiz page renders raw generated text. Full quiz restoration requires:

- Structured question parsing or structured model output
- Interactive answer controls
- Answer persistence
- Progress persistence
- Completion and scoring behavior

This is the largest functional gap.

## 3. `/ai` and `/learning/*` are inconsistent

There are two different AI experiences. The navigation should be unified before or during the sidebar integration.

## 4. Global `AppDock` conflicts with a learning sidebar

The existing dock is rendered by the root layout. It should be hidden or scoped away from `/learning/*` to avoid competing navigation systems.

## 5. Existing session cache can return incorrect data

The AI cache key does not include every request parameter. It should remain a response cache only and should be corrected or isolated from session persistence.

## 6. Streaming and navigation can race

A late stream chunk could update the wrong session unless requests are associated with a `sessionId` and `requestId`.

## 7. Auth is currently client-oriented

The frontend should provide good loading and unauthorized states, but actual ownership enforcement must be implemented server-side.

---

# 18. Step-by-step implementation plan

## Phase 1: Define the frontend session contract

1. Add `SessionSummary`, `ExplainerSession`, `QuizSession`, and `SessionMessage` types.
2. Define a `SessionRepository` interface.
3. Add mock session data for the sidebar.
4. Define route builders for Explainer and Quiz session URLs.

## Phase 2: Add the learning shell

1. Create `app/learning/layout.tsx`.
2. Create `LearningShell`.
3. Add desktop expanded and collapsed sidebar states.
4. Add mobile drawer behavior using Radix Dialog.
5. Add tooltips for collapsed controls.
6. Add loading, empty, and error states.
7. Ensure history has its own scroll container.

## Phase 3: Integrate routing

1. Add `/learning/explainer/new`.
2. Add `/learning/explainer/[sessionId]`.
3. Add `/learning/quiz/new`.
4. Add `/learning/quiz/[sessionId]`.
5. Make the session ID in the URL the canonical active-session value.
6. Update the existing AI dock route to point to the learning experience.
7. Redirect `/ai` to the canonical Explainer route if appropriate.

## Phase 4: Refactor the existing workspaces

1. Extract the current Explainer UI into `ExplainerWorkspace`.
2. Extract the current Quiz UI into `QuizWorkspace`.
3. Move session data loading above the workspace.
4. Replace page-local one-string state with session-aware message/quiz state.
5. Connect the current streaming hook to the active session.
6. Add request IDs and cancellation handling.

## Phase 5: Add navigation safety

1. Track unsent input and unsaved changes.
2. Add `UnsavedSessionDialog`.
3. Abort active streams before session navigation.
4. Save or mark interrupted streams.
5. Prevent duplicate session creation.
6. Add optimistic sidebar updates with rollback on failure.

## Phase 6: Connect persistence

1. Replace the mock repository with API calls.
2. Fetch paginated session summaries.
3. Load full sessions only after navigation.
4. Add debounced autosave.
5. Add retry behavior for failed writes.
6. Refresh history after mutations and on window focus.

## Phase 7: Validate the integration

Test:

- New Explainer
- New Quiz
- Empty history
- Long titles
- Hundreds of history items
- Refreshing a deep session URL
- Browser back/forward
- Switching Explainer and Quiz
- Closing/opening the sidebar
- Mobile drawer behavior
- Keyboard-only navigation
- Active generation followed by navigation
- Failed history load
- Failed session load
- Unauthorized session ID
- Reduced-motion preference

---

## Recommended first frontend slice

The first implementation should not attempt full production persistence yet.

I recommend building:

1. The route-local `LearningShell`
2. The responsive sidebar
3. Mock session summaries
4. New Explainer/New Quiz navigation
5. Dynamic session routes
6. Active-session highlighting
7. Loading, empty, error, and dirty-state UI
8. Session interfaces that can later connect to the API

That will validate the visual architecture and navigation model without coupling the UI to an unfinished database or forcing the current raw quiz stream into a fake persistence model.

Validation after inspection: project diagnostics reported **0 errors**, with existing warnings in `components/ui/ai-prompt-box.tsx` and `app/globals.css`. No implementation tests were run because no code was changed.

## User

I want it to only be frontend, no backend.

## Assistant

<thinking>
**Implementing Client-Side Logic**

I'm focusing on a pure frontend solution. This involves handling all sidebar interactions, data persistence, session tracking, state management, and routing directly within the client's browser.

**Designing Frontend-Only Solution**

I'm currently strategizing the architectural blueprint for a purely client-side implementation. The focus is on leveraging `localStorage` for data persistence and React Context for robust state management, ensuring a seamless user experience without backend dependencies.

**Refining Client-Side Routing**

I've realized dynamic client-side routing with Next.js App Router is exceptionally effective. Utilizing `useParams` and `usePathname` to extract session IDs from URLs for loading data from `localStorage` allows for seamless refreshes, bookmarking, and navigation.

**Optimizing Session Loading**

I'm implementing lazy loading for session details, storing full histories in session-specific `localStorage` keys to ensure rapid sidebar performance, even with numerous sessions.

**Guarding Unsaved Work**

I'm developing a navigation guard to intercept custom transitions and add a `beforeunload` listener for full page refreshes or tab closures when streaming or unsaved quizzes are active.

**Integrating Streaming Hook**

I'm integrating the existing `useAIStream` hook, which calls the `/api/ai/stream` route, ensuring smooth data flow for streaming functionality.


</thinking>

To make this a **100% frontend-only integration** (no database migrations, backend tables, or API route changes), we can leverage Next.js dynamic client routing and back the entire persistence layer with browser-native `localStorage` and `sessionStorage`. 

This allows users to copy/paste session URLs, refresh the page, use browser back/forward, and navigate between explainers and quizzes while preserving their history and state.

---

### 1. Frontend Persistence Architecture (`localStorage` Split-Key Model)

To handle potentially hundreds of sessions without performance degradation (from parsing a single giant JSON object on every page load), we will use a **split-key index model**:

```
localStorage
├── "smartli_sessions_index"      -> List of all session metadata (small, loaded on boot for the sidebar)
├── "smartli_session_detail_[id]" -> Full message list or quiz state (loaded only when navigating to that session)
└── "smartli_sidebar_collapsed"   -> Boolean preference for collapse state
```

#### The Client-Side Types

```typescript
export type SessionType = 'explainer' | 'quiz';

export interface SessionSummary {
  id: string;
  type: SessionType;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
  status: 'draft' | 'active' | 'completed';
}

export interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ExplainerSession extends SessionSummary {
  messages: SessionMessage[];
}

export interface QuizSession extends SessionSummary {
  quizType: 'mcq' | 'exam' | 'competency' | 'reasoning';
  questions: QuizQuestion[]; // Extracted structured questions
  answers: Record<string, string>; // questionId -> selectedOption/text
  currentQuestionIndex: number;
  score?: number;
  sourceText?: string;
}
```

---

### 2. Client Routing Scheme (Next.js App Router)

We will use Next.js dynamic routing on the client side. The URL will act as the single source of truth:

| URL | Component View | Action on Load |
| :--- | :--- | :--- |
| `/learning/explainer` | `ExplainerWorkspace` | Load a blank slate with a temporary draft ID |
| `/learning/explainer/[sessionId]` | `ExplainerWorkspace` | Pull `sessionId` from URL, load full conversation from `localStorage` |
| `/learning/quiz` | `QuizWorkspace` | Load quiz setup/upload screen with a draft ID |
| `/learning/quiz/[sessionId]` | `QuizWorkspace` | Pull `sessionId` from URL, load existing quiz state and answers |

---

### 3. Collapsible Sidebar Layout & Framer Motion

```text
┌─────────────────────────────────┐
│ Smartli Workspace          [◀]  │  <-- Framer Motion layouts animate the layout reflow
├─────────────────────────────────┤
│ [＋] New Explainer              │  <-- Creates draft, redirects to /learning/explainer/[id]
│ [✓] New Quiz                    │  <-- Redirects to /learning/quiz/[id]
├─────────────────────────────────┤
│ PREVIOUS SESSIONS               │
│                                 │
│  ✨ Explainers                  │
│    ✨ Photosynthesis       2m   │  <-- Highlighted via active Next.js pathname matching
│    ✨ React Performance    1h   │
│                                 │
│  ✓ Quizzes                      │
│    ✓ Bio Practice (80%)    3h   │
│                                 │
└─────────────────────────────────┘
```

#### Framer Motion Sidebar Transition

We'll use a clean, Apple-inspired easing spring for the sidebar expand/collapse. Since layout width shifts require page content reflow, animating `width` directly with `layout` is appropriate:

```tsx
const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 380,
  damping: 35,
  mass: 1,
};

// Inside Sidebar:
<motion.div
  animate={{ width: isCollapsed ? 68 : 280 }}
  transition={SPRING_TRANSITION}
  className="h-screen border-r border-border/40 bg-zinc-950 flex flex-col relative"
>
  ...
</motion.div>
```

- **Hover States:** Highlight rows using a custom scale-down tap animation (`whileTap={{ scale: 0.98 }}`).
- **Tooltips:** When collapsed, show tooltip icons using standard Radix tooltip components with zero delay for subsequent entries.

---

### 4. Client-Side UX Flows & Navigation Guards

#### Starting a New Session
When **New Explainer** or **New Quiz** is clicked:
1. A unique client-side UUID is generated (`crypto.randomUUID()`).
2. The browser routes to `/learning/[type]/[new-id]`.
3. The sidebar is not updated yet (prevents cluttering the history with empty drafts).
4. **Activation:** Once the user sends their first message or uploads content, the session is promoted from `draft` to `active`, appended to the `smartli_sessions_index` in `localStorage`, and appears instantly in the sidebar list.

#### Navigation Guard (Dirty State Check)
If the user tries to navigate away while:
- An AI stream is active
- A quiz is currently in progress (not submitted)

We will intercept click events inside our learning workspace and show a Radix-based overlay Modal asking:
> *"Are you sure you want to leave? Your current session progress will be lost."*

---

### 5. Detailed Step-by-Step Implementation Plan

```mermaid
graph TD
    A[Phase 1: Session State Provider] --> B[Phase 2: App Layout & Sidebar Shell]
    B --> C[Phase 3: Explainer Workspace Integration]
    C --> D[Phase 4: Quiz State Machine & Workspace]
    D --> E[Phase 5: UX Polish & Interaction Guards]
```

#### Phase 1: Context & Storage Helpers (Local State Engine)
1. **Create `hooks/useLearningSessions.ts`**: Create a context provider wrapping `/learning` routes that loads, updates, and syncs history summaries to `localStorage`.
2. **Implement Cache Promoters**: When a stream starts, auto-generate a fallback title (e.g., the first 5 words of the input prompt) and save it to the session metadata.

#### Phase 2: Create the Sidebar Shell
1. **Create Layout wrapper `app/learning/layout.tsx`**: Houses the sidebar and the main content viewport side-by-side.
2. **Build `components/navigation/learning-sidebar.tsx`**:
   - Prominent action buttons with active spring scales (`New Explainer` / `New Quiz`).
   - Grouped scrollable history (Explainer / Quiz).
   - Compact collapsible rail layout supporting Radix-powered tooltips.
   - Mobile responsive layer: Under `1024px`, the sidebar translates to a slide-out overlay drawer using Radix `<Dialog />`.

#### Phase 3: Build the Explainer Workspace
1. **Refactor `/learning/explainer/page.tsx`**: Move layout code into `components/learning/explainer-workspace.tsx` so the workspace can accept a `sessionId` prop.
2. **Routing catch**: Set up `app/learning/explainer/[sessionId]/page.tsx` to mount the workspace, loading existing messages from `localStorage` using the ID. If the ID is new/draft, initialize a clean history.
3. **Stream Append**: On stream end, save the final complete assistant message directly to the session detail cache in `localStorage` and trigger an optimistic update in the sidebar history list.

#### Phase 4: Build the Quiz Workspace (Interactive Quiz Engine)
1. **Refactor `/learning/quiz/page.tsx`**: Move raw text streaming output into a structured, step-by-step quiz view inside `components/learning/quiz-workspace.tsx`.
2. **Create Quiz state machine**: 
   - Parse the AI's streamed quiz string (or parse it client-side into JSON questions).
   - Render one question at a time.
   - Allow users to select options, navigate next/back, and review explanations.
   - Calculate final scores and save answer states directly to `localStorage`.

#### Phase 5: Navigation Guard & Polish
1. **Create `components/ui/unsaved-session-dialog.tsx`**: Simple confirmation popup.
2. **Hook up Route Triggers**: Check for active streaming or quiz progress on router transition calls and prompt the confirm dialog.
3. **Smooth animations**: Apply physical spring pops on button presses (`scale(0.97)` active states) to make the UI feel highly tactile.

---

### 6. Codebase Files: Create & Modify List

#### 📂 Files to Create:
- **`app/learning/layout.tsx`**: Scopes the sidebar layout to AI-powered routes only.
- **`app/learning/explainer/[sessionId]/page.tsx`**: Client page for loaded/draft conversations.
- **`app/learning/quiz/[sessionId]/page.tsx`**: Client page for loaded/completed quizzes.
- **`components/navigation/learning-sidebar.tsx`**: Collapsible sidebar with active springs, hover highlights, and Radix drawer.
- **`components/learning/explainer-workspace.tsx`**: Interactive chat interface that loads history.
- **`components/learning/quiz-workspace.tsx`**: Active recall environment with step-by-step questions and status saving.
- **`hooks/useLearningSessions.ts`**: Frontend-only context coordinator to manage summary lists and write states to disk.

#### 📂 Files to Modify:
- **`app/learning/explainer/page.tsx`**: Refactored to act as a router landing page that auto-generates a new draft ID and redirects to `/learning/explainer/[sessionId]`.
- **`app/learning/quiz/page.tsx`**: Refactored to auto-generate a new quiz ID and redirect to `/learning/quiz/[sessionId]`.
- **`components/navigation/app-dock.tsx`**: Update the "AI" dock link to route to `/learning/explainer` and hide the dock on mobile inside the learning workspace.
- **`types/index.ts`**: Appends the frontend workspace summary and item contracts.

---

### What do you think of this client-only routing and storage blueprint? If you're ready, I can begin writing the implementation files step-by-step.

<thinking>

</thinking>

## User

Yes, implement it.

## Assistant

<thinking>
This is a substantial build - I need to plan out the pieces systematically: extending the types for sessions, creating a localStorage helper for persistence, a context hook to manage sessions, a layout wrapper for the learning route, and a sidebar navigation component.

Since there's no backend, I need a pragmatic client-side parser to extract structured quiz questions from streamed markdown text, handling common patterns like numbered questions, multiple choice options, and answer/explanation markers.

Writing session type definitions...

Now I'm designing the storage module functions for managing session index and details, including CRUD operations and ID generation using crypto.randomUUID().

Since native storage events don't fire in the same tab, I need a custom pub-sub mechanism using a window CustomEvent to sync sidebar and workspace components when sessions change. I'm sketching out a context provider hook that loads sessions, subscribes to change events, and exposes create/update/remove operations, then planning the learning shell, sidebar, and history item components.

To keep the file count manageable, I'm consolidating some pieces—folding empty/loading/error states into the sidebar itself rather than splitting into separate files, while still keeping a mobile drawer component separate for the responsive Radix Dialog behavior.

I still need components for the unsaved-session dialog, explainer workspace, and quiz workspace, plus a parser for turning raw quiz text into structured question objects, which I'll place in the AI lib folder. I also want a shared, reusable tooltip wrapper around Radix, since the prompt box currently has one inlined but not exported.

I'm also planning a hook for loading and autosaving individual session details with debouncing, and I'm laying out the file plan—starting with a types file to serve as the single source of truth for session-related types, which other files will re-export from.

I'll keep the existing global types for explainer mode and quiz structures and build new session types around them, importing from the shared types file. I'm also planning out an ID generator with a fallback for browsers lacking crypto.randomUUID, a localStorage-backed storage module with pub-sub, the quiz text parser, a sessions list hook with context for creating and deleting sessions, a detail hook with autosave, and a standalone reusable tooltip component using Radix since the current implementation is only defined locally and not exported.

Now I'm mapping out the sidebar UI with both desktop and mobile Radix Dialog variants, an unsaved-session confirmation dialog built on the existing Dialog primitive since alert-dialog isn't installed, and the learning layout that wraps everything in the sessions provider while hiding the bottom dock. I'm also planning the explainer and quiz workspace components that take a sessionId prop, along with page routes that redirect to a freshly generated session id and render the workspace for a given session.

For hiding the AppDock on learning routes, I'm thinking of using usePathname to check for the /learning prefix and simply not rendering it there. Since the root layout is currently a server component, I need to wrap the main content and dock in a client component so pathname-based logic works, which would also let me conditionally drop the bottom padding for learning routes so the sidebar can use the full height.

For the session creation flow, the explainer page will generate an id on mount and immediately redirect to a session-specific URL, showing a brief loading state.

The sidebar's "New Explainer" button can just push directly to the bare route and let the redirect handle it, keeping both entry points consistent.

For loading session details, I'll try to load from storage on mount using the sessionId, and if nothing exists yet, initialize a fresh empty detail matching the type without persisting until something actually changes.

Actually, this generic hook approach is adding too much abstraction risk—I'll simplify by handling storage logic inline within the workspace components instead, keeping the persistence functions in lib/sessions/storage.ts.

For the explainer workspace, I need to track messages, input, mode, and streaming state. I can reuse useAIStream but need to capture the final streamed text as a completed assistant message via an effect watching for completion or errors.

On mount, I load the session detail with its messages and mode. On submit, if there are no existing messages, the first one creates the session summary with a truncated title; otherwise I append the user message and call startStream with just the latest prompt, matching the existing app's behavior of not stitching full conversation history.

I'll track isLoading to show a temporary streaming assistant message during generation, then push the final message and persist the updated detail and summary once complete. For dirty-state handling, I want to detect active generation or unsaved input and show a confirmation before navigating away to a different session or creating a new one.

I'll define dirty as: actively streaming, a quiz started but not submitted, or unsent input text in the explainer. For the dialog, I'll simplify to just "Leave anyway" versus "Cancel," since there's no separate save action beyond what's already auto-persisted — leaving during a stream would just abort it.

I'm thinking through the context design: a `LearningGuardContext` exposing dirty state and a leave-request function, provided at the shell level so sidebar navigation can check it before routing away.

Writing the navigation guard context...

Adding navigation guard logic...

I should also add a beforeunload listener to catch browser tab closes, checking isDirtyRef so it's cheap to include. Now I'm building the UnsavedSessionDialog with Radix Dialog and Framer Motion for a centered modal warning...

Styling the dialog content...

Finishing the confirmation dialog buttons, then moving to the session storage layer, starting with type definitions for session types and statuses.

Defining more session types...

Still writing storage helpers...

Adding upsert, remove, and getSessionDetail functions...

Building the context provider...

Finishing the provider export and adding a `useLearningSessions` hook that throws if used outside the provider. Next I need a simple `useSidebarCollapsed` hook for localStorage-backed sidebar state, then move on to building the LearningShell layout combining providers, sidebar, and main content.

For the sidebar itself, I'm deciding to handle mobile drawer behavior directly inside LearningSidebar rather than a separate component—desktop shows a rail with a width-transition animation hidden on small screens, while mobile gets a top bar with a hamburger trigger opening a Radix Dialog drawer, both sharing the same inner content component to avoid duplicating the list.

Writing sidebar component...

Writing sidebar navigation logic...

Adding mobile top bar with menu trigger button...

Building the sliding drawer panel...

Wiring up error handling, retry, and selection callbacks, then defining the props interface for the sidebar content component.

Adding the collapse toggle button...

Adding the session history section and defining the NewSessionButton component props...

Finishing the sidebar button styling, wrapping it in a tooltip when collapsed, and now moving on to the SessionH component.

Adding the loading state...

Now I'm adding an error state with a destructive-styled alert and retry button, then starting to handle the empty sessions case.

Defining more component sections...

Adding button styles...

Finishing the row with a relative timestamp, wrapping collapsed items in tooltips for the title, then moving on to build the tooltip UI component using Radix's tooltip primitive.

Adding animation styles and export...

I'm realizing the "animate-in" utility classes require the tailwindcss-animate plugin, which isn't installed in this project, so those classes will silently have no effect without erroring.  Since the existing ai-prompt-box.tsx already relies on these same non-functional classes, I could mirror that pattern, but I'd rather avoid adding more of this and simplify my new tooltip by dropping the animation classes entirely for a cleaner, functional result. Writing tooltip styles...

Next I'm building a small hook to manage a persisted sidebar-collapsed boolean, reading and writing it via localStorage so it survives reloads. Then I'll move on to setting up a navigation-guard context, placing it under components/learning/ as a client component.

Writing layout structure...

This layout file doesn't need 'use client' since it's just composing client components as a server component. Now I need to check app/layout.tsx to hide AppDock and remove the pb-28 padding specifically on /learning routes.

I'm planning a client-side app-chrome wrapper component that uses usePathname to detect the /learning route and conditionally applies the padding and AppDock rendering...
Finishing app-chrome...

This avoids touching app-dock.tsx itself, aside from updating the "AI" link to point to /learning/explainer instead of /ai. Now I'm moving on to writing explainer-workspace.tsx and quiz-workspace.tsx along with their page routes, starting with the props and data-loading logic for the explainer workspace.

Writing component logic...

Building the workspace component, defining helper functions for creating empty session details and deriving short titles from message text, then starting the main component with state for the session detail and loading status.

Now I'm wiring up state for input, streaming, navigation guard, and scroll ref, plus effects to load the session on mount and track dirty state based on active generation or unsent input.

I'm setting up the beforeLeave handler to stop streaming, and adding an effect that persists the completed assistant message once streaming finishes, appending it to the session's message list.

I'm also adding an auto-scroll effect that keeps the chat scrolled to bottom as new messages or streaming text arrive, and defining a persist function that saves the session detail and updates the session summary using the first user message as the title source.

I realize there's a bug: I referenced a nonexistent createdAtCache field. I need to instead preserve createdAt by checking for an existing summary first, so updates don't lose the original creation timestamp.

I'll add a helper to storage.ts that looks up a session's existing summary by id, then use it in the persist function to reuse createdAt or default to the current time when none exists.

Now I'm writing the handleSubmit handler, which builds a new user message, appends it to the session detail, persists the update, and clears the input field.

I'm also adding a handleModeChange function that updates the explainer's mode in state and saves it. I'm double-checking whether `detail` might be stale when referenced by closure after the assistant message completes, since setState isn't synchronous, though since the user message was already appended right before the async call I think it's included.

Actually, adding `detail` to deps would trigger the effect on every change, which isn't what I want. A more robust approach is to keep a ref updated on every render and reference that inside the effect instead, avoiding the dependency issue entirely.

Tracing through the lifecycle: startStream resets streamText and flags at the start, and completion sets isComplete true with the final text in place. Since the effect only depends on isComplete, it should only fire on that true/false transition rather than every render, so guarding with a check for isComplete and non-empty streamText should safely persist only once per completed stream.

Writing the persistence effect...

Now moving to the UI render, reusing structure similar to the original explainer page.

I'll show a loading spinner while the session loads, then render the message list plus a header with the AI Explainer title, iterating over detail.messages and showing streamText as an in-progress bubble while loading.

Adding the empty state placeholder with a graduation cap icon and prompt text, then starting to render message cards in a loop.

Adding input placeholder and submit/pause button logic...

Now I need to design the quiz parser that converts raw AI-generated text into structured question objects, which is the trickiest part of the workspace.

Since the format varies by model, I'll appended a prompt directive when generating quizzes that requests a consistent, machine-parsable delimiter format instead of relying on freeform parsing. That's controllable since we already build the prompt via lib/ai/prompts.ts, and everything still routes through the existing `/api/ai/stream` endpoint rather than any new backend.

The user's concern was about avoiding new backend features like session persistence, not about existing AI streaming infrastructure, so continuing to use useAIStream/startStream is fine. To tighten quiz parsing, I want to review the full prompts.ts file, including the constructPrompt signature, since I've only seen the partial QUIZ_PROMPTS section so far, so let me open and read that file now before finalizing anything.

I'll also tweak the quiz prompt construction to request a consistent, easy-to-parse structure with numbered questions and "Answer:"/"Explanation:" labels, which should make parsing far more reliable. I noticed gateway.ts's constructPrompt call doesn't actually pass quizType through, which looks like an existing gap I'll need to account for. Let me read prompts.ts in full now before making the edits.
</thinking>

I'll check the remaining prompt-construction logic before building the quiz engine, since I want the quiz output to be reliably parseable client-side.

**Tool Call: Read file `lib\ai\prompts.ts`**
Status: Completed

```Smartli V2\lib\ai\prompts.ts
     1	export const SYSTEM_PROMPTS = {
     2	  base: 'You are an expert AI study companion. Your goal is to help students learn through a structured pedagogical approach: Recall -> Application -> Analysis.',
     3	  explainer: 'Break down the concepts deeply but clearly. Use analogies where helpful and ensure the transition between concepts is logical.',
     4	  tutor: 'Act as an interactive tutor. Do not simply give answers; instead, ask probing questions to guide the user toward the answer, checking for understanding at each step.',
     5	  eli5: 'Explain the concept as if the user is 5 years old. Use extremely simple language, relatable analogies, and avoid technical jargon unless you explain it simply first.',
     6	};
     7	
     8	export const QUIZ_PROMPTS = {
     9	  mcq: 'Generate a multiple-choice quiz. For each question: Provide 4 options, clearly mark the correct one, and provide a detailed explanation of why the correct answer is right and why the others are wrong.',
    10	  exam: 'Generate exam-style questions. Include a mix of short-answer (comprehension) and long-form (analysis) questions. Provide a model answer and a rubric for grading.',
    11	  competency: 'Generate scenario-driven questions that test practical application of the concepts. Describe a real-world situation and ask the user to solve it using the principles provided in the context.',
    12	  reasoning: 'Generate "why" and "how" questions that require deep reasoning and justification. The goal is to test if the user understands the underlying logic, not just the facts.',
    13	};
    14	
    15	export function constructPrompt(mode: string, request: string, context: string = '') {
    16	  const system = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.base;
    17	
    18	  return `
    19	    System: ${SYSTEM_PROMPTS.base} ${system}
    20	    Context: ${context || 'No additional context provided.'}
    21	    User Request: ${request}
    22	
    23	    Instruction: Please ensure your output is pedagogically sound and follows the Recall -> Application -> Analysis progression.
    24	  `;
    25	}

```


## Assistant

<thinking>
I'm tracing `constructPrompt(mode, request, context)` and realize that for 'quiz' mode, SYSTEM_PROMPTS has no 'quiz' key, so it just falls back to the base prompt — meaning QUIZ_PROMPTS is exported but never actually used. This confirms a real bug: quiz generation is currently generic and ignores the specific instructions per quiz type entirely.

Since I'm doing frontend-only work, fixing prompts.ts is squarely in scope since it's just a plain string-builder function, not a backend addition, so I'll add a proper quiz system prompt and update constructPrompt to accept an optional quizType, appending the relevant QUIZ_PROMPTS text plus an explicit output-format instruction needed for reliable client-side parsing.

I'll also update gateway.ts to pass quizType through. For output format, I'm designing a unified delimited structure that supports mcq (with clear options and answers) as well as open-ended types like exam, competency, and reasoning, which I'll render as free-response self-check cards with a revealable model answer or rubric rather than auto-scored multiple choice.

Still writing quiz format instruction...

I'll import QuizType from the types module without creating circular dependencies, then update the gateway function to destructure quizType from the request and pass it into constructPrompt. This keeps the fix contained without expanding the backend surface. Next I want to check the quiz parser file.

Adding a fallback parser for loose formats, plus helper functions to extract labeled fields and multiple-choice options using regex matching.

Finishing the fallback parser...

Now I'm designing the QuizWorkspace component with two phases: a setup phase for pasting source text and choosing quiz type, and an in-progress/review phase for going through questions. On mount it loads the existing session, jumping straight to in-progress if questions already exist while honoring saved index, answers, and submission state, and generating a quiz triggers a streaming prompt built from the pasted content and quiz type.

On completion, it parses the response into a QuizSessionDetail with an empty answers map, resets to the first question, marks unsubmitted, and derives a title from the first few words of the source text before persisting. For answering, I'm just updating the answers map keyed by question id and persisting immediately on each change, keeping it simple rather than debouncing text inputs.

Navigation buttons just update and persist the current question index. For submission, I need to normalize matching between the user's selected option text and the correctAnswer field, since the model might return a letter or full text for correctAnswer, so I'll compare against both possibilities when scoring MCQ questions.

Finishing the normalization function to fall back to the raw answer if the index is invalid. For grading MCQs, I'll compare the user's selected option against correctAnswer case-insensitively after trimming. For free-response question types, there's no reliable way to auto-grade client-side without another AI call, which is out of scope here.

I decide instead to skip scoring for non-MCQ types: score stays undefined, but I show the model's answer alongside the user's response for self-review, marking the quiz as completed regardless of type.

Now I'm setting up the QuizWorkspace component, importing the AI streaming hook, UI primitives, icons, and quiz-related types and utilities I'll need for parsing responses and generating session IDs.

I'm defining the storage helpers for reading and writing quiz sessions, plus the navigation guard context, then setting up the list of quiz types and a helper to create an empty quiz session detail with default fields. I'm also adding a function that derives a readable title from the source text, truncating it if it's too long.

Now I'm building the QuizWorkspace component itself, wiring up state for the session detail and loading status, along with the AI streaming hook and navigation guard setters, then loading the existing session data on mount and syncing it to a ref for later access outside the render cycle.

I'm setting the dirty flag whenever there's unsaved quiz progress or an active stream, registering a cleanup to stop the stream if the user tries to navigate away, and adding an effect that parses the completed AI response into structured questions once streaming finishes, persisting the fresh question set while resetting answers and submission state. Now I'm starting to define the persist function that saves the updated session detail.

I'm calling the streaming generator with a prompt to build a pedagogically structured quiz, then adding handlers for changing the quiz type and source text that persist the updated state.

I'm now adding functions for recording answers, navigating between questions with bounds checking, and submitting the quiz, which calculates an MCQ score by comparing normalized answers against correct ones before persisting the final result.

Building the header...

Rendering the setup or runner view depending on quiz state, wiring up generation, answering, navigation, and restart handlers. Now I need to build out the QuizSetup and QuizRunner sub-components.

Settling on two files: quiz-workspace.tsx as the main entry with QuizSetup inline, and quiz-runner.tsx handling question navigation, answer controls, and results. Writing quiz runner component...

Building the progress header...

Rendering each answer option as a button with selected-state styling...

and falling back to a textarea for free-text answers when the question isn't multiple choice.

I'm adding navigation buttons below the card, with a Previous button disabled on the first question and either a Submit or Next button depending on whether it's the last question.

Now I'm building the QuizResults component, starting with a score card that shows the percentage score for MCQ quizzes.
</thinking>

## User

Um btw i only want front end for now

## Assistant

Understood — I'll keep this strictly frontend-only. No new API routes, no database, no server changes. I will only touch existing client files (adding a stricter output-format instruction to the prompt template counts as a frontend/lib change, not a backend addition — it's still just a string used by the already-existing `/api/ai/stream` route that's already part of the app).

Let me lay out exactly what I'm about to build so there are no surprises, then implement it.

## What "frontend-only" means here

- **No new API routes.** I'll keep using the existing `/api/ai/stream` endpoint and `useAIStream` hook exactly as they are today.
- **No database.** All session data (Explainer conversations, Quiz state, sidebar history, collapse preference) lives in `localStorage`, scoped to the browser.
- **No auth changes.** Nothing here touches Supabase.
- **Only additive changes** to existing files: `app/layout.tsx` (swap in a chrome wrapper), `components/navigation/app-dock.tsx` (fix the AI link), `lib/ai/prompts.ts` (ask the model for a parseable quiz format — still just a prompt string, still called through the existing endpoint).

## Files I'm about to create

```
lib/sessions/types.ts              — session/message/quiz types
lib/sessions/id.ts                 — id generator
lib/sessions/storage.ts            — localStorage read/write + change events
lib/ai/quiz-parser.ts              — parses raw AI text into structured questions
hooks/useLearningSessions.tsx      — sidebar history context
hooks/useSidebarCollapsed.ts       — collapse preference persistence
components/ui/tooltip.tsx          — Radix tooltip wrapper
components/learning/navigation-guard-context.tsx
components/learning/unsaved-session-dialog.tsx
components/learning/learning-sidebar.tsx
components/learning/session-history-list.tsx
components/learning/explainer-workspace.tsx
components/learning/quiz-workspace.tsx
components/navigation/app-chrome.tsx
app/learning/layout.tsx
app/learning/explainer/[sessionId]/page.tsx
app/learning/quiz/[sessionId]/page.tsx
```

## Files I'm about to modify

```
app/layout.tsx                     — use AppChrome instead of inlining <main>+<AppDock>
app/learning/explainer/page.tsx    — becomes a redirect-to-new-session page
app/learning/quiz/page.tsx         — becomes a redirect-to-new-session page
components/navigation/app-dock.tsx — "AI" link → /learning/explainer
lib/ai/prompts.ts                  — add a strict, parseable quiz output format
```

Everything is reversible and confined to the client. I'll build it now.

**Tool Call: lib\\sessions\\types.ts**
Status: Failed

Can't create file: parent directory doesn't exist

## Assistant

<thinking>
I need to create the directory first before proceeding.
</thinking>

**Tool Call: Create directory \`Smartli V2\\lib\\sessions\`**
Status: Completed

Created directory Smartli V2\lib\sessions

**Tool Call: Create directory \`Smartli V2\\components\\learning\`**
Status: Completed

Created directory Smartli V2\components\learning

**Tool Call: Create directory \`Smartli V2\\app\\learning\\explainer\\\[sessionId]\`**
Status: Completed

Created directory Smartli V2\app\learning\explainer\[sessionId]

**Tool Call: Create directory \`Smartli V2\\app\\learning\\quiz\\\[sessionId]\`**
Status: Completed

Created directory Smartli V2\app\learning\quiz\[sessionId]

## Assistant

Now let me write all the core library files.

**Tool Call: lib\\sessions\\types.ts**
Status: Completed

Diff: lib\sessions\types.ts
```
import type { AIExplainerMode, QuizType } from '@/types';

export type SessionType = 'explainer' | 'quiz';

export type SessionStatus = 'draft' | 'active' | 'completed' | 'error';

/**
 * Lightweight record shown in the sidebar. Kept intentionally small so the
 * whole history list can be loaded and re-rendered cheaply.
 */
export interface SessionSummary {
  id: string;
  type: SessionType;
  title: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
  /** 0-100, quiz sessions only */
  progress?: number;
}

export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'complete' | 'interrupted' | 'error';

export interface SessionMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status: MessageStatus;
}

export interface ExplainerSessionDetail {
  id: string;
  type: 'explainer';
  mode: AIExplainerMode;
  messages: SessionMessage[];
}

export interface QuizQuestionState {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSessionDetail {
  id: string;
  type: 'quiz';
  quizType: QuizType;
  /** The notes/content the user provided to generate the quiz. */
  sourceText: string;
  /** The raw model output, kept for debugging / re-parsing. */
  rawResponse: string;
  questions: QuizQuestionState[];
  /** questionId -> the answer the user selected or typed */
  answers: Record<string, string>;
  currentQuestionIndex: number;
  submitted: boolean;
  score?: number;
}

export type SessionDetail = ExplainerSessionDetail | QuizSessionDetail;

```


**Tool Call: lib\\sessions\\id.ts**
Status: Completed

Diff: lib\sessions\id.ts
```
/**
 * Generates a client-side unique ID for sessions and messages.
 * Falls back gracefully if `crypto.randomUUID` isn't available.
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

```


**Tool Call: lib\\sessions\\storage.ts**
Status: Completed

Diff: lib\sessions\storage.ts
```
import type { SessionDetail, SessionSummary, SessionType } from './types';

const INDEX_KEY = 'smartli_sessions_index';
const DETAIL_KEY_PREFIX = 'smartli_session_detail_';
const CHANGE_EVENT = 'smartli:sessions-changed';

function isBrowser() {
  return typeof window !== 'undefined';
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function notifyChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

/**
 * Subscribes to session changes made anywhere in the app (same tab via a
 * custom event, other tabs via the native `storage` event).
 */
export function subscribeToSessionChanges(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function getSessionIndex(): SessionSummary[] {
  if (!isBrowser()) return [];
  const list = safeParse<SessionSummary[]>(localStorage.getItem(INDEX_KEY), []);
  return [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getSessionSummary(id: string): SessionSummary | undefined {
  return getSessionIndex().find((session) => session.id === id);
}

export function getSessionsByType(type: SessionType): SessionSummary[] {
  return getSessionIndex().filter((session) => session.type === type);
}

function saveSessionIndex(list: SessionSummary[]) {
  if (!isBrowser()) return;
  localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  notifyChange();
}

export function upsertSessionSummary(summary: SessionSummary) {
  const list = getSessionIndex();
  const index = list.findIndex((session) => session.id === summary.id);
  if (index >= 0) {
    list[index] = summary;
  } else {
    list.push(summary);
  }
  saveSessionIndex(list);
}

export function removeSession(id: string) {
  const list = getSessionIndex().filter((session) => session.id !== id);
  saveSessionIndex(list);
  if (isBrowser()) {
    localStorage.removeItem(`${DETAIL_KEY_PREFIX}${id}`);
  }
  notifyChange();
}

export function getSessionDetail<T extends SessionDetail>(id: string): T | null {
  if (!isBrowser()) return null;
  return safeParse<T | null>(localStorage.getItem(`${DETAIL_KEY_PREFIX}${id}`), null);
}

export function saveSessionDetail(id: string, detail: SessionDetail) {
  if (!isBrowser()) return;
  localStorage.setItem(`${DETAIL_KEY_PREFIX}${id}`, JSON.stringify(detail));
  notifyChange();
}

```


## Assistant

<thinking>
I need to design the quiz output format now, then build a parser that reliably extracts questions, options, answers, and explanations from it, along with a looser fallback parser for messier responses. I'm drafting the instruction text that tells the model to structure each question with a numbered prompt, lettered options, an answer line, and an explanation line.

For robustness, the parser should split the response on question markers, pull out each piece per block, and fall back gracefully—first trying a plain numbered list format, and if that fails too, just wrapping the whole raw response as a single unlabeled question rather than crashing. Now I'm writing the regex patterns to split blocks by question markers.

Continuing the parsing loop...

Otherwise I collect remaining lines into question text, then only push a question if there's an answer or options, resolving the answer against options—mapping single letters to their corresponding option text when applicable.

For robustness I'm also adding a loose fallback that splits on numbered list markers or paragraphs when structured parsing fails, treating each chunk as a bare question with empty answer/explanation so the app can still render something rather than error out.

I also need to update prompts.ts to request this exact format for quiz mode. I noticed the gateway currently doesn't pass quizType through to constructPrompt, which is a real bug -- without it, QUIZ_PROMPTS can't actually select based on the chosen quizType, meaning the MCQ vs Exam vs Competency vs Reasoning toggle in the UI does nothing right now. Worth fixing that too since it directly affects functionality.

I'm redesigning constructPrompt to take an optional quizType parameter, using QUIZ_PROMPTS[quizType] plus a strict format instruction when mode is 'quiz', and updating gateway.ts to pass request.quizType through. This is a frontend/shared-lib concern rather than a backend change, and it's necessary to make the Quiz type selector actually work with parseable output, so I'll proceed with it.
</thinking>

**Tool Call: lib\\ai\\quiz\-parser.ts**
Status: Completed

Diff: lib\ai\quiz-parser.ts
```
import { generateSessionId } from '@/lib/sessions/id';
import type { QuizQuestionState } from '@/lib/sessions/types';

/**
 * Parses the raw AI response produced by the "quiz" prompt format (see
 * `lib/ai/prompts.ts`) into structured, interactive questions.
 *
 * The model is asked to follow a strict `Q1:` / `A)` / `ANSWER:` /
 * `EXPLANATION:` format. If the model doesn't comply (older cached
 * responses, unexpected output, etc.) we fall back to a looser
 * numbered-list parse so the user still gets something usable instead of a
 * blank screen.
 */

const QUESTION_SPLIT = /\n(?=\s*Q\d+\s*:)/i;
const QUESTION_HEADER = /^\s*Q\d+\s*:\s*/i;
const OPTION_LINE = /^\s*([A-D])[).]\s*(.+)$/i;
const ANSWER_LINE = /^\s*ANSWER\s*:\s*(.+)$/i;
const EXPLANATION_LINE = /^\s*EXPLANATION\s*:\s*(.+)$/i;
const NUMBERED_SPLIT = /\n(?=\s*\d+[.)]\s)/;

export function parseQuizResponse(raw: string): QuizQuestionState[] {
  const text = raw.trim();
  if (!text) return [];

  const strict = parseStrictFormat(text);
  if (strict.length > 0) return strict;

  return parseLooseFormat(text);
}

function parseStrictFormat(text: string): QuizQuestionState[] {
  const blocks = text.split(QUESTION_SPLIT).filter((block) => QUESTION_HEADER.test(block.trim()));
  const questions: QuizQuestionState[] = [];

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const questionLines = [lines[0].replace(QUESTION_HEADER, '').trim()];
    const options: string[] = [];
    const explanationLines: string[] = [];
    let answer = '';
    let mode: 'question' | 'explanation' = 'question';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const optionMatch = line.match(OPTION_LINE);
      const answerMatch = line.match(ANSWER_LINE);
      const explanationMatch = line.match(EXPLANATION_LINE);

      if (optionMatch) {
        options.push(optionMatch[2].trim());
        mode = 'question';
        continue;
      }
      if (answerMatch) {
        answer = answerMatch[1].trim();
        mode = 'question';
        continue;
      }
      if (explanationMatch) {
        explanationLines.push(explanationMatch[1].trim());
        mode = 'explanation';
        continue;
      }
      if (!line.trim()) continue;
      if (mode === 'explanation') {
        explanationLines.push(line.trim());
      } else {
        questionLines.push(line.trim());
      }
    }

    if (!answer && options.length === 0) continue;

    questions.push({
      id: generateSessionId(),
      question: questionLines.join(' ').trim(),
      options: options.length > 0 ? options : undefined,
      correctAnswer: resolveAnswer(answer, options),
      explanation: explanationLines.join(' ').trim(),
    });
  }

  return questions;
}

function resolveAnswer(answer: string, options: string[]): string {
  const letterMatch = answer.match(/^([A-D])\b/i);
  if (letterMatch && options.length > 0) {
    const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (options[index]) return options[index];
  }
  return answer;
}

/**
 * Best-effort fallback for responses that don't follow the strict format.
 * Produces open-ended questions with no known correct answer rather than
 * failing outright.
 */
function parseLooseFormat(text: string): QuizQuestionState[] {
  const chunks = text
    .split(NUMBERED_SPLIT)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length <= 1) {
    return [
      {
        id: generateSessionId(),
        question: text,
        correctAnswer: '',
        explanation: '',
      },
    ];
  }

  return chunks.map((chunk) => ({
    id: generateSessionId(),
    question: chunk.replace(/^\s*\d+[.)]\s*/, '').trim(),
    correctAnswer: '',
    explanation: '',
  }));
}

```


**Tool Call: Read file `lib\ai\gateway.ts`**
Status: Completed

```Smartli V2\lib\ai\gateway.ts
     1	import { AI_CONFIG } from './config';
     2	import { constructPrompt } from './prompts';
     3	import { AIRequest } from './config';
     4	
     5	export async function streamAIResponse(request: AIRequest) {
     6	  const { prompt, context, mode } = request;
     7	
     8	  const fullPrompt = constructPrompt(mode || 'explainer', prompt, context);
     9	
    10	  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    11	    method: 'POST',
    12	    headers: {
    13	      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    14	      'Content-Type': 'application/json',
    15	    },
    16	    body: JSON.stringify({
    17	      model: request.model || AI_CONFIG.PRIMARY_MODEL,
    18	      messages: [{ role: 'user', content: fullPrompt }],
    19	      stream: true,
    20	    }),
    21	  });
    22	
    23	  if (!response.ok) {
    24	    throw new Error(`OpenRouter API error: ${response.statusText}`);
    25	  }
    26	
    27	  return response.body;
    28	}

```


## Assistant

<thinking>
This confirms gateway.ts doesn't pass quizType, so I need to update both prompts.ts and gateway.ts to fix this and add a strict format instruction for quiz mode.
</thinking>

**Tool Call: lib\\ai\\prompts.ts**
Status: Completed

Diff: lib\ai\prompts.ts
```
export const SYSTEM_PROMPTS = {
  base: 'You are an expert AI study companion. Your goal is to help students learn through a structured pedagogical approach: Recall -> Application -> Analysis.',
  explainer: 'Break down the concepts deeply but clearly. Use analogies where helpful and ensure the transition between concepts is logical.',
  tutor: 'Act as an interactive tutor. Do not simply give answers; instead, ask probing questions to guide the user toward the answer, checking for understanding at each step.',
  eli5: 'Explain the concept as if the user is 5 years old. Use extremely simple language, relatable analogies, and avoid technical jargon unless you explain it simply first.',
};

export const QUIZ_PROMPTS = {
  mcq: 'Generate a multiple-choice quiz. For each question: Provide 4 options, clearly mark the correct one, and provide a detailed explanation of why the correct answer is right and why the others are wrong.',
  exam: 'Generate exam-style questions. Include a mix of short-answer (comprehension) and long-form (analysis) questions. Provide a model answer and a rubric for grading.',
  competency: 'Generate scenario-driven questions that test practical application of the concepts. Describe a real-world situation and ask the user to solve it using the principles provided in the context.',
  reasoning: 'Generate "why" and "how" questions that require deep reasoning and justification. The goal is to test if the user understands the underlying logic, not just the facts.',
};

/**
 * Strict, machine-parsable format for quiz generation. The client parses
 * this exact shape (see `lib/ai/quiz-parser.ts`) to render an interactive,
 * question-by-question quiz instead of a wall of raw text.
 */
const QUIZ_FORMAT_INSTRUCTION = `
  Output ONLY the questions using exactly this structure, with nothing else
  before or after (no preamble, no closing remarks):

  Q1: <question text>
  A) <option 1>
  B) <option 2>
  C) <option 3>
  D) <option 4>
  ANSWER: <the letter of the correct option, e.g. B>
  EXPLANATION: <why the correct answer is right, and briefly why the others are wrong>

  Q2: <question text>
  ...

  If the question type does not have multiple-choice options (short-answer,
  scenario-based, or reasoning questions), omit the A)-D) lines and instead
  write:

  Q1: <question text>
  ANSWER: <model answer>
  EXPLANATION: <reasoning or grading rubric>

  Generate between 5 and 8 questions.
`;

export function constructPrompt(
  mode: string,
  request: string,
  context: string = '',
  quizType?: string
) {
  if (mode === 'quiz') {
    const quizInstruction =
      QUIZ_PROMPTS[quizType as keyof typeof QUIZ_PROMPTS] || QUIZ_PROMPTS.mcq;

    return `
      System: ${SYSTEM_PROMPTS.base}
      Quiz style: ${quizInstruction}
      Context: ${context || 'No additional context provided.'}
      User Request: ${request}

      Format instruction: ${QUIZ_FORMAT_INSTRUCTION}
    `;
  }

  const system = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.base;

  return `
    System: ${SYSTEM_PROMPTS.base} ${system}
    Context: ${context || 'No additional context provided.'}
    User Request: ${request}

    Instruction: Please ensure your output is pedagogically sound and follows the Recall -> Application -> Analysis progression.
  `;
}

```


**Tool Call: edit_file**
Status: Failed

Error parsing input JSON: expected `:` at line 1 column 66

**Tool Call: lib\\ai\\gateway.ts**
Status: Completed

Diff: lib\ai\gateway.ts
```
import { AI_CONFIG } from './config';
import { constructPrompt } from './prompts';
import { AIRequest } from './config';

export async function streamAIResponse(request: AIRequest) {
  const { prompt, context, mode, quizType } = request;

  const fullPrompt = constructPrompt(mode || 'explainer', prompt, context, quizType);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || AI_CONFIG.PRIMARY_MODEL,
      messages: [{ role: 'user', content: fullPrompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  return response.body;
}

```


## Assistant

<thinking>
I confirm the AIRequest type already includes quizType. I notice the cache key only uses prompt and mode, not quizType, which could theoretically cause wrong cache hits, but since that's a pre-existing issue outside my scope, I'll leave cache.ts untouched to avoid scope creep.

Now I'll move on to writing the useLearningSessions.tsx and useSidebarCollapsed.ts hooks.
</thinking>

Now the session-list context and sidebar-collapse hook:

**Tool Call: hooks\\useLearningSessions.tsx**
Status: Completed

Diff: hooks\useLearningSessions.tsx
```
'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSessionIndex, removeSession, subscribeToSessionChanges } from '@/lib/sessions/storage';
import type { SessionSummary } from '@/lib/sessions/types';

interface LearningSessionsContextValue {
  sessions: SessionSummary[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  deleteSession: (id: string) => void;
}

const LearningSessionsContext = createContext<LearningSessionsContextValue | null>(null);

export function LearningSessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      setSessions(getSessionIndex());
      setError(null);
    } catch {
      setError("Couldn't load your sessions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return subscribeToSessionChanges(refresh);
  }, [refresh]);

  const deleteSession = useCallback(
    (id: string) => {
      removeSession(id);
      refresh();
    },
    [refresh]
  );

  return (
    <LearningSessionsContext.Provider value={{ sessions, isLoading, error, refresh, deleteSession }}>
      {children}
    </LearningSessionsContext.Provider>
  );
}

export function useLearningSessions() {
  const ctx = useContext(LearningSessionsContext);
  if (!ctx) {
    throw new Error('useLearningSessions must be used within a LearningSessionsProvider');
  }
  return ctx;
}

```


**Tool Call: hooks\\useSidebarCollapsed.ts**
Status: Completed

Diff: hooks\useSidebarCollapsed.ts
```
'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'smartli_sidebar_collapsed';

/**
 * Persists the desktop sidebar collapse preference across sessions.
 * Defaults to expanded until we know better (avoids a layout flash on the
 * very first paint before localStorage has been read).
 */
export function useSidebarCollapsed(): [boolean, (value: boolean) => void] {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsedState(stored === 'true');
  }, []);

  const setCollapsed = (value: boolean) => {
    setCollapsedState(value);
    window.localStorage.setItem(STORAGE_KEY, String(value));
  };

  return [collapsed, setCollapsed];
}

```


## Assistant

Now the tooltip primitive and the navigation-guard context + unsaved-session dialog:

**Tool Call: components\\ui\\tooltip.tsx**
Status: Completed

Diff: components\ui\tooltip.tsx
```
'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md border border-border/60 bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

```


**Tool Call: components\\learning\\unsaved\-session\-dialog.tsx**
Status: Completed

Diff: components\learning\unsaved-session-dialog.tsx
```
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UnsavedSessionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirms navigation away from a session that has unsaved progress
 * (an active generation, unsent input, or an in-progress quiz).
 */
export function UnsavedSessionDialog({ open, onCancel, onConfirm }: UnsavedSessionDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed left-1/2 top-1/2 z-[101] w-[min(90vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-popover p-6 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="space-y-1">
                    <Dialog.Title className="text-base font-semibold text-foreground">
                      Leave this session?
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-muted-foreground">
                      You have unsaved progress here. If you leave now, anything not yet saved will
                      be lost.
                    </Dialog.Description>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" onClick={onConfirm}>
                    Leave anyway
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

```


**Tool Call: components\\learning\\navigation\-guard\-context.tsx**
Status: Completed

Diff: components\learning\navigation-guard-context.tsx
```
'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnsavedSessionDialog } from '@/components/learning/unsaved-session-dialog';

interface NavigationGuardContextValue {
  /** Navigate to `href`, prompting for confirmation first if dirty. */
  guardedNavigate: (href: string) => void;
  /** Called by the active workspace whenever it has unsaved progress. */
  setDirty: (dirty: boolean) => void;
  /** Called by the active workspace to register a cleanup (e.g. abort a stream) that runs if the user confirms leaving. */
  setBeforeLeave: (fn: (() => void) | null) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

export function useNavigationGuard() {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx) {
    throw new Error('useNavigationGuard must be used within a NavigationGuardProvider');
  }
  return ctx;
}

export function NavigationGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isDirtyRef = useRef(false);
  const beforeLeaveRef = useRef<(() => void) | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty;
  }, []);

  const setBeforeLeave = useCallback((fn: (() => void) | null) => {
    beforeLeaveRef.current = fn;
  }, []);

  const guardedNavigate = useCallback(
    (href: string) => {
      if (isDirtyRef.current) {
        setPendingHref(href);
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const confirmLeave = useCallback(() => {
    beforeLeaveRef.current?.();
    isDirtyRef.current = false;
    setPendingHref((href) => {
      if (href) router.push(href);
      return null;
    });
  }, [router]);

  const cancelLeave = useCallback(() => setPendingHref(null), []);

  // Warn on tab close / hard refresh while there is unsaved progress.
  useEffect(() => {
    function handler(event: BeforeUnloadEvent) {
      if (isDirtyRef.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ guardedNavigate, setDirty, setBeforeLeave }}>
      {children}
      <UnsavedSessionDialog open={pendingHref !== null} onCancel={cancelLeave} onConfirm={confirmLeave} />
    </NavigationGuardContext.Provider>
  );
}

```


## Assistant

Now the sidebar itself and its history-list sub-component:

**Tool Call: components\\learning\\session\-history\-list.tsx**
Status: Completed

Diff: components\learning\session-history-list.tsx
```
'use client';

import React from 'react';
import { AlertCircle, GraduationCap, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSummary } from '@/lib/sessions/types';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SessionHistoryListProps {
  collapsed: boolean;
  sessions: SessionSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  activePathname: string;
  onSelect: (href: string) => void;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function SessionHistoryList({
  collapsed,
  sessions,
  isLoading,
  error,
  onRetry,
  activePathname,
  onSelect,
}: SessionHistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 px-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />
            {!collapsed && (
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
                <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-muted/70" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-center'
        )}
      >
        <AlertCircle size={18} className="text-destructive" />
        {!collapsed && <p className="text-xs text-destructive">{error}</p>}
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (sessions.length === 0) {
    if (collapsed) return null;
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-4 text-center">
        <p className="text-xs font-medium text-foreground">No sessions yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Start an Explainer or create a Quiz to build your learning history.
        </p>
      </div>
    );
  }

  const explainers = sessions.filter((session) => session.type === 'explainer');
  const quizzes = sessions.filter((session) => session.type === 'quiz');

  return (
    <div className="space-y-5">
      {explainers.length > 0 && (
        <SessionSection
          label="Explainers"
          icon={<GraduationCap size={13} />}
          items={explainers}
          collapsed={collapsed}
          activePathname={activePathname}
          onSelect={onSelect}
        />
      )}
      {quizzes.length > 0 && (
        <SessionSection
          label="Quizzes"
          icon={<ListChecks size={13} />}
          items={quizzes}
          collapsed={collapsed}
          activePathname={activePathname}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

function SessionSection({
  label,
  icon,
  items,
  collapsed,
  activePathname,
  onSelect,
}: {
  label: string;
  icon: React.ReactNode;
  items: SessionSummary[];
  collapsed: boolean;
  activePathname: string;
  onSelect: (href: string) => void;
}) {
  return (
    <div>
      {!collapsed && (
        <div className="mb-1 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {icon}
          {label}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((session) => {
          const href = `/learning/${session.type}/${session.id}`;
          const isActive = activePathname === href;
          const rowIcon =
            session.type === 'explainer' ? <GraduationCap size={14} /> : <ListChecks size={14} />;

          const row = (
            <button
              type="button"
              onClick={() => onSelect(href)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  isActive
                    ? session.type === 'explainer'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {rowIcon}
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{session.title}</span>
                  {session.status === 'draft' && (
                    <span className="text-[10px] text-muted-foreground/70">Draft</span>
                  )}
                </span>
              )}
              {!collapsed && (
                <span className="shrink-0 text-[10px] text-muted-foreground/70">
                  {relativeTime(session.updatedAt)}
                </span>
              )}
            </button>
          );

          if (collapsed) {
            return (
              <li key={session.id}>
                <Tooltip>
                  <TooltipTrigger asChild>{row}</TooltipTrigger>
                  <TooltipContent side="right">{session.title}</TooltipContent>
                </Tooltip>
              </li>
            );
          }

          return <li key={session.id}>{row}</li>;
        })}
      </ul>
    </div>
  );
}

```


**Tool Call: components\\learning\\learning\-sidebar.tsx**
Status: Completed

Diff: components\learning\learning-sidebar.tsx
```
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ListChecks, Menu, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLearningSessions } from '@/hooks/useLearningSessions';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';
import { useNavigationGuard } from '@/components/learning/navigation-guard-context';
import { generateSessionId } from '@/lib/sessions/id';
import { SessionHistoryList } from '@/components/learning/session-history-list';
import type { SessionSummary } from '@/lib/sessions/types';

const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 1 } as const;

export function LearningSidebar() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname() ?? '';
  const { sessions, isLoading, error, refresh } = useLearningSessions();
  const { guardedNavigate } = useNavigationGuard();

  function handleNew(type: 'explainer' | 'quiz') {
    const id = generateSessionId();
    setMobileOpen(false);
    guardedNavigate(`/learning/${type}/${id}`);
  }

  function handleSelect(href: string) {
    setMobileOpen(false);
    guardedNavigate(href);
  }

  return (
    <TooltipProvider delayDuration={400}>
      {/* Desktop rail */}
      <motion.aside
        aria-label="Learning sessions"
        animate={{ width: collapsed ? 72 : 280 }}
        transition={shouldReduceMotion ? { duration: 0.12 } : SPRING}
        className="hidden md:sticky md:top-0 md:flex md:h-dvh md:shrink-0 md:flex-col md:overflow-hidden md:border-r md:border-border/40 md:bg-zinc-950/60 md:backdrop-blur-xl"
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          pathname={pathname}
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onRetry={refresh}
          onNew={handleNew}
          onSelect={handleSelect}
        />
      </motion.aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <span className="text-sm font-semibold text-foreground">Smartli Workspace</span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setMobileOpen(true)}
          aria-label="Open session history"
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* Mobile drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <AnimatePresence>
          {mobileOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-[90] bg-black/60 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed inset-y-0 left-0 z-[91] flex h-dvh w-[min(86vw,320px)] flex-col border-r border-border/60 bg-zinc-950 shadow-2xl md:hidden"
                  style={{
                    paddingTop: 'env(safe-area-inset-top)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={
                    shouldReduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 38 }
                  }
                >
                  <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                    <Dialog.Title className="text-sm font-semibold text-foreground">Sessions</Dialog.Title>
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Close">
                        <X size={16} />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <SidebarContent
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    pathname={pathname}
                    sessions={sessions}
                    isLoading={isLoading}
                    error={error}
                    onRetry={refresh}
                    onNew={handleNew}
                    onSelect={handleSelect}
                    hideCollapseControl
                  />
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </TooltipProvider>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  pathname: string;
  sessions: SessionSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onNew: (type: 'explainer' | 'quiz') => void;
  onSelect: (href: string) => void;
  hideCollapseControl?: boolean;
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  pathname,
  sessions,
  isLoading,
  error,
  onRetry,
  onNew,
  onSelect,
  hideCollapseControl,
}: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn('flex items-center gap-2 px-3 pt-4', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && <span className="truncate text-sm font-semibold text-foreground">Smartli Workspace</span>}
        {!hideCollapseControl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className={cn('flex flex-col gap-2 px-3 pt-4', collapsed && 'items-center')}>
        <NewSessionButton
          collapsed={collapsed}
          icon={<Sparkles size={18} />}
          label="New Explainer"
          onClick={() => onNew('explainer')}
          tone="primary"
        />
        <NewSessionButton
          collapsed={collapsed}
          icon={<ListChecks size={18} />}
          label="New Quiz"
          onClick={() => onNew('quiz')}
          tone="emerald"
        />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-2 pb-4">
        {!collapsed && (
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Previous sessions
          </p>
        )}
        <SessionHistoryList
          collapsed={collapsed}
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          activePathname={pathname}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

function NewSessionButton({
  collapsed,
  icon,
  label,
  onClick,
  tone,
}: {
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone: 'primary' | 'emerald';
}) {
  const button = (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'flex items-center gap-2 rounded-full text-sm font-semibold shadow-sm transition-colors',
        collapsed ? 'h-11 w-11 justify-center' : 'w-full px-4 py-2.5',
        tone === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </motion.button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

```


## Assistant

<thinking>
Next I'll update app-chrome.tsx and the learning layout, adjust app/layout.tsx, and update the AI link in app-dock.tsx.
</thinking>

Now the app chrome wrapper (to hide the bottom dock on `/learning/*`) and the learning layout:

**Tool Call: components\\navigation\\app\-chrome.tsx**
Status: Completed

Diff: components\navigation\app-chrome.tsx
```
'use client';

import { usePathname } from 'next/navigation';
import { AppDock } from '@/components/navigation/app-dock';
import { cn } from '@/lib/utils';

/**
 * The learning workspace (`/learning/*`) has its own sidebar navigation, so
 * the global bottom dock and its reserved padding are hidden there to avoid
 * two competing navigation systems.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isLearningRoute = pathname.startsWith('/learning');

  return (
    <>
      <main className={cn(!isLearningRoute && 'pb-28')}>{children}</main>
      {!isLearningRoute && <AppDock />}
    </>
  );
}

```


**Tool Call: app\\learning\\layout.tsx**
Status: Completed

Diff: app\learning\layout.tsx
```
import { LearningSessionsProvider } from '@/hooks/useLearningSessions';
import { NavigationGuardProvider } from '@/components/learning/navigation-guard-context';
import { LearningSidebar } from '@/components/learning/learning-sidebar';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearningSessionsProvider>
      <NavigationGuardProvider>
        <div className="flex min-h-dvh w-full flex-col md:flex-row">
          <LearningSidebar />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </div>
      </NavigationGuardProvider>
    </LearningSessionsProvider>
  );
}

```


**Tool Call: app\\layout.tsx**
Status: Completed

Diff: app\layout.tsx
```
import './globals.css';
import { Metadata } from 'next';
import { AppChrome } from '@/components/navigation/app-chrome';

export const metadata: Metadata = {
  title: 'Smartli | AI Study Companion',
  description: 'Elevate your learning with AI-powered study tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen relative">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}


```


**Tool Call: components\\navigation\\app\-dock.tsx**
Status: Completed

Diff: components\navigation\app-dock.tsx
```
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Home,
  Sparkles,
  Timer,
  ListChecks,
  TrendingUp,
  CalendarDays,
  Settings,
  UserCircle,
  type LucideIcon,
} from 'lucide-react';
import { Dock, DockIcon, DockDivider } from '@/components/ui/dock';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const homeGroup: NavItem[] = [{ href: '/', label: 'Home', icon: Home }];

const workspaceGroup: NavItem[] = [
  { href: '/learning/explainer', label: 'AI', icon: Sparkles },
  { href: '/focus', label: 'Focus Hub', icon: Timer },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
];

const systemGroup: NavItem[] = [
  { href: '/plan', label: 'Plan', icon: CalendarDays },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/account', label: 'Account', icon: UserCircle },
];

function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Spring config for the press-down / release animation.
// ζ ≈ 0.75 → slightly underdamped so the release has a small physical pop.
const PRESS_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const;

function AppDockIcon({ href, label, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleNavigate = (e: React.MouseEvent) => {
    // Standard Next.js Link behavior is on release (click).
    // Fluid interfaces respond on press-down or immediately on click.
    // We'll use useTransition to prioritize the UI feedback (active state) 
    // over the heavy page-loading transition.
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <DockIcon
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/*
       * Press animation wrapper — scales only the icon + active pill, NOT the tooltip.
       * Reduced motion: swap transform for a gentler opacity dip.
       */}
      <motion.div
        onPointerDown={handleNavigate}
        whileTap={
          shouldReduceMotion
            ? { opacity: 0.7 }
            : { scale: 0.9 }
        }
        transition={PRESS_SPRING}
        className={cn(
          "relative flex h-full w-full items-center justify-center cursor-pointer",
          isPending && "opacity-70"
        )}
      >
        {(isActive || isPending) && (
          <motion.div
            layoutId="dock-active-highlight"
            className="absolute inset-0 rounded-full bg-foreground/10"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          />
        )}

        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-150',
            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </motion.div>

      {/* Tooltip — sibling of the press wrapper, so it is unaffected by whileTap */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.85, y: 4 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: 2,
                    transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', duration: 0.32, bounce: 0.22 }
            }
            style={{ left: '50%', x: '-50%', transformOrigin: 'bottom center' }}
            className="pointer-events-none absolute bottom-[60px] z-20 whitespace-nowrap rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg backdrop-blur-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </DockIcon>
  );
}

export function AppDock() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/*
       * direction="bottom" → icons are bottom-aligned inside the auto-height dock.
       * When a nearby icon magnifies (40→72px) it grows UPWARD, expanding that
       * section of the dock visually while the dock's bottom edge stays anchored.
       */}
      <Dock
        direction="bottom"
        disableMagnification={Boolean(shouldReduceMotion)}
      >
        {homeGroup.map((item) => (
          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
        ))}

        <DockDivider />

        {workspaceGroup.map((item) => (
          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
        ))}

        <DockDivider />

        {systemGroup.map((item) => (
          <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
        ))}
      </Dock>
    </nav>
  );
}

```


## Assistant

<thinking>
I'm checking the isPathActive logic in app-dock.tsx and realizing that while quiz session pages ideally should also highlight the AI icon, it doesn't actually matter since AppDock is hidden entirely on /learning/* routes via AppChrome anyway.

Now let's move on to building the ExplainerWorkspace component.
</thinking>

Now the Explainer workspace component:

**Tool Call: components\\learning\\explainer\-workspace.tsx**
Status: Completed

Diff: components\learning\explainer-workspace.tsx
```
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';
import { StreamingResponse } from '@/components/ai/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { GraduationCap, Loader2, Pause, Send, Sparkles } from 'lucide-react';
import type { AIExplainerMode } from '@/types';
import type { ExplainerSessionDetail, SessionMessage } from '@/lib/sessions/types';
import { generateSessionId } from '@/lib/sessions/id';
import { getSessionDetail, getSessionSummary, saveSessionDetail, upsertSessionSummary } from '@/lib/sessions/storage';
import { useNavigationGuard } from '@/components/learning/navigation-guard-context';

const MODES: AIExplainerMode[] = ['explainer', 'tutor', 'eli5'];

function createEmptyDetail(id: string): ExplainerSessionDetail {
  return { id, type: 'explainer', mode: 'explainer', messages: [] };
}

function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= 48) return clean;
  return `${clean.slice(0, 45)}…`;
}

export function ExplainerWorkspace({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<ExplainerSessionDetail | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [input, setInput] = useState('');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
  const { setDirty, setBeforeLeave } = useNavigationGuard();
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<ExplainerSessionDetail | null>(null);

  // Load (or initialize) the session whenever the sessionId in the URL changes.
  useEffect(() => {
    setIsLoadingSession(true);
    const existing = getSessionDetail<ExplainerSessionDetail>(sessionId);
    const next = existing ?? createEmptyDetail(sessionId);
    setDetail(next);
    detailRef.current = next;
    setInput('');
    setIsLoadingSession(false);
  }, [sessionId]);

  useEffect(() => {
    detailRef.current = detail;
  }, [detail]);

  // Register this workspace's dirty state / cleanup with the shared navigation guard.
  useEffect(() => {
    setDirty(isLoading || input.trim().length > 0);
  }, [isLoading, input, setDirty]);

  useEffect(() => {
    setBeforeLeave(() => stopStream());
    return () => setBeforeLeave(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Persist the assistant turn once the stream finishes.
  useEffect(() => {
    if (!isComplete || !streamText) return;
    const current = detailRef.current;
    if (!current) return;

    const assistantMessage: SessionMessage = {
      id: generateSessionId(),
      role: 'assistant',
      content: streamText,
      createdAt: new Date().toISOString(),
      status: 'complete',
    };

    persist({ ...current, messages: [...current.messages, assistantMessage] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [detail?.messages.length, streamText]);

  function persist(nextDetail: ExplainerSessionDetail) {
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);

    const firstUserMessage = nextDetail.messages.find((message) => message.role === 'user');
    const lastMessage = nextDetail.messages[nextDetail.messages.length - 1];
    const existingSummary = getSessionSummary(sessionId);
    const now = new Date().toISOString();

    upsertSessionSummary({
      id: sessionId,
      type: 'explainer',
      title: firstUserMessage ? deriveTitle(firstUserMessage.content) : 'New Explainer',
      status: 'active',
      createdAt: existingSummary?.createdAt ?? now,
      updatedAt: now,
      lastMessagePreview: lastMessage ? deriveTitle(lastMessage.content) : undefined,
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || isLoading || !detail) return;

    const userMessage: SessionMessage = {
      id: generateSessionId(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
      status: 'complete',
    };

    persist({ ...detail, messages: [...detail.messages, userMessage] });
    setInput('');

    await startStream({ prompt: userMessage.content, mode: detail.mode });
  }

  function handleModeChange(mode: AIExplainerMode) {
    if (!detail) return;
    const nextDetail = { ...detail, mode };
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);
  }

  if (isLoadingSession || !detail) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  const hasMessages = detail.messages.length > 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <Sparkles className="text-primary" size={24} /> AI Explainer
          </h1>
          <p className="text-sm text-muted-foreground">Deep dive into any topic with pedagogical precision.</p>
        </div>

        <div className="flex gap-1.5 rounded-full bg-muted p-1">
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-200 sm:text-sm',
                detail.mode === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mode === 'eli5' ? 'ELI5' : mode}
            </button>
          ))}
        </div>
      </header>

      <main ref={scrollRef} className="mb-6 flex-1 space-y-5 overflow-y-auto pr-1">
        {!hasMessages && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center space-y-3 text-center opacity-60">
            <GraduationCap size={44} className="text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Ask me to explain a complex concept, or paste your notes to get a deep dive.
            </p>
          </div>
        )}

        {detail.messages.map((message) => (
          <Card
            key={message.id}
            className={cn(
              'animate-fade-in border-border/50 p-4 shadow-sm sm:p-5',
              message.role === 'user' ? 'ml-auto max-w-[85%] bg-primary/10' : 'max-w-[92%]'
            )}
          >
            <StreamingResponse text={message.content} />
          </Card>
        ))}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {isLoading && (
          <Card className="max-w-[92%] animate-fade-in border-border/50 p-4 shadow-sm sm:p-5">
            {streamText ? (
              <StreamingResponse text={streamText} />
            ) : (
              <Loader2 className="animate-spin text-muted-foreground" size={20} />
            )}
          </Card>
        )}
      </main>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            detail.mode === 'tutor'
              ? 'Ask a follow-up question...'
              : detail.mode === 'eli5'
                ? 'What should I explain simply?'
                : 'What do you want to learn today?'
          }
          className="h-14 rounded-2xl pr-16 focus:ring-primary"
        />
        <div className="absolute right-2 top-2">
          {isLoading ? (
            <Button
              variant="default"
              size="sm"
              type="button"
              className="h-10 w-10 rounded-full p-0"
              onClick={stopStream}
            >
              <Pause size={18} />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              type="submit"
              className="h-10 w-10 rounded-full p-0"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

```


## Assistant

<thinking>
Now I'm designing the QuizWorkspace component, which needs a setup phase for pasting source content and picking a quiz type, then an interactive phase for answering questions with navigation and scoring. I'm mapping out the state needed within QuizSessionDetail—source text, generated questions, answers, current index, submission status, and score—and planning the flow so it shows setup UI when no questions exist yet.

For generation, I'll stream the quiz creation and parse the response into structured questions once complete, then persist the session. Once questions exist and the quiz isn't submitted, I show the interactive quiz UI with radio or text inputs depending on question type, navigation buttons, and a submit action on the last question. On submit, I calculate the score by comparing trimmed, case-insensitive answers against correct answers, only scoring questions that have one, then persist the results and mark the session complete. Once submitted, I show a results view with per-question review and a retake option.

I'll also add a lightweight "start over" or "try another quiz" action for convenience, though it's not strictly required. Progress is calculated as the percentage of questions answered while in progress, and I'll treat the session as dirty if there's any answer progress, navigation past the first question, or an active generation in flight.

Now I'm setting up the persistence helper similarly to the explainer pattern, deriving a title from the source text with a fallback, and tracking status and progress. Then I move on to building the component, pulling in the needed types, UI primitives, and icons.
</thinking>

Now the Quiz workspace — this is the most involved piece since it needs to parse raw AI text into an interactive question flow:

**Tool Call: components\\learning\\quiz\-workspace.tsx**
Status: Completed

Diff: components\learning\quiz-workspace.tsx
```
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ListChecks,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { QuizType } from '@/types';
import type { QuizQuestionState, QuizSessionDetail } from '@/lib/sessions/types';
import { parseQuizResponse } from '@/lib/ai/quiz-parser';
import { getSessionDetail, getSessionSummary, saveSessionDetail, upsertSessionSummary } from '@/lib/sessions/storage';
import { useNavigationGuard } from '@/components/learning/navigation-guard-context';
import { generateSessionId } from '@/lib/sessions/id';

const QUIZ_TYPES: QuizType[] = ['mcq', 'exam', 'competency', 'reasoning'];

function createEmptyDetail(id: string): QuizSessionDetail {
  return {
    id,
    type: 'quiz',
    quizType: 'mcq',
    sourceText: '',
    rawResponse: '',
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    submitted: false,
  };
}

function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (!clean) return 'New Quiz';
  if (clean.length <= 48) return clean;
  return `${clean.slice(0, 45)}…`;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function QuizWorkspace({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<QuizSessionDetail | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sourceInput, setSourceInput] = useState('');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
  const { setDirty, setBeforeLeave } = useNavigationGuard();
  const detailRef = useRef<QuizSessionDetail | null>(null);

  useEffect(() => {
    setIsLoadingSession(true);
    const existing = getSessionDetail<QuizSessionDetail>(sessionId);
    const next = existing ?? createEmptyDetail(sessionId);
    setDetail(next);
    detailRef.current = next;
    setSourceInput(next.sourceText);
    setIsLoadingSession(false);
  }, [sessionId]);

  useEffect(() => {
    detailRef.current = detail;
  }, [detail]);

  const hasStartedQuiz = Boolean(detail && (detail.questions.length > 0 || Object.keys(detail.answers).length > 0));

  useEffect(() => {
    const dirty = isLoading || (hasStartedQuiz && !detail?.submitted);
    setDirty(dirty);
  }, [isLoading, hasStartedQuiz, detail?.submitted, setDirty]);

  useEffect(() => {
    setBeforeLeave(() => stopStream());
    return () => setBeforeLeave(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Turn the completed raw response into structured, answerable questions.
  useEffect(() => {
    if (!isComplete || !streamText) return;
    const current = detailRef.current;
    if (!current) return;

    const questions = parseQuizResponse(streamText);

    persist({
      ...current,
      rawResponse: streamText,
      questions,
      answers: {},
      currentQuestionIndex: 0,
      submitted: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  function persist(nextDetail: QuizSessionDetail) {
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);

    const existingSummary = getSessionSummary(sessionId);
    const now = new Date().toISOString();
    const totalQuestions = nextDetail.questions.length;
    const answeredCount = Object.keys(nextDetail.answers).length;
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    upsertSessionSummary({
      id: sessionId,
      type: 'quiz',
      title: deriveTitle(nextDetail.sourceText),
      status: nextDetail.submitted ? 'completed' : totalQuestions > 0 ? 'active' : 'draft',
      createdAt: existingSummary?.createdAt ?? now,
      updatedAt: now,
      lastMessagePreview:
        nextDetail.submitted && typeof nextDetail.score === 'number'
          ? `Scored ${nextDetail.score}/${totalQuestions}`
          : totalQuestions > 0
            ? `${answeredCount}/${totalQuestions} answered`
            : undefined,
      progress: nextDetail.submitted ? 100 : progress,
    });
  }

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    if (!sourceInput.trim() || isLoading || !detail) return;

    const nextDetail: QuizSessionDetail = { ...detail, sourceText: sourceInput.trim() };
    persist(nextDetail);

    await startStream({
      prompt:
        'Generate a quiz based on the following content. Follow a pedagogical progression from basic recall to higher-order analysis.',
      context: sourceInput.trim(),
      mode: 'quiz',
      quizType: detail.quizType,
    });
  }

  function handleQuizTypeChange(quizType: QuizType) {
    if (!detail) return;
    const nextDetail = { ...detail, quizType };
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);
  }

  function handleAnswer(questionId: string, answer: string) {
    if (!detail) return;
    persist({ ...detail, answers: { ...detail.answers, [questionId]: answer } });
  }

  function goToQuestion(index: number) {
    if (!detail) return;
    const clamped = Math.max(0, Math.min(index, detail.questions.length - 1));
    persist({ ...detail, currentQuestionIndex: clamped });
  }

  function handleSubmitQuiz() {
    if (!detail) return;
    const scorable = detail.questions.filter((question) => question.correctAnswer.trim().length > 0);
    const correctCount = scorable.filter(
      (question) => normalize(detail.answers[question.id] ?? '') === normalize(question.correctAnswer)
    ).length;

    persist({ ...detail, submitted: true, score: correctCount });
  }

  function handleStartOver() {
    if (!detail) return;
    persist(createEmptyDetail(sessionId));
    setSourceInput('');
  }

  if (isLoadingSession || !detail) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  if (detail.questions.length === 0) {
    return (
      <QuizSetup
        detail={detail}
        sourceInput={sourceInput}
        setSourceInput={setSourceInput}
        isLoading={isLoading}
        error={error}
        streamText={streamText}
        onQuizTypeChange={handleQuizTypeChange}
        onGenerate={handleGenerate}
        onStop={stopStream}
      />
    );
  }

  if (detail.submitted) {
    return <QuizResults detail={detail} onStartOver={handleStartOver} />;
  }

  return (
    <QuizRunner
      detail={detail}
      onAnswer={handleAnswer}
      onNavigate={goToQuestion}
      onSubmit={handleSubmitQuiz}
    />
  );
}

interface QuizSetupProps {
  detail: QuizSessionDetail;
  sourceInput: string;
  setSourceInput: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  streamText: string;
  onQuizTypeChange: (quizType: QuizType) => void;
  onGenerate: (event: React.FormEvent) => void;
  onStop: () => void;
}

function QuizSetup({
  detail,
  sourceInput,
  setSourceInput,
  isLoading,
  error,
  streamText,
  onQuizTypeChange,
  onGenerate,
  onStop,
}: QuizSetupProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col p-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
          <ListChecks className="text-primary" size={24} /> AI Quiz Generator
        </h1>
        <p className="text-sm text-muted-foreground">Transform your notes into high-fidelity assessments.</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-1.5 rounded-full bg-muted p-1 w-fit">
        {QUIZ_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onQuizTypeChange(type)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-200 sm:text-sm',
              detail.quizType === type
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <main className="mb-6 flex-1 space-y-4 overflow-y-auto pr-1">
        {!isLoading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-10 text-center opacity-60">
            <BrainCircuit size={44} className="text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Paste your notes or a document&rsquo;s text here to generate a structured, interactive quiz.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {isLoading && (
          <Card className="animate-fade-in border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" size={16} /> Generating your quiz…
            </div>
            {streamText && (
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground/80">
                {streamText}
              </pre>
            )}
          </Card>
        )}
      </main>

      <form onSubmit={onGenerate} className="relative">
        <Textarea
          value={sourceInput}
          onChange={(event) => setSourceInput(event.target.value)}
          placeholder="Paste your notes here..."
          className="min-h-[120px] resize-none rounded-2xl pr-16 focus:ring-primary"
        />
        <div className="absolute right-3 bottom-3">
          {isLoading ? (
            <Button variant="default" size="sm" type="button" className="h-10 w-10 rounded-full p-0" onClick={onStop}>
              <Loader2 className="animate-spin" size={18} />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              type="submit"
              className="h-10 w-10 rounded-full p-0"
              disabled={!sourceInput.trim()}
            >
              <Sparkles size={18} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface QuizRunnerProps {
  detail: QuizSessionDetail;
  onAnswer: (questionId: string, answer: string) => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}

function QuizRunner({ detail, onAnswer, onNavigate, onSubmit }: QuizRunnerProps) {
  const total = detail.questions.length;
  const index = Math.min(detail.currentQuestionIndex, total - 1);
  const question = detail.questions[index];
  const currentAnswer = detail.answers[question.id] ?? '';
  const answeredCount = Object.keys(detail.answers).length;
  const isLastQuestion = index === total - 1;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col p-6">
      <header className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl">
            <ListChecks className="text-primary" size={22} /> Quiz
          </h1>
          <span className="text-sm font-medium text-muted-foreground">
            Question {index + 1} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pr-1">
        <Card className="animate-fade-in border-border/50 p-5 shadow-sm sm:p-6">
          <p className="text-base font-medium leading-relaxed text-foreground">{question.question}</p>

          <div className="mt-5 space-y-2">
            {question.options && question.options.length > 0 ? (
              question.options.map((option) => {
                const isSelected = currentAnswer === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(question.id, option)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                      )}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                    {option}
                  </button>
                );
              })
            ) : (
              <Textarea
                value={currentAnswer}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                placeholder="Type your answer..."
                className="min-h-[100px] resize-none rounded-xl"
              />
            )}
          </div>
        </Card>
      </main>

      <footer className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onNavigate(index - 1)}
          disabled={index === 0}
        >
          <ArrowLeft size={16} className="mr-1" /> Previous
        </Button>

        <span className="text-xs text-muted-foreground">{answeredCount}/{total} answered</span>

        {isLastQuestion ? (
          <Button variant="default" size="sm" className="rounded-full" onClick={onSubmit}>
            Submit quiz
          </Button>
        ) : (
          <Button variant="default" size="sm" className="rounded-full" onClick={() => onNavigate(index + 1)}>
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        )}
      </footer>
    </div>
  );
}

function QuizResults({ detail, onStartOver }: { detail: QuizSessionDetail; onStartOver: () => void }) {
  const scorable = detail.questions.filter((question) => question.correctAnswer.trim().length > 0);
  const total = scorable.length;
  const score = detail.score ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <ListChecks className="text-primary" size={24} /> Results
          </h1>
          {total > 0 ? (
            <p className="text-sm text-muted-foreground">
              You scored <span className="font-semibold text-foreground">{score}</span> out of{' '}
              <span className="font-semibold text-foreground">{total}</span> ({percentage}%)
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Review your answers below.</p>
          )}
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={onStartOver}>
          <RotateCcw size={16} className="mr-1.5" /> Start over
        </Button>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto pr-1">
        {detail.questions.map((question, questionIndex) => (
          <QuestionReview key={question.id} question={question} index={questionIndex} answer={detail.answers[question.id]} />
        ))}
      </main>
    </div>
  );
}

function QuestionReview({
  question,
  index,
  answer,
}: {
  question: QuizQuestionState;
  index: number;
  answer?: string;
}) {
  const hasCorrectAnswer = question.correctAnswer.trim().length > 0;
  const isCorrect = hasCorrectAnswer && normalize(answer ?? '') === normalize(question.correctAnswer);

  return (
    <Card className="border-border/50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {hasCorrectAnswer && (
          <span className={cn('mt-0.5 shrink-0', isCorrect ? 'text-emerald-500' : 'text-destructive')}>
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {index + 1}. {question.question}
          </p>
          <p className="text-sm text-muted-foreground">
            Your answer: <span className="text-foreground">{answer || '—'}</span>
          </p>
          {hasCorrectAnswer && !isCorrect && (
            <p className="text-sm text-muted-foreground">
              Correct answer: <span className="text-foreground">{question.correctAnswer}</span>
            </p>
          )}
          {question.explanation && (
            <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{question.explanation}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

```


## Assistant

<thinking>
I'm setting up the four route files: dynamic pages that render the ExplainerWorkspace and QuizWorkspace components with the session id, plus two base pages that generate a new session id and redirect to it, which will need to be client components since they use the router.

I'm rewriting the bare explainer and quiz pages to redirect clients to a freshly generated session ID using a router effect with a loading spinner shown meanwhile. I'm also confirming the dynamic route page correctly receives params.sessionId per Next.js App Router conventions before finalizing these files.
</thinking>

Now the route files:

**Tool Call: app\\learning\\explainer\\\[sessionId]\\page.tsx**
Status: Completed

Diff: app\learning\explainer\[sessionId]\page.tsx
```
import { ExplainerWorkspace } from '@/components/learning/explainer-workspace';

export default function ExplainerSessionPage({ params }: { params: { sessionId: string } }) {
  return <ExplainerWorkspace sessionId={params.sessionId} />;
}

```


**Tool Call: app\\learning\\quiz\\\[sessionId]\\page.tsx**
Status: Completed

Diff: app\learning\quiz\[sessionId]\page.tsx
```
import { QuizWorkspace } from '@/components/learning/quiz-workspace';

export default function QuizSessionPage({ params }: { params: { sessionId: string } }) {
  return <QuizWorkspace sessionId={params.sessionId} />;
}

```


**Tool Call: app\\learning\\explainer\\page.tsx**
Status: Completed

Diff: app\learning\explainer\page.tsx
```
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { generateSessionId } from '@/lib/sessions/id';

/**
 * Landing route for `/learning/explainer` (e.g. from the app dock or a
 * bookmarked link). Immediately creates a fresh draft session and redirects
 * to its canonical URL so the session ID is always present in the address
 * bar.
 */
export default function NewExplainerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/learning/explainer/${generateSessionId()}`);
  }, [router]);

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" size={28} />
    </div>
  );
}

```


**Tool Call: app\\learning\\quiz\\page.tsx**
Status: Completed

Diff: app\learning\quiz\page.tsx
```
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { generateSessionId } from '@/lib/sessions/id';

/**
 * Landing route for `/learning/quiz`. Creates a fresh draft session and
 * redirects to its canonical URL, mirroring the explainer flow.
 */
export default function NewQuizRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/learning/quiz/${generateSessionId()}`);
  }, [router]);

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" size={28} />
    </div>
  );
}

```


## Assistant

<thinking>
I should run diagnostics across the project to catch any TypeScript errors, then verify the input, textarea, card, and button component APIs to confirm I'm using props and variants correctly.
</thinking>

Let me verify the `Input`, `Textarea`, and `Card` component APIs I've been using, then run diagnostics across everything I've touched.

**Tool Call: Read file `components\ui\input.tsx`**
Status: Completed

```Smartli V2\components\ui\input.tsx
     1	import * as React from "react"
     2	import * as RhuiSlot from "@radix-ui/react-slot"
     3	import { cn } from "@/lib/utils"
     4	
     5	export interface InputProps
     6	  extends React.InputHTMLAttributes<HTMLInputElement> {}
     7	
     8	const Input = React.forwardRef<HTMLInputElement, InputProps>(
     9	  ({ className, type, ...props }, ref) => {
    10	    return (
    11	      <input
    12	        type={type}
    13	        className={cn(
    14	          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    15	          className
    16	        )}
    17	        ref={ref}
    18	        {...props}
    19	      />
    20	    )
    21	  }
    22	)
    23	Input.displayName = "Input"
    24	
    25	export { Input }

```


**Tool Call: Read file `components\ui\textarea.tsx`**
Status: Completed

```Smartli V2\components\ui\textarea.tsx
     1	import * as React from "react"
     2	import { cn } from "@/lib/utils"
     3	
     4	export interface TextareaProps
     5	  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
     6	
     7	const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
     8	  ({ className, ...props }, ref) => {
     9	    return (
    10	      <textarea
    11	        className={cn(
    12	          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    13	          className
    14	        )}
    15	        ref={ref}
    16	        {...props}
    17	      />
    18	    )
    19	  }
    20	)
    21	Textarea.displayName = "Textarea"
    22	
    23	export { Textarea }

```


**Tool Call: Read file `components\ui\card.tsx`**
Status: Completed

```Smartli V2\components\ui\card.tsx
     1	import * as React from "react"
     2	import { cn } from "@/lib/utils"
     3	
     4	function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
     5	  return (
     6	    <div
     7	      className={cn(
     8	        "rounded-xl border bg-card text-card-foreground shadow",
     9	        className
    10	      )}
    11	      {...props}
    12	    />
    13	  )
    14	}
    15	
    16	function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    17	  return (
    18	    <div
    19	      className={cn("flex flex-col space-y-1.5 p-6", className)}
    20	      {...props}
    21	    />
    22	  )
    23	}
    24	
    25	function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    26	  return (
    27	    <div
    28	      className={cn("font-semibold leading-none tracking-tight", className)}
    29	      {...props}
    30	    />
    31	  )
    32	}
    33	
    34	function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    35	  return (
    36	    <div
    37	      className={cn("text-sm text-muted-foreground", className)}
    38	      {...props}
    39	    />
    40	  )
    41	}
    42	
    43	function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    44	  return (
    45	    <div
    46	      className={cn("p-6 pt-0", className)}
    47	      {...props}
    48	    />
    49	  )
    50	}
    51	
    52	function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    53	  return (
    54	    <div
    55	      className={cn("flex items-center p-6 pt-0", className)}
    56	      {...props}
    57	    />
    58	  )
    59	}
    60	
    61	export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```


## Assistant

Good, all compatible with how I used them. Now let's run diagnostics across the project.

**Tool Call: Check project diagnostics**
Status: Completed

Diagnostics successfully refreshed.

C:\Users\Tanush\Desktop\Coding\Smartli V2\app\globals.css: 0 error(s), 8 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\ui\ai-prompt-box.tsx: 0 error(s), 3 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\learning\session-history-list.tsx: 0 error(s), 6 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\learning\unsaved-session-dialog.tsx: 0 error(s), 6 warning(s)


## Assistant

<thinking>
Let me check the actual warnings in these two new files.
</thinking>

**Tool Call: Check diagnostics for `Smartli V2\components\learning\session-history-list.tsx`**
Status: Completed

Diagnostics successfully refreshed.

warning at line 37: Props must be serializable for components in the "use client" entry file, "onRetry" is invalid.
warning at line 37: Props must be serializable for components in the "use client" entry file, "onRetry" is invalid.
warning at line 37: Props must be serializable for components in the "use client" entry file, "onRetry" is invalid.
warning at line 39: Props must be serializable for components in the "use client" entry file, "onSelect" is invalid.
warning at line 39: Props must be serializable for components in the "use client" entry file, "onSelect" is invalid.
warning at line 39: Props must be serializable for components in the "use client" entry file, "onSelect" is invalid.


**Tool Call: Check diagnostics for `Smartli V2\components\learning\unsaved-session-dialog.tsx`**
Status: Completed

Diagnostics successfully refreshed.

warning at line 18: Props must be serializable for components in the "use client" entry file, "onCancel" is invalid.
warning at line 18: Props must be serializable for components in the "use client" entry file, "onCancel" is invalid.
warning at line 18: Props must be serializable for components in the "use client" entry file, "onCancel" is invalid.
warning at line 18: Props must be serializable for components in the "use client" entry file, "onConfirm" is invalid.
warning at line 18: Props must be serializable for components in the "use client" entry file, "onConfirm" is invalid.
warning at line 18: Props must be serializable for components in the "use client" entry file, "onConfirm" is invalid.


## Assistant

<thinking>
These warnings match the same false-positive pattern already present in ai-prompt-box.tsx, stemming from the "use client" boundary check flagging exports that are never actually used as Server Component props since they're only consumed within already-client components.  Since this is a benign editor heuristic and consistent with existing precedent, I'll leave it as-is and note it in the summary, then move on to check for any remaining real diagnostics elsewhere in the app.
</thinking>

These are the same benign "must be serializable" warning already present on `components/ui/ai-prompt-box.tsx` in the pre-existing codebase (a false-positive for function props on client-only components that are never crossed into a Server Component boundary). No actual errors. Let me confirm the full picture once more and check the edited `prompts.ts` for correctness.

**Tool Call: Read file `lib\ai\prompts.ts`**
Status: Completed

```Smartli V2\lib\ai\prompts.ts
     1	export const SYSTEM_PROMPTS = {
     2	  base: 'You are an expert AI study companion. Your goal is to help students learn through a structured pedagogical approach: Recall -> Application -> Analysis.',
     3	  explainer: 'Break down the concepts deeply but clearly. Use analogies where helpful and ensure the transition between concepts is logical.',
     4	  tutor: 'Act as an interactive tutor. Do not simply give answers; instead, ask probing questions to guide the user toward the answer, checking for understanding at each step.',
     5	  eli5: 'Explain the concept as if the user is 5 years old. Use extremely simple language, relatable analogies, and avoid technical jargon unless you explain it simply first.',
     6	};
     7	
     8	export const QUIZ_PROMPTS = {
     9	  mcq: 'Generate a multiple-choice quiz. For each question: Provide 4 options, clearly mark the correct one, and provide a detailed explanation of why the correct answer is right and why the others are wrong.',
    10	  exam: 'Generate exam-style questions. Include a mix of short-answer (comprehension) and long-form (analysis) questions. Provide a model answer and a rubric for grading.',
    11	  competency: 'Generate scenario-driven questions that test practical application of the concepts. Describe a real-world situation and ask the user to solve it using the principles provided in the context.',
    12	  reasoning: 'Generate "why" and "how" questions that require deep reasoning and justification. The goal is to test if the user understands the underlying logic, not just the facts.',
    13	};
    14	
    15	/**
    16	 * Strict, machine-parsable format for quiz generation. The client parses
    17	 * this exact shape (see `lib/ai/quiz-parser.ts`) to render an interactive,
    18	 * question-by-question quiz instead of a wall of raw text.
    19	 */
    20	const QUIZ_FORMAT_INSTRUCTION = `
    21	  Output ONLY the questions using exactly this structure, with nothing else
    22	  before or after (no preamble, no closing remarks):
    23	
    24	  Q1: <question text>
    25	  A) <option 1>
    26	  B) <option 2>
    27	  C) <option 3>
    28	  D) <option 4>
    29	  ANSWER: <the letter of the correct option, e.g. B>
    30	  EXPLANATION: <why the correct answer is right, and briefly why the others are wrong>
    31	
    32	  Q2: <question text>
    33	  ...
    34	
    35	  If the question type does not have multiple-choice options (short-answer,
    36	  scenario-based, or reasoning questions), omit the A)-D) lines and instead
    37	  write:
    38	
    39	  Q1: <question text>
    40	  ANSWER: <model answer>
    41	  EXPLANATION: <reasoning or grading rubric>
    42	
    43	  Generate between 5 and 8 questions.
    44	`;
    45	
    46	export function constructPrompt(
    47	  mode: string,
    48	  request: string,
    49	  context: string = '',
    50	  quizType?: string
    51	) {
    52	  if (mode === 'quiz') {
    53	    const quizInstruction =
    54	      QUIZ_PROMPTS[quizType as keyof typeof QUIZ_PROMPTS] || QUIZ_PROMPTS.mcq;
    55	
    56	    return `
    57	      System: ${SYSTEM_PROMPTS.base}
    58	      Quiz style: ${quizInstruction}
    59	      Context: ${context || 'No additional context provided.'}
    60	      User Request: ${request}
    61	
    62	      Format instruction: ${QUIZ_FORMAT_INSTRUCTION}
    63	    `;
    64	  }
    65	
    66	  const system = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.base;
    67	
    68	  return `
    69	    System: ${SYSTEM_PROMPTS.base} ${system}
    70	    Context: ${context || 'No additional context provided.'}
    71	    User Request: ${request}
    72	
    73	    Instruction: Please ensure your output is pedagogically sound and follows the Recall -> Application -> Analysis progression.
    74	  `;
    75	}

```


**Tool Call: Check project diagnostics**
Status: Completed

Diagnostics successfully refreshed.

C:\Users\Tanush\Desktop\Coding\Smartli V2\app\globals.css: 0 error(s), 8 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\ui\ai-prompt-box.tsx: 0 error(s), 3 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\learning\session-history-list.tsx: 0 error(s), 6 warning(s)
C:\Users\Tanush\Desktop\Coding\Smartli V2\components\learning\unsaved-session-dialog.tsx: 0 error(s), 6 warning(s)


## Assistant

The prompt update looks correct, and diagnostics report **0 errors** across the entire project. Let's also try a build to catch anything the language server missed (e.g. route typing, unused imports treated as errors under `next build`).

**Tool Call: npm run build**
Status: Failed

terminal tool is disabled

## Assistant

<thinking>
Since the terminal tool is disabled, I can't run the build directly, so I'll lean on the diagnostics output showing zero errors and do a careful manual review of the files instead. I'm double-checking imports across the sidebar and quiz workspace components to confirm everything I imported is actually being used.

I noticed generateSessionId is imported in quiz-workspace.tsx but never called there directly - it's actually used in quiz-parser.ts instead. Since tsconfig doesn't have noUnusedLocals set, this wouldn't cause a build failure, but I'll remove the unused import anyway for cleanliness and reread the file to confirm.
</thinking>

Let me check for one unused import I suspect I left in `quiz-workspace.tsx`.

**Tool Call: Search files for regex `generateSessionId`**
Status: Completed

file:///C:/Users/Tanush/Desktop/Coding/Smartli%20V2/components/learning/quiz-workspace.tsx#L23:27

```
import { getSessionDetail, getSessionSummary, saveSessionDetail, upsertSessionSummary } from '@/lib/sessions/storage';
import { useNavigationGuard } from '@/components/learning/navigation-guard-context';
import { generateSessionId } from '@/lib/sessions/id';

const QUIZ_TYPES: QuizType[] = ['mcq', 'exam', 'competency', 'reasoning'];
```


## Assistant

Confirmed — `generateSessionId` is imported but never called in that file (question IDs come from `quiz-parser.ts`). Removing it.

**Tool Call: components\\learning\\quiz\-workspace.tsx**
Status: Completed

Diff: components\learning\quiz-workspace.tsx
```
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ListChecks,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { QuizType } from '@/types';
import type { QuizQuestionState, QuizSessionDetail } from '@/lib/sessions/types';
import { parseQuizResponse } from '@/lib/ai/quiz-parser';
import { getSessionDetail, getSessionSummary, saveSessionDetail, upsertSessionSummary } from '@/lib/sessions/storage';
import { useNavigationGuard } from '@/components/learning/navigation-guard-context';

const QUIZ_TYPES: QuizType[] = ['mcq', 'exam', 'competency', 'reasoning'];

function createEmptyDetail(id: string): QuizSessionDetail {
  return {
    id,
    type: 'quiz',
    quizType: 'mcq',
    sourceText: '',
    rawResponse: '',
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    submitted: false,
  };
}

function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (!clean) return 'New Quiz';
  if (clean.length <= 48) return clean;
  return `${clean.slice(0, 45)}…`;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function QuizWorkspace({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<QuizSessionDetail | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sourceInput, setSourceInput] = useState('');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
  const { setDirty, setBeforeLeave } = useNavigationGuard();
  const detailRef = useRef<QuizSessionDetail | null>(null);

  useEffect(() => {
    setIsLoadingSession(true);
    const existing = getSessionDetail<QuizSessionDetail>(sessionId);
    const next = existing ?? createEmptyDetail(sessionId);
    setDetail(next);
    detailRef.current = next;
    setSourceInput(next.sourceText);
    setIsLoadingSession(false);
  }, [sessionId]);

  useEffect(() => {
    detailRef.current = detail;
  }, [detail]);

  const hasStartedQuiz = Boolean(detail && (detail.questions.length > 0 || Object.keys(detail.answers).length > 0));

  useEffect(() => {
    const dirty = isLoading || (hasStartedQuiz && !detail?.submitted);
    setDirty(dirty);
  }, [isLoading, hasStartedQuiz, detail?.submitted, setDirty]);

  useEffect(() => {
    setBeforeLeave(() => stopStream());
    return () => setBeforeLeave(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Turn the completed raw response into structured, answerable questions.
  useEffect(() => {
    if (!isComplete || !streamText) return;
    const current = detailRef.current;
    if (!current) return;

    const questions = parseQuizResponse(streamText);

    persist({
      ...current,
      rawResponse: streamText,
      questions,
      answers: {},
      currentQuestionIndex: 0,
      submitted: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  function persist(nextDetail: QuizSessionDetail) {
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);

    const existingSummary = getSessionSummary(sessionId);
    const now = new Date().toISOString();
    const totalQuestions = nextDetail.questions.length;
    const answeredCount = Object.keys(nextDetail.answers).length;
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    upsertSessionSummary({
      id: sessionId,
      type: 'quiz',
      title: deriveTitle(nextDetail.sourceText),
      status: nextDetail.submitted ? 'completed' : totalQuestions > 0 ? 'active' : 'draft',
      createdAt: existingSummary?.createdAt ?? now,
      updatedAt: now,
      lastMessagePreview:
        nextDetail.submitted && typeof nextDetail.score === 'number'
          ? `Scored ${nextDetail.score}/${totalQuestions}`
          : totalQuestions > 0
            ? `${answeredCount}/${totalQuestions} answered`
            : undefined,
      progress: nextDetail.submitted ? 100 : progress,
    });
  }

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    if (!sourceInput.trim() || isLoading || !detail) return;

    const nextDetail: QuizSessionDetail = { ...detail, sourceText: sourceInput.trim() };
    persist(nextDetail);

    await startStream({
      prompt:
        'Generate a quiz based on the following content. Follow a pedagogical progression from basic recall to higher-order analysis.',
      context: sourceInput.trim(),
      mode: 'quiz',
      quizType: detail.quizType,
    });
  }

  function handleQuizTypeChange(quizType: QuizType) {
    if (!detail) return;
    const nextDetail = { ...detail, quizType };
    setDetail(nextDetail);
    detailRef.current = nextDetail;
    saveSessionDetail(sessionId, nextDetail);
  }

  function handleAnswer(questionId: string, answer: string) {
    if (!detail) return;
    persist({ ...detail, answers: { ...detail.answers, [questionId]: answer } });
  }

  function goToQuestion(index: number) {
    if (!detail) return;
    const clamped = Math.max(0, Math.min(index, detail.questions.length - 1));
    persist({ ...detail, currentQuestionIndex: clamped });
  }

  function handleSubmitQuiz() {
    if (!detail) return;
    const scorable = detail.questions.filter((question) => question.correctAnswer.trim().length > 0);
    const correctCount = scorable.filter(
      (question) => normalize(detail.answers[question.id] ?? '') === normalize(question.correctAnswer)
    ).length;

    persist({ ...detail, submitted: true, score: correctCount });
  }

  function handleStartOver() {
    if (!detail) return;
    persist(createEmptyDetail(sessionId));
    setSourceInput('');
  }

  if (isLoadingSession || !detail) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  if (detail.questions.length === 0) {
    return (
      <QuizSetup
        detail={detail}
        sourceInput={sourceInput}
        setSourceInput={setSourceInput}
        isLoading={isLoading}
        error={error}
        streamText={streamText}
        onQuizTypeChange={handleQuizTypeChange}
        onGenerate={handleGenerate}
        onStop={stopStream}
      />
    );
  }

  if (detail.submitted) {
    return <QuizResults detail={detail} onStartOver={handleStartOver} />;
  }

  return (
    <QuizRunner
      detail={detail}
      onAnswer={handleAnswer}
      onNavigate={goToQuestion}
      onSubmit={handleSubmitQuiz}
    />
  );
}

interface QuizSetupProps {
  detail: QuizSessionDetail;
  sourceInput: string;
  setSourceInput: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  streamText: string;
  onQuizTypeChange: (quizType: QuizType) => void;
  onGenerate: (event: React.FormEvent) => void;
  onStop: () => void;
}

function QuizSetup({
  detail,
  sourceInput,
  setSourceInput,
  isLoading,
  error,
  streamText,
  onQuizTypeChange,
  onGenerate,
  onStop,
}: QuizSetupProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col p-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
          <ListChecks className="text-primary" size={24} /> AI Quiz Generator
        </h1>
        <p className="text-sm text-muted-foreground">Transform your notes into high-fidelity assessments.</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-1.5 rounded-full bg-muted p-1 w-fit">
        {QUIZ_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onQuizTypeChange(type)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-200 sm:text-sm',
              detail.quizType === type
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <main className="mb-6 flex-1 space-y-4 overflow-y-auto pr-1">
        {!isLoading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-10 text-center opacity-60">
            <BrainCircuit size={44} className="text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Paste your notes or a document&rsquo;s text here to generate a structured, interactive quiz.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {isLoading && (
          <Card className="animate-fade-in border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" size={16} /> Generating your quiz…
            </div>
            {streamText && (
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground/80">
                {streamText}
              </pre>
            )}
          </Card>
        )}
      </main>

      <form onSubmit={onGenerate} className="relative">
        <Textarea
          value={sourceInput}
          onChange={(event) => setSourceInput(event.target.value)}
          placeholder="Paste your notes here..."
          className="min-h-[120px] resize-none rounded-2xl pr-16 focus:ring-primary"
        />
        <div className="absolute right-3 bottom-3">
          {isLoading ? (
            <Button variant="default" size="sm" type="button" className="h-10 w-10 rounded-full p-0" onClick={onStop}>
              <Loader2 className="animate-spin" size={18} />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              type="submit"
              className="h-10 w-10 rounded-full p-0"
              disabled={!sourceInput.trim()}
            >
              <Sparkles size={18} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface QuizRunnerProps {
  detail: QuizSessionDetail;
  onAnswer: (questionId: string, answer: string) => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}

function QuizRunner({ detail, onAnswer, onNavigate, onSubmit }: QuizRunnerProps) {
  const total = detail.questions.length;
  const index = Math.min(detail.currentQuestionIndex, total - 1);
  const question = detail.questions[index];
  const currentAnswer = detail.answers[question.id] ?? '';
  const answeredCount = Object.keys(detail.answers).length;
  const isLastQuestion = index === total - 1;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col p-6">
      <header className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl">
            <ListChecks className="text-primary" size={22} /> Quiz
          </h1>
          <span className="text-sm font-medium text-muted-foreground">
            Question {index + 1} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pr-1">
        <Card className="animate-fade-in border-border/50 p-5 shadow-sm sm:p-6">
          <p className="text-base font-medium leading-relaxed text-foreground">{question.question}</p>

          <div className="mt-5 space-y-2">
            {question.options && question.options.length > 0 ? (
              question.options.map((option) => {
                const isSelected = currentAnswer === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(question.id, option)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                      )}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                    {option}
                  </button>
                );
              })
            ) : (
              <Textarea
                value={currentAnswer}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                placeholder="Type your answer..."
                className="min-h-[100px] resize-none rounded-xl"
              />
            )}
          </div>
        </Card>
      </main>

      <footer className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onNavigate(index - 1)}
          disabled={index === 0}
        >
          <ArrowLeft size={16} className="mr-1" /> Previous
        </Button>

        <span className="text-xs text-muted-foreground">{answeredCount}/{total} answered</span>

        {isLastQuestion ? (
          <Button variant="default" size="sm" className="rounded-full" onClick={onSubmit}>
            Submit quiz
          </Button>
        ) : (
          <Button variant="default" size="sm" className="rounded-full" onClick={() => onNavigate(index + 1)}>
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        )}
      </footer>
    </div>
  );
}

function QuizResults({ detail, onStartOver }: { detail: QuizSessionDetail; onStartOver: () => void }) {
  const scorable = detail.questions.filter((question) => question.correctAnswer.trim().length > 0);
  const total = scorable.length;
  const score = detail.score ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <ListChecks className="text-primary" size={24} /> Results
          </h1>
          {total > 0 ? (
            <p className="text-sm text-muted-foreground">
              You scored <span className="font-semibold text-foreground">{score}</span> out of{' '}
              <span className="font-semibold text-foreground">{total}</span> ({percentage}%)
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Review your answers below.</p>
          )}
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={onStartOver}>
          <RotateCcw size={16} className="mr-1.5" /> Start over
        </Button>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto pr-1">
        {detail.questions.map((question, questionIndex) => (
          <QuestionReview key={question.id} question={question} index={questionIndex} answer={detail.answers[question.id]} />
        ))}
      </main>
    </div>
  );
}

function QuestionReview({
  question,
  index,
  answer,
}: {
  question: QuizQuestionState;
  index: number;
  answer?: string;
}) {
  const hasCorrectAnswer = question.correctAnswer.trim().length > 0;
  const isCorrect = hasCorrectAnswer && normalize(answer ?? '') === normalize(question.correctAnswer);

  return (
    <Card className="border-border/50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {hasCorrectAnswer && (
          <span className={cn('mt-0.5 shrink-0', isCorrect ? 'text-emerald-500' : 'text-destructive')}>
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {index + 1}. {question.question}
          </p>
          <p className="text-sm text-muted-foreground">
            Your answer: <span className="text-foreground">{answer || '—'}</span>
          </p>
          {hasCorrectAnswer && !isCorrect && (
            <p className="text-sm text-muted-foreground">
              Correct answer: <span className="text-foreground">{question.correctAnswer}</span>
            </p>
          )}
          {question.explanation && (
            <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{question.explanation}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

```


## Assistant

<thinking>
Since I can't run the build, I'm manually scanning other files for unused imports, checking explainer-workspace.tsx line by line and confirming all its imports—React hooks, UI components, icons, and types—are actually used.

Now I'm going through learning-sidebar.tsx the same way, verifying each import from React hooks and Next.js navigation to Radix Dialog, Framer Motion, icons, and custom hooks all trace back to actual usage in the component.

Then I check session-history-list.tsx, unsaved-session-dialog.tsx, navigation-guard-context.tsx, and useLearningSessions.tsx similarly, confirming every imported hook, component, and type is actually referenced somewhere in the file with nothing left dangling unused.

Moving on, I verify useSidebarCollapsed.ts, quiz-parser.ts, app-chrome.tsx, and app/learning/layout.tsx - all imports are properly used, and the layout can stay a server component since it doesn't rely on client-only hooks while still correctly rendering client component children. I also confirm the dynamic segment pages are fine without 'use client' since they just forward params to client components, and now I'm moving on to double-checking the types directory.

Now I'm verifying that AIExplainerMode and QuizType export correctly from types/index.ts, that useAIStream.ts's error field matches how it's used, and that AIRequest includes the quizType field. I'm also confirming the onChange handlers on the Textarea and Input components will correctly infer their event types through the component prop signatures without needing explicit typing.

I'm also checking whether QuizWorkspace's async handleGenerate function, which returns a Promise<void>, is properly assignable to the onSubmit form handler prop typed as returning void—TypeScript allows this due to how void-returning function types are treated contravariantly.

So the interface expects a void-returning handler, but handleGenerate is async and returns a Promise<void> — since TypeScript specifically allows void-returning function types to accept functions that return anything, this assignment is safe and won't produce a type error.

Same allowance applies there too. Checking the useAIStream hook's startStream signature confirms it returns a promise matching the async pattern, and verifying stopStream is correctly wired as both a click handler and cleanup callback via setBeforeLeave, with the wrapped arrow function types lining up properly.

Actually Next.js reuses the component instance across param changes rather than remounting, so ExplainerWorkspace persists while sessionId updates as a prop - which is exactly why my `useEffect` keyed on sessionId resets state correctly. Since useAIStream also persists across switches, but stopStream stays stable via useCallback, my navigation guard correctly calls the same stable stopStream reference before switching sessions.

Tracing the abort path: stopStream aborts the controller, the fetch throws AbortError which gets caught silently (no error set), and the finally block sets isLoading false - but streamText keeps whatever partial text had accumulated, and isComplete stays false since we aborted before completion. So after navigating to a new session, that leftover partial streamText from the old session could still be sitting in state when the new session's detail loads in.

Since it's transient and never persisted, this isn't a real data-corruption risk, just a cosmetic edge case. I'll leave it as is rather than over-engineering further, since the core abort-on-leave safety principle is already covered.

QuizWorkspace shares the same pattern, so the same reasoning applies there too.

Now I want to double-check the generic type constraint on `getSessionDetail<T>` — verifying that `ExplainerSessionDetail` properly satisfies `T extends SessionDetail` for the explainer-workspace call.

Progress being optional for explainer is fine since it's just omitted. I'm also confirming getSessionSummary preserves createdAt correctly, and checking that the Card component's className prop usage matches its accepted HTML attributes signature, plus verifying StreamingResponse's expected prop types.

Now I'm checking that Button variants like "destructive", "outline", "ghost", and "default", along with sizes "icon" and "sm", all exist in the cva config and match usage throughout. I'm also confirming that Dialog's Root, Portal, Overlay, Content, Title, Description, and Close all correctly reference the installed Radix package, then moving on to verify other Radix imports.

Now I'm verifying the Tooltip provider's delayDuration prop is valid, and checking the mobile sidebar's close behavior when navigating away from a dirty session -- confirming that closing the drawer before the confirm dialog opens is acceptable UX without z-index conflicts.

I'm also confirming that `motion.aside` is valid since Framer Motion generates proxies for all standard HTML elements, then verifying the sticky sidebar's responsive Tailwind classes for desktop layout.

I check that `h-dvh` is supported since the project's Tailwind version is 3.4.1, which includes dynamic viewport height utilities, and confirm the arbitrary value syntax for the sidebar width using `min()` compiles correctly since it has no spaces needing escaping.

I verify the same pattern in the unsaved-session-dialog, then confirm the fade-in animation class reuses an existing global CSS keyframe, the safe-area-inset-top usage is valid inline CSS, and the reduced-motion hook import matches existing usage elsewhere. Now I'm checking the LearningSidebar's description prop.

This confirms the standard Tailwind convention: "hidden" hides on mobile, "md:flex" overrides to flex at the desktop breakpoint via the media query cascade, so the pattern I used is correct.

I also verify Framer Motion's animate width prop applies via inline style independently of Tailwind's display property, so there's no conflict even though the element is hidden on mobile—no layout thrash occurs since it isn't rendered anyway. Now checking that sticky positioning and full-height sidebar work correctly within the flex row layout.

Actually, since each workspace manages its own internal scroll with overflow-y-auto regions rather than the page itself scrolling, the sticky positioning on the sidebar is likely redundant in practice, but it's a harmless defensive fallback.

Now I'm tracing through the height chain to confirm `h-full` resolves correctly — checking whether the root layout's viewport heights (min-h-dvh, md:h-dvh) properly cascade down through the workspace's flex containers so that `h-full` on nested elements like ExplainerWorkspace's root div actually has something to measure against.

I need to check whether LearningSidebar renders multiple top-level elements (aside, mobile bar, dialog) as siblings within the flex row, or if it's wrapped, since that affects how the mobile top bar and main content actually stack in the flex layout.

On desktop with md:flex-row, the layout switches to horizontal: sidebar visible on the left, mobile bar hidden, main content on the right — matching the intended design. Now I'm checking whether the parent's min-h-dvh actually gives main a resolvable height for h-full, since min-height on a flex container doesn't behave the same as height for stretch-based sizing.

Actually, since aside has an explicit md:h-dvh, default stretch alignment forces every sibling in that flex row to match the tallest one's height — so main ends up effectively 100dvh tall because it's stretched to match the aside's fixed viewport height.

That min-h-0 on main is the standard flexbox fix allowing internal scroll regions to work instead of the whole page growing. Tracing further, ExplainerWorkspace's h-full correctly resolves against main's dvh-derived height since it's the sole child. On mobile with flex-col, hidden elements like aside contribute zero height since display:none removes them from layout entirely, so the sizing chain simplifies there.

Continuing on mobile: the top bar takes its natural content height (~52px) while Dialog.Root contributes nothing since it's not rendered in flow, and main with flex-1 grows to consume the remaining vertical space after the top bar in the min-h-dvh column — exactly the intended full-height behavior below the bar, with width stretching naturally via cross-axis. This confirms the height cascade holds on both mobile and desktop without extra explicit heights, so I'm fairly confident the layout renders correctly, assuming Tailwind v3.4.1 actually supports compiling h-dvh/min-h-dvh.

Now checking AppChrome's main on learning routes: since isLearningRoute is true, the conditional padding class resolves to an empty string through cn/clsx/twMerge with no styling impact, and AppDock isn't rendered at all in this case. That means AppChrome's outer main becomes an unstyled wrapper with no padding and no dock, but this creates a nested main element since app/learning/layout.tsx also renders its own main inside it.

Since nested main elements are invalid HTML5 and could confuse assistive tech with duplicate landmark roles, I should change the inner wrapper in the learning layout from a main tag to a div, keeping AppChrome's main as the single top-level landmark.

Actually, `dvh` is a viewport-relative unit, so `min-h-dvh` computes against the dynamic viewport height regardless of the parent's own height — no parent flex or explicit height is required for it to work correctly.

There's still a real issue though: nesting a `<main>` inside another `<main>` is invalid HTML semantics and worth fixing for accessibility. I'll change the inner element in `app/learning/layout.tsx` from `<main>` to `<div>` and apply that fix now.
</thinking>

One correctness fix: `AppChrome` already wraps every page in a top-level `<main>`, so the learning layout's inner `<main>` creates an invalid nested `<main>` landmark. Let me fix that.

**Tool Call: app\\learning\\layout.tsx**
Status: Completed

Diff: app\learning\layout.tsx
```
import { LearningSessionsProvider } from '@/hooks/useLearningSessions';
import { NavigationGuardProvider } from '@/components/learning/navigation-guard-context';
import { LearningSidebar } from '@/components/learning/learning-sidebar';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearningSessionsProvider>
      <NavigationGuardProvider>
        <div className="flex min-h-dvh w-full flex-col md:flex-row">
          <LearningSidebar />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </NavigationGuardProvider>
    </LearningSessionsProvider>
  );
}

```

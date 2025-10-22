---
sidebar_position: 1
title: Installation
description: How to install XHub Chat packages in your project
---

# 📦 Installation

Get started with XHub Chat by installing the packages you need for your project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18.0 or higher
- **Package Manager**: pnpm (recommended), npm, or yarn
- **TypeScript** 4.9+ (recommended for type safety)

## Package Overview

XHub Chat is distributed as a monorepo with multiple packages:

| Package | Description | When to Use |
|---------|-------------|-------------|
| `@xhub-chat/core` | Framework-agnostic core functionality | Always required |
| `@xhub-chat/react` | React hooks and components | When building React apps |

## Installation Options

### Option 1: Using pnpm (Recommended)

```bash
# Install both core and react packages
pnpm add @xhub-chat/core @xhub-chat/react

# Or install only the core package
pnpm add @xhub-chat/core
```

### Option 2: Using npm

```bash
# Install both core and react packages
npm install @xhub-chat/core @xhub-chat/react

# Or install only the core package
npm install @xhub-chat/core
```

### Option 3: Using yarn

```bash
# Install both core and react packages
yarn add @xhub-chat/core @xhub-chat/react

# Or install only the core package
yarn add @xhub-chat/core
```

## Peer Dependencies

### For React Projects

If you're using `@xhub-chat/react`, ensure you have React installed:

```bash
pnpm add react react-dom
```

**Supported React versions**: ^18.0.0 || ^19.0.0

## TypeScript Support

XHub Chat is written in TypeScript and includes type definitions out of the box. No additional `@types` packages are needed.

### TypeScript Configuration

Ensure your `tsconfig.json` includes these settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Verify Installation

After installation, verify that the packages are correctly installed:

```bash
# Check installed versions
pnpm list @xhub-chat/core @xhub-chat/react

# Or with npm
npm list @xhub-chat/core @xhub-chat/react
```

## Development Installation

If you want to contribute or work on XHub Chat locally:

```bash
# Clone the repository
git clone https://github.com/XHub-Platform/xhub-chat.git
cd xhub-chat

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Troubleshooting

### Common Issues

#### Package Not Found

If you get a "package not found" error, ensure you're using the correct package names:

- ✅ `@xhub-chat/core` (correct)
- ❌ `xhub-chat-core` (incorrect)

#### Peer Dependency Warnings

If you see peer dependency warnings with React, ensure you have a compatible React version installed (18.0+).

#### Type Errors

If you encounter type errors, ensure your TypeScript version is 4.9 or higher:

```bash
pnpm add -D typescript@latest
```

## Next Steps

Now that you have XHub Chat installed, you're ready to:

1. [📚 Quick Start Guide](/docs/getting-started/quick-start) - Build your first chat app
2. [⚙️ Configuration](/docs/getting-started/requirements) - Learn about configuration options
3. [💡 Core Concepts](/docs/core-concepts/overview) - Understand the architecture

## Need Help?

- 📖 Check the [FAQ](/docs/core-concepts/faq)
- 🐛 [Report an issue](https://github.com/XHub-Platform/xhub-chat/issues)
- 💬 [Discussions](https://github.com/XHub-Platform/xhub-chat/discussions)

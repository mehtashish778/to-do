# Development Guide

This document provides technical details for developers working on the AI-Powered Todo App.

## Architecture Overview

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Custom hooks** for state management
- **Component-based architecture** with clear separation of concerns

### State Management
- **Local state**: React useState for component-specific state
- **Global state**: Custom hooks with localStorage persistence
- **No external state management** - keeping it simple and performant

### Data Flow
```
User Action → Component → Hook → Service → API → Response → State Update → UI Update
```

## Key Components

### 1. Todo Management (`useTodos` hook)
- **Location**: `src/hooks/useTodos.ts`
- **Purpose**: Centralized todo state management
- **Features**:
  - CRUD operations for todos
  - Local storage persistence
  - Filtering and search
  - Statistics calculation

### 2. Ollama Integration (`ollamaService`)
- **Location**: `src/services/ollamaService.ts`
- **Purpose**: AI-powered todo management
- **Features**:
  - Natural language todo creation
  - Smart todo editing
  - AI suggestions
  - Connection management

### 3. UI Components
- **TodoItem**: Individual todo display with inline editing
- **TodoForm**: Add new todos with advanced options
- **TodoFilters**: Search and filter functionality
- **AIChat**: Real-time chat with AI assistant
- **OllamaSettings**: Configuration management

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### 2. Code Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # External API integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

### 3. Adding New Features

1. **Define types** in `src/types/index.ts`
2. **Create components** in `src/components/`
3. **Add business logic** in hooks or services
4. **Update the main App** component
5. **Test thoroughly** with different scenarios

## AI Integration Details

### Ollama API Integration

The app integrates with Ollama's REST API:

```typescript
// Generate AI response
POST /api/generate
{
  "model": "mistral-small",
  "prompt": "User prompt",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "num_predict": 1000
  }
}
```

### Prompt Engineering

The app uses structured prompts for different tasks:

1. **Todo Creation**: Extracts todo information from natural language
2. **Todo Editing**: Understands modification requests
3. **Suggestions**: Provides contextual recommendations

### Error Handling

- **Connection failures**: Graceful fallback with user feedback
- **API errors**: Retry logic and error messages
- **Invalid responses**: Fallback to manual todo creation

## Performance Considerations

### Optimization Strategies

1. **Memoization**: React.memo for expensive components
2. **Debouncing**: Search input debouncing
3. **Lazy loading**: Component lazy loading for large lists
4. **Local storage**: Efficient serialization/deserialization

### Bundle Size

- **Tree shaking**: Only import used components
- **Code splitting**: Route-based splitting
- **Dependency analysis**: Regular bundle analysis

## Testing Strategy

### Manual Testing Checklist

- [ ] Todo CRUD operations
- [ ] Filtering and search
- [ ] AI chat functionality
- [ ] Ollama connection management
- [ ] Responsive design
- [ ] Local storage persistence
- [ ] Error handling

### Automated Testing (Future)

- **Unit tests**: Component and hook testing
- **Integration tests**: API integration testing
- **E2E tests**: User workflow testing

## Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Environment Variables

- `VITE_OLLAMA_URL`: Custom Ollama server URL
- `VITE_DEFAULT_MODEL`: Default AI model
- `VITE_DEBUG`: Enable debug logging

## Troubleshooting

### Common Development Issues

1. **TypeScript errors**: Run `npm run type-check`
2. **Linting errors**: Run `npm run lint`
3. **Build failures**: Check for missing dependencies
4. **Ollama connection**: Verify server is running

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true')
```

### Performance Monitoring

- **React DevTools**: Component profiling
- **Network tab**: API call monitoring
- **Console**: Error and warning tracking

## Contributing Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced code quality
- **Prettier**: Consistent formatting
- **Conventional commits**: Clear commit messages

### Pull Request Process

1. **Feature branch**: Create from main
2. **Development**: Implement feature
3. **Testing**: Manual and automated tests
4. **Documentation**: Update relevant docs
5. **Review**: Code review and approval
6. **Merge**: Squash and merge to main

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] Performance is considered
- [ ] Accessibility is maintained
- [ ] Documentation is updated

## Future Enhancements

### Planned Features

1. **Offline support**: Service worker implementation
2. **Sync**: Cloud storage integration
3. **Collaboration**: Multi-user support
4. **Advanced AI**: More sophisticated prompts
5. **Analytics**: Usage tracking and insights

### Technical Debt

1. **Test coverage**: Add comprehensive tests
2. **Error boundaries**: React error boundaries
3. **Performance**: Bundle size optimization
4. **Accessibility**: ARIA improvements
5. **Security**: Input validation and sanitization

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Vite Documentation](https://vitejs.dev/) 
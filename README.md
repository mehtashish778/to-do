# AI-Powered Todo App

A modern, TypeScript-based todo application with Ollama AI integration for intelligent task management. Built with React, Vite, and Tailwind CSS.

## Features

### 🎯 Core Todo Management
- **Add, edit, and delete todos** with rich metadata
- **Priority levels** (Low, Medium, High) with visual indicators
- **Due dates** and **tags** for better organization
- **Search and filtering** by status, priority, and text
- **Local storage persistence** - your todos are saved automatically
- **Statistics dashboard** showing completion rates and priorities

### 🤖 AI Integration with Ollama
- **Natural language todo creation** - "Add a high priority task to review quarterly reports"
- **Smart todo editing** - "Mark the first todo as completed"
- **AI-powered suggestions** for better task organization
- **Real-time chat interface** with the AI assistant
- **Configurable Ollama settings** for different models and parameters

### 🎨 Modern UI/UX
- **Responsive design** that works on desktop and mobile
- **Beautiful animations** and smooth transitions
- **Dark/light theme support** with Tailwind CSS
- **Intuitive interface** with clear visual hierarchy
- **Accessibility features** for better usability

## Prerequisites

Before running this application, you need to have:

1. **Node.js** (version 16 or higher)
2. **Ollama** installed and running locally
3. **Mistral-small model** pulled in Ollama

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd to_do_app
npm install
```

### 2. Set up Ollama

1. **Install Ollama** from [ollama.ai](https://ollama.ai)
2. **Pull the Mistral-small model**:
   ```bash
   ollama pull mistral-small
   ```
3. **Start Ollama server**:
   ```bash
   ollama serve
   ```

### 3. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Usage

### Basic Todo Management

1. **Add a todo**: Use the form in the sidebar or chat with AI
2. **Edit a todo**: Click the edit icon on any todo item
3. **Mark as complete**: Click the checkbox next to the todo
4. **Delete a todo**: Click the trash icon
5. **Filter todos**: Use the filters panel to search and filter

### AI Chat Features

1. **Connect to Ollama**: Configure your Ollama settings in the sidebar
2. **Add todos via chat**: Try saying "Add a high priority task to review the quarterly report"
3. **Edit existing todos**: "Mark the first todo as completed"
4. **Get suggestions**: Ask "What suggestions do you have for my todo list?"

### Example AI Commands

- `"Add a todo to buy groceries tomorrow"`
- `"Create a high priority task for the project deadline"`
- `"Mark the grocery shopping as completed"`
- `"What should I focus on today?"`
- `"Add tags 'work' and 'urgent' to the first todo"`

## Project Structure

```
src/
├── components/          # React components
│   ├── TodoItem.tsx    # Individual todo item
│   ├── TodoForm.tsx    # Add/edit todo form
│   ├── TodoFilters.tsx # Search and filter controls
│   ├── AIChat.tsx      # AI chat interface
│   └── OllamaSettings.tsx # Ollama configuration
├── hooks/              # Custom React hooks
│   └── useTodos.ts     # Todo state management
├── services/           # External services
│   └── ollamaService.ts # Ollama API integration
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── utils/              # Utility functions
│   └── cn.ts           # Class name utilities
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **AI Integration**: Ollama API
- **State Management**: React Hooks with localStorage persistence

### Configuration

The application uses the following default Ollama configuration:

```typescript
{
  baseUrl: 'http://localhost:11434',
  model: 'mistral-small',
  temperature: 0.7,
  maxTokens: 1000
}
```

You can modify these settings in the Ollama Settings panel.

## Troubleshooting

### Common Issues

1. **Ollama connection failed**
   - Ensure Ollama is running: `ollama serve`
   - Check if the model is pulled: `ollama list`
   - Verify the URL in settings (default: http://localhost:11434)

2. **AI responses are slow**
   - Try reducing the `maxTokens` setting
   - Lower the `temperature` for more focused responses
   - Consider using a smaller model

3. **Todos not saving**
   - Check browser console for errors
   - Ensure localStorage is enabled in your browser
   - Try clearing browser cache

### Debug Mode

Enable debug logging by opening browser console and running:
```javascript
localStorage.setItem('debug', 'true')
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [Ollama](https://ollama.ai/)
- Icons from [Lucide](https://lucide.dev/) 
import React, { FC, useState } from 'react'
import { AIChat, Message, StreamResponse } from '../src'

const ExampleStreamResponse: FC = () => {
  const [content, setContent] = useState('')
  const [streaming, setStreaming] = useState(false)

  const handleStart = () => {
    const text = `这是一个流式响应的示例。
它支持 **Markdown** 格式。

\`\`\`typescript
// 还支持代码高亮
const greeting = "Hello World";
console.log(greeting);
\`\`\`

1. 支持列表
2. 支持代码块
3. 支持打字机效果`
    setContent(text)
    setStreaming(true)
  }

  const handleComplete = () => {
    console.log('流式响应完成')
    setStreaming(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>StreamResponse 示例</h2>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleStart}
          disabled={streaming}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: streaming ? '#e5e7eb' : '#2563eb',
            color: streaming ? '#6b7280' : 'white',
            border: 'none',
            cursor: streaming ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {streaming ? '正在生成...' : '开始流式响应'}
        </button>
      </div>
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '200px',
          background: '#ffffff'
        }}
      >
        <StreamResponse content={content} streaming={streaming} typingSpeed={30} onStop={() => setStreaming(false)} onComplete={handleComplete} />
      </div>
    </div>
  )
}

const App: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      role: 'assistant',
      timestamp: Date.now()
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (message: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])

    // 如果消息是 "flow"，使用流式响应
    if (message.toLowerCase() === 'flow') {
      const streamingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `这是一个流式响应的示例。
它支持 **Markdown** 格式。

\`\`\`typescript
// 还支持代码高亮
const greeting = "Hello World";
console.log(greeting);
\`\`\`

1. 支持列表
2. 支持代码块
3. 支持打字机效果`,
        role: 'assistant',
        timestamp: Date.now(),
        streaming: true
      }
      setMessages(prev => [...prev, streamingMessage])

      // 模拟流式响应完成
      setTimeout(() => {
        setMessages(prev => prev.map(msg => (msg.id === streamingMessage.id ? { ...msg, streaming: false } : msg)))
      }, 6000) // 根据内容长度和打字速度调整
      return
    }

    // 其他消息保持原有的处理方式
    setLoading(true)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `You said: ${message}`,
        role: 'assistant',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        padding: '20px',
        boxSizing: 'border-box',
        background: '#f8fafc'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '600px',
          margin: '0 auto',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <AIChat messages={messages} onSend={handleSend} loading={loading} placeholder='Type your message...' />
      </div>

      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <ExampleStreamResponse />
      </div>
    </div>
  )
}

export default App

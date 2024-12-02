import { FC, useState } from 'react'
import { AIChat, Message } from '../src'

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

    // 模拟加载
    setLoading(true)

    // 模拟AI响应
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
        alignItems: 'center',
        justifyContent: 'center',
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
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <AIChat messages={messages} onSend={handleSend} loading={loading} placeholder='Type your message...' />
      </div>
    </div>
  )
}

export default App

import { FC } from 'react'
import { Message } from './types'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import './styles/index.css'

export interface AIChatProps {
  /** Messages to display */
  messages: Message[]
  /** Callback when user sends a message */
  onSend: (message: string) => void | Promise<void>
  /** Callback when user wants to stop response */
  onStop?: () => void
  /** Loading state */
  loading?: boolean
  /** Custom message renderer */
  messageRenderer?: (message: Message) => React.ReactNode
  /** Custom class name */
  className?: string
  /** Placeholder for input */
  placeholder?: string
  /** Disable input when loading */
  disableWhileLoading?: boolean
  /** Custom input area height */
  inputHeight?: number | string
  /** Max input length */
  maxLength?: number
}

export const AIChat: FC<AIChatProps> = ({ messages, onSend, onStop, loading = false, messageRenderer, className = '', placeholder, disableWhileLoading, inputHeight, maxLength }) => {
  return (
    <div className={`ai-chat ${className}`.trim()}>
      <MessageList messages={messages} loading={loading} messageRenderer={messageRenderer} autoScroll />
      <ChatInput onSend={onSend} onStop={onStop} loading={loading} placeholder={placeholder} disableWhileLoading={disableWhileLoading} height={inputHeight} maxLength={maxLength} />
    </div>
  )
}

// 导出类型和子组件
export type { Message } from './types'
export { MessageItem } from './components/MessageItem'
export { MessageList } from './components/MessageList'
export { ChatInput } from './components/ChatInput'

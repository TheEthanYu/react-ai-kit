// 单条消息组件

import { FC, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Message } from '../types'
import { StreamResponse } from '../../StreamResponse'

export interface MessageItemProps {
  /** 消息数据 */
  message: Message
  /** 自定义类名 */
  className?: string
  /** 是否显示时间 */
  showTime?: boolean
  /** 自定义渲染器 */
  customRenderer?: (message: Message) => React.ReactNode
}

export const MessageItem: FC<MessageItemProps> = ({ message, className = '', showTime = true, customRenderer }) => {
  // 如果有自定义渲染器，使用自定义渲染
  if (customRenderer) {
    return <>{customRenderer(message)}</>
  }

  const messageClass = useMemo(() => {
    const baseClass = 'ai-chat-message'
    const roleClass = `${baseClass}--${message.role}`
    const statusClass = message.status ? `${baseClass}--${message.status}` : ''
    return `${baseClass} ${roleClass} ${statusClass} ${className}`.trim()
  }, [message.role, message.status, className])

  const formattedTime = useMemo(() => {
    if (!showTime) return null
    const date = new Date(message.timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }, [message.timestamp, showTime])

  return (
    <div className={messageClass}>
      <div className='ai-chat-message__content'>
        {message.streaming ? (
          <StreamResponse
            content={message.content}
            streaming={true}
            typingSpeed={30}
            onComplete={() => {
              // 可以在这里处理流式响应完成的逻辑
            }}
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
      {message.error && <div className='ai-chat-message__error'>{message.error}</div>}
      {showTime && <div className='ai-chat-message__time'>{formattedTime}</div>}
    </div>
  )
}

// 消息列表组件

import { FC, useEffect, useRef } from 'react'
import { Message } from '../types'
import { MessageItem } from './MessageItem'

export interface MessageListProps {
  /** 消息列表 */
  messages: Message[]
  /** 自定义类名 */
  className?: string
  /** 是否显示时间 */
  showTime?: boolean
  /** 自定义消息渲染器 */
  messageRenderer?: (message: Message) => React.ReactNode
  /** 是否自动滚动到底部 */
  autoScroll?: boolean
  /** 加载状态 */
  loading?: boolean
}

export const MessageList: FC<MessageListProps> = ({ messages, className = '', showTime = true, messageRenderer, autoScroll = true, loading = false }) => {
  const listRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll && listRef.current) {
      const element = listRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [messages, autoScroll])

  return (
    <div className={`ai-chat-message-list ${className}`.trim()} ref={listRef}>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} showTime={showTime} customRenderer={messageRenderer} />
      ))}
      {loading && (
        <div className='ai-chat-message-list__loading'>
          <div className='ai-chat-message-list__loading-dots'>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  )
}

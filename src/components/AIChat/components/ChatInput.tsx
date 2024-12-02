// 输入框组件

import { FC, KeyboardEvent, useCallback, useRef, useState } from 'react'

export interface ChatInputProps {
  /** 发送消息回调 */
  onSend: (message: string) => void | Promise<void>
  /** 停止生成回调 */
  onStop?: () => void
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  /** 输入框占位符 */
  placeholder?: string
  /** 自定义类名 */
  className?: string
  /** 输入框高度 */
  height?: number | string
  /** 最大长度 */
  maxLength?: number
  /** 是否在加载时禁用 */
  disableWhileLoading?: boolean
}

export const ChatInput: FC<ChatInputProps> = ({ onSend, onStop, loading = false, disabled = false, placeholder = 'Type a message...', className = '', height = 'auto', maxLength, disableWhileLoading = true }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (maxLength && value.length > maxLength) return
      setMessage(value)
    },
    [maxLength]
  )

  const handleSend = useCallback(async () => {
    if (!message.trim() || (disableWhileLoading && loading) || disabled) return
    try {
      await onSend(message.trim())
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [message, onSend, loading, disabled, disableWhileLoading])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Windows 用 Ctrl，Mac 用 Command
      const isSendKey = (e.ctrlKey || e.metaKey) && e.key === 'Enter'

      if (isSendKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return (
    <div className={`ai-chat-input ${className}`.trim()}>
      <textarea ref={textareaRef} value={message} onChange={handleInput} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled || (disableWhileLoading && loading)} style={{ height }} className='ai-chat-input__textarea' />
      <div className='ai-chat-input__actions'>
        {loading && onStop && (
          <button onClick={onStop} className='ai-chat-input__stop' type='button'>
            Stop
          </button>
        )}
        <button onClick={handleSend} disabled={!message.trim() || (disableWhileLoading && loading) || disabled} className='ai-chat-input__send' type='button'>
          Send
        </button>
      </div>
    </div>
  )
}

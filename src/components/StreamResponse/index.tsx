import { FC, useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import './styles/index.css'

export interface StreamResponseProps {
  /** 流式内容 */
  content: string
  /** 是否正在流式输出 */
  streaming?: boolean
  /** 打字速度(ms) */
  typingSpeed?: number
  /** 自定义类名 */
  className?: string
  /** 停止流式输出的回调 */
  onStop?: () => void
  /** 流式输出完成的回调 */
  onComplete?: () => void
}

export const StreamResponse: FC<StreamResponseProps> = ({ content, streaming = false, typingSpeed = 30, className = '', onStop, onComplete }) => {
  const [displayContent, setDisplayContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const contentRef = useRef(content)
  const streamingRef = useRef(streaming)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // 更新引用值
  useEffect(() => {
    contentRef.current = content
    streamingRef.current = streaming
  }, [content, streaming])

  // 处理流式输出
  useEffect(() => {
    if (!streaming) {
      setDisplayContent(content)
      setIsTyping(false)
      return
    }

    // 重置显示内容
    setDisplayContent('')
    setIsTyping(true)
    let currentIndex = 0
    const chars = content.split('') // 将内容分割成字符数组

    const typeNextChar = () => {
      if (!streamingRef.current || currentIndex >= chars.length) {
        setIsTyping(false)
        onComplete?.()
        return
      }

      const nextChar = chars[currentIndex]
      setDisplayContent(prev => prev + nextChar)
      currentIndex++

      if (currentIndex < chars.length) {
        timerRef.current = setTimeout(typeNextChar, typingSpeed)
      } else {
        onComplete?.()
      }
    }

    // 开始打字效果
    timerRef.current = setTimeout(typeNextChar, typingSpeed)

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [content, streaming, typingSpeed, onComplete])

  // 处理停止
  const handleStop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setDisplayContent(contentRef.current)
    setIsTyping(false)
    onStop?.()
  }

  return (
    <div className={`stream-response ${className}`.trim()}>
      <div className={`stream-response__content ${isTyping ? 'typing' : ''}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {displayContent || ' '}
        </ReactMarkdown>
      </div>
      {streaming && onStop && (
        <button onClick={handleStop} className='stream-response__stop' type='button' aria-label='Stop generating'>
          Stop
        </button>
      )}
    </div>
  )
}

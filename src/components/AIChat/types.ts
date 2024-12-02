export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system' // 添加 system 类型
  timestamp: number
  status?: 'sending' | 'sent' | 'error' // 添加消息状态
  error?: string // 错误信息
}

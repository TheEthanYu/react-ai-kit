export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
  error?: string
  streaming?: boolean
}

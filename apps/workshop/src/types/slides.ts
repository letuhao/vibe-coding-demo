export interface SlideData {
    id: string
    type: 'title' | 'content' | 'demo' | 'code' | 'summary'
    title?: string
    subtitle?: string
    content?: string[]
    code?: string
    tech?: string[]
    highlight?: string
}

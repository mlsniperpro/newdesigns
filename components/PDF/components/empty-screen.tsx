import { UseChatHelpers } from 'ai/react'
export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
         Welcome to VionikoAI PDF chat
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          It is so simple as uploading your pdf and chatting over them{' '}
        </p>
      </div>
    </div>
  )
}

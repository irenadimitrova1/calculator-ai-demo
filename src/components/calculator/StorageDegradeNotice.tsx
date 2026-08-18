import { Button } from '@/components/ui/button'

const NOTICE_MESSAGE =
  "History and memory won't be saved after you refresh this page."

type StorageDegradeNoticeProps = {
  onDismiss: () => void
}

export function StorageDegradeNotice({ onDismiss }: StorageDegradeNoticeProps) {
  return (
    <div
      className="mb-2 flex items-start justify-between gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
      role="status"
    >
      <p>{NOTICE_MESSAGE}</p>
      <Button
        aria-label="Dismiss notice"
        className="h-auto shrink-0 px-2 py-0 text-muted-foreground"
        onClick={onDismiss}
        size="sm"
        type="button"
        variant="ghost"
      >
        ×
      </Button>
    </div>
  )
}

export { NOTICE_MESSAGE }

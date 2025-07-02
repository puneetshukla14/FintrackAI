let eventTarget: EventTarget | null = null

if (typeof window !== 'undefined') {
  eventTarget = new EventTarget()
}

export const triggerHeaderUpdate = () => {
  eventTarget?.dispatchEvent(new Event('update-header'))
}

export const onHeaderUpdate = (callback: () => void) => {
  if (!eventTarget) return () => {}
  eventTarget.addEventListener('update-header', callback)
  return () => eventTarget?.removeEventListener('update-header', callback)
}

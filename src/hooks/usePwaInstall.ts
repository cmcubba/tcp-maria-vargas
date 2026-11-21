import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function detectPlatform() {
  const ua = window.navigator.userAgent
  const isTouchMac = /macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1
  const isIos = /iphone|ipad|ipod/i.test(ua) || isTouchMac
  const isAndroid = /android/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome|chromium|edg|opr|android/i.test(ua)

  return { isIos, isAndroid, isSafari }
}

export function usePwaInstall() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)
  const platform = detectPlatform()

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }

    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayMode = () => setInstalled(isStandalone())

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    media.addEventListener?.('change', onDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener?.('change', onDisplayMode)
    }
  }, [])

  const promptInstall = async () => {
    if (!promptEvent) return false
    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    if (choice.outcome === 'accepted') {
      setInstalled(true)
    }
    setPromptEvent(null)
    return choice.outcome === 'accepted'
  }

  return { canInstall: Boolean(promptEvent), installed, ...platform, promptInstall }
}

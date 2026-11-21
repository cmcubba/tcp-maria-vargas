import { useState } from 'react'
import { Download, Share, Smartphone } from 'lucide-react'
import { usePwaInstall } from '../../hooks/usePwaInstall'

export function InstallAppButton({ compact = false }: { compact?: boolean }) {
  const { canInstall, installed, isIos, isAndroid, isSafari, promptInstall } = usePwaInstall()
  const [showHelp, setShowHelp] = useState(false)

  if (installed) return null

  const handleClick = async () => {
    if (canInstall) {
      const accepted = await promptInstall()
      if (accepted) return
    }
    setShowHelp((value) => !value)
  }

  const help = isIos
    ? 'En iPhone o iPad: toca Compartir y elige «Añadir a pantalla de inicio».'
    : isAndroid
      ? 'En Chrome: abre el menú ⋮ y elige «Instalar aplicación» o «Añadir a pantalla de inicio».'
      : isSafari
        ? 'En Safari: usa Compartir y elige «Añadir al Dock» o «Añadir a pantalla de inicio».'
        : 'En Chrome o Edge: pulsa el icono de instalar en la barra de direcciones o abre el menú ⋮ → «Instalar TCP Maria Vargas».'

  return (
    <div className="install-app">
      <button
        type="button"
        className={compact ? 'install-app__btn install-app__btn--compact' : 'install-app__btn'}
        onClick={handleClick}
      >
        {compact ? <Smartphone size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
        Instalar app
      </button>
      {showHelp && (
        <p className="install-app__hint">
          {isIos && <Share size={13} aria-hidden="true" />} {help}
        </p>
      )}
    </div>
  )
}

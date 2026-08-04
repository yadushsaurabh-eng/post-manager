import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts = []) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, action }) => {
        const isCtrlPressed = ctrlKey ? event.ctrlKey || event.metaKey : true;
        const isShiftPressed = shiftKey ? event.shiftKey : !event.shiftKey;
        const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();

        if (isKeyMatch && isCtrlPressed && isShiftPressed) {
          event.preventDefault();
          action(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}


export function notifyAlertsChanged() {
  window.dispatchEvent(new Event('alerts:refresh'))
}

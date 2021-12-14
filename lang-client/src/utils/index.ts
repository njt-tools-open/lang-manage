export function enableDarkMode(): void {
  document.documentElement.classList.add('wlc-dark');
}

export function disableDarkMode(): void {
  document.documentElement.classList.remove('wlc-dark');
}

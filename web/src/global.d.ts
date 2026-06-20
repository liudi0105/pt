import '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string
    menuCode?: string
    menuIcon?: string
    menuSort?: number
  }
}



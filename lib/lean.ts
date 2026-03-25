const LEAN_APP_ID = process.env.NEXT_PUBLIC_LEAN_APP_ID

export const getLeanConfig = () => ({
  appId: LEAN_APP_ID,
  sandbox: true,
  env: 'sandbox' as const,
})

export const initializeLeanLink = (
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  if (typeof window === 'undefined') return null
  
  const config = getLeanConfig()
  
  return {
    ...config,
    callback: onSuccess,
    onClose: () => console.log('Lean Link closed'),
    onError: onError,
  }
}

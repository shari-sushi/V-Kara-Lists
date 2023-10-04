// index.d.ts
type AccessControlType = 'replace' | 'push';
type AccessControlFallback = { type: AccessControlType; destination: string }
type GetAccessControl = () =>
  | null
  | AccessControlFallback
  | Promise<null | AccessControlFallback>
type WithGetAccessControl<P> = P & {
  getAccessControl?: GetAccessControl
}
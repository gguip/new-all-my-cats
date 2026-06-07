// IntersectionObserver polyfill for jsdom. Tests grab instances via globalThis.__IO__.
class IO {
  cb: (entries: { isIntersecting: boolean }[]) => void
  static instances: IO[] = []
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    this.cb = cb
    IO.instances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  trigger(isIntersecting = true) {
    this.cb([{ isIntersecting }])
  }
}
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
;(globalThis as unknown as { __IO__: typeof IO }).__IO__ = IO

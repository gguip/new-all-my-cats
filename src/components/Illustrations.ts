import { defineComponent, h } from 'vue'

export const LogoMark = defineComponent({
  name: 'LogoMark',
  setup() {
    return () =>
      h('div', { class: 'logo' }, [
        h('span', 'Catastrophe'),
        h('svg', { viewBox: '0 0 40 40', fill: 'currentColor', 'aria-hidden': 'true' }, [
          h('ellipse', { cx: 20, cy: 27, rx: 11, ry: 9 }),
          h('ellipse', { cx: 8.5, cy: 17, rx: 4.2, ry: 5 }),
          h('ellipse', { cx: 16, cy: 10, rx: 4.2, ry: 5 }),
          h('ellipse', { cx: 24, cy: 10, rx: 4.2, ry: 5 }),
          h('ellipse', { cx: 31.5, cy: 17, rx: 4.2, ry: 5 }),
        ]),
      ])
  },
})

export const PawPrint = defineComponent({
  name: 'PawPrint',
  props: { size: { type: Number, default: 34 } },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size, viewBox: '0 0 40 40', class: 'pawprint', 'aria-hidden': 'true', fill: 'currentColor' }, [
        h('ellipse', { cx: 20, cy: 27, rx: 11, ry: 9 }),
        h('ellipse', { cx: 8.5, cy: 17, rx: 4.2, ry: 5 }),
        h('ellipse', { cx: 16, cy: 10, rx: 4.2, ry: 5 }),
        h('ellipse', { cx: 24, cy: 10, rx: 4.2, ry: 5 }),
        h('ellipse', { cx: 31.5, cy: 17, rx: 4.2, ry: 5 }),
      ])
  },
})

export const PawPad = defineComponent({
  name: 'PawPad',
  props: {
    fur: { type: String, default: '#2f2f2f' },
    pad: { type: String, default: '#f4c0c8' },
    size: { type: Number, default: 130 },
  },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size * 1.18, viewBox: '0 0 120 142', 'aria-hidden': 'true' }, [
        h('rect', { x: 36, y: 104, width: 48, height: 44, rx: 22, fill: props.fur }),
        h('path', { fill: props.fur, d: 'M60 14c26 0 44 20 44 50 0 28-20 46-44 46S16 92 16 64 34 14 60 14Z' }),
        h('path', { fill: props.pad, d: 'M60 64c16 0 26 12 26 24 0 14-12 20-26 20S34 102 34 88c0-12 10-24 26-24Z' }),
        h('ellipse', { cx: 31, cy: 56, rx: 8.5, ry: 11, fill: props.pad }),
        h('ellipse', { cx: 49, cy: 42, rx: 9, ry: 12, fill: props.pad }),
        h('ellipse', { cx: 71, cy: 42, rx: 9, ry: 12, fill: props.pad }),
        h('ellipse', { cx: 89, cy: 56, rx: 8.5, ry: 11, fill: props.pad }),
      ])
  },
})

export const Heart = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names -- intentional single-word illustration name
  name: 'Heart',
  props: { size: { type: Number, default: 26 }, fill: { type: String, default: 'none' } },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size, viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [
        h('path', {
          d: 'M12 21S3.5 14.2 3.5 8.3A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.5 2.3C20.5 14.2 12 21 12 21Z',
          fill: props.fill, stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linejoin': 'round',
        }),
      ])
  },
})

export const IconFacebook = defineComponent({
  name: 'IconFacebook',
  props: { size: { type: Number, default: 18 } },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { transform: 'translate(0 1)', d: 'M14 8h2.5l.5-3.2h-3V3.1c0-.9.3-1.6 1.7-1.6H17V-1.3C16.7-1.4 15.6-1.5 14.4-1.5c-2.6 0-4.4 1.6-4.4 4.5v2H7v3.2h3V22h4Z' }),
      ])
  },
})

export const IconInstagram = defineComponent({
  name: 'IconInstagram',
  props: { size: { type: Number, default: 18 } },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'aria-hidden': 'true' }, [
        h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 5 }),
        h('circle', { cx: 12, cy: 12, r: 4 }),
        h('circle', { cx: 17.4, cy: 6.6, r: 1.1, fill: 'currentColor', stroke: 'none' }),
      ])
  },
})

export const IconTiktok = defineComponent({
  name: 'IconTiktok',
  props: { size: { type: Number, default: 18 } },
  setup(props) {
    return () =>
      h('svg', { width: props.size, height: props.size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { d: 'M16.5 3c.4 2.2 1.8 3.8 4 4.1v2.7c-1.4.1-2.8-.3-4-1v6.3c0 3.2-2.4 5.6-5.5 5.6S5.5 18.3 5.5 15.2c0-3 2.4-5.2 5.4-5.1v2.8c-1.5-.2-2.7.9-2.7 2.3 0 1.5 1.1 2.5 2.5 2.5 1.5 0 2.6-1.1 2.6-2.8V3Z' }),
      ])
  },
})

export const FlagBR = defineComponent({
  name: 'FlagBR',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 28 20', class: 'flag', 'aria-hidden': 'true' }, [
        h('rect', { width: 28, height: 20, rx: 2, fill: '#009b3a' }),
        h('path', { d: 'M14 2.5 25 10 14 17.5 3 10Z', fill: '#fedf00' }),
        h('circle', { cx: 14, cy: 10, r: 3.6, fill: '#002776' }),
      ])
  },
})

export const FlagES = defineComponent({
  name: 'FlagES',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 28 20', class: 'flag', 'aria-hidden': 'true' }, [
        h('defs', [
          h('clipPath', { id: 'flag-es-clip' }, [h('rect', { width: 28, height: 20, rx: 2 })]),
        ]),
        h('g', { 'clip-path': 'url(#flag-es-clip)' }, [
          h('rect', { width: 28, height: 20, fill: '#aa151b' }),
          h('rect', { y: 5, width: 28, height: 10, fill: '#f1bf00' }),
        ]),
      ])
  },
})

export const FlagEN = defineComponent({
  name: 'FlagEN',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 28 20', class: 'flag', 'aria-hidden': 'true' }, [
        h('defs', [
          h('clipPath', { id: 'flag-en-clip' }, [h('rect', { width: 28, height: 20, rx: 2 })]),
        ]),
        h('g', { 'clip-path': 'url(#flag-en-clip)' }, [
          h('rect', { width: 28, height: 20, fill: '#012169' }),
          h('path', { d: 'M0 0 28 20M28 0 0 20', stroke: '#fff', 'stroke-width': 4 }),
          h('path', { d: 'M0 0 28 20M28 0 0 20', stroke: '#c8102e', 'stroke-width': 2 }),
          h('path', { d: 'M14 0V20M0 10H28', stroke: '#fff', 'stroke-width': 6 }),
          h('path', { d: 'M14 0V20M0 10H28', stroke: '#c8102e', 'stroke-width': 3.5 }),
        ]),
      ])
  },
})

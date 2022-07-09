import styled, { css, DefaultTheme, ThemeProps } from 'styled-components'
import t from 'utils/token'

const cssK = 'css' as const
const cssKs: (keyof React.CSSProperties)[] = [
  // flex
  'display',
  'flexDirection',
  'flexWrap',
  'justifyContent',
  'alignItems',
  'alignContent',
  'order',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  // layout
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingLeft',
  'paddingRight',
  'maxWidth',
  'height',
  // other
  'backgroundColor'
]

type CssK = typeof cssK

/**
 * For mobile-1st development
 * "sm" is default, followed by "md" and "lg"
 *
 * For light/dark theme development
 * "light" is default, followed by "dark"
 *
 * For motion transition development
 * "idle" is default, followed by "motion"
 *
 * All keys are listed, but they resolve to an undefined media
 * query, so they will be rendered first than the others.
 */
type MediaDefaultKs = 'sm' | 'light' | 'idle'

export type MediaKs = keyof DefaultTheme['media'] | MediaDefaultKs

export type ResponsiveProp<
  V = string | number,
  K extends string = MediaKs
> = Partial<Record<K, V>>

export type StyledCssProp<
  O extends keyof React.CSSProperties = keyof React.CSSProperties
> = Record<
  CssK,
  {
    [K in O]?: React.CSSProperties[K] | ResponsiveProp<React.CSSProperties[K]>
  }
>

export type StyledCssPropWithTheme = StyledCssProp & ThemeProps<DefaultTheme>

function getResponsiveValue(key: string, value?: string | number) {
  return {
    [key]: value
  }
}
function getResponsiveProp(prop: unknown): ResponsiveProp {
  return prop != null ? (typeof prop === 'object' ? prop : { sm: prop }) : {}
}
function getProp<K extends keyof React.CSSProperties>(key: K) {
  return (props: StyledCssPropWithTheme) => {
    const prop = getResponsiveProp(props.css[key])

    return Object.keys(prop).reduce((prev, _curr) => {
      const curr = _curr as Exclude<MediaKs, MediaDefaultKs>

      return css`
        ${prev};
        ${t(curr)} {
          ${getResponsiveValue(key, prop[curr])}
        } ;
      `
    }, {})
  }
}
function generateProps<K extends keyof React.CSSProperties>(array: Array<K>) {
  return array.reduce(
    (prev, curr) =>
      css`
        ${prev};
        ${getProp<K>(curr)};
      `,
    {}
  )
}

const StyledCss = styled.div<StyledCssProp>`
  ${generateProps(cssKs)};
`

StyledCss.displayName = 'StyledCss'
export default StyledCss

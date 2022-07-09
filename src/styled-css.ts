import styled, { css, DefaultTheme, ThemeProps } from 'styled-components'
import t from 'utils/token'

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
> = {
  css?: {
    [K in O]?: React.CSSProperties[K] | ResponsiveProp<React.CSSProperties[K]>
  }
}

export type StyledCssPropWithTheme = StyledCssProp & ThemeProps<DefaultTheme>

const getPropValue = (key: string, value?: string | number) => ({
  [key]: value
})
const getPropKey = (prop: unknown): ResponsiveProp =>
  prop != null ? (typeof prop === 'object' ? prop : { sm: prop }) : {}
const getResponsiveProps =
  (key: keyof React.CSSProperties) => (props: StyledCssPropWithTheme) => {
    const prop = getPropKey((props.css || {})[key])

    return Object.keys(prop).reduce((prev, _curr) => {
      const curr = _curr as Exclude<MediaKs, MediaDefaultKs>

      return css`
        ${prev};
        ${t(curr)} {
          ${getPropValue(key, prop[curr])}
        } ;
      `
    }, {})
  }
const generateProps = () => (props: StyledCssPropWithTheme) =>
  Object.keys(props.css || {}).reduce((prev, _curr) => {
    const ks = _curr as keyof React.CSSProperties

    return css`
      ${prev};
      ${getResponsiveProps(ks)};
    `
  }, {})

const StyledCss = styled.div<StyledCssProp>`
  ${generateProps};
`

StyledCss.displayName = 'StyledCss'
export default StyledCss

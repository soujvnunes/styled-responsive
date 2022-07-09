import styled, { css, DefaultTheme, ThemeProps } from 'styled-components'

const mediaDefaultK = 'DEFAULT' as const

type MediaDefaultK = typeof mediaDefaultK

export type MediaKs = keyof DefaultTheme['media'] | MediaDefaultK

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

let valueByMedia = {
  DEFAULT: {},
  md: {},
  lg: {},
  dark: {},
  motion: {}
} as const
const mergeObjValueByMedia = (prop: string, value: ResponsiveProp) => {
  Object.keys(value).forEach((_key) => {
    const key = _key as MediaKs

    valueByMedia = {
      ...valueByMedia,
      [key]: {
        ...valueByMedia[key],
        [prop]: value[key]
      }
    }
  })

  return valueByMedia
}
const convertStrValueToObj = (prop: unknown): ResponsiveProp =>
  prop != null
    ? typeof prop === 'object'
      ? prop
      : { [mediaDefaultK]: prop }
    : {}
const getResponsiveProps =
  (key: typeof valueByMedia) => (props: StyledCssPropWithTheme) =>
    Object.keys(key).reduce((prev, _curr) => {
      const curr = _curr as Exclude<MediaKs, MediaDefaultK>
      const mediaContent = key[curr]

      return css`
        ${prev};
        ${mediaContent ? props.theme.media[curr] : ''} {
          ${mediaContent}
        } ;
      `
    }, {})

let keys = {}
const generateProps = () => (props: StyledCssPropWithTheme) => {
  Object.keys(props.css || {}).forEach((_curr) => {
    const curr = _curr as keyof React.CSSProperties
    const key = convertStrValueToObj((props.css || {})[curr])

    keys = mergeObjValueByMedia(curr, key)
  }, {})

  return css`
    ${getResponsiveProps(keys)};
  `
}

const StyledCss = styled.div<StyledCssProp>`
  ${generateProps};
`

StyledCss.displayName = 'StyledCss'
export default StyledCss

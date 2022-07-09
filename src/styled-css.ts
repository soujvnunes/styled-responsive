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

let valueByMedia: ResponsiveProp<object> = {}
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
const resolveResponsiveProps =
  (key: ResponsiveProp) => (props: StyledCssPropWithTheme) => {
    return Object.keys(key).reduce((prev, _curr) => {
      const curr = _curr as Exclude<MediaKs, MediaDefaultK>

      return css`
        ${prev};
        ${props.theme.media[curr]} {
          ${key[curr]};
        }
      `
    }, {})
  }
const resolveProps = (props: StyledCssPropWithTheme) => {
  let propsByMedia = {}

  Object.keys(props.css || {}).forEach((_curr) => {
    const curr = _curr as keyof React.CSSProperties
    const key = convertStrValueToObj((props.css || {})[curr])

    propsByMedia = mergeObjValueByMedia(curr, key)
  })

  return css`
    ${resolveResponsiveProps(propsByMedia)};
  `
}

const StyledCss = styled.div<StyledCssProp>(resolveProps)

StyledCss.displayName = 'StyledCss'
export default StyledCss

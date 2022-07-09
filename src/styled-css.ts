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
  css: {
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
const convertStrValueByMedia = (prop: unknown): ResponsiveProp =>
  prop != null
    ? typeof prop === 'object'
      ? prop
      : { [mediaDefaultK]: prop }
    : {}
const styledCss = () => (props: StyledCssPropWithTheme) => {
  valueByMedia = {}
  let propsWithValueByMedia = {}
  let propsWithKeyByMedia = {}

  for (const keyUntyped of Object.keys(props.css)) {
    const key = keyUntyped as keyof React.CSSProperties

    propsWithValueByMedia = {
      ...propsWithValueByMedia,
      [key]: convertStrValueByMedia(props.css[key])
    }
  }

  for (const key of Object.keys(propsWithValueByMedia)) {
    propsWithKeyByMedia = {
      ...propsWithKeyByMedia,
      ...mergeObjValueByMedia(key, propsWithValueByMedia[key])
    }
  }

  return Object.keys(propsWithKeyByMedia).reduce((prev, _curr) => {
    const curr = _curr as MediaKs

    return css`
      ${prev};
      ${curr === 'DEFAULT' ? '' : props.theme.media[curr]} {
        ${propsWithKeyByMedia[curr]};
      }
    `
  }, {})
}
const Styled = styled.div`
  ${styledCss}
`

export default Styled

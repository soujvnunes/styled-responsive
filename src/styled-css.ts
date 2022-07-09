import styled, {
  css,
  DefaultTheme,
  InterpolationValue,
  ThemeProps
} from 'styled-components'

export type MediaThemeKs = keyof DefaultTheme['media']

export type MediaKs = MediaThemeKs | 'DEFAULT'

export type ResponsiveProp<
  V = InterpolationValue,
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

function cssObj(key: string, value?: string | number) {
  return {
    [key]: value
  }
}
function styledCss(props: StyledCssPropWithTheme) {
  const template = {
    plain: {},
    media: {}
  }

  for (const keyUntyped in props.css) {
    const key = keyUntyped as keyof React.CSSProperties
    const value = props.css[key]

    if (typeof value !== 'object') {
      template.plain = {
        ...template.plain,
        ...cssObj(key, value)
      }
    } else {
      for (const mediaKeyUntyped in value) {
        const mediaKey = mediaKeyUntyped as MediaKs

        if (mediaKey === 'DEFAULT') {
          template.plain = {
            ...template.plain,
            ...cssObj(key, value[mediaKey])
          }
        } else {
          template.media = {
            ...template.media,
            [mediaKey]: {
              ...(template.media as ResponsiveProp<object>)[mediaKey],
              [key]: value[mediaKey]
            }
          }
        }
      }
    }
  }

  template.media = Object.keys(template.media).reduce((prev, _curr) => {
    const key = _curr as MediaThemeKs

    return css`
      ${prev};
      ${props.theme.media[key]} {
        ${(template.media as ResponsiveProp)[key]};
      }
    `
  }, {})

  return css`
    ${template.plain}
    ${template.media}
  `
}
const Styled = styled.div`
  ${styledCss}
`

export default Styled

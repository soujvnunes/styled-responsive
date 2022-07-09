import styled, {
  css,
  DefaultTheme,
  InterpolationValue,
  ThemeProps
} from 'styled-components'

/*
const Component = styled.div`
  ${scResponsive`
    display: block 'md' flex;
    color: black 'dark' white;
  `}
`;
*/

export type MediaThemeKs = keyof DefaultTheme['media']

export type MediaKs = MediaThemeKs | 'DEFAULT'

export type ResponsiveProp<
  V = InterpolationValue,
  K extends MediaKs = MediaKs
> = Partial<Record<K, V>>

export type StyledCssProps<
  O extends keyof React.CSSProperties = keyof React.CSSProperties
> = {
  css: {
    [K in O]?: React.CSSProperties[K] | ResponsiveProp<React.CSSProperties[K]>
  }
}

const refIniVal = {
  hasRaw: false,
  rawCounter: 0,
  rawTemplate: {},
  template: {}
}

function cssObj<K extends string, V>(key: K, value?: V) {
  return {
    [key]: value
  }
}
function styledCss(props: StyledCssProps & ThemeProps<DefaultTheme>) {
  const ref = refIniVal

  for (const key in props.css) {
    if (Object.prototype.hasOwnProperty.call(props.css, key)) {
      const prop = key as keyof React.CSSProperties
      const value = props.css[prop]

      if (typeof value === 'string') {
        ref.hasRaw = refIniVal.hasRaw
        ref.rawCounter = refIniVal.rawCounter
        ref.template = {
          ...ref.template,
          ...cssObj(prop, value)
        }
      } else if (typeof value === 'object') {
        for (const inKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, inKey)) {
            const mediaKey = inKey as MediaKs
            const rawTemplate = ref.rawTemplate as ResponsiveProp<object>

            if (mediaKey === 'DEFAULT') {
              ref.template = {
                ...ref.template,
                ...cssObj(prop, value[mediaKey])
              }
            } else {
              if (!ref.rawCounter) {
                ref.hasRaw = true
                ref.rawCounter += 1
              }

              ref.rawTemplate = {
                ...ref.rawTemplate,
                [mediaKey]: {
                  ...rawTemplate[mediaKey],
                  [prop]: value[mediaKey]
                }
              }
            }
          }
        }
      }
    }
  }

  if (ref.hasRaw) {
    for (const key in ref.rawTemplate) {
      if (Object.prototype.hasOwnProperty.call(ref.rawTemplate, key)) {
        const mediaThemeKey = key as MediaThemeKs
        const rawTemplate = ref.rawTemplate as ResponsiveProp

        ref.template = {
          ...ref.template,
          [props.theme.media[mediaThemeKey]]: rawTemplate[mediaThemeKey]
        }
        delete rawTemplate[mediaThemeKey]
      }
    }
  }

  return css`
    ${ref.template}
  `
}

export default styled.div`
  ${styledCss}
`

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
function styledCss(args: StyledCssProps) {
  const ref = refIniVal

  for (const keyUntyped in args.css) {
    if (Object.prototype.hasOwnProperty.call(args.css, keyUntyped)) {
      const key = keyUntyped as keyof React.CSSProperties
      const value = args.css[key]

      if (typeof value === 'string') {
        ref.hasRaw = refIniVal.hasRaw
        ref.rawCounter = refIniVal.rawCounter
        ref.template = {
          ...ref.template,
          ...cssObj(key, value)
        }
      } else if (typeof value === 'object') {
        for (const mediaKeyUntyped in value) {
          if (Object.prototype.hasOwnProperty.call(value, mediaKeyUntyped)) {
            const mediaKey = mediaKeyUntyped as MediaKs

            if (mediaKey === 'DEFAULT') {
              ref.template = {
                ...ref.template,
                ...cssObj(key, value[mediaKey])
              }
            } else {
              if (!ref.rawCounter) {
                ref.hasRaw = true
                ref.rawCounter += 1
              }

              ref.rawTemplate = {
                ...ref.rawTemplate,
                [mediaKey]: {
                  ...(ref.rawTemplate as ResponsiveProp<object>)[mediaKey],
                  [key]: value[mediaKey]
                }
              }
            }
          }
        }
      }
    }
  }

  if (ref.hasRaw) {
    ref.template = Object.keys(ref.rawTemplate).reduce((prev, _curr) => {
      const key = _curr as MediaThemeKs

      return css`
        ${prev};
        ${(props: ThemeProps<DefaultTheme>) => props.theme.media[key]} {
          ${(ref.rawTemplate as ResponsiveProp)[key]};
        }
      `
    }, ref.template)
  }

  return css`
    ${ref.template}
  `
}

export default styled.div`
  ${styledCss}
`

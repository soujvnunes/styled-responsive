import styled, {
  DefaultTheme,
  InterpolationValue,
  ThemeProps
} from 'styled-components'

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

function cssObj<K extends string, V>(key: K, value?: V) {
  return {
    [key]: value
  }
}
export function styledCss(props: StyledCssProps & ThemeProps<DefaultTheme>) {
  const ref = {
    hasRaw: false,
    rawCounter: 0,
    rawTemplate: {},
    template: {}
  }

  for (const key in props.css) {
    if (Object.prototype.hasOwnProperty.call(props.css, key)) {
      const prop = key as keyof React.CSSProperties
      const value = props.css[prop]

      if (typeof value === 'string') {
        ref.template = {
          ...ref.template,
          ...cssObj(prop, value)
        }
      } else if (typeof value === 'object') {
        for (const subKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, subKey)) {
            const mediaKey = subKey as MediaKs
            const rawTemplate = ref.rawTemplate as ResponsiveProp<object>
            const subValue = cssObj(prop, value[mediaKey])

            if (mediaKey === 'DEFAULT') {
              ref.template = {
                ...ref.template,
                ...subValue
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
                  ...subValue
                }
              }
            }
          }
        }
      }
    }
  }

  if (ref.rawCounter && ref.hasRaw) {
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

  return ref.template
}

export default styled.div`
  ${styledCss}
`

import { DefaultTheme, InterpolationValue, ThemeProps } from 'styled-components'

export type MediaThemeKs = keyof DefaultTheme['media']

export type MediaKs = MediaThemeKs | 'DEFAULT'

export type ResponsiveProps<
  O extends object,
  T extends DefaultTheme = DefaultTheme
> = ThemeProps<T> & O

/**
 * Responsive usage, like media or pseudo-class, through
 * raw detection.
 *
 * \"@<media>\"
 * \":<pseudo-class>\"
 * \"@<media>:<pseudo-class>\"
 * \"@<media>@<media>:<pseudo-class>:<pseudo-class>\"
 */
const REGEX_RESPONSIVE_KS = new RegExp(/([\\"'])([@:].+?)+?\1/g)
/**
 * Start/end of line on object-CSS.
 *
 *                     ;\n
 * \n   property: value;\n
 * \n   property
 */
const REGEX_CSSOBJECT_LINE = new RegExp(
  /\n\s+(?=\w+)(?!\w+;{1})|(?<=;)[\n\s+]/gm
)
/**
 * Voids.
 *
 * something\n    something
 */
const REGEX_VOID = new RegExp(/\n\s+(?=.*)/)

function hasResponsiveKs(arg: string) {
  return arg.match(REGEX_RESPONSIVE_KS)
}
function styledResponsive<
  O extends object,
  P extends ResponsiveProps<O> = ResponsiveProps<O>
>(
  _stylesArray: TemplateStringsArray,
  ...interpolations: ((props: P) => InterpolationValue)[]
) {
  return (props: P) => {
    const styles = {
      array: [..._stylesArray],
      object: {}
    }

    /**
     * Looks for interpolations to be resolved and merged
     * into a template string array.
     */
    if (Array.isArray(interpolations)) {
      for (const interpolation of interpolations) {
        const isFn = typeof interpolation === 'function'
        const fnr = isFn ? interpolation(props) : interpolation
        const fni = interpolations.indexOf(interpolation)

        styles.array = [styles.array[0] + fnr + _stylesArray[fni + 1]]
      }
    }

    /**
     * Looks for responsive usages to be splitted, extracted
     * and removed, but being trated on the raw object style.
     * Merged on the string one later.
     */
    if (
      !Object.is(_stylesArray[0], styles.array[0]) &&
      hasResponsiveKs(styles.array[0])?.length
    ) {
      const stylesArray = styles.array[0]
        .split(REGEX_CSSOBJECT_LINE)
        .filter(Boolean)
        .map((style) => style.replace(REGEX_VOID, ' '))

      for (const style of stylesArray) {
        console.log(style, hasResponsiveKs(style))
      }
    }

    return styles.array
  }
}

export default styledResponsive

import {
  DefaultTheme,
  InterpolationValue,
  ThemeProps,
} from "styled-components";

export type MediaThemeKs = keyof DefaultTheme["media"];

export type MediaKs = MediaThemeKs | "DEFAULT";

export type ResponsiveProps<
  O extends object,
  T extends DefaultTheme = DefaultTheme
> = ThemeProps<T> & O;
export type ResponsiveInterpolationProps<
  O extends object,
  T extends DefaultTheme = DefaultTheme,
  V extends InterpolationValue = InterpolationValue
> = (props: ResponsiveProps<O, T>) => V;

/**
 * Responsive usage, like media or pseudo-class, through
 * raw detection.
 *
 * \"@<media>\"
 * \":<pseudo-class>\"
 * \"@<media>:<pseudo-class>\"
 * \"@<media>@<media>:<pseudo-class>:<pseudo-class>\"
 */
const REGEX_RESPONSIVE_KS = new RegExp(/([\\"'])([@:].+?)+?\1/g);
/**
 * Start/end of line on object-CSS.
 *
 *                     ;\n
 * \n   property: value;\n
 * \n   property
 */
const REGEX_CSSOBJECT_LINE = new RegExp(/\n\s+(?=\w+)(?!\w+;)|(?<=;)[\n\s+]/gm);
/**
 * Voids.
 *
 * something\n    something;
 */
const REGEX_VOID = new RegExp(/\n\s+(?=.*)|;/g);
/**
 * Colon between dashed/non-dashed word with at least
 * one space after it.
 *
 * property-name: value
 */
const REGEX_COLON = new RegExp(/(?<=\w+\p{Pd}*\w+):(?=\s+)/u);
const REGEX_BRACES = new RegExp(/(?<=\}).|.(?=\{)/gs);
const REGEX_BRACES_OR_COLONS = new RegExp(
  /(?<=\w+\p{Pd}*\w+):(?=\s+)|(?<=\}).|.(?=\{)/gsu
);

function hasResponsiveKs(arg: string) {
  return arg.match(REGEX_RESPONSIVE_KS);
}
function styledResponsive<
  O extends object,
  P extends ResponsiveProps<O> = ResponsiveProps<O>,
  A extends TemplateStringsArray = TemplateStringsArray
>(
  _stylesArray: A,
  ...interpolations: Array<ResponsiveInterpolationProps<O>> | A
) {
  return (props: P) => {
    const styles = {
      array: [..._stylesArray],
      object: {},
    };

    /**
     * Looks for interpolations to be resolved and merged
     * into a template string array.
     */
    if (Array.isArray(interpolations)) {
      styles.array = [
        interpolations.reduce((template, _interpolation, index) => {
          const interpolation =
            typeof _interpolation === "function"
              ? _interpolation(props)
              : _interpolation;

          return template + interpolation + _stylesArray[index + 1];
        }, _stylesArray[0]),
      ];
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
      console.log(
        styles.array[0],
        styles.array[0]
          .split(REGEX_CSSOBJECT_LINE)
          .map((style) =>
            style.replace(REGEX_VOID, " ").split(REGEX_BRACES_OR_COLONS)
          )
          .flat(Infinity)
          .filter(Boolean)
      );
    }

    return styles.array;
  };
}

export default styledResponsive;

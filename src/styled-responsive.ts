import { DefaultTheme, InterpolationValue, ThemeProps } from 'styled-components'

// This:
/**
const Button = styled.button`
  display: block "@md" flex;
  padding: ${sxs.space(1, 2)};
  color: rgb(0 0 0 / 1)
    ":hover" rgb(0 0 0 / 0.6)
    "@dark" rgb(255 255 255 / 1)
    "@dark:hover" rgb(255 255 255 / 0.6);
`;
*/
// Equals:
/**
.JuhImL {
  display: block;
  padding: 1rem 2rem;
  color: rgb(0 0 0 / 1);
}

.JuhImL:hover {
  color: rgb(0 0 0 / 0.6);
}

@media screen and (min-width: 640px) {
  .JuhImL {
    display: flex;
  }
}

@media screen and (prefers-color-scheme: dark) {
  .JuhImL {
    color: rgb(255 255 255 / 1);
  }

  .JuhImL:hover {
    color: rgb(255 255 255 / 0.6);
  }
}
*/

export type MediaThemeKs = keyof DefaultTheme['media']

export type MediaKs = MediaThemeKs | 'DEFAULT'

export type ResponsiveProp<
  V = InterpolationValue,
  K extends MediaKs = MediaKs
> = Partial<Record<K, V>>

export type StyledResponsiveProps<
  O extends keyof React.CSSProperties = keyof React.CSSProperties
> = {
  [K in O]?: React.CSSProperties[K] | ResponsiveProp<React.CSSProperties[K]>
}

/* function cssObj<K extends string, V>(key: K, value?: V) {
  return {
    [key]: value, 
  };
} */

const REGEX_QUOTED_MEDIA_OR_PSEUDO = new RegExp(/(["'])(@|:)(.+?)\1/g)
const REGEX_SEMICOLON_NEWLINE_SPACE = new RegExp(/\n\s+(?=\w)|(?<=;)[\n\s+]/gm)

const StyledResponsive =
  <P extends object>(
    _sxs: TemplateStringsArray,
    ...fns: ((props: P) => void)[]
  ) =>
  (props: P & ThemeProps<DefaultTheme>) => {
    const ref = {
      sxs: [..._sxs]
    }

    /**
     * Resolves interpolations and merge into a template string
     */
    if (Array.isArray(fns)) {
      ref.sxs[0] = fns.reduce((acc, _fn, index) => {
        const isFn = typeof _fn === 'function'
        const fn = isFn ? _fn(props) : _fn

        return acc + fn + _sxs[index + 1]
      }, _sxs[0])

      /**
       * Looks for at least one "@<media>", ":<pseudo-class>" or
       * both (@dark:hover i.e) to split and reorganize it.
       */
      if (REGEX_QUOTED_MEDIA_OR_PSEUDO.test(ref.sxs[0])) {
        const sx = ref.sxs[0]
          .split(REGEX_SEMICOLON_NEWLINE_SPACE)
          .filter(Boolean)

        console.log(ref.sxs[0], sx)
      }
    }

    return ref.sxs
  }

export default StyledResponsive

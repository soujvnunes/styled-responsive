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

export type ResponsiveProps<
  O extends object,
  T extends DefaultTheme = DefaultTheme
> = ThemeProps<T> & O

const REGEX_QUOTED_MEDIA_OR_PSEUDO = new RegExp(/(["'])(@|:)(.+?)\1/g)
const REGEX_SEMICOLON_NEWLINE_SPACE = new RegExp(/\n\s+(?=\w)|(?<=;)[\n\s+]/gm)

const responsive =
  <O extends object, P extends ResponsiveProps<O> = ResponsiveProps<O>>(
    _sxs: TemplateStringsArray,
    ...fns: ((props: P) => InterpolationValue)[]
  ) =>
  (props: P) => {
    const ref = {
      sxs: [..._sxs]
    }

    /**
     * Resolves interpolations and merge into a template string
     */
    if (Array.isArray(fns)) {
      for (const fn of fns) {
        const isFn = typeof fn === 'function'
        const fnr = isFn ? fn(props) : fn
        const fni = fns.indexOf(fn)

        ref.sxs = [ref.sxs[0] + fnr + _sxs[fni + 1]]
      }
    }

    /**
     * Looks for at least one "@<media>", ":<pseudo-class>" or
     * both (@dark:hover i.e) to split and reorganize it.
     */
    if (
      !Object.is(_sxs[0], ref.sxs[0]) &&
      REGEX_QUOTED_MEDIA_OR_PSEUDO.test(ref.sxs[0])
    ) {
      const sx = ref.sxs[0].split(REGEX_SEMICOLON_NEWLINE_SPACE).filter(Boolean)

      console.log(ref.sxs[0], sx)
    }

    return ref.sxs
  }

export default responsive

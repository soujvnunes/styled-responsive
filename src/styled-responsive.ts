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

// Work
/**
display: block;
padding: 1rem 2rem;
color: rgb(0 0 0 / 1);
@md
  display: flex;
:hover
  color: rgb(0 0 0 / 0.6);
@dark
  color: rgb(255 255 255 / 1);
  :hover
    color: rgb(255 255 255 / 0.6);
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

export type ResponsiveProps<
  O extends object,
  T extends DefaultTheme = DefaultTheme
> = ThemeProps<T> & O

const REGEX_QUOTED_MEDIA_OR_PSEUDO = new RegExp(/([\\"'])[@:]\w+?(:\w+?)?\1/g)
const REGEX_NEWLINE_SPACE_SEMICOLON = new RegExp(
  /\n\s+(?=\w+)(?!\w+;{1})|(?<=;)[\n\s+]/gm
)
const REGEX_NEWLINE_SPACE_ANY = new RegExp(/\n\s+(?=.*)/)

function isResponsive(arg: string) {
  return arg.match(REGEX_QUOTED_MEDIA_OR_PSEUDO)
}

const styledResponsive =
  <O extends object, P extends ResponsiveProps<O> = ResponsiveProps<O>>(
    _sxs: TemplateStringsArray,
    ...fns: ((props: P) => InterpolationValue)[]
  ) =>
  (props: P) => {
    const ref = {
      sxs: [..._sxs]
    }

    /**
     * Looks at least for one interpolation, resolves it
     * and merge into a single template string array
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
     * Looks at least for one "@<media>", ":<pseudo-class>" or
     * both (@dark:hover i.e) to split and reorganize it.
     */
    if (!Object.is(_sxs[0], ref.sxs[0]) && isResponsive(ref.sxs[0])?.length) {
      const sxs = ref.sxs[0]
        .split(REGEX_NEWLINE_SPACE_SEMICOLON)
        .filter(Boolean)
        .map((sx) => sx.replace(REGEX_NEWLINE_SPACE_ANY, ' '))

      for (const sx of sxs) {
        console.log(sx, isResponsive(sx))
      }
    }

    return ref.sxs
  }

export default styledResponsive

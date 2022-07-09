import sc, {
  DefaultTheme,
  InterpolationValue,
  StyledInterface
} from 'styled-components'

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

const StyledResponsive: StyledInterface =
  (el) =>
  (sxs, ...fns) => {
    const ref = {
      sxs: [...sxs],
      fns: [...fns]
    }

    if (Array.isArray(sxs)) {
      for (const sx of sxs) {
        const sxi = sxs.indexOf(sx)

        console.log(sx, fns[sxi])

        for (const sxObj of sx.split(/\n/)) {
          // const indexFromSx = sx.indexOf(sxObj);
        }
      }
    }

    return sc(el)(ref.sxs, ...ref.fns)
  }

export default StyledResponsive

# styled-responsive

> Use at-rules for media queries or key-words for selectors directly on your styled-components CSS property values.

[![NPM](https://img.shields.io/npm/v/styled-responsive.svg)](https://www.npmjs.com/package/styled-responsive) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save styled-responsive
```

## Usage

```jsx
import styled from "styled-components";
import sr from "styled-responsive";

const Button = styled.button(sr`
  display: block "@md" flex;
  padding: ${(props) => props.theme.sizing(1, 2)};
  background-color: rgb(255 255 255 / 1)
    "@dark" rgb(0 0 0 / 1);
  color: rgb(0 0 0 / 1)
    ":hover" rgb(0 0 0 / 0.6)
    "@dark" rgb(255 255 255 / 1)
    "@dark:hover" rgb(255 255 255 / 0.6);
`);

function App() {
  const theme = useTheme();

  return <Button>Click</Button>;
}
```

```jsx
import styled, { useTheme } from "styled-components";
import sc from "styled-css";

const Button = styled.button(sc);

function App() {
  const theme = useTheme();

  return (
    <Button
      css={{
        padding: theme.sizing.sm,
        display: {
          DEFAULT: "flex",
          md: "block",
        },
        color: {
          DEFAULT: "black",
          dark: "white",
        },
      }}>
      Click
    </Button>
  );
}
```

## License

MIT © [soujvnunes](https://github.com/soujvnunes)

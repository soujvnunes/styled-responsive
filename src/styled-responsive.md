```jsx
import styled from 'styled-components';
import sr from 'styled-responsive';

const Button = styled.button(sr`
  display: block "@md" flex;
  padding: ${props => props.theme.space(1, 2)};
  background-color: rgb(255 255 255 / 1)
    "@dark" rgb(0 0 0 / 1);
  color: rgb(0 0 0 / 1)
    ":hover" rgb(0 0 0 / 0.6)
    "@dark" rgb(255 255 255 / 1)
    "@dark:hover" rgb(255 255 255 / 0.6);
`);
```

```css
.JuhImL {
  display: block;
  padding: 1rem 2rem;
  color: rgb(0 0 0 / 1);
}

.JuhImL:hover {
  color: rgb(0 0 0 / 0.6);
}

@media (min-width: 640px) {
  .JuhImL {
    display: flex;
  }
}

@media (prefers-color-scheme: dark) {
  .JuhImL {
    color: rgb(255 255 255 / 1);
  }

  .JuhImL:hover {
    color: rgb(255 255 255 / 0.6);
  }
}
```

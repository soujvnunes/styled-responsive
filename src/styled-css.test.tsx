import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Styled from './styled-css'
import { THEME } from 'consts'
import { ThemeProvider } from 'styled-components'

describe('Styled', () => {
  it('should render its style pair', () => {
    const tree = renderer.create(<Styled css={{ display: 'flex' }} />).toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('display', 'flex')
  })
  it('should render its style pair based on object value props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={THEME}>
          <Styled
            css={{
              color: {
                DEFAULT: 'white'
              }
            }}
          />
        </ThemeProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('color', 'white')
  })
  it('should render its style pair based on object responsive value props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={THEME}>
          <Styled
            css={{
              color: {
                DEFAULT: 'white',
                dark: 'black'
              }
            }}
          />
        </ThemeProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('color', 'black', {
      media: '@media (prefers-color-scheme:dark)'
    })
  })
})

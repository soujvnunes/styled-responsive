import renderer from 'react-test-renderer'
import 'jest-styled-components'
import { THEME } from 'consts'
import { ThemeProvider } from 'styled-components'
import styled from './styled-responsive'

const Button = styled('button')<{ sm?: boolean }>`
  color: white '@dark' black;
`

describe('Styled', () => {
  it('should render its style pair', () => {
    const tree = renderer.create(<Button>button</Button>).toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('display', 'flex')
  })
})

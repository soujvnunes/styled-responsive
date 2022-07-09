import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Styled from './styled-css'

describe('Styled', () => {
  it('should render its style pair', () => {
    const tree = renderer.create(<Styled css={{ display: 'flex' }} />).toJSON()

    expect(tree).toHaveStyleRule('display', 'flex')
  })
  it('should render its style pair based on object value props', () => {
    const tree = renderer
      .create(
        <Styled
          css={{
            color: {
              lg: 'white'
            }
          }}
        />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('color', 'white', {
      media: '@media screen and (min-width: 40rem)'
    })
  })
})

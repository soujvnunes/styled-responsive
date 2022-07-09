import renderer from 'react-test-renderer'
import Styled from './styled-css'
import 'jest-styled-components'

describe('Styled', () => {
  it('should render its style pair based on string value props', () => {
    const tree = renderer.create(<Styled css={{ display: 'flex' }} />).toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('display', 'flex')
  })
  it('should render its style pair based on object value props', () => {
    const tree = renderer
      .create(
        <Styled
          css={{
            alignItems: {
              sm: 'center',
              md: 'flex-end'
            }
          }}
        />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('align-items', 'flex-end')
  })
})

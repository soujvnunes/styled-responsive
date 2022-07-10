import renderer from "react-test-renderer";
import "jest-styled-components";
import { THEME } from "consts";
import styled, { ThemeProvider } from "styled-components";
import css from "./styled-responsive";

const Button = styled.button(css`
  color: white "@dark" black;
`);

describe("Styled", () => {
  it("should render its style pair", () => {
    const tree = renderer.create(<Button>button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree).toHaveStyleRule("display", "flex");
  });
});

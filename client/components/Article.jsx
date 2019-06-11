import React, { Fragment } from 'react'
import styled from 'styled-components'
import MuiButtonBase from '@material-ui/core/ButtonBase'
import MuiDivider from '@material-ui/core/Divider'
import { grey, amber } from '@material-ui/core/colors'

const ButtonBase = styled(MuiButtonBase)`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 10px 24px 12px;
  width: 100%;
`

const Publisher = styled.span`
  font-size: 12px;
  color: ${amber.A700};
`

const Title = styled.h1`
  margin: 6px 0;
  font-size: 20px;
  font-weight: 400;
`

const Snippet = styled.p`
  font-size: 14px;
`

const Divider = styled(MuiDivider)`
  && {
    background-color: ${grey[700]}
  }
`


function Article(props) {
  const { publisher, title, snippet, htmlSnippet, url } = props

  function getHtmlSnippet() {
    return { __html: htmlSnippet };
  }

  return (
    <Fragment>
      <ButtonBase href={url}>
        <Wrapper>
          <Publisher>{publisher}</Publisher>
          <Title>{title}</Title>
          <Snippet>
            {snippet}
          </Snippet>
        </Wrapper>
      </ButtonBase>
      <Divider variant="middle" />
    </Fragment>
  )
}

export default Article

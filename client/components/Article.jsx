import React from 'react'
import styled from 'styled-components';
import MuiPaper from '@material-ui/core/Paper';
import ButtonBase from "@material-ui/core/ButtonBase"
 
const Paper = styled(MuiPaper)`
  padding: 12px 16px 16px;
  margin-bottom: 12px;
`;

const Publisher = styled.span`
  font-size: 12px;
`;

const Title = styled.h1`
  margin: 8px 0;
  font-size: 20px;
  font-weight: 400;
`;

const Snippet = styled.p`
`;


function Article(props) {
  const { publisher, title, snippet, url } = props

  return (
    <ButtonBase href={url}>
      <Paper>
        <Publisher>{publisher}</Publisher>
        <Title>{title}</Title>
        <Snippet>
          {snippet}
        </Snippet>
      </Paper>
    </ButtonBase>
  )
}

export default Article
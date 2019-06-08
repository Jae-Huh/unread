import styled from 'styled-components';
import MuiPaper from '@material-ui/core/Paper';
import { blueGrey } from '@material-ui/core/colors'; 
 
const App = styled.div`
  background-color: ${blueGrey[50]}; 
  min-height: 100vh;
`;

const Header = styled.div`
  font-size: 40px;
  font-weight: 500;
`;

const Body = styled.div`
  padding: 16px;
`;

const Paper = styled(MuiPaper)`
  padding: 12px 16px 16px;
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

function Home() {
  return (
    <App>
      <style jsx global>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
          }
        `}
      </style>
      <Header>
        Newsly
      </Header>
      <Body>
        <Paper>
          <Publisher>Super awesome news source</Publisher>
          <Title>Jae-Roar makes a news app!!</Title>
          <Snippet>
            Jae-Roar of Auckland, New Zealand started the most awesome...
          </Snippet>
        </Paper>
      </Body>
    </App>
  );
}

export default Home
import styled from 'styled-components';
import { blueGrey } from '@material-ui/core/colors'; 

import Articles from '../components/Articles'
 
const Page = styled.div`
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

function Home() {
  return (
    <Page>
      <Header>
        Newsly
      </Header>
      <Body>
        <Articles />
      </Body>
    </Page>
  );
}

export default Home
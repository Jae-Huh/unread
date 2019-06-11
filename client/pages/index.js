import styled from 'styled-components'
import { grey, teal } from '@material-ui/core/colors'

import Articles from '../components/Articles'

const Page = styled.div`
  background-color: ${grey[900]};
  min-height: 100vh;
  color: white;
`

const Header = styled.div`
  padding: 16px 24px;
  font-size: 42px;
  font-weight: bold;
  color: ${teal.A700};
`

function Home() {
  return (
    <Page>
      <Header>
        Unread
      </Header>
      <div>
        <Articles />
      </div>
    </Page>
  );
}

export default Home

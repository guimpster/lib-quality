import { Box } from '@material-ui/core';

import './App.css';

import QualitySearch from './components/QualitySearch';
import QualityTable from './components/QualityTable';

function App() {
  return (
    <div className="App">
      <Box m={5} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} >
        <QualitySearch/>
      </Box>
      <Box m={5} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} >
        <QualityTable/>
      </Box>
    </div>
  );
}

export default App;

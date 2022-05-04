import logo from './logo.svg';
import './AQTDisplay.css';
import InteractiveQuiltmap from './InteractiveQuiltMap.js';

function AQTDisplay(props) {
  
  return (
    <div className="AQTDisplay">
      <InteractiveQuiltmap db={props.db} configData={props.config}/>
    </div>
  );
}

export default AQTDisplay;

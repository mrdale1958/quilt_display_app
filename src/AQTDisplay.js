//import logo from './logo.svg';
import './AQTDisplay.css';
import InteractiveQuiltmap from './InteractiveQuiltMap.js';
import Data from "./MOCK_DATA.json";

function AQTDisplay(props) {
  
  return (
    <div className="AQTDisplay">
    <div>
      <input placeholder="Search the June 2022 Quilt Display"/>
      {
        Data.map((post) => {
          <div key={post.id}>
            <p>{post.first_name} {post.last_name}</p>
            <p>{post.block}</p>
          </div>
        })
      }
    </div>
  <InteractiveQuiltmap db={props.db} configData={props.config}/>
    </div>
  );
}

export default AQTDisplay;

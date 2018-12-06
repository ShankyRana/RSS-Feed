import React from 'react';
import './Feeds.css';


/*************************************************
  Feeds Stateless Component
**************************************************/

const Feeds = ({feeds, fontSize, fontColor, headlineColor, backgroundColor}) => {

  /***
   **Returns feeds card
   ***/
  const renderCards = (feeds) => {
    if(feeds && feeds.items)
      return feeds.items.map((feed, index) => {
        return (
          <div className="card-container" key={index}>
            <div className="card" style={{width: '18rem', backgroundColor: backgroundColor}}>
              <div className="card-body">
                <h5 className="card-title" style={{fontSize: `${fontSize}px`, color: headlineColor}}>{feed.title}</h5>
                <p className="card-text" style={{fontSize: `${fontSize}px`, color: fontColor}}>{feed.content}</p>
                <a href={feed.link} traget="_blank" className="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        );
      });
    else
      return <h5>No Content</h5>
  }

  return (
    <div className="Feeds">
      {renderCards(feeds)}
    </div>
  );
}

export default Feeds;

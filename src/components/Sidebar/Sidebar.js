import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Slider from 'react-rangeslider';
import { ChromePicker } from 'react-color';

/*************************************************
  Sidebar Stateless Component
**************************************************/

const Sidebar = ({handleFontSize, fontSize, headlineColor, fontColor, backgroundColor, handleColorChange, saveConfigs}) => {
    return (
      <SideNav
          onSelect={(selected) => {
            if(selected === 'save')
              saveConfigs();
          }}
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="size">
            <NavIcon>
              <i className="fa fa-fw fa-window-maximize" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              Font Size
            </NavText>
            <NavItem eventKey="size/slider">
              <NavText>
                <Slider
                  value={fontSize}
                  orientation="horizontal"
                  onChange={handleFontSize}
                />
              </NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="heading">
            <NavIcon>
              <i className="fa fa-fw fa-heading" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Heading Color
            </NavText>
            <NavItem eventKey="heading/picker">
              <NavText>
                <ChromePicker color={headlineColor} onChange={(color) => handleColorChange(color, 'headlineColor')}/>
              </NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="font">
            <NavIcon>
              <i className="fa fa-fw fa-font" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Text Color
            </NavText>
            <NavItem eventKey="font/picker">
              <NavText>
                <ChromePicker color={fontColor} onChange={(color) => handleColorChange(color, 'fontColor')}/>
              </NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="background">
            <NavIcon>
              <i className="fa fa-fw fa-fill-drip" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Background Color
            </NavText>
            <NavItem eventKey="background/picker">
              <NavText>
                <ChromePicker color={backgroundColor} onChange={(color) => handleColorChange(color, 'backgroundColor')}/>
              </NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="save">
            <NavIcon>
              <i className="fa fa-fw fa-save" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Save
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    );
}

export default Sidebar;

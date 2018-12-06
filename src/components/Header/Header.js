import React from 'react';
import { FormGroup, FormControl, Navbar, Nav, NavItem, InputGroup, Glyphicon, Button } from 'react-bootstrap';
import { logout } from 'services/common';
import './Header.css';

/*************************************************
  Header Stateless Component
**************************************************/

const Header = ({handleChange, fetchFeeds, link, loading, feedCount, successMessage, errorMessage}) => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Form>
          <FormGroup>
            <InputGroup>
              <FormControl placeholder="Enter RSS feed link" type="text" id="link" value={link} onChange={(e) => handleChange(e)} />
              <InputGroup.Addon onClick={fetchFeeds}>Fetch Feeds {loading && <i className="fa fa-spinner fa-spin"></i>}</InputGroup.Addon>
            </InputGroup>
            <Navbar.Text style={{color:errorMessage?'red':'green'}}>
              {errorMessage?errorMessage:successMessage?`${successMessage} - ${feedCount} Feeds`:''}
            </Navbar.Text>
          </FormGroup>{' '}
        </Navbar.Form>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem eventKey={2} onClick={logout}>
            <Button>Logout <Glyphicon glyph="log-out" /></Button>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

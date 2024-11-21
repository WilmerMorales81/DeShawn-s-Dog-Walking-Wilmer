import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom"; // Importa el NavLink de react-router-dom
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <>
        <Navbar color="light" expand="md">
          <Nav navbar>
            <NavbarBrand href="/">🐕‍🦺 🐩 DeShawn's Dog Walking</NavbarBrand>
            <NavItem>
              <NavLink to="/walkers" className="nav-link">
                Walkers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/cities" className="nav-link">
                Cities
              </NavLink>
            </NavItem>

          </Nav>
        </Navbar>
        <Outlet />
      </>
    </div>
  );
}

export default App;

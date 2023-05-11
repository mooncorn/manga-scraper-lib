import React, { Dispatch, SetStateAction } from "react";
import { PageName } from "./MainContent";

interface HeaderProps {
  setContentPage: Dispatch<SetStateAction<PageName>>;
}

const Header = ({ setContentPage }: HeaderProps) => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="navbar-brand">UM</div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={(e) => setContentPage("Explore")}
              >
                Explore
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={(e) => setContentPage("Library")}
              >
                Library
              </button>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={(e) => setContentPage("SignIn")}
              >
                Sign In
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={(e) => setContentPage("SignUp")}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;

import Link from "next/link";
import React from "react";
import { UserModel } from "./auth-form";

interface HeaderProps {
  currentUser: UserModel | null;
}

const Header = ({ currentUser }: HeaderProps) => {
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
              <Link className="nav-link" href={"/"}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href={"/search"}>
                Search
              </Link>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" href={"/library"}>
                  Library
                </Link>
              </li>
            )}
          </ul>
          {currentUser ? (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="nav-link">{currentUser.email}</div>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={"/signout"}>
                  Sign Out
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" href={"/signin"}>
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={"/signup"}>
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

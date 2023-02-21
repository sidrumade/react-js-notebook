import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus, faCut, faCopy, faPaste, faArrowUp, faArrowDown, faPlay, faStop, faRepeat } from "@fortawesome/free-solid-svg-icons";

const HeaderComponent = (props) => {
    return (
        <>
            <Navbar bg="light" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src="./logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        React Bootstrap
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="File" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">New Notebook</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Open...</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Make a Copy...</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Save as...</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="View" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Toggle Header</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Toggle Toolbar</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Toggle Line Numbers</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Insert" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Cell Above</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Cell Below</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Download As" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">HTML</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Notebook(.jsnb)</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Javascript</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">PDF</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Kernel" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Interrupt</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Restart</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Restart & Clear Output</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Restart & Run All</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#help">Help</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
            <Container>
                <div id="maintoolbar" className="navbar">
                    <div className="toolbar-inner navbar-inner navbar-nobg">
                        <div id="maintoolbar-container" className="container toolbar">
                            <div className="btn-group" id="save-notbook">
                                <button className="btn btn-default" title="Save and Checkpoint">
                                    <FontAwesomeIcon icon={faSave} />
                                </button>
                            </div>
                            <div className="btn-group" id="insert_below">
                                <button className="btn btn-default" title="insert cell below"  onClick={(e)=>props.InsertCellBelowHandler(props.cellIndex)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="btn-group" id="cut_paste">
                                <button className="btn btn-default" title="cut selected cells" >
                                    <FontAwesomeIcon icon={faCut} />
                                </button>
                            </div>
                            <div className="btn-group" id="copy_paste">
                                <button className="btn btn-default" title="copy selected cells" >
                                    <FontAwesomeIcon icon={faCopy} />
                                </button>
                            </div>
                            <div className="btn-group" id="paste">
                                <button className="btn btn-default" title="past selected cells below" >
                                    <FontAwesomeIcon icon={faPaste} />
                                </button>
                            </div>
                            <div className="btn-group" id="arrowUP">
                                <button className="btn btn-default" title="move selected cells up" >
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                            </div>
                            <div className="btn-group" id="arrowDown">
                                <button className="btn btn-default" title="move selected cells down" >
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </button>
                            </div>
                            <div className="btn-group" id="play">
                                <button className="btn btn-default" title="run cell, select below" >
                                    <FontAwesomeIcon icon={faPlay} />
                                </button>
                            </div>
                            <div className="btn-group" id="stop">
                                <button className="btn btn-default" title="interrupt the kernel" >
                                    <FontAwesomeIcon icon={faStop} />
                                </button>
                            </div>
                            <div className="btn-group" id="restart">
                                <button className="btn btn-default" title="restart the kernel (with dialog)" >
                                    <FontAwesomeIcon icon={faRepeat} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}


export default HeaderComponent;
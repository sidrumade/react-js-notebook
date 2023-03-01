import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus, faCut, faCopy, faPaste, faArrowUp, faArrowDown, faPlay, faStop, faRepeat , faRemove} from "@fortawesome/free-solid-svg-icons";

const HeaderComponent = (props) => {
    return (
        <>
            <Navbar bg="light" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand href="#" >
                        <img
                            alt=""
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            
                        />{' '}
                        <input type='text' value={props.notebook_name} className="notebook_lbl" onChange={(e)=>props.notebookNameChangeHandler(e)}></input>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="File" id="basic-nav-dropdown">
                                <NavDropdown.Item >New Notebook</NavDropdown.Item>
                                {props.children}
                                <NavDropdown.Item >Make a Copy...</NavDropdown.Item>
                                <NavDropdown.Item onClick={props.handleSaveClick}>Save</NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Tools" id="basic-nav-dropdown">
                                <NavDropdown.Item href="save">
                                <button className="btn" title="save and checkpoint" >
                                    <FontAwesomeIcon icon={faSave} /> Save
                                </button>
                                </NavDropdown.Item>
                                <NavDropdown.Item href="">
                                <button className="btn" title="insert cell below"  onClick={(e)=>props.InsertCellBelowHandler(props.cellIndex)}>
                                    <FontAwesomeIcon icon={faPlus} /> Insert Cell Below
                                </button>
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                <button className="btn" title="insert cell above" onClick={(e)=>props.InsertCellAboveHandler(props.cellIndex)}>
                                    <FontAwesomeIcon icon={faPlus} /> Insert Cell Above
                                </button>
                                </NavDropdown.Item>

                              
                                <NavDropdown.Item href="#action/3.1">
                                <button className="btn" title="move selected cells up" onClick={(e)=>props.MoveCellUpHandler(props.cellIndex)} >
                                    <FontAwesomeIcon icon={faArrowUp} /> Move Selected Cell Up
                                </button>
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                <button className="btn" title="move selected cells down" onClick={(e)=>props.MoveCellDownHandler(props.cellIndex)}>
                                    <FontAwesomeIcon icon={faArrowDown} /> Move Selected Cells Down
                                </button>
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                <button className="btn" title="run cell, select below" >
                                    <FontAwesomeIcon icon={faPlay} /> Run Cell, Select Below
                                </button>
                                </NavDropdown.Item>
                                
                                <NavDropdown.Item href="#action/3.1">
                                <button className="btn" title="delete cell"  onClick={(e)=>props.DeleteCellHandler(props.cellIndex)} >
                                    <FontAwesomeIcon icon={faRemove} /> Delete Cell
                                </button>
                                </NavDropdown.Item>
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
            
        </>
    );
}


export default HeaderComponent;
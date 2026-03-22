import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import kernelManager from './KernelManager';
import generateHash from './Utils/generateHash';

const Dashboard = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [activeKernels, setActiveKernels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Collect all notebooks from backend
    fetch('http://localhost:3001/api/notebooks')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          // ensure data elements have proper structure as UI expects
          setNotebooks(data);
        }
      })
      .catch(err => {
        console.error("Error fetching notebooks", err);
      });
  }, []);

  useEffect(() => {
    // Check active kernels periodically (every second) to keep UI fresh
    const interval = setInterval(() => {
      setActiveKernels(kernelManager.getActiveKernels());
    }, 1000);
    setActiveKernels(kernelManager.getActiveKernels());
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotebook = (hash) => {
    window.open(`/notebook?notebook_hash=${hash}`, '_blank');
  };

  const handleNewNotebook = () => {
    const newNotebookState = {
      notebook_name: 'untitled',
      showHelp: false,
      cellContext_data: [
        {
          id: generateHash(),
          cell_type: 'code',
          execution_count: null,
          is_executing: false,
          cellindex_value: 0,
          output: [],
          editorsValue: `// Using markdown\n// Try changing this cell to markdown via Header Controls or keep it as Javascript`,
          rows: 3,
          error: '',
          html_element: '',
          executionTime: 0
        }
      ],
      run_all: false,
      active_cell_index: 0,
      folders: [],
      currentFolder: null,
    };
    fetch('http://localhost:3001/api/notebooks/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotebookState)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setNotebooks([...notebooks, { hash: data.newName, name: data.newName, lastUpdated: new Date().toLocaleTimeString() }]);
        window.open(`/notebook?notebook_hash=${data.newName}`, '_blank');
      }
    }).catch(e => console.error("Error creating new notebook", e));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const fileContents = e.target.result;
        const stateFromFile = JSON.parse(fileContents);
        
        fetch('http://localhost:3001/api/notebooks/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateFromFile)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
             setNotebooks(prev => [...prev, { hash: data.newName, name: data.newName, lastUpdated: new Date().toLocaleTimeString() }]);
             window.open(`/notebook?notebook_hash=${data.newName}`, '_blank');
          }
        }).catch(e => console.error("Error parsing/uploading notebook file", e));

      } catch (err) {
        console.error("Error parsing notebook file", err);
        alert("Invalid notebook file");
      }
    };
    fileReader.readAsText(file);
    event.target.value = null; // reset input
  };

  const shutdownKernel = (hash) => {
    kernelManager.shutdownKernel(hash);
    setActiveKernels(kernelManager.getActiveKernels());
  };

  const deleteNotebook = (hash) => {
    if (window.confirm("Are you sure you want to delete this notebook permanently?")) {
      fetch(`http://localhost:3001/api/notebooks/${hash}`, {
        method: 'DELETE'
      }).then(() => {
        kernelManager.shutdownKernel(hash);
        setNotebooks(notebooks.filter(nb => nb.hash !== hash));
        setActiveKernels(kernelManager.getActiveKernels());
      }).catch(e => console.error("Error deleting notebook", e));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2>React Jupyter Notebook Dashboard</h2>
          <p className="text-muted">Local file directory and kernel management.</p>
        </Col>
        <Col className="text-end">
          <input
            type="file"
            accept=".jsnb"
            id="upload-notebook-input"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-notebook-input" className="me-2">
            <Button variant="outline-primary" as="span">
              Open Notebook
            </Button>
          </label>
          <Button variant="success" onClick={handleNewNotebook}>+ New Notebook</Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <h4>Filesystem (Local Storage)</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Notebook Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notebooks.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No notebooks found. Create one!</td></tr>
              ) : (
                notebooks.map((nb) => {
                  const isRunning = activeKernels.includes(nb.hash);
                  return (
                    <tr key={nb.hash}>
                      <td>
                        <a href="#!" onClick={(e) => { e.preventDefault(); handleOpenNotebook(nb.hash); }}>
                          {nb.name}.jsnb
                        </a>
                      </td>
                      <td>
                        {isRunning ? <Badge bg="success">Running</Badge> : <Badge bg="secondary">Stopped</Badge>}
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenNotebook(nb.hash)}>
                          Open
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteNotebook(nb.hash)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </Col>

        <Col md={4}>
          <h4>Active Kernels</h4>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Kernel Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeKernels.length === 0 ? (
                <tr><td colSpan="2" className="text-center">No running kernels</td></tr>
              ) : (
                activeKernels.map(hash => (
                  <tr key={hash}>
                    <td>
                      <small>{hash}</small>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenNotebook(hash)}>
                        Open
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => shutdownKernel(hash)}>
                        Shutdown
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

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
    // Collect all notebooks from localStorage
    const saved = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('stateData#')) {
        try {
          const raw = localStorage.getItem(key);
          const parsed = JSON.parse(raw);
          saved.push({
            hash: parsed.notebook_hash || key.split('#')[1],
            name: parsed.notebook_name || 'untitled',
            lastUpdated: new Date().toLocaleTimeString(), // Or actual timestamp if we saved it
          });
        } catch (e) {
          console.error('Error parsing stored notebook', e);
        }
      }
    }
    setNotebooks(saved);
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
    const hash = generateHash();
    const newNotebookState = {
      notebook_hash: hash,
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
    localStorage.setItem(`stateData#${hash}`, JSON.stringify(newNotebookState));
    setNotebooks([...notebooks, { hash, name: 'untitled', lastUpdated: new Date().toLocaleTimeString() }]);
    window.open(`/notebook?notebook_hash=${hash}`, '_blank');
  };

  const shutdownKernel = (hash) => {
    kernelManager.shutdownKernel(hash);
    setActiveKernels(kernelManager.getActiveKernels());
  };

  const deleteNotebook = (hash) => {
    if (window.confirm("Are you sure you want to delete this notebook permanently?")) {
      localStorage.removeItem(`stateData#${hash}`);
      kernelManager.shutdownKernel(hash);
      setNotebooks(notebooks.filter(nb => nb.hash !== hash));
      setActiveKernels(kernelManager.getActiveKernels());
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
                <th>Hash</th>
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
                      <td><small className="text-muted">{nb.hash.substring(0, 8)}</small></td>
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
                <th>Kernel Hash</th>
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
                      <small>{hash.substring(0, 8)}</small>
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

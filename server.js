const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = 3001;
const CWD = process.cwd();
const notebooksDir = path.join(CWD, 'notebooks');

// Ensure notebooks directory exists
if (!fs.existsSync(notebooksDir)) {
    fs.mkdirSync(notebooksDir);
}

// Get all notebooks
app.get('/api/notebooks', (req, res) => {
    fs.readdir(notebooksDir, (err, files) => {
        if (err) {
            console.error('Error reading notebooks dir:', err);
            return res.status(500).json({ error: 'Failed to read notebooks directory' });
        }
        
        const notebooks = files
            .filter(f => f.endsWith('.jsnb'))
            .map(f => {
                const filePath = path.join(notebooksDir, f);
                try {
                    const stats = fs.statSync(filePath);
                    return {
                        hash: f.replace('.jsnb', ''),
                        name: f.replace('.jsnb', ''),
                        lastUpdated: stats.mtime.toLocaleTimeString(),
                        lastUpdatedMs: stats.mtimeMs
                    };
                } catch (e) {
                    console.error(`Error parsing notebook ${f}:`, e);
                    return null;
                }
            })
            .filter(nb => nb !== null);

        res.json(notebooks);
    });
});

// Create a new notebook (auto-handles duplicates by appending numbers)
app.post('/api/notebooks/new', (req, res) => {
    let baseName = req.body.notebook_name || 'untitled';
    let name = baseName;
    let counter = 1;

    let newFilePath = path.join(notebooksDir, `${name}.jsnb`);
    while (fs.existsSync(newFilePath)) {
        name = `${baseName} ${counter}`;
        newFilePath = path.join(notebooksDir, `${name}.jsnb`);
        counter++;
    }

    req.body.notebook_name = name;
    req.body.notebook_hash = name;

    try {
        fs.writeFileSync(newFilePath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ success: true, newName: name });
    } catch(e) {
        console.error('Error creating notebook:', e);
        res.status(500).json({ error: 'Failed to create notebook to disk' });
    }
});

// Get a specific notebook
app.get('/api/notebooks/:name', (req, res) => {
    const filePath = path.join(notebooksDir, `${req.params.name}.jsnb`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Notebook not found' });
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        // Guarantee inner hash matches file
        parsed.notebook_name = req.params.name;
        parsed.notebook_hash = req.params.name;
        res.json(parsed);
    } catch (e) {
        res.status(500).json({ error: 'Failed to read notebook' });
    }
});

// Save (and potentially rename) a notebook
app.post('/api/notebooks/:name', (req, res) => {
    const oldName = req.params.name;
    let newName = req.body.notebook_name;
    
    if (!newName || newName.trim() === '') {
        newName = 'untitled';
        req.body.notebook_name = newName;
    }

    const oldFilePath = path.join(notebooksDir, `${oldName}.jsnb`);
    const newFilePath = path.join(notebooksDir, `${newName}.jsnb`);

    if (oldName !== newName) {
        if (fs.existsSync(newFilePath)) {
            return res.status(400).json({ error: 'A notebook with this name already exists.' });
        }
        try {
            fs.writeFileSync(newFilePath, JSON.stringify(req.body, null, 2), 'utf-8');
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            return res.json({ success: true, newName: newName });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: 'Failed to rename notebook on disk' });
        }
    } else {
        try {
            fs.writeFileSync(newFilePath, JSON.stringify(req.body, null, 2), 'utf-8');
            res.json({ success: true });
        } catch (e) {
            console.error('Error saving notebook:', e);
            res.status(500).json({ error: 'Failed to save notebook to disk' });
        }
    }
});

// Delete a notebook
app.delete('/api/notebooks/:name', (req, res) => {
    const filePath = path.join(notebooksDir, `${req.params.name}.jsnb`);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            res.json({ success: true });
        } catch (e) {
            console.error('Error deleting notebook:', e);
            return res.status(500).json({ error: 'Failed to delete notebook file' });
        }
    } else {
        return res.status(404).json({ error: 'Notebook not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Notebook server running. Dashboard API ready on http://localhost:${PORT}/api/notebooks`);
});

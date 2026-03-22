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
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    return {
                        hash: content.notebook_hash || f.replace('.jsnb', ''),
                        name: content.notebook_name || 'untitled',
                        lastUpdated: stats.mtime.toLocaleTimeString(),
                        lastUpdatedMs: stats.mtimeMs // For sorting if needed
                    };
                } catch (e) {
                    console.error(`Error parsing notebook ${f}:`, e);
                    return null; // Ignore corrupted files
                }
            })
            .filter(nb => nb !== null);

        res.json(notebooks);
    });
});

// Get a specific notebook
app.get('/api/notebooks/:hash', (req, res) => {
    const filePath = path.join(notebooksDir, `${req.params.hash}.jsnb`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Notebook not found on server' });
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (e) {
        res.status(500).json({ error: 'Failed to read or parse notebook file' });
    }
});

// Save a notebook
app.post('/api/notebooks/:hash', (req, res) => {
    const filePath = path.join(notebooksDir, `${req.params.hash}.jsnb`);
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (e) {
        console.error('Error saving notebook:', e);
        res.status(500).json({ error: 'Failed to save notebook to disk' });
    }
});

// Delete a notebook
app.delete('/api/notebooks/:hash', (req, res) => {
    const filePath = path.join(notebooksDir, `${req.params.hash}.jsnb`);
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

const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Mappage des ratios aux dimensions en pixels pour Etsy
const sizes = {
    '4:5': { width: 1280, height: 1600 },
    '2:3': { width: 1333, height: 2000 },
    '5:7': { width: 714, height: 1000 },
    '11:14': { width: 786, height: 1120 }
};

app.post('/upload', upload.array('photos', 10), async (req, res) => {
    const files = req.files;
    const selectedRatio = req.body.ratio;
    const dimensions = sizes[selectedRatio];
    const zipPath = path.join(__dirname, 'uploads', `images-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', err => { throw err; });
    archive.pipe(output);

    for (const file of files) {
        const imagePath = path.join(__dirname, file.path);
        const image = await Jimp.read(imagePath);
        await image.resize(dimensions.width, dimensions.height).quality(90);

        const outputFilename = `processed-${file.filename}`;
        const outputPath = path.join(__dirname, 'uploads', outputFilename);
        await image.writeAsync(outputPath);

        archive.file(outputPath, { name: outputFilename });
    }

    archive.finalize();

    output.on('close', function() {
        res.download(zipPath);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import multer from 'multer';
import pdf from 'pdf-parse';

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit to 10MB
  },
  fileFilter: function (req, file, cb) {
    // Only allow PDF files
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'), false);
    }
    cb(null, true);
  },
}).array('theFile'); // Change this line

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          console.error('Multer error during upload:', err);
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File size limit exceeded.' });
          }
          return res.status(500).json({ error: err.message });
        } else if (err) {
          console.error('Unknown error during upload:', err);
          return res.status(500).json({ error: err.message });
        }

        // Change this block to handle multiple files
        const files = req.files;
        if (!files || files.length === 0) {
          console.error('No files in request');
          return res.status(400).json({ error: 'Files must be uploaded.' });
        }

        for (const file of files) {
          const dataBuffer = file.buffer;
          try {
            const data = await pdf(dataBuffer);
            console.log('Extracted PDF data:', data.text);
          } catch (pdfError) {
            console.error('Error during PDF parsing:', pdfError);
            return res.status(500).json({ error: 'Error during PDF parsing.' });
          }
        }

        return res.status(200).json({ message: 'Files have been processed.' });
      });
    } else {
      res.status(405).json({ error: `Method '${req.method}' not allowed` });
    }
  } catch (error) {
    console.error('Unexpected error in handler:', error);
    return res.status(500).json({ error: error.toString() });
  }
}

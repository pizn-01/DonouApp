import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Request } from 'express';

// =============================================
// Upload Configuration
// =============================================

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/postscript', // .ai files
    'image/vnd.adobe.photoshop', // .psd files
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.ai', '.psd'];

// =============================================
// Ensure upload directory exists
// =============================================

async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Initialize upload directory
ensureUploadDir();

// =============================================
// Storage Configuration
// =============================================

const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        await ensureUploadDir();
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        // Generate unique filename: timestamp-uuid-originalname
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext)
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();

        const filename = `${timestamp}-${randomString}-${basename}${ext}`;
        cb(null, filename);
    }
});

// =============================================
// File Filter
// =============================================

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Check extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        cb(new Error(`File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`));
        return;
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(new Error(`Invalid MIME type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`));
        return;
    }

    cb(null, true);
};

// =============================================
// Multer Configuration
// =============================================

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5 // Maximum 5 files per upload
    }
});

// =============================================
// Upload Service
// =============================================

export class UploadService {
    /**
     * Process uploaded files and return URLs
     */
    async processUploadedFiles(files: Express.Multer.File[]): Promise<string[]> {
        if (!files || files.length === 0) {
            return [];
        }

        // In development, return local file paths
        // In production, this would upload to S3/Cloudinary and return public URLs
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return files.map(file => {
            return `${baseUrl}/uploads/${file.filename}`;
        });
    }

    /**
     * Delete a file
     */
    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extract filename from URL
            const filename = path.basename(fileUrl);
            const filePath = path.join(UPLOAD_DIR, filename);

            // Check if file exists and delete
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
            // Don't throw error - file might already be deleted
        }
    }

    /**
     * Delete multiple files
     */
    async deleteFiles(fileUrls: string[]): Promise<void> {
        await Promise.all(fileUrls.map(url => this.deleteFile(url)));
    }

    /**
     * Validate file before upload
     */
    validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
        // Check size
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
            };
        }

        // Check extension
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return {
                valid: false,
                error: `File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
            };
        }

        return { valid: true };
    }
}

export default new UploadService();

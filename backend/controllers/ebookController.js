import fs from "fs";
import path from "path";
import Ebook from "../models/AddEbook.js";

// Helper function (belongs to controller)
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// CREATE ebook
export const createEbook = async (req, res) => {
  try {
    const { title, author, subject, class: bookClass, section } = req.body;

    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    if (!req.files || !req.files["pdf"]) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const pdfFile = req.files["pdf"][0];
    const coverImageFile = req.files["coverImage"]?.[0];

    const newEbook = new Ebook({
      title,
      author,
      subject,
      class: bookClass,
      section,
      fileSize: formatFileSize(pdfFile.size),
      pdfUrl: `/uploads/${pdfFile.filename}`,
      coverImageUrl: coverImageFile ? `/uploads/${coverImageFile.filename}` : null,
    });

    await newEbook.save();
    res.status(201).json(newEbook);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET all ebooks
// export const getEbooks = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const skip = (page - 1) * limit;
//     const query = {};

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { author: { $regex: search, $options: 'i' } },
//         { subject: { $regex: search, $options: 'i' } },
//         { class: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const [ebooks, total] = await Promise.all([
//       Ebook.find(query).sort({ uploadDate: -1 }).skip(+skip).limit(+limit),
//       Ebook.countDocuments(query)
//     ]);

//     res.json({
//       data: ebooks,
//       meta: {
//         total,
//         page: +page,
//         limit: +limit,
//         totalPages: Math.ceil(total / limit)
//       }
//     });
//   } catch {
//     res.status(500).json({ error: "Failed to fetch ebooks" });
//   }
// };
export const getEbooks = async (req, res) => {
  try {
    const { class: className, section } = req.query;

    const query = {};
    if (className) query.class = className;
    if (section) query.section = section;

    const ebooks = await Ebook.find(query).sort({ uploadDate: -1 });

    res.json({ data: ebooks });
  } catch {
    res.status(500).json({ error: "Failed to fetch ebooks" });
  }
};


// GET ebook by ID
export const getEbookById = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id).exec();
    if (!ebook) return res.status(404).json({ error: "E-book not found" });
    res.json(ebook);
  } catch {
    res.status(500).json({ error: "Failed to fetch e-book" });
  }
};

// UPDATE ebook
export const updateEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id).exec();
    if (!ebook) return res.status(404).json({ error: "E-book not found" });

    if (req.body.title) ebook.title = req.body.title;
    if (req.body.author) ebook.author = req.body.author;
    if (req.body.subject) ebook.subject = req.body.subject;
    if (req.body.class) ebook.class = req.body.class;

    if (req.files?.pdf) {
      if (ebook.pdfUrl) {
        fs.unlink(path.join("uploads", path.basename(ebook.pdfUrl)), () => {});
      }
      const pdfFile = req.files.pdf[0];
      ebook.pdfUrl = "/uploads/" + pdfFile.filename;
      ebook.fileSize = formatFileSize(pdfFile.size);
    }

    if (req.files?.coverImage) {
      if (ebook.coverImageUrl) {
        fs.unlink(path.join("uploads", path.basename(ebook.coverImageUrl)), () => {});
      }
      ebook.coverImageUrl = "/uploads/" + req.files.coverImage[0].filename;
    }

    await ebook.save();
    res.json(ebook);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ebook
export const deleteEbook = async (req, res) => {
  try {
    const book = await Ebook.findByIdAndDelete(req.params.id).exec();
    if (!book) return res.status(404).json({ error: "E-book not found" });

    if (book.pdfUrl) {
      fs.unlink(path.join("uploads", path.basename(book.pdfUrl)), () => {});
    }
    if (book.coverImageUrl) {
      fs.unlink(path.join("uploads", path.basename(book.coverImageUrl)), () => {});
    }

    res.json({ message: "E-book deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete e-book" });
  }
};

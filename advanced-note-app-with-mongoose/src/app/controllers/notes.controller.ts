import  express, { type Request, type Response }  from "express";
import { Note } from "../models/notes.model";


export const notesRoutes = express.Router()

notesRoutes.post("/create-note", async (req: Request, res: Response) => {
  const body = req.body;

  // Approach - 1 of creating a data
  //   const myNote = new Note({
  //     title: "Learning Mongoose",
  //     // content: "I am learning mongoose",
  //     tags: {
  //       label: "database",
  //     },
  //   });

  //   await myNote.save();

  // Approach - 2
  const note = await Note.create(body);

  res.status(201).json({
    success: true,
    message: "Note created successfully!",
    note: note,
  });
});

notesRoutes.get("/", async (req: Request, res: Response) => {
  // const notes = await Note.find();
  const notes = await Note.find().populate("user");
  res.status(201).json({
    success: true,
    message: "Notes retrieve successfully!",
    note: notes,
  });
});

notesRoutes.get("/:noteId", async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  // const note = await Note.findById(noteId);
  //   const note = await Note.findOne({_id: noteId});
  const note = await Note.findById(noteId).populate("user");

  res.status(201).json({
    success: true,
    message: "Note retrieve successfully!",
    note: note,
  });
});

notesRoutes.patch("/:noteId", async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  const updatedBody = req.body;

  const note = await Note.findByIdAndUpdate(noteId, updatedBody, { new: true });
  //   const note = await Note.updateOne({_id: noteId}, updatedBody, {new: true});
  //   const note = await Note.findOneAndUpdate({_id: noteId}, updatedBody, {new: true});

  res.status(201).json({
    success: true,
    message: "Note updated successful!",
    note: note,
  });
});

notesRoutes.delete("/:noteId", async (req: Request, res: Response) => {
  const noteId = req.params.noteId;

  const note = await Note.findByIdAndDelete(noteId);
  //   const note = await Note.deleteOne({ _id: noteId });
  //   const note = await Note.findOneAndDelete({_id: noteId});

  res.status(201).json({
    success: true,
    message: "Note deleted successful!",
    note: note,
  });
});

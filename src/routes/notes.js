const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const User = require("../models/User");
const { isAuth } = require("../helpers/authentication");

router.get("/notes/add", isAuth, (req, res) => {
  res.render("notes/newNote");
});

router.post("/notes/new-note", isAuth, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ errorMessage: "Please type a title" });
  }
  if (!description) {
    errors.push({ errorMessage: "Please type a description" });
  }
  if (errors.length > 0) {
    res.render("notes/newNote", {
      errors,
      title,
      description,
    });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("successMessage", "Note added successfully!");
    res.redirect("/notes");
  }
});

router.get("/notes", isAuth, async (req, res) => {
  const allNotes = await Note.find({ user: req.user.id }).sort({
    date: "desc",
  });
  const findByUserName = await User.find({ userName: req.user.userName });
  const userFound = findByUserName[0].userName;
  const context = {
    userFound: userFound,
    notes: allNotes.map((document) => {
      return {
        title: document.title,
        description: document.description,
        id: document._id,
      };
    }),
  };
  res.render("notes/allNotes", {
    notes: context.notes,
    userFound: context.userFound,
  });
});

router.get("/notes/edit/:id", isAuth, async (req, res) => {
  const note = {};
  await Note.findById(req.params.id).then((actualNote) => {
    note.title = actualNote.title;
    note.description = actualNote.description;
    note.date = actualNote.date;
    note.id = actualNote._id;
  });
  res.render("notes/editNote", { note });
});

router.put("/notes/edit-note/:id", isAuth, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("successMessage", "Note edited succesfully!");
  res.redirect("/notes");
});

router.delete("/notes/delete-note/:id", isAuth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("successMessage", "Note deleted successfully!");
  res.redirect("/notes");
});

module.exports = router;

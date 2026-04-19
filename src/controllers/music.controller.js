const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");
require("../models/user.model");

async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No audio file provided" });
    if (!title) return res.status(400).json({ message: "Title is required" });

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    res.status(201).json({
      message: "Music Created Successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.error("createMusic error:", err);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
}

async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;

    if (!title) return res.status(400).json({ message: "Album title is required" });
    if (!musics || !musics.length) return res.status(400).json({ message: "Select at least one track" });

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics,
    });

    res.status(201).json({
      message: "Album Created Successfully",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        musics: album.musics,
      },
    });
  } catch (err) {
    console.error("createAlbum error:", err);
    res.status(500).json({ message: "Failed to create album: " + err.message });
  }
}

async function getAllMusics(req, res) {
  try {
    const musics = await musicModel.find().limit(20).populate("artist", "username");

    res.status(200).json({
      message: "Musics fetched Successfully",
      musics,
    });
  } catch (err) {
    console.error("getAllMusics error:", err);
    res.status(500).json({ message: "Failed to fetch music: " + err.message });
  }
}

async function getAllAlbums(req, res) {
  try {
    const albums = await albumModel
      .find()
      .select("title artist")
      .populate("artist", "username email");

    res.status(200).json({
      message: "Albums fetched Successfully",
      albums,
    });
  } catch (err) {
    console.error("getAllAlbums error:", err);
    res.status(500).json({ message: "Failed to fetch albums: " + err.message });
  }
}

async function getAlbumById(req, res) {
  try {
    const albumId = req.params.albumId;

    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username email")
      .populate("musics");

    if (!album) return res.status(404).json({ message: "Album not found" });

    res.status(200).json({
      message: "Album fetched Successfully",
      album,
    });
  } catch (err) {
    console.error("getAlbumById error:", err);
    res.status(500).json({ message: "Failed to fetch album: " + err.message });
  }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };
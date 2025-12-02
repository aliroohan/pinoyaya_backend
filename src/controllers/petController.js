const petService = require('../services/pet');


exports.create = async (req, res) => {
  try {
    const pet = await petService.create(req.body);
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const user = req.user._id;
    const pets = await petService.getAll(user);
    res.json({
      message: "pets fetched successfully",
      data : pets});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const pet = await petService.update(req.params.id, req.body);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const pet = await petService.delete(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
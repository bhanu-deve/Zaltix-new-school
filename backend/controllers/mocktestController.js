import MockTest from "../models/AddMockTest.js";

// CREATE mock test
export const createMockTest = async (req, res) => {
  try {
    const newMockTest = new MockTest(req.body);
    const savedMockTest = await newMockTest.save();
    res.status(201).json(savedMockTest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mock test' });
  }
};

// GET all mock tests
export const getMockTests = async (req, res) => {
  try {
    const mockTests = await MockTest.find().exec();
    res.status(200).json(mockTests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mock tests' });
  }
};

// UPDATE mock test
export const updateMockTest = async (req, res) => {
  try {
    const updatedMockTest = await MockTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();

    res.status(200).json(updatedMockTest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mock test' });
  }
};

// DELETE mock test
export const deleteMockTest = async (req, res) => {
  try {
    await MockTest.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: 'Mock test deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mock test' });
  }
};

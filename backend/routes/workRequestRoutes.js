const express = require('express');
const WorkRequest = require('../models/workRequestModel');
const User = require('../models/userModel');
const router = express.Router();

// Consumer: Post a new work request
router.post('/create', async (req, res) => {
  const { workType, address, phone, workTiming, date, consumerId } = req.body;
  try {
    const newRequest = await WorkRequest.create({ workType, address, phone, workTiming, date, consumer: consumerId });
    res.status(201).json({ message: 'Work request created', request: newRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
});

router.get('/myorder/:id', async (req, res) => {
  const consumerId = req.params.id; // Get consumer ID from URL parameters

  try {
    // Fetch all work requests that belong to the consumerId
    const workRequests = await WorkRequest.find({ consumer: consumerId });

    if (workRequests.length > 0) {
      // If work requests exist, send them
      return res.status(200).json({ message: 'Work requests found', workRequests });
    } else {
      // If no work requests found, send appropriate response
      return res.status(200).json({ message: 'No work available' });
    }
  } catch (error) {
    // Handle server errors
    console.error('Error fetching work requests:', error);
    return res.status(500).json({ error: 'Server error while fetching work requests' });
  }
});


  router.get('/mytask/:id', async (req, res) => {
    const workerId = req.params.id; 
    try {
      const workRequests = await WorkRequest.find({ worker: workerId });
  
      if (workRequests.length > 0) {
        return res.status(200).json({ message: 'Work requests found', workRequests });
      }
  
      return res.status(200).json({ message: 'No work requests found', workRequests: [] });
    } catch (error) {
      console.error('Error fetching work requests:', error.message);
      return res.status(500).json({ error: 'Server error while fetching work requests' });
    }
  });

  router.get('/allwork', async (req, res) => {
    try {
      // Fetch all work requests
      const workRequests = await WorkRequest.find();
  
      if (workRequests.length > 0) {
        return res.status(200).json({ 
          message: 'Work requests found', 
          workRequests 
        });
      }
  
      // No work requests found
      return res.status(204).json({ 
        message: 'No work requests found', 
        workRequests: [] 
      });
    } catch (error) {
      // Log full error for debugging
      console.error('Error fetching work requests:', error);
  
      return res.status(500).json({ 
        error: 'Server error while fetching work requests' 
      });
    }
  });
  
  


// Owner: Assign a worker to a request
router.put('/assign/:id', async (req, res) => {
    const { workerId } = req.body;
    try {
      const updatedRequest = await WorkRequest.findByIdAndUpdate(
        req.params.id,
        { worker: workerId },
        { new: true }
      )
        .populate('worker', '-password'); // Exclude password field when populating worker
  
      // Check if the update was successful
      if (!updatedRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      res.status(200).json({
        message: 'Worker assigned',
        request: updatedRequest
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to assign worker' });
    }
  });
  
  

// Worker: Generate a bill
router.put('/generate-bill/:id', async (req, res) => {
  const { billAmount, WorkDuriation } = req.body;
  try {
    const updatedRequest = await WorkRequest.findByIdAndUpdate(
      req.params.id,
      { billAmount, WorkDuriation },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Work request not found' });
    }

    res.status(200).json({ message: 'Bill generated successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(500).json({ error: 'Failed to generate bill' });
  }
});

router.post('/work-request/review/:id', async (req, res) => {
  const { id } = req.params; // ID of the WorkRequest
  const { review } = req.body; // Review comment from the request body

  try {
    // Validate input
    if (!review || typeof review !== 'string') {
      return res.status(400).json({ error: 'Review is required and must be a string' });
    }

    // Find the WorkRequest by ID and update the review field
    const workRequest = await WorkRequest.findByIdAndUpdate(
      id,
      { review },
      { new: true } // Return the updated document
    );

    if (!workRequest) {
      return res.status(404).json({ error: 'Work request not found' });
    }

    // Send the updated WorkRequest as a response
    res.status(200).json({ message: 'Review added successfully', workRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;

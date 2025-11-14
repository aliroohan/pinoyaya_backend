const babysitterModel = require('../models/babysitter');
const walletModel = require('../models/wallet');
const locationModel = require('../models/location');
const jobService = require('./job');
const reviewService = require('./review');
const jobModel = require('../models/job');

exports.getAllBabysitters = async () => {
    const babysitters = await babysitterModel.find();
    const babysittersWithLocation = await locationModel.find({ babysitterId: { $in: babysitters.map(babysitter => babysitter._id) } });
    // babysitters.forEach(babysitter => {
    //     babysitter.city = babysittersWithLocation.find(location => location.babysitterId === babysitter._id).city;
    // });
    return babysitters;
};

exports.createBabysitter = async (babysitterData) => {
    const babysitter = new babysitterModel(babysitterData);
    await babysitter.save();
    const wallet = new walletModel({ babysitterId: babysitter._id });
    await wallet.save();
    return babysitter;
};

exports.getBabysitterById = async (id) => {
    const babysitter = await babysitterModel.findById(id);
    
    if (!babysitter) {
        return null;
    }
    
    const jobCount = await jobService.getJobCountByBabysitterId(id);
    const reviews = await reviewService.getByBabysitter(id);
    
    // Convert Mongoose document to plain object and add extra properties
    const babysitterObj = babysitter.toObject();
    babysitterObj.jobCount = jobCount;
    babysitterObj.reviews = reviews;
    
    console.log('Final babysitter object:', babysitterObj);
    return babysitterObj;
};

exports.getBabysitter = async (phone, email = null) => {
    const babysitter = await babysitterModel.findOne({
        $or: [
            { phone },
            { email }
        ]
    });
    
    return babysitter;
};

exports.verifyEmail = async (email, code) => {
    const babysitter = await exports.getBabysitter(null, email);
    if (!babysitter) {
        throw new Error('Babysitter not found');
    }
    if (babysitter.emailVerificationCode !== code) {
        throw new Error('Invalid verification code');
    }
    babysitter.emailVerified = true;
    await babysitter.save();
    return babysitter;
};

exports.getBabysittersByFilter = async ( radius, available, user) => {
    const location = await locationModel.findOne({ babysitterId: user._id, isDefault: true });
    const { latitude, longitude } = location;
    
    // Haversine formula to calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return distance;
    };

    try {
        // Get all babysitter locations
        const babysitterLocations = await locationModel.find({ 
            babysitterId: { $exists: true, $ne: null } 
        }).populate('babysitterId').select('-password');

        // Get all ongoing jobs to check babysitter availability
        const ongoingJobs = await jobModel.find({ status: 'ongoing' });
        const babysittersInOngoingJobs = ongoingJobs.map(job => job.babysitterId.toString());

        // Filter babysitters within the specified radius
        let babysittersInRadius = babysitterLocations
            .map(location => {
                const distance = calculateDistance(
                    latitude, 
                    longitude, 
                    location.latitude, 
                    location.longitude
                );
                return {
                    babysitter: location.babysitterId,
                    location: location,
                    distance: distance
                };
            })
            .filter(item => item.distance <= radius)
            .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)

        // Apply availability filter if specified
        if (available !== undefined) {
            if (available === true) {
                // Filter out babysitters who are in ongoing jobs when looking for available babysitters
                babysittersInRadius = babysittersInRadius.filter(item => {
                    const babysitterId = item.babysitter._id.toString();
                    const isInOngoingJob = babysittersInOngoingJobs.includes(babysitterId);
                    return !isInOngoingJob
                });
            } else if (available === false) {
                // When available=false, show all babysitters in radius (including those in ongoing jobs)
                babysittersInRadius = babysittersInRadius.filter(item => 
                    item.babysitter.isOnline === false
                );
            }
        }

        // Return babysitters with their distance information
        return babysittersInRadius.map(item => ({
            babysitter: item.babysitter,
            location: {
                latitude: item.location.latitude,
                longitude: item.location.longitude,
                title: item.location.title,
                area: item.location.area,
                house: item.location.house,
                directions: item.location.directions,
                label: item.location.label
            },
            distance: Math.round(item.distance * 100) / 100, // Round to 2 decimal places
            isInOngoingJob: babysittersInOngoingJobs.includes(item.babysitter._id.toString())
        }));
    } catch (error) {
        throw new Error(`Error filtering babysitters: ${error.message}`);
    }
};

exports.getBabysittersByType = async (type) => {
    const babysitters = await babysitterModel.find({ profession: type });
    return babysitters;
};

exports.updateBabysitter = async (id, data) => {
    const babysitter = await babysitterModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
    return babysitter;
};

exports.deleteBabysitter = async (id) => {
    const babysitter = await babysitterModel.findByIdAndDelete(id);
    return babysitter;
};

exports.verifyDocs = async (id) => {
    const babysitter = await babysitterModel.findByIdAndUpdate(id, { idVerified: true }, { new: true }).select('-password');
    return babysitter;
};

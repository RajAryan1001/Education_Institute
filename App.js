const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const website = express();
const multer=require('multer')
const path = require('path');
const fs = require('fs');     // VIdeo


// Set up the view engine
website.set('view engine', 'ejs');


// Set the views folder path
website.set('views', path.join(__dirname, 'views'));

// Static files middleware
website.use(express.static('public'));

// Body parser middleware
// website.use(express.json()); // Parse JSON bodies
website.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

mongoose.connect('mongodb://localhost:27017/Education')

// Handle the route for "/home"
website.get('/', (req, res) => {
    res.render('Home');  // Render the "Home" view
});

// Handle the route for "/home"
website.get('/courses', (req, res) => {
    res.render('Courses');  // Render the "Home" view
});

// Handle the route for "/admission"
website.get('/abroad_admission', (req, res) => {
    res.render('Undergrad_Abroad');  // This will render views/admission.ejs
});

website.get('/igcse&ibt', (req, res) => { 
    res.render('IGCSE&IBTutoring');   // This will render views/admission.ejs
});

website.get('/upcomingbooking', (req, res)=>{
    res.render('UpcomingBatches');
})



// Handle the route for "Admin desboard",
website.get('/myadmin', (req, res) => {
    res.render('panel/aaru');  // Render the "Home" view
});

// Handle the route for "Msabroad",
website.get('/msabroad', (req, res)=>{
     res.render('MsAbroad')
})

// Handle the route for "Msabroad",
website.get('/mba_admission', (req, res)=>{
    res.render('Mba_Admission')
})

// Handle the route for "Msabroad",
website.get('/phd_abroad', (req, res)=>{
    res.render('Phd_Adroad')
})

// Handle the route for "Contact&About Us",

website.get('/contact&about',(req,res)=>{
    res.render('Contact&About')
})



//  All Adminn File render 

// Handle the route for "Msabroad",
website.get('/Undergrad_Abroad_Ad', (req, res)=>{
    res.render('panel/Undergrad_Abroad_Ad')
})

website.get('/Mba', (req, res)=>{
    res.render('panel/Mba_Ad')
})



// Define the schema and model for enquiries
const enquirySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String,
    city: String,
    authorize: Boolean
});

const Enquiry = mongoose.model('undergrad_abroad_enquiry', enquirySchema);

// Handle the route for "Msabroad"
website.get('/Undergrad_Abroad_Ad', (req, res) => {
    res.render('panel/Undergrad_Abroad_Ad');
});

website.post('/Undergrad_AbroadForm', async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, program, city, authorize } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !mobile || !program || !city) {
            return res.status(400).send('All fields are required.');
        }

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await Enquiry.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new enquiry object
        const newEnquiry = new Enquiry({
            firstName,
            lastName,
            email,
            mobile,
            program,
            city,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newEnquiry.save();
        console.log('Enquiry saved successfully:', newEnquiry);

        // Send a success message to the client
        res.send(`
            <script>
                alert('Enquiry submitted successfully!');
                window.location.href = '/abroad_admission'; // Redirect to the enquiries page
            </script>
        `);
    } catch (error) {
        console.error('Error saving enquiry:', error);
        res.status(500).json({ error: 'An error occurred while submitting the form', details: error.message });
    }
});

website.get('/enquiries', async (req, res) => {
    try {
        // Fetch all enquiries from the database
        const enquiries = await Enquiry.find();

        // Render the 'Undergrad_Abroad_Ad' view and pass the enquiries data to the view
        res.render('panel/Undergrad_Abroad_Ad', { enquiries });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries' });
    }
});


// Route to fetch data and display in the table
website.get('/enquiries', async (req, res) => {
    try {
        // Fetch all enquiries from the database
        const enquiries = await Enquiry.find();

        // Render the 'Undergrad_Abroad_Ad' view and pass the enquiries data to the view
        res.render('panel/Undergrad_Abroad_Ad', { enquiries });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries' });
    }
});

website.post('/delete-enquiry/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id;

        // Attempt to delete the enquiry with the given ID
        const result = await Enquiry.findByIdAndDelete(enquiryId);

        if (result) {
            console.log("Enquiry deleted successfully!");
            // Redirect to the enquiries page with a success message
            res.redirect('/enquiries');
        } else {
            console.log("Enquiry not found");
            res.status(404).send('Enquiry not found');
        }
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ error: 'An error occurred while deleting the enquiry' });
    }
});


// MS Abroat From Admission........

// models/MsAbroadEnquiry.js

// Define the schema for MS Abroad Enquiry
const msAbroadEnquirySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    program: { type: String, required: true },
    city: { type: String, required: true },
    authorize: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the model
const MsAbroadEnquiry = mongoose.model('MsAbroadEnquiry', msAbroadEnquirySchema);

// Export the model
module.exports = MsAbroadEnquiry;

// Handle the form submission for MS Abroad
website.post('/submit-ms-abroad-enquiry', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { firstName, lastName, email, mobile, program, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await MsAbroadEnquiry.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new enquiry object
        const newMsAbroadEnquiry = new MsAbroadEnquiry({
            firstName,
            lastName,
            email,
            mobile,
            program,
            city,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newMsAbroadEnquiry.save();
        console.log('MS Abroad enquiry saved successfully:', newMsAbroadEnquiry);

        // Send a success message to the client with an alert and redirect
        res.send(`
            <script>
                alert('MS Abroad enquiry submitted successfully!');
                window.location.href = '/msabroad'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving MS Abroad enquiry:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Route to fetch all MS Abroad enquiries (protected)
website.get('/ms-abroad-enquiries', isAuthenticated, async (req, res) => {
    try {
        // Fetch all MS Abroad enquiries from the database
        const msAbroadEnquiries = await MsAbroadEnquiry.find();

        // Render the admin panel template and pass the enquiries data
        res.render('panel/MS_Abroad_Ad', { msAbroadEnquiries: msAbroadEnquiries });
    } catch (error) {
        console.error('Error fetching MS Abroad enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});
// Route to delete an enquiry by ID
// Route to handle deleting an enquiry by its ID
// Route to delete an enquiry by ID
website.post('/delete-ms-abroad-enquiry/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id;  // Get the enquiry ID from the URL parameter

        // Delete the enquiry from the database using the _id
        await MsAbroadEnquiry.findByIdAndDelete(enquiryId);

        // After deletion, redirect back to the MS_Abroad_Ad page to see the updated list
        res.redirect('/ms-abroad-enquiries');
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ error: 'An error occurred while deleting the enquiry', details: error.message });
    }
});


// 3. Mba Admission...
// models/MbaEnquiry.js

// Define the schema for MBA Enquiry
const mbaEnquirySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    program: { type: String, required: true },
    mode: { type: String, required: true }, // Mode of study (online, offline, etc.)
    city: { type: String, required: true },
    authorize: { type: Boolean, required: true }, // Whether the enquiry is authorized or not
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the model
const MbaEnquiry = mongoose.model('MbaEnquiry', mbaEnquirySchema);

// Export the model
module.exports = MbaEnquiry;


// Route to display the form for submitting an MBA enquiry
website.get('/mba-enquiry', (req, res) => {
    res.render('Mba_Admission'); // Render the form page
});

// Handle the form submission for MBA Enquiry
website.post('/submit-mba-enquiry', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await MbaEnquiry.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new enquiry object
        const newMbaEnquiry = new MbaEnquiry({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newMbaEnquiry.save();
        console.log('MBA enquiry saved successfully:', newMbaEnquiry);

        // Send a success message to the client with an alert and redirect
        res.send(`
            <script>
                alert('MBA enquiry submitted successfully!');
                window.location.href = '/mba_admission'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving MBA enquiry:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Route to fetch all MBA enquiries (protected)
website.get('/mba_enquiries', isAuthenticated, async (req, res) => {
    try {
        // Fetch all MBA enquiries from the database
        const mbaEnquiries = await MbaEnquiry.find();

        // Render the admin panel template and pass the enquiries data
        res.render('panel/Mba_Ad', { mbaEnquiries: mbaEnquiries });
    } catch (error) {
        console.error('Error fetching MBA enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

// Route to delete an MBA enquiry by ID
website.post('/delete-mba-enquiry/:id', isAuthenticated, async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await MbaEnquiry.findByIdAndDelete(enquiryId);

        // Redirect back to the MBA enquiries page
        res.redirect('/mba_enquiries');
    } catch (error) {
        console.error('Error deleting MBA enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

//4  Phd Admission.....

// models/PhdEnquiry.js

// Define the schema for PhD Enquiry
const phdEnquirySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    program: { type: String, required: true },
    mode: { type: String, required: true }, // Mode of study (online, offline, etc.)
    city: { type: String, required: true },
    authorize: { type: Boolean, required: true }, // Whether the enquiry is authorized or not
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the model
const PhdEnquiry = mongoose.model('PhdEnquiry', phdEnquirySchema);

// Export the model
module.exports = PhdEnquiry;

// Route to display the form for submitting a PhD enquiry
website.get('/phd-enquiry', (req, res) => {
    res.render('Phd_Adroad'); // Render the form page
});


// Handle the form submission for PhD Enquiry
website.post('/submit-phd-enquiry', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await PhdEnquiry.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new enquiry object
        const newPhdEnquiry = new PhdEnquiry({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newPhdEnquiry.save();
        console.log('PhD enquiry saved successfully:', newPhdEnquiry);

        // Send a success message to the client with an alert and redirect
        res.send(`
            <script>
                alert('PhD enquiry submitted successfully!');
                window.location.href = '/phd-enquiry'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving PhD enquiry:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});


// Route to fetch all PhD enquiries (protected)
website.get('/phd_enquiries', isAuthenticated, async (req, res) => {
    try {
        // Fetch all PhD enquiries from the database
        const phdEnquiries = await PhdEnquiry.find();

        // Render the admin panel template and pass the enquiries data
        res.render('panel/Phd_enquiry', { phdEnquiries: phdEnquiries });
    } catch (error) {
        console.error('Error fetching PhD enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});


// Route to delete a PhD enquiry
// Route to delete a PhD enquiry by ID
website.post('/delete-phd-enquiry/:id', isAuthenticated, async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await PhdEnquiry.findByIdAndDelete(enquiryId);

        // Redirect back to the PhD enquiries page
        res.redirect('/phd_enquiries');
    } catch (error) {
        console.error('Error deleting PhD enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});


//  5.  IGCSE&IBTutoring.............

// Define the IGCSE&IBTutoring schema
// models/IGCSEIBTutoring.js

// Define the schema for IGCSE & IB Tutoring Enquiry
const igcseIBTutoringSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    program: { type: String, required: true },
    mode: { type: String, required: true }, // Mode of study (online, offline, etc.)
    city: { type: String, required: true },
    authorize: { type: Boolean, required: true }, // Whether the enquiry is authorized or not
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the model
const IGCSEIBTutoring = mongoose.model('IGCSEIBTutoring', igcseIBTutoringSchema);


// Export the model
module.exports = IGCSEIBTutoring;


// Route to display the form for IGCSE & IB Tutoring
website.get('/igcse-ib-tutoring', (req, res) => {
    res.render('IGCSE&IBTutoring'); // Render the form page
});


// Handle the form submission for IGCSE & IB Tutoring
website.post('/submit-igcse-ib-tutoring', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await IGCSEIBTutoring.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new enquiry object
        const newIGCSEIBTutoringEnquiry = new IGCSEIBTutoring({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newIGCSEIBTutoringEnquiry.save();
        console.log('IGCSE & IB Tutoring enquiry saved successfully:', newIGCSEIBTutoringEnquiry);

        // Send a success message to the client with an alert and redirect
        res.send(`
            <script>
                alert('IGCSE & IB Tutoring enquiry submitted successfully!');
                window.location.href = '/igcse-ib-tutoring'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving IGCSE & IB Tutoring enquiry:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});


// Route to fetch all IGCSE & IB Tutoring enquiries and render them in the view.
// Route to fetch all IGCSE & IB Tutoring enquiries (protected)
website.get('/igcse-ib-enquiries', isAuthenticated, async (req, res) => {
    try {
        // Fetch all IGCSE & IB Tutoring enquiries from the database
        const igcseIBEnquiries = await IGCSEIBTutoring.find();

        // Render the admin panel template and pass the enquiries data
        res.render('panel/IGCSE&IBTutoring_Ad', { igcseIBEnquiries: igcseIBEnquiries });
    } catch (error) {
        console.error('Error fetching IGCSE & IB Tutoring enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});


// Route to delete an IGCSE & IB Tutoring enquiry by ID
website.post('/delete-igcse-ib-enquiry/:id', isAuthenticated, async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await IGCSEIBTutoring.findByIdAndDelete(enquiryId);

        // Redirect back to the IGCSE & IB Tutoring enquiries page
        res.redirect('/igcse-ib-enquiries');
    } catch (error) {
        console.error('Error deleting IGCSE & IB Tutoring enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

//  Booking System............
// Define the Booking schema
// Define the schema for Booking
const bookingSchema = new mongoose.Schema({
    batchType: { type: String, required: true },
    course: { type: String, required: true },
    sessionDate: { type: Date, required: true },
    sessionDays: { type: String, required: true },
    sessionTime: { type: String, required: true },
    phone: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    center: { type: String, required: true },
    authorize: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now } // Add createdAt field
});

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model
module.exports = Booking;

// Route to display the booking form
website.get('/booking', (req, res) => {
    res.render('UpcomingBatches'); // Render the form page
});
// Handle the form submission for Booking
website.post('/submit-booking', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { batchType, course, sessionDate, sessionDays, sessionTime, phone, firstName, lastName, email, address, state, city, center, authorize } = req.body;

        // Check if the email or phone already exists in the database
        const existingBooking = await Booking.findOne({ $or: [{ email }, { phone }] });
        if (existingBooking) {
            return res.status(400).send('A booking with this email or phone already exists.');
        }

        // Create a new booking object
        const newBooking = new Booking({
            batchType,
            course,
            sessionDate,
            sessionDays,
            sessionTime,
            phone,
            firstName,
            lastName,
            email,
            address,
            state,
            city,
            center,
            authorize: authorize === 'on' // Convert checkbox value to boolean
        });

        // Save the new booking to the database
        await newBooking.save();
        console.log('Booking saved successfully:', newBooking);

        // Send a success message to the client with an alert and redirect
        res.send(`
            <script>
                alert('Booking submitted successfully!');
                window.location.href = '/booking'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving booking:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});


// Route to fetch all bookings (protected)
website.get('/upcoming-bookings', isAuthenticated, async (req, res) => {
    try {
        // Fetch all bookings from the database
        const bookings = await Booking.find();

        // Render the admin panel template and pass the bookings data
        res.render('panel/Upcoming_Booking_Ad', { bookings: bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'An error occurred while fetching the bookings', details: error.message });
    }
});


// Route to delete a booking entry
website.post('/delete-booking/:id', async (req, res) => {
    try {
        const bookingId = req.params.id; // Get the booking ID from the URL

        // Find the booking by ID and delete it
        await Booking.findByIdAndDelete(bookingId);

        console.log(`Booking with ID ${bookingId} deleted successfully`); // Log success
        res.redirect('/upcoming-bookings'); // Redirect back to the bookings page
    } catch (error) {
        console.error('Error deleting booking:', error); // Log the error
        res.status(500).send('An error occurred while deleting the booking.');
    }
});


//  Test Series...... Gre
website.get('/greOption', (req, res) => {
    res.render("testPre/Gre/Gre.ejs");
});

website.get('/grePractice', (req, res) => {
    res.render("testPre/Gre/GrePractice.ejs");
});

website.get('/greOnline', (req, res) => {
    res.render("testPre/Gre/GreOnline.ejs");
});

website.get('/greOverView', (req, res) => {
    res.render("testPre/Gre/GreOverview.ejs");
});

website.get('/greWord', (req, res) => {
    res.render("testPre/Gre/greWord.ejs");
});

website.get('/greSyllabus', (req, res) => {
    res.render("testPre/Gre/GreSyllabus");
});
website.get('/greEligibity', (req, res) => {
    res.render("testPre/Gre/GreEligibity");
});
website.get('/greTest', (req, res) => {
    res.render("testPre/Gre/GreTest");
});


//  GMAT....

website.get('/gmatOption', (req, res) => {
    res.render("testPre/GMAT/GMat");
});

website.get('/gmatPractice', (req, res) => {    
    res.render("testPre/GMAT/gmatPractice");
});

website.get('/gmatOnlines', (req, res) => {     
    res.render("testPre/GMAT/gmatOnline");
});

website.get('/gmatBook', (req, res) => {     
    res.render("testPre/GMAT/gmatBooks");     
});

website.get('/gmatExam', (req, res) => {     
    res.render("testPre/GMAT/gmatExams");
});

website.get('/GmatSyllabus', (req, res) => {     
    res.render("testPre/GMAT/GmatSyllabus");
});

website.get('/gmatEligibity', (req, res) => {     
    res.render("testPre/GMAT/gmatEligibity");
});


website.get('/gmatCalculator', (req, res) => {     
    res.render("testPre/GMAT/gmatCalculator");
});

//  SAT

website.get('/satPre', (req, res) => {     
    res.render("testPre/SAT/satPre");
});

website.get('/satPractice', (req, res) => {     
    res.render("testPre/SAT/satPractice");
});

website.get('/satOnline', (req, res) => {     
    res.render("testPre/SAT/satOnline");
});

website.get('/satRegistration', (req, res) => {     
    res.render("testPre/SAT/satRegistration");
});

website.get('/satPattern', (req, res) => {     
    res.render("testPre/SAT/satPattern");
});


website.get('/satSyllabus', (req, res) => {     
    res.render("testPre/SAT/satSyllabus");
});


website.get('/satEligibility', (req, res) => {     
    res.render("testPre/SAT/satEligibility");
});


website.get('/satDates', (req, res) => {     
    res.render("testPre/SAT/satDates");
});


website.get('/actpre', (req, res) => {     
    res.render("testPre/ACT/ActPre");
});


website.get('/actexam', (req, res) => {     
    res.render("testPre/ACT/ActExam");
});


website.get('/satvsact', (req, res) => {     
    res.render("testPre/ACT/SatVsAct");
});

// IELTS...


website.get('/ieltspre', (req, res) => {     
    res.render("testPre/IELTS/IELTSPre");
});


website.get('/ieltsOnline', (req, res) => {     
    res.render("testPre/IELTS/IELTSOnline");
});


website.get('/ieltsExam', (req, res) => {     
    res.render("testPre/IELTS/IELTSExam");
});


website.get('/ieltsPattern', (req, res) => {     
    res.render("testPre/IELTS/IELTSPattern");
});


website.get('/ieltsBook', (req, res) => {     
    res.render("testPre/IELTS/IELTSBook");
});


website.get('/ieltsPraTest', (req, res) => {     
    res.render("testPre/IELTS/IELTSPracTest");
});


website.get('/ieltsSyllabus', (req, res) => {     
    res.render("testPre/IELTS/IELTSSyllabus");
});


website.get('/ieltsEligibility', (req, res) => {     
    res.render("testPre/IELTS/IELTSEligibility");
});

// TOEFL


website.get('/toeflPre', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLPre");
});

website.get('/toeflPrep', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLPrep");
});

website.get('/toeflSyllabus', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLSyllabus");
});

website.get('/toeflEligibility', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLEligibility");
});

website.get('/toeflPattern', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLPattern");
});


website.get('/toeflTestPre', (req, res) => {     
    res.render("testPre/TOEFL/TOEFLTestPrep");
});


// AP

website.get('/apPre', (req, res) => {     
    res.render("testPre/AP/APPre");
});

website.get('/apExam', (req, res) => {     
    res.render("testPre/AP/APExam");
});

// PTE

website.get('/ptePre', (req, res) => {     
    res.render("testPre/PTE/PTEPre");
});

website.get('/pteSyllabus', (req, res) => {     
    res.render("testPre/PTE/PTESyllabus");
});


website.get('/pteEligibility', (req, res) => {     
    res.render("testPre/PTE/PTEEligibility");
});

//  CBSE

website.get('/10th', (req, res) => {     
    res.render("testPre/CBSE/10th");
});


website.get('/11th', (req, res) => {     
    res.render("testPre/CBSE/11th");
});


website.get('/12th', (req, res) => {     
    res.render("testPre/CBSE/12th");
});


//  Working On TestPreAdmin(All pages like.................)
// Gre Admin.....

// 1.Gre Schema and Model

// Define the GreTest schema
const greTestSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String,
    mode: String,
    city: String,
    authorize: Boolean,
});

// Create and export the GreTest model
const GreTest = mongoose.model('GreTest', greTestSchema);
module.exports = GreTest;
// Render the GRE form page

// Route to display the form for GRE Test
website.get('/greOption', (req, res) => {
    res.render('panel/testPre/Gre/Gre.ejs'); // Render the form page
});


// Route to handle the form submission for GRE Test
website.post('/submit-greTest', async (req, res) => {
    try {
        console.log('Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await GreTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new GreTest enquiry object
        const newGreTest = new GreTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newGreTest.save();

        console.log('GreTest enquiry saved successfully'); // Log success

        // Send a success message to the client
        res.send(`
            <script>
                alert('Form submitted successfully!');
                window.location.href = '/greOption'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving GreTest enquiry:', error); // Log the full error
        res.status(500).send('An error occurred while submitting the form.');
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all GreTest enquiries (protected)
website.get('/greTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const greTestEnquiries = await GreTest.find(); // Fetch all GreTest enquiries
        res.render('panel/testpreAdmin/greAdmin', { greTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching GreTest enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;


// Route to delete a GreTest enquiry by ID
website.post('/delete-greTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await GreTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/greTest-enquiries');
    } catch (error) {
        console.error('Error deleting GreTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

// 2. GMAT  Schema and Model


// Define the GMAT schema
const gmatTestSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String,
    mode: String,
    city: String,
    authorize: Boolean,
});

// Create and export the GMAT model
const GmatTest = mongoose.model('GmatTest', gmatTestSchema);
module.exports = GmatTest;

// Route to display the form for GMAT Test
website.get('/gmatOption', (req, res) => {
    res.render('panel/testPre/Gmat/Gmat.ejs'); // Render the form page
});

// Route to handle the form submission for GMAT Test
website.post('/submit-gmatTest', async (req, res) => {
    try {
        console.log('Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await GmatTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new GMAT enquiry object
        const newGmatTest = new GmatTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newGmatTest.save();

        console.log('GMAT enquiry saved successfully'); // Log success

        // Send a success message to the client
        res.send(`
            <script>
                alert('Form submitted successfully!');
                window.location.href = '/gmatOption'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving GMAT enquiry:', error); // Log the full error
        res.status(500).send('An error occurred while submitting the form.');
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all GMAT enquiries (protected)
website.get('/gmatTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const gmatTestEnquiries = await GmatTest.find(); // Fetch all GMAT enquiries
        res.render('panel/testpreAdmin/gmatAdmin', { gmatTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching GMAT enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;


// Route to delete a GreTest enquiry by ID
website.post('/delete-gmatTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await GmatTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/gmatTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});


// 3. SAT  Schema and Model

// Define the GMAT schema
const satTestSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String,
    mode: String,
    city: String,
    authorize: Boolean,
});

// Create and export the GMAT model
const satTest = mongoose.model('satTest', satTestSchema);
module.exports = satTest;

// Route to display the form for GMAT Test
website.get('/satPractice', (req, res) => {
    res.render('panel/testPre/SAT/satPractice.ejs'); // Render the form page
});

// Route to handle the form submission for GMAT Test
website.post('/submit-satTest', async (req, res) => {
    try {
        console.log('Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await satTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new GMAT enquiry object
        const newSatTest = new satTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newSatTest.save();

        console.log('Sat enquiry saved successfully'); // Log success

        // Send a success message to the client
        res.send(`
            <script>
                alert('Form submitted successfully!');
                window.location.href = '/satPractice'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving GMAT enquiry:', error); // Log the full error
        res.status(500).send('An error occurred while submitting the form.');
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all GMAT enquiries (protected)
website.get('/satTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const  satTestEnquiries = await satTest.find(); // Fetch all GMAT enquiries
        res.render('panel/testpreAdmin/SatAdmin', { satTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching GMAT enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;


// Route to delete a SATTest enquiry by ID
website.post('/delete-satTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await satTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/satTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});


// 4. ACT Schema and Model...

// Define the ACT schema
const actTestSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String,
    mode: String,
    city: String,
    authorize: Boolean,
});

// Create and export the ACT model
const ActTest = mongoose.model('ActTest', actTestSchema);
module.exports = ActTest;


// Route to display the form for ACT Test
website.get('/actexam', (req, res) => {
    res.render('panel/testPre/Act/ACTExam.ejs'); // Render the form page
});

// Route to handle the form submission for ACT Test
website.post('/submit-actTest', async (req, res) => {
    try {
        console.log('Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await ActTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new ACT enquiry object
        const newActTest = new ActTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newActTest.save();
        console.log('ACT enquiry saved successfully:', newActTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('Form submitted successfully!');
                window.location.href = '/actExam'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving ACT enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all ACT enquiries (protected)
website.get('/actTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const actTestEnquiries = await ActTest.find(); // Fetch all ACT enquiries
        res.render('panel/testpreAdmin/actAdmin', { actTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching ACT enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;


// Route to delete a SATTest enquiry by ID
website.post('/delete-actTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await ActTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/actTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

// 5. IELTS schema & modal...

// Define the IELTS schema
const ieltsTestSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String, // e.g., Academic or General Training
    mode: String, // e.g., Online or Offline
    city: String,
    authorize: Boolean, // Checkbox for authorization
});

// Create and export the IELTS model
const IeltsTest = mongoose.model('ieits_test', ieltsTestSchema);
module.exports = IeltsTest;


// Route to display the form for IELTS Test
website.get('/ieltspre', (req, res) => {
    res.render('panel/testPre/Ielts/IELTSPre.ejs'); // Render the IELTS form page
});

// Route to handle the form submission for IELTS Test
website.post('/submit-ieltsTest', async (req, res) => {
    try {
        console.log('IELTS Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await IeltsTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new IELTS enquiry object
        const newIeltsTest = new IeltsTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newIeltsTest.save();
        console.log('IELTS enquiry saved successfully:', newIeltsTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('IELTS Form submitted successfully!');
                window.location.href = '/ieltspre'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving IELTS enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all IELTS enquiries (protected)
website.get('/ieltsTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const ieltsTestEnquiries = await IeltsTest.find(); // Fetch all IELTS enquiries
        res.render('panel/testpreAdmin/ieltsAdmin', { ieltsTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching IELTS enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;



// Route to delete a SATTest enquiry by ID
website.post('/delete-ieltsTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await IeltsTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/ieltsTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

// 6. TOEFL schema & modal...


// Define the TOEFL schema
const toeflSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String, // e.g., Academic or General Training
    mode: String, // e.g., Online or Offline
    city: String,
    authorize: Boolean, // Checkbox for authorization
});

// Create the TOEFL model
const ToeflTest = mongoose.model('toefl_test', toeflSchema);
module.exports = ToeflTest;


// Route to display the form for TOEFL Test
website.get('/toeflPre', (req, res) => {
    res.render('panel/testPre/Toefl/TOEFLPre.ejs'); // Render the TOEFL form page
});

// Route to handle the form submission for TOEFL Test
website.post('/submit-toeflTest', async (req, res) => {
    try {
        console.log('TOEFL Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await ToeflTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new TOEFL enquiry object
        const newToeflTest = new ToeflTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newToeflTest.save();
        console.log('TOEFL enquiry saved successfully:', newToeflTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('TOEFL Form submitted successfully!');
                window.location.href = '/TOEFLPre'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving TOEFL enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all TOEFL enquiries (protected)
website.get('/toeflTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const toeflTestEnquiries = await ToeflTest.find(); // Fetch all TOEFL enquiries
        res.render('panel/testpreAdmin/toeflAdmin', { toeflTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching TOEFL enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;



// Route to delete a SATTest enquiry by ID
website.post('/delete-toeflTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await ToeflTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/toeflTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});


  // 7. AP Schema & Modal


  // Import mongoose for MongoDB interactions

// Define the ACT schema
const apSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String, // e.g., Academic or General Training
    mode: String, // e.g., Online or Offline
    city: String,
    authorize: Boolean, // Checkbox for authorization
});

// Create the ACT model
const ApTest = mongoose.model('ap_Test', apSchema);
module.exports = ApTest;


// Route to display the form for ACT Test
website.get('/apPre', (req, res) => {
    res.render('panel/testPre/AP/APPre.ejs'); // Render the ACT form page
});

// Route to handle the form submission for ACT Test
website.post('/submit-apTest', async (req, res) => {
    try {
        console.log('Ap Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await ApTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new ACT enquiry object
        const newApTest = new ApTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newApTest.save();
        console.log('Ap enquiry saved successfully:', newApTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('Ap Form submitted successfully!');
                window.location.href = '/apPre'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving Ap enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all ACT enquiries (protected)
website.get('/apTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const apTestEnquiries = await ApTest.find(); // Fetch all ACT enquiries
        res.render('panel/testpreAdmin/apAdmin', { apTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching Ap enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;


// Route to delete a SATTest enquiry by ID
website.post('/delete-apTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await ApTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/apTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

// CBSE SCHEMA & MODAL.........

// Define the CBSE schema
const cbseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String, // e.g., Academic or General Training
    mode: String, // e.g., Online or Offline
    city: String,
    authorize: Boolean, // Checkbox for authorization
});

// Create the CBSE model
const CbseTest = mongoose.model('cbse_Test', cbseSchema);
// Export the CBSE model
module.exports = CbseTest;


// Route to display the form for CBSE Test
website.get('/11th', (req, res) => {
    res.render('panel/testPre/Cbse/11th.ejs'); // Render the CBSE form page
});

// Route to handle the form submission for CBSE Test
website.post('/submit-cbseTest', async (req, res) => {
    try {
        console.log('CBSE Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await CbseTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new CBSE enquiry object
        const newCbseTest = new CbseTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newCbseTest.save();
        console.log('CBSE enquiry saved successfully:', newCbseTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('CBSE Form submitted successfully!');
                window.location.href = '/10th'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving CBSE enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all CBSE enquiries (protected)
website.get('/cbseTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const cbseTestEnquiries = await CbseTest.find(); // Fetch all CBSE enquiries
        res.render('panel/testpreAdmin/cbseAdmin', { cbseTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching CBSE enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});

module.exports = website;



// Route to delete a SATTest enquiry by ID
website.post('/delete-cbseTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await CbseTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/cbseTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

// 8. PTE Schema & Modal

// Import mongoose for MongoDB interaction

// Define the PTE schema
const pteSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    program: String, // e.g., Academic or General Training
    mode: String, // e.g., Online or Offline
    city: String,
    authorize: Boolean, // Checkbox for authorization
});

// Create the PTE model
const PteTest = mongoose.model('PteTest', pteSchema);

// Export the PTE model
module.exports = PteTest;


// Route to display the form for PTE Test
website.get('/pteexam', (req, res) => {
    res.render('panel/testPre/PTE/PTEPre.ejs'); // Render the PTE form page
});

// Route to handle the form submission for PTE Test
website.post('/submit-pteTest', async (req, res) => {
    try {
        console.log('PTE Form data received:', req.body); // Log the form data

        const { firstName, lastName, email, mobile, program, mode, city, authorize } = req.body;

        // Check if the email or mobile already exists in the database
        const existingEnquiry = await PteTest.findOne({ $or: [{ email }, { mobile }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or mobile already exists.');
        }

        // Create a new PTE enquiry object
        const newPteTest = new PteTest({
            firstName,
            lastName,
            email,
            mobile,
            program,
            mode,
            city,
            authorize: authorize === 'on', // Convert checkbox value to boolean
        });

        // Save the new enquiry to the database
        await newPteTest.save();
        console.log('PTE enquiry saved successfully:', newPteTest); // Log the saved data

        // Send a success message to the client
        res.send(`
            <script>
                alert('PTE Form submitted successfully!');
                window.location.href = '/PTEPre'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving PTE enquiry:', error.message); // Log the error message
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});

// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}

// Route to fetch all PTE enquiries (protected)
website.get('/pteTest-enquiries', isAuthenticated, async (req, res) => {
    try {
        const pteTestEnquiries = await PteTest.find(); // Fetch all PTE enquiries
        res.render('panel/testpreAdmin/pteAdmin', { pteTestEnquiries }); // Pass the data to EJS
    } catch (error) {
        console.error('Error fetching PTE enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the enquiries', details: error.message });
    }
});



// Route to delete a SATTest enquiry by ID
website.post('/delete-pteTest/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await PteTest.findByIdAndDelete(enquiryId);

        // Redirect back to the GreTest enquiries page
        res.redirect('/pteTest-enquiries');
    } catch (error) {
        console.error('Error deleting GmatTest enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});

module.exports = website;

//  Free demo Video Upload....


// FOR Contact & about form... modal shema



// Define the CourseEnquiry schema
const courseEnquirySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courseInterest: { type: String, required: true },
    preferredMode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the CourseEnquiry model
const CourseEnquiry = mongoose.model('CourseEnquiry', courseEnquirySchema);

module.exports = CourseEnquiry; // Export the model correctly



website.post('/submit-course-enquiry', async (req, res) => {
    try {
        // Log the form data
        console.log('Form data received:', req.body);

        // Extract form data from the request body
        const { fullName, email, phone, courseInterest, preferredMode } = req.body;

        // Check if the email or phone already exists in the database
        const existingEnquiry = await CourseEnquiry.findOne({ $or: [{ email }, { phone }] });
        if (existingEnquiry) {
            return res.status(400).send('An enquiry with this email or phone already exists.');
        }

        // Create a new enquiry object
        const newCourseEnquiry = new CourseEnquiry({
            fullName,
            email,
            phone,
            courseInterest,
            preferredMode
        });

        // Save the new enquiry to the database
        await newCourseEnquiry.save();
        console.log('Course enquiry saved successfully:', newCourseEnquiry);

        // Send a success message to the client
        res.send(`
            <script>
                alert('Course enquiry submitted successfully!');
                window.location.href = '/contact&about'; // Redirect to the form page
            </script>
        `);
    } catch (error) {
        console.error('Error saving course enquiry:', error.message);
        res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
    }
});


// Middleware to check if the user is authorized
function isAuthenticated(req, res, next) {
    // Example: Check if the user is logged in (you can use sessions, tokens, etc.)
    const isLoggedIn = true; // Replace with your actual authentication logic

    if (isLoggedIn) {
        next(); // User is authorized, proceed to the next middleware/route
    } else {
        res.status(403).send('Unauthorized access. Please log in.'); // User is not authorized
    }
}


// Route to fetch all course enquiries (protected)
website.get('/course-enquiries', isAuthenticated, async (req, res) => {
    try {
        // Fetch all course enquiries from the database
        const courseEnquiries = await CourseEnquiry.find();

        // Render the admin panel template and pass the course enquiries data
        res.render('panel/CourseAdmin', { courseEnquiries });
    } catch (error) {
        console.error('Error fetching course enquiries:', error);
        res.status(500).json({ error: 'An error occurred while fetching the course enquiries', details: error.message });
    }
});


// Route to delete a CourseEnquiry by ID
website.post('/delete-course-enquiry/:id', async (req, res) => {
    try {
        const enquiryId = req.params.id; // Get the ID from the URL

        // Find the enquiry by ID and delete it
        await CourseEnquiry.findByIdAndDelete(enquiryId);

        // Redirect back to the course enquiries page
        res.redirect('/course-enquiries');
    } catch (error) {
        console.error('Error deleting course enquiry:', error);
        res.status(500).send('An error occurred while deleting the enquiry.');
    }
});


// Define Video Schema and Model
const VideoSchema = new mongoose.Schema({
    examType: { type: String, required: true },
    description: { type: String, required: true },
    videoPath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

const Video = mongoose.model('freedemo_video', VideoSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi']; // Add more MIME types if needed
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
};

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 }, fileFilter });

// Serve static files
website.use(express.static('public'));

// Set up EJS as the view engine
website.set('view engine', 'ejs');
website.set('views', path.join(__dirname, 'views'));

// Admin Panel: Upload Page
// website.get('/freeDemoAdmin', (req, res) => {
//     res.render('panel/freeDemoAdmin');
// });

// Handle Video Upload
website.post('/upload', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('<script>alert("❌ Please upload a video file."); window.location="/freeDemoAdmin";</script>');
        }

        const { examType, description } = req.body;
        const videoPath = `/uploads/${req.file.filename}`;

        const newVideo = new Video({ examType, description, videoPath });
        await newVideo.save();

        res.send('<script>alert("✅ Video uploaded successfully!"); window.location="/freeDemoAdmin";</script>');
    } catch (err) {
        console.error('❌ Error saving video to database:', err);

        // Handle Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('<script>alert("❌ File size exceeds the 100MB limit."); window.location="/freeDemoAdmin";</script>');
        }
        if (err.message === 'Invalid file type. Only video files are allowed.') {
            return res.status(400).send('<script>alert("❌ Invalid file type. Only video files are allowed."); window.location="/freeDemoAdmin";</script>');
        }

        res.status(500).send(`❌ Internal Server Error: ${err.message}`);
    }
});

// Display Videos in Free Demo Page
website.get('/freeDemo', async (req, res) => {
    try {
        // Fetch all videos from the database
        const videos = await Video.find();

        // Render the freeDemo template and pass the videos data
        res.render('freeDemo', { videos });
    } catch (err) {
        console.error('❌ Error fetching videos:', err);
        res.status(500).send("❌ Internal Server Error: Could not fetch videos");
    }
});

// Display Videos in Free Demo Page Admin

website.get('/freeDemoAdmin', async (req, res) => {
    try {
        const videos = await Video.find();
        console.log('✅ Videos fetched for admin panel:', videos); // Debugging

        if (videos.length === 0) {
            console.log('⚠️ No videos found in the database.');
        }

        res.render('panel/freeDemoAdmin', { videos });
    } catch (err) {
        console.error('❌ Error fetching videos:', err);
        res.status(500).send("❌ Internal Server Error: Could not fetch videos");
    }
});

// Route to delete a video by ID
website.post('/delete-video/:id', async (req, res) => {
    try {
        const videoId = req.params.id; // Get the video ID from the URL

        // Find the video by ID and delete it
        const deletedVideo = await Video.findByIdAndDelete(videoId);

        if (!deletedVideo) {
            return res.status(404).send('Video not found.');
        }

        // Optionally, delete the video file from the server
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'public', deletedVideo.videoPath);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('❌ Error deleting video file:', err);
            }
        });

        // Redirect back to the admin panel
        res.redirect('/freeDemoAdmin');
    } catch (error) {
        console.error('❌ Error deleting video:', error);
        res.status(500).send('An error occurred while deleting the video.');
    }
});


// For Delete Free Deme Clases from 

// User Schema
const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true }
  });
  const User = mongoose.model('User', userSchema);
  
  // Temporary OTP storage
  const otpStore = {};
  
  // Routes
  website.get('/', (req, res) => res.render('login'));
  
  website.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    
    try {
      // Check if user exists
      const user = await User.findOne({ mobile });
      if (!user) return res.send('Mobile not registered!');
  
      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000);
      otpStore[mobile] = otp;
      console.log(`OTP for ${mobile}: ${otp}`); // Replace with SMS service
  
      req.session.mobile = mobile;
      res.render('login/verify');
    } catch (err) {
      res.send('Server error');
    }
  });
  
  website.post('/verify', (req, res) => {
    const { otp } = req.body;
    const mobile = req.session.mobile;
  
    if (otpStore[mobile] && otpStore[mobile] == otp) {
      delete otpStore[mobile];
      res.send('<h1>Login Successful!</h1>');
    } else {
      res.send('Invalid OTP! <a href="/">Try again</a>');
    }
  });


  
website.get('/login', (req, res) => {     
    res.render("login/login");
});


website.get('/verify', (req, res) => {     
    res.render("login/verify");
});

// Start the server on port 3000
website.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
});
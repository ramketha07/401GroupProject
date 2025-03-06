// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const admin = require("firebase-admin");
// const session = require("express-session");
// const serviceAccount = require("./auth.json");
// const app = express();
// const port = 3000;

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();  // Initialize Firestore

// // Middleware setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// // Session setup
// app.use(session({
//     secret: 'your-secret-key', // Use a secure secret key in production
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 } // Session expires after 60 seconds
// }));

// // Route to render the home page
// app.get("/", (req, res) => {
//     res.render("Home");
// });

// // Route to render the signup page
// app.get("/signup", (req, res) => {
//     res.render("signup");
// });

// // Route to render the login page
// app.get("/login", (req, res) => {
//     res.render("login", { loginError: null });
// });

// // Signup route
// app.post("/signup", async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const userRecord = await admin.auth().createUser({
//             email: email,
//             password: password,
//         });

//         console.log(`Successfully created new user: ${userRecord.uid}`);

//         // Store user in session
//         req.session.user = { uid: userRecord.uid, email: email };

//         // Redirect to profile update page after signup
//         res.redirect(`/profile?uid=${userRecord.uid}`);
//     } catch (error) {
//         console.error("Error creating new user:", error);
//         res.status(500).send("Signup failed!");
//     }
// });

// // Login route
// app.post("/login", async (req, res) => {
//     const { loginemail: email, loginpassword: password } = req.body;

//     try {
//         const user = await admin.auth().getUserByEmail(email);

//         if (user) {
//             console.log(`User found: ${user.uid}`);

//             // Store user in session
//             req.session.user = { uid: user.uid, email: email };

//             // Fetch the user profile from Firestore
//             const userProfileDoc = await db.collection('userProfiles').doc(user.uid).get();

//             if (userProfileDoc.exists) {
//                 // If the profile exists, redirect to the bot page
//                 res.redirect(`/bot?uid=${user.uid}`);
//             } else {
//                 // If the profile doesn't exist, redirect to the profile update page
//                 res.redirect(`/profile?uid=${user.uid}`);
//             }
//         } else {
//             res.render("login", { loginError: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error("Error signing in:", error);
//         res.render("login", { loginError: "Login failed!" });
//     }
// });

// // Route to render the profile update page
// app.get("/profile", async (req, res) => {
//     const uid = req.query.uid || (req.session.user && req.session.user.uid);

//     if (!uid) {
//         return res.redirect("/login");
//     }

//     try {
//         // Fetch user profile from Firestore
//         const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
//         const userProfile = userProfileDoc.exists ? userProfileDoc.data() : {
//             username: '',
//             occupation: '',
//             salary: '',
//             loan: '',
//             expenses: '',
//             savings: '',
//             policy: '',
//             property: '',
//             description: ''
//         };

//         res.render("profile", { user: userProfile, uid: uid });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         res.status(500).send("Failed to load profile.");
//     }
// });

// // Route to handle profile submission
// app.post("/profile", async (req, res) => {
//     const uid = req.body.uid || (req.session.user && req.session.user.uid);
//     if (!uid) {
//         return res.redirect("/login");
//     }

//     const userProfile = {
//         username: req.body.username,
//         occupation: req.body.occupation,
//         salary: req.body.salary,
//         loan: req.body.loan,
//         expenses: req.body.expenses,
//         savings: req.body.savings,
//         policy: req.body.policy,
//         property: req.body.property,
//         description: req.body.description,
//     };

//     try {
//         // Store the profile in Firestore
//         await db.collection('userProfiles').doc(uid).set(userProfile);

//         // After updating the profile, redirect to the bot page
//         res.redirect(`/bot?uid=${uid}`);
//     } catch (error) {
//         console.error("Error saving user profile:", error);
//         res.status(500).send("Failed to save profile.");
//     }
// });

// // Route to render the bot page
// app.get("/bot", async (req, res) => {
//     // Get user from session
//     const user = req.session.user;

//     if (!user) {
//         // Redirect to login if not authenticated
//         return res.redirect('/login');
//     }

//     const uid = user.uid;

//     try {
//         // Fetch user profile from Firestore
//         const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
//         if (!userProfileDoc.exists) {
//             // If the profile is not updated, redirect to profile update page
//             return res.redirect(`/profile?uid=${uid}`);
//         }

//         const userProfile = userProfileDoc.data();
//         // Render the bot page, passing the user's profile data
//         res.render("bot", { user: userProfile });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         res.status(500).send("Failed to load bot page.");
//     }
// });

// // Route to render the About Us page
// app.get("/about", (req, res) => {
//     res.render("About");
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });












// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const dotEnv = require("dotenv");
// const app = express();

// const port = 3000;
// dotEnv.config();

// // MongoDB setup
// const uri = process.env.MONGO_URI;
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // Define schemas
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const profileSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   username: String,
//   occupation: String,
//   salary: Number,
//   loan: Number,
//   expenses: Number,
//   savings: Number,
//   policy: String,
//   property: String,
//   description: String,
// });

// const User = mongoose.model("User", userSchema);
// const Profile = mongoose.model("Profile", profileSchema);

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// // Session setup
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }, // 60 seconds for testing purposes
//   })
// );

// // Routes

// // Home page
// app.get("/", (req, res) => {
//   res.render("Home");
// });

// // Signup page
// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

// // Login page
// app.get("/login", (req, res) => {
//   res.render("login", { loginError: null });
// });

// // Signup route
// app.post("/signup", async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const newUser = new User({ email, password });
//     await newUser.save();

//     const defaultProfile = new Profile({
//       userId: newUser._id,
//       username: username || "",
//     });
//     await defaultProfile.save();

//     req.session.user = { id: newUser._id, email: newUser.email };
//     res.redirect("/profile");
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send("Signup failed!");
//   }
// });

// // Login route
// app.post("/login", async (req, res) => {
//   const { loginemail: email, loginpassword: password } = req.body;

//   try {
//     const user = await User.findOne({ email, password });

//     if (user) {
//       req.session.user = { id: user._id, email: user.email };
//       res.redirect("/profile");
//     } else {
//       res.render("login", { loginError: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     res.render("login", { loginError: "Login failed!" });
//   }
// });

// // Profile page
// app.get("/profile", async (req, res) => {
//   const userId = req.session.user?.id;

//   if (!userId) {
//     return res.redirect("/login");
//   }

//   try {
//     const userProfile = await Profile.findOne({ userId });

//     if (!userProfile) {
//       const defaultProfile = new Profile({ userId });
//       await defaultProfile.save();
//     }

//     res.render("profile", { user: userProfile });
//   } catch (error) {
//     console.error("Profile error:", error);
//     res.status(500).send("Failed to load profile.");
//   }
// });

// // Bot page
// app.get("/bot", (req, res) => {
//   res.render("bot");
// });

// // About Us page
// app.get("/about", (req, res) => {
//   res.render("About");
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// Working:-

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const admin = require("firebase-admin");
// const session = require("express-session");
// const { markdown } = require("markdown");
// const serviceAccount = require("./auth.json");
// const app = express();
// const port = 3000;

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore(); // Initialize Firestore

// // Middleware setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// // Session setup
// app.use(session({
//     secret: 'your-secret-key', // Use a secure secret key in production
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 } // Session expires after 60 seconds
// }));

// // Route to render the home page
// app.get("/", (req, res) => {
//     res.render("Home");
// });

// // Route to render the signup page
// app.get("/signup", (req, res) => {
//     res.render("signup");
// });

// // Route to render the login page
// app.get("/login", (req, res) => {
//     res.render("login", { loginError: null });
// });

// // Signup route
// app.post("/signup", async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         const userRecord = await admin.auth().createUser({
//             email: email,
//             password: password,
//         });

//         console.log(`Successfully created new user: ${userRecord.uid}`);
//         req.session.user = { uid: userRecord.uid, email: email };
//         res.redirect(`/profile?uid=${userRecord.uid}`);
//     } catch (error) {
//         console.error("Error creating new user:", error);
//         res.status(500).send("Signup failed!");
//     }
// });

// // Login route
// app.post("/login", async (req, res) => {
//     const { loginemail: email, loginpassword: password } = req.body;
//     try {
//         const user = await admin.auth().getUserByEmail(email);
//         if (user) {
//             req.session.user = { uid: user.uid, email: email };
//             const userProfileDoc = await db.collection('userProfiles').doc(user.uid).get();
//             if (userProfileDoc.exists) {
//                 res.redirect(`/bot?uid=${user.uid}`);
//             } else {
//                 res.redirect(`/profile?uid=${user.uid}`);
//             }
//         } else {
//             res.render("login", { loginError: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error("Error signing in:", error);
//         res.render("login", { loginError: "Login failed!" });
//     }
// });

// // Route to render the bot page
// app.get("/bot", async (req, res) => {
//     const user = req.session.user;
//     if (!user) return res.redirect('/login');

//     const uid = user.uid;
//     try {
//         const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
//         if (!userProfileDoc.exists) return res.redirect(`/profile?uid=${uid}`);

//         const userProfile = userProfileDoc.data();
//         let responses = req.session.responses || [];

//         responses = responses.map(response => ({
//             question: response.question,
//             answer: markdown.toHTML(response.answer)
//         }));

//         res.render("bot", { user: userProfile, responses });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         res.status(500).send("Failed to load bot page.");
//     }
// });

// // Route to render the profile update page
// app.get("/profile", async (req, res) => {
//     const uid = req.query.uid || (req.session.user && req.session.user.uid);
//     if (!uid) return res.redirect("/login");

//     try {
//         const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
//         const userProfile = userProfileDoc.exists ? userProfileDoc.data() : {
//             username: '', occupation: '', salary: '', loan: '', expenses: '',
//             savings: '', policy: '', property: '', description: ''
//         };
//         res.render("profile", { user: userProfile, uid: uid });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         res.status(500).send("Failed to load profile.");
//     }
// });

// // Route to render the About Us page
// app.get("/about", (req, res) => {
//     res.render("About");
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const admin = require("firebase-admin");
const session = require("express-session");
const { markdown } = require("markdown");
const serviceAccount = require("./auth.json");

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Use a secure secret key in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Session expires after 60 seconds
}));

// Route to render the home page
app.get("/", (req, res) => {
    res.render("Home");
});

// Route to render the signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Route to render the login page
app.get("/login", (req, res) => {
    res.render("login", { loginError: null });
});

// Signup route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        console.log(`Successfully created new user: ${userRecord.uid}`);
        req.session.user = { uid: userRecord.uid, email: email };

        // Save default profile data in Firestore
        await db.collection("userProfiles").doc(userRecord.uid).set({
            username,
            occupation: '',
            salary: '',
            loan: '',
            expenses: '',
            savings: '',
            policy: '',
            property: '',
            description: ''
        });

        res.redirect(`/profile?uid=${userRecord.uid}`);
    } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).send("Signup failed!");
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { loginemail: email, loginpassword: password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        if (user) {
            req.session.user = { uid: user.uid, email: email };
            const userProfileDoc = await db.collection('userProfiles').doc(user.uid).get();
            if (userProfileDoc.exists) {
                res.redirect(`/bot?uid=${user.uid}`);
            } else {
                res.redirect(`/profile?uid=${user.uid}`);
            }
        } else {
            res.render("login", { loginError: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error signing in:", error);
        res.render("login", { loginError: "Login failed!" });
    }
});

// Route to render the bot page
app.get("/bot", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    const uid = user.uid;
    try {
        const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
        if (!userProfileDoc.exists) return res.redirect(`/profile?uid=${uid}`);

        const userProfile = userProfileDoc.data();
        let responses = req.session.responses || [];

        responses = responses.map(response => ({
            question: response.question,
            answer: markdown.toHTML(response.answer)
        }));

        res.render("bot", { user: userProfile, responses });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Failed to load bot page.");
    }
});

// Route to render the profile update page
app.get("/profile", async (req, res) => {
    const uid = req.query.uid || (req.session.user && req.session.user.uid);
    if (!uid) return res.redirect("/login");

    try {
        const userProfileDoc = await db.collection('userProfiles').doc(uid).get();
        const userProfile = userProfileDoc.exists ? userProfileDoc.data() : {
            username: '', occupation: '', salary: '', loan: '', expenses: '',
            savings: '', policy: '', property: '', description: ''
        };
        res.render("profile", { user: userProfile, uid: uid });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Failed to load profile.");
    }
});

// Route to handle profile updates
app.post("/profile", async (req, res) => {
    const uid = req.session.user ? req.session.user.uid : null;
    if (!uid) return res.redirect("/login");

    const { username, occupation, salary, loan, expenses, savings, policy, property, description } = req.body;

    try {
        // Save profile data in Firestore
        await db.collection("userProfiles").doc(uid).set({
            username,
            occupation,
            salary,
            loan,
            expenses,
            savings,
            policy,
            property,
            description
        });

        console.log("Profile updated successfully!");
        res.redirect(`/bot?uid=${uid}`);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Failed to update profile.");
    }
});

// Route to render the About Us page
app.get("/about", (req, res) => {
    res.render("About");
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Logout failed!");
        }
        res.redirect("/login");
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
// Server setup
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

// Email transporter
const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true,
});

contactEmail.verify((error) => {
  if (error) {
    console.log("Error verifying email transporter:", error);
  } else {
    console.log("Ready to Send");
  }
});

// Contact form route
router.post("/contact", (req, res) => {
  const name = req.body.firstName + " " + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: process.env.EMAIL_USER,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.log("Error sending contact form email:", error);
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

// Newsletter subscription route
router.post("/newsletter", (req, res) => {
  const email = req.body.email;
  const mail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Newsletter Subscription",
    html: `<p>New subscription from email: ${email}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.log("Error sending newsletter email:", error);
      res.json({ code: 500, status: "Error sending email" });
    } else {
      res.json({ code: 200, status: "Subscription successful!" });
    }
  });
});

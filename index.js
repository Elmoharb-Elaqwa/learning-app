import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.js';
import paypal from 'paypal-rest-sdk';
import mediaRouter from './routes/media.js';
import { fileURLToPath } from 'url';
import path from 'path';
import coursesRoute from './routes/courses.js';
import categoryRoute from './routes/category.js';
import User from './models/User.js';
import { verifyToken } from './middleware/auth.js';
import Courses from './models/Courses.js';
import Stripe from 'stripe';
import ejs from 'ejs';
import passwordRouter from './routes/password.js';
const app = express();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.set('view engine', 'ejs');

app.use('/users', router);

// media routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/media', mediaRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));

// password reset
app.use('/password', passwordRouter);

// courses route
app.use('/courses', coursesRoute);

//categories route
app.use('/category', categoryRoute);

// dotevn config
dotenv.config();
const PORT = process.env.PORT || 3003;
// paypal configration
paypal.configure({
  mode: `${process.env.PAYPAL_MODE}`,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

//rest api

app.get('/pay/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const course = await Courses.findById(id);
  const user = await User.findById(req.user.id);
  var value = String(course.price);
  if (!user.courses.includes(course._id)) {
    var create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.SERVER_URL}/success/${course._id}/${req.user.id}`,
        cancel_url: 'http://cancel.url',
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'item',
                sku: 'item',
                price: value,
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: value,
          },
          description: 'This is the payment description.',
        },
      ],
    };

    // paypal creation
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log('Create Payment Response');
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel == 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } else {
    res.send('course is added before');
  }
});

app.get('/success/:id/:userId', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.params;
  const course = await Courses.findById(id);
  const user = await User.findById(userId);
  var value = String(course.price);
  var execute_payment_json = {
    payer_id: req.query.PayerID,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: value,
        },
      },
    ],
  };

  var paymentId = req.query.paymentId;

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log('Get Payment Response');
        console.log(JSON.stringify(payment));
        try {
          if (!user.courses.includes(course._id)) {
            const updateUser = await User.findByIdAndUpdate(
              userId,
              {
                courses: [...user.courses, course._id],
              },
              { new: true }
            ).populate('courses');

            // console.log(req.user);
            return res.status(201).send(updateUser);
          } else {
            return res.status(400).send('course is already founded');
          }
        } catch (error) {
          res.send(error.message);
        }
      }
    }
  );
});

// visa
app.post('/create-check-session/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Courses.findById(id);
    const user = await User.findById(req.user.id);
    const stripe = new Stripe(process.env.PRIVATE_KEY);
    if (!user.courses.includes(course._id)) {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: course.price * 100,
              product_data: {
                name: course.name,
                description: course.description,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/successs/${course._id}/${req.user.id}`,
        cancel_url: `${process.env.SERVER_URL}/cancel`,
      });
      res.redirect(303, session.url);
    } else {
      res.send('course is added before');
    }
  } catch (error) {
    res.send(error.message);
  }
});

// visa success fuction
app.get('/successs/:id/:userId', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.params;
  const course = await Courses.findById(id);
  const user = await User.findById(userId);
  try {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        courses: [...user.courses, course._id],
      },
      { new: true }
    ).populate('courses');

    // console.log(req.user);
    res.send(updateUser);
  } catch (error) {
    res.send(error.message);
  }
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`app fire on http://localhost:${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

const express = require("express");
const router = express.Router();
const {getHotels, getHotel, createHotel, updateHotel, deleteHotel} = require("../controllers/hotels");
const {protect, authorize} = require("../middleware/auth");

// Include other resource routers
const bookingRouter = require("./bookings");
const reviewRouter = require('./reviews');

// Re route into other resource routers
router.use("/:hotelId/bookings", bookingRouter);
router.use("/:hotelId/reviews", reviewRouter);

router.route("/").get(getHotels).post(protect, authorize('admin'), createHotel);
router.route("/:id").get(getHotel).put(protect, authorize('admin'), updateHotel).delete(protect, authorize('admin'), deleteHotel);

module.exports=router;

/**
 *  @swagger
 *  tags:
 *      name: Hotels
 *      description: The hotels managing API 
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required: 
 *         - name
 *         - picture
 *         - description
 *         - about
 *         - address
 *         - district
 *         - province
 *         - postalcode
 *         - region
 *         - dailyRate
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the hotel
 *           example: 6604b537a41b7d6d6e694e4e
 *         id:
 *           type: number
 *           description: Public hotel id
 *         name:
 *           type: string
 *           description: Hotel name
 *         picture:
 *           type: string
 *           description: URL of hotel picture
 *         description:
 *           type: string
 *           description: Hotel description
 *         about:
 *           type: string
 *           description: About hotel
 *         address:
 *           type: string
 *           description: Hotel address
 *         district:
 *           type: string
 *           description: Hotel district
 *         province:
 *           type: string
 *           description: Hotel province
 *         tel:
 *           type: string
 *           description: Hotel contact telephone
 *         region:
 *           type: string
 *           description: Hotel region
 *         size:
 *           type: string
 *           description: Hotel size (default is Small)
 *         guests:
 *           type: number
 *           description: Hotel guests (default is 2)
 *         dailyRate:
 *           type: string
 *           description: Hotel daily rate per day
 *       example:
 *           _id: 609bda561452242d88d36e37
 *           id: 3
 *           name: Witting LLC
 *           picture: https://i.imgur.com/picture.jpeg
 *           description: Example Hotel
 *           about: About this hotel
 *           address: Chulalongkorn
 *           district: Chulalongkorn
 *           province: Bangkok
 *           postalcode: 10110
 *           tel: 02-8369999
 *           region: Bangkok
 *           size: Small
 *           guests: 2
 *           dailyRate: 1.49
*/

/**
 *  @swagger
 *  /hotels:
 *    get:
 *      summary: Returns the list of all the hotels
 *      tags: [Hotels]
 *      responses:
 *        200:
 *          description: The list of the hospitals
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/models/Hotel'
*/

/**
 * @swagger
 * /hospitals/{id}:
 *    get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *          type: string
 *          required: true
 *          description: The hospital id
 *      responses:
 *        200:
 *          description: The hospital description by id
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *        404:
 *          description: The hospital was not found
*/

/**
 * @swagger
 * /hospitals:
 *    post:
 *      summary: Create a new hospital
 *      tags: [Hospitals]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *           $ref: '#/components/schemas/Hospital'
 *      responses:
 *        201:
 *        description: The hospital was successfully created
 *        content:
 *          application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hospital'
 *      500:
 *        description: Some server error
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  put:
 *    summary: Update the hospital by the id
 *    tags: [Hospitals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hospital'
 *    responses:
 *      200:
 *        description: The hospital was updated
 *        content:
 *          application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hospital'
 *      404:
 *        description: The hospital was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     summary: Remove the hospital by id
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hospital id
 *     responses:
 *       200:
 *         description: The hospital was deleted
 *       404:
 *         description: The hospital was not found
 */
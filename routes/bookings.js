const express = require("express");
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking,
    confirmBooking, 
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getBookings).post(protect, addBooking);
router
    .route("/:id")
    .get(protect, getBooking)
    .put(protect, updateBooking)
    .delete(protect, deleteBooking);


router.route("/confirm/:bookingId/:token").get(confirmBooking);

module.exports = router;

/**
 *  @swagger
 *  tags:
 *      name: Bookings
 *      description: The bookings managing API 
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required: 
 *         - guest
 *         - room
 *         - checkInDate
 *         - checkOutDate
 *         - user
 *         - hotel
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the booking
 *           example: 6604b537a41b7d6d6e694e4e
 *         guest:
 *           type: number
 *           description: Number of guest on booking
 *         room:
 *           type: string
 *           description: Room type of this booking
 *         checkInDate:
 *           type: string
 *           description: the date that check in
 *         checkOutDate:
 *           type: string
 *           description: the date that check out
 *         user:
 *           type: string
 *           description: The user who reserves this booking
 *         hotel:
 *           type: string
 *           description: The hotel which the user reserves.
 *         isConfirmed:
 *           type: boolean
 *           description: is this booking confirmed? (default is false)
 *         confirmationToken:
 *           type: string
 *           description: Token
 *         createdAt:
 *           type: string
 *           description: The date that this booking was created
 *       example:
 *           _id: 609bda561452242d88d36e37
 *           guest: 4
 *           room: 456
 *           checkInDate: 2025-01-01
 *           checkOutDate: 2025-01-02
 *           user: 68bf424348df1cd719f2937e
 *           hotel: 6704b587a41b7d6d6e694e4e
*/

/**
 *  @swagger
 *  /bookings:
 *    get:
 *      security:
 *         - bearerAuth: []
 *      summary: Returns the list of all the user bookings
 *      tags: [Bookings]
 *      responses:
 *        200:
 *          description: The list of the hotels
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Booking'
 *        400:
 *          description: Bad Request
*/

/**
 * @swagger
 * /bookings/{id}:
 *    get:
 *      summary: Get the booking by id
 *      tags: [Bookings]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *          type: string
 *          required: true
 *          description: The booking id
 *      responses:
 *        200:
 *          description: The booking description by id
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: The booking id was not found
*/

/**
 * @swagger
 * /hotels/{hotelId}/bookings:
 *   post:
 *      security:
 *         - bearerAuth: []
 *      summary: Create a new bookings
 *      tags: [Bookings]
 *      parameters:
 *        - in: path
 *          name: hotelId
 *          schema:
 *          type: string
 *          required: true
 *          description: The hotel id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *           $ref: '#/components/schemas/Booking'
 *      responses:
 *        201:
 *          description: The booking was successfully created
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Booking'
 *        401:
 *          description: Unauthorized
 */



/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *    security:
 *      - bearerAuth: []
 *    summary: Update the booking by the id
 *    tags: [Bookings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The booking id
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Booking'
 *    responses:
 *       200:
 *         description: The booking was updated
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some error happened
 */


/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove the booking by id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking was deleted
 *       404:
 *         description: The booking was not found
 */

/**
 * @swagger
 * /confirm/{bookingId}/{token}:
 *    get:
 *      summary: Confirm the booking by id
 *      tags: [Bookings]
 *      parameters:
 *        - in: path
 *          name: bookingId
 *          schema:
 *          type: string
 *          required: true
 *          description: The booking id
 *        - in: path
 *          name: token
 *          schema:
 *          type: string
 *          required: true
 *          description: The booking confirmationToken
 *      responses:
 *        200:
 *          description: Confirm booking successfully
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *        404:
 *          description: The booking id was not found
*/
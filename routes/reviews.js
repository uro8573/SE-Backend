const express = require('express')
const router = express.Router({mergeParams: true});
const {getReviews, getReview, addReview, updateReview, deleteReview} = require("../controllers/reviews");
const {protect, authorize} = require("../middleware/auth");

/**
 *  @swagger
 *  tags:
 *      name: Reviews
 *      description: The reviews managing API 
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required: 
 *         - user
 *         - hotel
 *         - comment
 *         - rating
 *       properties:
 *          comment: 
 *              type: string
 *              description: comment
 *          rating: 
 *              type: number
 *              description: rating
 *       example:
 *           comment: SUSU
 *           rating: 3
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/



/**
 *  @swagger
 *  /reviews:
 *    get:
 *      security:
 *         - bearerAuth: []
 *      summary: Returns the list of all the Reviews
 *      tags: [Reviews]
 *      responses:
 *        200:
 *          description: The list of the Reviews
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
*/



/**
 *  @swagger
 *  /hotels/{hotelid}/reviews:
 *    post:
 *      security:
 *         - bearerAuth: []
 *      summary: Create the Reviews
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: hotelid
 *          schema:
 *              type: string
 *          required: true
 *          description: The hotel id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *           $ref: '#/components/schemas/Review'
 *      responses:
 *        201:
 *          description: The list of the Reviews
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        400:
 *          description: Can't Create
*/


router.route("/").get(getReviews).post(protect, addReview);

/**
 *  @swagger
 *  /reviews/{id}:
 *    get:
 *      security:
 *         - bearerAuth: []
 *      summary: Returns the Reviews with ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The notification id
 *      responses:
 *        200:
 *          description: Get Reviews with ID
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        400:
 *          description: Can't Get Review with ID
*/

/**
 *  @swagger
 *  /reviews/{id}:
 *    put:
 *      security:
 *         - bearerAuth: []
 *      summary: Update the Reviews with ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The notification id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *           $ref: '#/components/schemas/Review'
 *      responses:
 *        200:
 *          description: Update Reviews with ID
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        400:
 *          description: Can't Update
*/

/**
 *  @swagger
 *  /reviews/{id}:
 *    delete:
 *      security:
 *         - bearerAuth: []
 *      summary: Delete the Reviews with ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The notification id
 *      responses:
 *        200:
 *          description: Delete Reviews with ID
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        400:
 *          description: Can't Delete
*/

router.route("/:id").get(protect, getReview).put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;

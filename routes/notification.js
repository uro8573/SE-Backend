const express = require("express");
const { getNotifications, getNotification, addNotification, deleteNotification, updateNotification, cleanupNotifications } = require('../controllers/notification');
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 *  @swagger
 *  tags:
 *      name: Notis
 *      description: The notifications managing API 
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Noti:
 *       type: object
 *       required: 
 *         - user
 *         - text
 *         - isRead
 *         - type
 *         - typeAction
 *       properties:
 *          text: 
 *              type: string
 *              description: Action
 *          isRead: 
 *              type: string
 *              description: boolean
 *          type: 
 *              type: string
 *              description: type
 *          typeAction: 
 *              type: string
 *              description: typeAction
 *       example:
 *           text: SUSU
 *           isRead: false
 *           typeAction: BookWeak 
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
 *  /notifications:
 *    get:
 *      security:
 *         - bearerAuth: []
 *      summary: Returns the list of all the Notifications
 *      tags: [Notis]
 *      responses:
 *        200:
 *          description: The list of the Notifications
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Noti'
*/

/**
 * @swagger
 * /notifications:
 *   post:
 *      security:
 *         - bearerAuth: []
 *      summary: Create a new noti
 *      tags: [Notis]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *           $ref: '#/components/schemas/Noti'
 *      responses:
 *        201:
 *          description: The notification was successfully created
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Noti'
 *        401:
 *          description: Unauthorized
 */

router.route('/').get(protect, getNotifications).post(protect, addNotification)


/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get noti with id
 *      tags: [Notis]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The notification id
 *      responses:
 *        200:
 *          description: The notification get info success
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Noti'
 *        400:
 *          description: Can't get info
 */

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *      security:
 *         - bearerAuth: []
 *      summary: Update noti with id
 *      tags: [Notis]
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
 *           $ref: '#/components/schemas/Noti'
 *      responses:
 *        200:
 *          description: The notification update success
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Noti'
 *        400:
 *          description: Can't Update
 */


/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *      security:
 *         - bearerAuth: []
 *      summary: Delete noti with id
 *      tags: [Notis]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The notification id
 *      responses:
 *        200:
 *          description: The notification delete success
 *          content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Noti'
 *        400:
 *          description: Can't Delete
 */



router.route('/:id').get(protect, getNotification).delete(protect, deleteNotification).put(protect, updateNotification)
router.route('/cleanup/:days').delete(protect, cleanupNotifications)

module.exports = router;
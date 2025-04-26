/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - name
*         - email
*         - tel
*         - password
*         - verificationCode
*       properties:
*         name:
*           type: string
*           description: Name of user
*         email:
*           type: string
*           description: Email of user
*         tel:
*           type: string
*           description: Telephone number of user
*         role:
*           type: string
*           description: Role of user (admin or user), default is user
*         password:
*           type: string
*           description: Password of user 
*         verificationCode: 
*           type: String,
*           description: OTP of User
*         isVerify: 
*           type: boolean,
*           description: Verify of User
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
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
* @swagger
* tags:
*   name: User
*   description: The user API
*/




const express = require("express");
const {register, login, getMe, logout, verify, reVerify} = require("../controllers/auth");

const router = express.Router();

const {protect} = require("../middleware/auth");


/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Some server error
*/

router.post('/register', register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Log-in to the system
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties: 
*               email: 
*                   type: string
*               password: 
*                   type: string
*     responses:
*       201:
*         description: Log-in Successfully
*       500:
*         description: Some server error
*/

router.post('/login', login);

/**
* @swagger
* /auth/logout:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Log-out to the system
*     tags: [User]
*     responses:
*       201:
*         description: Log-out Successfully
*       500:
*         description: Some server error
*/

router.get('/logout', protect, logout);

/**
* @swagger
* /auth/me:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Return information about me
*     tags: [User]
*     responses:
*       201:
*         description: My user profile
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Some server error
*/

router.get('/me', protect, getMe);

/**
* @swagger
* /auth/verify:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Verify register gmail
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*              type: object
*              properties :
*               verificationCode :
*                   type : string
*     responses:
*       201:
*         description: Verify Successfully
*       500:
*         description: Some server error
*/

router.post('/verify', protect, verify);

/**
* @swagger
* /auth/re-verify:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Re-Verify register gmail
*     tags: [User]
*     responses:
*       201:
*         description: Verify Successfully
*       500:
*         description: Some server error
*/
router.get('/re-verify', protect, reVerify);

module.exports = router;
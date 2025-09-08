const express = require("express");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require("../services/userService");

const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserDataValidator,
} = require("../utils/validators/userValidator");

const authRoute = require("../services/authService");

const router = express.Router();

router.use(authRoute.protect)

//-----------------------------User & admin & manager----------------------------
router.get('/getMe',getLoggedUserData,getUser)
router.put('/changeMyPassword',updateLoggedUserPassword,)
router.put('/changeMe',updateLoggedUserDataValidator,updateLoggedUserData)
router.delete('/deleteMe',deleteLoggedUserData)

//-----------------------------Admin----------------------------
router.use(authRoute.allowedTo("admin",'manager'));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(
    getUserValidator,
    getUser
  )
  .patch(
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    deleteUserValidator,
    deleteUser
  );
module.exports = router;

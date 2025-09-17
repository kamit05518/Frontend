const router = require("express").Router();

const {
  getContact,
  getContactById,
  deleteContact,
} = require("../../controller/contact");

router.get("/", getContact);
router.get("/:id", getContactById);
router.delete("/:id", deleteContact);

module.exports = router;

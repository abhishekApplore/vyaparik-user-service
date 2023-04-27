const { default: mongoose } = require("mongoose");
const HttpError = require("../helpers/HttpError");
const Response = require("../Response");
const FaqService = require("../services/faq.service");

class FaqController {
  find = async (req, res) => {
    try {
      const faqs = await FaqService.find();

      Response(res).status(200).body(faqs).send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  };
  findOne = async (req, res) => {
    try {
      const faqs = await FaqService.findOne({ _id: req.params.id });

      Response(res).status(200).body(faqs).send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  };
  edit = async (req, res) => {
    try {
      const faqs = await FaqService.findByIdAndUpdate(req.params.id, {
        ...req.body,
      });

      Response(res).status(200).body(faqs).send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  };
  delete = async (req, res) => {
    try {
      const faqs = await FaqService.findByIdAndDelete(req.params.id);

      Response(res).status(200).message("Successfully Deleted").send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  };
  create = async (req, res) => {
    try {
      const faq = await FaqService.create({
        title: req.body.title,
        body: req.body.body,
        userId: mongoose.Types.ObjectId(req.user.uid),
      });
      Response(res).status(200).message("Successfully FAQ Created!").send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  };
}

module.exports = FaqController;

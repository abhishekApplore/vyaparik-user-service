const Faq = require("../models/faq.model");

const FaqService = {};

FaqService.findById = (id) => {
  return Faq.findById(id);
};

FaqService.create = (id) => {
  return Faq.create(id);
};

FaqService.findByIdAndUpdate = (id, body) => {
  return Faq.findByIdAndUpdate(id, { ...body });
};

FaqService.findByIdAndDelete = (id) => {
  return Faq.findByIdAndDelete(id);
};

FaqService.find = (filter) => {
  return Faq.find({ ...filter });
};

FaqService.findOne = (filter) => {
  return Faq.findOne(filter);
};

module.exports = FaqService;

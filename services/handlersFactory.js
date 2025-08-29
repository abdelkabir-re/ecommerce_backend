const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document with this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document with this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDc = await Model.create(req.body);
    console.log('last etape')
    res.status(201).json({ data: newDc });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document with this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model,modelName='') =>
  asyncHandler(async (req, res) => {
    let filter={}
    if(req.filterObject){
      filter=req.filterObject
    }
    const countDocuments = await Model.countDocuments();
    // Build Query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
    //Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

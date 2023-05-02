const { default: mongoose } = require("mongoose");
const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const Response = require("../Response");
const DisputeService = require("../services/dispute.service");
const { sendNotification } = require("../setup/notification");
// const UserService = require("../../../../vyaparik-user-service/src/services/user.service");

class DisputeController {
  createDispute = async (req, res) => {
    /*
            creating Dispute
        */

    const data = {
      userId: req.user.uid,
      cause: req.body.cause,
      raisedBy: mongoose.Types.ObjectId(req.params.id),
    };

    try {
      await DisputeService.create(data);
      Response(res).message("Successfully Disputed").status(200).send();
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  };
  getAllDisputes = async (req, res) => {
    /*
            work - getting all Disputes
        */

    const { pageNumber, pageSize } = req.query;

    // console.log("Working");
    const disputes = await DisputeService.getAllDispute({
      pageNumber,
      pageSize,
    });

    await sendNotification(
      "Warning",
      "Your account has been blocked",
      token.token
    );

    if (!disputes) Response(res).status(204).message("No Dispute Found").send();

    Response(res)
      .status(200)
      .message("Successfully Data retrieved")
      .body(disputes)
      .send();
  };
  updatesDisputeStatus = async (req, res) => {
    if (req.user.role === "ADMIN") {
      const AllStatus = ["Approved", "Pending", "Rejected"];
      const id = req.params.id || "";
      const status = req.body.status || "";
      if (id) {
        if (status && AllStatus.indexOf(status) !== -1) {
          const result = await DisputeService.updateDispute(id, status);
          if (result) {
            Response(res)
              .status(200)
              .message("Dispute status updated successfully")
              .send();
          } else {
            Response(res).status(400).message("Some error occured").send();
          }
        } else {
          Response(res).status(400).message("Invalid status").send();
        }
      } else {
        Response(res).status(400).message("Invalid dispute id").send();
      }
    } else {
      Response(res).status(403).message("Not Authorized").send();
    }
  };
}

module.exports = DisputeController;

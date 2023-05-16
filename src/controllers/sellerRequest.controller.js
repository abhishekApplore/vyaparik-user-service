const { default: mongoose } = require("mongoose");
const Constant = require("../constants/Constant");
const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const Response = require("../Response");
const StoreService = require("../services/store.service");
const UserService = require("../services/user.service");
const sellerRequestService = require("../services/userRequest.service");
const { sendNotification } = require("../setup/notification");

class SellerRequestController {
  createRequest = async (req, res) => {
    /*
            creating Request
        */

    const data = {};
  };
  getAllPendingRequest = async (req, res) => {
    /*
            work - getting all pending requests
        */

    const { pageNumber, pageSize } = req.query;

    // console.log("Working");
    const requests = await sellerRequestService.getAllRequest(
      { status: "Pending" },
      { pageNumber, pageSize }
    );

    if (!requests) Response(res).status(204).message("No Request Found").send();

    Response(res)
      .status(200)
      .message("Successfully Data retrieved")
      .body(requests)
      .send();
  };
  updateStatus = async (req, res) => {
    /*
        changing status
    */
    const { status } = req.body;
    try {
      if (status && (status == "Approved" || status == "Rejected")) {
        const seller = await UserService.findById(req.params.id);
        const requests = await sellerRequestService.update(req.params.id, {
          status,
        });
        const store = await StoreService.findOne({ user: requests.userId });
        // console.log({ store });
        if (!store) throw new HttpError(404, ErrorMessage.STATUS_404);
        // console.log(requests);
        //step - 4 updating user profile
        if (status === "Approved") {
          await UserService.createSeller(
            mongoose.Types.ObjectId(requests.userId),
            store
          );
          //   console.log("Here");
          if (seller?.fcmTokens) {
            await sendNotification(
              Constant.Notification.REQUEST_APPROVED.title,
              Constant.Notification.REQUEST_APPROVED.message,
              seller.fcmTokens
            );
          }
          Response(res)
            .status(200)
            .message("Successfully Approved Request")
            .send();
        } else {
          //   console.log("Here2");
          if (seller?.fcmTokens) {
            await sendNotification(
              Constant.Notification.REQUEST_REJECT.title,
              Constant.Notification.REQUEST_REJECT.message,
              seller.fcmTokens
            );
          }
          Response(res)
            .status(200)
            .message("Successfully Rejected Request")
            .send();
        }
      } else {
        // console.log("error");
        throw new HttpError(400, ErrorMessage.STATUS_400);
      }
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  };
  addRejectReason = async (req, res) => {
    try {
      await sellerRequestService.update(req.params.id, {
        rejectReason: req.body.reason,
      });

      Response(res).status(200).message("Successfully reason added").send();
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  };
}

module.exports = SellerRequestController;

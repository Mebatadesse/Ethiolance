const { getMilestoneForPayment, createPayment } = require("./payment.service");

const initiatePaymentController = async (req, res) => {
    const milestoneId = parseInt(req.params.milestoneId, 10);

    if (!Number.isInteger(milestoneId) || milestoneId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid milestone ID",
        });
    }

    const milestone = await getMilestoneForPayment(milestoneId);

    if (!milestone) {
        return res.status(404).json({
            success: false,
            message: "Milestone not found",
        });
    }

    if (milestone.contract.clientId !== req.user.userId) {
        return res.status(403).json({
            success: false,
            message: "Only the contract owner can initiate payment",
        });
    }

    if (milestone.status !== "APPROVED") {
        return res.status(400).json({
            success: false,
            message: "Only approved milestones can be paid",
        });
    }

    if (milestone.payment) {
        return res.status(409).json({
            success: false,
            message: "A payment already exists for this milestone",
        });
    }

    const payment = await createPayment(
        milestoneId,
        milestone.amount
    );

    return res.status(201).json({
        success: true,
        message: "Payment record created; external payment is not yet completed",
        payment,
    });
};

module.exports = {
    initiatePaymentController,
};
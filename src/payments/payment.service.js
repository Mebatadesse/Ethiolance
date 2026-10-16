const prisma = require("../config/prisma");

const getMilestoneForPayment = async (milestoneId) => {
    const milestone = await prisma.milestone.findUnique({
        where: {
            id: milestoneId,
        },
        include: {
            contract: true,
            payment: true,
        },
    });

    return milestone;
};

const createPayment = async (milestoneId, amount) => {
    const payment = await prisma.payment.create({
        data: {
            amount, 
            method: "CHAPA",
            status: "INITIATED",
            milestone: {
                connect: {
                    id: milestoneId,
                },
            },
        },
    });

    return payment;
};

module.exports = {
    getMilestoneForPayment,
    createPayment,
}
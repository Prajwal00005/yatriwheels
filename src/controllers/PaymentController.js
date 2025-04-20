const paymentServices = require("../services/paymentServices");

const createPayment = async(req,res)=>{
    try{
        const data = req.body;

        const Payment = await paymentServices.createPayment(data);

        if(!Payment) res.status(400).send("payment failed");

        res.status(200).json({
            sucess:"OK",
            message:"payment record stored",
            data:Payment,

        })

    }catch(e){
        res.status(400).json({
            message:e.message,
            sucess:"false",
        })
    }
}

const getPayments =async(req,res)=>{
    try{

    }catch(e){

    }
}


module.exports = {createPayment}
var userDao = require('./userDao.js');
var Payment = require('../model/payment.js');
var instamojo=require('instamojo-node');
//var api=new instamojo('afca9951edde252d1210e03634bb4fd2','6a97903415e4f2a3ba9c03da216a4465');
//sandbox
var api=new instamojo('a8168b9c010af3cbcefb40e81157b08c','678982f4c236c37eed841efb63368814');
// payment-id: MOJO5c03000J32400262
exports.fetchUpdatePaymentDetails = function(req, res) {
	if (!req.query.payment_id) {
		console.error("Error: payment_id is undefined.");
		res.redirect("/signup/sorry.html");
		return;
	}
	api.getPayment(req.query.payment_id,function(err,data,pay_res) {
		if(err) {
			//handle the error
			console.error("Error: retriving payment details:" + err);
			res.redirect("/signup/sorry.html");
			return;
		}
		var payment = data.payment;
		if (!payment) {
			res.redirect("/signup/sorry.html");
			return;
		}
		console.log(payment);
		var months = 3;
		if (req.query.months) months = parseInt(req.query.months);
		exports.updatePaymentDetails(payment, months);
		if (payment.status == "Credit") {
			res.redirect("/signup/confirmation.html");
		} else {
			var redirectUrl = "/signup/sorry.html?"+"name="+encodeURIComponent(payment.buyer_name)+
								"&email="+encodeURIComponent(payment.buyer_email)+
								"&phone="+encodeURIComponent(payment.buyer_phone);
			res.redirect(redirectUrl);
		}
	})
}

exports.updatePaymentDetails = function(payment, months) {
	// update payment record, insert if doesn't exist
	Payment.update({payment_id : payment.payment_id},
		{payment_id:payment.payment_id,
			quantity:payment.quantity,
			status:payment.status,
			link_slug:payment.link_slug,
			link_title:payment.link_title,
			name:payment.buyer_name,
			phone:payment.buyer_phone,
			email:payment.buyer_email,
			currency:payment.currency,
			unit_price:payment.unit_price,
			amount:payment.amount,
			fees:payment.fees,
			created_at:payment.created_at},
	 { upsert : true }, 
	 function(err, data){
            if (err) return res.send(err);
            console.log(data);
  			//res.json(data);
     });

	if (payment.status == "Credit") {
		var start_date;
		if (payment.created_at) {
			start_date = new Date(payment.created_at);
		} else {
			start_date = new Date();
		}
		var end_date = new Date(start_date.getTime());
		end_date.setMonth(start_date.getMonth() + months);
		console.log("end_date:" + end_date);
		userDao.updateSubscriptionDate(payment.buyer_email, start_date, end_date);
	}
}
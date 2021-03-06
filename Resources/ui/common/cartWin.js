function cartWin() {

	var self, orderBtn, emptyBtn, couponBtn, tableHeaderView, productTable, CouponWinModule, auth, priceLblCurr, pricebackground, totalLable, totalText, descountlable, descount;

	self = Ti.UI.createWindow({
		title : 'سلة التسوق',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	orderBtn = Ti.UI.createButton({
		title : 'شراء'
	});
	orderBtn.addEventListener('click', function() {

		if (Ti.App.cartQuantityCounter().count === 0) {

			Ti.UI.createAlertDialog({
				title : 'لا يوجد؟',
				message : 'لا يوجد منتجات في سلة التسوق حتى الان.',
				buttonNames : ['موافق']
			}).show();
			return;
		}

		auth = require('/lib/auth');
		if (auth.isLogedIn() === false) {

			var nextStepAlert = Ti.UI.createAlertDialog({
				title : 'هل انت عضو؟',
				//message : 'التسجيل ليدنا يعطيك المزيد من الامكانيات',
				buttonNames : ['تسجيل الدخول', 'اكمل الشراء مباشرةً', 'عودة'],
				cancel : 2
			});

			nextStepAlert.show();

			nextStepAlert.addEventListener('click', function(e) {
				switch (e.index) {
					case 0:
						Ti.App.fireEvent('closeLoginWindow');
						Ti.App.fireEvent('openLoginWindow');
						break;
					case 1:
						Ti.App.fireEvent('closeRegisterWindow');
						Ti.App.fireEvent('openRegisterWindow');
						break;
				}
			});

			return;
		}

		Ti.App.fireEvent('openShippingWindow');
	});

	if (Ti.Platform.getOsname() === 'android') {

		orderBtn.height = 33;
		orderBtn.width = '90%';
		orderBtn.bottom = 4;
		orderBtn.backgroundImage = '/images/button_ok.png';
		orderBtn.color = '#ffffff';

		self.add(orderBtn);
	} else {
		self.setRightNavButton(orderBtn);
	}

	emptyBtn = Ti.UI.createButton({
		title : 'تفريغ',
		//left : '40%',
		height : 31,
		width : 70,
		color : '#000000',
		font : {
			fontFamily : 'Arial',
			fontSize : 14,
			fontWeight : 'bold'
		},
		backgroundImage : '/images/button_discount_enter.png'
	});
	emptyBtn.addEventListener('click', function() {

		var confirmDialog = Ti.UI.createAlertDialog({
			title : 'متاكد',
			message : 'سيتم افراغ سلة التسوق؟',
			buttonNames : ['موافق', 'لا'],
			cancel : 1
		});

		confirmDialog.addEventListener('click', function(ec) {
			if (ec.index === 0) {
				Ti.App.fireEvent('cartEmpty');
				self.fireEvent('focus');
			}
		});

		confirmDialog.show();
	});

	couponBtn = Ti.UI.createButton({
		title : 'كوبون خصم',
		height : 31,
		width : 110,
		left : 5,
		color : '#000000',
		font : {
			fontFamily : 'Arial',
			fontSize : 14,
			fontWeight : 'bold'
		},
		backgroundImage : '/images/bg_total_account.png'
	});
	couponBtn.addEventListener('click', function(e) {

		CouponWinModule = require('/ui/common/couponWin');
		new CouponWinModule().open();
	});

	tableHeaderView = Ti.UI.createView({
		layout : 'horizontal',
		top : 0,
		height : 44,
		//width : '100%'
		left : '25%'
	});
	tableHeaderView.add(emptyBtn);
	tableHeaderView.add(couponBtn);

	self.add(tableHeaderView);

	productTable = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		separatorColor : 'transparent',
		//headerView : tableHeaderView,
		width : '100%',
		right : 0,
		top : 44
	});

	if (Ti.Platform.getOsname() === 'android') {
		productTable.bottom = 44;
	}

	self.add(productTable);

	self.addEventListener('focus', function() {

		var rows, i, rowView, img, titleLbl, priceLbl, priceRowLbl, quantityLbl, rowViewArray = [], total = 0, coupon;

		rows = Ti.App.Properties.getObject('cart', {});

		for (i in rows) {
			if (rows.hasOwnProperty(i)) {

				rowView = Ti.UI.createTableViewRow({
					height : 95,
					myTitle : rows[i].title,
					data : rows[i],
					className : 'cartRow',
					backgroundImage : '/images/TableViewRowBG.jpg',
					selectedBackgroundImage : '/images/TableViewRowSelectedBG.png'
				});

				img = Ti.UI.createImageView({
					image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
					width : 85,
					height : 85,
					right : 10,
					borderRadius : 45,
					defaultImage : '/images/default.png'
				});
				rowView.add(img);

				titleLbl = Ti.UI.createLabel({
					text : rows[i].title,
					left : 10,
					right : 110,
					top : 12,
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					color : '#ffffff',
					font : {
						fontFamily : 'Arial',
						fontSize : 17,
						fontWeight : 'bold'
					}
				});
				rowView.add(titleLbl);

				pricebackground = Ti.UI.createImageView({
					image : "/images/bg_price.png",
					bottom : 11,
					right : 110,
					width : 170,
					height : 38
				});
				rowView.add(pricebackground);

				if (rows[i].price_shown_coupon < rows[i].price) {

					total += parseFloat(rows[i].price_shown_coupon) * parseInt(rows[i].quantity, 10);
					priceLbl = Ti.UI.createLabel({
						text : parseFloat(rows[i].price_shown_coupon).toFixed(2),
						right : 120,
						width : 60,
						bottom : 27,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						color : '#000000',
						font : {
							fontFamily : 'Arial',
							fontSize : 17,
							fontWeight : 'bold'
						}
					});
					rowView.add(priceLbl);
				} else {
					total += parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10);
					priceLbl = Ti.UI.createLabel({
						text : parseFloat(rows[i].price).toFixed(2),
						right : 120,
						width : 60,
						bottom : 27,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						color : '#000000',
						font : {
							fontFamily : 'Arial',
							fontSize : 17,
							fontWeight : 'bold'
						}
					});
					rowView.add(priceLbl);
				}

				priceLblCurr = Ti.UI.createLabel({
					text : Ti.App.Properties.getString('currencyName', 'ريال سعودي'),
					right : 110,
					width : 80,
					bottom : 16,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					color : '#000000',
					font : {
						fontFamily : 'Arial',
						fontSize : 14
					}
				});
				rowView.add(priceLblCurr);

				priceRowLbl = Ti.UI.createLabel({
					text : parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10).toFixed(2),
					color : '#ffffff',
					left : 10,
					bottom : 10,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				});
				//rowView.add(priceRowLbl);

				quantityLbl = Ti.UI.createLabel({
					text : rows[i].quantity,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					color : '#000000',
					width : 55,
					height : 25,
					right : 205,
					top : 50,
					backgroundImage : '/images/bg_input_quantity.png'
				});
				rowView.add(quantityLbl);

				rowViewArray.push(rowView);
			}

		}

		coupon = Ti.App.Properties.getInt('coupon', 0);

		if (total > 0) {
			if (coupon > 0) {

				var rowView2 = Ti.UI.createTableViewRow({
					height : 35,
					selectedBackgroundImage : 'transparent'
				});

				descountlable = Ti.UI.createLabel({
					text : 'قيمة الخصم  ',
					color : '#ffffff',
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					font : {
						fontFamily : 'Arial',
						fontSize : 18,
						fontWeight : 'bold'
					},
					right : 10
				});
				rowView2.add(descountlable);

				descount = Ti.UI.createLabel({
					text : ' ' + coupon + ' ' + Ti.App.Properties.getString('currencyName', 'ريال سعودي'),
					color : '#ffffff',
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					font : {
						fontFamily : 'Arial',
						fontSize : 17
					},
					right : 100,
					width : 150,
					height : 27,
					backgroundImage : '/images/button_discount_enter.png'
				});
				rowView2.add(descount);

				rowViewArray.push(rowView2);
			}

			var rowView3 = Ti.UI.createTableViewRow({
				height : 35,
				selectedBackgroundImage : 'transparent'
			});

			total = total - coupon < 0 ? 0 : total - coupon;
			totalLable = Ti.UI.createLabel({
				text : 'الإجمالي  ',
				color : '#ffffff',
				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
				font : {
					fontFamily : 'Arial',
					fontSize : 18,
					fontWeight : 'bold'
				},
				right : 10
			});
			rowView3.add(totalLable);

			totalText = Ti.UI.createLabel({
				text : ' ' + total.toFixed(2) + ' ' + Ti.App.Properties.getString('currencyName', 'ريال سعودي'),
				color : '#ffffff',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				font : {
					fontFamily : 'Arial',
					fontSize : 17
				},
				right : 100,
				width : 150,
				height : 27,
				backgroundImage : '/images/bg_total_account.png'
			});
			rowView3.add(totalText);

			rowViewArray.push(rowView3);
		}

		if (rowViewArray.length === 0) {// cart is empty

			rowViewArray.push(Ti.UI.createTableViewRow({
				title : 'سلة التسوق فارغة',
				color : '#ffffff'
			}));
		}

		productTable.setData(rowViewArray);
	});

	return self;
}

module.exports = cartWin;

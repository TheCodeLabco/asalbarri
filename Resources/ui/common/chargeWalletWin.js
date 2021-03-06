function chargeWalletWin() {

	var self, closeBtn, submitBtn, cardTxt;

	self = Ti.UI.createWindow({
		title : 'شحن المحفظة',
		modal : true,
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	if (Ti.Platform.getOsname() !== 'android') {
		closeBtn = Ti.UI.createButton({
			title : 'اغلاق'
		});

		closeBtn.addEventListener('click', function() {
			self.close();
		});

		self.setLeftNavButton(closeBtn);
	}

	function sendcard() {

		if (cardTxt.value.length <= 0) {
			return false;
		}

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/chargeWallet/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency', 2) + '/' + cardTxt.value);

		xhr.onerror = function() {
			Ti.App.fireEvent('hideLoading');

			label.text = 'لا يوجد نتائج هنا في الوقت الحالي !!';
		};

		xhr.onload = function() {
			Ti.App.fireEvent('hideLoading');

			var row, dialouge;

			try {
				row = JSON.parse(this.responseText);
			} catch (e) {

				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
					cancel : 0,
					buttonNames : ['اغلاق']
				}).show();
				return false;
			}

			if (row.done === false) {

				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الرقم المدخل .. يرجي التأكد من إدخال رقم الكارت بشكل صحيح ...',
					cancel : 0,
					buttonNames : ['اغلاق']
				}).show();
				
				cardTxt.focus();
			} else {

				Ti.App.balanceLbl.text = row.balance;
				dialouge = Ti.UI.createAlertDialog({
					title : 'تم شحن المحفظة',
					message : 'رصيدك الآن : ' + row.balance + ' ' + Ti.App.Properties.getString('currencyName', 'ريال سعودي'),
					cancel : 0,
					buttonNames : ['موافق']
				});
				dialouge.addEventListener('click', function(ev) {
					if (ev.index === 0) {
						self.close();
					}
				});
				dialouge.show();
			}
		};

		xhr.send();
	}

	submitBtn = Ti.UI.createButton({
		title : 'شحن المحفظة'
	});

	submitBtn.addEventListener('click', function() {
		Ti.App.fireEvent('showLoading');
		sendcard();
	});

	if (Ti.Platform.getOsname() === 'android') {
		submitBtn.top = 60;
		submitBtn.height = 33;
		submitBtn.width = '90%';
		submitBtn.color = '#ffffff';
		submitBtn.backgroundImage = '/images/button_ok.png';

		self.add(submitBtn);
	} else {
		self.setRightNavButton(submitBtn);
	}

	cardTxt = Ti.UI.createTextField({
		hintText : 'رقم الكارت',
		textAlign : Ti.App.autoAlignHintext(),
		height : 40,
		width : '90%',
		top : 10,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});

	self.addEventListener('open', function() {
		cardTxt.focus();
	});
	cardTxt.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});
	self.add(cardTxt);

	return self;
}

module.exports = chargeWalletWin;

function orderProductsWin(parent) {
	var self = Ti.UI.createWindow({
		title : 'تفاصيل الطب',
		backgroundImage : 'images/common/bg.jpg',
		barImage : 'images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	function filterData() {

		tableView.fireEvent('runLoading');

		var tableRows = [], xhr;

		xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/productsByOrderID/' + parent.id);

		xhr.onerror = function() {
			tableView.fireEvent('reloadData', {
				rows : []
			});
		};

		xhr.onload = function() {

			var rows, i, row, img, titleLbl, purchasesQtyLbl, priceLbl, priceLbl2;

			rows = JSON.parse(this.responseText);

			for (i in rows) {
				if (rows.hasOwnProperty(i)) {
					row = Ti.UI.createTableViewRow({
						height : '95dp',
						myTitle : rows[i].title,
						data : rows[i],
						backgroundImage : 'images/common/TableViewRowBG.png',
						selectedBackgroundImage : 'transparent'
					});

					img = Ti.UI.createImageView({
						image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
						width : '85dp',
						height : '85dp',
						right : '10dp',
						borderRadius : 45
					});
					row.add(img);

					titleLbl = Ti.UI.createLabel({
						text : rows[i].title,
						left : 0,
						right : '110dp',
						top : '10dp',
						color : '#000000',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Arial',
							fontSize : '17dp',
							fontWeight : 'bold'
						}
					});
					row.add(titleLbl);

					purchasesQtyLbl = Ti.UI.createLabel({
						text : 'الكمية : ',
						left : 0,
						right : '110dp',
						top : '35dp',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Tahoma',
							fontSize : '15dp'
						}
					});
					row.add(purchasesQtyLbl);

					purchasesQty = Ti.UI.createLabel({
						text : rows[i].purchases_quantity,
						left : 0,
						right : '155dp',
						top : '35dp',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Tahoma',
							fontSize : '15dp'
						}
					});
					row.add(purchasesQty);

					priceLbl = Ti.UI.createLabel({
						text : 'سعر الوحدة : ',
						left : 0,
						right : '110dp',
						top : '60dp',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Tahoma',
							fontSize : '15dp'
						}
					});
					row.add(priceLbl);

					priceLbl2 = Ti.UI.createLabel({
						text : rows[i].purchases_unit_price + ' ' + Ti.App.Properties.getString('currencyName'),
						left : 0,
						right : '190dp',
						top : '60dp',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Tahoma',
							fontSize : '15dp'
						}
					});
					row.add(priceLbl2);

					tableRows.push(row);
				}
			}

			tableView.fireEvent('reloadData', {
				rows : tableRows
			});
		};

		xhr.send();
	}

	var tableView = Ti.UI.createTableView({
		filterAttribute : 'myTitle',
		backgroundColor : 'transparent',
		separatorColor : 'transparent'
	});

	tableView.addEventListener('cleartable', function() {

		if (this.data.length > 0) {
			var i = this.data[0].rows.length - 1;
			for (i; i >= 0; i -= 1) {
				this.deleteRow(i);
			}
		}

	});

	tableView.addEventListener('runLoading', function() {
		this.setData([{
			title : 'جاري التحميل ....'
		}]);
	});
	tableView.addEventListener('reloadData', function(e) {
		this.setData(e.rows.length > 0 ? e.rows : [{
			title : 'لا يوجد نتائج هنا في الوقت الحالي !!'
		}]);
	});

	filterData();

	//Ti.App.orderProductsTable = tableView;

	self.add(tableView);
	return self;
}

module.exports = orderProductsWin;

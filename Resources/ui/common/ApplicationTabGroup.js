function ApplicationTabGroup(Window) {

    var self, CategoryWinModule, CartWinModule, WalletWinModule, MyOrdersWinModule;

    //create module instance
    self = Ti.UI.createTabGroup();

    //create app tabs

    MyOrdersWinModule = require('ui/common/myOrdersWin');
    Ti.App.orderTab = Ti.UI.createTab({
        title : 'الطلبات',
        icon : '/images/common/icon_3.png',
        window : new MyOrdersWinModule()
    });

    WalletWinModule = require('ui/common/walletWin');
    Ti.App.walletTab = Ti.UI.createTab({
        title : 'المحفظة',
        icon : '/images/common/icon_4.png',
        window : new WalletWinModule()
    });

    CartWinModule = require('ui/common/cartWin');
    Ti.App.cartTab = Ti.UI.createTab({
        title : 'سلة التسوق',
        icon : '/images/common/icon_5.png',
        badge : Ti.App.cartQuantityCounter().quantity,
        window : new CartWinModule()
    });

    CategoryWinModule = require('ui/common/categoryWin');
    Ti.App.catalogTab = Ti.UI.createTab({
        title : 'المنتجات',
        icon : '/images/common/icon_6.png',
        window : new CategoryWinModule(0)
    });

    self.addTab(Ti.App.orderTab);
    self.addTab(Ti.App.walletTab);
    self.addTab(Ti.App.cartTab);
    self.addTab(Ti.App.catalogTab);

    self.setActiveTab(Ti.App.catalogTab);

    return self;
}

module.exports = ApplicationTabGroup;

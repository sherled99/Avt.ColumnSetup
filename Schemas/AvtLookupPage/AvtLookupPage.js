define("AvtLookupPage", ["LookupPageViewGenerator", "AvtLookupPageResources", "ServiceHelper", "LookupPage"], function(LookupPageViewGenerator, resources, ServiceHelper) {
    Ext.define("Terrasoft.configuration.AvtLookupPage", {
        override: "Terrasoft.LookupPage",
        alternateClassName: "Terrasoft.AvtLookupPage",
		
		renderLookupView: function(schema, profile) {
			var config = this.getLookupConfig(schema, profile);
			var topPanelConfig = LookupPageViewGenerator.generateFixed(config);
			if (topPanelConfig.items[2].items[0].menu){
				topPanelConfig.items[2].items[0].menu.items.push(this.createClearProfileDataButton());
			} else if (topPanelConfig.items[2].items[1].menu){
				topPanelConfig.items[2].items[1].menu.items.push(this.createClearProfileDataButton());
			}
			
			this.renderLookupControls(config, topPanelConfig);
		},
		
		createClearProfileDataButton: function (){
			return {
				caption: resources.localizableStrings.ClearProfileCaption,
				click: {
					bindTo: "clearProfileData"
				},
			} 
		},
		
		clearProfileData: function() {			
			var config = {
				profileKey: this.getProfileKey()
			};

			ServiceHelper.callService("AvtDataBindingService", "ClearColumnsSetup",
				function(response) {
					if (response && response.ClearColumnsSetupResult) {
						this.close();
					} else {
						this.showInformationDialog(resources.localizableStrings.SendingRequestError, Terrasoft.emptyFn, {
							style: Terrasoft.controls.MessageBoxEnums.Styles.RED
						});
					}
				}, config, this);
		},
		
		generateViewModel: function() {
			const viewModel = this.callParent(arguments);
			
			this.Ext.apply(viewModel, {
				clearProfileData: this.clearProfileData,
			});
			
			return viewModel;
		}
	});
});
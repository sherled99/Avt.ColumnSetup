define("BaseGridDetailV2", ["BaseGridDetailV2Resources"], function(resources) {
	return {
		methods: {
			addGridOperationsMenuItems: function(toolsButtonMenu) {
				this.callParent(arguments);
				this.addBindProfileDataMenuItem(toolsButtonMenu);
			},
			addBindProfileDataMenuItem: function(menuItems) {
				menuItems.addItem(this.getButtonMenuItem({
					"Caption": resources.localizableStrings.ClearProfileCaption,
					"Click": { "bindTo": "onClearProfileDataClick" }
				}));
			},
			onClearProfileDataClick: function() {
				var caption = this.get("Caption") || this.get("SeparateModeActionsButtonHeaderMenuItemCaption") || "";
				var objectType = this.get("Caption") ? resources.localizableStrings.DetailCaption :
					resources.localizableStrings.SectionCaption;
				var messageTemplate = resources.localizableStrings.ColumnsSetupRestoredConfirm;
				this.showConfirmationDialog(Ext.String.format(messageTemplate, objectType, caption), function(returnCode) {
					if (returnCode === Terrasoft.MessageBoxButtons.YES.returnCode) {
						this.clearProfileData();
					}
				}, [Terrasoft.MessageBoxButtons.YES, Terrasoft.MessageBoxButtons.NO]);
			},
			
			clearProfileData: function() {
				this.showBodyMask({showHidden: true});
				this.callService({
					serviceName: "TestServiceV2",
					methodName: "RunTest",
				}, function(response) {
					
				}, this);
				this.callService({
					serviceName: "AvtDataBindingService",
					methodName: "ClearColumnsSetup",
					data: {
						profileKey: this.getProfileKey()
					}
				}, function(response) {
					if (response && response.ClearColumnsSetupResult) {
						this.applyDefaultColumnSetup();
						this.showInformationDialog(resources.localizableStrings.ColumnsSetupRestoredMessage, function() {
							this.reloadGridColumnsConfig(true);
						});
					} else {
						this.showInformationDialog(resources.localizableStrings.SendingRequestError, Terrasoft.emptyFn, {
							style: Terrasoft.controls.MessageBoxEnums.Styles.RED
						});
					}
					this.hideBodyMask();
				}, this);
			},
			
			applyDefaultColumnSetup: function() {
				this.requireProfile(function(profile) {
					profile = Terrasoft.ColumnUtilities.updateProfileColumnCaptions({
						profile: profile,
						entityColumns: this.columns
					});
					this.set("Profile", profile);
					this.set("IsClearGridData", true);
					this.loadGridData();
				}, this);
			},
		}
	};
});

using Common.Logging;
using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using Terrasoft.Common;
using Terrasoft.Core;
using Terrasoft.Core.DB;
using Terrasoft.Web.Common;
using Terrasoft.Web.Common.ServiceRouting;

namespace Terrasoft.Configuration.AvtDocuSign
{
    [ServiceContract]
    [DefaultServiceRoute]
    [SspServiceRoute]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class AvtDataBindingService : BaseService
    {
        #region Public methods

        public AvtDataBindingService() : base()
        {

        }

        public AvtDataBindingService(UserConnection userConnection) : base(userConnection)
        {

        }
        
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
          RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public bool ClearColumnsSetup(string profileKey)
        {
        	return DeleteSysProfileData(profileKey);
        }

        #endregion

        #region Private methods

        private bool DeleteSysProfileData(string profileKey) {
            var result = true;
			try {
				profileKey.CheckArgumentNullOrEmpty("profileKey");
				var delete = new Delete(UserConnection)
					.From("SysProfileData")
					.Where("ContactId").IsEqual(Column.Parameter(UserConnection.CurrentUser.ContactId))
					.And("Key").IsEqual(Column.Parameter(profileKey)) as Delete;
				delete.Execute();
			} catch (Exception ex) {
                Logger.Error(ex);
                result = false;
			}
			return result;
		}

        private static readonly ILog Logger = LogManager.GetLogger("AvtDataBindingService");

        #endregion
    }
}
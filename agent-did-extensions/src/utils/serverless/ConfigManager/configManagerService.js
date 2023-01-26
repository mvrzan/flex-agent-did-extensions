import * as Flex from '@twilio/flex-ui';
import ApiService from '../ApiService/apiService';

export default class ConfigManagerService extends ApiService {
  static async list() {
    try {
      const config = await this._list();
      return config;
    } catch (error) {
      console.log('Unable to list config', error);
      return null;
    }
  }

  static async update(config) {
    try {
      const response = await this._update(config);
      return response;
    } catch (error) {
      console.log('Unable to update config', error);

      // TODO: Modify request util to return status too.
      if (
        error ===
        'Provided version SID is not the latest deployed asset version SID'
      ) {
        return {
          success: false,
          buildSid: 'versionError',
        };
      }

      return {
        success: false,
        buildSid: 'error',
      };
    }
  }

  static async updateStatus(buildSid) {
    try {
      const response = await this._updateStatus({ buildSid });
      return response;
    } catch (error) {
      console.log('Unable to get config build status', error);
      return {
        success: false,
        buildStatus: 'error',
      };
    }
  }

  static async publish(buildSid) {
    try {
      const response = await this._publish({ buildSid });
      return response;
    } catch (error) {
      console.log('Unable to publish config', error);
      return {
        success: false,
        deploymentSid: 'error',
      };
    }
  }

  static async _list() {
    const manager = Flex.Manager.getInstance();

    const encodedParams = {
      Token: encodeURIComponent(manager.user.token),
    };

    const response = await this.fetchJsonWithReject(
      `${process.env.REACT_APP_FUNCTIONS_BASE}/admin/list`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      }
    );

    return {
      ...response,
    };
  }

  static async _update(config) {
    const manager = Flex.Manager.getInstance();

    const params = {
      ...config,
      Token: manager.user.token,
    };

    const response = await this.fetchJsonWithReject(
      `${process.env.REACT_APP_FUNCTIONS_BASE}/admin/update`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );

    return {
      ...response,
    };
  }

  static async _updateStatus(request) {
    const manager = Flex.Manager.getInstance();

    const encodedParams = {
      buildSid: encodeURIComponent(request.buildSid),
      Token: encodeURIComponent(manager.user.token),
    };

    const response = await this.fetchJsonWithReject(
      `${process.env.REACT_APP_FUNCTIONS_BASE}/admin/update-status`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      }
    );

    return response;
  }

  static async _publish(request) {
    const manager = Flex.Manager.getInstance();

    const encodedParams = {
      buildSid: encodeURIComponent(request.buildSid),
      Token: encodeURIComponent(manager.user.token),
    };

    const response = await this.fetchJsonWithReject(
      `${process.env.REACT_APP_FUNCTIONS_BASE}/admin/publish`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      }
    );

    return response;
  }
}

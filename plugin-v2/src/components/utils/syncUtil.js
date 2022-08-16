import { Manager } from '@twilio/flex-ui';
import { SyncClient } from 'twilio-sync';
import { PLUGIN_NAME } from '../../AgentExtensions';

const SYNC_CLIENT = new SyncClient(Manager.getInstance().user.token);

export default class SyncHelper {
  static init(manager) {
    console.log(PLUGIN_NAME, ' SyncHelper add tokenUpdateHandler for sync');
    manager.events.addListener('tokenUpdated', tokenUpdateHandler);
  }

  static async addMapItem(mapName, key, value) {
    try {
      const map = await SYNC_CLIENT.map(mapName);
      await map.set(key, value);
      return true;
    } catch (error) {
      console.error('Map addMapItem() failed', error);
      return false;
    }
  }

  static async deleteMapItem(mapName, key) {
    try {
      const map = await SYNC_CLIENT.map(mapName);
      await map.remove(key);
      return true;
    } catch (error) {
      console.error('Map remove() failed', error);
      return false;
    }
  }

  static pageHandler(paginator) {
    const items = [];
    paginator.items.forEach(function (item) {
      items.push({
        item,
      });
    });
    return paginator.hasNextPage
      ? paginator.nextPage().then(pageHandler)
      : items;
  }

  static async getMapItems(mapName) {
    try {
      const map = await SYNC_CLIENT.map(mapName);
      const paginator = await map.getItems();
      return this.pageHandler(paginator);
    } catch (error) {
      console.error('Map getItems() failed', error);
      return [];
    }
  }

  static async getMapItem(mapName, key) {
    try {
      const mapItems = await this.getMapItems(mapName);
      console.log(PLUGIN_NAME, 'Map Items Array', mapItems);
      //Map Items array of (mapItem) objects with item child object
      const mapItem = mapItems.find(mapItem => {
        return mapItem.item.descriptor.data.extensionNumber === key;
      });

      if (mapItem) {
        return mapItem.item.descriptor.data;
      } else {
        return {};
      }
    } catch (error) {
      console.error('Map getItem() failed', error);
      return {};
    }
  }

  static async updateMapItem(mapName, mapKey, data) {
    try {
      const map = await SYNC_CLIENT.map(mapName);
      const update = await map.update(mapKey, data);
    } catch (error) {
      console.error(error);
      return {};
    }
  }
}

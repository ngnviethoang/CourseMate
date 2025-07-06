import { environment } from '../../environments/environment';

export class StorageConstants {
  private static readonly BASE_URL = environment.apis.default.url;
  static readonly IMAGE_API = `${StorageConstants.BASE_URL}/api/app/storage/image`;
  static readonly VIDEO_API = `${StorageConstants.BASE_URL}/api/app/storage/video`;
}

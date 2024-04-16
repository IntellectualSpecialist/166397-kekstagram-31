import {renderThumbnails} from './render-thumbnails.js';
import {setFileUploadControlEvent} from './form.js';
import {getData} from './api.js';
import {showAlertGet} from './util.js';
import {saveThumbnails} from './photo-modal.js';
import {setFiltersClick} from './filters.js';

const bootstrap = async () => {
  try {
    const photos = await getData();
    saveThumbnails(photos);
    renderThumbnails(photos);

    setFiltersClick(photos);
    if (!photos) {
      throw new Error();
    }
  } catch (error) {
    showAlertGet();
  }
};

bootstrap();
setFileUploadControlEvent();

import {isEscapeKey, openModalElement, closeModalElement, showToastAlert, showAlertSend, showSuccessSend} from './util.js';
import {addValidator, removeValidator, isFormValidate, setEventsOnInfoModal} from './validate-form.js';
import {initScale, deleteScale} from './scale-photo.js';
import {createNoUiSlider, destroyNoUiSlider} from './filter-photo.js';
import {sendData} from './api.js';
import {uploadFormElement, modalFormElement, photoElement} from './const.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...'
};

const fileUploadControlElement = uploadFormElement.querySelector('.img-upload__input');
const formCloseButtonElement = modalFormElement.querySelector('.img-upload__cancel');
const inputHashtagElement = modalFormElement.querySelector('.text__hashtags');
const commentFieldElement = modalFormElement.querySelector('.text__description');
const effectsPreviewsElements = modalFormElement.querySelectorAll('.effects__preview');
const submitButtonElement = modalFormElement.querySelector('#upload-submit');

const onFileUploadControlChange = () => {
  const file = fileUploadControlElement.files[0];
  const fileType = file.type;

  const matches = FILE_TYPES.some((type) => fileType.endsWith(type));

  if (matches) {
    openModalForm();
    const fileURL = URL.createObjectURL(file);
    photoElement.src = fileURL;
    effectsPreviewsElements.forEach((effectsPreview) => {
      effectsPreview.style.backgroundImage = `url(${fileURL})`;
    });
  } else {
    fileUploadControlElement.value = '';
    showToastAlert('Неверный формат изображения');
  }
};

const onCloseModalButtonClick = () => {
  closeModalForm();
};

const onDocumentKeydown = (evt) => {
  const infoModalElement = document.querySelector('.error');
  if (isEscapeKey(evt) && !infoModalElement) {
    evt.preventDefault();
    closeModalForm();
  }
};

const onFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onFieldFocus = (evt) => {
  evt.target.addEventListener('keydown', onFieldKeydown);
};

const resetFormData = () => {
  photoElement.style = '';
  photoElement.src = 'img/upload-default-image.jpg';
  effectsPreviewsElements.forEach((effectsPreview) => {
    effectsPreview.style.backgroundImage = '';
  });
  uploadFormElement.reset();
};

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = SubmitButtonText.IDLE;
};

const sendFormData = async (formElement) => {
  let resultSubmit;

  const isValidate = isFormValidate();
  if (isValidate) {
    resultSubmit = 'success';
    blockSubmitButton();

    try {
      await sendData(new FormData(formElement));
      closeModalForm();
      showSuccessSend();
    } catch (error) {
      showAlertSend();
      resultSubmit = 'error';
    } finally {
      unblockSubmitButton();
      setEventsOnInfoModal(resultSubmit);
    }
  }
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();
  sendFormData(evt.target);
};

const setUserFormSubmit = () => {
  uploadFormElement.addEventListener('submit', onFormSubmit);
};

const removeSetUserFormSubmit = () => {
  uploadFormElement.removeEventListener('submit', onFormSubmit);
};

function openModalForm() {
  openModalElement(modalFormElement);

  formCloseButtonElement.addEventListener('click', onCloseModalButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);

  inputHashtagElement.addEventListener('focus', onFieldFocus);
  commentFieldElement.addEventListener('focus', onFieldFocus);

  initScale();
  addValidator();
  createNoUiSlider();
  setUserFormSubmit();
}

function closeModalForm() {
  closeModalElement(modalFormElement);

  formCloseButtonElement.removeEventListener('click', onCloseModalButtonClick);
  document.removeEventListener('keydown', onDocumentKeydown);

  inputHashtagElement.removeEventListener('focus', onFieldFocus);
  commentFieldElement.removeEventListener('focus', onFieldFocus);

  deleteScale();
  removeValidator();
  destroyNoUiSlider();

  resetFormData();
  removeSetUserFormSubmit();
}

const setFileUploadControlEvent = () => {
  fileUploadControlElement.addEventListener('change', onFileUploadControlChange);
};

export {setFileUploadControlEvent, closeModalForm};

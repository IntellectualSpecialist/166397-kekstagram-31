import {isEscapeKey} from './util.js';
import {uploadFormElement, modalFormElement} from './const.js';

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;

const ErrorHashtagMessages = {
  INVALID_HASHTAG: 'введён невалидный хэштег',
  HASHTAG_REPEAT: 'хэштеги повторяются',
  HASHTAG_NUMBER_EXCEEDED: 'превышено количество хэштегов'
};
const ERROR_COMMENT_MESSAGE = 'длина комментария больше 140 символов';

const hashtagRegExp = /^#[a-zа-яё0-9]{1,19}$/i;
let pristine;
let infoModalElement;

const inputHashtagElement = modalFormElement.querySelector('.text__hashtags');
const commentFieldElement = modalFormElement.querySelector('.text__description');

const checkArrayOfHashtags = (hashtagsArray) => hashtagsArray.every((hashtag) => hashtagRegExp.test(hashtag));

const checkUniqueHashtags = (hashtagsArray) => hashtagsArray.every((element, index, array) => array.indexOf(element) === index);

const checkHashtagsLength = (hashtagsArray) => hashtagsArray.length <= MAX_HASHTAG_COUNT;

const convertsHashtagsToArray = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ').split(' ');

const validateHashtag = (value) => {
  const hashtags = convertsHashtagsToArray(value);

  const isArrayOfHashtags = checkArrayOfHashtags(hashtags);
  const isUniqueHashtags = checkUniqueHashtags(hashtags);
  const isAllowableLength = checkHashtagsLength(hashtags);

  return (isArrayOfHashtags && isUniqueHashtags && isAllowableLength) || !value;
};

const getErrorMessage = (value) => {
  const hashtags = convertsHashtagsToArray(value);

  const isArrayOfHashtags = checkArrayOfHashtags(hashtags);
  const isUniqueHashtags = checkUniqueHashtags(hashtags);
  const isAllowableLength = checkHashtagsLength(hashtags);

  if (!isAllowableLength) {
    return ErrorHashtagMessages.HASHTAG_NUMBER_EXCEEDED;
  }
  if (!isArrayOfHashtags && value) {
    return ErrorHashtagMessages.INVALID_HASHTAG;
  }
  if (!isUniqueHashtags) {
    return ErrorHashtagMessages.HASHTAG_REPEAT;
  }
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const addValidator = () => {
  pristine = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__field-wrapper--error'
  });

  pristine.addValidator(inputHashtagElement, validateHashtag, getErrorMessage);
  pristine.addValidator(commentFieldElement, validateComment, ERROR_COMMENT_MESSAGE);
};

const removeValidator = () => {
  pristine.destroy();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeInfoModal();
  }
};

function closeInfoModal() {
  infoModalElement.remove();
  document.removeEventListener('keydown', onDocumentKeydown);
}

const setEventsOnInfoModal = (resultSubmit) => {
  infoModalElement = document.querySelector(`.${resultSubmit}`);

  document.addEventListener('keydown', onDocumentKeydown);

  infoModalElement.addEventListener('click', (evt) => {
    if (evt.target.closest(`.${resultSubmit}__inner`) && !evt.target.matches(`.${resultSubmit}__button`)) {
      evt.stopPropagation();
    } else {
      closeInfoModal();
    }
  });
};

const isFormValidate = () => pristine.validate();

export {addValidator, removeValidator, isFormValidate, setEventsOnInfoModal};

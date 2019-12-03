"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

$(document).ready(function () {
  /**
   * Глобальные переменные, которые используются многократно
   */
  var globalOptions = {
    // Время для анимаций
    time: 200,
    // Контрольные точки адаптива
    desktopXlSize: 1920,
    desktopLgSize: 1600,
    desktopSize: 1280,
    tabletLgSize: 1024,
    tabletSize: 768,
    mobileLgSize: 640,
    mobileSize: 480,
    // Точка перехода попапов на фулскрин
    popupsBreakpoint: 768,
    // Время до сокрытия фиксированных попапов
    popupsFixedTimeout: 5000,
    // Проверка touch устройств
    isTouch: $.browser.mobile,
    lang: $('html').attr('lang')
  }; // Брейкпоинты адаптива
  // @example if (globalOptions.breakpointTablet.matches) {} else {}

  var breakpoints = {
    breakpointDesktopXl: window.matchMedia("(max-width: ".concat(globalOptions.desktopXlSize - 1, "px)")),
    breakpointDesktopLg: window.matchMedia("(max-width: ".concat(globalOptions.desktopLgSize - 1, "px)")),
    breakpointDesktop: window.matchMedia("(max-width: ".concat(globalOptions.desktopSize - 1, "px)")),
    breakpointTabletLg: window.matchMedia("(max-width: ".concat(globalOptions.tabletLgSize - 1, "px)")),
    breakpointTablet: window.matchMedia("(max-width: ".concat(globalOptions.tabletSize - 1, "px)")),
    breakpointMobileLgSize: window.matchMedia("(max-width: ".concat(globalOptions.mobileLgSize - 1, "px)")),
    breakpointMobile: window.matchMedia("(max-width: ".concat(globalOptions.mobileSize - 1, "px)"))
  };
  $.extend(true, globalOptions, breakpoints);
  $(window).load(function () {
    if (globalOptions.isTouch) {
      $('body').addClass('touch').removeClass('no-touch');
    } else {
      $('body').addClass('no-touch').removeClass('touch');
    } // if ($('textarea').length > 0) {
    //     autosize($('textarea'));
    // }

  });
  /**
   * Подключение js partials
   */

  /* form_style.js должен быть выполнен перед form_validation.js */

  /**
   * Расширение animate.css
   * @param  {String} animationName название анимации
   * @param  {Function} callback функция, которая отработает после завершения анимации
   * @return {Object} объект анимации
   * 
   * @see  https://daneden.github.io/animate.css/
   * 
   * @example
   * $('#yourElement').animateCss('bounce');
   * 
   * $('#yourElement').animateCss('bounce', function() {
   *     // Делаем что-то после завершения анимации
   * });
   */

  $.fn.extend({
    animateCss: function animateCss(animationName, callback) {
      var animationEnd = function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      }(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function') callback();
      });
      return this;
    }
  });
  /**
   * Стилизует селекты с помощью плагина select2
   * https://select2.github.io
   */

  var CustomSelect = function CustomSelect($elem) {
    var self = this;

    self.init = function ($initElem) {
      $initElem.each(function () {
        if ($(this).hasClass('select2-hidden-accessible')) {
          return;
        } else {
          var selectSearch = $(this).data('search');
          var minimumResultsForSearch;

          if (selectSearch) {
            minimumResultsForSearch = 1; // показываем поле поиска
          } else {
            minimumResultsForSearch = Infinity; // не показываем поле поиска
          }

          $(this).select2({
            minimumResultsForSearch: minimumResultsForSearch,
            selectOnBlur: true,
            dropdownCssClass: 'error'
          });
          $(this).on('change', function (e) {
            // нужно для вылидации на лету
            $(this).find("option[value=\"".concat($(this).context.value, "\"]")).click();
          });
        }
      });
    };

    self.update = function ($updateElem) {
      $updateElem.select2('destroy');
      self.init($updateElem);
    };

    self.init($elem);
  };
  /**
   * Стилизует file input
   * http://gregpike.net/demos/bootstrap-file-input/demo.html
   */


  $.fn.customFileInput = function () {
    this.each(function (i, elem) {
      var $elem = $(elem); // Maybe some fields don't need to be standardized.

      if (typeof $elem.attr('data-bfi-disabled') !== 'undefined') {
        return;
      } // Set the word to be displayed on the button


      var buttonWord = 'Browse';
      var className = '';

      if (typeof $elem.attr('title') !== 'undefined') {
        buttonWord = $elem.attr('title');
      }

      if (!!$elem.attr('class')) {
        className = ' ' + $elem.attr('class');
      } // Now we're going to wrap that input field with a button.
      // The input will actually still be there, it will just be float above and transparent (done with the CSS).


      $elem.wrap("<div class=\"custom-file\"><a class=\"btn ".concat(className, "\"></a></div>")).parent().prepend($('<span></span>').html(buttonWord));
    }) // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
    // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
    .promise().done(function () {
      // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
      // This gives us the pointer cursor that FF denies us
      $('.custom-file').mousemove(function (cursor) {
        var input, wrapper, wrapperX, wrapperY, inputWidth, inputHeight, cursorX, cursorY; // This wrapper element (the button surround this file input)

        wrapper = $(this); // The invisible file input element

        input = wrapper.find('input'); // The left-most position of the wrapper

        wrapperX = wrapper.offset().left; // The top-most position of the wrapper

        wrapperY = wrapper.offset().top; // The with of the browsers input field

        inputWidth = input.width(); // The height of the browsers input field

        inputHeight = input.height(); //The position of the cursor in the wrapper

        cursorX = cursor.pageX;
        cursorY = cursor.pageY; //The positions we are to move the invisible file input
        // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle

        moveInputX = cursorX - wrapperX - inputWidth + 20; // Slides the invisible input Browse button to be positioned middle under the cursor

        moveInputY = cursorY - wrapperY - inputHeight / 2; // Apply the positioning styles to actually move the invisible file input

        input.css({
          left: moveInputX,
          top: moveInputY
        });
      });
      $('body').on('change', '.custom-file input[type=file]', function () {
        var fileName;
        fileName = $(this).val(); // Remove any previous file names

        $(this).parent().next('.custom-file__name').remove();

        if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
          fileName = $(this)[0].files.length + ' files';
        } else {
          fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
        } // Don't try to show the name if there is none


        if (!fileName) {
          return;
        }

        var selectedFileNamePlacement = $(this).data('filename-placement');

        if (selectedFileNamePlacement === 'inside') {
          // Print the fileName inside
          $(this).siblings('span').html(fileName);
          $(this).attr('title', fileName);
        } else {
          // Print the fileName aside (right after the the button)
          $(this).parent().after("<span class=\"custom-file__name\">".concat(fileName, " </span>"));
        }
      });
    });
  };

  $('input[type="file"]').customFileInput(); // $('select').customSelect();

  var customSelect = new CustomSelect($('select'));

  if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function (index, el) {
      var field = $(el).find('input, textarea');

      if ($(field).val().trim() != '') {
        $(el).addClass('is-filled');
      }

      $(field).on('focus', function (event) {
        $(el).addClass('is-filled');
      }).on('blur', function (event) {
        if ($(this).val().trim() === '') {
          $(el).removeClass('is-filled');
        }
      });
    });
  }

  var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';
  Parsley.setLocale(locale);
  /* Настройки Parsley */

  $.extend(Parsley.options, {
    trigger: 'blur change',
    // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function classHandler(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $handler;

      if (type == 'checkbox' || type == 'radio') {
        $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $handler = $('.select2-selection--single', $element.next('.select2'));
      }

      return $handler;
    },
    errorsContainer: function errorsContainer(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $container;

      if (type == 'checkbox' || type == 'radio') {
        $container = $("[name=\"".concat($element.attr('name'), "\"]:last + label")).next('.errors-placement');
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $container = $element.next('.select2').next('.errors-placement');
      } else if (type == 'file') {
        $container = $element.closest('.custom-file').next('.errors-placement');
      } else if ($element.closest('.js-datepicker-range').length) {
        $container = $element.closest('.js-datepicker-range').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      }

      return $container;
    }
  }); // Кастомные валидаторы
  // Только русские буквы, тире, пробелы

  Parsley.addValidator('nameRu', {
    validateString: function validateString(value) {
      return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, " ", "-"',
      en: 'Only simbols А-Я, а-я, " ", "-"'
    }
  }); // Только латинские буквы, тире, пробелы

  Parsley.addValidator('nameEn', {
    validateString: function validateString(value) {
      return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, " ", "-"',
      en: 'Only simbols A-Z, a-z, " ", "-"'
    }
  }); // Только латинские и русские буквы, тире, пробелы

  Parsley.addValidator('name', {
    validateString: function validateString(value) {
      return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
  }); // Только цифры и русские буквы

  Parsley.addValidator('numLetterRu', {
    validateString: function validateString(value) {
      return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, 0-9',
      en: 'Only simbols А-Я, а-я, 0-9'
    }
  }); // Только цифры, латинские и русские буквы

  Parsley.addValidator('numLetter', {
    validateString: function validateString(value) {
      return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
  }); // Телефонный номер

  Parsley.addValidator('phone', {
    validateString: function validateString(value) {
      return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
      ru: 'Некорректный телефонный номер',
      en: 'Incorrect phone number'
    }
  }); // Только цифры

  Parsley.addValidator('number', {
    validateString: function validateString(value) {
      return /^[0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы 0-9',
      en: 'Only simbols 0-9'
    }
  }); // Почта без кириллицы

  Parsley.addValidator('email', {
    validateString: function validateString(value) {
      return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
      ru: 'Некорректный почтовый адрес',
      en: 'Incorrect email address'
    }
  }); // Формат даты DD.MM.YYYY

  Parsley.addValidator('date', {
    validateString: function validateString(value) {
      var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
          regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
          min = arguments[2].$element.data('dateMin'),
          max = arguments[2].$element.data('dateMax'),
          minDate,
          maxDate,
          valueDate,
          result;

      if (min && (result = min.match(regMatch))) {
        minDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (max && (result = max.match(regMatch))) {
        maxDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (result = value.match(regMatch)) {
        valueDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
    },
    messages: {
      ru: 'Некорректная дата',
      en: 'Incorrect date'
    }
  }); // Файл ограниченного размера

  Parsley.addValidator('fileMaxSize', {
    validateString: function validateString(value, maxSize, parsleyInstance) {
      var files = parsleyInstance.$element[0].files;
      return files.length != 1 || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
      ru: 'Файл должен весить не более, чем %s Kb',
      en: 'File size can\'t be more then %s Kb'
    }
  }); // Ограничения расширений файлов

  Parsley.addValidator('fileExtension', {
    validateString: function validateString(value, formats) {
      var fileExtension = value.split('.').pop();
      var formatsArr = formats.split(', ');
      var valid = false;

      for (var i = 0; i < formatsArr.length; i++) {
        if (fileExtension === formatsArr[i]) {
          valid = true;
          break;
        }
      }

      return valid;
    },
    messages: {
      ru: 'Допустимы только файлы формата %s',
      en: 'Available extensions are %s'
    }
  }); // Создаёт контейнеры для ошибок у нетипичных элементов

  Parsley.on('field:init', function () {
    var $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
      $last = $("[name=\"".concat($element.attr('name'), "\"]:last + label"));

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.hasClass('select2-hidden-accessible')) {
      $last = $element.next('.select2');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if (type == 'file') {
      $last = $element.closest('.custom-file');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.closest('.js-datepicker-range').length) {
      $last = $element.closest('.js-datepicker-range');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.attr('name') == 'is_recaptcha_success') {
      $last = $element.parent().next('.g-recaptcha');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    }
  }); // Инициирует валидацию на втором каледарном поле диапазона

  Parsley.on('field:validated', function () {
    var $element = $(this.element);
  });
  $('form[data-validate="true"]').parsley();
  /**
   * Добавляет маски в поля форм
   * @see  https://github.com/RobinHerbots/Inputmask
   *
   * @example
   * <input class="js-phone-mask" type="tel" name="tel" id="tel">
   */

  $('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
  });
  $(".flagman-request__date").datepicker();
  /**
   * Костыль для обновления xlink у svg-иконок после обновления DOM (для IE)
   * функцию нужно вызывать в событиях, которые вносят изменения в элементы уже после формирования DOM-а
   * (например, после инициализации карусели или открытии попапа)
   *
   * @param  {Element} element элемент, в котором необходимо обновить svg (наприм $('#some-popup'))
   */

  function updateSvg(element) {
    var $useElement = element.find('use');
    $useElement.each(function (index) {
      if ($useElement[index].href && $useElement[index].href.baseVal) {
        $useElement[index].href.baseVal = $useElement[index].href.baseVal; // trigger fixing of href
      }
    });
  }

  var datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true
  };
  /**
   * Делает выпадющие календарики
   * @see  http://api.jqueryui.com/datepicker/
   *
   * @example
   * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
   * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
   */

  var Datepicker = function Datepicker() {
    var datepicker = $('.js-datepicker');
    datepicker.each(function () {
      var minDate = $(this).data('date-min');
      var maxDate = $(this).data('date-max');
      var itemOptions = {
        minDate: minDate || null,
        maxDate: maxDate || null,
        onSelect: function onSelect() {
          $(this).change();
          $(this).closest('.field').addClass('is-filled');
        }
      };
      $.extend(true, itemOptions, datepickerDefaultOptions);
      $(this).datepicker(itemOptions);
    });
  };

  var datepicker = new Datepicker(); // Диапазон дат

  var DatepickerRange = function DatepickerRange() {
    var datepickerRange = $('.js-datepicker-range');
    datepickerRange.each(function () {
      var fromItemOptions = {};
      var toItemOptions = {};
      $.extend(true, fromItemOptions, datepickerDefaultOptions);
      $.extend(true, toItemOptions, datepickerDefaultOptions);
      var dateFrom = $(this).find('.js-range-from').datepicker(fromItemOptions);
      var dateTo = $(this).find('.js-range-to').datepicker(toItemOptions);
      dateFrom.on('change', function () {
        dateTo.datepicker('option', 'minDate', getDate(this));
        dateTo.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
      dateTo.on('change', function () {
        dateFrom.datepicker('option', 'maxDate', getDate(this));
        dateFrom.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
    });

    function getDate(element) {
      var date;

      try {
        date = $.datepicker.parseDate(datepickerDefaultOptions.dateFormat, element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  };

  var datepickerRange = new DatepickerRange();
  /**
   * Реализует переключение табов
   *
   * @example
   * <ul class="tabs js-tabs">
   *     <li class="tabs__item">
   *         <span class="is-active tabs__link js-tab-link">Tab name</span>
   *         <div class="tabs__cnt">
   *             <p>Tab content</p>
   *         </div>
   *     </li>
   * </ul>
   */

  var TabSwitcher = function TabSwitcher() {
    var self = this;
    var tabs = $('.js-tabs');
    tabs.each(function () {
      $(this).find('.js-tab-link.is-active').next().addClass('is-open');
    });
    tabs.on('click', '.js-tab-link', function (event) {
      self.open($(this), event); // return false;
    });
    /**
     * Открывает таб по клику на какой-то другой элемент
     *
     * @example
     * <span data-tab-open="#tab-login">Open login tab</span>
     */

    $(document).on('click', '[data-tab-open]', function (event) {
      var tabElem = $(this).data('tab-open');
      self.open($(tabElem), event);

      if ($(this).data('popup') == undefined) {
        return false;
      }
    });
    /**
     * Открывает таб
     * @param  {Element} elem элемент .js-tab-link, на который нужно переключить
     *
     * @example
     * // вызов метода open, откроет таб
     * tabSwitcher.open($('#some-tab'));
     */

    self.open = function (elem, event) {
      if (!elem.hasClass('is-active')) {
        event.preventDefault();
        var parentTabs = elem.closest(tabs);
        parentTabs.find('.is-open').removeClass('is-open');
        elem.next().toggleClass('is-open');
        parentTabs.find('.is-active').removeClass('is-active');
        elem.addClass('is-active');
      } else {
        event.preventDefault();
      }
    };
  };

  var tabSwitcher = new TabSwitcher();
  /**
   * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
   *
   * @param  {Element}   targetElem
   * @param  {Element}   hiddenElem
   * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
   */

  function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
    $(document).bind('mouseup touchend', function (e) {
      if (!targetElem.is(e.target) && $(e.target).closest(targetElem).length == 0) {
        hiddenElem.stop(true, true).fadeOut(globalOptions.time);

        if (optionalCb) {
          optionalCb();
        }
      }
    });
  }
  /**
   * Хэлпер для показа, скрытия или чередования видимости элементов
   *
   * @example
   * <button type="button" data-visibility="show" data-show="#elemId1"></button>
   *
   * или
   * <button type="button" data-visibility="hide" data-hide="#elemId2"></button>
   *
   * или
   * <button type="button" data-visibility="toggle" data-toggle="#elemId3"></button>
   *
   * или
   * <button type="button" data-visibility="show" data-show="#elemId1|#elemId3"></button>
   *
   * или
   * // если есть атрибут data-queue="show", то будет сначала скрыт элемент #elemId2, а потом показан #elemId1
   * <button type="button" data-visibility="show" data-show="#elemId1" data-visibility="hide" data-hide="#elemId2" data-queue="show"></button>
   *
   * <div id="elemId1" style="display: none;">Text</div>
   * <div id="elemId2">Text</div>
   * <div id="elemId3" style="display: none;">Text</div>
   */


  var visibilityControl = function visibilityControl() {
    var settings = {
      types: ['show', 'hide', 'toggle']
    };

    if ($('[data-visibility]').length > 0) {
      /**
       * Устанавливает видимость
       * @param {String}  visibilityType тип отображения
       * @param {Array}   list массив элементов, с которым работаем
       * @param {Number}  delay задержка при показе элемента в ms
       */
      var setVisibility = function setVisibility(visibilityType, list, delay) {
        for (var i = 0; i < list.length; i++) {
          if (visibilityType == settings.types[0]) {
            $(list[i]).delay(delay).fadeIn(globalOptions.time);
          }

          if (visibilityType == settings.types[1]) {
            $(list[i]).fadeOut(globalOptions.time);
          }

          if (visibilityType == settings.types[2]) {
            if ($(list[i]).is(':visible')) {
              $(list[i]).fadeOut(globalOptions.time);
            } else {
              $(list[i]).fadeIn(globalOptions.time);
            }
          }
        }
      };

      $(document).on('click', '[data-visibility]', function () {
        var dataType;

        for (var i = 0; i < settings.types.length; i++) {
          dataType = settings.types[i];

          if ($(this).data(dataType)) {
            var visibilityList = $(this).data(dataType).split('|'),
                delay = 0;

            if ($(this).data('queue') == 'show') {
              delay = globalOptions.time;
            } else {
              delay = 0;
            }

            setVisibility(dataType, visibilityList, delay);
          }
        }

        if (!$(this).hasClass('tabs__link') && $(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox') {
          return false;
        }
      });
    }
  };

  visibilityControl();
  /**
   * Делает слайдер
   * @see  http://api.jqueryui.com/slider/
   *
   * @example
   * // в data-min и data-max задаются минимальное и максимальное значение
   * // в data-step шаг,
   * // в data-values дефолтные значения "min, max"
   * <div class="slider js-range">
   *      <div class="slider__range" data-min="0" data-max="100" data-step="1" data-values="10, 55"></div>
   * </div>
   */

  var Slider = function Slider() {
    var slider = $('.js-range');
    var min, max, step, values;
    slider.each(function () {
      var self = $(this),
          range = self.find('.slider__range');
      min = range.data('min');
      max = range.data('max');
      step = range.data('step');
      values = range.data('values').split(', ');
      range.slider({
        range: true,
        min: min || null,
        max: max || null,
        step: step || 1,
        values: values,
        slide: function slide(event, ui) {
          self.find('.ui-slider-handle').children('span').remove();
          self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(ui.values[0], "</span>"));
          self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(ui.values[1], "</span>"));
        }
      });
      self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(range.slider('values', 0), "</span>"));
      self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(range.slider('values', 1), "</span>"));
    });
  };

  var slider = new Slider();
  /**
   * Фиксированный хедер
   */

  $(window).on('scroll', toggleFixedHeader);

  function toggleFixedHeader() {
    var $header = $('.header');
    var $main = $('.header').next();

    if (window.pageYOffset > 0) {
      $header.addClass('is-fixed');
      $main.css({
        marginTop: $header.outerHeight()
      });
    } else {
      $header.removeClass('is-fixed');
      $main.css({
        marginTop: 0
      });
    }
  }
  /*
       _ _      _       _
   ___| (_) ___| | __  (_)___
  / __| | |/ __| |/ /  | / __|
  \__ \ | | (__|   < _ | \__ \
  |___/_|_|\___|_|\_(_)/ |___/
                     |__/
    Version: 1.8.0
    Author: Ken Wheeler
   Website: http://kenwheeler.github.io
      Docs: http://kenwheeler.github.io/slick
      Repo: http://github.com/kenwheeler/slick
    Issues: http://github.com/kenwheeler/slick/issues
    */

  /* global window, document, define, jQuery, setInterval, clearInterval */


  ;

  (function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
    } else {
      factory(jQuery);
    }
  })(function ($) {
    'use strict';

    var Slick = window.Slick || {};

    Slick = function () {
      var instanceUid = 0;

      function Slick(element, settings) {
        var _ = this,
            dataSettings;

        _.defaults = {
          accessibility: true,
          adaptiveHeight: false,
          appendArrows: $(element),
          appendDots: $(element),
          arrows: true,
          asNavFor: null,
          prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
          nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
          autoplay: false,
          autoplaySpeed: 3000,
          centerMode: false,
          centerPadding: '50px',
          cssEase: 'ease',
          customPaging: function customPaging(slider, i) {
            return $('<button type="button" />').text(i + 1);
          },
          dots: false,
          dotsClass: 'slick-dots',
          draggable: true,
          easing: 'linear',
          edgeFriction: 0.35,
          fade: false,
          focusOnSelect: false,
          focusOnChange: false,
          infinite: true,
          initialSlide: 0,
          lazyLoad: 'ondemand',
          mobileFirst: false,
          pauseOnHover: true,
          pauseOnFocus: true,
          pauseOnDotsHover: false,
          respondTo: 'window',
          responsive: null,
          rows: 1,
          rtl: false,
          slide: '',
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          swipe: true,
          swipeToSlide: false,
          touchMove: true,
          touchThreshold: 5,
          useCSS: true,
          useTransform: true,
          variableWidth: false,
          vertical: false,
          verticalSwiping: false,
          waitForAnimate: true,
          zIndex: 1000
        };
        _.initials = {
          animating: false,
          dragging: false,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: false,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: false,
          slideOffset: 0,
          swipeLeft: null,
          swiping: false,
          $list: null,
          touchObject: {},
          transformsEnabled: false,
          unslicked: false
        };
        $.extend(_, _.initials);
        _.activeBreakpoint = null;
        _.animType = null;
        _.animProp = null;
        _.breakpoints = [];
        _.breakpointSettings = [];
        _.cssTransitions = false;
        _.focussed = false;
        _.interrupted = false;
        _.hidden = 'hidden';
        _.paused = true;
        _.positionProp = null;
        _.respondTo = null;
        _.rowCount = 1;
        _.shouldClick = true;
        _.$slider = $(element);
        _.$slidesCache = null;
        _.transformType = null;
        _.transitionType = null;
        _.visibilityChange = 'visibilitychange';
        _.windowWidth = 0;
        _.windowTimer = null;
        dataSettings = $(element).data('slick') || {};
        _.options = $.extend({}, _.defaults, settings, dataSettings);
        _.currentSlide = _.options.initialSlide;
        _.originalSettings = _.options;

        if (typeof document.mozHidden !== 'undefined') {
          _.hidden = 'mozHidden';
          _.visibilityChange = 'mozvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
          _.hidden = 'webkitHidden';
          _.visibilityChange = 'webkitvisibilitychange';
        }

        _.autoPlay = $.proxy(_.autoPlay, _);
        _.autoPlayClear = $.proxy(_.autoPlayClear, _);
        _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
        _.changeSlide = $.proxy(_.changeSlide, _);
        _.clickHandler = $.proxy(_.clickHandler, _);
        _.selectHandler = $.proxy(_.selectHandler, _);
        _.setPosition = $.proxy(_.setPosition, _);
        _.swipeHandler = $.proxy(_.swipeHandler, _);
        _.dragHandler = $.proxy(_.dragHandler, _);
        _.keyHandler = $.proxy(_.keyHandler, _);
        _.instanceUid = instanceUid++; // A simple way to check for HTML strings
        // Strict HTML recognition (must start with <)
        // Extracted from jQuery v1.11 source

        _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

        _.registerBreakpoints();

        _.init(true);
      }

      return Slick;
    }();

    Slick.prototype.activateADA = function () {
      var _ = this;

      _.$slideTrack.find('.slick-active').attr({
        'aria-hidden': 'false'
      }).find('a, input, button, select').attr({
        'tabindex': '0'
      });
    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
      var _ = this;

      if (typeof index === 'boolean') {
        addBefore = index;
        index = null;
      } else if (index < 0 || index >= _.slideCount) {
        return false;
      }

      _.unload();

      if (typeof index === 'number') {
        if (index === 0 && _.$slides.length === 0) {
          $(markup).appendTo(_.$slideTrack);
        } else if (addBefore) {
          $(markup).insertBefore(_.$slides.eq(index));
        } else {
          $(markup).insertAfter(_.$slides.eq(index));
        }
      } else {
        if (addBefore === true) {
          $(markup).prependTo(_.$slideTrack);
        } else {
          $(markup).appendTo(_.$slideTrack);
        }
      }

      _.$slides = _.$slideTrack.children(this.options.slide);

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.append(_.$slides);

      _.$slides.each(function (index, element) {
        $(element).attr('data-slick-index', index);
      });

      _.$slidesCache = _.$slides;

      _.reinit();
    };

    Slick.prototype.animateHeight = function () {
      var _ = this;

      if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
        var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

        _.$list.animate({
          height: targetHeight
        }, _.options.speed);
      }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {
      var animProps = {},
          _ = this;

      _.animateHeight();

      if (_.options.rtl === true && _.options.vertical === false) {
        targetLeft = -targetLeft;
      }

      if (_.transformsEnabled === false) {
        if (_.options.vertical === false) {
          _.$slideTrack.animate({
            left: targetLeft
          }, _.options.speed, _.options.easing, callback);
        } else {
          _.$slideTrack.animate({
            top: targetLeft
          }, _.options.speed, _.options.easing, callback);
        }
      } else {
        if (_.cssTransitions === false) {
          if (_.options.rtl === true) {
            _.currentLeft = -_.currentLeft;
          }

          $({
            animStart: _.currentLeft
          }).animate({
            animStart: targetLeft
          }, {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function step(now) {
              now = Math.ceil(now);

              if (_.options.vertical === false) {
                animProps[_.animType] = 'translate(' + now + 'px, 0px)';

                _.$slideTrack.css(animProps);
              } else {
                animProps[_.animType] = 'translate(0px,' + now + 'px)';

                _.$slideTrack.css(animProps);
              }
            },
            complete: function complete() {
              if (callback) {
                callback.call();
              }
            }
          });
        } else {
          _.applyTransition();

          targetLeft = Math.ceil(targetLeft);

          if (_.options.vertical === false) {
            animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
          } else {
            animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
          }

          _.$slideTrack.css(animProps);

          if (callback) {
            setTimeout(function () {
              _.disableTransition();

              callback.call();
            }, _.options.speed);
          }
        }
      }
    };

    Slick.prototype.getNavTarget = function () {
      var _ = this,
          asNavFor = _.options.asNavFor;

      if (asNavFor && asNavFor !== null) {
        asNavFor = $(asNavFor).not(_.$slider);
      }

      return asNavFor;
    };

    Slick.prototype.asNavFor = function (index) {
      var _ = this,
          asNavFor = _.getNavTarget();

      if (asNavFor !== null && _typeof(asNavFor) === 'object') {
        asNavFor.each(function () {
          var target = $(this).slick('getSlick');

          if (!target.unslicked) {
            target.slideHandler(index, true);
          }
        });
      }
    };

    Slick.prototype.applyTransition = function (slide) {
      var _ = this,
          transition = {};

      if (_.options.fade === false) {
        transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
      } else {
        transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
      }

      if (_.options.fade === false) {
        _.$slideTrack.css(transition);
      } else {
        _.$slides.eq(slide).css(transition);
      }
    };

    Slick.prototype.autoPlay = function () {
      var _ = this;

      _.autoPlayClear();

      if (_.slideCount > _.options.slidesToShow) {
        _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
      }
    };

    Slick.prototype.autoPlayClear = function () {
      var _ = this;

      if (_.autoPlayTimer) {
        clearInterval(_.autoPlayTimer);
      }
    };

    Slick.prototype.autoPlayIterator = function () {
      var _ = this,
          slideTo = _.currentSlide + _.options.slidesToScroll;

      if (!_.paused && !_.interrupted && !_.focussed) {
        if (_.options.infinite === false) {
          if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
            _.direction = 0;
          } else if (_.direction === 0) {
            slideTo = _.currentSlide - _.options.slidesToScroll;

            if (_.currentSlide - 1 === 0) {
              _.direction = 1;
            }
          }
        }

        _.slideHandler(slideTo);
      }
    };

    Slick.prototype.buildArrows = function () {
      var _ = this;

      if (_.options.arrows === true) {
        _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
        _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

        if (_.slideCount > _.options.slidesToShow) {
          _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

          _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

          if (_.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.prependTo(_.options.appendArrows);
          }

          if (_.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.appendTo(_.options.appendArrows);
          }

          if (_.options.infinite !== true) {
            _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
          }
        } else {
          _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
            'aria-disabled': 'true',
            'tabindex': '-1'
          });
        }
      }
    };

    Slick.prototype.buildDots = function () {
      var _ = this,
          i,
          dot;

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
        _.$slider.addClass('slick-dotted');

        dot = $('<ul />').addClass(_.options.dotsClass);

        for (i = 0; i <= _.getDotCount(); i += 1) {
          dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
        }

        _.$dots = dot.appendTo(_.options.appendDots);

        _.$dots.find('li').first().addClass('slick-active');
      }
    };

    Slick.prototype.buildOut = function () {
      var _ = this;

      _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
      _.slideCount = _.$slides.length;

      _.$slides.each(function (index, element) {
        $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
      });

      _.$slider.addClass('slick-slider');

      _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
      _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();

      _.$slideTrack.css('opacity', 0);

      if (_.options.centerMode === true || _.options.swipeToSlide === true) {
        _.options.slidesToScroll = 1;
      }

      $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

      _.setupInfinite();

      _.buildArrows();

      _.buildDots();

      _.updateDots();

      _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

      if (_.options.draggable === true) {
        _.$list.addClass('draggable');
      }
    };

    Slick.prototype.buildRows = function () {
      var _ = this,
          a,
          b,
          c,
          newSlides,
          numOfSlides,
          originalSlides,
          slidesPerSection;

      newSlides = document.createDocumentFragment();
      originalSlides = _.$slider.children();

      if (_.options.rows > 0) {
        slidesPerSection = _.options.slidesPerRow * _.options.rows;
        numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

        for (a = 0; a < numOfSlides; a++) {
          var slide = document.createElement('div');

          for (b = 0; b < _.options.rows; b++) {
            var row = document.createElement('div');

            for (c = 0; c < _.options.slidesPerRow; c++) {
              var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);

              if (originalSlides.get(target)) {
                row.appendChild(originalSlides.get(target));
              }
            }

            slide.appendChild(row);
          }

          newSlides.appendChild(slide);
        }

        _.$slider.empty().append(newSlides);

        _.$slider.children().children().children().css({
          'width': 100 / _.options.slidesPerRow + '%',
          'display': 'inline-block'
        });
      }
    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {
      var _ = this,
          breakpoint,
          targetBreakpoint,
          respondToWidth,
          triggerBreakpoint = false;

      var sliderWidth = _.$slider.width();

      var windowWidth = window.innerWidth || $(window).width();

      if (_.respondTo === 'window') {
        respondToWidth = windowWidth;
      } else if (_.respondTo === 'slider') {
        respondToWidth = sliderWidth;
      } else if (_.respondTo === 'min') {
        respondToWidth = Math.min(windowWidth, sliderWidth);
      }

      if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
        targetBreakpoint = null;

        for (breakpoint in _.breakpoints) {
          if (_.breakpoints.hasOwnProperty(breakpoint)) {
            if (_.originalSettings.mobileFirst === false) {
              if (respondToWidth < _.breakpoints[breakpoint]) {
                targetBreakpoint = _.breakpoints[breakpoint];
              }
            } else {
              if (respondToWidth > _.breakpoints[breakpoint]) {
                targetBreakpoint = _.breakpoints[breakpoint];
              }
            }
          }
        }

        if (targetBreakpoint !== null) {
          if (_.activeBreakpoint !== null) {
            if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
              _.activeBreakpoint = targetBreakpoint;

              if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                _.unslick(targetBreakpoint);
              } else {
                _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

                if (initial === true) {
                  _.currentSlide = _.options.initialSlide;
                }

                _.refresh(initial);
              }

              triggerBreakpoint = targetBreakpoint;
            }
          } else {
            _.activeBreakpoint = targetBreakpoint;

            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }

              _.refresh(initial);
            }

            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          if (_.activeBreakpoint !== null) {
            _.activeBreakpoint = null;
            _.options = _.originalSettings;

            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }

            _.refresh(initial);

            triggerBreakpoint = targetBreakpoint;
          }
        } // only trigger breakpoints during an actual break. not on initialize.


        if (!initial && triggerBreakpoint !== false) {
          _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
        }
      }
    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {
      var _ = this,
          $target = $(event.currentTarget),
          indexOffset,
          slideOffset,
          unevenOffset; // If target is a link, prevent default action.


      if ($target.is('a')) {
        event.preventDefault();
      } // If target is not the <li> element (ie: a child), find the <li>.


      if (!$target.is('li')) {
        $target = $target.closest('li');
      }

      unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
      indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

      switch (event.data.message) {
        case 'previous':
          slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

          if (_.slideCount > _.options.slidesToShow) {
            _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
          }

          break;

        case 'next':
          slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

          if (_.slideCount > _.options.slidesToShow) {
            _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
          }

          break;

        case 'index':
          var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

          _.slideHandler(_.checkNavigable(index), false, dontAnimate);

          $target.children().trigger('focus');
          break;

        default:
          return;
      }
    };

    Slick.prototype.checkNavigable = function (index) {
      var _ = this,
          navigables,
          prevNavigable;

      navigables = _.getNavigableIndexes();
      prevNavigable = 0;

      if (index > navigables[navigables.length - 1]) {
        index = navigables[navigables.length - 1];
      } else {
        for (var n in navigables) {
          if (index < navigables[n]) {
            index = prevNavigable;
            break;
          }

          prevNavigable = navigables[n];
        }
      }

      return index;
    };

    Slick.prototype.cleanUpEvents = function () {
      var _ = this;

      if (_.options.dots && _.$dots !== null) {
        $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));

        if (_.options.accessibility === true) {
          _.$dots.off('keydown.slick', _.keyHandler);
        }
      }

      _.$slider.off('focus.slick blur.slick');

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
        _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
        _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

        if (_.options.accessibility === true) {
          _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
          _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
        }
      }

      _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

      _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

      _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

      _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

      _.$list.off('click.slick', _.clickHandler);

      $(document).off(_.visibilityChange, _.visibility);

      _.cleanUpSlideEvents();

      if (_.options.accessibility === true) {
        _.$list.off('keydown.slick', _.keyHandler);
      }

      if (_.options.focusOnSelect === true) {
        $(_.$slideTrack).children().off('click.slick', _.selectHandler);
      }

      $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
      $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
      $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
      $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpSlideEvents = function () {
      var _ = this;

      _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

      _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
    };

    Slick.prototype.cleanUpRows = function () {
      var _ = this,
          originalSlides;

      if (_.options.rows > 0) {
        originalSlides = _.$slides.children().children();
        originalSlides.removeAttr('style');

        _.$slider.empty().append(originalSlides);
      }
    };

    Slick.prototype.clickHandler = function (event) {
      var _ = this;

      if (_.shouldClick === false) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      }
    };

    Slick.prototype.destroy = function (refresh) {
      var _ = this;

      _.autoPlayClear();

      _.touchObject = {};

      _.cleanUpEvents();

      $('.slick-cloned', _.$slider).detach();

      if (_.$dots) {
        _.$dots.remove();
      }

      if (_.$prevArrow && _.$prevArrow.length) {
        _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.remove();
        }
      }

      if (_.$nextArrow && _.$nextArrow.length) {
        _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.remove();
        }
      }

      if (_.$slides) {
        _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
          $(this).attr('style', $(this).data('originalStyling'));
        });

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.detach();

        _.$list.detach();

        _.$slider.append(_.$slides);
      }

      _.cleanUpRows();

      _.$slider.removeClass('slick-slider');

      _.$slider.removeClass('slick-initialized');

      _.$slider.removeClass('slick-dotted');

      _.unslicked = true;

      if (!refresh) {
        _.$slider.trigger('destroy', [_]);
      }
    };

    Slick.prototype.disableTransition = function (slide) {
      var _ = this,
          transition = {};

      transition[_.transitionType] = '';

      if (_.options.fade === false) {
        _.$slideTrack.css(transition);
      } else {
        _.$slides.eq(slide).css(transition);
      }
    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {
      var _ = this;

      if (_.cssTransitions === false) {
        _.$slides.eq(slideIndex).css({
          zIndex: _.options.zIndex
        });

        _.$slides.eq(slideIndex).animate({
          opacity: 1
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.applyTransition(slideIndex);

        _.$slides.eq(slideIndex).css({
          opacity: 1,
          zIndex: _.options.zIndex
        });

        if (callback) {
          setTimeout(function () {
            _.disableTransition(slideIndex);

            callback.call();
          }, _.options.speed);
        }
      }
    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {
      var _ = this;

      if (_.cssTransitions === false) {
        _.$slides.eq(slideIndex).animate({
          opacity: 0,
          zIndex: _.options.zIndex - 2
        }, _.options.speed, _.options.easing);
      } else {
        _.applyTransition(slideIndex);

        _.$slides.eq(slideIndex).css({
          opacity: 0,
          zIndex: _.options.zIndex - 2
        });
      }
    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
      var _ = this;

      if (filter !== null) {
        _.$slidesCache = _.$slides;

        _.unload();

        _.$slideTrack.children(this.options.slide).detach();

        _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

        _.reinit();
      }
    };

    Slick.prototype.focusHandler = function () {
      var _ = this;

      _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*', function (event) {
        event.stopImmediatePropagation();
        var $sf = $(this);
        setTimeout(function () {
          if (_.options.pauseOnFocus) {
            _.focussed = $sf.is(':focus');

            _.autoPlay();
          }
        }, 0);
      });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
      var _ = this;

      return _.currentSlide;
    };

    Slick.prototype.getDotCount = function () {
      var _ = this;

      var breakPoint = 0;
      var counter = 0;
      var pagerQty = 0;

      if (_.options.infinite === true) {
        if (_.slideCount <= _.options.slidesToShow) {
          ++pagerQty;
        } else {
          while (breakPoint < _.slideCount) {
            ++pagerQty;
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
          }
        }
      } else if (_.options.centerMode === true) {
        pagerQty = _.slideCount;
      } else if (!_.options.asNavFor) {
        pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }
      }

      return pagerQty - 1;
    };

    Slick.prototype.getLeft = function (slideIndex) {
      var _ = this,
          targetLeft,
          verticalHeight,
          verticalOffset = 0,
          targetSlide,
          coef;

      _.slideOffset = 0;
      verticalHeight = _.$slides.first().outerHeight(true);

      if (_.options.infinite === true) {
        if (_.slideCount > _.options.slidesToShow) {
          _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
          coef = -1;

          if (_.options.vertical === true && _.options.centerMode === true) {
            if (_.options.slidesToShow === 2) {
              coef = -1.5;
            } else if (_.options.slidesToShow === 1) {
              coef = -2;
            }
          }

          verticalOffset = verticalHeight * _.options.slidesToShow * coef;
        }

        if (_.slideCount % _.options.slidesToScroll !== 0) {
          if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
            if (slideIndex > _.slideCount) {
              _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
              verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
            } else {
              _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
              verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
            }
          }
        }
      } else {
        if (slideIndex + _.options.slidesToShow > _.slideCount) {
          _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
          verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
        }
      }

      if (_.slideCount <= _.options.slidesToShow) {
        _.slideOffset = 0;
        verticalOffset = 0;
      }

      if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
      } else if (_.options.centerMode === true && _.options.infinite === true) {
        _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
      } else if (_.options.centerMode === true) {
        _.slideOffset = 0;
        _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
      }

      if (_.options.vertical === false) {
        targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
      } else {
        targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
      }

      if (_.options.variableWidth === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        if (_.options.centerMode === true) {
          if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
            targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
          } else {
            targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
          }

          if (_.options.rtl === true) {
            if (targetSlide[0]) {
              targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
            } else {
              targetLeft = 0;
            }
          } else {
            targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
          }

          targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
        }
      }

      return targetLeft;
    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
      var _ = this;

      return _.options[option];
    };

    Slick.prototype.getNavigableIndexes = function () {
      var _ = this,
          breakPoint = 0,
          counter = 0,
          indexes = [],
          max;

      if (_.options.infinite === false) {
        max = _.slideCount;
      } else {
        breakPoint = _.options.slidesToScroll * -1;
        counter = _.options.slidesToScroll * -1;
        max = _.slideCount * 2;
      }

      while (breakPoint < max) {
        indexes.push(breakPoint);
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }

      return indexes;
    };

    Slick.prototype.getSlick = function () {
      return this;
    };

    Slick.prototype.getSlideCount = function () {
      var _ = this,
          slidesTraversed,
          swipedSlide,
          centerOffset;

      centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

      if (_.options.swipeToSlide === true) {
        _.$slideTrack.find('.slick-slide').each(function (index, slide) {
          if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
            swipedSlide = slide;
            return false;
          }
        });

        slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
        return slidesTraversed;
      } else {
        return _.options.slidesToScroll;
      }
    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
      var _ = this;

      _.changeSlide({
        data: {
          message: 'index',
          index: parseInt(slide)
        }
      }, dontAnimate);
    };

    Slick.prototype.init = function (creation) {
      var _ = this;

      if (!$(_.$slider).hasClass('slick-initialized')) {
        $(_.$slider).addClass('slick-initialized');

        _.buildRows();

        _.buildOut();

        _.setProps();

        _.startLoad();

        _.loadSlider();

        _.initializeEvents();

        _.updateArrows();

        _.updateDots();

        _.checkResponsive(true);

        _.focusHandler();
      }

      if (creation) {
        _.$slider.trigger('init', [_]);
      }

      if (_.options.accessibility === true) {
        _.initADA();
      }

      if (_.options.autoplay) {
        _.paused = false;

        _.autoPlay();
      }
    };

    Slick.prototype.initADA = function () {
      var _ = this,
          numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
          tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
        return val >= 0 && val < _.slideCount;
      });

      _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
        'aria-hidden': 'true',
        'tabindex': '-1'
      }).find('a, input, button, select').attr({
        'tabindex': '-1'
      });

      if (_.$dots !== null) {
        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
          var slideControlIndex = tabControlIndexes.indexOf(i);
          $(this).attr({
            'role': 'tabpanel',
            'id': 'slick-slide' + _.instanceUid + i,
            'tabindex': -1
          });

          if (slideControlIndex !== -1) {
            var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;

            if ($('#' + ariaButtonControl).length) {
              $(this).attr({
                'aria-describedby': ariaButtonControl
              });
            }
          }
        });

        _.$dots.attr('role', 'tablist').find('li').each(function (i) {
          var mappedSlideIndex = tabControlIndexes[i];
          $(this).attr({
            'role': 'presentation'
          });
          $(this).find('button').first().attr({
            'role': 'tab',
            'id': 'slick-slide-control' + _.instanceUid + i,
            'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
            'aria-label': i + 1 + ' of ' + numDotGroups,
            'aria-selected': null,
            'tabindex': '-1'
          });
        }).eq(_.currentSlide).find('button').attr({
          'aria-selected': 'true',
          'tabindex': '0'
        }).end();
      }

      for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
        if (_.options.focusOnChange) {
          _.$slides.eq(i).attr({
            'tabindex': '0'
          });
        } else {
          _.$slides.eq(i).removeAttr('tabindex');
        }
      }

      _.activateADA();
    };

    Slick.prototype.initArrowEvents = function () {
      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
        _.$prevArrow.off('click.slick').on('click.slick', {
          message: 'previous'
        }, _.changeSlide);

        _.$nextArrow.off('click.slick').on('click.slick', {
          message: 'next'
        }, _.changeSlide);

        if (_.options.accessibility === true) {
          _.$prevArrow.on('keydown.slick', _.keyHandler);

          _.$nextArrow.on('keydown.slick', _.keyHandler);
        }
      }
    };

    Slick.prototype.initDotEvents = function () {
      var _ = this;

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
        $('li', _.$dots).on('click.slick', {
          message: 'index'
        }, _.changeSlide);

        if (_.options.accessibility === true) {
          _.$dots.on('keydown.slick', _.keyHandler);
        }
      }

      if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
        $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
      }
    };

    Slick.prototype.initSlideEvents = function () {
      var _ = this;

      if (_.options.pauseOnHover) {
        _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

        _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
      }
    };

    Slick.prototype.initializeEvents = function () {
      var _ = this;

      _.initArrowEvents();

      _.initDotEvents();

      _.initSlideEvents();

      _.$list.on('touchstart.slick mousedown.slick', {
        action: 'start'
      }, _.swipeHandler);

      _.$list.on('touchmove.slick mousemove.slick', {
        action: 'move'
      }, _.swipeHandler);

      _.$list.on('touchend.slick mouseup.slick', {
        action: 'end'
      }, _.swipeHandler);

      _.$list.on('touchcancel.slick mouseleave.slick', {
        action: 'end'
      }, _.swipeHandler);

      _.$list.on('click.slick', _.clickHandler);

      $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

      if (_.options.accessibility === true) {
        _.$list.on('keydown.slick', _.keyHandler);
      }

      if (_.options.focusOnSelect === true) {
        $(_.$slideTrack).children().on('click.slick', _.selectHandler);
      }

      $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
      $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
      $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
      $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
      $(_.setPosition);
    };

    Slick.prototype.initUI = function () {
      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
        _.$prevArrow.show();

        _.$nextArrow.show();
      }

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
        _.$dots.show();
      }
    };

    Slick.prototype.keyHandler = function (event) {
      var _ = this; //Dont slide if the cursor is inside the form fields and arrow keys are pressed


      if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
        if (event.keyCode === 37 && _.options.accessibility === true) {
          _.changeSlide({
            data: {
              message: _.options.rtl === true ? 'next' : 'previous'
            }
          });
        } else if (event.keyCode === 39 && _.options.accessibility === true) {
          _.changeSlide({
            data: {
              message: _.options.rtl === true ? 'previous' : 'next'
            }
          });
        }
      }
    };

    Slick.prototype.lazyLoad = function () {
      var _ = this,
          loadRange,
          cloneRange,
          rangeStart,
          rangeEnd;

      function loadImages(imagesScope) {
        $('img[data-lazy]', imagesScope).each(function () {
          var image = $(this),
              imageSource = $(this).attr('data-lazy'),
              imageSrcSet = $(this).attr('data-srcset'),
              imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
              imageToLoad = document.createElement('img');

          imageToLoad.onload = function () {
            image.animate({
              opacity: 0
            }, 100, function () {
              if (imageSrcSet) {
                image.attr('srcset', imageSrcSet);

                if (imageSizes) {
                  image.attr('sizes', imageSizes);
                }
              }

              image.attr('src', imageSource).animate({
                opacity: 1
              }, 200, function () {
                image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
              });

              _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
            });
          };

          imageToLoad.onerror = function () {
            image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

            _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
          };

          imageToLoad.src = imageSource;
        });
      }

      if (_.options.centerMode === true) {
        if (_.options.infinite === true) {
          rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
          rangeEnd = rangeStart + _.options.slidesToShow + 2;
        } else {
          rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
          rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
        }
      } else {
        rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
        rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

        if (_.options.fade === true) {
          if (rangeStart > 0) rangeStart--;
          if (rangeEnd <= _.slideCount) rangeEnd++;
        }
      }

      loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

      if (_.options.lazyLoad === 'anticipated') {
        var prevSlide = rangeStart - 1,
            nextSlide = rangeEnd,
            $slides = _.$slider.find('.slick-slide');

        for (var i = 0; i < _.options.slidesToScroll; i++) {
          if (prevSlide < 0) prevSlide = _.slideCount - 1;
          loadRange = loadRange.add($slides.eq(prevSlide));
          loadRange = loadRange.add($slides.eq(nextSlide));
          prevSlide--;
          nextSlide++;
        }
      }

      loadImages(loadRange);

      if (_.slideCount <= _.options.slidesToShow) {
        cloneRange = _.$slider.find('.slick-slide');
        loadImages(cloneRange);
      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
        cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
        loadImages(cloneRange);
      } else if (_.currentSlide === 0) {
        cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
        loadImages(cloneRange);
      }
    };

    Slick.prototype.loadSlider = function () {
      var _ = this;

      _.setPosition();

      _.$slideTrack.css({
        opacity: 1
      });

      _.$slider.removeClass('slick-loading');

      _.initUI();

      if (_.options.lazyLoad === 'progressive') {
        _.progressiveLazyLoad();
      }
    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {
      var _ = this;

      _.changeSlide({
        data: {
          message: 'next'
        }
      });
    };

    Slick.prototype.orientationChange = function () {
      var _ = this;

      _.checkResponsive();

      _.setPosition();
    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {
      var _ = this;

      _.autoPlayClear();

      _.paused = true;
    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {
      var _ = this;

      _.autoPlay();

      _.options.autoplay = true;
      _.paused = false;
      _.focussed = false;
      _.interrupted = false;
    };

    Slick.prototype.postSlide = function (index) {
      var _ = this;

      if (!_.unslicked) {
        _.$slider.trigger('afterChange', [_, index]);

        _.animating = false;

        if (_.slideCount > _.options.slidesToShow) {
          _.setPosition();
        }

        _.swipeLeft = null;

        if (_.options.autoplay) {
          _.autoPlay();
        }

        if (_.options.accessibility === true) {
          _.initADA();

          if (_.options.focusOnChange) {
            var $currentSlide = $(_.$slides.get(_.currentSlide));
            $currentSlide.attr('tabindex', 0).focus();
          }
        }
      }
    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {
      var _ = this;

      _.changeSlide({
        data: {
          message: 'previous'
        }
      });
    };

    Slick.prototype.preventDefault = function (event) {
      event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {
      tryCount = tryCount || 1;

      var _ = this,
          $imgsToLoad = $('img[data-lazy]', _.$slider),
          image,
          imageSource,
          imageSrcSet,
          imageSizes,
          imageToLoad;

      if ($imgsToLoad.length) {
        image = $imgsToLoad.first();
        imageSource = image.attr('data-lazy');
        imageSrcSet = image.attr('data-srcset');
        imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
        imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          if (imageSrcSet) {
            image.attr('srcset', imageSrcSet);

            if (imageSizes) {
              image.attr('sizes', imageSizes);
            }
          }

          image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');

          if (_.options.adaptiveHeight === true) {
            _.setPosition();
          }

          _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

          _.progressiveLazyLoad();
        };

        imageToLoad.onerror = function () {
          if (tryCount < 3) {
            /**
             * try to load the image 3 times,
             * leave a slight delay so we don't get
             * servers blocking the request.
             */
            setTimeout(function () {
              _.progressiveLazyLoad(tryCount + 1);
            }, 500);
          } else {
            image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

            _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

            _.progressiveLazyLoad();
          }
        };

        imageToLoad.src = imageSource;
      } else {
        _.$slider.trigger('allImagesLoaded', [_]);
      }
    };

    Slick.prototype.refresh = function (initializing) {
      var _ = this,
          currentSlide,
          lastVisibleIndex;

      lastVisibleIndex = _.slideCount - _.options.slidesToShow; // in non-infinite sliders, we don't want to go past the
      // last visible index.

      if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
        _.currentSlide = lastVisibleIndex;
      } // if less slides than to show, go to start.


      if (_.slideCount <= _.options.slidesToShow) {
        _.currentSlide = 0;
      }

      currentSlide = _.currentSlide;

      _.destroy(true);

      $.extend(_, _.initials, {
        currentSlide: currentSlide
      });

      _.init();

      if (!initializing) {
        _.changeSlide({
          data: {
            message: 'index',
            index: currentSlide
          }
        }, false);
      }
    };

    Slick.prototype.registerBreakpoints = function () {
      var _ = this,
          breakpoint,
          currentBreakpoint,
          l,
          responsiveSettings = _.options.responsive || null;

      if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
        _.respondTo = _.options.respondTo || 'window';

        for (breakpoint in responsiveSettings) {
          l = _.breakpoints.length - 1;

          if (responsiveSettings.hasOwnProperty(breakpoint)) {
            currentBreakpoint = responsiveSettings[breakpoint].breakpoint; // loop through the breakpoints and cut out any existing
            // ones with the same breakpoint number, we don't want dupes.

            while (l >= 0) {
              if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                _.breakpoints.splice(l, 1);
              }

              l--;
            }

            _.breakpoints.push(currentBreakpoint);

            _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
          }
        }

        _.breakpoints.sort(function (a, b) {
          return _.options.mobileFirst ? a - b : b - a;
        });
      }
    };

    Slick.prototype.reinit = function () {
      var _ = this;

      _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
      _.slideCount = _.$slides.length;

      if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
        _.currentSlide = _.currentSlide - _.options.slidesToScroll;
      }

      if (_.slideCount <= _.options.slidesToShow) {
        _.currentSlide = 0;
      }

      _.registerBreakpoints();

      _.setProps();

      _.setupInfinite();

      _.buildArrows();

      _.updateArrows();

      _.initArrowEvents();

      _.buildDots();

      _.updateDots();

      _.initDotEvents();

      _.cleanUpSlideEvents();

      _.initSlideEvents();

      _.checkResponsive(false, true);

      if (_.options.focusOnSelect === true) {
        $(_.$slideTrack).children().on('click.slick', _.selectHandler);
      }

      _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

      _.setPosition();

      _.focusHandler();

      _.paused = !_.options.autoplay;

      _.autoPlay();

      _.$slider.trigger('reInit', [_]);
    };

    Slick.prototype.resize = function () {
      var _ = this;

      if ($(window).width() !== _.windowWidth) {
        clearTimeout(_.windowDelay);
        _.windowDelay = window.setTimeout(function () {
          _.windowWidth = $(window).width();

          _.checkResponsive();

          if (!_.unslicked) {
            _.setPosition();
          }
        }, 50);
      }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
      var _ = this;

      if (typeof index === 'boolean') {
        removeBefore = index;
        index = removeBefore === true ? 0 : _.slideCount - 1;
      } else {
        index = removeBefore === true ? --index : index;
      }

      if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
        return false;
      }

      _.unload();

      if (removeAll === true) {
        _.$slideTrack.children().remove();
      } else {
        _.$slideTrack.children(this.options.slide).eq(index).remove();
      }

      _.$slides = _.$slideTrack.children(this.options.slide);

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.append(_.$slides);

      _.$slidesCache = _.$slides;

      _.reinit();
    };

    Slick.prototype.setCSS = function (position) {
      var _ = this,
          positionProps = {},
          x,
          y;

      if (_.options.rtl === true) {
        position = -position;
      }

      x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
      y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
      positionProps[_.positionProp] = position;

      if (_.transformsEnabled === false) {
        _.$slideTrack.css(positionProps);
      } else {
        positionProps = {};

        if (_.cssTransitions === false) {
          positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

          _.$slideTrack.css(positionProps);
        } else {
          positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

          _.$slideTrack.css(positionProps);
        }
      }
    };

    Slick.prototype.setDimensions = function () {
      var _ = this;

      if (_.options.vertical === false) {
        if (_.options.centerMode === true) {
          _.$list.css({
            padding: '0px ' + _.options.centerPadding
          });
        }
      } else {
        _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

        if (_.options.centerMode === true) {
          _.$list.css({
            padding: _.options.centerPadding + ' 0px'
          });
        }
      }

      _.listWidth = _.$list.width();
      _.listHeight = _.$list.height();

      if (_.options.vertical === false && _.options.variableWidth === false) {
        _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

        _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
      } else if (_.options.variableWidth === true) {
        _.$slideTrack.width(5000 * _.slideCount);
      } else {
        _.slideWidth = Math.ceil(_.listWidth);

        _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
      }

      var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

      if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };

    Slick.prototype.setFade = function () {
      var _ = this,
          targetLeft;

      _.$slides.each(function (index, element) {
        targetLeft = _.slideWidth * index * -1;

        if (_.options.rtl === true) {
          $(element).css({
            position: 'relative',
            right: targetLeft,
            top: 0,
            zIndex: _.options.zIndex - 2,
            opacity: 0
          });
        } else {
          $(element).css({
            position: 'relative',
            left: targetLeft,
            top: 0,
            zIndex: _.options.zIndex - 2,
            opacity: 0
          });
        }
      });

      _.$slides.eq(_.currentSlide).css({
        zIndex: _.options.zIndex - 1,
        opacity: 1
      });
    };

    Slick.prototype.setHeight = function () {
      var _ = this;

      if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
        var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

        _.$list.css('height', targetHeight);
      }
    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
      /**
       * accepts arguments in format of:
       *
       *  - for changing a single option's value:
       *     .slick("setOption", option, value, refresh )
       *
       *  - for changing a set of responsive options:
       *     .slick("setOption", 'responsive', [{}, ...], refresh )
       *
       *  - for updating multiple values at once (not responsive)
       *     .slick("setOption", { 'option': value, ... }, refresh )
       */
      var _ = this,
          l,
          item,
          option,
          value,
          refresh = false,
          type;

      if ($.type(arguments[0]) === 'object') {
        option = arguments[0];
        refresh = arguments[1];
        type = 'multiple';
      } else if ($.type(arguments[0]) === 'string') {
        option = arguments[0];
        value = arguments[1];
        refresh = arguments[2];

        if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
          type = 'responsive';
        } else if (typeof arguments[1] !== 'undefined') {
          type = 'single';
        }
      }

      if (type === 'single') {
        _.options[option] = value;
      } else if (type === 'multiple') {
        $.each(option, function (opt, val) {
          _.options[opt] = val;
        });
      } else if (type === 'responsive') {
        for (item in value) {
          if ($.type(_.options.responsive) !== 'array') {
            _.options.responsive = [value[item]];
          } else {
            l = _.options.responsive.length - 1; // loop through the responsive object and splice out duplicates.

            while (l >= 0) {
              if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
                _.options.responsive.splice(l, 1);
              }

              l--;
            }

            _.options.responsive.push(value[item]);
          }
        }
      }

      if (refresh) {
        _.unload();

        _.reinit();
      }
    };

    Slick.prototype.setPosition = function () {
      var _ = this;

      _.setDimensions();

      _.setHeight();

      if (_.options.fade === false) {
        _.setCSS(_.getLeft(_.currentSlide));
      } else {
        _.setFade();
      }

      _.$slider.trigger('setPosition', [_]);
    };

    Slick.prototype.setProps = function () {
      var _ = this,
          bodyStyle = document.body.style;

      _.positionProp = _.options.vertical === true ? 'top' : 'left';

      if (_.positionProp === 'top') {
        _.$slider.addClass('slick-vertical');
      } else {
        _.$slider.removeClass('slick-vertical');
      }

      if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
        if (_.options.useCSS === true) {
          _.cssTransitions = true;
        }
      }

      if (_.options.fade) {
        if (typeof _.options.zIndex === 'number') {
          if (_.options.zIndex < 3) {
            _.options.zIndex = 3;
          }
        } else {
          _.options.zIndex = _.defaults.zIndex;
        }
      }

      if (bodyStyle.OTransform !== undefined) {
        _.animType = 'OTransform';
        _.transformType = '-o-transform';
        _.transitionType = 'OTransition';
        if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
      }

      if (bodyStyle.MozTransform !== undefined) {
        _.animType = 'MozTransform';
        _.transformType = '-moz-transform';
        _.transitionType = 'MozTransition';
        if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
      }

      if (bodyStyle.webkitTransform !== undefined) {
        _.animType = 'webkitTransform';
        _.transformType = '-webkit-transform';
        _.transitionType = 'webkitTransition';
        if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
      }

      if (bodyStyle.msTransform !== undefined) {
        _.animType = 'msTransform';
        _.transformType = '-ms-transform';
        _.transitionType = 'msTransition';
        if (bodyStyle.msTransform === undefined) _.animType = false;
      }

      if (bodyStyle.transform !== undefined && _.animType !== false) {
        _.animType = 'transform';
        _.transformType = 'transform';
        _.transitionType = 'transition';
      }

      _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
    };

    Slick.prototype.setSlideClasses = function (index) {
      var _ = this,
          centerOffset,
          allSlides,
          indexOffset,
          remainder;

      allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

      _.$slides.eq(index).addClass('slick-current');

      if (_.options.centerMode === true) {
        var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.infinite === true) {
          if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
            _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
          } else {
            indexOffset = _.options.slidesToShow + index;
            allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
          }

          if (index === 0) {
            allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
          } else if (index === _.slideCount - 1) {
            allSlides.eq(_.options.slidesToShow).addClass('slick-center');
          }
        }

        _.$slides.eq(index).addClass('slick-center');
      } else {
        if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
          _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
        } else if (allSlides.length <= _.options.slidesToShow) {
          allSlides.addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          remainder = _.slideCount % _.options.slidesToShow;
          indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

          if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
            allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
          } else {
            allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
          }
        }
      }

      if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
        _.lazyLoad();
      }
    };

    Slick.prototype.setupInfinite = function () {
      var _ = this,
          i,
          slideIndex,
          infiniteCount;

      if (_.options.fade === true) {
        _.options.centerMode = false;
      }

      if (_.options.infinite === true && _.options.fade === false) {
        slideIndex = null;

        if (_.slideCount > _.options.slidesToShow) {
          if (_.options.centerMode === true) {
            infiniteCount = _.options.slidesToShow + 1;
          } else {
            infiniteCount = _.options.slidesToShow;
          }

          for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
            slideIndex = i - 1;
            $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
          }

          for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
            slideIndex = i;
            $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
          }

          _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
            $(this).attr('id', '');
          });
        }
      }
    };

    Slick.prototype.interrupt = function (toggle) {
      var _ = this;

      if (!toggle) {
        _.autoPlay();
      }

      _.interrupted = toggle;
    };

    Slick.prototype.selectHandler = function (event) {
      var _ = this;

      var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
      var index = parseInt(targetElement.attr('data-slick-index'));
      if (!index) index = 0;

      if (_.slideCount <= _.options.slidesToShow) {
        _.slideHandler(index, false, true);

        return;
      }

      _.slideHandler(index);
    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
      var targetSlide,
          animSlide,
          oldSlide,
          slideLeft,
          targetLeft = null,
          _ = this,
          navTarget;

      sync = sync || false;

      if (_.animating === true && _.options.waitForAnimate === true) {
        return;
      }

      if (_.options.fade === true && _.currentSlide === index) {
        return;
      }

      if (sync === false) {
        _.asNavFor(index);
      }

      targetSlide = index;
      targetLeft = _.getLeft(targetSlide);
      slideLeft = _.getLeft(_.currentSlide);
      _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

      if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
        if (_.options.fade === false) {
          targetSlide = _.currentSlide;

          if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(slideLeft, function () {
              _.postSlide(targetSlide);
            });
          } else {
            _.postSlide(targetSlide);
          }
        }

        return;
      } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
        if (_.options.fade === false) {
          targetSlide = _.currentSlide;

          if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(slideLeft, function () {
              _.postSlide(targetSlide);
            });
          } else {
            _.postSlide(targetSlide);
          }
        }

        return;
      }

      if (_.options.autoplay) {
        clearInterval(_.autoPlayTimer);
      }

      if (targetSlide < 0) {
        if (_.slideCount % _.options.slidesToScroll !== 0) {
          animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
        } else {
          animSlide = _.slideCount + targetSlide;
        }
      } else if (targetSlide >= _.slideCount) {
        if (_.slideCount % _.options.slidesToScroll !== 0) {
          animSlide = 0;
        } else {
          animSlide = targetSlide - _.slideCount;
        }
      } else {
        animSlide = targetSlide;
      }

      _.animating = true;

      _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

      oldSlide = _.currentSlide;
      _.currentSlide = animSlide;

      _.setSlideClasses(_.currentSlide);

      if (_.options.asNavFor) {
        navTarget = _.getNavTarget();
        navTarget = navTarget.slick('getSlick');

        if (navTarget.slideCount <= navTarget.options.slidesToShow) {
          navTarget.setSlideClasses(_.currentSlide);
        }
      }

      _.updateDots();

      _.updateArrows();

      if (_.options.fade === true) {
        if (dontAnimate !== true) {
          _.fadeSlideOut(oldSlide);

          _.fadeSlide(animSlide, function () {
            _.postSlide(animSlide);
          });
        } else {
          _.postSlide(animSlide);
        }

        _.animateHeight();

        return;
      }

      if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
        _.animateSlide(targetLeft, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }
    };

    Slick.prototype.startLoad = function () {
      var _ = this;

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
        _.$prevArrow.hide();

        _.$nextArrow.hide();
      }

      if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
        _.$dots.hide();
      }

      _.$slider.addClass('slick-loading');
    };

    Slick.prototype.swipeDirection = function () {
      var xDist,
          yDist,
          r,
          swipeAngle,
          _ = this;

      xDist = _.touchObject.startX - _.touchObject.curX;
      yDist = _.touchObject.startY - _.touchObject.curY;
      r = Math.atan2(yDist, xDist);
      swipeAngle = Math.round(r * 180 / Math.PI);

      if (swipeAngle < 0) {
        swipeAngle = 360 - Math.abs(swipeAngle);
      }

      if (swipeAngle <= 45 && swipeAngle >= 0) {
        return _.options.rtl === false ? 'left' : 'right';
      }

      if (swipeAngle <= 360 && swipeAngle >= 315) {
        return _.options.rtl === false ? 'left' : 'right';
      }

      if (swipeAngle >= 135 && swipeAngle <= 225) {
        return _.options.rtl === false ? 'right' : 'left';
      }

      if (_.options.verticalSwiping === true) {
        if (swipeAngle >= 35 && swipeAngle <= 135) {
          return 'down';
        } else {
          return 'up';
        }
      }

      return 'vertical';
    };

    Slick.prototype.swipeEnd = function (event) {
      var _ = this,
          slideCount,
          direction;

      _.dragging = false;
      _.swiping = false;

      if (_.scrolling) {
        _.scrolling = false;
        return false;
      }

      _.interrupted = false;
      _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

      if (_.touchObject.curX === undefined) {
        return false;
      }

      if (_.touchObject.edgeHit === true) {
        _.$slider.trigger('edge', [_, _.swipeDirection()]);
      }

      if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
        direction = _.swipeDirection();

        switch (direction) {
          case 'left':
          case 'down':
            slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
            _.currentDirection = 0;
            break;

          case 'right':
          case 'up':
            slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
            _.currentDirection = 1;
            break;

          default:
        }

        if (direction != 'vertical') {
          _.slideHandler(slideCount);

          _.touchObject = {};

          _.$slider.trigger('swipe', [_, direction]);
        }
      } else {
        if (_.touchObject.startX !== _.touchObject.curX) {
          _.slideHandler(_.currentSlide);

          _.touchObject = {};
        }
      }
    };

    Slick.prototype.swipeHandler = function (event) {
      var _ = this;

      if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
        return;
      } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
        return;
      }

      _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
      _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

      if (_.options.verticalSwiping === true) {
        _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
      }

      switch (event.data.action) {
        case 'start':
          _.swipeStart(event);

          break;

        case 'move':
          _.swipeMove(event);

          break;

        case 'end':
          _.swipeEnd(event);

          break;
      }
    };

    Slick.prototype.swipeMove = function (event) {
      var _ = this,
          edgeWasHit = false,
          curLeft,
          swipeDirection,
          swipeLength,
          positionOffset,
          touches,
          verticalSwipeLength;

      touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

      if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
        return false;
      }

      curLeft = _.getLeft(_.currentSlide);
      _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
      _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
      _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
      verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

      if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
        _.scrolling = true;
        return false;
      }

      if (_.options.verticalSwiping === true) {
        _.touchObject.swipeLength = verticalSwipeLength;
      }

      swipeDirection = _.swipeDirection();

      if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
        _.swiping = true;
        event.preventDefault();
      }

      positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

      if (_.options.verticalSwiping === true) {
        positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
      }

      swipeLength = _.touchObject.swipeLength;
      _.touchObject.edgeHit = false;

      if (_.options.infinite === false) {
        if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
          swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
          _.touchObject.edgeHit = true;
        }
      }

      if (_.options.vertical === false) {
        _.swipeLeft = curLeft + swipeLength * positionOffset;
      } else {
        _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
      }

      if (_.options.verticalSwiping === true) {
        _.swipeLeft = curLeft + swipeLength * positionOffset;
      }

      if (_.options.fade === true || _.options.touchMove === false) {
        return false;
      }

      if (_.animating === true) {
        _.swipeLeft = null;
        return false;
      }

      _.setCSS(_.swipeLeft);
    };

    Slick.prototype.swipeStart = function (event) {
      var _ = this,
          touches;

      _.interrupted = true;

      if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
        _.touchObject = {};
        return false;
      }

      if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
        touches = event.originalEvent.touches[0];
      }

      _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
      _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
      _.dragging = true;
    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
      var _ = this;

      if (_.$slidesCache !== null) {
        _.unload();

        _.$slideTrack.children(this.options.slide).detach();

        _.$slidesCache.appendTo(_.$slideTrack);

        _.reinit();
      }
    };

    Slick.prototype.unload = function () {
      var _ = this;

      $('.slick-cloned', _.$slider).remove();

      if (_.$dots) {
        _.$dots.remove();
      }

      if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }

      if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }

      _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
    };

    Slick.prototype.unslick = function (fromBreakpoint) {
      var _ = this;

      _.$slider.trigger('unslick', [_, fromBreakpoint]);

      _.destroy();
    };

    Slick.prototype.updateArrows = function () {
      var _ = this,
          centerOffset;

      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

        if (_.currentSlide === 0) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

          _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
        } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
          _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

          _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
        } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
          _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

          _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
        }
      }
    };

    Slick.prototype.updateDots = function () {
      var _ = this;

      if (_.$dots !== null) {
        _.$dots.find('li').removeClass('slick-active').end();

        _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
      }
    };

    Slick.prototype.visibility = function () {
      var _ = this;

      if (_.options.autoplay) {
        if (document[_.hidden]) {
          _.interrupted = true;
        } else {
          _.interrupted = false;
        }
      }
    };

    $.fn.slick = function () {
      var _ = this,
          opt = arguments[0],
          args = Array.prototype.slice.call(arguments, 1),
          l = _.length,
          i,
          ret;

      for (i = 0; i < l; i++) {
        if (_typeof(opt) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
        if (typeof ret != 'undefined') return ret;
      }

      return _;
    };
  });

  window.onload = function () {
    var Persons = document.querySelectorAll('.team_persons_photo');
    Persons.forEach(function (node) {
      node.addEventListener('click', function (element) {
        Persons.forEach(function (node) {
          node.style.width = '13%';
        });
        var current = element.target;
        current.style.width = "18%";
        current.nextElementSibling.style.width = "16%";
        current.previousElementSibling.style.width = "16%";
        current.nextElementSibling.nextElementSibling.style.width = "14%";
        current.previousElementSibling.previousElementSibling.style.width = "14%";
      });
    });
  };

  $(".modal_dialog_content_item").not(":first").hide();
  $(".modal_dialog_content .modal_button").click(function () {
    $(".modal_dialog_content .modal_button").removeClass("active").eq($(this).index()).addClass("active");
    $(".modal_dialog_content_item").hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass("active");
  var modalCall = $("[data-modal]");
  var modalClose = $("[data-close]");
  modalCall.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalId = $this.data('modal');
    $(modalId).addClass('show');
    $("body").addClass('no-scroll');
    setTimeout(function () {
      $(modalId).find(".modal_dialog").css({
        transform: "scale(1)"
      });
    }, 200);
  });
  modalClose.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalParent = $this.parents('.modal');
    modalParent.find(".modal_dialog").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      modalParent.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 200);
  });
  $(".modal").on("click", function (event) {
    var $this = $(this);
    $this.find(".modal_dialog").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      $this.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 200);
  });
  $(".modal_dialog").on("click", function (event) {
    event.stopPropagation();
  });
  var doc = document.querySelectorAll('.contr');
  doc.forEach(function (node) {
    node.addEventListener('click', function (element) {
      doc.forEach(function (node) {
        node.style.width = '223px';
      });
      var current = element.target;
      current.style.width = "284px";
    });
  });
  $('a[href^="#"]').on('click', function (event) {
    // отменяем стандартное действие
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    /*
    * sc - в переменную заносим информацию о том, к какому блоку надо перейти
    * dn - определяем положение блока на странице
    */

    $('html, body').animate({
      scrollTop: dn
    }, 1000);
    /*
    * 1000 скорость перехода в миллисекундах
    */
  });
  /*window.onload = function () {
        window.Nodes = document.querySelectorAll('.cases_content_item');
      let i = -1;
      let count = 0;
      let flag = false;
      document.addEventListener('scroll', () => {
          if (window.scrollY > Nodes[0].getBoundingClientRect().y) {
              flag = true;
          }
      },
       {
          passive: false
      }
      );
        document.addEventListener('wheel', (event) => {
          if (flag == true) {
              console.log('scroll' + window.scrollY);
              count++;
              console.log(count);
              if (count > 10) {
                  if (i < Nodes.length - 1) {
                      i++;
                      Nodes[i].scrollIntoView({
                          behavior: 'smooth'
                      });
                      count = 0;
                  }else{
                      flag=false;
                  }
              
              }
              event.preventDefault();
              event.stopPropagation();
          }
      }, {
          passive: false
      });
  }
  */
  // $(".cases_sidebar_list_item").click(function(e) {
  //     e.preventDefault();
  //     $(".cases_sidebar_list_item").removeClass('active');
  //     $(this).addClass('active');
  // });

  /* Slider */

  $('#mob_app').slick({
    //infinite: true, //беск прокр
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false // fade: true,
    // arrows: true,
    // variableWidth: true,
    // centerMode: true,
    // responsive: [
    //     {
    //         breakpoint: 767,
    //         settings: {
    //             slidesToShow: 1,
    //             slidesToScroll: 1,
    //             infinite: true,
    //             centerMode: true,
    //         }
    //     }
    // ]

  });
  $(".slickPrev").on("click", function (event) {
    event.preventDefault();
    $('#mob_app').slick("slickPrev");
  });
  $(".slickNext").on("click", function (event) {
    event.preventDefault();
    $('#mob_app').slick("slickNext");
  });
  $('#agregator').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false
  });
  $(".AgrslickPrev").on("click", function (event) {
    event.preventDefault();
    $('#agregator').slick("slickPrev");
  });
  $(".AgrslickNext").on("click", function (event) {
    event.preventDefault();
    $('#agregator').slick("slickNext");
  }); ///////////////////////

  $('#agregator2').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false
  });
  $(".Agr2slickPrev").on("click", function (event) {
    event.preventDefault();
    $('#agregator2').slick("slickPrev");
  });
  $(".Agr2slickNext").on("click", function (event) {
    event.preventDefault();
    $('#agregator2').slick("slickNext");
  }); ///////////////////////

  $('#agregator3').slick({
    //infinite: true, //беск прокр
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false
  });
  $(".Agr3slickPrev").on("click", function (event) {
    event.preventDefault();
    $('#agregator3').slick("slickPrev");
  });
  $(".Agr3slickNext").on("click", function (event) {
    event.preventDefault();
    $('#agregator3').slick("slickNext");
  }); ///////////////////////

  $('.intro_cases_slider_block').slick({
    infinite: true,
    //беск прокр
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  }); /////////////////////////////

  $('#partners').slick({
    //infinite: true, //беск прокр
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false
  });
  $(document).ready(function () {
    $(".intro_cases").hide();
  });
  $("#op").click(function (e) {
    e.preventDefault(); // $(".intro_items").removeClass('active');
    // $(this).addClass('active');
    // $(".intro_items").addClass('display_none');

    $(".intro_items").hide();
    $(".intro_cases").show('speed');
  }); // $(document).ready(function(){
  // 	$("#op").click(function(){
  // 		$(".intro_items").toggleClass("display_none"); return false;
  // 	});
  // });
  // $("#btn-drop").click(function() {
  //     if (flag['drop'] = !flag['drop']) {
  //         $("#test-drop").hide("drop", { direction: "right" }, 1000);
  //     }
  //     else {
  //         $("#test-drop").show("drop", { direction: "down" }, 500);
  //     }
  // });

  /**
   * Фиксированный хедер
   */

  $(window).on('scroll', toggleFixedHeader);

  function toggleFixedHeader() {
    var $header = $('.header');
    var $main = $('.header').next();

    if (window.pageYOffset > 0) {
      $header.addClass('is-fixed');
      $main.css({
        marginTop: $header.outerHeight()
      });
    } else {
      $header.removeClass('is-fixed');
      $main.css({
        marginTop: 0
      });
    }
  }

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50Iiwib25lIiwiQ3VzdG9tU2VsZWN0IiwiJGVsZW0iLCJzZWxmIiwiaW5pdCIsIiRpbml0RWxlbSIsImVhY2giLCJoYXNDbGFzcyIsInNlbGVjdFNlYXJjaCIsImRhdGEiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIkluZmluaXR5Iiwic2VsZWN0MiIsInNlbGVjdE9uQmx1ciIsImRyb3Bkb3duQ3NzQ2xhc3MiLCJvbiIsImUiLCJmaW5kIiwiY29udGV4dCIsInZhbHVlIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbUZpbGVJbnB1dCIsImkiLCJlbGVtIiwiYnV0dG9uV29yZCIsImNsYXNzTmFtZSIsIndyYXAiLCJwYXJlbnQiLCJwcmVwZW5kIiwiaHRtbCIsInByb21pc2UiLCJkb25lIiwibW91c2Vtb3ZlIiwiY3Vyc29yIiwiaW5wdXQiLCJ3cmFwcGVyIiwid3JhcHBlclgiLCJ3cmFwcGVyWSIsImlucHV0V2lkdGgiLCJpbnB1dEhlaWdodCIsImN1cnNvclgiLCJjdXJzb3JZIiwib2Zmc2V0IiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFnZVgiLCJwYWdlWSIsIm1vdmVJbnB1dFgiLCJtb3ZlSW5wdXRZIiwiY3NzIiwiZmlsZU5hbWUiLCJ2YWwiLCJuZXh0IiwicmVtb3ZlIiwicHJvcCIsImxlbmd0aCIsImZpbGVzIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50Iiwic2libGluZ3MiLCJhZnRlciIsImN1c3RvbVNlbGVjdCIsImluZGV4IiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsIiRibG9jayIsIiRsYXN0IiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsImRhdGVwaWNrZXIiLCJ1cGRhdGVTdmciLCIkdXNlRWxlbWVudCIsImhyZWYiLCJiYXNlVmFsIiwiZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zIiwiZGF0ZUZvcm1hdCIsInNob3dPdGhlck1vbnRocyIsIkRhdGVwaWNrZXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwiRGF0ZXBpY2tlclJhbmdlIiwiZGF0ZXBpY2tlclJhbmdlIiwiZnJvbUl0ZW1PcHRpb25zIiwidG9JdGVtT3B0aW9ucyIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiZ2V0RGF0ZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsImRhdGUiLCJwYXJzZURhdGUiLCJlcnJvciIsIlRhYlN3aXRjaGVyIiwidGFicyIsIm9wZW4iLCJ0YWJFbGVtIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRUYWJzIiwidG9nZ2xlQ2xhc3MiLCJ0YWJTd2l0Y2hlciIsIm9uT3V0c2lkZUNsaWNrSGlkZSIsInRhcmdldEVsZW0iLCJoaWRkZW5FbGVtIiwib3B0aW9uYWxDYiIsImJpbmQiLCJpcyIsInRhcmdldCIsInN0b3AiLCJmYWRlT3V0IiwidmlzaWJpbGl0eUNvbnRyb2wiLCJzZXR0aW5ncyIsInR5cGVzIiwic2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHlUeXBlIiwibGlzdCIsImRlbGF5IiwiZmFkZUluIiwiZGF0YVR5cGUiLCJ2aXNpYmlsaXR5TGlzdCIsIlNsaWRlciIsInNsaWRlciIsInN0ZXAiLCJ2YWx1ZXMiLCJyYW5nZSIsInNsaWRlIiwidWkiLCJjaGlsZHJlbiIsImFwcGVuZCIsInRvZ2dsZUZpeGVkSGVhZGVyIiwiJGhlYWRlciIsIiRtYWluIiwicGFnZVlPZmZzZXQiLCJtYXJnaW5Ub3AiLCJvdXRlckhlaWdodCIsImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsImpRdWVyeSIsIlNsaWNrIiwiaW5zdGFuY2VVaWQiLCJfIiwiZGF0YVNldHRpbmdzIiwiZGVmYXVsdHMiLCJhY2Nlc3NpYmlsaXR5IiwiYWRhcHRpdmVIZWlnaHQiLCJhcHBlbmRBcnJvd3MiLCJhcHBlbmREb3RzIiwiYXJyb3dzIiwiYXNOYXZGb3IiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJjZW50ZXJNb2RlIiwiY2VudGVyUGFkZGluZyIsImNzc0Vhc2UiLCJjdXN0b21QYWdpbmciLCJ0ZXh0IiwiZG90cyIsImRvdHNDbGFzcyIsImRyYWdnYWJsZSIsImVhc2luZyIsImVkZ2VGcmljdGlvbiIsImZhZGUiLCJmb2N1c09uU2VsZWN0IiwiZm9jdXNPbkNoYW5nZSIsImluZmluaXRlIiwiaW5pdGlhbFNsaWRlIiwibGF6eUxvYWQiLCJtb2JpbGVGaXJzdCIsInBhdXNlT25Ib3ZlciIsInBhdXNlT25Gb2N1cyIsInBhdXNlT25Eb3RzSG92ZXIiLCJyZXNwb25kVG8iLCJyZXNwb25zaXZlIiwicm93cyIsInJ0bCIsInNsaWRlc1BlclJvdyIsInNsaWRlc1RvU2hvdyIsInNsaWRlc1RvU2Nyb2xsIiwic3BlZWQiLCJzd2lwZSIsInN3aXBlVG9TbGlkZSIsInRvdWNoTW92ZSIsInRvdWNoVGhyZXNob2xkIiwidXNlQ1NTIiwidXNlVHJhbnNmb3JtIiwidmFyaWFibGVXaWR0aCIsInZlcnRpY2FsIiwidmVydGljYWxTd2lwaW5nIiwid2FpdEZvckFuaW1hdGUiLCJ6SW5kZXgiLCJpbml0aWFscyIsImFuaW1hdGluZyIsImRyYWdnaW5nIiwiYXV0b1BsYXlUaW1lciIsImN1cnJlbnREaXJlY3Rpb24iLCJjdXJyZW50TGVmdCIsImN1cnJlbnRTbGlkZSIsImRpcmVjdGlvbiIsIiRkb3RzIiwibGlzdFdpZHRoIiwibGlzdEhlaWdodCIsImxvYWRJbmRleCIsIiRuZXh0QXJyb3ciLCIkcHJldkFycm93Iiwic2Nyb2xsaW5nIiwic2xpZGVDb3VudCIsInNsaWRlV2lkdGgiLCIkc2xpZGVUcmFjayIsIiRzbGlkZXMiLCJzbGlkaW5nIiwic2xpZGVPZmZzZXQiLCJzd2lwZUxlZnQiLCJzd2lwaW5nIiwiJGxpc3QiLCJ0b3VjaE9iamVjdCIsInRyYW5zZm9ybXNFbmFibGVkIiwidW5zbGlja2VkIiwiYWN0aXZlQnJlYWtwb2ludCIsImFuaW1UeXBlIiwiYW5pbVByb3AiLCJicmVha3BvaW50U2V0dGluZ3MiLCJjc3NUcmFuc2l0aW9ucyIsImZvY3Vzc2VkIiwiaW50ZXJydXB0ZWQiLCJoaWRkZW4iLCJwYXVzZWQiLCJwb3NpdGlvblByb3AiLCJyb3dDb3VudCIsInNob3VsZENsaWNrIiwiJHNsaWRlciIsIiRzbGlkZXNDYWNoZSIsInRyYW5zZm9ybVR5cGUiLCJ0cmFuc2l0aW9uVHlwZSIsInZpc2liaWxpdHlDaGFuZ2UiLCJ3aW5kb3dXaWR0aCIsIndpbmRvd1RpbWVyIiwib3JpZ2luYWxTZXR0aW5ncyIsIm1vekhpZGRlbiIsIndlYmtpdEhpZGRlbiIsImF1dG9QbGF5IiwicHJveHkiLCJhdXRvUGxheUNsZWFyIiwiYXV0b1BsYXlJdGVyYXRvciIsImNoYW5nZVNsaWRlIiwiY2xpY2tIYW5kbGVyIiwic2VsZWN0SGFuZGxlciIsInNldFBvc2l0aW9uIiwic3dpcGVIYW5kbGVyIiwiZHJhZ0hhbmRsZXIiLCJrZXlIYW5kbGVyIiwiaHRtbEV4cHIiLCJyZWdpc3RlckJyZWFrcG9pbnRzIiwicHJvdG90eXBlIiwiYWN0aXZhdGVBREEiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwibWFya3VwIiwiYWRkQmVmb3JlIiwidW5sb2FkIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJlcSIsImluc2VydEFmdGVyIiwicHJlcGVuZFRvIiwiZGV0YWNoIiwicmVpbml0IiwiYW5pbWF0ZUhlaWdodCIsInRhcmdldEhlaWdodCIsImFuaW1hdGUiLCJhbmltYXRlU2xpZGUiLCJ0YXJnZXRMZWZ0IiwiYW5pbVByb3BzIiwiYW5pbVN0YXJ0IiwiZHVyYXRpb24iLCJub3ciLCJNYXRoIiwiY2VpbCIsImNvbXBsZXRlIiwiY2FsbCIsImFwcGx5VHJhbnNpdGlvbiIsInNldFRpbWVvdXQiLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsIm5vdCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwidHJhbnNpdGlvbiIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsInNsaWRlVG8iLCJidWlsZEFycm93cyIsInJlbW92ZUF0dHIiLCJhZGQiLCJidWlsZERvdHMiLCJkb3QiLCJnZXREb3RDb3VudCIsImZpcnN0IiwiYnVpbGRPdXQiLCJ3cmFwQWxsIiwic2V0dXBJbmZpbml0ZSIsInVwZGF0ZURvdHMiLCJzZXRTbGlkZUNsYXNzZXMiLCJidWlsZFJvd3MiLCJhIiwiYiIsImMiLCJuZXdTbGlkZXMiLCJudW1PZlNsaWRlcyIsIm9yaWdpbmFsU2xpZGVzIiwic2xpZGVzUGVyU2VjdGlvbiIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJyb3ciLCJnZXQiLCJhcHBlbmRDaGlsZCIsImVtcHR5IiwiY2hlY2tSZXNwb25zaXZlIiwiaW5pdGlhbCIsImZvcmNlVXBkYXRlIiwiYnJlYWtwb2ludCIsInRhcmdldEJyZWFrcG9pbnQiLCJyZXNwb25kVG9XaWR0aCIsInRyaWdnZXJCcmVha3BvaW50Iiwic2xpZGVyV2lkdGgiLCJpbm5lcldpZHRoIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsImRvbnRBbmltYXRlIiwiJHRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJpbmRleE9mZnNldCIsInVuZXZlbk9mZnNldCIsIm1lc3NhZ2UiLCJjaGVja05hdmlnYWJsZSIsIm5hdmlnYWJsZXMiLCJwcmV2TmF2aWdhYmxlIiwiZ2V0TmF2aWdhYmxlSW5kZXhlcyIsIm4iLCJjbGVhblVwRXZlbnRzIiwib2ZmIiwiaW50ZXJydXB0IiwidmlzaWJpbGl0eSIsImNsZWFuVXBTbGlkZUV2ZW50cyIsIm9yaWVudGF0aW9uQ2hhbmdlIiwicmVzaXplIiwiY2xlYW5VcFJvd3MiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJkZXN0cm95IiwiZmFkZVNsaWRlIiwic2xpZGVJbmRleCIsIm9wYWNpdHkiLCJmYWRlU2xpZGVPdXQiLCJmaWx0ZXJTbGlkZXMiLCJzbGlja0ZpbHRlciIsImZpbHRlciIsImZvY3VzSGFuZGxlciIsIiRzZiIsImdldEN1cnJlbnQiLCJzbGlja0N1cnJlbnRTbGlkZSIsImJyZWFrUG9pbnQiLCJjb3VudGVyIiwicGFnZXJRdHkiLCJnZXRMZWZ0IiwidmVydGljYWxIZWlnaHQiLCJ2ZXJ0aWNhbE9mZnNldCIsInRhcmdldFNsaWRlIiwiY29lZiIsImZsb29yIiwib2Zmc2V0TGVmdCIsIm91dGVyV2lkdGgiLCJnZXRPcHRpb24iLCJzbGlja0dldE9wdGlvbiIsIm9wdGlvbiIsImluZGV4ZXMiLCJwdXNoIiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50Iiwic2xpZGVzVHJhdmVyc2VkIiwic3dpcGVkU2xpZGUiLCJjZW50ZXJPZmZzZXQiLCJhYnMiLCJnb1RvIiwic2xpY2tHb1RvIiwicGFyc2VJbnQiLCJjcmVhdGlvbiIsInNldFByb3BzIiwic3RhcnRMb2FkIiwibG9hZFNsaWRlciIsImluaXRpYWxpemVFdmVudHMiLCJ1cGRhdGVBcnJvd3MiLCJpbml0QURBIiwibnVtRG90R3JvdXBzIiwidGFiQ29udHJvbEluZGV4ZXMiLCJzbGlkZUNvbnRyb2xJbmRleCIsImluZGV4T2YiLCJhcmlhQnV0dG9uQ29udHJvbCIsIm1hcHBlZFNsaWRlSW5kZXgiLCJlbmQiLCJpbml0QXJyb3dFdmVudHMiLCJpbml0RG90RXZlbnRzIiwiaW5pdFNsaWRlRXZlbnRzIiwiYWN0aW9uIiwiaW5pdFVJIiwic2hvdyIsInRhZ05hbWUiLCJrZXlDb2RlIiwibG9hZFJhbmdlIiwiY2xvbmVSYW5nZSIsInJhbmdlU3RhcnQiLCJyYW5nZUVuZCIsImxvYWRJbWFnZXMiLCJpbWFnZXNTY29wZSIsImltYWdlIiwiaW1hZ2VTb3VyY2UiLCJpbWFnZVNyY1NldCIsImltYWdlU2l6ZXMiLCJpbWFnZVRvTG9hZCIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzcmMiLCJzbGljZSIsInByZXZTbGlkZSIsIm5leHRTbGlkZSIsInByb2dyZXNzaXZlTGF6eUxvYWQiLCJzbGlja05leHQiLCJwYXVzZSIsInNsaWNrUGF1c2UiLCJwbGF5Iiwic2xpY2tQbGF5IiwicG9zdFNsaWRlIiwiJGN1cnJlbnRTbGlkZSIsImZvY3VzIiwicHJldiIsInNsaWNrUHJldiIsInRyeUNvdW50IiwiJGltZ3NUb0xvYWQiLCJpbml0aWFsaXppbmciLCJsYXN0VmlzaWJsZUluZGV4IiwiY3VycmVudEJyZWFrcG9pbnQiLCJsIiwicmVzcG9uc2l2ZVNldHRpbmdzIiwic3BsaWNlIiwic29ydCIsImNsZWFyVGltZW91dCIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInJlbW92ZUJlZm9yZSIsInJlbW92ZUFsbCIsInNldENTUyIsInBvc2l0aW9uIiwicG9zaXRpb25Qcm9wcyIsIngiLCJ5Iiwic2V0RGltZW5zaW9ucyIsInBhZGRpbmciLCJzZXRGYWRlIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsIml0ZW0iLCJvcHQiLCJib2R5U3R5bGUiLCJib2R5IiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJtc1RyYW5zaXRpb24iLCJPVHJhbnNmb3JtIiwicGVyc3BlY3RpdmVQcm9wZXJ0eSIsIndlYmtpdFBlcnNwZWN0aXZlIiwiTW96VHJhbnNmb3JtIiwiTW96UGVyc3BlY3RpdmUiLCJ3ZWJraXRUcmFuc2Zvcm0iLCJtc1RyYW5zZm9ybSIsInRyYW5zZm9ybSIsImFsbFNsaWRlcyIsInJlbWFpbmRlciIsImV2ZW5Db2VmIiwiaW5maW5pdGVDb3VudCIsImNsb25lIiwidG9nZ2xlIiwidGFyZ2V0RWxlbWVudCIsInBhcmVudHMiLCJzeW5jIiwiYW5pbVNsaWRlIiwib2xkU2xpZGUiLCJzbGlkZUxlZnQiLCJuYXZUYXJnZXQiLCJoaWRlIiwic3dpcGVEaXJlY3Rpb24iLCJ4RGlzdCIsInlEaXN0IiwiciIsInN3aXBlQW5nbGUiLCJzdGFydFgiLCJjdXJYIiwic3RhcnRZIiwiY3VyWSIsImF0YW4yIiwicm91bmQiLCJQSSIsInN3aXBlRW5kIiwic3dpcGVMZW5ndGgiLCJlZGdlSGl0IiwibWluU3dpcGUiLCJmaW5nZXJDb3VudCIsIm9yaWdpbmFsRXZlbnQiLCJ0b3VjaGVzIiwic3dpcGVTdGFydCIsInN3aXBlTW92ZSIsImVkZ2VXYXNIaXQiLCJjdXJMZWZ0IiwicG9zaXRpb25PZmZzZXQiLCJ2ZXJ0aWNhbFN3aXBlTGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiZnJvbUJyZWFrcG9pbnQiLCJhcmdzIiwiQXJyYXkiLCJyZXQiLCJhcHBseSIsIlBlcnNvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJtb2RhbENhbGwiLCJtb2RhbENsb3NlIiwiJHRoaXMiLCJtb2RhbElkIiwibW9kYWxQYXJlbnQiLCJkb2MiLCJzYyIsImRuIiwic2Nyb2xsVG9wIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUUsSUFOQztBQU9o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QU11TyxLQUFLLEdBQUd2TyxDQUFDLENBQUMsU0FBRCxDQUFELENBQWF3RyxJQUFiLEVBQWQ7O0FBRUEsUUFBSW5GLE1BQU0sQ0FBQ21OLFdBQVAsR0FBcUIsQ0FBekIsRUFBNEI7QUFDeEJGLE1BQUFBLE9BQU8sQ0FBQ3ZNLFFBQVIsQ0FBaUIsVUFBakI7QUFDQXdNLE1BQUFBLEtBQUssQ0FBQ2xJLEdBQU4sQ0FBVTtBQUFFb0ksUUFBQUEsU0FBUyxFQUFFSCxPQUFPLENBQUNJLFdBQVI7QUFBYixPQUFWO0FBQ0gsS0FIRCxNQUdPO0FBQ0hKLE1BQUFBLE9BQU8sQ0FBQ3RNLFdBQVIsQ0FBb0IsVUFBcEI7QUFDQXVNLE1BQUFBLEtBQUssQ0FBQ2xJLEdBQU4sQ0FBVTtBQUFFb0ksUUFBQUEsU0FBUyxFQUFFO0FBQWIsT0FBVjtBQUNIO0FBQ0o7O0FBR0w7QUFFQyxDQXpvSUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIC8qKlxyXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XHJcbiAgICAgKi9cclxuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcclxuICAgICAgICB0aW1lOiAgMjAwLFxyXG5cclxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgICAgIGRlc2t0b3BYbFNpemU6IDE5MjAsXHJcbiAgICAgICAgZGVza3RvcExnU2l6ZTogMTYwMCxcclxuICAgICAgICBkZXNrdG9wU2l6ZTogICAxMjgwLFxyXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxyXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXHJcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcclxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxyXG5cclxuICAgICAgICAvLyDQotC+0YfQutCwINC/0LXRgNC10YXQvtC00LAg0L/QvtC/0LDQv9C+0LIg0L3QsCDRhNGD0LvRgdC60YDQuNC9XHJcbiAgICAgICAgcG9wdXBzQnJlYWtwb2ludDogNzY4LFxyXG5cclxuICAgICAgICAvLyDQktGA0LXQvNGPINC00L4g0YHQvtC60YDRi9GC0LjRjyDRhNC40LrRgdC40YDQvtCy0LDQvdC90YvRhSDQv9C+0L/QsNC/0L7QslxyXG4gICAgICAgIHBvcHVwc0ZpeGVkVGltZW91dDogNTAwMCxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCB0b3VjaCDRg9GB0YLRgNC+0LnRgdGC0LJcclxuICAgICAgICBpc1RvdWNoOiAkLmJyb3dzZXIubW9iaWxlLFxyXG5cclxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcFhsOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BYbFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcclxuICAgIH07XHJcblxyXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsT3B0aW9ucy5pc1RvdWNoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygndG91Y2gnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ25vLXRvdWNoJykucmVtb3ZlQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcclxuICAgICAqL1xyXG4gICAgLyogZm9ybV9zdHlsZS5qcyDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0LLRi9C/0L7Qu9C90LXQvSDQv9C10YDQtdC0IGZvcm1fdmFsaWRhdGlvbi5qcyAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIFxyXG4gICAgICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cclxuICAgICAqIFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xyXG4gICAgICogXHJcbiAgICAgKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiB9KTtcclxuICAgICAqL1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcclxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cclxuICAgICAqL1xyXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcclxuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS5jb250ZXh0LnZhbHVlfVwiXWApLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcclxuICAgICAgICAgICAgJHVwZGF0ZUVsZW0uc2VsZWN0MignZGVzdHJveScpO1xyXG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCIGZpbGUgaW5wdXRcclxuICAgICAqIGh0dHA6Ly9ncmVncGlrZS5uZXQvZGVtb3MvYm9vdHN0cmFwLWZpbGUtaW5wdXQvZGVtby5odG1sXHJcbiAgICAgKi9cclxuICAgICQuZm4uY3VzdG9tRmlsZUlucHV0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbGVtKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYXliZSBzb21lIGZpZWxkcyBkb24ndCBuZWVkIHRvIGJlIHN0YW5kYXJkaXplZC5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCdkYXRhLWJmaS1kaXNhYmxlZCcpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdGhlIHdvcmQgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbldvcmQgPSAnQnJvd3NlJztcclxuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCd0aXRsZScpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uV29yZCA9ICRlbGVtLmF0dHIoJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghISRlbGVtLmF0dHIoJ2NsYXNzJykpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcgJyArICRlbGVtLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyB3ZSdyZSBnb2luZyB0byB3cmFwIHRoYXQgaW5wdXQgZmllbGQgd2l0aCBhIGJ1dHRvbi5cclxuICAgICAgICAgICAgLy8gVGhlIGlucHV0IHdpbGwgYWN0dWFsbHkgc3RpbGwgYmUgdGhlcmUsIGl0IHdpbGwganVzdCBiZSBmbG9hdCBhYm92ZSBhbmQgdHJhbnNwYXJlbnQgKGRvbmUgd2l0aCB0aGUgQ1NTKS5cclxuICAgICAgICAgICAgJGVsZW0ud3JhcChgPGRpdiBjbGFzcz1cImN1c3RvbS1maWxlXCI+PGEgY2xhc3M9XCJidG4gJHtjbGFzc05hbWV9XCI+PC9hPjwvZGl2PmApLnBhcmVudCgpLnByZXBlbmQoJCgnPHNwYW4+PC9zcGFuPicpLmh0bWwoYnV0dG9uV29yZCkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIEFmdGVyIHdlIGhhdmUgZm91bmQgYWxsIG9mIHRoZSBmaWxlIGlucHV0cyBsZXQncyBhcHBseSBhIGxpc3RlbmVyIGZvciB0cmFja2luZyB0aGUgbW91c2UgbW92ZW1lbnQuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGUgaW4gb3JkZXIgdG8gZ2l2ZSB0aGUgaWxsdXNpb24gdGhhdCB0aGlzIGlzIGEgYnV0dG9uIGluIEZGIHdlIGFjdHVhbGx5IG5lZWQgdG8gbW92ZSB0aGUgYnV0dG9uIGZyb20gdGhlIGZpbGUgaW5wdXQgdW5kZXIgdGhlIGN1cnNvci4gVWdoLlxyXG4gICAgICAgIC5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEFzIHRoZSBjdXJzb3IgbW92ZXMgb3ZlciBvdXIgbmV3IGJ1dHRvbiB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgdW5kZXIgdGhlIGN1cnNvci5cclxuICAgICAgICAgICAgLy8gVGhpcyBnaXZlcyB1cyB0aGUgcG9pbnRlciBjdXJzb3IgdGhhdCBGRiBkZW5pZXMgdXNcclxuICAgICAgICAgICAgJCgnLmN1c3RvbS1maWxlJykubW91c2Vtb3ZlKGZ1bmN0aW9uKGN1cnNvcikge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCwgd3JhcHBlcixcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyWCwgd3JhcHBlclksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRXaWR0aCwgaW5wdXRIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yWCwgY3Vyc29yWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdyYXBwZXIgZWxlbWVudCAodGhlIGJ1dHRvbiBzdXJyb3VuZCB0aGlzIGZpbGUgaW5wdXQpXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHdyYXBwZXIuZmluZCgnaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBsZWZ0LW1vc3QgcG9zaXRpb24gb2YgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJYID0gd3JhcHBlci5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHRvcC1tb3N0IHBvc2l0aW9uIG9mIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyWSA9IHdyYXBwZXIub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHdpdGggb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dFdpZHRoID0gaW5wdXQud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dEhlaWdodCA9IGlucHV0LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBpbiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgY3Vyc29yWCA9IGN1cnNvci5wYWdlWDtcclxuICAgICAgICAgICAgICAgIGN1cnNvclkgPSBjdXJzb3IucGFnZVk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb25zIHdlIGFyZSB0byBtb3ZlIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIDIwIGF0IHRoZSBlbmQgaXMgYW4gYXJiaXRyYXJ5IG51bWJlciBvZiBwaXhlbHMgdGhhdCB3ZSBjYW4gc2hpZnQgdGhlIGlucHV0IHN1Y2ggdGhhdCBjdXJzb3IgaXMgbm90IHBvaW50aW5nIGF0IHRoZSBlbmQgb2YgdGhlIEJyb3dzZSBidXR0b24gYnV0IHNvbWV3aGVyZSBuZWFyZXIgdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WCA9IGN1cnNvclggLSB3cmFwcGVyWCAtIGlucHV0V2lkdGggKyAyMDtcclxuICAgICAgICAgICAgICAgIC8vIFNsaWRlcyB0aGUgaW52aXNpYmxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgcG9zaXRpb25lZCBtaWRkbGUgdW5kZXIgdGhlIGN1cnNvclxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WSA9IGN1cnNvclkgLSB3cmFwcGVyWSAtIChpbnB1dEhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHRoZSBwb3NpdGlvbmluZyBzdHlsZXMgdG8gYWN0dWFsbHkgbW92ZSB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIGlucHV0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbW92ZUlucHV0WCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IG1vdmVJbnB1dFlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2hhbmdlJywgJy5jdXN0b20tZmlsZSBpbnB1dFt0eXBlPWZpbGVdJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJldmlvdXMgZmlsZSBuYW1lc1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5uZXh0KCcuY3VzdG9tLWZpbGVfX25hbWUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmICghISQodGhpcykucHJvcCgnZmlsZXMnKSAmJiAkKHRoaXMpLnByb3AoJ2ZpbGVzJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gJCh0aGlzKVswXS5maWxlcy5sZW5ndGggKyAnIGZpbGVzJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoZmlsZU5hbWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEsIGZpbGVOYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHNob3cgdGhlIG5hbWUgaWYgdGhlcmUgaXMgbm9uZVxyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9ICQodGhpcykuZGF0YSgnZmlsZW5hbWUtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9PT0gJ2luc2lkZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBQcmludCB0aGUgZmlsZU5hbWUgaW5zaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnc3BhbicpLmh0bWwoZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigndGl0bGUnLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IHRoZSBmaWxlTmFtZSBhc2lkZSAocmlnaHQgYWZ0ZXIgdGhlIHRoZSBidXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZnRlcihgPHNwYW4gY2xhc3M9XCJjdXN0b20tZmlsZV9fbmFtZVwiPiR7ZmlsZU5hbWV9IDwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgJCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jdXN0b21GaWxlSW5wdXQoKTtcclxuICAgIC8vICQoJ3NlbGVjdCcpLmN1c3RvbVNlbGVjdCgpO1xyXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xyXG5cclxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCQ0L3QuNC80LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQsCBsYWJlbCDQv9GA0Lgg0YTQvtC60YPRgdC1INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9ICQoZWwpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKGZpZWxkKS5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9KS5vbignYmx1cicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcclxuXHJcbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xyXG5cclxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXHJcbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcclxuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXHJcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxyXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXHJcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXHJcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkVxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLINC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOdCwLdGP0ZFdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlswLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBlbWFpbCBhZGRyZXNzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcclxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxyXG4gICAgICAgICAgICAgICAgbWluID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNaW4nKSxcclxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZGF0ZSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlTWF4U2l6ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5sZW5ndGggIT0gMSAgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXHJcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Lkg0YTQsNC50LvQvtCyXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVFeHRlbnNpb24gPSB2YWx1ZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XHJcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxyXG4gICAgICAgICAgICBlbjogJ0F2YWlsYWJsZSBleHRlbnNpb25zIGFyZSAlcydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXHJcbiAgICAgICAgICAgICRsYXN0O1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNC40YDRg9C10YIg0LLQsNC70LjQtNCw0YbQuNGOINC90LAg0LLRgtC+0YDQvtC8INC60LDQu9C10LTQsNGA0L3QvtC8INC/0L7Qu9C1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcclxuICAgIC8qKlxyXG4gICAgICog0JTQvtCx0LDQstC70Y/QtdGCINC80LDRgdC60Lgg0LIg0L/QvtC70Y8g0YTQvtGA0LxcclxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XHJcbiAgICAgKi9cclxuICAgICQoJy5qcy1waG9uZS1tYXNrJykuaW5wdXRtYXNrKCcrNyg5OTkpIDk5OS05OS05OScsIHtcclxuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcclxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCBcIi5mbGFnbWFuLXJlcXVlc3RfX2RhdGVcIiApLmRhdGVwaWNrZXIoKTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YHRgtGL0LvRjCDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8geGxpbmsg0YMgc3ZnLdC40LrQvtC90L7QuiDQv9C+0YHQu9C1INC+0LHQvdC+0LLQu9C10L3QuNGPIERPTSAo0LTQu9GPIElFKVxyXG4gICAgICog0YTRg9C90LrRhtC40Y4g0L3Rg9C20L3QviDQstGL0LfRi9Cy0LDRgtGMINCyINGB0L7QsdGL0YLQuNGP0YUsINC60L7RgtC+0YDRi9C1INCy0L3QvtGB0Y/RgiDQuNC30LzQtdC90LXQvdC40Y8g0LIg0Y3Qu9C10LzQtdC90YLRiyDRg9C20LUg0L/QvtGB0LvQtSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8gRE9NLdCwXHJcbiAgICAgKiAo0L3QsNC/0YDQuNC80LXRgCwg0L/QvtGB0LvQtSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutCw0YDRg9GB0LXQu9C4INC40LvQuCDQvtGC0LrRgNGL0YLQuNC4INC/0L7Qv9Cw0L/QsClcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtZW50INGN0LvQtdC80LXQvdGCLCDQsiDQutC+0YLQvtGA0L7QvCDQvdC10L7QsdGF0L7QtNC40LzQviDQvtCx0L3QvtCy0LjRgtGMIHN2ZyAo0L3QsNC/0YDQuNC8ICQoJyNzb21lLXBvcHVwJykpXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVN2ZyhlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0ICR1c2VFbGVtZW50ID0gZWxlbWVudC5maW5kKCd1c2UnKTtcclxuXHJcbiAgICAgICAgJHVzZUVsZW1lbnQuZWFjaChmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgIGlmICgkdXNlRWxlbWVudFtpbmRleF0uaHJlZiAmJiAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsID0gJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbDsgLy8gdHJpZ2dlciBmaXhpbmcgb2YgaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcclxuICAgICAgICBzaG93T3RoZXJNb250aHM6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LvQsNC10YIg0LLRi9C/0LDQtNGO0YnQuNC1INC60LDQu9C10L3QtNCw0YDQuNC60LhcclxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XHJcbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGF0ZUlucHV0XCIgaWQ9XCJcIiBjbGFzcz1cImpzLWRhdGVwaWNrZXJcIiBkYXRhLWRhdGUtbWluPVwiMDYuMTEuMjAxNVwiIGRhdGEtZGF0ZS1tYXg9XCIxMC4xMi4yMDE1XCI+XHJcbiAgICAgKi9cclxuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xyXG5cclxuICAgICAgICBkYXRlcGlja2VyLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcclxuICAgICAgICAgICAgbGV0IG1heERhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWF4Jyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5maWVsZCcpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLy8g0JTQuNCw0L/QsNC30L7QvSDQtNCw0YJcclxuICAgIGxldCBEYXRlcGlja2VyUmFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgZGF0ZXBpY2tlclJhbmdlID0gJCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcclxuXHJcbiAgICAgICAgZGF0ZXBpY2tlclJhbmdlLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZnJvbUl0ZW1PcHRpb25zID0ge307XHJcbiAgICAgICAgICAgIGxldCB0b0l0ZW1PcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBmcm9tSXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRvSXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0ZUZyb20gPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZS1mcm9tJykuZGF0ZXBpY2tlcihmcm9tSXRlbU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGVUbyA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlLXRvJykuZGF0ZXBpY2tlcih0b0l0ZW1PcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGVGcm9tLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVUby5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWluRGF0ZScsIGdldERhdGUodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGVUby5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdwYXJzbGV5LWVycm9yJykgJiYgJCh0aGlzKS5wYXJzbGV5KCkuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJzbGV5KCkudmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkYXRlVG8ub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZUZyb20uZGF0ZXBpY2tlcignb3B0aW9uJywgJ21heERhdGUnLCBnZXREYXRlKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkYXRlRnJvbS5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdwYXJzbGV5LWVycm9yJykgJiYgJCh0aGlzKS5wYXJzbGV5KCkuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJzbGV5KCkudmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGUoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0ZTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMuZGF0ZUZvcm1hdCwgZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkYXRlcGlja2VyUmFuZ2UgPSBuZXcgRGF0ZXBpY2tlclJhbmdlKCk7XHJcbiAgICAvKipcclxuICAgICAqINCg0LXQsNC70LjQt9GD0LXRgiDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QslxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8dWwgY2xhc3M9XCJ0YWJzIGpzLXRhYnNcIj5cclxuICAgICAqICAgICA8bGkgY2xhc3M9XCJ0YWJzX19pdGVtXCI+XHJcbiAgICAgKiAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXMtYWN0aXZlIHRhYnNfX2xpbmsganMtdGFiLWxpbmtcIj5UYWIgbmFtZTwvc3Bhbj5cclxuICAgICAqICAgICAgICAgPGRpdiBjbGFzcz1cInRhYnNfX2NudFwiPlxyXG4gICAgICogICAgICAgICAgICAgPHA+VGFiIGNvbnRlbnQ8L3A+XHJcbiAgICAgKiAgICAgICAgIDwvZGl2PlxyXG4gICAgICogICAgIDwvbGk+XHJcbiAgICAgKiA8L3VsPlxyXG4gICAgICovXHJcbiAgICBsZXQgVGFiU3dpdGNoZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCB0YWJzID0gJCgnLmpzLXRhYnMnKTtcclxuXHJcbiAgICAgICAgdGFicy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy10YWItbGluay5pcy1hY3RpdmUnKS5uZXh0KCkuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGFicy5vbignY2xpY2snLCAnLmpzLXRhYi1saW5rJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcGVuKCQodGhpcyksIGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC60YDRi9Cy0LDQtdGCINGC0LDQsSDQv9C+INC60LvQuNC60YMg0L3QsCDQutCw0LrQvtC5LdGC0L4g0LTRgNGD0LPQvtC5INGN0LvQtdC80LXQvdGCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIDxzcGFuIGRhdGEtdGFiLW9wZW49XCIjdGFiLWxvZ2luXCI+T3BlbiBsb2dpbiB0YWI8L3NwYW4+XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLXRhYi1vcGVuXScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYkVsZW0gPSAkKHRoaXMpLmRhdGEoJ3RhYi1vcGVuJyk7XHJcbiAgICAgICAgICAgIHNlbGYub3BlbigkKHRhYkVsZW0pLCBldmVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdwb3B1cCcpID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRgtCw0LFcclxuICAgICAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtINGN0LvQtdC80LXQvdGCIC5qcy10YWItbGluaywg0L3QsCDQutC+0YLQvtGA0YvQuSDQvdGD0LbQvdC+INC/0LXRgNC10LrQu9GO0YfQuNGC0YxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgICogLy8g0LLRi9C30L7QsiDQvNC10YLQvtC00LAgb3Blbiwg0L7RgtC60YDQvtC10YIg0YLQsNCxXHJcbiAgICAgICAgICogdGFiU3dpdGNoZXIub3BlbigkKCcjc29tZS10YWInKSk7XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VsZi5vcGVuID0gZnVuY3Rpb24oZWxlbSwgZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFlbGVtLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRUYWJzID0gZWxlbS5jbG9zZXN0KHRhYnMpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFicy5maW5kKCcuaXMtb3BlbicpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWxlbS5uZXh0KCkudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhYnMuZmluZCgnLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGVsZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB0YWJTd2l0Y2hlciA9IG5ldyBUYWJTd2l0Y2hlcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQutGA0YvQstCw0LXRgiDRjdC70LXQvNC10L3RgiBoaWRkZW5FbGVtINC/0YDQuCDQutC70LjQutC1INC30LAg0L/RgNC10LTQtdC70LDQvNC4INGN0LvQtdC80LXQvdGC0LAgdGFyZ2V0RWxlbVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9ICAgdGFyZ2V0RWxlbVxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gICBoaWRkZW5FbGVtXHJcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gIFtvcHRpb25hbENiXSDQvtGC0YDQsNCx0LDRgtGL0LLQsNC10YIg0YHRgNCw0LfRgyDQvdC1INC00L7QttC40LTQsNGP0YHRjCDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG9uT3V0c2lkZUNsaWNrSGlkZSh0YXJnZXRFbGVtLCBoaWRkZW5FbGVtLCBvcHRpb25hbENiKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkuYmluZCgnbW91c2V1cCB0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRFbGVtLmlzKGUudGFyZ2V0KSAmJiAkKGUudGFyZ2V0KS5jbG9zZXN0KHRhcmdldEVsZW0pLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW5FbGVtLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbmFsQ2IpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25hbENiKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCl0Y3Qu9C/0LXRgCDQtNC70Y8g0L/QvtC60LDQt9CwLCDRgdC60YDRi9GC0LjRjyDQuNC70Lgg0YfQtdGA0LXQtNC+0LLQsNC90LjRjyDQstC40LTQuNC80L7RgdGC0Lgg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMVwiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwiaGlkZVwiIGRhdGEtaGlkZT1cIiNlbGVtSWQyXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJ0b2dnbGVcIiBkYXRhLXRvZ2dsZT1cIiNlbGVtSWQzXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDF8I2VsZW1JZDNcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIC8vINC10YHQu9C4INC10YHRgtGMINCw0YLRgNC40LHRg9GCIGRhdGEtcXVldWU9XCJzaG93XCIsINGC0L4g0LHRg9C00LXRgiDRgdC90LDRh9Cw0LvQsCDRgdC60YDRi9GCINGN0LvQtdC80LXQvdGCICNlbGVtSWQyLCDQsCDQv9C+0YLQvtC8INC/0L7QutCw0LfQsNC9ICNlbGVtSWQxXHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDFcIiBkYXRhLXZpc2liaWxpdHk9XCJoaWRlXCIgZGF0YS1oaWRlPVwiI2VsZW1JZDJcIiBkYXRhLXF1ZXVlPVwic2hvd1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQxXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlRleHQ8L2Rpdj5cclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQyXCI+VGV4dDwvZGl2PlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDNcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+VGV4dDwvZGl2PlxyXG4gICAgICovXHJcbiAgICBsZXQgdmlzaWJpbGl0eUNvbnRyb2wgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIHR5cGVzOiBbXHJcbiAgICAgICAgICAgICAgICAnc2hvdycsXHJcbiAgICAgICAgICAgICAgICAnaGlkZScsXHJcbiAgICAgICAgICAgICAgICAndG9nZ2xlJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCQoJ1tkYXRhLXZpc2liaWxpdHldJykubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLXZpc2liaWxpdHldJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YVR5cGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRpbmdzLnR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBzZXR0aW5ncy50eXBlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YShkYXRhVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZpc2liaWxpdHlMaXN0ID0gJCh0aGlzKS5kYXRhKGRhdGFUeXBlKS5zcGxpdCgnfCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncXVldWUnKSA9PSAnc2hvdycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gZ2xvYmFsT3B0aW9ucy50aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpc2liaWxpdHkoZGF0YVR5cGUsIHZpc2liaWxpdHlMaXN0LCBkZWxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygndGFic19fbGluaycpICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdyYWRpbycgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LLQuNC00LjQvNC+0YHRgtGMXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdmlzaWJpbGl0eVR5cGUg0YLQuNC/INC+0YLQvtCx0YDQsNC20LXQvdC40Y9cclxuICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gICBsaXN0INC80LDRgdGB0LjQsiDRjdC70LXQvNC10L3RgtC+0LIsINGBINC60L7RgtC+0YDRi9C8INGA0LDQsdC+0YLQsNC10LxcclxuICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICBkZWxheSDQt9Cw0LTQtdGA0LbQutCwINC/0YDQuCDQv9C+0LrQsNC30LUg0Y3Qu9C10LzQtdC90YLQsCDQsiBtc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0VmlzaWJpbGl0eSh2aXNpYmlsaXR5VHlwZSwgbGlzdCwgZGVsYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmRlbGF5KGRlbGF5KS5mYWRlSW4oZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1syXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChsaXN0W2ldKS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVJbihnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdmlzaWJpbGl0eUNvbnRyb2woKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQu9Cw0LXRgiDRgdC70LDQudC00LXRgFxyXG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vc2xpZGVyL1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyDQsiBkYXRhLW1pbiDQuCBkYXRhLW1heCDQt9Cw0LTQsNGO0YLRgdGPINC80LjQvdC40LzQsNC70YzQvdC+0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LVcclxuICAgICAqIC8vINCyIGRhdGEtc3RlcCDRiNCw0LMsXHJcbiAgICAgKiAvLyDQsiBkYXRhLXZhbHVlcyDQtNC10YTQvtC70YLQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyBcIm1pbiwgbWF4XCJcclxuICAgICAqIDxkaXYgY2xhc3M9XCJzbGlkZXIganMtcmFuZ2VcIj5cclxuICAgICAqICAgICAgPGRpdiBjbGFzcz1cInNsaWRlcl9fcmFuZ2VcIiBkYXRhLW1pbj1cIjBcIiBkYXRhLW1heD1cIjEwMFwiIGRhdGEtc3RlcD1cIjFcIiBkYXRhLXZhbHVlcz1cIjEwLCA1NVwiPjwvZGl2PlxyXG4gICAgICogPC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGxldCBTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzbGlkZXIgPSAkKCcuanMtcmFuZ2UnKTtcclxuICAgICAgICBsZXQgbWluLFxyXG4gICAgICAgICAgICBtYXgsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHZhbHVlcztcclxuXHJcbiAgICAgICAgc2xpZGVyLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICByYW5nZSA9IHNlbGYuZmluZCgnLnNsaWRlcl9fcmFuZ2UnKTtcclxuXHJcbiAgICAgICAgICAgIG1pbiA9IHJhbmdlLmRhdGEoJ21pbicpO1xyXG4gICAgICAgICAgICBtYXggPSByYW5nZS5kYXRhKCdtYXgnKTtcclxuICAgICAgICAgICAgc3RlcCA9IHJhbmdlLmRhdGEoJ3N0ZXAnKTtcclxuICAgICAgICAgICAgdmFsdWVzID0gcmFuZ2UuZGF0YSgndmFsdWVzJykuc3BsaXQoJywgJyk7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5zbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW46IG1pbiB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBtYXggfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHN0ZXA6IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGUnKS5jaGlsZHJlbignc3BhbicpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDIpJykuYXBwZW5kKGA8c3Bhbj4ke3VpLnZhbHVlc1swXX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMyknKS5hcHBlbmQoYDxzcGFuPiR7dWkudmFsdWVzWzFdfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgyKScpLmFwcGVuZChgPHNwYW4+JHtyYW5nZS5zbGlkZXIoJ3ZhbHVlcycsIDApfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMyknKS5hcHBlbmQoYDxzcGFuPiR7cmFuZ2Uuc2xpZGVyKCd2YWx1ZXMnLCAxKX08L3NwYW4+YCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgc2xpZGVyID0gbmV3IFNsaWRlcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdGL0Lkg0YXQtdC00LXRgFxyXG4gICAgICovXHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0b2dnbGVGaXhlZEhlYWRlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRml4ZWRIZWFkZXIoKSB7XHJcbiAgICAgICAgY29uc3QgJGhlYWRlciA9ICQoJy5oZWFkZXInKTtcclxuICAgICAgICBjb25zdCAkbWFpbiA9ICQoJy5oZWFkZXInKS5uZXh0KCk7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogJGhlYWRlci5vdXRlckhlaWdodCgpIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogMCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcbiAgICAgICAgIF8gXyAgICAgIF8gICAgICAgX1xuICAgICBfX198IChfKSBfX198IHwgX18gIChfKV9fX1xuICAgIC8gX198IHwgfC8gX198IHwvIC8gIHwgLyBfX3xcbiAgICBcXF9fIFxcIHwgfCAoX198ICAgPCBfIHwgXFxfXyBcXFxuICAgIHxfX18vX3xffFxcX19ffF98XFxfKF8pLyB8X19fL1xuICAgICAgICAgICAgICAgICAgICAgICB8X18vXG5cbiAgICAgVmVyc2lvbjogMS44LjBcbiAgICAgIEF1dGhvcjogS2VuIFdoZWVsZXJcbiAgICAgV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXG4gICAgICAgIERvY3M6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGlja1xuICAgICAgICBSZXBvOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrXG4gICAgICBJc3N1ZXM6IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2svaXNzdWVzXG5cbiAgICAgKi9cbiAgICAvKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgZGVmaW5lLCBqUXVlcnksIHNldEludGVydmFsLCBjbGVhckludGVydmFsICovXG4gICAgOyhmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgfShmdW5jdGlvbigkKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdmFyIFNsaWNrID0gd2luZG93LlNsaWNrIHx8IHt9O1xuXG4gICAgICAgIFNsaWNrID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VVaWQgPSAwO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBTbGljayhlbGVtZW50LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICAgICAgdmFyIF8gPSB0aGlzLCBkYXRhU2V0dGluZ3M7XG5cbiAgICAgICAgICAgICAgICBfLmRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NpYmlsaXR5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGFwcGVuZEFycm93czogJChlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kRG90czogJChlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhc05hdkZvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInNsaWNrLXByZXZcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0eXBlPVwiYnV0dG9uXCI+UHJldmlvdXM8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwic2xpY2stbmV4dFwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiPk5leHQ8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGNzc0Vhc2U6ICdlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tUGFnaW5nOiBmdW5jdGlvbihzbGlkZXIsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiAvPicpLnRleHQoaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZG90c0NsYXNzOiAnc2xpY2stZG90cycsXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgICAgICAgZWRnZUZyaWN0aW9uOiAwLjM1LFxuICAgICAgICAgICAgICAgICAgICBmYWRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzT25DaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwYXVzZU9uSG92ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHBhdXNlT25Gb2N1czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGF1c2VPbkRvdHNIb3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbmRUbzogJ3dpbmRvdycsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHJvd3M6IDEsXG4gICAgICAgICAgICAgICAgICAgIHJ0bDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzUGVyUm93OiAxLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgICAgICBzcGVlZDogNTAwLFxuICAgICAgICAgICAgICAgICAgICBzd2lwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVUb1NsaWRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hNb3ZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0b3VjaFRocmVzaG9sZDogNSxcbiAgICAgICAgICAgICAgICAgICAgdXNlQ1NTOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB1c2VUcmFuc2Zvcm06IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDBcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgXy5pbml0aWFscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBhdXRvUGxheVRpbWVyOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGlyZWN0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGVmdDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IDEsXG4gICAgICAgICAgICAgICAgICAgICRkb3RzOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBsaXN0V2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWlnaHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGxvYWRJbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgJG5leHRBcnJvdzogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgJHByZXZBcnJvdzogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVXaWR0aDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJhY2s6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZXM6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZU9mZnNldDogMCxcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVMZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzd2lwaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJGxpc3Q6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoT2JqZWN0OiB7fSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3Jtc0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB1bnNsaWNrZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMpO1xuXG4gICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfLmFuaW1UeXBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfLmFuaW1Qcm9wID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzID0gW107XG4gICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgICAgIF8ucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IG51bGw7XG4gICAgICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBudWxsO1xuICAgICAgICAgICAgICAgIF8ucm93Q291bnQgPSAxO1xuICAgICAgICAgICAgICAgIF8uc2hvdWxkQ2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlciA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgICAgIF8ud2luZG93V2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIF8ud2luZG93VGltZXIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgZGF0YVNldHRpbmdzID0gJChlbGVtZW50KS5kYXRhKCdzbGljaycpIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8uZGVmYXVsdHMsIHNldHRpbmdzLCBkYXRhU2V0dGluZ3MpO1xuXG4gICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuXG4gICAgICAgICAgICAgICAgXy5vcmlnaW5hbFNldHRpbmdzID0gXy5vcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ21vekhpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ3dlYmtpdEhpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfLmF1dG9QbGF5ID0gJC5wcm94eShfLmF1dG9QbGF5LCBfKTtcbiAgICAgICAgICAgICAgICBfLmF1dG9QbGF5Q2xlYXIgPSAkLnByb3h5KF8uYXV0b1BsYXlDbGVhciwgXyk7XG4gICAgICAgICAgICAgICAgXy5hdXRvUGxheUl0ZXJhdG9yID0gJC5wcm94eShfLmF1dG9QbGF5SXRlcmF0b3IsIF8pO1xuICAgICAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUgPSAkLnByb3h5KF8uY2hhbmdlU2xpZGUsIF8pO1xuICAgICAgICAgICAgICAgIF8uY2xpY2tIYW5kbGVyID0gJC5wcm94eShfLmNsaWNrSGFuZGxlciwgXyk7XG4gICAgICAgICAgICAgICAgXy5zZWxlY3RIYW5kbGVyID0gJC5wcm94eShfLnNlbGVjdEhhbmRsZXIsIF8pO1xuICAgICAgICAgICAgICAgIF8uc2V0UG9zaXRpb24gPSAkLnByb3h5KF8uc2V0UG9zaXRpb24sIF8pO1xuICAgICAgICAgICAgICAgIF8uc3dpcGVIYW5kbGVyID0gJC5wcm94eShfLnN3aXBlSGFuZGxlciwgXyk7XG4gICAgICAgICAgICAgICAgXy5kcmFnSGFuZGxlciA9ICQucHJveHkoXy5kcmFnSGFuZGxlciwgXyk7XG4gICAgICAgICAgICAgICAgXy5rZXlIYW5kbGVyID0gJC5wcm94eShfLmtleUhhbmRsZXIsIF8pO1xuXG4gICAgICAgICAgICAgICAgXy5pbnN0YW5jZVVpZCA9IGluc3RhbmNlVWlkKys7XG5cbiAgICAgICAgICAgICAgICAvLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5nc1xuICAgICAgICAgICAgICAgIC8vIFN0cmljdCBIVE1MIHJlY29nbml0aW9uIChtdXN0IHN0YXJ0IHdpdGggPClcbiAgICAgICAgICAgICAgICAvLyBFeHRyYWN0ZWQgZnJvbSBqUXVlcnkgdjEuMTEgc291cmNlXG4gICAgICAgICAgICAgICAgXy5odG1sRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLztcblxuXG4gICAgICAgICAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XG4gICAgICAgICAgICAgICAgXy5pbml0KHRydWUpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBTbGljaztcblxuICAgICAgICB9KCkpO1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hY3RpdmF0ZUFEQSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAnZmFsc2UnXG4gICAgICAgICAgICB9KS5maW5kKCdhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3QnKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmFkZFNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQWRkID0gZnVuY3Rpb24obWFya3VwLCBpbmRleCwgYWRkQmVmb3JlKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGFkZEJlZm9yZSA9IGluZGV4O1xuICAgICAgICAgICAgICAgIGluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwIHx8IChpbmRleCA+PSBfLnNsaWRlQ291bnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDAgJiYgXy4kc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRCZWZvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEJlZm9yZShfLiRzbGlkZXMuZXEoaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QWZ0ZXIoXy4kc2xpZGVzLmVxKGluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYWRkQmVmb3JlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQobWFya3VwKS5wcmVwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChtYXJrdXApLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmFuaW1hdGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAxICYmIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0YXJnZXRIZWlnaHRcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hbmltYXRlU2xpZGUgPSBmdW5jdGlvbih0YXJnZXRMZWZ0LCBjYWxsYmFjaykge1xuXG4gICAgICAgICAgICB2YXIgYW5pbVByb3BzID0ge30sXG4gICAgICAgICAgICAgICAgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF8uYW5pbWF0ZUhlaWdodCgpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IC10YXJnZXRMZWZ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnRcbiAgICAgICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdGFyZ2V0TGVmdFxuICAgICAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudExlZnQgPSAtKF8uY3VycmVudExlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiBfLmN1cnJlbnRMZWZ0XG4gICAgICAgICAgICAgICAgICAgIH0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiB0YXJnZXRMZWZ0XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfLm9wdGlvbnMuc3BlZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IF8ub3B0aW9ucy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwOiBmdW5jdGlvbihub3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBNYXRoLmNlaWwobm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93ICsgJ3B4LCAwcHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKDBweCwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gTWF0aC5jZWlsKHRhcmdldExlZnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHRhcmdldExlZnQgKyAncHgsIDBweCwgMHB4KSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoMHB4LCcgKyB0YXJnZXRMZWZ0ICsgJ3B4LCAwcHgpJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlzYWJsZVRyYW5zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmdldE5hdlRhcmdldCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXNOYXZGb3IgPSBfLm9wdGlvbnMuYXNOYXZGb3I7XG5cbiAgICAgICAgICAgIGlmICggYXNOYXZGb3IgJiYgYXNOYXZGb3IgIT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgYXNOYXZGb3IgPSAkKGFzTmF2Rm9yKS5ub3QoXy4kc2xpZGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFzTmF2Rm9yO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmFzTmF2Rm9yID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5nZXROYXZUYXJnZXQoKTtcblxuICAgICAgICAgICAgaWYgKCBhc05hdkZvciAhPT0gbnVsbCAmJiB0eXBlb2YgYXNOYXZGb3IgPT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgICAgIGFzTmF2Rm9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLnNsaWNrKCdnZXRTbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBpZighdGFyZ2V0LnVuc2xpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWRlSGFuZGxlcihpbmRleCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9IF8udHJhbnNmb3JtVHlwZSArICcgJyArIF8ub3B0aW9ucy5zcGVlZCArICdtcyAnICsgXy5vcHRpb25zLmNzc0Vhc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnb3BhY2l0eSAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHRyYW5zaXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuXG4gICAgICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG4gICAgICAgICAgICAgICAgXy5hdXRvUGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoIF8uYXV0b1BsYXlJdGVyYXRvciwgXy5vcHRpb25zLmF1dG9wbGF5U3BlZWQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUNsZWFyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8uYXV0b1BsYXlUaW1lcikge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzbGlkZVRvID0gXy5jdXJyZW50U2xpZGUgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG5cbiAgICAgICAgICAgIGlmICggIV8ucGF1c2VkICYmICFfLmludGVycnVwdGVkICYmICFfLmZvY3Vzc2VkICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggXy5kaXJlY3Rpb24gPT09IDEgJiYgKCBfLmN1cnJlbnRTbGlkZSArIDEgKSA9PT0gKCBfLnNsaWRlQ291bnQgLSAxICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIF8uY3VycmVudFNsaWRlIC0gMSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIHNsaWRlVG8gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkQXJyb3dzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cgPSAkKF8ub3B0aW9ucy5wcmV2QXJyb3cpLmFkZENsYXNzKCdzbGljay1hcnJvdycpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdyA9ICQoXy5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2staGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gdGFiaW5kZXgnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5wcmV2QXJyb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucHJlcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGQoIF8uJG5leHRBcnJvdyApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1kaXNhYmxlZCc6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkRG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaSwgZG90O1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1kb3R0ZWQnKTtcblxuICAgICAgICAgICAgICAgIGRvdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKF8ub3B0aW9ucy5kb3RzQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8PSBfLmdldERvdENvdW50KCk7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkb3QuYXBwZW5kKCQoJzxsaSAvPicpLmFwcGVuZChfLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcywgXywgaSkpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfLiRkb3RzID0gZG90LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmREb3RzKTtcblxuICAgICAgICAgICAgICAgIF8uJGRvdHMuZmluZCgnbGknKS5maXJzdCgpLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkT3V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy4kc2xpZGVzID1cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCBfLm9wdGlvbnMuc2xpZGUgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcblxuICAgICAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKCdvcmlnaW5hbFN0eWxpbmcnLCAkKGVsZW1lbnQpLmF0dHIoJ3N0eWxlJykgfHwgJycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stc2xpZGVyJyk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sgPSAoXy5zbGlkZUNvdW50ID09PSAwKSA/XG4gICAgICAgICAgICAgICAgJCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLmFwcGVuZFRvKF8uJHNsaWRlcikgOlxuICAgICAgICAgICAgICAgIF8uJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCk7XG5cbiAgICAgICAgICAgIF8uJGxpc3QgPSBfLiRzbGlkZVRyYWNrLndyYXAoXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzbGljay1saXN0XCIvPicpLnBhcmVudCgpO1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoJ29wYWNpdHknLCAwKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlIHx8IF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlcikubm90KCdbc3JjXScpLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xuXG4gICAgICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XG5cbiAgICAgICAgICAgIF8uYnVpbGREb3RzKCk7XG5cbiAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xuXG5cbiAgICAgICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJGxpc3QuYWRkQ2xhc3MoJ2RyYWdnYWJsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkUm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsIGEsIGIsIGMsIG5ld1NsaWRlcywgbnVtT2ZTbGlkZXMsIG9yaWdpbmFsU2xpZGVzLHNsaWRlc1BlclNlY3Rpb247XG5cbiAgICAgICAgICAgIG5ld1NsaWRlcyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzID0gXy4kc2xpZGVyLmNoaWxkcmVuKCk7XG5cbiAgICAgICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMCkge1xuXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyU2VjdGlvbiA9IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cgKiBfLm9wdGlvbnMucm93cztcbiAgICAgICAgICAgICAgICBudW1PZlNsaWRlcyA9IE1hdGguY2VpbChcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMubGVuZ3RoIC8gc2xpZGVzUGVyU2VjdGlvblxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBmb3IoYSA9IDA7IGEgPCBudW1PZlNsaWRlczsgYSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihiID0gMDsgYiA8IF8ub3B0aW9ucy5yb3dzOyBiKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjID0gMDsgYyA8IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3c7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAoYSAqIHNsaWRlc1BlclNlY3Rpb24gKyAoKGIgKiBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArIGMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTbGlkZXMuZ2V0KHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1NsaWRlcy5hcHBlbmRDaGlsZChzbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG5ld1NsaWRlcyk7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzooMTAwIC8gXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyAnJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdpbmxpbmUtYmxvY2snXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlID0gZnVuY3Rpb24oaW5pdGlhbCwgZm9yY2VVcGRhdGUpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQsIHRhcmdldEJyZWFrcG9pbnQsIHJlc3BvbmRUb1dpZHRoLCB0cmlnZ2VyQnJlYWtwb2ludCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHNsaWRlcldpZHRoID0gXy4kc2xpZGVyLndpZHRoKCk7XG4gICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCAkKHdpbmRvdykud2lkdGgoKTtcblxuICAgICAgICAgICAgaWYgKF8ucmVzcG9uZFRvID09PSAnd2luZG93Jykge1xuICAgICAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gd2luZG93V2lkdGg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnc2xpZGVyJykge1xuICAgICAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gc2xpZGVyV2lkdGg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnbWluJykge1xuICAgICAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gTWF0aC5taW4od2luZG93V2lkdGgsIHNsaWRlcldpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSAmJlxuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGZvciAoYnJlYWtwb2ludCBpbiBfLmJyZWFrcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA8IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uZFRvV2lkdGggPiBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBfLmFjdGl2ZUJyZWFrcG9pbnQgfHwgZm9yY2VVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy51bnNsaWNrKHRhcmdldEJyZWFrcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSBfLm9yaWdpbmFsU2V0dGluZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBicmVha3BvaW50cyBkdXJpbmcgYW4gYWN0dWFsIGJyZWFrLiBub3Qgb24gaW5pdGlhbGl6ZS5cbiAgICAgICAgICAgICAgICBpZiggIWluaXRpYWwgJiYgdHJpZ2dlckJyZWFrcG9pbnQgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYnJlYWtwb2ludCcsIFtfLCB0cmlnZ2VyQnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5jaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uKGV2ZW50LCBkb250QW5pbWF0ZSkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgaW5kZXhPZmZzZXQsIHNsaWRlT2Zmc2V0LCB1bmV2ZW5PZmZzZXQ7XG5cbiAgICAgICAgICAgIC8vIElmIHRhcmdldCBpcyBhIGxpbmssIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBpZigkdGFyZ2V0LmlzKCdhJykpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0YXJnZXQgaXMgbm90IHRoZSA8bGk+IGVsZW1lbnQgKGllOiBhIGNoaWxkKSwgZmluZCB0aGUgPGxpPi5cbiAgICAgICAgICAgIGlmKCEkdGFyZ2V0LmlzKCdsaScpKSB7XG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICR0YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdW5ldmVuT2Zmc2V0ID0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCk7XG4gICAgICAgICAgICBpbmRleE9mZnNldCA9IHVuZXZlbk9mZnNldCA/IDAgOiAoXy5zbGlkZUNvdW50IC0gXy5jdXJyZW50U2xpZGUpICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEubWVzc2FnZSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgICAgICBzbGlkZU9mZnNldCA9IGluZGV4T2Zmc2V0ID09PSAwID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIGluZGV4T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jdXJyZW50U2xpZGUgLSBzbGlkZU9mZnNldCwgZmFsc2UsIGRvbnRBbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgICAgICBzbGlkZU9mZnNldCA9IGluZGV4T2Zmc2V0ID09PSAwID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogaW5kZXhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSArIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaW5kZXgnOlxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBldmVudC5kYXRhLmluZGV4ID09PSAwID8gMCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4IHx8ICR0YXJnZXQuaW5kZXgoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmNoZWNrTmF2aWdhYmxlKGluZGV4KSwgZmFsc2UsIGRvbnRBbmltYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5jaGlsZHJlbigpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmNoZWNrTmF2aWdhYmxlID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIG5hdmlnYWJsZXMsIHByZXZOYXZpZ2FibGU7XG5cbiAgICAgICAgICAgIG5hdmlnYWJsZXMgPSBfLmdldE5hdmlnYWJsZUluZGV4ZXMoKTtcbiAgICAgICAgICAgIHByZXZOYXZpZ2FibGUgPSAwO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBuYXZpZ2FibGVzW25hdmlnYWJsZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG4gaW4gbmF2aWdhYmxlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBuYXZpZ2FibGVzW25dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHByZXZOYXZpZ2FibGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcmV2TmF2aWdhYmxlID0gbmF2aWdhYmxlc1tuXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyAmJiBfLiRkb3RzICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXG4gICAgICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSlcbiAgICAgICAgICAgICAgICAgICAgLm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKVxuICAgICAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRkb3RzLm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRzbGlkZXIub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyk7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcblxuICAgICAgICAgICAgXy4kbGlzdC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vZmYoXy52aXNpYmlsaXR5Q2hhbmdlLCBfLnZpc2liaWxpdHkpO1xuXG4gICAgICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLiRsaXN0Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ub3JpZW50YXRpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ucmVzaXplKTtcblxuICAgICAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vZmYoJ2RyYWdzdGFydCcsIF8ucHJldmVudERlZmF1bHQpO1xuXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwU2xpZGVFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcbiAgICAgICAgICAgIF8uJGxpc3Qub2ZmKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwUm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsIG9yaWdpbmFsU2xpZGVzO1xuXG4gICAgICAgICAgICBpZihfLm9wdGlvbnMucm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQob3JpZ2luYWxTbGlkZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8uc2hvdWxkQ2xpY2sgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24ocmVmcmVzaCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG5cbiAgICAgICAgICAgIF8uY2xlYW5VcEV2ZW50cygpO1xuXG4gICAgICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5kZXRhY2goKTtcblxuICAgICAgICAgICAgaWYgKF8uJGRvdHMpIHtcbiAgICAgICAgICAgICAgICBfLiRkb3RzLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cubGVuZ3RoICkge1xuXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93XG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXgnKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLnByZXZBcnJvdyApKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3dcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW4nKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCcnKTtcblxuICAgICAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMubmV4dEFycm93ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoXy4kc2xpZGVzKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbicpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLXNsaWNrLWluZGV4JylcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3R5bGUnLCAkKHRoaXMpLmRhdGEoJ29yaWdpbmFsU3R5bGluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgXy4kbGlzdC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlci5hcHBlbmQoXy4kc2xpZGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5jbGVhblVwUm93cygpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xuICAgICAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1pbml0aWFsaXplZCcpO1xuICAgICAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1kb3R0ZWQnKTtcblxuICAgICAgICAgICAgXy51bnNsaWNrZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZighcmVmcmVzaCkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdkZXN0cm95JywgW19dKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uID0ge307XG5cbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnJztcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHRyYW5zaXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5mYWRlU2xpZGUgPSBmdW5jdGlvbihzbGlkZUluZGV4LCBjYWxsYmFjaykge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbihzbGlkZUluZGV4KTtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXhcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuZmFkZVNsaWRlT3V0ID0gZnVuY3Rpb24oc2xpZGVJbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0ZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChmaWx0ZXIgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgICAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmZpbHRlcihmaWx0ZXIpLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuXG4gICAgICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmZvY3VzSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlclxuICAgICAgICAgICAgICAgIC5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMuc2xpY2sgYmx1ci5zbGljaycsICcqJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciAkc2YgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnBhdXNlT25Gb2N1cyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZm9jdXNzZWQgPSAkc2YuaXMoJzpmb2N1cycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LCAwKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmdldEN1cnJlbnQgPSBTbGljay5wcm90b3R5cGUuc2xpY2tDdXJyZW50U2xpZGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIF8uY3VycmVudFNsaWRlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmdldERvdENvdW50ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGJyZWFrUG9pbnQgPSAwO1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgdmFyIHBhZ2VyUXR5ID0gMDtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgKytwYWdlclF0eTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IF8uc2xpZGVDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKytwYWdlclF0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcGFnZXJRdHkgPSBfLnNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIV8ub3B0aW9ucy5hc05hdkZvcikge1xuICAgICAgICAgICAgICAgIHBhZ2VyUXR5ID0gMSArIE1hdGguY2VpbCgoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYWdlclF0eSAtIDE7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQsXG4gICAgICAgICAgICAgICAgdmVydGljYWxIZWlnaHQsXG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwLFxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlLFxuICAgICAgICAgICAgICAgIGNvZWY7XG5cbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xuICAgICAgICAgICAgdmVydGljYWxIZWlnaHQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoXy5zbGlkZVdpZHRoICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgY29lZiA9IC0xXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmID0gLTEuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWYgPSAtMlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKHZlcnRpY2FsSGVpZ2h0ICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgKiBjb2VmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID4gXy5zbGlkZUNvdW50ICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ID4gXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogdmVydGljYWxIZWlnaHQpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID4gXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAtIF8uc2xpZGVDb3VudCkgKiBfLnNsaWRlV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLSBfLnNsaWRlQ291bnQpICogdmVydGljYWxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIC8gMikgLSAoKF8uc2xpZGVXaWR0aCAqIF8uc2xpZGVDb3VudCkgLyAyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCArPSBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKSAtIF8uc2xpZGVXaWR0aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAoKHNsaWRlSW5kZXggKiBfLnNsaWRlV2lkdGgpICogLTEpICsgXy5zbGlkZU9mZnNldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xKSArIHZlcnRpY2FsT2Zmc2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyB8fCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IHx8IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgKz0gKF8uJGxpc3Qud2lkdGgoKSAtIHRhcmdldFNsaWRlLm91dGVyV2lkdGgoKSkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldExlZnQ7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuZ2V0T3B0aW9uID0gU2xpY2sucHJvdG90eXBlLnNsaWNrR2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIF8ub3B0aW9uc1tvcHRpb25dO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmdldE5hdmlnYWJsZUluZGV4ZXMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSAwLFxuICAgICAgICAgICAgICAgIGNvdW50ZXIgPSAwLFxuICAgICAgICAgICAgICAgIGluZGV4ZXMgPSBbXSxcbiAgICAgICAgICAgICAgICBtYXg7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICogLTE7XG4gICAgICAgICAgICAgICAgY291bnRlciA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xuICAgICAgICAgICAgICAgIG1heCA9IF8uc2xpZGVDb3VudCAqIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgbWF4KSB7XG4gICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGJyZWFrUG9pbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaW5kZXhlcztcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGljayA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQsIHN3aXBlZFNsaWRlLCBjZW50ZXJPZmZzZXQ7XG5cbiAgICAgICAgICAgIGNlbnRlck9mZnNldCA9IF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlID8gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMikgOiAwO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLXNsaWRlJykuZWFjaChmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlLm9mZnNldExlZnQgLSBjZW50ZXJPZmZzZXQgKyAoJChzbGlkZSkub3V0ZXJXaWR0aCgpIC8gMikgPiAoXy5zd2lwZUxlZnQgKiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXBlZFNsaWRlID0gc2xpZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNsaWRlc1RyYXZlcnNlZCA9IE1hdGguYWJzKCQoc3dpcGVkU2xpZGUpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSAtIF8uY3VycmVudFNsaWRlKSB8fCAxO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlc1RyYXZlcnNlZDtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmdvVG8gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHb1RvID0gZnVuY3Rpb24oc2xpZGUsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogcGFyc2VJbnQoc2xpZGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZG9udEFuaW1hdGUpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjcmVhdGlvbikge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICghJChfLiRzbGlkZXIpLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG5cbiAgICAgICAgICAgICAgICAkKF8uJHNsaWRlcikuYWRkQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgICAgICAgICBfLmJ1aWxkUm93cygpO1xuICAgICAgICAgICAgICAgIF8uYnVpbGRPdXQoKTtcbiAgICAgICAgICAgICAgICBfLnNldFByb3BzKCk7XG4gICAgICAgICAgICAgICAgXy5zdGFydExvYWQoKTtcbiAgICAgICAgICAgICAgICBfLmxvYWRTbGlkZXIoKTtcbiAgICAgICAgICAgICAgICBfLmluaXRpYWxpemVFdmVudHMoKTtcbiAgICAgICAgICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xuICAgICAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKHRydWUpO1xuICAgICAgICAgICAgICAgIF8uZm9jdXNIYW5kbGVyKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNyZWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2luaXQnLCBbX10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmluaXRBREEoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG5cbiAgICAgICAgICAgICAgICBfLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmluaXRBREEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgbnVtRG90R3JvdXBzID0gTWF0aC5jZWlsKF8uc2xpZGVDb3VudCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLFxuICAgICAgICAgICAgICAgICAgICB0YWJDb250cm9sSW5kZXhlcyA9IF8uZ2V0TmF2aWdhYmxlSW5kZXhlcygpLmZpbHRlcihmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsID49IDApICYmICh2YWwgPCBfLnNsaWRlQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmFkZChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuYXR0cih7XG4gICAgICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICAgIH0pLmZpbmQoJ2EsIGlucHV0LCBidXR0b24sIHNlbGVjdCcpLmF0dHIoe1xuICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlcy5ub3QoXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGVDb250cm9sSW5kZXggPSB0YWJDb250cm9sSW5kZXhlcy5pbmRleE9mKGkpO1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICd0YWJwYW5lbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGksXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAtMVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVDb250cm9sSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmlhQnV0dG9uQ29udHJvbCA9ICdzbGljay1zbGlkZS1jb250cm9sJyArIF8uaW5zdGFuY2VVaWQgKyBzbGlkZUNvbnRyb2xJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnIycgKyBhcmlhQnV0dG9uQ29udHJvbCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FyaWEtZGVzY3JpYmVkYnknOiBhcmlhQnV0dG9uQ29udHJvbFxuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIF8uJGRvdHMuYXR0cigncm9sZScsICd0YWJsaXN0JykuZmluZCgnbGknKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcHBlZFNsaWRlSW5kZXggPSB0YWJDb250cm9sSW5kZXhlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2J1dHRvbicpLmZpcnN0KCkuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICd0YWInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzogJ3NsaWNrLXNsaWRlLWNvbnRyb2wnICsgXy5pbnN0YW5jZVVpZCArIGksXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1jb250cm9scyc6ICdzbGljay1zbGlkZScgKyBfLmluc3RhbmNlVWlkICsgbWFwcGVkU2xpZGVJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcmlhLWxhYmVsJzogKGkgKyAxKSArICcgb2YgJyArIG51bURvdEdyb3VwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KS5lcShfLmN1cnJlbnRTbGlkZSkuZmluZCgnYnV0dG9uJykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ3RydWUnLFxuICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgICAgICAgICB9KS5lbmQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaT1fLmN1cnJlbnRTbGlkZSwgbWF4PWkrXy5vcHRpb25zLnNsaWRlc1RvU2hvdzsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlcy5lcShpKS5hdHRyKHsndGFiaW5kZXgnOiAnMCd9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXMuZXEoaSkucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLmFjdGl2YXRlQURBKCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcbiAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrLnNsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xuICAgICAgICAgICAgICAgICAgIH0sIF8uY2hhbmdlU2xpZGUpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvd1xuICAgICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcbiAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrLnNsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ25leHQnXG4gICAgICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuaW5pdERvdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKS5vbignY2xpY2suc2xpY2snLCB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCdcbiAgICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRkb3RzLm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMucGF1c2VPbkRvdHNIb3ZlciA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXG4gICAgICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKVxuICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuaW5pdFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMucGF1c2VPbkhvdmVyICkge1xuXG4gICAgICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcbiAgICAgICAgICAgICAgICBfLiRsaXN0Lm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLmluaXRBcnJvd0V2ZW50cygpO1xuXG4gICAgICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcbiAgICAgICAgICAgIF8uaW5pdFNsaWRlRXZlbnRzKCk7XG5cbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3N0YXJ0J1xuICAgICAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICAgICAgXy4kbGlzdC5vbigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdtb3ZlJ1xuICAgICAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICAgICAgXy4kbGlzdC5vbigndG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGljaycsIHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdlbmQnXG4gICAgICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcbiAgICAgICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcblxuICAgICAgICAgICAgXy4kbGlzdC5vbignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XG5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKF8udmlzaWJpbGl0eUNoYW5nZSwgJC5wcm94eShfLnZpc2liaWxpdHksIF8pKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCAkLnByb3h5KF8ub3JpZW50YXRpb25DaGFuZ2UsIF8pKTtcblxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5yZXNpemUsIF8pKTtcblxuICAgICAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vbignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XG5cbiAgICAgICAgICAgICQod2luZG93KS5vbignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XG4gICAgICAgICAgICAkKF8uc2V0UG9zaXRpb24pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmluaXRVSSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5zaG93KCk7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnNob3coKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgXy4kZG90cy5zaG93KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5rZXlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICAgICAgIC8vRG9udCBzbGlkZSBpZiB0aGUgY3Vyc29yIGlzIGluc2lkZSB0aGUgZm9ybSBmaWVsZHMgYW5kIGFycm93IGtleXMgYXJlIHByZXNzZWRcbiAgICAgICAgICAgIGlmKCFldmVudC50YXJnZXQudGFnTmFtZS5tYXRjaCgnVEVYVEFSRUF8SU5QVVR8U0VMRUNUJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICduZXh0JyA6ICAncHJldmlvdXMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICdwcmV2aW91cycgOiAnbmV4dCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLmxhenlMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICBsb2FkUmFuZ2UsIGNsb25lUmFuZ2UsIHJhbmdlU3RhcnQsIHJhbmdlRW5kO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlc1Njb3BlKSB7XG5cbiAgICAgICAgICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIGltYWdlc1Njb3BlKS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVNvdXJjZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXp5JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVNyY1NldCA9ICQodGhpcykuYXR0cignZGF0YS1zcmNzZXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlU2l6ZXMgID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNpemVzJykgfHwgXy4kc2xpZGVyLmF0dHIoJ2RhdGEtc2l6ZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIDEwMCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlU3JjU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzcmNzZXQnLCBpbWFnZVNyY1NldCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VTaXplcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzaXplcycsIGltYWdlU2l6ZXMgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgaW1hZ2VTb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDEgfSwgMjAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFtfLCBpbWFnZSwgaW1hZ2VTb3VyY2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoICdzbGljay1sYXp5bG9hZC1lcnJvcicgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkRXJyb3InLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcblxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLnNyYyA9IGltYWdlU291cmNlO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByYW5nZVN0YXJ0ID0gXy5jdXJyZW50U2xpZGUgKyAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSByYW5nZVN0YXJ0ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IE1hdGgubWF4KDAsIF8uY3VycmVudFNsaWRlIC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICByYW5nZUVuZCA9IDIgKyAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKSArIF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IF8ub3B0aW9ucy5pbmZpbml0ZSA/IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBfLmN1cnJlbnRTbGlkZSA6IF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gTWF0aC5jZWlsKHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlU3RhcnQgPiAwKSByYW5nZVN0YXJ0LS07XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZUVuZCA8PSBfLnNsaWRlQ291bnQpIHJhbmdlRW5kKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2FkUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykuc2xpY2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAnYW50aWNpcGF0ZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZTbGlkZSA9IHJhbmdlU3RhcnQgLSAxLFxuICAgICAgICAgICAgICAgICAgICBuZXh0U2xpZGUgPSByYW5nZUVuZCxcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlcyA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZTbGlkZSA8IDApIHByZXZTbGlkZSA9IF8uc2xpZGVDb3VudCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRSYW5nZSA9IGxvYWRSYW5nZS5hZGQoJHNsaWRlcy5lcShwcmV2U2xpZGUpKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJhbmdlID0gbG9hZFJhbmdlLmFkZCgkc2xpZGVzLmVxKG5leHRTbGlkZSkpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2U2xpZGUtLTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFNsaWRlKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGxvYWRSYW5nZSk7XG5cbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJyk7XG4gICAgICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1jbG9uZWQnKS5zbGljZSgwLCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKiAtMSk7XG4gICAgICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5sb2FkU2xpZGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xuXG4gICAgICAgICAgICBfLmluaXRVSSgpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAncHJvZ3Jlc3NpdmUnKSB7XG4gICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUubmV4dCA9IFNsaWNrLnByb3RvdHlwZS5zbGlja05leHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcbiAgICAgICAgICAgIF8uc2V0UG9zaXRpb24oKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5wYXVzZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BhdXNlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XG4gICAgICAgICAgICBfLnBhdXNlZCA9IHRydWU7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUucGxheSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BsYXkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgICAgICBfLm9wdGlvbnMuYXV0b3BsYXkgPSB0cnVlO1xuICAgICAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5wb3N0U2xpZGUgPSBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWZ0ZXJDaGFuZ2UnLCBbXywgaW5kZXhdKTtcblxuICAgICAgICAgICAgICAgIF8uYW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5pbml0QURBKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGN1cnJlbnRTbGlkZSA9ICQoXy4kc2xpZGVzLmdldChfLmN1cnJlbnRTbGlkZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnRTbGlkZS5hdHRyKCd0YWJpbmRleCcsIDApLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5wcmV2ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUHJldiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkID0gZnVuY3Rpb24oIHRyeUNvdW50ICkge1xuXG4gICAgICAgICAgICB0cnlDb3VudCA9IHRyeUNvdW50IHx8IDE7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICAkaW1nc1RvTG9hZCA9ICQoICdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlciApLFxuICAgICAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgICAgIGltYWdlU291cmNlLFxuICAgICAgICAgICAgICAgIGltYWdlU3JjU2V0LFxuICAgICAgICAgICAgICAgIGltYWdlU2l6ZXMsXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQ7XG5cbiAgICAgICAgICAgIGlmICggJGltZ3NUb0xvYWQubGVuZ3RoICkge1xuXG4gICAgICAgICAgICAgICAgaW1hZ2UgPSAkaW1nc1RvTG9hZC5maXJzdCgpO1xuICAgICAgICAgICAgICAgIGltYWdlU291cmNlID0gaW1hZ2UuYXR0cignZGF0YS1sYXp5Jyk7XG4gICAgICAgICAgICAgICAgaW1hZ2VTcmNTZXQgPSBpbWFnZS5hdHRyKCdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgICAgICAgIGltYWdlU2l6ZXMgID0gaW1hZ2UuYXR0cignZGF0YS1zaXplcycpIHx8IF8uJHNsaWRlci5hdHRyKCdkYXRhLXNpemVzJyk7XG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZVNyY1NldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Jjc2V0JywgaW1hZ2VTcmNTZXQgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlU2l6ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc2l6ZXMnLCBpbWFnZVNpemVzICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoICdzcmMnLCBpbWFnZVNvdXJjZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xuICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0cnlDb3VudCA8IDMgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogdHJ5IHRvIGxvYWQgdGhlIGltYWdlIDMgdGltZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBsZWF2ZSBhIHNsaWdodCBkZWxheSBzbyB3ZSBkb24ndCBnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHNlcnZlcnMgYmxvY2tpbmcgdGhlIHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCggdHJ5Q291bnQgKyAxICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDAgKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCAnc2xpY2stbG9hZGluZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3NsaWNrLWxhenlsb2FkLWVycm9yJyApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQuc3JjID0gaW1hZ2VTb3VyY2U7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWxsSW1hZ2VzTG9hZGVkJywgWyBfIF0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCBpbml0aWFsaXppbmcgKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcywgY3VycmVudFNsaWRlLCBsYXN0VmlzaWJsZUluZGV4O1xuXG4gICAgICAgICAgICBsYXN0VmlzaWJsZUluZGV4ID0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcblxuICAgICAgICAgICAgLy8gaW4gbm9uLWluZmluaXRlIHNsaWRlcnMsIHdlIGRvbid0IHdhbnQgdG8gZ28gcGFzdCB0aGVcbiAgICAgICAgICAgIC8vIGxhc3QgdmlzaWJsZSBpbmRleC5cbiAgICAgICAgICAgIGlmKCAhXy5vcHRpb25zLmluZmluaXRlICYmICggXy5jdXJyZW50U2xpZGUgPiBsYXN0VmlzaWJsZUluZGV4ICkpIHtcbiAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGxhc3RWaXNpYmxlSW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGxlc3Mgc2xpZGVzIHRoYW4gdG8gc2hvdywgZ28gdG8gc3RhcnQuXG4gICAgICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcblxuICAgICAgICAgICAgXy5kZXN0cm95KHRydWUpO1xuXG4gICAgICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzLCB7IGN1cnJlbnRTbGlkZTogY3VycmVudFNsaWRlIH0pO1xuXG4gICAgICAgICAgICBfLmluaXQoKTtcblxuICAgICAgICAgICAgaWYoICFpbml0aWFsaXppbmcgKSB7XG5cbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBjdXJyZW50U2xpZGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLCBicmVha3BvaW50LCBjdXJyZW50QnJlYWtwb2ludCwgbCxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlU2V0dGluZ3MgPSBfLm9wdGlvbnMucmVzcG9uc2l2ZSB8fCBudWxsO1xuXG4gICAgICAgICAgICBpZiAoICQudHlwZShyZXNwb25zaXZlU2V0dGluZ3MpID09PSAnYXJyYXknICYmIHJlc3BvbnNpdmVTZXR0aW5ncy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgICAgICBfLnJlc3BvbmRUbyA9IF8ub3B0aW9ucy5yZXNwb25kVG8gfHwgJ3dpbmRvdyc7XG5cbiAgICAgICAgICAgICAgICBmb3IgKCBicmVha3BvaW50IGluIHJlc3BvbnNpdmVTZXR0aW5ncyApIHtcblxuICAgICAgICAgICAgICAgICAgICBsID0gXy5icmVha3BvaW50cy5sZW5ndGgtMTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2l2ZVNldHRpbmdzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50QnJlYWtwb2ludCA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5icmVha3BvaW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJyZWFrcG9pbnRzIGFuZCBjdXQgb3V0IGFueSBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25lcyB3aXRoIHRoZSBzYW1lIGJyZWFrcG9pbnQgbnVtYmVyLCB3ZSBkb24ndCB3YW50IGR1cGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggXy5icmVha3BvaW50c1tsXSAmJiBfLmJyZWFrcG9pbnRzW2xdID09PSBjdXJyZW50QnJlYWtwb2ludCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50cy5zcGxpY2UobCwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnB1c2goY3VycmVudEJyZWFrcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbY3VycmVudEJyZWFrcG9pbnRdID0gcmVzcG9uc2l2ZVNldHRpbmdzW2JyZWFrcG9pbnRdLnNldHRpbmdzO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIF8ub3B0aW9ucy5tb2JpbGVGaXJzdCApID8gYS1iIDogYi1hO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUucmVpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgXy4kc2xpZGVzID1cbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrXG4gICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbihfLm9wdGlvbnMuc2xpZGUpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcblxuICAgICAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAmJiBfLmN1cnJlbnRTbGlkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XG5cbiAgICAgICAgICAgIF8uc2V0UHJvcHMoKTtcbiAgICAgICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xuICAgICAgICAgICAgXy5idWlsZEFycm93cygpO1xuICAgICAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcbiAgICAgICAgICAgIF8uaW5pdEFycm93RXZlbnRzKCk7XG4gICAgICAgICAgICBfLmJ1aWxkRG90cygpO1xuICAgICAgICAgICAgXy51cGRhdGVEb3RzKCk7XG4gICAgICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcbiAgICAgICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XG4gICAgICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZShmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLnNldFNsaWRlQ2xhc3Nlcyh0eXBlb2YgXy5jdXJyZW50U2xpZGUgPT09ICdudW1iZXInID8gXy5jdXJyZW50U2xpZGUgOiAwKTtcblxuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcblxuICAgICAgICAgICAgXy5wYXVzZWQgPSAhXy5vcHRpb25zLmF1dG9wbGF5O1xuICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigncmVJbml0JywgW19dKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgIT09IF8ud2luZG93V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoXy53aW5kb3dEZWxheSk7XG4gICAgICAgICAgICAgICAgXy53aW5kb3dEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfLndpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7IF8uc2V0UG9zaXRpb24oKTsgfVxuICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUucmVtb3ZlU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tSZW1vdmUgPSBmdW5jdGlvbihpbmRleCwgcmVtb3ZlQmVmb3JlLCByZW1vdmVBbGwpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQmVmb3JlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAwIDogXy5zbGlkZUNvdW50IC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAtLWluZGV4IDogaW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPCAxIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+IF8uc2xpZGVDb3VudCAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8udW5sb2FkKCk7XG5cbiAgICAgICAgICAgIGlmIChyZW1vdmVBbGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5lcShpbmRleCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcyA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcblxuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5zZXRDU1MgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9LFxuICAgICAgICAgICAgICAgIHgsIHk7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAtcG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gXy5wb3NpdGlvblByb3AgPT0gJ2xlZnQnID8gTWF0aC5jZWlsKHBvc2l0aW9uKSArICdweCcgOiAnMHB4JztcbiAgICAgICAgICAgIHkgPSBfLnBvc2l0aW9uUHJvcCA9PSAndG9wJyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XG5cbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5wb3NpdGlvblByb3BdID0gcG9zaXRpb247XG5cbiAgICAgICAgICAgIGlmIChfLnRyYW5zZm9ybXNFbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvblByb3BzID0ge307XG4gICAgICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgKyB4ICsgJywgJyArIHkgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAnLCAnICsgeSArICcsIDBweCknO1xuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICgnMHB4ICcgKyBfLm9wdGlvbnMuY2VudGVyUGFkZGluZylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLiRsaXN0LmhlaWdodChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRsaXN0LmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoXy5vcHRpb25zLmNlbnRlclBhZGRpbmcgKyAnIDBweCcpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5saXN0V2lkdGggPSBfLiRsaXN0LndpZHRoKCk7XG4gICAgICAgICAgICBfLmxpc3RIZWlnaHQgPSBfLiRsaXN0LmhlaWdodCgpO1xuXG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlICYmIF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uc2xpZGVXaWR0aCA9IE1hdGguY2VpbChfLmxpc3RXaWR0aCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoTWF0aC5jZWlsKChfLnNsaWRlV2lkdGggKiBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5sZW5ndGgpKSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKDUwMDAgKiBfLnNsaWRlQ291bnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLnNsaWRlV2lkdGggPSBNYXRoLmNlaWwoXy5saXN0V2lkdGgpO1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbCgoXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSkgKiBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5sZW5ndGgpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKHRydWUpIC0gXy4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gZmFsc2UpIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLndpZHRoKF8uc2xpZGVXaWR0aCAtIG9mZnNldCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2V0RmFkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdDtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uc2xpZGVXaWR0aCAqIGluZGV4KSAqIC0xO1xuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IHRhcmdldExlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5jc3Moe1xuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICBfLiRsaXN0LmNzcygnaGVpZ2h0JywgdGFyZ2V0SGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5zZXRPcHRpb24gPVxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhY2NlcHRzIGFyZ3VtZW50cyBpbiBmb3JtYXQgb2Y6XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIC0gZm9yIGNoYW5naW5nIGEgc2luZ2xlIG9wdGlvbidzIHZhbHVlOlxuICAgICAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCBvcHRpb24sIHZhbHVlLCByZWZyZXNoIClcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzZXQgb2YgcmVzcG9uc2l2ZSBvcHRpb25zOlxuICAgICAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCAncmVzcG9uc2l2ZScsIFt7fSwgLi4uXSwgcmVmcmVzaCApXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIC0gZm9yIHVwZGF0aW5nIG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlIChub3QgcmVzcG9uc2l2ZSlcbiAgICAgICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgeyAnb3B0aW9uJzogdmFsdWUsIC4uLiB9LCByZWZyZXNoIClcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsIGwsIGl0ZW0sIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggPSBmYWxzZSwgdHlwZTtcblxuICAgICAgICAgICAgaWYoICQudHlwZSggYXJndW1lbnRzWzBdICkgPT09ICdvYmplY3QnICkge1xuXG4gICAgICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICByZWZyZXNoID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgIHR5cGUgPSAnbXVsdGlwbGUnO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnc3RyaW5nJyApIHtcblxuICAgICAgICAgICAgICAgIG9wdGlvbiA9ICBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICAgICAgICAgIGlmICggYXJndW1lbnRzWzBdID09PSAncmVzcG9uc2l2ZScgJiYgJC50eXBlKCBhcmd1bWVudHNbMV0gKSA9PT0gJ2FycmF5JyApIHtcblxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3Jlc3BvbnNpdmUnO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZ3VtZW50c1sxXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdzaW5nbGUnO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3NpbmdsZScgKSB7XG5cbiAgICAgICAgICAgICAgICBfLm9wdGlvbnNbb3B0aW9uXSA9IHZhbHVlO1xuXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdtdWx0aXBsZScgKSB7XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goIG9wdGlvbiAsIGZ1bmN0aW9uKCBvcHQsIHZhbCApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnNbb3B0XSA9IHZhbDtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdyZXNwb25zaXZlJyApIHtcblxuICAgICAgICAgICAgICAgIGZvciAoIGl0ZW0gaW4gdmFsdWUgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoICQudHlwZSggXy5vcHRpb25zLnJlc3BvbnNpdmUgKSAhPT0gJ2FycmF5JyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUgPSBbIHZhbHVlW2l0ZW1dIF07XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbCA9IF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHJlc3BvbnNpdmUgb2JqZWN0IGFuZCBzcGxpY2Ugb3V0IGR1cGxpY2F0ZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5yZXNwb25zaXZlW2xdLmJyZWFrcG9pbnQgPT09IHZhbHVlW2l0ZW1dLmJyZWFrcG9pbnQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGwsMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLS07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUucHVzaCggdmFsdWVbaXRlbV0gKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCByZWZyZXNoICkge1xuXG4gICAgICAgICAgICAgICAgXy51bmxvYWQoKTtcbiAgICAgICAgICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBfLnNldERpbWVuc2lvbnMoKTtcblxuICAgICAgICAgICAgXy5zZXRIZWlnaHQoKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uc2V0Q1NTKF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLnNldEZhZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3NldFBvc2l0aW9uJywgW19dKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5zZXRQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAgICAgICAgICAgXy5wb3NpdGlvblByb3AgPSBfLm9wdGlvbnMudmVydGljYWwgPT09IHRydWUgPyAndG9wJyA6ICdsZWZ0JztcblxuICAgICAgICAgICAgaWYgKF8ucG9zaXRpb25Qcm9wID09PSAndG9wJykge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stdmVydGljYWwnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay12ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLldlYmtpdFRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgIGJvZHlTdHlsZS5Nb3pUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICBib2R5U3R5bGUubXNUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnVzZUNTUyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmZhZGUgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgXy5vcHRpb25zLnpJbmRleCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMuekluZGV4IDwgMyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSAzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnpJbmRleCA9IF8uZGVmYXVsdHMuekluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5PVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBfLmFuaW1UeXBlID0gJ09UcmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctby10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnT1RyYW5zaXRpb24nO1xuICAgICAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLk1velRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdNb3pUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbW96LXRyYW5zZm9ybSc7XG4gICAgICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdNb3pUcmFuc2l0aW9uJztcbiAgICAgICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUuTW96UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS53ZWJraXRUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnd2Via2l0VHJhbnNmb3JtJztcbiAgICAgICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLXdlYmtpdC10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnd2Via2l0VHJhbnNpdGlvbic7XG4gICAgICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnbXNUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbXMtdHJhbnNmb3JtJztcbiAgICAgICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ21zVHJhbnNpdGlvbic7XG4gICAgICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgXy5hbmltVHlwZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAndHJhbnNpdGlvbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLnRyYW5zZm9ybXNFbmFibGVkID0gXy5vcHRpb25zLnVzZVRyYW5zZm9ybSAmJiAoXy5hbmltVHlwZSAhPT0gbnVsbCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGNlbnRlck9mZnNldCwgYWxsU2xpZGVzLCBpbmRleE9mZnNldCwgcmVtYWluZGVyO1xuXG4gICAgICAgICAgICBhbGxTbGlkZXMgPSBfLiRzbGlkZXJcbiAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stY3VycmVudCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY3VycmVudCcpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBldmVuQ29lZiA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJSAyID09PSAwID8gMSA6IDA7XG5cbiAgICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gY2VudGVyT2Zmc2V0ICYmIGluZGV4IDw9IChfLnNsaWRlQ291bnQgLSAxKSAtIGNlbnRlck9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4IC0gY2VudGVyT2Zmc2V0ICsgZXZlbkNvZWYsIGluZGV4ICsgY2VudGVyT2Zmc2V0ICsgMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhPZmZzZXQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSBjZW50ZXJPZmZzZXQgKyAxICsgZXZlbkNvZWYsIGluZGV4T2Zmc2V0ICsgY2VudGVyT2Zmc2V0ICsgMilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZXEoYWxsU2xpZGVzLmxlbmd0aCAtIDEgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gXy5zbGlkZUNvdW50IC0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZXEoXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIHtcblxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCwgaW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFsbFNsaWRlcy5sZW5ndGggPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4IDogaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICYmIChfLnNsaWRlQ291bnQgLSBpbmRleCkgPCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCAtIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gcmVtYWluZGVyKSwgaW5kZXhPZmZzZXQgKyByZW1haW5kZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCwgaW5kZXhPZmZzZXQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ29uZGVtYW5kJyB8fCBfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdhbnRpY2lwYXRlZCcpIHtcbiAgICAgICAgICAgICAgICBfLmxhenlMb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnNldHVwSW5maW5pdGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGksIHNsaWRlSW5kZXgsIGluZmluaXRlQ291bnQ7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5jZW50ZXJNb2RlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IF8uc2xpZGVDb3VudDsgaSA+IChfLnNsaWRlQ291bnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQpOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXy4kc2xpZGVzW3NsaWRlSW5kZXhdKS5jbG9uZSh0cnVlKS5hdHRyKCdpZCcsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5maW5pdGVDb3VudCAgKyBfLnNsaWRlQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIHNsaWRlSW5kZXggKyBfLnNsaWRlQ291bnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKS5maW5kKCdbaWRdJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignaWQnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oIHRvZ2dsZSApIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiggIXRvZ2dsZSApIHtcbiAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLmludGVycnVwdGVkID0gdG9nZ2xlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnNlbGVjdEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXRFbGVtZW50ID1cbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuaXMoJy5zbGljay1zbGlkZScpID9cbiAgICAgICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpIDpcbiAgICAgICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnBhcmVudHMoJy5zbGljay1zbGlkZScpO1xuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCh0YXJnZXRFbGVtZW50LmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSk7XG5cbiAgICAgICAgICAgIGlmICghaW5kZXgpIGluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihpbmRleCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihpbmRleCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc2xpZGVIYW5kbGVyID0gZnVuY3Rpb24oaW5kZXgsIHN5bmMsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXRTbGlkZSwgYW5pbVNsaWRlLCBvbGRTbGlkZSwgc2xpZGVMZWZ0LCB0YXJnZXRMZWZ0ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBfID0gdGhpcywgbmF2VGFyZ2V0O1xuXG4gICAgICAgICAgICBzeW5jID0gc3luYyB8fCBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlICYmIF8ub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlICYmIF8uY3VycmVudFNsaWRlID09PSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgXy5hc05hdkZvcihpbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldFNsaWRlID0gaW5kZXg7XG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gXy5nZXRMZWZ0KHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgIHNsaWRlTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgICAgIF8uY3VycmVudExlZnQgPSBfLnN3aXBlTGVmdCA9PT0gbnVsbCA/IHNsaWRlTGVmdCA6IF8uc3dpcGVMZWZ0O1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IF8uZ2V0RG90Q291bnQoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZShzbGlkZUxlZnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlIDwgMCkge1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50IC0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50ICsgdGFyZ2V0U2xpZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRTbGlkZSA+PSBfLnNsaWRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gdGFyZ2V0U2xpZGUgLSBfLnNsaWRlQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5hbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYmVmb3JlQ2hhbmdlJywgW18sIF8uY3VycmVudFNsaWRlLCBhbmltU2xpZGVdKTtcblxuICAgICAgICAgICAgb2xkU2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gYW5pbVNsaWRlO1xuXG4gICAgICAgICAgICBfLnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmFzTmF2Rm9yICkge1xuXG4gICAgICAgICAgICAgICAgbmF2VGFyZ2V0ID0gXy5nZXROYXZUYXJnZXQoKTtcbiAgICAgICAgICAgICAgICBuYXZUYXJnZXQgPSBuYXZUYXJnZXQuc2xpY2soJ2dldFNsaWNrJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIG5hdlRhcmdldC5zbGlkZUNvdW50IDw9IG5hdlRhcmdldC5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcbiAgICAgICAgICAgICAgICAgICAgbmF2VGFyZ2V0LnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5mYWRlU2xpZGVPdXQob2xkU2xpZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIF8uZmFkZVNsaWRlKGFuaW1TbGlkZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF8uYW5pbWF0ZUhlaWdodCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZSh0YXJnZXRMZWZ0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS5zdGFydExvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuaGlkZSgpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5oaWRlKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgICAgIF8uJGRvdHMuaGlkZSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stbG9hZGluZycpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciB4RGlzdCwgeURpc3QsIHIsIHN3aXBlQW5nbGUsIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICB4RGlzdCA9IF8udG91Y2hPYmplY3Quc3RhcnRYIC0gXy50b3VjaE9iamVjdC5jdXJYO1xuICAgICAgICAgICAgeURpc3QgPSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSAtIF8udG91Y2hPYmplY3QuY3VyWTtcbiAgICAgICAgICAgIHIgPSBNYXRoLmF0YW4yKHlEaXN0LCB4RGlzdCk7XG5cbiAgICAgICAgICAgIHN3aXBlQW5nbGUgPSBNYXRoLnJvdW5kKHIgKiAxODAgLyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGlmIChzd2lwZUFuZ2xlIDwgMCkge1xuICAgICAgICAgICAgICAgIHN3aXBlQW5nbGUgPSAzNjAgLSBNYXRoLmFicyhzd2lwZUFuZ2xlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChzd2lwZUFuZ2xlIDw9IDQ1KSAmJiAoc3dpcGVBbmdsZSA+PSAwKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoc3dpcGVBbmdsZSA8PSAzNjApICYmIChzd2lwZUFuZ2xlID49IDMxNSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ2xlZnQnIDogJ3JpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMTM1KSAmJiAoc3dpcGVBbmdsZSA8PSAyMjUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdyaWdodCcgOiAnbGVmdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMzUpICYmIChzd2lwZUFuZ2xlIDw9IDEzNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAndmVydGljYWwnO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHNsaWRlQ291bnQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBfLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBfLnN3aXBpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKF8uc2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgXy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uc2hvdWxkQ2xpY2sgPSAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiAxMCApID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuY3VyWCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2VkZ2UnLCBbXywgXy5zd2lwZURpcmVjdGlvbigpIF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPj0gXy50b3VjaE9iamVjdC5taW5Td2lwZSApIHtcblxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAoIGRpcmVjdGlvbiApIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZG93bic6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQ291bnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmNoZWNrTmF2aWdhYmxlKCBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpICkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnREaXJlY3Rpb24gPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY2hlY2tOYXZpZ2FibGUoIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCkgKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG5cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCBkaXJlY3Rpb24gIT0gJ3ZlcnRpY2FsJyApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVDb3VudCApO1xuICAgICAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzd2lwZScsIFtfLCBkaXJlY3Rpb24gXSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3RhcnRYICE9PSBfLnRvdWNoT2JqZWN0LmN1clggKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIF8uY3VycmVudFNsaWRlICk7XG4gICAgICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnN3aXBlSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKChfLm9wdGlvbnMuc3dpcGUgPT09IGZhbHNlKSB8fCAoJ29udG91Y2hlbmQnIGluIGRvY3VtZW50ICYmIF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSBmYWxzZSAmJiBldmVudC50eXBlLmluZGV4T2YoJ21vdXNlJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aCA6IDE7XG5cbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QubWluU3dpcGUgPSBfLmxpc3RXaWR0aCAvIF8ub3B0aW9uc1xuICAgICAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0SGVpZ2h0IC8gXy5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5kYXRhLmFjdGlvbikge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgICAgICBfLnN3aXBlU3RhcnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgICAgICAgICAgICBfLnN3aXBlTW92ZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgXy5zd2lwZUVuZChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUuc3dpcGVNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgICAgIGVkZ2VXYXNIaXQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBjdXJMZWZ0LCBzd2lwZURpcmVjdGlvbiwgc3dpcGVMZW5ndGgsIHBvc2l0aW9uT2Zmc2V0LCB0b3VjaGVzLCB2ZXJ0aWNhbFN3aXBlTGVuZ3RoO1xuXG4gICAgICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkID8gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKCFfLmRyYWdnaW5nIHx8IF8uc2Nyb2xsaW5nIHx8IHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1ckxlZnQgPSBfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpO1xuXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXNbMF0ucGFnZVkgOiBldmVudC5jbGllbnRZO1xuXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJYIC0gXy50b3VjaE9iamVjdC5zdGFydFgsIDIpKSk7XG5cbiAgICAgICAgICAgIHZlcnRpY2FsU3dpcGVMZW5ndGggPSBNYXRoLnJvdW5kKE1hdGguc3FydChcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhfLnRvdWNoT2JqZWN0LmN1clkgLSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSwgMikpKTtcblxuICAgICAgICAgICAgaWYgKCFfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nICYmICFfLnN3aXBpbmcgJiYgdmVydGljYWxTd2lwZUxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgICAgICBfLnNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPSB2ZXJ0aWNhbFN3aXBlTGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2lwZURpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcblxuICAgICAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgICAgIF8uc3dpcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9zaXRpb25PZmZzZXQgPSAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAxIDogLTEpICogKF8udG91Y2hPYmplY3QuY3VyWCA+IF8udG91Y2hPYmplY3Quc3RhcnRYID8gMSA6IC0xKTtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25PZmZzZXQgPSBfLnRvdWNoT2JqZWN0LmN1clkgPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA/IDEgOiAtMTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBzd2lwZUxlbmd0aCA9IF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGg7XG5cbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmICgoXy5jdXJyZW50U2xpZGUgPT09IDAgJiYgc3dpcGVEaXJlY3Rpb24gPT09ICdyaWdodCcpIHx8IChfLmN1cnJlbnRTbGlkZSA+PSBfLmdldERvdENvdW50KCkgJiYgc3dpcGVEaXJlY3Rpb24gPT09ICdsZWZ0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoICogXy5vcHRpb25zLmVkZ2VGcmljdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdC5lZGdlSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgKHN3aXBlTGVuZ3RoICogKF8uJGxpc3QuaGVpZ2h0KCkgLyBfLmxpc3RXaWR0aCkpICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMudG91Y2hNb3ZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5zZXRDU1MoXy5zd2lwZUxlZnQpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnN3aXBlU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgdG91Y2hlcztcblxuICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ICE9PSAxIHx8IF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRvdWNoZXMgPSBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8udG91Y2hPYmplY3Quc3RhcnRYID0gXy50b3VjaE9iamVjdC5jdXJYID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlcy5wYWdlWCA6IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA9IF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXMucGFnZVkgOiBldmVudC5jbGllbnRZO1xuXG4gICAgICAgICAgICBfLmRyYWdnaW5nID0gdHJ1ZTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKF8uJHNsaWRlc0NhY2hlICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICBfLnVubG9hZCgpO1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG5cbiAgICAgICAgICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUudW5sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChfLiRkb3RzKSB7XG4gICAgICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uJHByZXZBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLiRuZXh0QXJyb3cgJiYgXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5uZXh0QXJyb3cpKSB7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgICAgICAgICAgICAuY3NzKCd3aWR0aCcsICcnKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIFNsaWNrLnByb3RvdHlwZS51bnNsaWNrID0gZnVuY3Rpb24oZnJvbUJyZWFrcG9pbnQpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3Vuc2xpY2snLCBbXywgZnJvbUJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgIF8uZGVzdHJveSgpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZUFycm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0O1xuXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAmJlxuICAgICAgICAgICAgICAgICFfLm9wdGlvbnMuaW5maW5pdGUgKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSAxICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBTbGljay5wcm90b3R5cGUudXBkYXRlRG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRkb3RzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW5kKCk7XG5cbiAgICAgICAgICAgICAgICBfLiRkb3RzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdsaScpXG4gICAgICAgICAgICAgICAgICAgIC5lcShNYXRoLmZsb29yKF8uY3VycmVudFNsaWRlIC8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgU2xpY2sucHJvdG90eXBlLnZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggZG9jdW1lbnRbXy5oaWRkZW5dICkge1xuXG4gICAgICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgICQuZm4uc2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICAgICBvcHQgPSBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgICAgICAgICAgbCA9IF8ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgcmV0O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBvcHQgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgICAgIF9baV0uc2xpY2sgPSBuZXcgU2xpY2soX1tpXSwgb3B0KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IF9baV0uc2xpY2tbb3B0XS5hcHBseShfW2ldLnNsaWNrLCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCAhPSAndW5kZWZpbmVkJykgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfO1xuICAgICAgICB9O1xuXG4gICAgfSkpO1xuXHJcbiAgICB3aW5kb3cub25sb2FkPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IFBlcnNvbnM9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZWFtX3BlcnNvbnNfcGhvdG8nKTtcclxuICAgICAgICBQZXJzb25zLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGVyc29ucy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGg9JzEzJSc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudD1lbGVtZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQuc3R5bGUud2lkdGg9XCIxOCVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTYlXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNiVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLm5leHRFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE0JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNCVcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50X2l0ZW1cIikubm90KFwiOmZpcnN0XCIpLmhpZGUoKTtcclxuICAgICQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnQgLm1vZGFsX2J1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIFx0JChcIi5tb2RhbF9kaWFsb2dfY29udGVudCAubW9kYWxfYnV0dG9uXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmVxKCQodGhpcykuaW5kZXgoKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBcdCQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnRfaXRlbVwiKS5oaWRlKCkuZXEoJCh0aGlzKS5pbmRleCgpKS5mYWRlSW4oKVxyXG4gICAgfSkuZXEoMCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjb25zdCBtb2RhbENhbGwgPSAkKFwiW2RhdGEtbW9kYWxdXCIpO1xyXG4gICAgY29uc3QgbW9kYWxDbG9zZSA9ICQoXCJbZGF0YS1jbG9zZV1cIik7XHJcblxyXG4gICAgbW9kYWxDYWxsLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGxldCBtb2RhbElkID0gJHRoaXMuZGF0YSgnbW9kYWwnKTtcclxuXHJcbiAgICAgICAgJChtb2RhbElkKS5hZGRDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKCduby1zY3JvbGwnKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKG1vZGFsSWQpLmZpbmQoXCIubW9kYWxfZGlhbG9nXCIpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMSlcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCAyMDApO1xyXG5cclxuICAgIFxyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBtb2RhbENsb3NlLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGxldCBtb2RhbFBhcmVudCA9ICR0aGlzLnBhcmVudHMoJy5tb2RhbCcpO1xyXG5cclxuICAgICAgICBtb2RhbFBhcmVudC5maW5kKFwiLm1vZGFsX2RpYWxvZ1wiKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtb2RhbFBhcmVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLm1vZGFsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAkdGhpcy5maW5kKFwiLm1vZGFsX2RpYWxvZ1wiKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuIFxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5tb2RhbF9kaWFsb2dcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgZG9jPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29udHInKTtcclxuICAgIGRvYy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBkb2MuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGg9JzIyM3B4JztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudD1lbGVtZW50LnRhcmdldDtcclxuICAgICAgICAgICAgY3VycmVudC5zdHlsZS53aWR0aD1cIjI4NHB4XCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy8g0L7RgtC80LXQvdGP0LXQvCDRgdGC0LDQvdC00LDRgNGC0L3QvtC1INC00LXQudGB0YLQstC40LVcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHNjID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuICAgICAgICAgICAgZG4gPSAkKHNjKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgLypcclxuICAgICAgICAqIHNjIC0g0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0LfQsNC90L7RgdC40Lwg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YLQvtC8LCDQuiDQutCw0LrQvtC80YMg0LHQu9C+0LrRgyDQvdCw0LTQviDQv9C10YDQtdC50YLQuFxyXG4gICAgICAgICogZG4gLSDQvtC/0YDQtdC00LXQu9GP0LXQvCDQv9C+0LvQvtC20LXQvdC40LUg0LHQu9C+0LrQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LVcclxuICAgICAgICAqL1xyXG4gICAgXHJcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogZG59LCAxMDAwKTtcclxuICAgIFxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiAxMDAwINGB0LrQvtGA0L7RgdGC0Ywg0L/QtdGA0LXRhdC+0LTQsCDQsiDQvNC40LvQu9C40YHQtdC60YPQvdC00LDRhVxyXG4gICAgICAgICovXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5Ob2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXNlc19jb250ZW50X2l0ZW0nKTtcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+IE5vZGVzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkpIHtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2Nyb2xsJyArIHdpbmRvdy5zY3JvbGxZKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb3VudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgTm9kZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVzW2ldLnNjcm9sbEludG9WaWV3KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgIC8vICQoXCIuY2FzZXNfc2lkZWJhcl9saXN0X2l0ZW1cIikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgLy8gICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vICAgICAkKFwiLmNhc2VzX3NpZGViYXJfbGlzdF9pdGVtXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIC8vICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLyogU2xpZGVyICovXHJcbiAgICAkKCcjbW9iX2FwcCcpLnNsaWNrKHtcclxuICAgICAgICAvL2luZmluaXRlOiB0cnVlLCAvL9Cx0LXRgdC6INC/0YDQvtC60YBcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuXHJcblxyXG4gICAgICAgIC8vIGZhZGU6IHRydWUsXHJcbiAgICAgICAgLy8gYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgIC8vIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICAgICAgLy8gY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICAvLyByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIGJyZWFrcG9pbnQ6IDc2NyxcclxuICAgICAgICAvLyAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyBdXHJcbiAgICB9KTtcclxuICAgICQoXCIuc2xpY2tQcmV2XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkKCcjbW9iX2FwcCcpLnNsaWNrKFwic2xpY2tQcmV2XCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5zbGlja05leHRcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICQoJyNtb2JfYXBwJykuc2xpY2soXCJzbGlja05leHRcIik7XHJcbiAgICB9KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgJCgnI2FncmVnYXRvcicpLnNsaWNrKHtcclxuICAgICAgICAvL2luZmluaXRlOiB0cnVlLCAvL9Cx0LXRgdC6INC/0YDQvtC60YBcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuQWdyc2xpY2tQcmV2XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkKCcjYWdyZWdhdG9yJykuc2xpY2soXCJzbGlja1ByZXZcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLkFncnNsaWNrTmV4dFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgJCgnI2FncmVnYXRvcicpLnNsaWNrKFwic2xpY2tOZXh0XCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAkKCcjYWdyZWdhdG9yMicpLnNsaWNrKHtcclxuICAgICAgICAvL2luZmluaXRlOiB0cnVlLCAvL9Cx0LXRgdC6INC/0YDQvtC60YBcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuQWdyMnNsaWNrUHJldlwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgJCgnI2FncmVnYXRvcjInKS5zbGljayhcInNsaWNrUHJldlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuQWdyMnNsaWNrTmV4dFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgJCgnI2FncmVnYXRvcjInKS5zbGljayhcInNsaWNrTmV4dFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgJCgnI2FncmVnYXRvcjMnKS5zbGljayh7XHJcbiAgICAgICAgLy9pbmZpbml0ZTogdHJ1ZSwgLy/QsdC10YHQuiDQv9GA0L7QutGAXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLkFncjNzbGlja1ByZXZcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICQoJyNhZ3JlZ2F0b3IzJykuc2xpY2soXCJzbGlja1ByZXZcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLkFncjNzbGlja05leHRcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICQoJyNhZ3JlZ2F0b3IzJykuc2xpY2soXCJzbGlja05leHRcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICQoJy5pbnRyb19jYXNlc19zbGlkZXJfYmxvY2snKS5zbGljayh7XHJcblxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLCAvL9Cx0LXRgdC6INC/0YDQvtC60YBcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICBkb3RzOiB0cnVlLFxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuICAgICQoJyNwYXJ0bmVycycpLnNsaWNrKHtcclxuICAgICAgICAvL2luZmluaXRlOiB0cnVlLCAvL9Cx0LXRgdC6INC/0YDQvtC60YBcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDUsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJChcIi5pbnRyb19jYXNlc1wiKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJChcIiNvcFwiKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8vICQoXCIuaW50cm9faXRlbXNcIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIC8vICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAvLyAkKFwiLmludHJvX2l0ZW1zXCIpLmFkZENsYXNzKCdkaXNwbGF5X25vbmUnKTtcclxuICAgICAgICAkKFwiLmludHJvX2l0ZW1zXCIpLmhpZGUoKTtcclxuICAgICAgICAkKFwiLmludHJvX2Nhc2VzXCIpLnNob3coJ3NwZWVkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgLy8gXHQkKFwiI29wXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBcdFx0JChcIi5pbnRyb19pdGVtc1wiKS50b2dnbGVDbGFzcyhcImRpc3BsYXlfbm9uZVwiKTsgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gXHR9KTtcclxuICAgIC8vIH0pO1xyXG5cclxuXHJcbiAgICAvLyAkKFwiI2J0bi1kcm9wXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICAgIGlmIChmbGFnWydkcm9wJ10gPSAhZmxhZ1snZHJvcCddKSB7XHJcbiAgICAvLyAgICAgICAgICQoXCIjdGVzdC1kcm9wXCIpLmhpZGUoXCJkcm9wXCIsIHsgZGlyZWN0aW9uOiBcInJpZ2h0XCIgfSwgMTAwMCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkKFwiI3Rlc3QtZHJvcFwiKS5zaG93KFwiZHJvcFwiLCB7IGRpcmVjdGlvbjogXCJkb3duXCIgfSwgNTAwKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9KTtcclxuICAgIC8qKlxyXG4gICAgICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdGL0Lkg0YXQtdC00LXRgFxyXG4gICAgICovXHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0b2dnbGVGaXhlZEhlYWRlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRml4ZWRIZWFkZXIoKSB7XHJcbiAgICAgICAgY29uc3QgJGhlYWRlciA9ICQoJy5oZWFkZXInKTtcclxuICAgICAgICBjb25zdCAkbWFpbiA9ICQoJy5oZWFkZXInKS5uZXh0KCk7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogJGhlYWRlci5vdXRlckhlaWdodCgpIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogMCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuO1xyXG5cclxufSk7XHJcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==

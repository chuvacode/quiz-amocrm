(function( $ ) {
  'use strict';

  $(document).ready(function () {
    let currentState = 1;

    // Формы
    let QA_POPUP_EXTENDED = $(".quiz-amocrm--extended");

    // Кнопки перехода
    let btnNext = QA_POPUP_EXTENDED.find(".quiz-amocrm__next");
    let btnBack = QA_POPUP_EXTENDED.find(".quiz-amocrm__back");

    // Обработка нажатия по кнопке вперед
    btnNext.on("click", function () {
      if ($(this).hasClass("quiz-amocrm__btn--disabled")) return;
      currentState++;
      handlerState(currentState);
    });

    // Обработка нажатия по кнопке назад
    btnBack.on("click", function () {
      if ($(this).hasClass("quiz-amocrm__btn--disabled")) return;
      if (currentState - 1 < 1) return;
      currentState--;
      handlerState(currentState);
    });

    // Логика работы селекторов для выбора черновых работ
    QA_POPUP_EXTENDED.find(".answer-variants > .variant-select").on("click", function () {

      let currentVariants = $(this).closest(".answer-variants");
      let isToggle = $(this).closest(".answer-variants").hasClass("answer-variants--toggle");

      if (isToggle) {
        currentVariants.find(".variant-select").removeClass("variant-select--active");
      }

      $(this).toggleClass("variant-select--active");

      // Разблокируем кнопку далее, если больше 0
      if (currentVariants.find(".variant-select--active").length > 0) {
        btnNext.removeClass("quiz-amocrm__btn--disabled");
      } else {
        btnNext.addClass("quiz-amocrm__btn--disabled");
      }
    });

    // Валидация
    QA_POPUP_EXTENDED.find(".quiz-amocrm__input").on("input", function () {
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state--active").find("input").val().trim() !== "") {
        btnNext.removeClass("quiz-amocrm__btn--disabled");
      } else {
        btnNext.addClass("quiz-amocrm__btn--disabled");
      }
    });

    // Прогресс Бар
    let progressBar = QA_POPUP_EXTENDED.find(".progress-bar__field");
    let progressBarLine = QA_POPUP_EXTENDED.find(".progress-bar__field > span");
    let progressBarPercent = QA_POPUP_EXTENDED.find(".progress-bar__percent");
    let progressBarText = QA_POPUP_EXTENDED.find(".progress-bar__percent-text");

    // Изменение положение прогрессбара
    function changeProgressBar(percent) {
      progressBarText.html( percent + "%");
      progressBarLine.css("width", percent + "%");
      progressBarPercent.css("left", percent + "%");
    }

    let sending = false;

    function calc_form() {
      let price = 0;
      let m = parseFloat(QA_POPUP_EXTENDED.find("input[name=ceiling_height]").val().trim());
      let m2 = parseFloat(QA_POPUP_EXTENDED.find("input[name=floor_area]").val().trim());

      // Штукатурные работы
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(1)").hasClass("variant-select--active")) {

        // Определяем коэффициент
        let ratio;
        switch (true) {
          case m2 >= 0 && m2 < 25:
            ratio = 1.5;
            break;
          case m2 >= 25 && m2 < 30:
            ratio = 1.45;
            break;
          case m2 >= 30 && m2 < 35:
            ratio = 1.4;
            break;
          case m2 >= 35 && m2 < 40:
            ratio = 1.35;
            break;
          case m2 >= 40 && m2 < 45:
            ratio = 1.3;
            break;
          case m2 >= 45 && m2 < 50:
            ratio = 1.25;
            break;
          case m2 >= 50 && m2 < 55:
            ratio = 1.2;
            break;
          case m2 >= 55 && m2 < 60:
            ratio = 1.15;
            break;
          case m2 >= 60:
            ratio = 1.1;
            break;
        }

        price += m2 * m * ratio * 250;
      }

      // Электромонтажные работы
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(2)").hasClass("variant-select--active")) {
        price += m2 * 1700;
      }

      // Трасса под сплит-систему
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(3)").hasClass("variant-select--active")) {
        price += 8000;
      }

      // Стяжка пола
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(4)").hasClass("variant-select--active")) {
        price += m2 * 310;
      }

      // Сантехнические работы
      if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(5)").hasClass("variant-select--active")) {
        price += 15 * 735;
      }

      let f = new Intl.NumberFormat("ru", {style: "decimal"});

      if (m2 === 0 || isNaN(m2) || m === 0 || isNaN(m)) {
        QA_POPUP_EXTENDED.find(".quiz-amocrm-form__btn-submit[data-type='pre-submit']").hide();
        $(QA_POPUP_EXTENDED.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(0);
        $(QA_POPUP_EXTENDED.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(0);
        return;
      }

      QA_POPUP_EXTENDED.find(".quiz-amocrm-form__btn-submit[data-type='pre-submit']").show();

      $(QA_POPUP_EXTENDED.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(f.format(Math.round(price)));
      $(QA_POPUP_EXTENDED.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(f.format(Math.round(price / m2)));
    }

    // Динамическое обновление расчета
    QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state='2'] .quiz-amocrm__input").on("input", calc_form);

    // Обработка состояний формы
    function handlerState(state) {
      QA_POPUP_EXTENDED.find(".quiz-amocrm__state--active").removeClass("quiz-amocrm__state--active");
      QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=" + state + "]").addClass("quiz-amocrm__state--active");
      btnNext.show();

      switch (state) {
        case 1:
          changeProgressBar(0);
          if (QA_POPUP_EXTENDED.find(".quiz-amocrm__state--active").find(".variant-select--active").length > 0) {
            btnNext.removeClass("quiz-amocrm__btn--disabled");
          } else {
            btnNext.addClass("quiz-amocrm__btn--disabled");
          }
          btnBack.addClass("quiz-amocrm__btn--disabled");
          break;
        case 2:
          changeProgressBar(50);
          btnNext.hide();
          calc_form();
          btnBack.removeClass("quiz-amocrm__btn--disabled");
          break;
        case 3:
          changeProgressBar(75);
          btnNext.hide();
          btnBack.removeClass("quiz-amocrm__btn--disabled");
          break;
      }
    }

    // Открытие попапа с формой
    $(".popup-quiz-btn-extended ").on("click", function () {
      currentState = 1;
      handlerState(currentState);
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 10)
    });

    // Обработка формы отправки данных
    let agreement = QA_POPUP_EXTENDED.find('.quiz-amocrm-form__agreement');

    QA_POPUP_EXTENDED.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });

    QA_POPUP_EXTENDED.find('.quiz-amocrm-form__input').on("input", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    QA_POPUP_EXTENDED.find("#qa-f-phone-extended").on("change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    QA_POPUP_EXTENDED.find(".quiz-amocrm-form__btn-submit[data-type=pre-submit]").on("click", function () {
      currentState++;
      handlerState(3);
    });

    QA_POPUP_EXTENDED.find(".quiz-amocrm-form__btn-submit[data-type=submit]").on("click", function () {
      let field_firstname = QA_POPUP_EXTENDED.find("#qa-f-firstname-extended");
      let field_phone = QA_POPUP_EXTENDED.find("#qa-f-phone-extended");
      let firstname = field_firstname.val().trim();
      let phone = field_phone.val().trim();

      let err = 0;

      if (firstname === "") {
        field_firstname.closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }
      if (phone === "") {
        field_phone.closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }

      if (!QA_POPUP_EXTENDED.find(".quiz-amocrm-form__agreement").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending) {
        sending = true;

        // Собираем данные из квиза
        let state1 = [];
        QA_POPUP_EXTENDED.find(".quiz-amocrm__state[data-state=1]").find(".variant-select--active").each((index, item) => {
          state1.push($(item).find(".variant-select__text").html());
        });

        let state2 = [];
        state2.push(QA_POPUP_EXTENDED.find("input[name=ceiling_height]").val().trim());

        let state3 = [];
        state3.push(QA_POPUP_EXTENDED.find("input[name=floor_area]").val().trim());

        let data = {
          "quiz": [
            {
              "title":"Выберите виды работ, которые необходимы:",
              "value": state1
            },
            {
              "title":"Укажите высоту до потолка Вашего объекта, м:",
              "value": state2
            },
            {
              "title":"Укажите площадь по полу Вашего объекта, м2:",
              "value": state3
            }
          ],
          "firstname": firstname,
          "phone": phone,
          "action": "send_form_quiz_amacrm",
          "_nonce": window.wp_ajax["_nonce"]
        };

        $.ajax({
          url: window.wp_ajax["ajax_url"],
          method: "post",
          data: data,
          beforeSend() {
            QA_POPUP_EXTENDED.find('.quiz-amocrm__states').css("position", "absolute");
            QA_POPUP_EXTENDED.find('.quiz-amocrm__states').css("height", "100%");
            QA_POPUP_EXTENDED.find(".quiz-amocrm__nav").hide();
            handlerState(9);
          },
          success(data) {
            if (data['success']) {
              handlerState(7);
              QA_POPUP_EXTENDED.find(".quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              handlerState(8);
            }
          }
        })
      }

    });
  });

})( jQuery );

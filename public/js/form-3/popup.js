(function ($) {
  'use strict';

  $(document).ready(function () {
    // Первоначальное состояние
    let currentState = 1;

    // Формы
    let QA_POPUP = $(".quiz-amocrm--V3");

    // Кнопки перехода
    let btnNext = QA_POPUP.find(".quiz-amocrm__next");
    let btnBack = QA_POPUP.find(".quiz-amocrm__back");

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
    QA_POPUP.find(".answer-variants > .variant-select").on("click", function () {

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

    // Прогресс Бар
    let progressBar = QA_POPUP.find(".progress-bar__field");
    let progressBarLine = QA_POPUP.find(".progress-bar__field > span");
    let progressBarPercent = QA_POPUP.find(".progress-bar__percent");
    let progressBarText = QA_POPUP.find(".progress-bar__percent-text");

    // Изменение положение прогрессбара
    function changeProgressBar(percent) {
      progressBarText.html(percent + "%");
      progressBarLine.css("width", percent + "%");
      progressBarPercent.css("left", percent + "%");
    }

    let sending = false;

    // Предварительный расчет
    function calc_form() {
      // Буфер
      let buffer = 0;

      // Расчетная стоимость черновых работ
      let rough_work = 0;

      // Общая стоимость работ
      let price = 0;

      // Высота потолка
      let ceiling_height = parseFloat(QA_POPUP.find("input[name=ceiling_height]").val().trim());

      // Площадь по полу
      let square = parseFloat(QA_POPUP.find("input[name=floor_area]").val().trim());

      // Штукатурные работы
      let ratio_plaster = 0; // Кооэфициент штукатурных работ
      if (QA_POPUP.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(1)").hasClass("variant-select--active")) {
        // Определяем коэффициент
        switch (true) {
          case square >= 0 && square < 25:
            ratio_plaster = 1.5;
            break;
          case square >= 25 && square < 30:
            ratio_plaster = 1.45;
            break;
          case square >= 30 && square < 35:
            ratio_plaster = 1.4;
            break;
          case square >= 35 && square < 40:
            ratio_plaster = 1.35;
            break;
          case square >= 40 && square < 45:
            ratio_plaster = 1.3;
            break;
          case square >= 45 && square < 50:
            ratio_plaster = 1.25;
            break;
          case square >= 50 && square < 55:
            ratio_plaster = 1.2;
            break;
          case square >= 55 && square < 60:
            ratio_plaster = 1.15;
            break;
          case square >= 60:
            ratio_plaster = 1.1;
            break;
        }

        buffer = square * ceiling_height * ratio_plaster * 350;
        rough_work += buffer;
      }

      // Электромонтажные работы
      if (QA_POPUP.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(2)").hasClass("variant-select--active")) {
        buffer = square * 1000;
        rough_work += buffer;
      }

      // Трасса под сплит-систему
      let ratio_split = 0;
      if (QA_POPUP.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(3)").hasClass("variant-select--active")) {

        // Определяем коэффициент
        switch (true) {
          case square >= 0 && square < 25:
            ratio_split = 1;
            break;
          case square >= 25 && square < 30:
            ratio_split = 1;
            break;
          case square >= 30 && square < 35:
            ratio_split = 1;
            break;
          case square >= 35 && square < 40:
            ratio_split = 1;
            break;
          case square >= 40 && square < 45:
            ratio_split = 1;
            break;
          case square >= 45 && square < 50:
            ratio_split = 2;
            break;
          case square >= 50 && square < 55:
            ratio_split = 2;
            break;
          case square >= 55 && square < 60:
            ratio_split = 2;
            break;
          case square >= 60 && square < 65:
            ratio_split = 2;
            break;
          case square >= 65 && square < 70:
            ratio_split = 3;
            break;
          case square >= 70:
            ratio_split = 3;
            break;
        }

        buffer = ratio_split * 8000;
        rough_work += buffer;
      }

      // Стяжка пола
      if (QA_POPUP.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(4)").hasClass("variant-select--active")) {
        buffer = square * 350;
        rough_work += buffer;
      }

      // Сантехнические работы
      if (QA_POPUP.find(".quiz-amocrm__state[data-state=1] .variant-select:nth-child(5)").hasClass("variant-select--active")) {
        buffer = 15 * 750;
        rough_work += buffer;
      }

      price += rough_work;

      // Первый санузел
      let floor_bathroom_1 = parseFloat(QA_POPUP.find("input[name=floor_bathroom_1]").val().trim());
      floor_bathroom_1 = isNaN(floor_bathroom_1) || floor_bathroom_1 < 0 ? 0 : floor_bathroom_1;
      if (floor_bathroom_1 !== 0) {
        buffer = floor_bathroom_1 * 7 * 850 + 16000;
        price += buffer;
      }

      // Второй санузел
      let floor_bathroom_2 = parseFloat(QA_POPUP.find("input[name=floor_bathroom_2]").val().trim());
      floor_bathroom_2 = isNaN(floor_bathroom_2) || floor_bathroom_2 < 0 ? 0 : floor_bathroom_2;
      if (floor_bathroom_1 !== 0) {
        if (floor_bathroom_2 !== 0) {
          buffer = floor_bathroom_2 * 7 * 850 + 3000;
          price += buffer;
        }
        QA_POPUP.find("input[name=floor_bathroom_2]").removeAttr("disabled");
      } else {
        QA_POPUP.find("input[name=floor_bathroom_2]").attr("disabled", "disabled");
      }

      // Отделка комнат
      let layout = parseInt(QA_POPUP.find("select[name=layout]").val());
      if (layout !== 0) {
        // Комнаты (Двери)
        let price_doors = layout * 3000;
        price += price_doors;

        // Комнаты (Стены + Пол)
        let square_without_bathroom = square - floor_bathroom_1 - floor_bathroom_2;
        buffer = square_without_bathroom * ceiling_height * ratio_plaster * 550;
        price += buffer;

        // Комнаты (Потолок)
        buffer = square * 700;
        price += buffer;
      }

      let f = new Intl.NumberFormat("ru", {style: "decimal"});

      let state_2 = QA_POPUP.find(".quiz-amocrm__state[data-state=2]");
      let state_3 = QA_POPUP.find(".quiz-amocrm__state[data-state=3]");

      if (square === 0 || isNaN(square) || ceiling_height === 0 || isNaN(ceiling_height)) {

        $(state_2.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(0);
        $(state_2.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(0);
        btnNext.addClass("quiz-amocrm__btn--disabled");

        $(state_3.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(0);
        $(state_3.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(0);
        QA_POPUP.find(".quiz-amocrm-form__btn-submit[data-type='pre-submit']").hide();
        return;

      } else {
        $(state_3.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(f.format(Math.round(price)));
        $(state_3.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(f.format(Math.round(price / square)));
        QA_POPUP.find(".quiz-amocrm-form__btn-submit[data-type='pre-submit']").show();
      }

      btnNext.removeClass("quiz-amocrm__btn--disabled");

      $(state_2.find(".quiz-amocrm-form__price")[0]).find("span:nth-child(1)").html(f.format(Math.round(rough_work)));
      $(state_2.find(".quiz-amocrm-form__price")[1]).find("span:nth-child(1)").html(f.format(Math.round(rough_work / square)));

    }

    // Динамическое обновление расчета
    QA_POPUP.find(".quiz-amocrm__state[data-state='2'] .quiz-amocrm__input").on("input", calc_form);
    QA_POPUP.find(".quiz-amocrm__state[data-state='3'] .quiz-amocrm__input").on("input", calc_form);
    QA_POPUP.find(".quiz-amocrm__state[data-state='3'] .quiz-amocrm__select").on("change", calc_form);

    // Обработка состояний формы
    function handlerState(state) {
      QA_POPUP.find(".quiz-amocrm__state--active").removeClass("quiz-amocrm__state--active");
      QA_POPUP.find(".quiz-amocrm__state[data-state=" + state + "]").addClass("quiz-amocrm__state--active");
      btnNext.show();

      switch (state) {
        case 1:
          changeProgressBar(0);
          if (QA_POPUP.find(".quiz-amocrm__state--active").find(".variant-select--active").length > 0) {
            btnNext.removeClass("quiz-amocrm__btn--disabled");
          } else {
            btnNext.addClass("quiz-amocrm__btn--disabled");
          }
          btnNext.removeClass("quiz-amocrm__btn--disabled");
          btnBack.addClass("quiz-amocrm__btn--disabled");
          break;
        case 2:
          changeProgressBar(25);
          calc_form();
          btnBack.removeClass("quiz-amocrm__btn--disabled");
          break;
        case 3:
          changeProgressBar(50);
          btnNext.hide();
          btnBack.removeClass("quiz-amocrm__btn--disabled");
          break;
        case 4:
          changeProgressBar(75);
          btnNext.hide();
          btnBack.removeClass("quiz-amocrm__btn--disabled");
          break;
      }
    }

    // Открытие попапа с формой
    $(".popup-quiz-btn-v3").on("click", function () {
      currentState = 1;
      handlerState(currentState);
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 10)
    });

    // Обработка формы отправки данных
    let agreement = QA_POPUP.find('.quiz-amocrm-form__agreement');

    QA_POPUP.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });

    QA_POPUP.find('.quiz-amocrm-form__input').on("input", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    QA_POPUP.find("#qa-f-phone-extended").on("change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    QA_POPUP.find(".quiz-amocrm-form__btn-submit[data-type=pre-submit]").on("click", function () {
      currentState++;
      handlerState(4);
    });

    QA_POPUP.find(".quiz-amocrm-form__btn-submit[data-type=submit]").on("click", function () {
      let field_firstname = QA_POPUP.find("#qa-f-firstname-extended");
      let field_phone = QA_POPUP.find("#qa-f-phone-extended");
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

      if (!QA_POPUP.find(".quiz-amocrm-form__agreement").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending) {
        sending = true;

        // Собираем данные из квиза
        let works = [];
        QA_POPUP.find(".quiz-amocrm__state[data-state=1]").find(".variant-select--active").each((index, item) => {
          works.push($(item).find(".variant-select__text").html());
        });

        let celling_height = [];
        celling_height.push(QA_POPUP.find("input[name=ceiling_height]").val().trim());

        let floor_area = [];
        floor_area.push(QA_POPUP.find("input[name=floor_area]").val().trim());

        let bathroom_1 = [];
        bathroom_1.push(QA_POPUP.find("input[name=floor_bathroom_1]").val().trim());

        let bathroom_2 = [];
        bathroom_2.push(QA_POPUP.find("input[name=floor_bathroom_2]").val().trim());

        let layout = [];
        layout.push(QA_POPUP.find("select[name=layout] option:selected").text());

        let data = {
          "quiz": [
            {
              "title": "Выберите виды работ, которые необходимы:",
              "value": works
            },
            {
              "title": "Укажите высоту до потолка Вашего объекта, м:",
              "value": celling_height
            },
            {
              "title": "Укажите площадь по полу Вашего объекта, м2:",
              "value": floor_area
            },
            {
              "title": "Укажите площадь с/у 1:",
              "value": bathroom_1
            },
            {
              "title": "Укажите площадь с/у 2 (если есть):",
              "value": bathroom_2
            },
            {
              "title": "Укажите планировку вашего объекта:",
              "value": layout
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
            QA_POPUP.find('.quiz-amocrm__states').css("position", "absolute");
            QA_POPUP.find('.quiz-amocrm__states').css("height", "100%");
            QA_POPUP.find(".quiz-amocrm__nav").hide();
            handlerState(9);
          },
          success(data) {
            if (data['success']) {
              handlerState(7);
              QA_POPUP.find(".quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              handlerState(8);
            }
          }
        })
      }

    });
  });

})(jQuery);

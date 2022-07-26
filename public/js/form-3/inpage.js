(function ($) {
  'use strict';

  $(document).ready(function () {

    // Формы
    let QA_INPAGE = $(".quiz-amocrm-inpage-3");
    let QA_INPAGE_SEND_FORM = $(".quiz-amocrm-send-form--3");
    if (QA_INPAGE.length === 0 || QA_INPAGE_SEND_FORM.length === 0) return;

    // Логика работы селекторов для выбора черновых работ
    QA_INPAGE.find(".answer-variants > .variant-select").on("click", function () {

      let currentVariants = $(this).closest(".answer-variants");
      let isToggle = $(this).closest(".answer-variants").hasClass("answer-variants--toggle");

      if (isToggle) {
        currentVariants.find(".variant-select").removeClass("variant-select--active");
      }

      $(this).toggleClass("variant-select--active");

    });

    // Валидация полей в форме отправки
    let agreement = QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form__agreement');
    QA_INPAGE_SEND_FORM.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });
    QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form__input').on("input, change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    // Предварительный расчет стоимости
    function dynamic_calc() {

      // Буфер
      let buffer = 0;

      // Расчетная стоимость черновых работ
      let rough_work = 0;

      // Общая стоимость работ
      let price = 0;

      // Площадь по полу
      let square = parseFloat(QA_INPAGE.find("input[name=floor_area]").val().trim());

      // Высота потолков
      let ceiling_height = parseFloat(QA_INPAGE.find("input[name=ceiling_height]").val().trim());

      // Штукатурные работы
      let ratio_plaster = 0; // Кооэфициент штукатурных работ
      if (QA_INPAGE.find(".answer-variants > .variant-select:nth-child(1)").hasClass("variant-select--active")) {
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
      if (QA_INPAGE.find(".answer-variants > .variant-select:nth-child(2)").hasClass("variant-select--active")) {
        buffer = square * 1000;
        rough_work += buffer;
      }

      // Трасса под сплит-систему
      let ratio_split = 0;
      if (QA_INPAGE.find(".answer-variants > .variant-select:nth-child(3)").hasClass("variant-select--active")) {

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
      if (QA_INPAGE.find(".answer-variants > .variant-select:nth-child(4)").hasClass("variant-select--active")) {
        buffer = square * 350;
        rough_work += buffer;
      }

      // Сантехнические работы
      if (QA_INPAGE.find(".answer-variants > .variant-select:nth-child(5)").hasClass("variant-select--active")) {
        buffer = 15 * 750;
        rough_work += buffer;
      }

      price += rough_work;

      // Первый санузел
      let floor_bathroom_1 = parseFloat(QA_INPAGE.find("input[name=floor_bathroom_1]").val().trim());
      floor_bathroom_1 = isNaN(floor_bathroom_1) || floor_bathroom_1 < 0 ? 0 : floor_bathroom_1;
      buffer = floor_bathroom_1 * 7 * 850 + 16000;
      price += buffer;

      // Второй санузел
      let floor_bathroom_2 = parseFloat(QA_INPAGE.find("input[name=floor_bathroom_2]").val().trim());
      floor_bathroom_2 = isNaN(floor_bathroom_2) || floor_bathroom_2 < 0 ? 0 : floor_bathroom_2;
      if (floor_bathroom_1 !== 0) {
        if (floor_bathroom_2 !== 0) {
          buffer = floor_bathroom_2 * 7 * 850 + 3000;
          price += buffer;
        }
        QA_INPAGE.find("input[name=floor_bathroom_2]").removeAttr("disabled");
      } else {
        QA_INPAGE.find("input[name=floor_bathroom_2]").attr("disabled", "disabled");
      }

      // Комнаты (Стены + Пол)
      let square_without_bathroom = square - floor_bathroom_1 - floor_bathroom_2;
      buffer = square_without_bathroom * ceiling_height * ratio_plaster * 550;
      price += buffer;

      // Комнаты (Потолок)
      buffer = square * 700;
      price += buffer;

      // Комнаты (Двери)
      let layout = QA_INPAGE.find("select[name=layout]").val();
      let price_doors = layout * 3000;
      price += price_doors;

      let f = new Intl.NumberFormat("ru", {style: "decimal"});

      let rough_calculation = QA_INPAGE.find(".quiz-amocrm-inpage__prices[data-type=rough]");
      let general_calculation = QA_INPAGE.find(".quiz-amocrm-inpage__prices[data-type=general]");

      // Если не все необходимые данные заполнены, скрываем кнопку предварительного расчета и очищаем данные
      if (square === 0 || isNaN(square) || ceiling_height === 0 || isNaN(ceiling_height) || QA_INPAGE.find(".answer-variants > .variant-select--active").length === 0) {
        rough_calculation.find(".quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(0);
        rough_calculation.find(".quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(0);
        return;
      } else {
        if (floor_bathroom_1 === 0) {
          general_calculation.find(".quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(0);
          general_calculation.find(".quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(0);
          QA_INPAGE.find(".quiz-amocrm-inpage__btn-submit").hide();
        } else {
          QA_INPAGE.find(".quiz-amocrm-inpage__btn-submit").show();
          general_calculation.find(".quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(f.format(Math.round(price)));
          general_calculation.find(".quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(f.format(Math.round(price / square)));
        }
      }

      // Если все необходимые данные заполнены, показываем кнопку предварительного расчета и заполняем данные
      rough_calculation.find(".quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(f.format(Math.round(rough_work)));
      rough_calculation.find(".quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(f.format(Math.round(rough_work / square)));
    }

    // Установка обработчиков для динамического расчета
    QA_INPAGE.find('.variant-select').on('click', dynamic_calc);
    QA_INPAGE.find("input").on("input", dynamic_calc);
    QA_INPAGE.find("select").on("change", dynamic_calc);

    // Открываем popup с формой для отправки данных
    QA_INPAGE.find('.quiz-amocrm-inpage__btn-submit').on('click', function () {

      // Если кнопка отключена
      if ($(this).hasClass("quiz-amocrm-inpage__btn-submit--disable")) return;

      // Клик по скрытой кнопке для открытия попапа
      $('#quiz-amocrm-inpage-3__send').click();

      // Фикс попапа
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 10)
    });

    let sending_in_page = false;

    // Обработка и отправка данных в CRM
    QA_INPAGE.find(".quiz-amocrm-form__btn-submit[data-type=submit-inpage]").on("click", function () {

      let firstname_field = QA_INPAGE_SEND_FORM.find("input[name=firstname]");
      let firstname = firstname_field.val().trim();

      let phone_field = QA_INPAGE_SEND_FORM.find("input[name=phone]");
      let phone = phone_field.val().trim();

      let err = 0;

      if (firstname === "") {
        firstname_field.closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }
      if (phone === "") {
        phone_field.closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }

      if (!QA_INPAGE_SEND_FORM.find(".quiz-amocrm-form__agreement--inpage").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending_in_page) {
        sending_in_page = true;

        // Собираем данные из квиза
        let works = [];
        QA_INPAGE.find(".variant-select--active").each((index, item) => {
          works.push($(item).find(".variant-select__text").html());
        });

        let celling_height = [];
        celling_height.push(QA_INPAGE.find("input[name=ceiling_height]").val().trim());

        let floor_area = [];
        floor_area.push(QA_INPAGE.find("input[name=floor_area]").val().trim());

        let bathroom_1 = [];
        bathroom_1.push(QA_INPAGE.find("input[name=floor_bathroom_1]").val().trim());

        let bathroom_2 = [];
        bathroom_2.push(QA_INPAGE.find("input[name=floor_bathroom_2]").val().trim());

        let layout = [];
        layout.push(QA_INPAGE.find("select[name=layout] option:selected").text());

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
            QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form-inpage-states').show();
            QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form-inpage-state--loader').addClass("quiz-amocrm-form-inpage-state--active");
          },
          success(data) {
            QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form-inpage-state--loader').removeClass("quiz-amocrm-form-inpage-state--active");

            if (data['success']) {
              QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form-inpage-state--success').addClass("quiz-amocrm-form-inpage-state--active");
              QA_INPAGE_SEND_FORM.find(".quiz-amocrm-form-inpage-state--success .quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              QA_INPAGE_SEND_FORM.find('.quiz-amocrm-form-inpage-state--error').addClass("quiz-amocrm-form-inpage-state--active");
            }

            setTimeout(() => {
              $(".w-popup-closer").click();
            }, 5000)
          }
        })
      }
    });

  });

})(jQuery);

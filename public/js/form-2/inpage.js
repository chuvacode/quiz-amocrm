(function( $ ) {
  'use strict';

  $(document).ready(function () {

    // Формы
    let QA_INPAGE_EXTENDED = $(".quiz-amocrm-inpage--extended");
    let QA_INPAGE_SEND_FORM_EXTENDED = $(".quiz-amocrm-send-form--extended");
    if (QA_INPAGE_EXTENDED.length === 0 || QA_INPAGE_SEND_FORM_EXTENDED.length === 0) return;

    // Логика работы селекторов для выбора черновых работ
    QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select").on("click", function () {

      let currentVariants = $(this).closest(".answer-variants");
      let isToggle = $(this).closest(".answer-variants").hasClass("answer-variants--toggle");

      if (isToggle) {
        currentVariants.find(".variant-select").removeClass("variant-select--active");
      }

      $(this).toggleClass("variant-select--active");

    });

    // Валидация полей в форме отправки
    let agreement = QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form__agreement');
    QA_INPAGE_SEND_FORM_EXTENDED.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });
    QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form__input').on("input, change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    // Предварительный расчет стоимости
    function dynamic_calc() {
      let price = 0;
      let m2 = parseFloat(QA_INPAGE_EXTENDED.find("input[name=floor_area]").val().trim());
      let m = parseFloat(QA_INPAGE_EXTENDED.find("input[name=ceiling_height]").val().trim());

      // Штукатурные работы
      if (QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select:nth-child(1)").hasClass("variant-select--active")) {

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
      if (QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select:nth-child(2)").hasClass("variant-select--active")) {
        price += m2 * 1700;
      }

      // Трасса под сплит-систему
      if (QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select:nth-child(3)").hasClass("variant-select--active")) {
        price += 8000;
      }

      // Стяжка пола
      if (QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select:nth-child(4)").hasClass("variant-select--active")) {
        price += m2 * 310;
      }

      // Сантехнические работы
      if (QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select:nth-child(5)").hasClass("variant-select--active")) {
        price += 15 * 735;
      }
      let f = new Intl.NumberFormat("ru", {style: "decimal"});

      // Если не все необходимые данные заполнены, скрываем кнопку предварительного расчета и очищаем данные
      if (m2 === 0 || isNaN(m2) || m === 0 || isNaN(m) || QA_INPAGE_EXTENDED.find(".answer-variants > .variant-select--active").length === 0) {
        QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(0);
        QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(0);
        QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__btn-submit").hide();
        return;
      }

      // Если все необходимые данные заполнены, показываем кнопку предварительного расчета и заполняем данные
      QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__btn-submit").show();
      QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(f.format(Math.round(price)));
      QA_INPAGE_EXTENDED.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(f.format(Math.round(price / m2)));
    }

    // Установка обработчиков для динамического расчета
    QA_INPAGE_EXTENDED.find('.variant-select').on('click', dynamic_calc);
    QA_INPAGE_EXTENDED.find("input[name=ceiling_height]").on("input", dynamic_calc);
    QA_INPAGE_EXTENDED.find("input[name=floor_area]").on("input", dynamic_calc);

    // Открываем popup с формой для отправки данных
    QA_INPAGE_EXTENDED.find('.quiz-amocrm-inpage__btn-submit').on('click', function () {

      // Если кнопка отключена
      if ($(this).hasClass("quiz-amocrm-inpage__btn-submit--disable")) return;

      // Клик по скрытой кнопке для открытия попапа
      $('#quiz-amocrm-inpage-extended__send').click();

      // Фикс попапа
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 10)
    });

    let sending_in_page = false;

    // Обработка и отправка данных в CRM
    QA_INPAGE_EXTENDED.find(".quiz-amocrm-form__btn-submit[data-type=submit-inpage]").on("click", function () {

      let firstname = $("#qa-f-firstname-inpage-extended").val().trim();
      let phone = $("#qa-f-phone-inpage-extended").val().trim();

      let err = 0;

      if (firstname === "") {
        $("#qa-f-firstname-inpage-extended").closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }
      if (phone === "") {
        $("#qa-f-phone-inpage-extended").closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }

      if (!QA_INPAGE_SEND_FORM_EXTENDED.find(".quiz-amocrm-form__agreement--inpage").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending_in_page) {
        sending_in_page = true;

        // Собираем данные из квиза
        let state1 = [];
        QA_INPAGE_EXTENDED.find(".variant-select--active").each((index, item) => {
          state1.push($(item).find(".variant-select__text").html());
        });

        let state2 = [];
        state2.push(QA_INPAGE_EXTENDED.find("input[name=ceiling_height]").val().trim());

        let state3 = [];
        state3.push(QA_INPAGE_EXTENDED.find("input[name=floor_area]").val().trim());

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
            QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form-inpage-states').show();
            QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form-inpage-state--loader').addClass("quiz-amocrm-form-inpage-state--active");
          },
          success(data) {
            QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form-inpage-state--loader').removeClass("quiz-amocrm-form-inpage-state--active");

            if (data['success']) {
              QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form-inpage-state--success').addClass("quiz-amocrm-form-inpage-state--active");
              QA_INPAGE_SEND_FORM_EXTENDED.find(".quiz-amocrm-form-inpage-state--success .quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              QA_INPAGE_SEND_FORM_EXTENDED.find('.quiz-amocrm-form-inpage-state--error').addClass("quiz-amocrm-form-inpage-state--active");
            }

            setTimeout(() => {
              $(".w-popup-closer").click();
            }, 5000)
          }
        })
      }
    });

  });

})( jQuery );

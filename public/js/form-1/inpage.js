(function( $ ) {
  'use strict';

  $(document).ready(function () {

    // Формы
    let QA_INPAGE_PRIMARY = $(".quiz-amocrm-inpage--primary");
    let QA_INPAGE_SEND_FORM_PRIMARY = $(".quiz-amocrm-send-form--primary");
    if (QA_INPAGE_PRIMARY.length === 0 || QA_INPAGE_SEND_FORM_PRIMARY.length === 0) return;

    // Логика работы селекторов для выбора черновых работ
    QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select").on("click", function () {

      let currentVariants = $(this).closest(".answer-variants");
      let isToggle = $(this).closest(".answer-variants").hasClass("answer-variants--toggle");

      if (isToggle) {
        currentVariants.find(".variant-select").removeClass("variant-select--active");
      }

      $(this).toggleClass("variant-select--active");

    });

    // Валидация полей в форме отправки
    let agreement = QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form__agreement');
    QA_INPAGE_SEND_FORM_PRIMARY.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });
    QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form__input').on("input, change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    // Предварительный расчет стоимости
    function dynamic_calc() {
      let price = 0;
      let m3 = parseFloat(QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__m3").val().trim());

      // Штукатурные работы
      if (QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select:nth-child(1)").hasClass("variant-select--active")) {
        price += m3 * 3.5 * 250;
      }

      // Электромонтажные работы
      if (QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select:nth-child(2)").hasClass("variant-select--active")) {
        price += m3 * 1700;
      }

      // Трасса под сплит-систему
      if (QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select:nth-child(3)").hasClass("variant-select--active")) {
        price += 8000;
      }

      // Стяжка пола
      if (QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select:nth-child(4)").hasClass("variant-select--active")) {
        price += m3 * 310;
      }

      // Сантехнические работы
      if (QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select:nth-child(5)").hasClass("variant-select--active")) {
        price += 15 * 735;
      }

      // Нужен ли ремонт санузла "под ключ"?
      if (QA_INPAGE_PRIMARY.find(".key-bashroom").is(":checked")) {
        price += 3.5 * 9375;
      }

      // Нужен ли ремонт комнат "под ключ"?
      if (QA_INPAGE_PRIMARY.find(".key-apartament").is(":checked")) {
        price += m3 * 1750;
      }

      let f = new Intl.NumberFormat("ru", {style: "decimal"});

      // Если не все необходимые данные заполнены, скрываем кнопку предварительного расчета и очищаем данные
      if (m3 === 0 || isNaN(m3) ||QA_INPAGE_PRIMARY.find(".answer-variants > .variant-select--active").length === 0) {
        QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(0);
        QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(0);
        QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__btn-submit").hide();
        return;
      }

      // Если все необходимые данные заполнены, показываем кнопку предварительного расчета и заполняем данные
      $(".quiz-amocrm-inpage__btn-submit").show();
      $(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(1) span:nth-child(1)").html(f.format(Math.round(price)));
      $(".quiz-amocrm-inpage__prices .quiz-amocrm-form__price:nth-child(2) span:nth-child(1)").html(f.format(Math.round(price / m3)));
    }

    // Установка обработчиков для динамического расчета
    QA_INPAGE_PRIMARY.find('.variant-select').on('click', dynamic_calc);
    QA_INPAGE_PRIMARY.find("input[name=key-bashroom]").on("change", dynamic_calc);
    QA_INPAGE_PRIMARY.find("input[name=key-apartament]").on("change", dynamic_calc);
    QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__m3").on('input', dynamic_calc);

    // Открываем popup с формой для отправки данных
    QA_INPAGE_PRIMARY.find('.quiz-amocrm-inpage__btn-submit').on('click', function () {

      // Если кнопка отключена
      if ($(this).hasClass("quiz-amocrm-inpage__btn-submit--disable")) return;

      // Клик по скрытой кнопке для открытия попапа
      $('#quiz-amocrm-inpage__send').click();

      // Фикс попапа
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 10)
    });

    let sending_in_page = false;

    // Обработка и отправка данных в CRM
    QA_INPAGE_PRIMARY.find(".quiz-amocrm-form__btn-submit[data-type=submit-inpage]").on("click", function () {
      let firstname = $("#qa-f-firstname-inpage").val().trim();
      let phone = $("#qa-f-phone-inpage").val().trim();

      let err = 0;

      if (firstname === "") {
        $("#qa-f-firstname-inpage").closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }
      if (phone === "") {
        $("#qa-f-phone-inpage").closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
        err++;
      }

      if (!QA_INPAGE_SEND_FORM_PRIMARY.find(".quiz-amocrm-form__agreement--inpage").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending_in_page) {
        sending_in_page = true;

        // Собираем данные из квиза
        let state1 = [];
        QA_INPAGE_PRIMARY.find(".variant-select--active").each((index, item) => {
          state1.push($(item).find(".variant-select__text").html());
        });

        let state2 = [];
        state2.push(QA_INPAGE_PRIMARY.find(".key-bashroom").is(":checked") ? "Да" : "Нет");

        let state3 = [];
        state3.push(QA_INPAGE_PRIMARY.find(".key-apartament").is(":checked") ? "Да" : "Нет");

        let state4 = [];
        state4.push(QA_INPAGE_PRIMARY.find(".quiz-amocrm-inpage__m3").val().trim());

        let data = {
          "quiz": [
            {
              "title":"Выберите виды работ, которые необходимы:",
              "value": state1
            },
            {
              "title":"Нужен ли ремонт санузла «под ключ»?:",
              "value": state2
            },
            {
              "title":"Нужен ли ремонт комнат «под ключ»?:",
              "value":state3
            },
            {
              "title":"Укажите площадь по полу Вашего объекта, м2:",
              "value": state4
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
            QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form-inpage-states').show();
            QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form-inpage-state--loader').addClass("quiz-amocrm-form-inpage-state--active");
          },
          success(data) {
            QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form-inpage-state--loader').removeClass("quiz-amocrm-form-inpage-state--active");

            if (data['success']) {
              QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form-inpage-state--success').addClass("quiz-amocrm-form-inpage-state--active");
              QA_INPAGE_SEND_FORM_PRIMARY.find(".quiz-amocrm-form-inpage-state--success .quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              QA_INPAGE_SEND_FORM_PRIMARY.find('.quiz-amocrm-form-inpage-state--error').addClass("quiz-amocrm-form-inpage-state--active");
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

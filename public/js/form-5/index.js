(function ($) {
  'use strict';

  $(document).ready(function () {

    // Формы
    let QA_FORM = $(".quiz-amocrm-callback");
    let QA_CONTACT_FORM = $(".quiz-amocrm-send-form--callback");

    if (QA_FORM.length === 0 || QA_CONTACT_FORM.length === 0) return;

    // Валидация полей в форме отправки
    let agreement = QA_CONTACT_FORM.find('.quiz-amocrm-form__agreement');
    QA_CONTACT_FORM.find(".quiz-amocrm-form__agreement-checkbox").on("click", function () {
      agreement.toggleClass("quiz-amocrm-form__agreement--active");
    });
    QA_CONTACT_FORM.find('.quiz-amocrm-form__input').on("input, change", function () {
      if ($(this).val().trim() === "") {
        $(this).closest(".quiz-amocrm-form__field").addClass("quiz-amocrm-form__field--invalid");
      } else {
        $(this).closest(".quiz-amocrm-form__field").removeClass("quiz-amocrm-form__field--invalid");
      }
    });

    // Открываем popup с формой для отправки данных
    $('.quiz-amocrm-btn-callback').on('click', function () {

      // Клик по скрытой кнопке для открытия попапа
      $('#quiz-amocrm-callback__send').click();

      // Фикс попапа
      setTimeout(function () {
        $('.w-popup-wrap').css("top", "0");
        $('.w-popup-wrap').removeClass("pos_absolute");
        $('.w-popup-wrap').addClass("pos_fixed");
      }, 100);

    });

    let sending_in_page = false;

    // Обработка и отправка данных в CRM
    QA_FORM.find(".quiz-amocrm-form__btn-submit[data-type=submit-inpage]").on("click", function () {

      let firstname_field = QA_CONTACT_FORM.find("input[name=firstname]");
      let firstname = firstname_field.val().trim();

      let phone_field = QA_CONTACT_FORM.find("input[name=phone]");
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

      if (!QA_CONTACT_FORM.find(".quiz-amocrm-form__agreement--inpage").hasClass("quiz-amocrm-form__agreement--active")) {
        err++
      }

      if (err === 0 && !sending_in_page) {
        sending_in_page = true;

        let data = {
          "us_form_1_text_1": firstname,
          "us_form_1_text_2": phone,
          "action": "handler_form_feedback",
          "handler-amocrm": "true",
          "_nonce": window.wp_ajax["_nonce"]
        };

        $.ajax({
          url: window.wp_ajax["ajax_url"],
          method: "post",
          data: data,
          beforeSend() {
            QA_CONTACT_FORM.find('.quiz-amocrm-form-inpage-states').show();
            QA_CONTACT_FORM.find('.quiz-amocrm-form-inpage-state--loader').addClass("quiz-amocrm-form-inpage-state--active");
          },
          success(data) {
            QA_CONTACT_FORM.find('.quiz-amocrm-form-inpage-state--loader').removeClass("quiz-amocrm-form-inpage-state--active");

            if (data['success']) {
              QA_CONTACT_FORM.find('.quiz-amocrm-form-inpage-state--success').addClass("quiz-amocrm-form-inpage-state--active");
              QA_CONTACT_FORM.find(".quiz-amocrm-form-inpage-state--success .quiz-amocrm__state-message span:nth-child(1)").html("Спасибо " + firstname + "!");
            } else {
              QA_CONTACT_FORM.find('.quiz-amocrm-form-inpage-state--error').addClass("quiz-amocrm-form-inpage-state--active");
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

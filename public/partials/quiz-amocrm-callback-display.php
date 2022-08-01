<div class="quiz-amocrm-inpage quiz-amocrm-callback">
  <div id="quiz-amocrm-callback__send" style="display:none;"></div>
    [us_popup show_on="selector" trigger_selector="#quiz-amocrm-callback__send"]

    <div class="quiz-amocrm-send-form--callback">

        <div class="quiz-amocrm__title">
          С ответом на заявку отправим Вам инструкцию<br> «Советы при подготовке к ремонту»
        </div>

        <form class="quiz-amocrm-form">
            <div class="quiz-amocrm-form__field">
                <label class="quiz-amocrm-form__label" for="qa-f-firstname-inpage-3">Введите имя</label><input
                    class="quiz-amocrm-form__input" id="qa-f-firstname-inpage-3" type="text" name="firstname">
            </div>
            <div class="quiz-amocrm-form__field">
                <label class="quiz-amocrm-form__label" for="qa-f-phone-inpage-3">Введите телефон</label><input
                    class="quiz-amocrm-form__input" id="qa-f-phone-inpage-3" data-type="phone" name="phone" type="text">
            </div>
            <div class="quiz-amocrm-form__btn-submit" data-type="submit-inpage">
              Перезвонить мне
            </div>
            <div class="quiz-amocrm-form__agreement quiz-amocrm-form__agreement--inpage quiz-amocrm-form__agreement--active">
                <div class="quiz-amocrm-form__agreement-checkbox"></div>
                <div class="quiz-amocrm-form__agreement-text">
                    C <a href="#">политикой конфиденциальности</a> ознакомлен(а)
                </div>
            </div>
        </form>

        <div class="quiz-amocrm-form-inpage-states">
            <div class="quiz-amocrm-form-inpage-state quiz-amocrm-form-inpage-state--loader">
                <div class="loader-form">
                    <div class="loader-form__icon"></div>
                    <span class="loader-form__text">Идет отправка...</span>
                </div>
            </div>
            <div class="quiz-amocrm-form-inpage-state quiz-amocrm-form-inpage-state--error">
                <div class="quiz-amocrm__state-message">
                    <span>Что-то пошло не так.</span>
                    <span>Попробуйте повторить попытку позже.</span>
                </div>
            </div>
            <div class="quiz-amocrm-form-inpage-state quiz-amocrm-form-inpage-state--success">
                <div class="quiz-amocrm__state-message">
                    <span>Спасибо!</span>
                    <span>Мы свяжемся с Вами в ближайшее время</span>
                </div>
            </div>
        </div>
    </div>

    [/us_popup]
</div>

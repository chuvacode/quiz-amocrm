<div class="quiz-amocrm quiz-amocrm--primary">
  <div class="quiz-amocrm__container">
    <div class="quiz-amocrm__states">
      <div class="quiz-amocrm__state quiz-amocrm__state--active" data-state="1">
        <div class="quiz-amocrm__title">Какие черновые работы нужно выполнить?</div>
        <div class="quiz-amocrm__tag">
          <svg viewBox="0 0 24 24" class="mdi-icon mdi-16px"><title>mdi-check-circle</title><path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" stroke-width="0" fill-rule="nonzero"></path></svg>
          <span>выберите один или несколько</span>
        </div>
        <div class="quiz-amocrm__answer-variants answer-variants">
          <div class="variant-select answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Штукатурные работы</div>
          </div>
          <div class="variant-select  answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Электромонтажные работы</div>
          </div>
          <div class="variant-select answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Трасса под сплит-систему</div>
          </div>
          <div class="variant-select answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Стяжка пола</div>
          </div>
          <div class="variant-select answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Сантехнические работы</div>
          </div>
          <div class="variant-select answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Перегородки демонтаж/монтаж</div>
          </div>
        </div>
      </div>
      <div class="quiz-amocrm__state" data-state="2">
        <div class="quiz-amocrm__title">Какие чистовые работы нужно выполнить?</div>

        <div class="quiz-amocrm__subtitle">Нужен ли ремонт санузла "под ключ"?</div>
        <div class="quiz-amocrm__answer-variants answer-variants answer-variants--toggle">
          <div class="variant-select answer-variants__variant-select variant-select--active">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Да</div>
          </div>
          <div class="variant-select  answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Нет</div>
          </div>
        </div>

        <div class="quiz-amocrm__subtitle">Нужен ли ремонт комнат "под ключ"?</div>
        <div class="quiz-amocrm__answer-variants answer-variants answer-variants--toggle">
          <div class="variant-select answer-variants__variant-select variant-select--active">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Да</div>
          </div>
          <div class="variant-select  answer-variants__variant-select">
            <div class="variant-select__checkbox"></div>
            <div class="variant-select__text">Нет</div>
          </div>
        </div>
      </div>
      <div class="quiz-amocrm__state" data-state="3">
        <div class="quiz-amocrm__title">Укажите площадь по полу Вашего объекта, м2</div>
        <input class="quiz-amocrm__input" type="number" min="1" value="">


        <form class="quiz-amocrm-form quiz-amocrm__preprice" style="max-width: 600px;">
          <div class="quiz-amocrm__title quiz-amocrm__preprice-title">
            Предварительный расчет стоимости работ:
          </div>
          <div class="quiz-amocrm-form__price">
            <span>0</span>
            <span>Руб.</span>
          </div>
          <div class="quiz-amocrm-form__price">
            <span>0</span>
            <span>Руб. / м2</span>
          </div>

          <div class="quiz-amocrm-form__btn-submit" data-type="pre-submit" style="display:none;">
            Оставить заявку для расчета полной стоимости
                      <br>
                      (РАБОТА + МАТЕРИАЛ)
          </div>
        </form>
      </div>
      <div class="quiz-amocrm__state" data-state="4">
        <div class="quiz-amocrm__title">
          Вместе с расчетом отправим Вам инструкцию «Советы при подготовке к ремонту»
        </div>

        <form class="quiz-amocrm-form">
          <div class="quiz-amocrm-form__field">
            <label class="quiz-amocrm-form__label" for="qa-f-firstname">Введите имя</label>
            <input class="quiz-amocrm-form__input" id="qa-f-firstname" type="text">
          </div>
          <div class="quiz-amocrm-form__field">
            <label class="quiz-amocrm-form__label" for="qa-f-phone">Введите телефон</label>
            <input class="quiz-amocrm-form__input" id="qa-f-phone" type="text" data-type="phone">
          </div>
          <div class="quiz-amocrm-form__btn-submit" data-type="submit">
            Отправить
          </div>
          <div class="quiz-amocrm-form__agreement quiz-amocrm-form__agreement--active">
            <div class="quiz-amocrm-form__agreement-checkbox"></div>
            <div class="quiz-amocrm-form__agreement-text">
              C <a href="#">политикой конфиденциальности</a> ознакомлен(а)
            </div>
          </div>
        </form>

      </div>
      <div class="quiz-amocrm__state quiz-amocrm__state--final" data-state="7">
        <div class="quiz-amocrm__state-message">
          <span>Спасибо!</span>
          <span>Мы свяжемся с Вами в ближайшее время</span>
        </div>
      </div>
      <div class="quiz-amocrm__state quiz-amocrm__state--final" data-state="8">
        <div class="quiz-amocrm__state-message">
          <span>Что-то пошло не так.</span>
          <span>Попробуйте повторить попытку позже.</span>
        </div>
      </div>
      <div class="quiz-amocrm__state quiz-amocrm__state--final" data-state="9">
        <div class="loader-form">
          <div class="loader-form__icon"></div>
          <span class="loader-form__text">Идет отправка...</span>
        </div>
      </div>
    </div>
    <div class="quiz-amocrm__nav">
      <div class="progress-bar quiz-amocrm__progress-bar">
        <div class="progress-bar__field">
          <span style="width: 0%;"></span>
          <div class="progress-bar__percent" style="left: 0%;">
            <span class="progress-bar__percent-text">0%</span>
            <span class="progress-bar__percent-dot"></span>
          </div>
        </div>
      </div>
      <div class="quiz-amocrm__nav-btns">
        <div class="quiz-amocrm__back quiz-amocrm__btn quiz-amocrm__btn--disabled">
          <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" stroke-width="0" fill-rule="nonzero"></path></svg>
          <span>Назад</span>
        </div>
        <div class="quiz-amocrm__next quiz-amocrm__btn quiz-amocrm__btn--disabled">
          <span>Далее</span>
          <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" stroke-width="0" fill-rule="nonzero"></path></svg>
        </div>
      </div>
    </div>
  </div>
</div>
